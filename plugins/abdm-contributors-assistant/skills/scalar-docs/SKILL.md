---
name: scalar-docs
description: Building and operating the self-hosted Docusaurus documentation site for the ABDM Catalogue, with Scalar's MIT @scalar/docusaurus component rendering the OpenAPI references, navigation generated from atom frontmatter, local search, the footer version stamp, and what replaced the lost hosted-Scalar features. Use whenever working on the docs site itself, configuring Docusaurus or the Scalar reference routes, deciding how pages are grouped, or explaining why there is no on-site assistant, mock server or hosted MCP in V1.
---

# Scalar Docs

The site is Docusaurus, self-hosted, with Scalar's MIT licensed API Reference component embedded through `@scalar/docusaurus`. Docusaurus owns the guides, navigation, search, theming and versioning; Scalar renders one interactive reference per specification file. It does not author guides, compile skills, watch sources, serve machine retrieval, or enforce our lint rules. Knowing that boundary prevents a lot of wasted effort.

Self-hosting is total, not partial: the Scalar browser bundle is vendored into the site at build time, nothing loads from a CDN, and every Scalar cloud touchpoint is off: the request proxy, Ask AI, the hosted API client link, telemetry, the platform toolbar. This was a hosting decision change: everything is self-hosted in our infra now, NHA's later. The earlier hosted-for-speed stance in this plan is superseded, not a Phase 2 exit we are still working toward.

## What the site is

- Docusaurus for guides, navigation, theming, versioning.
- `@scalar/docusaurus` rendering one interactive reference per module spec file: `/reference/hiecm-gateway`, and `/reference/hiecm-m1` through `-m4`.
- Callbacks render inside each module's reference from its OpenAPI 3.1 `webhooks` section. There is no separate callback surface.
- Site search is a local build-time index (`@easyops-cn/docusaurus-search-local`), not a hosted search service.
- Spectral linting runs in our own CI, not a Scalar-hosted step.
- The catalogue version is stamped into the footer from `catalogue/VERSION`, so a reader can tell an agent which version they are looking at.

## What we build ourselves

- The atom bodies. Scalar renders markdown; it does not write guides.
- Navigation generation from frontmatter, because hand-maintained navigation drifts.
- The skill compiler.
- The source watcher, which is designed and not built.
- Our lint rules, including Spectral, run in our own CI.
- The Docs MCP server (see `support-agent` and the plan §6). This used to be something Scalar's hosted platform provided for free; now it is ours.

## Navigation is generated, never hand-edited

Docusaurus sidebars are a build output. The generator is `scripts/build-nav.mjs`, run from `site`'s `prebuild` and `prestart`. It walks the folder tree under `site/docs`, one platform per folder and one version per folder below it, reading a `_platform.json` beside the version folders for the display label, description and any extra picker entries. It does not read atom frontmatter and does not import `lib/atoms.mjs`, so it groups by folder, not by gateway, milestone and type. A page's placement is its path.

Hand-editing navigation is the same class of mistake as hand-editing a compiled skill. If a page is in the wrong place, move the file.

The generator writes exactly three things:

- `site/src/data/platforms.json`, the platform and version model
- `site/src/data/reference-links.json`, from the `api-sidebar.json` that `build-api-reference.mjs` wrote just before it
- `site/static/llms.txt`, an index of every page under `site/docs`

It emits no phase scope into the sidebar and no verification banner. Nothing under `site/src` renders a banner for an `unverified` or a `stale` atom: that was designed and is not built, so an honest phase and verification note has to be written into the page itself. The `catalogue_version` in the footer is real but is not this script's doing: `site/docusaurus.config.ts` reads `catalogue/VERSION` and puts it in the copyright line.

## Per-module reference routes

One Scalar reference per OpenAPI spec file, matching the module-per-file layout in `catalogue/openapi/hiecm/v3/`:

| Route | Spec file |
|---|---|
| `/reference/hiecm-gateway` | `hiecm-gateway.yaml`, the shared session token contract |
| `/reference/hiecm-m1` | `hiecm-m1.yaml` |
| `/reference/hiecm-m2` | `hiecm-m2.yaml` |
| `/reference/hiecm-m3` | `hiecm-m3.yaml` |
| `/reference/hiecm-m4` | `hiecm-m4.yaml`, Phase 2, exists in the layout but says so |

This skill's scope is HIE-CM M1 to M3. Three more modules and PHR services (`hiecm-p1.yaml` through `-p3.yaml`, `hiecm-phr-services.yaml`) render the same way and are out of scope here, not out of existence.

Each spec file is the whole contract for its module, callbacks included as `webhooks` entries. There is no AsyncAPI file anywhere in this stack; see `openapi-ingest` for the layout and `CONVENTIONS.md`.

## What replaced the lost hosted-Scalar features

Going fully self-hosted meant giving up what Scalar's hosted platform would have provided for free. Each loss has a deliberate, named replacement, not a silent gap:

| Hosted feature we do not have | What replaces it |
|---|---|
| A free Docs MCP at a Scalar-hosted URL | Our own Go Docs MCP server, `docs-mcp`, in the `mcp/` module of the abdm-docs repo. Nine tools over a CI-built SQLite snapshot. See `support-agent`. |
| A free Installation MCP (search mode, personal token, passthrough auth) | Superseded. Its search-mode value is covered by `docs-mcp`'s `get_operation` and `validate_request` tools. Execute mode stays a Phase 2 concern with per-caller credentials. |
| Ask AI answering questions on the site | No on-site assistant in V1. Answer synthesis stays in the consuming agent (Claude Code, the support agent) over `/mcp`. An assistant can be added in front of `/api/search` later; it does not exist yet. |
| Hosted search over published content | A local build-time index (`@easyops-cn/docusaurus-search-local`), plus `docs-mcp`'s `/api/search` endpoint for anything that needs the same retrieval the MCP uses. |
| A mock server generated from the OpenAPI files | Not built. Unbuilt until something needs it. The first-day developer test relies on real sandbox credentials, applied for early, not a mock. |
| Scalar Versions mapping to NHA spec versions | Docusaurus versioning, if and when it is needed; not wired up as a hosted feature. |
| Preview deploys per pull request, GitHub sync, publish from CLI | Our own CI: build the Docusaurus site in the deploy pipeline, publish on merge. See `update-pipeline`. |

## Content constraints that protect portability

Principle P6 says no lock-in. In practice:

- Keep prose in plain markdown. Use MDX only for callouts and steps.
- No Scalar-specific component carrying meaning that would be lost in plain markdown.
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
