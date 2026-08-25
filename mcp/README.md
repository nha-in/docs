# Docs MCP server

Serves the catalogue to coding agents (MCP over streamable HTTP at /mcp)
and to the docs site search box (GET /api/search). Content comes from one
read-only SQLite snapshot compiled from catalogue/ by cmd/indexer; the
server never reads the catalogue directly and never writes anything.

Search is hybrid: FTS5 keyword ranking fused (reciprocal rank fusion)
with cosine similarity over chunk embeddings. Embeddings come from one
of two providers, chosen by EMBED_PROVIDER: `bedrock` (Amazon Titan
Text Embeddings V2, credentials via the SDK default chain — task role,
OIDC role, or a local profile; never configured here) or `ollama`
(nomic-embed-text, for test deployments without AWS model access).
Both the indexer and the server run without a provider, degrading to
keyword-only; /healthz reports which mode is live.

The provider is decided once per deployment, in the pipeline, and the
indexer and server both inherit it. There is no runtime fallback from
one provider to another: the index stamps its provider-qualified model
(`bedrock/amazon.titan-embed-text-v2:0`, `ollama/nomic-embed-text`)
and the server refuses a mismatched snapshot at startup. Switching
provider therefore means rebuilding catalogue.db.

Configuration is environment-first (see .env.example); every env var
has a same-named flag that overrides it for local runs.

Design: ../docs/superpowers/specs/2026-08-24-docs-mcp-design.md

## Run locally

    go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    go run ./cmd/docs-mcp -db /tmp/catalogue.db -addr :8080

With embeddings via Bedrock (any AWS credentials the default chain finds):

    EMBED_PROVIDER=bedrock AWS_REGION=ap-south-1 go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    EMBED_PROVIDER=bedrock AWS_REGION=ap-south-1 go run ./cmd/docs-mcp -db /tmp/catalogue.db

With embeddings via Ollama (running locally, nomic-embed-text pulled):

    EMBED_PROVIDER=ollama OLLAMA_URL=http://localhost:11434 go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    EMBED_PROVIDER=ollama OLLAMA_URL=http://localhost:11434 go run ./cmd/docs-mcp -db /tmp/catalogue.db

Or docker compose up (see docker-compose.yml; the Ollama sidecar is the
`ollama` profile).

## Tools

search_docs, get_atom, related_atoms, decode_error, list_atoms,
catalogue_info, list_operations, get_operation, validate_request. Every
response carries catalogue_version; every atom result carries
verification_status.

## Tests

    go test ./...

No test needs Ollama or AWS; embeddings are covered by a deterministic
fake, and the Bedrock client is tested against a stand-in invoker.
Golden contract files live in internal/server/testdata/golden; regenerate
with go test ./internal/server/ -run TestGolden -update and review the
diff like any other contract change.
