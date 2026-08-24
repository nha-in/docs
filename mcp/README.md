# Docs MCP server

Serves the catalogue to coding agents (MCP over streamable HTTP at /mcp)
and to the docs site search box (GET /api/search). Content comes from one
read-only SQLite snapshot compiled from catalogue/ by cmd/indexer; the
server never reads the catalogue directly and never writes anything.

Search is hybrid: FTS5 keyword ranking fused (reciprocal rank fusion)
with cosine similarity over chunk embeddings from a self-hosted Ollama
sidecar (nomic-embed-text). Both the indexer and the server run without
Ollama, degrading to keyword-only; /healthz reports which mode is live.

Design: ../docs/superpowers/specs/2026-08-24-docs-mcp-design.md

## Run locally

    go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    go run ./cmd/docs-mcp -db /tmp/catalogue.db -addr :8080

With embeddings (Ollama running locally with nomic-embed-text pulled):

    go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db -ollama http://localhost:11434
    go run ./cmd/docs-mcp -db /tmp/catalogue.db -addr :8080 -ollama http://localhost:11434

Or the full pair: docker compose up (see docker-compose.yml).

## Tools

search_docs, get_atom, related_atoms, decode_error, list_atoms,
catalogue_info, list_operations, get_operation, validate_request. Every
response carries catalogue_version; every atom result carries
verification_status.

## Tests

    go test ./...

No test needs Ollama; embeddings are covered by a deterministic fake.
Golden contract files live in internal/server/testdata/golden; regenerate
with go test ./internal/server/ -run TestGolden -update and review the
diff like any other contract change.
