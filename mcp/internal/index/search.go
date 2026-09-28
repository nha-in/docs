package index

import (
	"context"
	"fmt"
	"log/slog"
	"regexp"
	"sort"
	"strings"

	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/embed"
)

type SearchHit struct {
	// Kind is "atom" or "operation". For an operation, ID is its operationId,
	// Type is "operation", and DocURL is its generated reference page.
	Kind                                         string
	ID, Type, Milestone, Title, Summary, Snippet string
	// DocURL and DocAnchor are the published page this atom's knowledge
	// lives on. Empty means the atom has no page and must not be cited to
	// a reader. See DocLink.
	DocURL, DocAnchor string
}

const rrfK = 60.0

func ftsQuote(q string) string {
	var parts []string
	for _, f := range strings.Fields(q) {
		parts = append(parts, `"`+strings.ReplaceAll(f, `"`, ``)+`"`)
	}
	return strings.Join(parts, " ")
}

// Filter narrows atom search. Side keeps atoms for that side and those for
// both; a deprecated atom is left out unless IncludeDeprecated is set.
type Filter struct {
	Type, Milestone, Gateway, Side string
	IncludeDeprecated              bool
}

func (r *Reader) ftsSearch(query, atomType, milestone, gateway string, limit int) ([]SearchHit, error) {
	return r.ftsSearchF(query, Filter{Type: atomType, Milestone: milestone, Gateway: gateway}, limit)
}

func (r *Reader) ftsSearchF(query string, f Filter, limit int) ([]SearchHit, error) {
	match := ftsQuery(query, r.vocab)
	if expansions := r.vocab.Expand(query); len(expansions) > 0 {
		// Logged so a miss can be diagnosed against what the expander
		// actually did, rather than guessed at.
		slog.Debug("query expanded", "query", query, "added", expansions)
	}
	if match == "" {
		// A query that reduces to nothing after quoting (empty or
		// whitespace-only) has no valid FTS5 MATCH expression. Treat it
		// as zero keyword hits instead of letting an empty MATCH raise
		// a syntax error.
		return nil, nil
	}
	hits, err := r.ftsRun(match, f, limit)
	ids := identifiers(query)
	if err != nil || len(hits) >= limit || len(ids) == 0 || len(ids) == len(strings.Fields(query)) {
		return hits, err
	}
	// Every token required found too few, and the query names an exact
	// identifier: a stray word must not hide it, so retry on the identifiers
	// alone, any of them, since each names one thing precisely ("is txnId the
	// same as REQUEST-ID?" is answered by two atoms, one per name). A question
	// in plain words is left to the vector leg, because a looser keyword match
	// on "call" or "my" crowds its answers out of the fusion (the retrieval
	// gate measured 12 cases falling when it did). AND rows keep their places
	// first.
	more, err := r.ftsRun(strings.Join(strings.Fields(ftsQuote(strings.Join(ids, " "))), " OR "), f, limit)
	if err != nil {
		return nil, err
	}
	seen := make(map[string]bool, len(hits))
	for _, h := range hits {
		seen[h.ID] = true
	}
	for _, h := range more {
		if len(hits) >= limit {
			break
		}
		if !seen[h.ID] {
			hits = append(hits, h)
			seen[h.ID] = true
		}
	}
	return hits, nil
}

// identifierRe matches a token that names something exactly: letters with
// digits (ABDM-1035, M1), an underscore or slash (m1_post_profile_verify,
// /v3/link), hyphenated capitals (X-CM-ID), or camelCase (txnId).
var identifierRe = regexp.MustCompile(`^(?:.*[A-Za-z].*[0-9].*|.*[0-9].*[A-Za-z].*|.*[_/].*|[A-Z]+(?:-[A-Z]+)+|[a-z]+[A-Z][A-Za-z]*)$`)

// identifiers returns the identifier-shaped tokens of a query, in order.
func identifiers(query string) []string {
	var out []string
	for _, f := range strings.Fields(query) {
		if f = strings.Trim(f, `"'?.,;:()`); identifierRe.MatchString(f) {
			out = append(out, f)
		}
	}
	return out
}

// ftsRun runs one FTS5 MATCH expression, bm25-ordered, with the filters.
func (r *Reader) ftsRun(match string, f Filter, limit int) ([]SearchHit, error) {
	rows, err := r.db.Query(`
        SELECT a.id, a.type, a.milestone, a.title, a.summary,
               a.doc_url, a.doc_anchor,
               snippet(atoms_fts, 3, '**', '**', '...', 12)
        FROM atoms_fts
        JOIN atoms a ON a.id = atoms_fts.id
        WHERE atoms_fts MATCH ?
          AND (? = '' OR a.type = ?)
          AND (? = '' OR a.milestone = ?)
          AND (? = '' OR a.gateway = ? OR a.gateway = 'shared')
          AND (? = '' OR a.side = ? OR a.side = 'both')
          AND (? OR a.status != 'deprecated')
        ORDER BY bm25(atoms_fts, 0.0, 5.0, 3.0, 1.0, 8.0, 6.0)
        LIMIT ?`,
		match, f.Type, f.Type, f.Milestone, f.Milestone, f.Gateway, f.Gateway, f.Side, f.Side, f.IncludeDeprecated, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var hits []SearchHit
	for rows.Next() {
		h := SearchHit{Kind: "atom"}
		if err := rows.Scan(&h.ID, &h.Type, &h.Milestone, &h.Title, &h.Summary,
			&h.DocURL, &h.DocAnchor, &h.Snippet); err != nil {
			return nil, err
		}
		hits = append(hits, h)
	}
	return hits, rows.Err()
}

func (r *Reader) vectorSearch(ctx context.Context, query string, f Filter,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	qv, err := emb.Embed(ctx, []string{query})
	if err != nil {
		return nil, fmt.Errorf("embed query: %w", err)
	}
	rows, err := r.db.Query(`
        SELECT c.atom_id, c.heading, c.text, c.embedding,
               a.type, a.milestone, a.title, a.summary,
               a.doc_url, a.doc_anchor
        FROM chunks c JOIN atoms a ON a.id = c.atom_id
        WHERE c.embedding IS NOT NULL
          AND (? = '' OR a.type = ?)
          AND (? = '' OR a.milestone = ?)
          AND (? = '' OR a.gateway = ? OR a.gateway = 'shared')
          AND (? = '' OR a.side = ? OR a.side = 'both')
          AND (? OR a.status != 'deprecated')`,
		f.Type, f.Type, f.Milestone, f.Milestone, f.Gateway, f.Gateway, f.Side, f.Side, f.IncludeDeprecated)
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
		var atomID, heading, text string
		var blob []byte
		h := SearchHit{Kind: "atom"}
		if err := rows.Scan(&atomID, &heading, &text, &blob, &h.Type, &h.Milestone,
			&h.Title, &h.Summary, &h.DocURL, &h.DocAnchor); err != nil {
			return nil, err
		}
		h.ID = atomID
		if heading == catalogue.QuestionsHeading {
			// This chunk exists so a naive phrasing can find the atom, not
			// to be read: it is a list of other questions, not the answer.
			// Score it, but show the atom's summary as the snippet.
			h.Snippet = h.Summary
		} else {
			if len(text) > 200 {
				text = text[:200] + "..."
			}
			h.Snippet = text
		}
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
	return r.SearchIn(ctx, query, atomType, milestone, "", limit, emb)
}

// SearchIn is Search scoped to one gateway's atoms and the shared ones, which
// belong to every gateway. An empty gateway is no scope.
func (r *Reader) SearchIn(ctx context.Context, query, atomType, milestone, gateway string,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	return r.searchAtoms(ctx, query, Filter{Type: atomType, Milestone: milestone, Gateway: gateway}, limit, emb)
}

func (r *Reader) searchAtoms(ctx context.Context, query string, f Filter,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 25 {
		limit = 25
	}
	ftsHits, err := r.ftsSearchF(query, f, limit)
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
	vecHits, err := r.vectorSearch(ctx, query, f, limit, emb)
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
	return fuse(limit, ftsHits, vecHits), nil
}

// fuse merges ranked lists by reciprocal rank fusion: each list adds
// 1/(rrfK+rank) to a hit's score, and a hit keeps the first non-empty
// snippet it was given. On a tie an atom goes before an operation, since the
// atom carries the guidance and the operation only the contract; otherwise
// the lower id goes first.
func fuse(limit int, lists ...[]SearchHit) []SearchHit {
	type fused struct {
		hit   SearchHit
		score float64
	}
	scores := map[string]*fused{}
	for _, hits := range lists {
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
	var all []*fused
	for _, f := range scores {
		all = append(all, f)
	}
	sort.Slice(all, func(i, j int) bool {
		if all[i].score != all[j].score {
			return all[i].score > all[j].score
		}
		if ai, aj := all[i].hit.Kind == "atom", all[j].hit.Kind == "atom"; ai != aj {
			return ai
		}
		return all[i].hit.ID < all[j].hit.ID
	})
	out := []SearchHit{}
	for i := 0; i < len(all) && i < limit; i++ {
		out = append(out, all[i].hit)
	}
	return out
}

// SearchKind searches atoms ("atom"), API operations ("operation"), or both
// (""), with the type, milestone and gateway filters.
func (r *Reader) SearchKind(ctx context.Context, query, kind, atomType, milestone, gateway string,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	return r.SearchFiltered(ctx, query, kind, Filter{Type: atomType, Milestone: milestone, Gateway: gateway}, limit, emb)
}

// SearchFiltered is SearchKind with the full filter. Both kinds are fused by
// rank; a type, milestone or side filter, or a gateway with no operations
// indexed, means atoms only, since operations carry none of them.
func (r *Reader) SearchFiltered(ctx context.Context, query, kind string, f Filter,
	limit int, emb embed.Embedder) ([]SearchHit, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 25 {
		limit = 25
	}
	switch kind {
	case "atom":
		return r.searchAtoms(ctx, query, f, limit, emb)
	case "operation":
		return r.SearchOperations(ctx, query, limit, emb)
	case "":
		atoms, err := r.searchAtoms(ctx, query, f, limit, emb)
		if err != nil || f.Type != "" || f.Milestone != "" || f.Side != "" || (f.Gateway != "" && f.Gateway != "hiecm") {
			return atoms, err
		}
		ops, err := r.SearchOperations(ctx, query, limit, emb)
		if err != nil {
			return nil, err
		}
		return fuse(limit, atoms, ops), nil
	default:
		return nil, fmt.Errorf("kind %q is not one of atom, operation", kind)
	}
}

// SearchOperations finds API operations by what they do: keyword search over
// their flat chunks, fused with vector search when the index has embeddings.
func (r *Reader) SearchOperations(ctx context.Context, query string, limit int, emb embed.Embedder) ([]SearchHit, error) {
	match := ftsQuery(query, r.vocab)
	if match == "" {
		return []SearchHit{}, nil
	}
	kw, err := r.opFTS(match, limit)
	if err == nil && len(kw) < limit {
		// As for atoms: a stray word must not hide an exact identifier.
		if ids := identifiers(query); len(ids) > 0 && len(ids) < len(strings.Fields(query)) {
			more, err2 := r.opFTS(strings.Join(strings.Fields(ftsQuote(strings.Join(ids, " "))), " OR "), limit)
			if err2 != nil {
				return nil, err2
			}
			kw = fuse(limit, kw, more)
		}
	}
	if err != nil {
		return nil, err
	}
	if emb == nil || !r.EmbeddingsEnabled() || emb.Model() != r.EmbeddingModel() {
		return fuse(limit, kw), nil
	}
	vec, err := r.opVectors(ctx, query, limit, emb)
	if err != nil {
		slog.Warn("operation vector search failed, keyword-only operations", "error", err)
		return fuse(limit, kw), nil
	}
	return fuse(limit, kw, vec), nil
}

func (r *Reader) opFTS(match string, limit int) ([]SearchHit, error) {
	rows, err := r.db.Query(`
        SELECT o.operation_id, o.method, o.path, o.summary, o.module
        FROM operations_fts
        JOIN operations o ON o.operation_id = operations_fts.operation_id
        WHERE operations_fts MATCH ?
        ORDER BY bm25(operations_fts)
        LIMIT ?`, match, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var hits []SearchHit
	for rows.Next() {
		var id, method, path, summary, module string
		if err := rows.Scan(&id, &method, &path, &summary, &module); err != nil {
			return nil, err
		}
		hits = append(hits, opHit(id, method, path, summary, module))
	}
	return hits, rows.Err()
}

func (r *Reader) opVectors(ctx context.Context, query string, limit int, emb embed.Embedder) ([]SearchHit, error) {
	qv, err := emb.Embed(ctx, []string{query})
	if err != nil {
		return nil, fmt.Errorf("embed query: %w", err)
	}
	rows, err := r.db.Query(`
        SELECT o.operation_id, o.method, o.path, o.summary, o.module, c.embedding
        FROM chunks c
        JOIN operations o ON o.operation_id = c.atom_id
        WHERE c.kind = 'operation' AND c.embedding IS NOT NULL`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	type scored struct {
		hit   SearchHit
		score float32
	}
	var all []scored
	for rows.Next() {
		var id, method, path, summary, module string
		var blob []byte
		if err := rows.Scan(&id, &method, &path, &summary, &module, &blob); err != nil {
			return nil, err
		}
		all = append(all, scored{opHit(id, method, path, summary, module), embed.Cosine(qv[0], blobToVec(blob))})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	sort.Slice(all, func(i, j int) bool { return all[i].score > all[j].score })
	var hits []SearchHit
	for i := 0; i < len(all) && i < limit; i++ {
		hits = append(hits, all[i].hit)
	}
	return hits, nil
}

func opHit(id, method, path, summary, module string) SearchHit {
	return SearchHit{Kind: "operation", ID: id, Type: "operation",
		Title: strings.ToUpper(method) + " " + path, Summary: summary, Snippet: summary,
		DocURL: OperationDocPath(module, id)}
}

// nonAlphanumeric matches the run-collapsing the site's route generator does
// in scripts/build-api-reference.mjs. Keep the two in step: an operation id is
// snake_case and its route is hyphenated, so without this an agent holding
// `gateway_sessions_create` cannot reach
// `/docs/hiecm/v3/api/gateway/endpoints/gateway-sessions-create`.
var nonAlphanumeric = regexp.MustCompile(`[^a-zA-Z0-9]+`)

// OperationDocPath is site-relative rather than absolute because the server is
// not told where it is published. Every operation it indexes is HIE-CM v3
// today, which is the one assumption here; a second gateway means carrying the
// gateway and version through the index alongside the module.
func OperationDocPath(module, operationID string) string {
	if module == "" || operationID == "" {
		return ""
	}
	slug := strings.Trim(nonAlphanumeric.ReplaceAllString(operationID, "-"), "-")
	if slug == "" {
		return ""
	}
	return "/docs/hiecm/v3/api/" + module + "/endpoints/" + strings.ToLower(slug)
}
