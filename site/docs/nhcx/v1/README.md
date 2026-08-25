# NHCX V1

The sections of this version. Each folder is a sidebar section; `index.md`
here is the landing page readers see first.

| Folder | Renders as |
| --- | --- |
| `getting-started/` | Overview tab, first section: orientation, onboarding, glossary |
| `registries/` | Overview tab: the registries this gateway touches |
| `concepts/` | Overview tab: core concepts, one page per concept |
| `api/` | API references tab: module guide pages; endpoint pages are generated from the OpenAPI specs |
| `reference/` | API references tab: cross-module reference material |

Drop a `.md` file in the right folder and it renders. Order pages with
`sidebar_position` in the frontmatter; name and order a folder with
`_category_.json`.

