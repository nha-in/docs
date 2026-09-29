# The catalogue

The source of truth for everything this repository publishes. The site
renders it for people; the MCP server indexes it for machines. Nothing
downstream is hand-maintained: fix content here, then rebuild.

## Directory map

HIE-CM and UHI each own one folder holding everything they have. NHCX's
atoms are in `nhcx/`; its specifications, corrections and sources are still
under `openapi/` until NHCX is restructured. `npm run lint:atoms` fails on any
name outside this tree, and on any atom not at
`<gateway>/<type folder>/<id slug>.md`.

```
README.md             This map
VERSION               The catalogue version stamp, read into every build
hiecm/                HIE-CM, everything it has
  map/                Content map: atom id to page and heading id, no prose
  openapi/
    v3/               One self-contained spec per module; callbacks live in
                      the module file that owns them as OpenAPI 3.1 webhooks.
                      journeys/ holds call order, errors/ each module's codes
    corrections/      Recorded patches to upstream files, never silent
    .raw/             Upstream NHA files, stored untouched
  titles.yaml         Reference page title overrides, by operationId
  postman.json        The published Postman collection ids
  concepts/ flows/ endpoints/ callbacks/ errors/ glossary/ tests/
  decisions/ troubleshooting/
                      Atom files, one per atom. A file marked generated: true
                      is written from its page section; never edit it
uhi/                  UHI: openapi/ as for HIE-CM, and glossary/
nhcx/                 NHCX's hand-written atoms, one folder per type
shared/               Atoms that belong to no single gateway: concepts/,
                      decisions/, fhir/, glossary/, sandbox/, and
                      vocabulary.yaml. A glossary term stays here only when it
                      means the same thing on every gateway
openapi/              Not yet moved: NHCX's specs (nhcx/v1/), corrections and
                      sets, CONVENTIONS.md (the rules every spec follows),
                      extensions.md, and the pinned NRCeS package
titles.yaml           NHCX's title overrides, until the same move
annexure/             The sources atoms cite, not atoms
changelog/            What's New facts and entries
registry.json         Every atom and where its words live (built)
atom-routes.json      Every atom's page route (built)
```

An atom's words are written on its docs page when it is in a content map,
and in its file when it is not. Machine contracts go in the module's YAML
under the gateway's `openapi/`. There is no third place.

## How this tree is indexed

The MCP indexer (`mcp/cmd/indexer`) compiles this tree into one SQLite
snapshot the docs-mcp server serves. Its rules are strict and fail loud:

1. `.raw/` directories are skipped entirely. Sources, not content.
2. Every `.md` file outside any `openapi/` folder is parsed as an atom,
   with one exception: `README.md` files are contributor notes for the
   folder they sit in and are skipped wherever they are. An atom must
   carry valid frontmatter with an `id`, or the whole build fails naming
   the file. Do not drop stray notes into the atom folders; any other
   frontmatter-less `.md` fails the build by design.
3. `.md` files inside an `openapi/` folder (`CONVENTIONS.md`, the
   correction logs) are spec-area documentation and are skipped silently.
4. Every `<gateway>/openapi/<version>/*.yaml`, and NHCX's
   `openapi/nhcx/v1/*.yaml`, is parsed as an OpenAPI document; journeys/,
   errors/ and corrections/ are not. Every operation must carry an
   `operationId` or the build fails. Each file's sha256 is recorded in the
   snapshot.
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
status, and the `related` map that builds the graph. Two fields are
optional: `audience: contributor` keeps an atom out of the Docs MCP
snapshot, for a note about how this catalogue is built rather than about
how ABDM works, and `order` is a whole number placing the atom within a
compiled design section, where the default is to sort by id and the rules
usually build on each other instead. A third, `router`, is the one line the
compiled skill's always-loaded router carries for a design atom, for a rule a
reader must meet before deciding whether to open the design section. The
body carries five
sections: In plain words, Before you start, What happens, How you know it
worked, When it goes wrong. No em dash anywhere. Atoms carry no
verification status: the Catalogue states how ABDM works. The abdm-portal
plugin's atom-authoring skill carries the full rules.
