# HIE-CM

Everything the HIE-CM gateway has, in one folder.

| Folder or file | Holds |
| --- | --- |
| `map/` | The content map: each atom id and the page section that holds its words. One file per batch. |
| `openapi/v3/` | One specification per module, with `journeys/` (call order) and `errors/` (each module's codes). |
| `openapi/corrections/`, `openapi/.raw/` | Our recorded patches, and NHA's upstream files stored untouched. |
| `titles.yaml`, `postman.json` | Reference page title overrides, and the published Postman collection ids. |
| `concepts/` `flows/` `endpoints/` `callbacks/` `errors/` `glossary/` `tests/` `decisions/` `troubleshooting/` | One atom file each. A file marked `generated: true` is written from its page by `npm run build:sections`; edit the page, never the file. The 20 design rules in `concepts/` and all but link token in `glossary/` are hand-written. |

READMEs are contributor notes, never indexed.
