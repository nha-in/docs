# Contributing content

The portal renders from two kinds of files. Where you put a file is where it
renders; no config or code changes are needed, and merging to `main` deploys.

| You are adding | You write | It goes in |
| --- | --- | --- |
| A documentation page | Markdown (`.md`, or `.mdx` for components) | `site/docs/<platform>/<version>/...` |
| API reference | OpenAPI 3.1 YAML | `catalogue/openapi/<platform>/<version>/<spec>.yaml` |

## Documentation pages (Markdown)

The docs tree is the navigation. Under `site/docs`:

```
site/docs/
  <platform>/                a gateway in the picker: abdm, uhi, nhcx, ...
    _platform.json           label, description, picker order, unpublished-version notes
    <version>/               v3, v1, ... newest folder becomes the default
      index.md               the platform's landing page
      getting-started/       Overview tab, first section
      registries/            Overview tab, second section
      concepts/              Overview tab, third section
      api/                   API references tab (module guide pages)
      reference/             API references tab, cross-module reference section
  whats-new/                 What's new tab
  support/                   Support tab
```

- **Add a page**: drop a `.md` file in the folder for the section it belongs
  to. A plain file with an `# H1` renders as-is; no frontmatter is required.
- **Order it**: add `sidebar_position: <n>` to the frontmatter. Files without
  a position sort alphabetically after positioned ones.
- **Add a subsection**: create a folder. An optional `_category_.json`
  (`{"label": "...", "position": n}`) names and orders it; a folder with an
  `index.md` uses that page as its landing page.
- **Add a version**: create `site/docs/<platform>/<v-next>/`. It appears in
  the version picker; the newest version becomes the default.
- **Add a platform**: create `site/docs/<platform>/` with a version folder
  inside and a `_platform.json` beside it. It appears in the platform picker.

Underscore-prefixed files and folders (`_servers.md`, `_glossary/`) are
partials: importable, never rendered as pages. Every folder also carries a
`README.md` saying what belongs in it; READMEs are for contributors on GitHub
and are never rendered either.

## API references (YAML)

Drop an OpenAPI 3.1 file at `catalogue/openapi/<platform>/<version>/<name>.yaml`.
The build generates, per spec:

- one documentation page per operation and webhook, grouped by use case
  (`x-abdm-use-case`, falling back to tags), under the module's sidebar entry
- an interactive Scalar reference at `/reference/<name>` (the filename stem)
- the aggregated Authentication, Callbacks and Error codes reference pages

Name the module in the spec's info block:

```yaml
info:
  x-portal:
    module: m1            # folder under docs/<platform>/<version>/api/
    label: M1 ABHA identity
    position: 2           # order among the platform's modules
```

Without `x-portal`, the filename stem is the module folder, `info.title` the
label, and modules sort alphabetically. Hand-written module guide pages
(overview, user journey, sequence) live in
`site/docs/<platform>/<version>/api/<module>/` next to the generated content;
never edit anything under `endpoints/` — it is overwritten on every build.

## Moving or renaming a page

Old URLs must keep working. Add a redirect in `site/docusaurus.config.ts`
under the `@docusaurus/plugin-client-redirects` block, and update links that
pointed at the old URL (the build fails on broken links, so it will tell you).

## Release

CI builds the site on every pull request; a broken page or link fails the
build, so bad content cannot merge. Merging to `main` deploys via the Pages
workflow. To check locally:

```bash
npm run build --workspace site
```
