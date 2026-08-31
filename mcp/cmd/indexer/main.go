// Command indexer compiles the catalogue into one SQLite snapshot.
package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
)

const embedBatch = 32

// envOr lets the environment set every default while the flags stay as local
// dev overrides. The pipeline resolves EMBED_PROVIDER once and feeds the same
// value to this indexer and to the server it ships with, so the model stamp
// in the snapshot and the server's configuration cannot diverge.
func envOr(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}

func main() {
	catDir := flag.String("catalogue", envOr("CATALOGUE_DIR", "../catalogue"), "catalogue directory")
	out := flag.String("out", envOr("DB_PATH", "catalogue.db"), "output database path")
	provider := flag.String("embed-provider", envOr("EMBED_PROVIDER", ""), "embedding provider: bedrock, ollama or none")
	model := flag.String("embed-model", envOr("EMBED_MODEL", ""), "embedding model id; empty takes the provider default")
	ollamaURL := flag.String("ollama", envOr("OLLAMA_URL", ""), "Ollama base URL, for -embed-provider ollama")
	region := flag.String("aws-region", envOr("AWS_REGION", ""), "AWS region, for -embed-provider bedrock")
	flag.Parse()
	emb, err := embed.New(context.Background(), embed.Config{
		Provider:  *provider,
		Model:     *model,
		OllamaURL: *ollamaURL,
		Region:    *region,
	})
	if err != nil {
		log.Fatal(err)
	}
	if err := run(*catDir, *out, emb); err != nil {
		log.Fatal(err)
	}
}

func run(catDir, outPath string, emb embed.Embedder) error {
	var atoms []catalogue.Atom
	var ops []catalogue.Operation
	var specErrors []catalogue.SpecErrorCode
	hashes := map[string]string{}

	err := filepath.WalkDir(catDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			// .raw holds untouched upstream files; they are sources, not content.
			if d.Name() == ".raw" {
				return filepath.SkipDir
			}
			return nil
		}
		rel, _ := filepath.Rel(catDir, path)
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		relSlash := filepath.ToSlash(rel)
		switch {
		case strings.HasSuffix(path, ".md") && (relSlash == "openapi" || strings.HasPrefix(relSlash, "openapi/")):
			// Spec-area documentation (e.g. openapi/CONVENTIONS.md) is not an atom
			// and is not hashed; skip it silently.
			return nil
		case strings.HasSuffix(path, string(os.PathSeparator)+"README.md") || relSlash == "README.md":
			// READMEs are contributor notes for the folder they sit in, not
			// atoms; skip them silently wherever they are.
			return nil
		case strings.HasSuffix(path, ".md"):
			a, err := catalogue.ParseAtom(rel, content)
			if err != nil {
				return err
			}
			atoms = append(atoms, a)
		case strings.HasPrefix(rel, "openapi"+string(os.PathSeparator)) &&
			strings.HasSuffix(path, ".yaml") &&
			!strings.Contains(rel, "corrections") &&
			!strings.Contains(path, "asyncapi"):
			parsed, err := catalogue.ParseSpec(path)
			if err != nil {
				return err
			}
			ops = append(ops, parsed.Operations...)
			specErrors = append(specErrors, parsed.ErrorCodes...)
			sum := sha256.Sum256(content)
			hashes[filepath.ToSlash(rel)] = hex.EncodeToString(sum[:])
		}
		return nil
	})
	if err != nil {
		return err
	}

	if err := applyDocRoutes(catDir, atoms); err != nil {
		return err
	}

	var chunks []index.EmbeddedChunk
	meta := index.Meta{SourceHashes: hashes,
		BuiltAt: time.Now().UTC().Format(time.RFC3339)}
	if emb != nil {
		var all []catalogue.Chunk
		for _, a := range atoms {
			all = append(all, catalogue.ChunkAtom(a)...)
		}
		for start := 0; start < len(all); start += embedBatch {
			end := min(start+embedBatch, len(all))
			var texts []string
			for _, c := range all[start:end] {
				texts = append(texts, c.Text)
			}
			vecs, err := emb.Embed(context.Background(), texts)
			if err != nil {
				return fmt.Errorf("embed batch at %d: %w", start, err)
			}
			for i, c := range all[start:end] {
				chunks = append(chunks, index.EmbeddedChunk{Chunk: c, Vector: vecs[i]})
				meta.EmbeddingDim = len(vecs[i])
			}
		}
		meta.EmbeddingModel = emb.Model()
	}

	versionBytes, err := os.ReadFile(filepath.Join(catDir, "VERSION"))
	if err != nil {
		return fmt.Errorf("read VERSION: %w", err)
	}
	meta.CatalogueVersion = strings.TrimSpace(string(versionBytes))
	if err := index.Build(outPath, atoms, ops, specErrors, chunks, meta); err != nil {
		return err
	}
	mode := "keyword-only"
	if emb != nil {
		mode = fmt.Sprintf("embeddings via %s", emb.Model())
	}
	fmt.Printf("indexed %d atoms, %d operations, %d spec error codes, %d chunks (%s) -> %s (catalogue %s)\n",
		len(atoms), len(ops), len(specErrors), len(chunks), mode, outPath, meta.CatalogueVersion)
	return nil
}

// atomRoutes is catalogue/atom-routes.json, generated by
// scripts/build-atom-routes.mjs from what the docs site actually publishes.
type atomRoutes struct {
	ValidatedAgainstBuild bool `json:"validatedAgainstBuild"`
	Routes                []struct {
		Atom   string `json:"atom"`
		Route  string `json:"route"`
		Anchor string `json:"anchor"`
	} `json:"routes"`
}

// applyDocRoutes fills DocURL and DocAnchor on each atom from the generated
// route map. An atom never carries its own route: it is authored before the
// site is built and is not published one to one as a page, so any route in an
// atom would be a guess. A missing file is not fatal, because the index is
// still useful for search; it means no atom can be cited to a reader, which
// callers detect by an empty DocURL rather than by a link to nowhere.
func applyDocRoutes(catDir string, atoms []catalogue.Atom) error {
	path := filepath.Join(catDir, "atom-routes.json")
	content, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		fmt.Printf("warning: %s not found, atoms will carry no page links. Run: node scripts/build-atom-routes.mjs\n", path)
		return nil
	}
	if err != nil {
		return err
	}
	var routes atomRoutes
	if err := json.Unmarshal(content, &routes); err != nil {
		return fmt.Errorf("%s: %w", path, err)
	}
	byID := make(map[string]int, len(routes.Routes))
	for i, r := range routes.Routes {
		byID[r.Atom] = i
	}
	var linked int
	for i := range atoms {
		j, ok := byID[atoms[i].ID]
		if !ok || routes.Routes[j].Route == "" {
			continue
		}
		atoms[i].DocURL = routes.Routes[j].Route
		atoms[i].DocAnchor = routes.Routes[j].Anchor
		linked++
	}
	note := "NOT validated against a site build"
	if routes.ValidatedAgainstBuild {
		note = "validated against a site build"
	}
	fmt.Printf("linked %d/%d atoms to a docs page (%s)\n", linked, len(atoms), note)
	return nil
}
