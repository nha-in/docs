---
name: scalar-docs
description: Building and operating the self-hosted Docusaurus documentation site for the ABDM Catalogue, including the API reference the site generates from the OpenAPI files (one page per endpoint, request samples, the browser-side Try it console, spec downloads), navigation generated at build time, local search, the footer version stamp, and why Scalar's reference was retired. Use whenever working on the docs site itself, configuring Docusaurus or the generated API reference, deciding how pages are grouped, or explaining why there is no on-site assistant, mock server or hosted MCP in V1. The skill keeps its old name so other skills can route to it.
---

# Docs site

The site is Docusaurus, self-hosted. Docusaurus owns the guides, navigation, search, theming and versioning. The API reference is a section of the same site, generated from the specifications at build time and drawn by the site's own components. The site does not author guides, compile skills, watch sources, serve machine retrieval, or enforce our lint rules. Knowing that boundary prevents a lot of wasted effort.

Self-hosting is total, not partial: nothing loads from a CDN and no hosted service sits in the request path. This was a hosting decision change: everything is self-hosted in our infra now, NHA's later. The earlier hosted-for-speed stance in the plan is superseded, not a Phase 2 exit we are still working toward. Plan source: plan#p3-6-scalar.

## What the site is

- Docusaurus for guides, navigation, theming, versioning.
- A generated API reference: one page per operation, in the Docusaurus sidebar, described below.
- Site search is a local build-time index (`@easyops-cn/docusaurus-search-local`), not a hosted search service.
- Spectral linting runs in our own CI.
- The catalogue version is stamped into the footer from `catalogue/VERSION`, so a reader can tell an agent which version they are looking at.

## The generated API reference

`scripts/build-api-reference.mjs` runs from `site`'s `prestart` and `prebuild`. It reads each OpenAPI file under `catalogue/openapi/<gateway>/<version>/` and writes:

- one MDX page per operation under `site/docs/<gateway>/<version>/api/<module>/endpoints/`
- a page for each callback, from the file's OpenAPI 3.1 `webhooks` section
- the data behind the pages under `site/src/data/api/`
- the API sidebar, `api-sidebar.json`

All of that is build output. Do not hand-edit it. If a page is wrong, the specification or the generator is wrong.

The exception is each module's index page, `site/docs/<gateway>/<version>/api/<module>/index.mdx`. It is hand-written, and the old `/reference/<spec-stem>` URLs redirect to it.

Two components draw every endpoint page: `site/src/components/api/ApiEndpoint.tsx` and `TryIt.tsx`. A page shows:

- the fields, request and response
- responses folded by status code
- request samples in eight languages: cURL, Python, Node.js, Java, PHP, Go, C# and Ruby
- a Try it console
- a download of the module's whole specification, as YAML or JSON

The Try it console sends from the reader's browser, with no proxy. It does what ABDM calls need:

- RSA-encrypts the marked fields in the browser
- generates `REQUEST-ID` and `TIMESTAMP`
- derives `X-CM-ID` from the chosen server
- holds the gateway token for the tab
- carries `txnId` and `X-token` from one step's response to the next

`scripts/sync-specs.mjs` copies each specification flat to `site/static/specs/<file>.yaml` and writes a JSON copy beside it. Those copies are what the download links serve. They are also the portability exit: any OpenAPI viewer can be pointed at them.

## Why Scalar's reference was retired

The site used to embed Scalar's `@scalar/docusaurus` reference too, one page per specification at `/reference/<spec-stem>`. It is retired. The generated reference, built on 25 August, puts one page per endpoint in the sidebar, which Scalar's one page per specification cannot. Its Try it also does the browser-side field encryption and step carry-over that Scalar cannot. Keeping both meant two references drawn from the same specifications, a 36 MB vendored bundle in every build, and pages sending readers from one to the other.

Do not reintroduce a second reference. If a different viewer is ever wanted, point it at `site/static/specs/`.

## What we build ourselves

- The atom bodies. The site renders markdown; it does not write guides.
- Navigation generation, because hand-maintained navigation drifts.
- The API reference generator and its components.
- The skill compiler.
- The source watcher, which is designed and not built.
- Our lint rules, including Spectral, run in our own CI.
- The Docs MCP server (see `support-agent` and the plan §6). A hosted documentation platform would have provided one for free; ours is our own.

## Navigation is generated, never hand-edited

Docusaurus sidebars are a build output. The generator is `scripts/build-nav.mjs`, run from `site`'s `prebuild` and `prestart`. It walks the folder tree under `site/docs`, one platform per folder and one version per folder below it, reading a `_platform.json` beside the version folders for the display label, description and any extra picker entries. It does not read atom frontmatter and does not import `lib/atoms.mjs`, so it groups by folder, not by gateway, milestone and type. A page's placement is its path.

Hand-editing navigation is the same class of mistake as hand-editing a compiled skill. If a page is in the wrong place, move the file.

The generator writes exactly three things:

- `site/src/data/platforms.json`, the platform and version model
- `site/src/data/reference-links.json`, from the `api-sidebar.json` that `build-api-reference.mjs` wrote just before it
- `site/static/llms.txt`, an index of every page under `site/docs`

It emits no phase scope into the sidebar. Atoms carry no verification status and no page renders one, so a phase note has to be written into the page itself. The `catalogue_version` in the footer is real but is not this script's doing: `site/docusaurus.config.ts` reads `catalogue/VERSION` and puts it in the copyright line.

## One module per specification file

The reference follows the module-per-file layout in `catalogue/openapi/hiecm/v3/`. Each file becomes one module folder under `site/docs/hiecm/v3/api/`:

| Module folder | Spec file |
|---|---|
| `api/gateway/` | `hiecm-gateway.yaml`, the shared session token contract |
| `api/m1/` | `hiecm-m1.yaml` |
| `api/m2/` | `hiecm-m2.yaml` |
| `api/m3/` | `hiecm-m3.yaml` |
| `api/m4/` | `hiecm-m4.yaml`, Phase 2, exists in the layout but says so |

This skill's scope is HIE-CM M1 to M3. The other HIE-CM modules (P1 to P4, record share, Scan and Pay, Scan and Register) render the same way and are out of scope here, not out of existence.

Each spec file is the whole contract for its module, callbacks included as `webhooks` entries. There is no AsyncAPI file anywhere in this stack; see `openapi-ingest` for the layout and `CONVENTIONS.md`.

## What replaced the lost hosted-platform features

Going fully self-hosted meant giving up what a hosted documentation platform, Scalar's included, would have provided for free. Each loss has a deliberate, named replacement, not a silent gap:

| Hosted feature we do not have | What replaces it |
|---|---|
| A free Docs MCP at a hosted URL | Our own Go Docs MCP server, `docs-mcp`, in the `mcp/` module of the abdm-docs repo. Nine tools over a CI-built SQLite snapshot. See `support-agent`. |
| A free Installation MCP (search mode, personal token, passthrough auth) | Superseded. Its search-mode value is covered by `docs-mcp`'s `get_operation` and `validate_request` tools. Execute mode stays a Phase 2 concern with per-caller credentials. |
| Ask AI answering questions on the site | No on-site assistant in V1. Answer synthesis stays in the consuming agent (Claude Code, the support agent) over `/mcp`. An assistant can be added in front of `/api/search` later; it does not exist yet. |
| Hosted search over published content | A local build-time index (`@easyops-cn/docusaurus-search-local`), plus `docs-mcp`'s `/api/search` endpoint for anything that needs the same retrieval the MCP uses. |
| A mock server generated from the OpenAPI files | Not built. Unbuilt until something needs it. The first-day developer test relies on real sandbox credentials, applied for early, not a mock. |
| Hosted version mapping to NHA spec versions | Docusaurus versioning, if and when it is needed; not wired up as a hosted feature. |
| Preview deploys per pull request, GitHub sync, publish from CLI | Our own CI: build the Docusaurus site in the deploy pipeline, publish on merge. See `update-pipeline`. |

## Content constraints that protect portability

Principle P6 says no lock-in. In practice:

- Keep prose in plain markdown. Use MDX only for callouts and steps.
- No site-specific component carrying meaning in a hand-written page that would be lost in plain markdown. The generated endpoint pages are the exception: their source is the specification, which stays portable.
- Every page must still read correctly as a raw `.md` file, because that is what agents fetch.

This keeps the "a different static site generator could render this in a week" test true, and keeps `llms.txt` and per-page markdown honest.

## Publishing

- CI on merge builds the Docusaurus site with specs synced from `catalogue/openapi`, lints, compiles skills, and indexes the catalogue into `catalogue.db`.
- Deploy is the static site plus the `docs-mcp` image built with the new snapshot.
- The docs and the compiled skills publish from the same build, so their `catalogue_version` always matches.

## Related

- What renders: `atom-authoring`
- The module-per-file OpenAPI layout and `CONVENTIONS.md`: `openapi-ingest`
- Who consumes the Docs MCP: `support-agent`
- Publishing mechanics: `/docs-publish`, `update-pipeline`
- Why lock-in matters: `dpg-governance`
