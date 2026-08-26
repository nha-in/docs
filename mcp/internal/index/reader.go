package index

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	"github.com/nha-in/docs/mcp/internal/catalogue"
	_ "modernc.org/sqlite"
)

type Reader struct {
	db       *sql.DB
	version  string
	builtAt  string
	embModel string
	hasVecs  bool
}

func Open(dbPath string) (*Reader, error) {
	db, err := sql.Open("sqlite", "file:"+dbPath+"?mode=ro&immutable=1")
	if err != nil {
		return nil, err
	}
	r := &Reader{db: db}
	for key, dst := range map[string]*string{
		"catalogue_version": &r.version,
		"built_at":          &r.builtAt,
		"embedding_model":   &r.embModel,
	} {
		if err := db.QueryRow(`SELECT value FROM meta WHERE key=?`, key).Scan(dst); err != nil {
			db.Close()
			return nil, fmt.Errorf("meta %s: %w", key, err)
		}
	}
	var n int
	if err := db.QueryRow(`SELECT count(*) FROM chunks WHERE embedding IS NOT NULL`).Scan(&n); err != nil {
		db.Close()
		return nil, err
	}
	r.hasVecs = n > 0 && r.embModel != ""
	return r, nil
}

func (r *Reader) Close() error             { return r.db.Close() }
func (r *Reader) CatalogueVersion() string { return r.version }
func (r *Reader) BuiltAt() string          { return r.builtAt }
func (r *Reader) EmbeddingModel() string   { return r.embModel }
func (r *Reader) EmbeddingsEnabled() bool  { return r.hasVecs }

type NotFoundError struct {
	ID      string
	Closest []string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found; closest: %s", e.ID, strings.Join(e.Closest, ", "))
}

func trigrams(s string) map[string]bool {
	s = strings.ToLower(s)
	g := map[string]bool{}
	for i := 0; i+3 <= len(s); i++ {
		g[s[i:i+3]] = true
	}
	return g
}

func similarity(a, b string) float64 {
	ga, gb := trigrams(a), trigrams(b)
	if len(ga) == 0 || len(gb) == 0 {
		return 0
	}
	inter := 0
	for g := range ga {
		if gb[g] {
			inter++
		}
	}
	return float64(inter) / float64(len(ga)+len(gb)-inter)
}

func (r *Reader) closest(table, col, id string) []string {
	rows, err := r.db.Query(fmt.Sprintf(`SELECT %s FROM %s`, col, table))
	if err != nil {
		return nil
	}
	defer rows.Close()
	type scored struct {
		id string
		s  float64
	}
	var all []scored
	for rows.Next() {
		var c string
		if rows.Scan(&c) == nil {
			all = append(all, scored{c, similarity(id, c)})
		}
	}
	sort.Slice(all, func(i, j int) bool { return all[i].s > all[j].s })
	var out []string
	for i := 0; i < len(all) && i < 5; i++ {
		out = append(out, all[i].id)
	}
	return out
}

func (r *Reader) GetAtom(id string) (catalogue.Atom, error) {
	var a catalogue.Atom
	err := r.db.QueryRow(`
        SELECT id, type, gateway, milestone, title, summary,
               verification_status, body, source_path
        FROM atoms WHERE id = ?`, id).Scan(
		&a.ID, &a.Type, &a.Gateway, &a.Milestone, &a.Title, &a.Summary,
		&a.VerificationStatus, &a.Body, &a.SourcePath)
	if err == sql.ErrNoRows {
		return catalogue.Atom{}, &NotFoundError{ID: id, Closest: r.closest("atoms", "id", id)}
	}
	if err != nil {
		return catalogue.Atom{}, err
	}
	return a, nil
}

type AtomRef struct {
	ID, Type, Milestone, Title, VerificationStatus string
}

func (r *Reader) atomRefs(query string, args ...any) ([]AtomRef, error) {
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	refs := []AtomRef{}
	for rows.Next() {
		var a AtomRef
		if err := rows.Scan(&a.ID, &a.Type, &a.Milestone, &a.Title, &a.VerificationStatus); err != nil {
			return nil, err
		}
		refs = append(refs, a)
	}
	return refs, rows.Err()
}

const refCols = `id, type, milestone, title, verification_status`

func (r *Reader) ListAtoms(atomType, milestone string) ([]AtomRef, error) {
	return r.atomRefs(`SELECT `+refCols+` FROM atoms
        WHERE (? = '' OR type = ?) AND (? = '' OR milestone = ?)
        ORDER BY id`, atomType, atomType, milestone, milestone)
}

func (r *Reader) AtomsByErrorCode(code string) ([]AtomRef, error) {
	return r.atomRefs(`SELECT `+refCols+` FROM atoms
        WHERE id IN (SELECT atom_id FROM atom_error_codes WHERE code = ?)
        ORDER BY id`, catalogue.NormalizeErrorCode(code))
}

// RelatedGroup buckets related atoms by the related atom's own type
// ("error", "flow", "endpoint", ...), never by the edge's relation name;
// a reverse edge from a flow's "endpoints" list must file the flow under
// "flow". Atoms whose id has no atom yet are grouped under "missing".
type RelatedGroup struct {
	Type  string
	Atoms []AtomRef
}

func (r *Reader) RelatedAtoms(id string) ([]RelatedGroup, error) {
	if _, err := r.GetAtom(id); err != nil {
		return nil, err
	}
	rows, err := r.db.Query(`
        SELECT to_id FROM related WHERE from_id = ?
        UNION
        SELECT from_id FROM related WHERE to_id = ?`, id, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var others []string
	for rows.Next() {
		var other string
		if err := rows.Scan(&other); err != nil {
			return nil, err
		}
		if other != id {
			others = append(others, other)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	sort.Strings(others)
	byType := map[string][]AtomRef{}
	for _, other := range others {
		// A related id may point at an atom that does not exist yet;
		// represent it honestly rather than dropping it.
		a, err := r.GetAtom(other)
		if err != nil {
			byType["missing"] = append(byType["missing"], AtomRef{ID: other, VerificationStatus: "missing"})
			continue
		}
		byType[a.Type] = append(byType[a.Type],
			AtomRef{a.ID, a.Type, a.Milestone, a.Title, a.VerificationStatus})
	}
	var types []string
	for t := range byType {
		types = append(types, t)
	}
	sort.Strings(types)
	var groups []RelatedGroup
	for _, t := range types {
		groups = append(groups, RelatedGroup{Type: t, Atoms: byType[t]})
	}
	return groups, nil
}

type OperationSummary struct {
	OperationID string `json:"operation_id"`
	Method      string `json:"method"`
	Path        string `json:"path"`
	Summary     string `json:"summary"`
	Tag         string `json:"tag"`
	Module      string `json:"module"`
}

// ListOperations filters by exact tag, exact module, and a free
// case-insensitive substring q over operation_id, summary and path.
// Empty filters match everything.
func (r *Reader) ListOperations(tag, module, q string) ([]OperationSummary, error) {
	like := "%" + strings.ToLower(q) + "%"
	rows, err := r.db.Query(`
        SELECT operation_id, method, path, summary, tag, module FROM operations
        WHERE (? = '' OR tag = ?)
          AND (? = '' OR module = ?)
          AND (? = '' OR lower(operation_id) LIKE ? OR lower(summary) LIKE ? OR lower(path) LIKE ?)
        ORDER BY operation_id`,
		tag, tag, module, module, q, like, like, like)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []OperationSummary{}
	for rows.Next() {
		var o OperationSummary
		if err := rows.Scan(&o.OperationID, &o.Method, &o.Path, &o.Summary, &o.Tag, &o.Module); err != nil {
			return nil, err
		}
		out = append(out, o)
	}
	return out, rows.Err()
}

// SpecErrorCodes returns the specification error table rows for one code.
// The code is normalized first, so raw response values such as
// "ABDM-1016: " still match.
func (r *Reader) SpecErrorCodes(code string) ([]catalogue.SpecErrorCode, error) {
	rows, err := r.db.Query(`
        SELECT code, message, action, module FROM spec_error_codes
        WHERE code = ? ORDER BY module, message`,
		catalogue.NormalizeErrorCode(code))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []catalogue.SpecErrorCode{}
	for rows.Next() {
		var e catalogue.SpecErrorCode
		if err := rows.Scan(&e.Code, &e.Message, &e.Action, &e.Module); err != nil {
			return nil, err
		}
		out = append(out, e)
	}
	return out, rows.Err()
}

func (r *Reader) GetOperation(id string) (json.RawMessage, error) {
	var raw string
	err := r.db.QueryRow(`SELECT spec_json FROM operations WHERE operation_id = ?`, id).Scan(&raw)
	if err == sql.ErrNoRows {
		return nil, &NotFoundError{ID: id, Closest: r.closest("operations", "operation_id", id)}
	}
	if err != nil {
		return nil, err
	}
	return json.RawMessage(raw), nil
}

type OperationValidation struct {
	RequestSchemaJSON []byte
	RequiredParams    []string
}

func (r *Reader) GetOperationValidation(id string) (OperationValidation, error) {
	var schema sql.NullString
	var params string
	err := r.db.QueryRow(
		`SELECT request_schema_json, required_params_json FROM operations WHERE operation_id = ?`,
		id).Scan(&schema, &params)
	if err == sql.ErrNoRows {
		return OperationValidation{}, &NotFoundError{ID: id, Closest: r.closest("operations", "operation_id", id)}
	}
	if err != nil {
		return OperationValidation{}, err
	}
	var v OperationValidation
	if schema.Valid {
		v.RequestSchemaJSON = []byte(schema.String)
	}
	if err := json.Unmarshal([]byte(params), &v.RequiredParams); err != nil {
		return OperationValidation{}, err
	}
	return v, nil
}

type Stats struct {
	ByGateway   map[string]int
	ByMilestone map[string]int
	ByType      map[string]int
	ByStatus    map[string]int
	Operations  int
}

func (r *Reader) Stats() (Stats, error) {
	s := Stats{ByGateway: map[string]int{}, ByMilestone: map[string]int{},
		ByType: map[string]int{}, ByStatus: map[string]int{}}
	rows, err := r.db.Query(`SELECT gateway, milestone, type, verification_status FROM atoms`)
	if err != nil {
		return s, err
	}
	defer rows.Close()
	for rows.Next() {
		var g, m, ty, st string
		if err := rows.Scan(&g, &m, &ty, &st); err != nil {
			return s, err
		}
		s.ByGateway[g]++
		s.ByMilestone[m]++
		s.ByType[ty]++
		s.ByStatus[st]++
	}
	if err := rows.Err(); err != nil {
		return s, err
	}
	err = r.db.QueryRow(`SELECT count(*) FROM operations`).Scan(&s.Operations)
	return s, err
}
