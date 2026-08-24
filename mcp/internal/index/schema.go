// Package index writes and reads the catalogue.db snapshot.
package index

const schema = `
CREATE TABLE atoms (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    gateway TEXT NOT NULL,
    milestone TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    verification_status TEXT NOT NULL,
    body TEXT NOT NULL,
    source_path TEXT NOT NULL
);
CREATE VIRTUAL TABLE atoms_fts USING fts5(
    id UNINDEXED, title, summary, body, error_codes
);
CREATE TABLE operations (
    operation_id TEXT PRIMARY KEY,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    summary TEXT NOT NULL,
    tag TEXT NOT NULL,
    spec_json TEXT NOT NULL,
    request_schema_json TEXT,
    required_params_json TEXT NOT NULL
);
CREATE TABLE related (
    from_id TEXT NOT NULL,
    relation TEXT NOT NULL,
    to_id TEXT NOT NULL
);
CREATE TABLE atom_error_codes (
    code TEXT NOT NULL,
    atom_id TEXT NOT NULL
);
CREATE TABLE chunks (
    chunk_id INTEGER PRIMARY KEY,
    atom_id TEXT NOT NULL,
    heading TEXT NOT NULL,
    text TEXT NOT NULL,
    embedding BLOB
);
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE sources (path TEXT PRIMARY KEY, sha256 TEXT NOT NULL);
CREATE INDEX idx_related_from ON related(from_id);
CREATE INDEX idx_related_to ON related(to_id);
CREATE INDEX idx_codes ON atom_error_codes(code);
`
