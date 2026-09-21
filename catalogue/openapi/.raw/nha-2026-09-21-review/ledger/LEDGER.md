# NHA review ledger, 22 September 2026

Branch `fix/nha-review-abha-m1`, PR #20. One row per NHA instruction, grouped by the document it came from. Status is what the branch shows after this session's fixes. Full row-level detail is in `ledger-m1.md`, `ledger-m2.md`, `ledger-m3-m4.md` and `ledger-phr.md` beside this file.

## Sources

| Drop | Document | Where it is | sha256 (first 12) |
| --- | --- | --- | --- |
| 15 Sept | Sandbox2.0 M1 getting started and glossary | `.raw/nha-2026-09-15-review/` | 60cdaec1e00c |
| 15 Sept | Sandbox2.0 M2 and M3 API review | same | 0c4d265ae245 |
| 15 Sept | Sandbox2.0 M2 flow review | same | 7ca7d84c7a0b |
| 15 Sept | Sandbox2.0 M3 flow review | same | 4daaf346e899 |
| 16 Sept | Final swagger set, 14 files | `.raw/nha-2026-09-16/` | see MANIFEST |
| 16 Sept | ABDM Final Swagger Review 16 Sept 2026 (our findings to NHA) | Downloads only | 5d996fdea866 |
| 17 Sept | Milestone 4 Document | `.raw/nha-2026-09-21-review/` | da4ca201a038 |
| 21 Sept | PHR - Sandbox (2) | same | 49de847290e3 |
| 21 Sept 19:30 | M1.docx | same | 85c9ce99997a |
| 21 Sept 19:30 | ABHA Updated Content Sbx 2.0 | same | 4e179e0236d9 |
| 21 Sept 19:30 | Sandbox2.0 M2 and M3 API review v2 | same | 1598720e3dc6 |
| 21 Sept 19:30 | Sandbox2.0 M3 flow review-21-09-2026 | same | 0416df132bc1 |
| 21 Sept 19:30 | Patient record share API document and Postman | `.raw/nha-2026-09-21-record-share/` | 2d3ba3761a8a |
| 21 Sept | ABHA PHR V3 Updated | same, redacted copy | 3c7251acfdc8 (original) |
| 22 Sept | ABHA Swagger split (reissued M1) | `.raw/nha-2026-09-22/` | 110ea5ff5923 |

The four 15 Sept files NHA resent on 21 Sept are byte-identical to the 15 Sept set. "AI Sandbox Observations Patient Record.docx" is byte-identical to the record share document already in the repo.

## Results by document

### M1.docx (7 asks on the M1 API reference)

| ID | Ask | Status | Evidence |
| --- | --- | --- | --- |
| API-1 | Description of all body parameters | APPLIED this session | 0 of 493 M1 body fields blank; `ingest-nha.mjs` section 10, 34 fields described |
| API-2 | Session heading holds the session API and the public key API only | APPLIED, see D1 | NHA's reissued swagger groups request/token and certificate as "Access Tokens & Encryption"; the session API is in the Gateway module |
| API-3 | Keycloak renamed Generate Access Token | APPLIED | gateway sessions summary "This API is invoked to generate access token"; 0 hits for Keycloak |
| API-4 | Client id and secret explained consistently | APPLIED | clientId, clientSecret descriptions in `ingest-nha.mjs` section 10 |
| API-5 | No callback on the session API | APPLIED | `build-api-reference.mjs` skips the callback link on the session 202 |
| API-6 | Public key description corrected | APPLIED | description is NHA's sentence |
| API-7 | search-abha in scope | APPLIED this session | scope described and constrained on all five Find ABHA search variants; the edit had missed the split paths |

### ABHA Updated Content Sbx 2.0

| ID | Ask | Status | Evidence |
| --- | --- | --- | --- |
| ABHA-1 | Remove the Self-Declared to KYC paragraph, the Aadhaar pathways paragraph and the creation route table from M1 | REMOVED-OK | 0 hits on m1.mdx |
| ABHA-2 | Remove the child ABHA Create, Update, List block from M1 | REMOVED-OK | 0 hits |
| ABHA-3 | Replace the ABHA registry page wholesale | APPLIED | abha.md is NHA's text; "seamless" dropped per the ledger's banned-word rule (this session); frontmatter source updated |

### Sandbox2.0 M2 and M3 API review, v1 (15 Sept) and v2 (21 Sept)

| ID | Ask | Status | Evidence |
| --- | --- | --- | --- |
| M2A-01 | HIP initiated linking rows Done | APPLIED | journeys/m2.yaml order |
| M2A-02 | "Only one is required not all" on notification.hip of link/context/notify | APPLIED this session | required is [id]; the screenshot in the docx identifies the field |
| M2A-03 | sms/notify2 Done | APPLIED | |
| M2A-04 | Correct curl on on-discover | APPLIED this session | host, headers and body match NHA's curl; the error object no longer appears in the success example |
| M2A-05 | on-init Done | APPLIED | |
| M2A-06 | on-confirm names careContexts[].referenceNumber and display | APPLIED | |
| M2A-07 | hip/on-notify headers and curl | APPLIED | REQUEST-ID, TIMESTAMP, X-CM-ID and bearer |
| M2A-08 | hip/on-request headers and curl | APPLIED this session | curl now carries hiRequest and response; the anyOf had no example |
| M2A-09 | health-information/notify under M2, marked Not Found | APPLIED | copied to M2 by the ingest script; page exists |
| M2A-10 | Callbacks Done | APPLIED | |
| M2A-11 | hip/notify callback Missing | APPLIED | m2-callbacks/08 |
| M2A-12 | Discovery callback: missing sequence and callbacks reference | APPLIED this session | every M2 callback names the call it belongs to; the M2 diagram draws the sequence |
| M3A-01 | HIU name not required, in curl too | APPLIED this session | schema and example |
| M3A-02 | status, hiu/on-notify, fetch, notify Done | APPLIED | |
| M3A-03 | hiu/on-notify: v0.5 becomes v3, marked Not Found | APPLIED | 0 hits for v0.5; page exists; old URL redirects |
| M3A-04 | Explain all key materials | APPLIED | cryptoAlg, curve, dhPublicKey, nonce described |
| SUG-1 | Arrange calls in Postman sequence | APPLIED | journeys are the Postman folders in order |
| SUG-2 | All callbacks in one section after the calls | APPLIED | "Callbacks" is the last group in M2 and M3 |
| ERR-1 | Custom error code page for M2 | APPLIED | 127 rows, 103 codes, NHA's lead sentence, in NHA's order |
| URL-1 | Nine endpoint URLs cited in the review | APPLIED this session | redirects in docusaurus.config.ts |

### Sandbox2.0 M2 flow review (15 Sept)

19 rows: 15 APPLIED, 2 PARTIAL fixed this session (the extra P2 sentence removed, NHA's record types sentence added), 1 NOT-APPLICABLE (title superseded by NHA's later brief naming, see D2), 1 STILL-PRESENT by design (the agent section, retitled with a purpose sentence; NHA asked what it was for rather than striking it).

### Sandbox2.0 M3 flow review, 21 Sept

18 rows: 17 APPLIED, 1 fixed this session (diagram participant renamed Application/System as NHA's legend names it). Both "to be removed" paragraphs are gone.

### Milestone 4 Document

35 rows: 33 APPLIED after this session's fixes (NHA's paragraph order restored, nine word-level drifts corrected, the Facility-Bridge linkage subheading added, the 12 character facility ID in the Journey 4 diagram, the non-NHA "not a step by step guide" caution removed). 2 remain: M4-15 the testing use cases link, and M4-37 the test cases, both blocked on NHA (Q3 below). The HPR glossary entry is NHA's M4 text.

### PHR - Sandbox (2)

1 row, the whole page: APPLIED this session. "seamless" dropped per the banned-word rule.

### Sandbox2.0 M1 getting started and glossary (15 Sept)

166 rows: 68 APPLIED, 29 REMOVED-OK, 57 NOT-APPLICABLE (44 rows are the sbxai.abdm.gov.in landing page, which is not in this repository; 10 are the testing pages taken down pending NHA's cases; 3 unmarked). Open after this session:

| ID | Item | Status | Note |
| --- | --- | --- | --- |
| M1-1, M1-3 | Page title "Milestone 1: ABHA Creation and Management" | DECISION D2 | The page reads "M1 Identity: Create and verify ABHA" |
| M1-35 | Two old sentences after the login diagram | fixed this session | m1.mdx |
| GL-33..36 | "(M1 Identity), ABHA Creation and Verification" labels in glossary entries | DECISION D2 | Tied to the naming decision |
| RES-10/14/18 | Replace the M1, M2, M3 test cases | BLOCKED on NHA | Q3 |

### ABHA PHR V3 Updated

Endpoints 84 rows, flows 28, content 25. Fixed this session, all through `ingest-nha.mjs` section 13 so the raw file stays as received:

- 24 PHR operations carry the gateway session token (the swagger named an undefined scheme, apiKeyAuth).
- Every /phr/app request body marks its fields required, as the document does; email on the address suggestion stays optional.
- X-AUTH-TOKEN on get profile, QR code and PHR card.
- excludedSources optional on approving a subscription.
- Encrypted mobile, login id, OTP and password examples no longer read as the photograph placeholder.
- Journeys: PHR certificate first; ABHA OTP registration without the verify user call; email routes titled optional.
- Pages: P1 names every login route including Aadhaar number, marks email optional, states token lifetimes and both base URLs; profile, card and QR code move to P2; the PHR concept and encryption pages say the PHR key is not the ABHA key.

Open, for NHA (Q4 to Q10 below): the loginHint value on Aadhaar number login, ABDM-1006 against ABDM-1107, 900902 as 400 or 401, the deLink call with no specification, face verification login with no API, the T-token on verify user, and the four operations in the swagger that the document does not list.

## Fixes outside NHA's asks, found while checking

| Item | Status |
| --- | --- |
| MCP Go test expected the pre-split M1 operation ids; CI red | Fixed, commit 4913fac8b |
| The last PR commit deleted the P1 skill's SKILL.md and scaffold instead of regenerating them | Restored (rode in commit 3fbacffc2; re-sliced before push) |
| 16 callback pages in P2, scan and pay, scan and register and subscription said their producing call "is not documented" | Fixed: all 54 callbacks paired; fallback sentence reworded |
| The skill sources under skills-src were stale against the journeys | Regenerated |
| Broken anchor on What's New 2026-09-15 | Fixed |
| M2 page: "robust" in NHA's own simplified milestone text | Kept, NHA's wording |

## Decisions for Sam

- **D1. Session group in the M1 reference.** NHA's M1.docx asks for a "Session" heading holding the session API and the public key API. NHA's own reissued swagger of 22 Sept groups request/token and the certificate under "Access Tokens & Encryption", and the session API lives in the Gateway module. The branch follows the swagger. Say if you want the session API duplicated into M1 under a Session heading.
- **D2. Milestone page titles.** NHA's 15 Sept M1 review asked for "Milestone 1: ABHA Creation and Management". The branch uses "M1 Identity: Create and verify ABHA", following the 16 Sept ledger decision to keep the landing-page names, while NHA's M4 document title was applied verbatim ("Milestone 4 (M4): ..."). The four milestone titles are now in three styles. Choose one: NHA's per-document titles, the landing-page names, or the current mix.
- **D3. PHR V3 against the 16 Sept swagger where they disagree.** The branch follows the document for requiredness and headers. For the two example values where the swagger and the document differ (loginHint, ABDM-1006 against 1107) the branch keeps the swagger and the question goes to NHA. Say if you want the document's values applied blind.

## Questions for NHA

1. Ankit's consolidated feedback email (what to remove and add): not received.
2. Ajeeth's M2 and M3 Postman collection, for the API order: not received; the order follows the 16 Sept collection.
3. The M1 to M4 test cases: not received; the testing pages stay down and the M4 page cannot link to them.
4. PHR login by Aadhaar number: is loginHint "Aadhaar-number" (document) or "aadhaar" (swagger)?
5. "Invalid combinations of scopes": ABDM-1006 (document) or ABDM-1107 (swagger example)?
6. Missing credentials 900902: HTTP 400 (document) or 401 (swagger and gateway)?
7. /abha/api/v3/phr/app/login/profile/deLink is in the document's API listing with no section: please supply the request.
8. Face verification login (Aadhaar face, ABHA face) has diagrams and no API in the document.
9. verify/user needs a T-token in the swagger that the document does not name. Confirm.
10. Four operations in the swagger are absent from the document: emailVerificationLink (P1), getTokenDetails and consent approve (P2), subscription enable and disable (P3). Keep or drop?

## Verification state

| Gate | Result |
| --- | --- |
| ingest regenerates the 12 specs byte-identically | PASS |
| lint:specs, lint:journeys, lint:atoms, lint:questions, lint:sources, lint:annexure | PASS |
| check:plugins, validate:skills, check:routes, check:icons, lint:agent, lint:tables | PASS |
| plan-check, go test | PASS |
| lint:content | 0 errors; warnings only (page budgets NHA's content exceeds) |
| Regeneration is idempotent | PASS |
| Site build with the Pages base URL | pending final run |
| PR preview crawl, live crawl | pending |
