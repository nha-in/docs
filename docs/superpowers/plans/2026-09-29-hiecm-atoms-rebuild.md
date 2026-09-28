# HIE-CM atoms rebuild (2026-09-29)

**Why.** Commit `64eb95b506` (2026-09-16) deleted all 256 HIE-CM atoms with the retired NHA sources. The instruction was to remove the old source files, not the knowledge derived from them. HIE-CM fell to 20 atoms against NHCX's 536, and Ask AI began answering HIE-CM questions from NHCX atoms (18 of 100 HIE-CM eval questions get an NHCX first hit).

**Goal.** Every deleted HIE-CM atom is back, under its original id, as a page section in the page-canonical structure (`2026-09-28-page-canonical-knowledge-atoms.md`), with its agent-only rules in `<AgentOnly>` on the page, and every fact true to NHA's final set of 16 September 2026.

**Base.** Branch `feat/hiecm-atoms-rebuild`, stacked on `feat/docs-mcp-retrieval` (which carries contract v2's `operation` field and the retrieval gate).

## Inventory

256 atoms recovered from `64eb95b506^:catalogue/hiecm/`: 138 endpoints, 35 callbacks, 39 errors, 21 flows, 14 concepts, 5 troubleshooting, 3 decisions, 1 test; 101,647 words. 26 ids are cited by eval cases. Endpoint and callback atoms against the final specs: 85 match one operation, 26 match several journey variants, 7 match a moved path, 35 callbacks need the specs' `webhooks`, 20 name a path the final set does not have.

## Rules for every rebuilt atom

1. Original id, so evals and citations resolve again.
2. The old atom is a draft, not a source. Every API literal (path, header, field, code, status) is checked against `catalogue/openapi/hiecm/v3/`. What the final set contradicts or no longer has is dropped and listed in the batch's report with the reason; nothing is restored on the retired documents' authority.
3. Visible page text follows `page-authoring`, `nha-voice` and `writing-guide`: written as ABDM, no em dash. The old atom's In plain words becomes the section's visible text; its other four sections become labelled `<AgentOnly>` paragraphs (`**Before you start.**`, `**What happens.**`, `**How you know it worked.**`, `**When it goes wrong.**`), cut to what an agent needs.
4. A map entry per atom, with `operation` on endpoint and callback atoms (contract v2), `related` carried over where the target exists.
5. `npm run check:sections`, `lint:atoms`, `lint:content`, `test:scripts`, the site build, and the retrieval gate before and after each batch. No case may fall; the 26 eval-cited ids should rise.

## Destinations

| Old type | Destination |
|---|---|
| concept, decision | a section on the matching HIE-CM concept page, or a new concept page |
| flow | a section on the milestone or journey page for that flow |
| troubleshooting, test | a section on the HIE-CM troubleshooting or certification page |
| endpoint, callback | a hand-written notes partial per operation, `site/docs/_notes/hiecm/<operationId>.mdx`, rendered on that operation's generated API page |
| error | a section per code in a hand-written partial per module, rendered on that module's generated error page |

## Tasks

- [x] **H1. Infrastructure.** `build-sections` reads `catalogue/map.yaml` plus `catalogue/map.d/*.yaml`, so batches do not collide. `build-api-reference.mjs` renders `site/docs/_notes/hiecm/<operationId>.mdx` on the operation's page and `site/docs/_notes/hiecm/errors/<module>.mdx` on the module's error page when present. `loadOps` also reads `webhooks`. Tests for each.
- [x] **H2. Concepts, decisions, flows, troubleshooting, test (44).**
- [x] **H3. Endpoints and callbacks (173), one batch per module.** M1, M2, M3, M4, P1, P2, P3.
- [x] **H4. Errors (39), one partial per module.**
- [x] **H5. Plan, contributor plugin and runbook updated; the HIE-CM class recorded in the page-canonical plan.**

Each batch reports: ids rebuilt, literals dropped with reasons, ids not rebuilt with reasons, gate before and after.

## As built

227 of 256 atoms are back, under their original ids. With the 20 design rules in `catalogue/hiecm/concepts/`, HIE-CM carries 247 atoms.

| Batch | Rebuilt | Not rebuilt |
|---|---|---|
| Pages: concepts, decisions, flows, troubleshooting, test | 43 of 44 | `hiecm.flow.m1-create-abha-by-document`: `enrol/byDocument` is not in the final set |
| M1 endpoints and callbacks | 41 of 52 | 11 calls: gateway certs, OIDC config, four benefit searches, enrollment encrypt, `enrol/byDocument`, the v3.1 login OTP, login search, account logout |
| M2 and M3 | 37 of 37 | none |
| M4 and P1 | 33 of 35 | the M4 Aadhaar OTP call and the P1 email OTP call |
| P2 and P3 | 48 of 49 | the P3 edit-subscription callback |
| Errors | 25 of 39 | 14 codes, 6 AS- and 8 HIS-, that no final specification contains; their meanings came only from retired files |

All 29 are left out for one reason: the final NHA set of 16 September has no such call or code, and rule 2 forbids restoring one on the retired documents' authority. `git log` on this branch lists them in each batch's commit body.

**Placement decisions.**

- M4 has no generated error page, so an M4 error atom would have had no partial to sit in. None of the M4 error codes was rebuildable, so none needed one.
- `m1-receive-patient-share` sits in the notes partial of the scan-and-register operation that ABDM calls on the integrator's side, since that is the call it documents; its map entry keeps `milestone: M1`.

**H1 follow-ups, open.**

- Operation notes do not reach an API page's `.md` copy. `emit-page-markdown` skips `_notes` as a partial, so the notes render on the site and reach the atoms, but not the page's markdown copy or llms-full.txt.
- The error generator skips a code sent with a trailing `": "`, so `ABDM-1016` is missing from the M1 codes table even though its atom section renders under it.

**Retrieval gate.** Against the pre-rebuild baseline, with the glossary preference for definition-shaped questions (commit 3cb6bf275) and one stale expectation corrected (the link token lifetime question, which the rebuilt `m2-generate-link-token` and `m2-on-generate-token-result` now answer): mrr 0.505 to 0.607, hit@1 46 to 57, hit@3 61 to 73, hit@10 76 to 87. Eight cases still fall one to five places, and the owner accepted them on 29 September 2026: three sandbox-integration questions, three functional-testing questions, the ECDH data-flow question and the expired-link-token question. In each, rebuilt HIE-CM atoms that share the question's words interleave above the expected atom. Ranking changes for them are a follow-up measured on their own, not tuned to these questions.
