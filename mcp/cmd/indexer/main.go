// Command indexer compiles the catalogue into one SQLite snapshot.
package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
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

func main() {
	catDir := flag.String("catalogue", "../catalogue", "catalogue directory")
	out := flag.String("out", "catalogue.db", "output database path")
	ollamaURL := flag.String("ollama", "", "Ollama base URL; empty builds keyword-only")
	model := flag.String("embed-model", "nomic-embed-text", "embedding model name")
	flag.Parse()
	var emb embed.Embedder
	if *ollamaURL != "" {
		emb = embed.NewOllama(*ollamaURL, *model)
	}
	if err := run(*catDir, *out, emb); err != nil {
		log.Fatal(err)
	}
}

func run(catDir, outPath string, emb embed.Embedder) error {
	var atoms []catalogue.Atom
	var ops []catalogue.Operation
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
		case strings.HasSuffix(path, ".md") && relSlash == "README.md":
			// Root catalogue documentation is not an atom; skip it silently.
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
			parsed, err := catalogue.ParseOperations(path)
			if err != nil {
				return err
			}
			ops = append(ops, parsed...)
			sum := sha256.Sum256(content)
			hashes[filepath.ToSlash(rel)] = hex.EncodeToString(sum[:])
		}
		return nil
	})
	if err != nil {
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
	if err := index.Build(outPath, atoms, ops, chunks, meta); err != nil {
		return err
	}
	mode := "keyword-only"
	if emb != nil {
		mode = fmt.Sprintf("embeddings via %s", emb.Model())
	}
	fmt.Printf("indexed %d atoms, %d operations, %d chunks (%s) -> %s (catalogue %s)\n",
		len(atoms), len(ops), len(chunks), mode, outPath, meta.CatalogueVersion)
	return nil
}
