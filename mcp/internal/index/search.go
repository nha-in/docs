package index

import (
	"context"
	"fmt"
	"log/slog"
	"sort"
	"strings"

	"github.com/nha-in/docs/mcp/internal/embed"
)

type SearchHit struct {
	ID, Type, Milestone, Title, Summary, VerificationStatus, Snippet string
}

const rrfK = 60.0

func ftsQuote(q string) string {
	var parts []string
	for _, f := range strings.Fields(q) {
		parts = append(parts, `"`+strings.ReplaceAll(f, `"`, ``)+`"`)
	}
	return strings.Join(parts, " ")
}

func (r *Reader) ftsSearch(query, atomType, milestone string, limit int) ([]SearchHit, error) {
	if ftsQuote(query) == "" {
		// A query that reduces to nothing after quoting (empty or
		// whitespace-only) has no valid FTS5 MATCH expression. Treat it
		// as zero keyword hits instead of letting an empty MATCH raise
		// a syntax error.
		return nil, nil
	}
	rows, err := r.db.Query(`
        SELECT a.id, a.type, a.milestone, a.title, a.summary, a.verification_status,
               snippet(atoms_fts, 3, '**', '**', '...', 12)
        FROM atoms_fts
        JOIN atoms a ON a.id = atoms_fts.id
        WHERE atoms_fts MATCH ?
          AND (? = '' OR a.type = ?)
          AND (? = '' OR a.milestone = ?)
        ORDER BY bm25(atoms_fts, 0.0, 5.0, 3.0, 1.0, 8.0)
        LIMIT ?`,
		ftsQuote(query), atomType, atomType, milestone, milestone, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var hits []SearchHit
	for rows.Next() {
		var h SearchHit
		if err := rows.Scan(&h.ID, &h.Type, &h.Milestone, &h.Title, &h.Summary,
			&h.VerificationStatus, &h.Snippet); err != nil {
			return nil, err
		}
		hits = append(hits, h)
	}
	return hits, rows.Err()
}

func (r *Reader) vectorSearch(ctx context.Context, query, atomType, milestone string,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	qv, err := emb.Embed(ctx, []string{query})
	if err != nil {
		return nil, fmt.Errorf("embed query: %w", err)
	}
	rows, err := r.db.Query(`
        SELECT c.atom_id, c.text, c.embedding,
               a.type, a.milestone, a.title, a.summary, a.verification_status
        FROM chunks c JOIN atoms a ON a.id = c.atom_id
        WHERE c.embedding IS NOT NULL
          AND (? = '' OR a.type = ?)
          AND (? = '' OR a.milestone = ?)`,
		atomType, atomType, milestone, milestone)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	type scored struct {
		hit   SearchHit
		score float32
	}
	best := map[string]scored{}
	for rows.Next() {
		var atomID, text string
		var blob []byte
		var h SearchHit
		if err := rows.Scan(&atomID, &text, &blob, &h.Type, &h.Milestone,
			&h.Title, &h.Summary, &h.VerificationStatus); err != nil {
			return nil, err
		}
		h.ID = atomID
		if len(text) > 200 {
			text = text[:200] + "..."
		}
		h.Snippet = text
		s := embed.Cosine(qv[0], blobToVec(blob))
		if prev, ok := best[atomID]; !ok || s > prev.score {
			best[atomID] = scored{hit: h, score: s}
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	var all []scored
	for _, s := range best {
		all = append(all, s)
	}
	sort.Slice(all, func(i, j int) bool { return all[i].score > all[j].score })
	var hits []SearchHit
	for i := 0; i < len(all) && i < limit; i++ {
		hits = append(hits, all[i].hit)
	}
	return hits, nil
}

func (r *Reader) Search(ctx context.Context, query, atomType, milestone string,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 25 {
		limit = 25
	}
	ftsHits, err := r.ftsSearch(query, atomType, milestone, limit)
	if err != nil {
		return nil, err
	}
	useVectors := emb != nil && r.EmbeddingsEnabled()
	if emb != nil && r.EmbeddingsEnabled() && emb.Model() != r.EmbeddingModel() {
		return nil, fmt.Errorf("embedding model mismatch: index built with %q, server configured with %q",
			r.EmbeddingModel(), emb.Model())
	}
	if !useVectors {
		if ftsHits == nil {
			ftsHits = []SearchHit{}
		}
		return ftsHits, nil
	}
	vecHits, err := r.vectorSearch(ctx, query, atomType, milestone, limit, emb)
	if err != nil {
		// Search must never hard-depend on the embedding sidecar: fall
		// back to the FTS hits already computed rather than failing the
		// whole request.
		slog.Warn("vector search failed, degrading to keyword-only results", "error", err)
		if ftsHits == nil {
			ftsHits = []SearchHit{}
		}
		return ftsHits, nil
	}
	// Reciprocal rank fusion over the two ranked lists.
	type fused struct {
		hit   SearchHit
		score float64
	}
	scores := map[string]*fused{}
	accumulate := func(hits []SearchHit) {
		for rank, h := range hits {
			f, ok := scores[h.ID]
			if !ok {
				f = &fused{hit: h}
				scores[h.ID] = f
			}
			f.score += 1.0 / (rrfK + float64(rank+1))
			if f.hit.Snippet == "" {
				f.hit.Snippet = h.Snippet
			}
		}
	}
	accumulate(ftsHits)
	accumulate(vecHits)
	var all []*fused
	for _, f := range scores {
		all = append(all, f)
	}
	sort.Slice(all, func(i, j int) bool {
		if all[i].score != all[j].score {
			return all[i].score > all[j].score
		}
		return all[i].hit.ID < all[j].hit.ID
	})
	out := []SearchHit{}
	for i := 0; i < len(all) && i < limit; i++ {
		out = append(out, all[i].hit)
	}
	return out, nil
}
