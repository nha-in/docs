package index

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
)

// ListSkills returns every compiled integrator skill section in the
// snapshot, ordered by skill then section. The router section sorts first
// within each skill, because its Section is empty.
func (r *Reader) ListSkills() ([]catalogue.Skill, error) {
	rows, err := r.db.Query(
		`SELECT name, section, description, body FROM skills ORDER BY name, section`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []catalogue.Skill
	for rows.Next() {
		var s catalogue.Skill
		if err := rows.Scan(&s.Name, &s.Section, &s.Description, &s.Body); err != nil {
			return nil, err
		}
		out = append(out, s)
	}
	return out, rows.Err()
}

// GetSkill returns one section of one skill. An empty section is the
// SKILL.md router, which is the section that says which other one to read.
func (r *Reader) GetSkill(name, section string) (catalogue.Skill, error) {
	var s catalogue.Skill
	err := r.db.QueryRow(
		`SELECT name, section, description, body FROM skills WHERE name = ? AND section = ?`,
		name, section).Scan(&s.Name, &s.Section, &s.Description, &s.Body)
	if errors.Is(err, sql.ErrNoRows) {
		return s, fmt.Errorf("no skill %q section %q", name, section)
	}
	return s, err
}
