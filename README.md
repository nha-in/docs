# ABDM Developer Portal

Documentation for the HIE-CM gateway (ABDM V3), built as one catalogue that
renders for humans and compiles for machines.

## Repository layout

```
catalogue/            Source of truth. Nothing downstream is hand-maintained.
  hiecm/              Typed atoms for the HIE-CM gateway
                      (concepts, flows, endpoints, callbacks, errors, tests, decisions)
  shared/             Gateway-neutral atoms (glossary, fhir, sandbox)
  openapi/            API specifications
    .raw/             Upstream NHA files, stored untouched
    corrections/      Recorded patches to upstream files, never silent fixes
    hiecm-v3.yaml     Cleaned HIE-CM V3 OpenAPI (placeholder until ingestion)
    callbacks.asyncapi.yaml   Callbacks modelled as AsyncAPI channels
  VERSION             Catalogue version stamp
site/                 Docusaurus site with Scalar API references (a rendering,
                      not a source; site/static/specs is generated)
scripts/              Build helpers (spec sync; later: nav generation, atom lint)
```

## Working on the site

```bash
npm install
npm start          # dev server; syncs specs from catalogue/openapi first
npm run build      # production build
npm run lint:specs # Spectral lint over catalogue/openapi
```

The API reference is served at `/reference/hiecm`, rendered by
`@scalar/docusaurus` from `catalogue/openapi/hiecm-v3.yaml`. Edit specs only
in `catalogue/openapi/`; `site/static/specs/` is overwritten on every build.

## Self-hosting

The site uses only the MIT licensed open source Scalar packages and serves
everything from its own origin:

- The Scalar reference bundle is vendored from `@scalar/api-reference` into
  `site/static/vendor/scalar/` at build time; nothing loads from a CDN.
- No Scalar cloud services: the request proxy, Ask AI agent, API client
  link-out, and telemetry are all disabled in `site/docusaurus.config.ts`.
- "Try it" requests go directly from the browser. Target APIs must allow
  CORS, or `proxyUrl` must point to a proxy in our own infrastructure
  (Scalar's proxy server is open source and self-hostable).
- MCP servers and agents over this documentation will be built by us on top
  of the catalogue, not taken from a hosted service.

## Rules

- The catalogue is the source. Fix the atom or the spec, then rebuild.
- Corrections to NHA files are recorded in `catalogue/openapi/corrections/`,
  never applied silently.
- Never claim verification that was not observed against the sandbox.

## Licence

MIT, copyright National Health Authority (NHA). See [LICENSE](LICENSE).
