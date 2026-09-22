# Ledger: AI Sandbox Observations v1.0, PHR WEB ISSUE sheet

Source: `AI Sandbox Observations v1.0.xlsx` in this folder. Checked against the PHR V3 document (held outside git, hash in `../nha-2026-09-21-review/MANIFEST.md`), the PHR and Locker swagger and collection in `../nha-2026-09-16/phr/`, and the page data `scripts/build-api-reference.mjs` writes. Spec edits live in `scripts/ingest-nha.mjs` section 13 and are logged in `catalogue/openapi/corrections/2026-09-16-final-set.md`.

Nothing here was sent to the sandbox. "Applied" means the published page now matches the PHR V3 document, not that a call was observed to succeed.

## Root causes behind the "wrong request API or body" rows

**R1. P2 gateway calls rendered against the ABHA host.** `hiecm-p2.yaml` lists `https://abhasbx.abdm.gov.in` first and `https://dev.abdm.gov.in` second, and the generator took the first server for every page. All 17 P2 calls on `/api/hiecm/...` printed an ABHA service URL. Fixed: those paths carry the gateway server, and the generator reads path and operation `servers`.

**R2. Required query parameters were missing from the samples.** The curl, Python and Node samples were `server + path`, so a list call went out without its `limit`. Fixed in `requestFor`: required query parameters join the URL, and the curl quotes a URL that has a query. This touches every module's list calls, not only P2 to P4.

**R3. The approve subscription example contradicted itself.** It set `isApplicableForAllHIPs: false` and then included and excluded the same HIP. Fixed: `hip` is optional as the document marks it (8.3.4), and the example is the collection's.

**R4. The curl pasted in the sheet is a Postman variable problem.** `https://dev.abdm.gov.in//api/...`, `X-AUTH-TOKEN: https://dev.abdm.gov.in/` and `Authorization: Bearer null` come from NHA's own collection with `base-url` ending in a slash, `auth-token` set to the host, and no bearer token. The path and body in that curl match the collection and our page. Nothing to change on the portal.

## Rows

| # | Row (sheet text) | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Management → Consents Management | APPLIED | `p2.label` in `ingest-nha.mjs` is `P2 Consents Management`; sidebar, P2 errors page, authentication and error code pages follow |
| 2 | Scroll issue MacBook, P1 session page | APPLIED, not deployed | `ca4125e58` removed the gesture that left the reference when the page was pulled past the top. It was on `docs/m2-care-context-links`, not `main`, when the sheet was written |
| 3 | Aadhaar flow registration, Aadhaar number API missing | APPLIED | Journey `p1-create-abha-number-aadhaar-otp` restored in `journeys/p1.yaml`; steps name the M1 operations. P1 page registration table and diagram add the Aadhaar number route. Reverses `705416d4d` |
| 4 | Update email, deprecated | APPLIED | Journey `p2-update-email` removed; the P2 page no longer lists it. The shared OTP calls keep their other examples |
| 5 | Get the historical token numbers → OPD Token History | APPLIED | `catalogue/titles.yaml` |
| 6 | Share patient share → OPD token generation | APPLIED | `catalogue/titles.yaml` |
| 7 | Patient share → Quick OPD Registration | APPLIED | journey title in `journeys/p2.yaml` |
| 8 | Discover his/her health records, wrong body | APPLIED (R1) | Host fixed. Body kept as `hip.id`: the swagger and collection send it; the document's 10.3.1 table says `hipId` but its own example sends `hip`. Q1 |
| 9 | Approve subscription request, pasted curl | NO CHANGE (R4) | See R4. R3 applies to the page's example |
| 10 | Fetch the record for provider details, wrong API | NO CHANGE | Page already `GET https://dev.abdm.gov.in/api/hiecm/gateway/v3/providers/{provider-id}`, as the document (10.3.14) and collection. Q2 |
| 11 | Disable the auto-approval policy | APPLIED (R1) | Host fixed. Path parameter kept as the auto approval id; the document names it `consentId`. Q3 |
| 12 | Enable the auto-approval policy | APPLIED (R1) | As row 11 |
| 13 | Fetch all the consent request details of a patient | APPLIED (R1, R2) | Host and `limit` fixed; X-AUTH-TOKEN described as the PHR login token (6.16) |
| 14 | Get the consent request details by REQUEST-ID | APPLIED (R1) | Host; X-AUTH-TOKEN (6.17) |
| 15 | Approve the consent request raised by HIU | APPLIED (R1) | Host; X-AUTH-TOKEN. The document has no section for this call. Q4 |
| 16 | Deny the consent request raised by HIU | APPLIED (R1) | Host; X-AUTH-TOKEN (6.21) |
| 17 | Request artefact by REQUEST-ID | APPLIED (R1) | Host; X-AUTH-TOKEN (6.18) |
| 18 | Fetch the consent artefact details by artefact id | APPLIED (R1) | Host; X-AUTH-TOKEN (6.19) |
| 19 | Fetch all the consent artefact details of a patient | APPLIED (R1, R2) | Host, `limit`; X-AUTH-TOKEN (6.20) |
| 20 | Approve subscription request | APPLIED (R3) | Example and `hip` requiredness |
| 21 | Deny subscription request | NO CHANGE | Page matches the collection. The document's URL has a typo (`subscriptionrequests`) |
| 22 | Fetch his/her subscription requests details | APPLIED (R2) | `limit`, `offset`, `status` required as 8.3.1 marks them; the curl now sends them |
| 23 | Fetch his/her subscription details by subscription REQUEST-ID | NO CHANGE | Page matches the document (8.3.13) and collection. Q2 |
| 24 | Get all the consent and subscription requests with given filters | APPLIED (R2) | The five query parameters now reach the curl |

## Questions for NHA

- **Q1.** Discover (10.3.1): the body table says `hipId`, the example, swagger and collection send `hip: {id}`. The portal publishes `hip.id`. Confirm.
- **Q2.** Rows 10 and 23 are marked wrong, but the published method, host, path and headers match the PHR V3 document and the collection. Which request or response did the tester see fail?
- **Q3.** Auto approval enable and disable: the document names the path parameter `{{consentId}}`. The portal uses the auto approval id the create call returns. Confirm.
- **Q4.** Patient approve of a consent request (`POST /api/hiecm/consent/v3/request/{request-id}/approve`) has no section in the PHR V3 document. Send the request and response to document.
