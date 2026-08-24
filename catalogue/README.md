# The catalogue

The source of truth for everything this repository publishes. The site
renders it for people; the MCP server indexes it for machines. Nothing
downstream is hand-maintained: fix content here, then rebuild.

## Directory map

```
hiecm/                One folder per atom type for the HIE-CM gateway
  concepts/           What things are (care-context.md)
  flows/              Step by step journeys (m2-link-care-context.md)
  endpoints/          One atom per API operation, prose around the contract
  callbacks/          Webhook narratives
  errors/             Error code, cause and fix (abdm-1062.md)
  tests/              NHA functional test cases, one atom each
  decisions/          Recorded decisions and why
shared/               Gateway neutral atoms
  glossary/           Terms (abha.md)
  fhir/               FHIR bundle atoms per hi_type
  sandbox/            Registration, credentials, callback URL guides
openapi/              Machine contracts, one self-contained file per module
  CONVENTIONS.md      The binding rules for every spec file below
  hiecm-gateway.yaml  Session token, used by every module
  hiecm-m1.yaml       One file per module; callbacks live inside the
  hiecm-m2.yaml       module file that owns them as OpenAPI 3.1 webhooks
  hiecm-m3.yaml
  hiecm-m4.yaml
  .raw/               Upstream NHA files, stored untouched
  corrections/        Recorded patches to upstream files, never silent
VERSION               The catalogue version stamp, read into every build
```

Prose about ABDM goes in an atom markdown file under the matching type
folder. Machine contracts go in the module's yaml under `openapi/`.
There is no third place.

## How this tree is indexed

The MCP indexer (`mcp/cmd/indexer`) compiles this tree into one SQLite
snapshot the docs-mcp server serves. Its rules are strict and fail loud:

1. `.raw/` directories are skipped entirely. Sources, not content.
2. Every `.md` file OUTSIDE `openapi/` is parsed as an atom, with one
   exception: this `README.md` at the catalogue root is skipped. An atom
   must carry valid frontmatter with an `id`, or the whole build fails
   naming the file. Do not drop stray notes or README files into the
   atom folders; a `README.md` inside `hiecm/` or `shared/` fails the
   build by design.
3. `.md` files INSIDE `openapi/` (like `CONVENTIONS.md`) are spec-area
   documentation and are skipped silently.
4. Every `openapi/*.yaml` outside `corrections/` is parsed as an OpenAPI
   document. Every operation must carry an `operationId` or the build
   fails. Each file's sha256 is recorded in the snapshot.
5. The extension must be `.yaml`. A `.yml` file is silently ignored
   today, so never use it.
6. `VERSION` must exist; its content stamps every MCP response.
7. Atom bodies are chunked per `##` heading and embedded for semantic
   search (when an Ollama sidecar is available at index time). Specs are
   not embedded; they feed the exact-lookup tools.

What feeds which MCP tool:

| Content | Tools |
|---|---|
| Atoms | search_docs, get_atom, related_atoms, decode_error, list_atoms, catalogue_info |
| Specs | list_operations, get_operation, validate_request |

Known limits, tracked for the ingestion phase: `webhooks` sections are
not yet indexed (only `paths` operations appear in list_operations), and
`.yml` is not accepted.

## The atom contract, in brief

Frontmatter carries the machine half: `id` (stable, never reused),
`type`, `gateway`, `milestone`, `title`, `summary`, `sources` with fetch
status, `verified.status` (draft, unverified, verified, stale), and the
`related` map that builds the graph. The body carries five sections: In
plain words, Before you start, What happens, How you know it worked,
When it goes wrong. No em dash anywhere. Never claim verification that
was not observed. The abdm-portal plugin's atom-authoring skill carries
the full rules.
