# ABDM Developer Portal

The developer portal for India's Ayushman Bharat Digital Mission (ABDM):
documentation, an interactive API reference, an MCP server for coding
agents, and an AI assistant that answers from the same content a human
reads. All four are generated from one source, so they cannot drift apart.

Today only the HIE-CM gateway (ABDM V3) is populated. UHI and NHCX have
empty scaffolding reserved for later phases.

## What's in here

**The catalogue** is the source of truth: hand-authored knowledge (concepts,
step-by-step flows, endpoint guides, error explanations, callbacks, test
cases, decisions) plus NHA's own OpenAPI specifications. NHA's files are
kept byte-for-byte as published; anything wrong or missing in them is
recorded as a dated correction, never silently edited. See
[catalogue/README.md](catalogue/README.md) for how content is organised and
[catalogue/openapi/CONVENTIONS.md](catalogue/openapi/CONVENTIONS.md) for how
the specs are structured.

**The site** is a Docusaurus site with interactive Scalar API references,
built entirely from the catalogue. Nothing under `site/docs` or
`site/static/specs` is hand-edited; both are regenerated on every build. See
[site/README.md](site/README.md).

**The Docs MCP server** is a Go binary that compiles the catalogue into a
SQLite snapshot and serves it three ways: the MCP protocol for coding
agents, the site's search box, and the site's "Ask AI" chat panel. See
[mcp/README.md](mcp/README.md) for configuration, the full tool list, and
how to run it.

## How retrieval and chat work

Search is hybrid: keyword ranking (SQLite FTS5) fused with vector
similarity over embeddings, so an exact error code and a vague description
both find the right atom. Embeddings come from one provider per deployment,
decided once and stamped into the index — an index built with one
embedding model is refused by a server configured for another, so the pair
can never silently drift out of sync.

The chat panel runs the same retrieval tools a coding agent gets over MCP,
driven by a Claude model on Amazon Bedrock. It answers strictly from what
those tools return, cites its sources, and says plainly when the catalogue
doesn't have something, rather than improvising. The chat endpoint only
turns on when a Bedrock model id is configured; without one, the panel
stays a clearly labelled preview.

Nothing here calls a third-party AI API directly. The only network
dependency beyond the reader's own browser is Amazon Bedrock, reached
through an IAM role with no long-lived credentials stored anywhere.

## Running it locally

### The site

```bash
npm install
npm start          # dev server; syncs specs from catalogue/openapi first
npm run build      # production build
npm run lint:specs # Spectral lint over catalogue/openapi
```

### The Docs MCP server

```bash
cd mcp
go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
EMBED_PROVIDER=none go run ./cmd/docs-mcp -db /tmp/catalogue.db -addr :8080
```

`EMBED_PROVIDER=none` runs keyword-only search with no external
dependency. Full setup, including embeddings and the optional chat
endpoint, is in [mcp/README.md](mcp/README.md).

## Deploying

Kubernetes manifests, the IAM policy, and the CI workflow templates for
running this on AWS live in [deploy/nha/](deploy/nha/). A full
[architecture diagram](deploy/nha/architecture/aws-deployment-architecture.drawio)
covers the site's CDN, the MCP server's cluster, and how Bedrock and CI/CD
credentials flow through IAM without a single stored secret.

## Rules

- The catalogue is the source. Fix the atom or the spec, then rebuild.
- Corrections to NHA files are recorded in `catalogue/openapi/corrections/`,
  never applied silently.
- Never claim verification that was not observed against the sandbox.

## Licence

MIT, copyright National Health Authority (NHA). See [LICENSE](LICENSE).
