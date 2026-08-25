# UHI atoms

The knowledge base for the UHI gateway: one Markdown atom per fact, with
frontmatter (`id`, `type`, `gateway: uhi`, verification status). Atoms feed the
MCP index and compile into agent skills; they are not site pages.

| Folder | Holds |
| --- | --- |
| `concepts/` | One atom per concept a developer must hold: what it is, why it exists, how it behaves. |
| `endpoints/` | One atom per API operation: request, response, and the observed behaviour. |
| `callbacks/` | One atom per webhook the gateway sends back to your system. |
| `errors/` | One atom per error code or family: what it means and what to do. |
| `flows/` | One atom per end-to-end journey, stitching endpoints and callbacks in call order. |
| `decisions/` | One atom per integration decision: the options, the trade-off, the recommendation. |
| `tests/` | One atom per test case: what it proves functionally, and its exact pass and fail conditions. |

Scaffold a new atom with the `atom-new` skill so the frontmatter and the five
mandatory sections come out right. READMEs like this one are contributor
notes, never indexed.
