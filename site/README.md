# Site

The developer portal's Docusaurus site: pages and the interactive Scalar
API references, generated from [`../catalogue`](../catalogue). Nothing
under `docs/`, `static/specs/` or `static/skills/` is hand-edited — all
three are overwritten by the build: pages from the catalogue's atoms,
specs from its OpenAPI files, and skills by `scripts/build-skills.mjs`
(which also copies in the committed skills from `plugins/abdm/skills/`).

```bash
npm install
npm start          # dev server, live reload; syncs specs first
npm run build      # production build, into build/
npm run lint:specs # Spectral lint over catalogue/openapi
```

One interactive reference per module, served at `/reference/hiecm-m1`
through `/reference/hiecm-m4` plus `/reference/hiecm-gateway`, each
rendered by `@scalar/docusaurus` from its file in `catalogue/openapi/`.

## Self-hosting

The site depends on nothing outside its own origin:

- The Scalar reference bundle is vendored from `@scalar/api-reference`
  into `static/vendor/scalar/` at build time; nothing loads from a CDN.
- No Scalar cloud services: the request proxy, Scalar's own AI assistant,
  the API client link-out, and telemetry are all disabled in
  `docusaurus.config.ts`.
- "Try it" requests go straight from the browser to the target API, which
  must allow CORS, or through `proxyUrl` pointed at a proxy in our own
  infrastructure.

## The Ask AI widget

The chip in the top bar is not a component of this site. It is
`<abdm-support-agent>`, the standalone widget in [../widget](../widget), built
into `static/agent/` on every `prestart` and `prebuild` and loaded by a script
tag. The site places the element and sets its attributes, exactly as any other
embedder would, and styles only the box it sits in.

It streams answers from the [Docs MCP server](../mcp)'s chat endpoint, whose
address comes from the `CHAT_URL` build environment variable; the MCP server's own address for
the install instructions on the MCP page comes from `MCP_URL`. Leaving
either unset keeps that part of the site in a clearly labelled preview
state rather than pointing at nothing — so a build with no backend
configured (Pages, a PR preview) still ships cleanly.
