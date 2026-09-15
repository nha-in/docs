# NHCX V1

Ported from the NHCX package by its `make ekadocs` target (`system/build-ekadocs.mjs`).
Everything in this folder is replaced on every port, so change the package and port again
rather than editing a page here.

| Folder | Renders as | From the package |
| --- | --- | --- |
| `index.md` | The landing page | `docs/01-Overview/01-Introduction.md` |
| `getting-started/` | Overview tab: the base framework, first to last | `docs/02-Getting Started`, and the glossary |
| `roles/` | Overview tab: one path per role | `docs/03-Building a Provider`, `docs/04-Building a Payer` |
| `registries/` | Overview tab: participants and policies | `docs/01-Overview/03-Participants and Policies.md` |
| `concepts/` | Overview tab: how a claim moves, use cases, workflow codes, PMJAY | `docs/01-Overview` |
| `go-live/` | Overview tab: leaving the sandbox | `docs/07-Go Live` |
| `troubleshooting/` | Overview tab: what to check, by the symptom you see | `docs/08-Troubleshooting` |
| `api/` | API references tab: one module per Bruno folder | `apis/` |
| `reference/` | API references tab: lookups, and the FHIR bundles under `fhir/` | `docs/06-Reference`, `docs/05-FHIR Reference` |
