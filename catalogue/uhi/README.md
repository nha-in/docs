# UHI atoms

UHI atoms live on the docs pages, not in this folder. Each atom is a page
section with an explicit heading id, and `catalogue/map.d/uhi-*.yaml` maps the
atom id to that section:

| Map fragment | Pages |
| --- | --- |
| `uhi-network.yaml`, `uhi-consultation.yaml`, `uhi-ambulance.yaml` | One notes partial per operation, `site/docs/_notes/uhi/<operationId>.mdx`, rendered on that operation's API page |
| `uhi-concepts.yaml` | `site/docs/uhi/v1/concepts/`, and the Get started and Build it well pages |
| `uhi-services.yaml` | `site/docs/uhi/v1/services/` |
| `uhi-pages.yaml` | Sandbox, Go live, the Quickstart, the test case pages and `site/docs/_glossary/_uhi.mdx` |

`npm run build:sections` writes the atom files every consumer reads into
`catalogue/generated/uhi/`. Never edit those: edit the page, then rebuild. The
folders here stay empty; an atom is either a page section or a file, never
both, and UHI's are all page sections.
