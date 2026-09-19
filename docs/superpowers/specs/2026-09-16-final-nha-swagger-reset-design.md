# Rebuild the catalogue and API reference on NHA's final Swagger set

Date: 2026-09-16. Branch: `feat/final-nha-swagger`, off `main`.

## Goal

Every API reference page, catalogue atom, compiled skill and generated file
on the portal is derived from one source: the set NHA supplied on 16
September 2026 ("Final Swagger Sept 16 2026.zip", 14 files), plus the M1
collection of 15 September, used for one thing only, the order of M1 calls.
No file, atom, page or generated output cites or carries content from any
earlier NHA document.

Hand-written site pages under `site/docs/` are out of scope: a separate
session is applying NHA's content review to them. This work hands that
session a list of the links it breaks.

## Decisions already taken

| Question | Decision |
|---|---|
| M1 swagger vs M1 collection | Swagger for shapes, paths, examples. Collection for call order only. Password and email examples dropped. Calls only the collection has (v3.1 login, download card) are not published. |
| Personal data in two raw files | Redacted copies committed; originals stay off git; a manifest records their sha256. |
| Module layout | Milestone modules: `gateway`, `m1`, `m2`, `m3`, `m4`, `phr`, plus two new: `subscription`, `scan-and-pay`. |
| Edits to NHA's files | Minimum to render, every edit logged in one correction file written by the ingest script. No schema changes. |
| Content with no source in the set | Deleted, except FHIR and UHI/NHCX, which stay. |
| Hand-written site pages | Not touched here. Owned by the content-review session. |

## Sources

`catalogue/openapi/.raw/nha-2026-09-16/` is the only raw folder after this
work. It holds the 12 clean files byte-exact, redacted copies of the two
files with personal data (`abha/M1 ABHA Swagger 1.yaml`,
`phr/PHR and locker.postman_collection.json`), the M1 collection of 15
September, and `MANIFEST.md` listing every file with its sha256 and, for the
two redacted files, the sha256 of the original and what was redacted.

Redaction replaces JWT values with `<TOKEN>`, 10-digit mobiles with
`<MOBILE_NUMBER>`, ABHA numbers with `<ABHA_NUMBER>`, ABHA addresses with
`<ABHA_ADDRESS>`, `*.abdm.gov.internal` hosts with the sandbox host, and
removes the webhook.site URL. Nothing else in the two files changes.

Deleted: every other folder under `.raw/`, all of `corrections/`, all of
`nha-drops/`, `catalogue/test-matrix-portal-calls.json`,
`site/src/data/test-matrix/`, and `catalogue/openapi/.raw/nrces-*.tgz` stays
(FHIR is kept).

## Module mapping

One rule, applied by the ingest script, no hand placement:

| NHA file | Goes to |
|---|---|
| `hiecm/gateway.yaml` | `gateway` |
| `abha/M1 ABHA Swagger 1.yaml` | `m1`, except `POST /api/hiecm/gateway/v3/sessions`, which `gateway` already carries |
| `hiecm/hip-initiated-linking.yaml`, `user-initiated-linking.yaml`, `link-token.yaml`, `patient-share.yaml` | `m2` for tags ending `-hip`, `phr` for tags ending `-phr` |
| `hiecm/consent-management-data-flow.yaml` | `m2` for `-hip`, `m3` for `-hiu`, `phr` for `-phr` |
| `hiecm/subscription.yaml` | `subscription` for `subscription-hiu` and `health-locker`, `phr` for `subscription-phr` |
| `hiecm/scan-and-pay.yaml` | `scan-and-pay` for `-hip` and `Utility`, `phr` for `-phr` |
| `phr/PHR and Locker Swagger.yaml` | `phr`, only operations whose method and path no other file declares |
| `M4/M4-HFR.json`, `M4-HPID.json`, `M4-HPR.json` | `m4`, with the nine operations shared by all three kept once, tagged `Registration` |

Expected counts: gateway 10, m1 30, m2 21, m3 12, m4 100, phr 63,
subscription 7, scan-and-pay 10. The script asserts these and fails loudly
if a rerun produces different numbers.

Within each module, an operation whose path is a callback (the integrator
receives it: paths under `/api/v3/hip/`, `/api/v3/hiu/`, `/api/v3/link/`,
`/api/v3/links/`, `/api/v3/patients/`, `/v3/patient/`, and
`/health-information/transfer`) becomes a `webhooks` entry per
`CONVENTIONS.md`. NHA's tag, summary and description are kept verbatim.

## The ingest script

`scripts/ingest-nha.mjs` reads the raw folder and writes the eight specs
under `catalogue/openapi/hiecm/v3/`. It is deterministic: rerunning it on the
same input produces byte-identical output. It performs only these edits, and
appends each one to `catalogue/openapi/corrections/2026-09-16-final-set.md`:

1. `operationId`: assigned where missing (M1), normalised where present
   (spaces, parentheses, duplicates) to `<module>_<slug-of-summary-or-path>`,
   unique across all eight files. NHA's original id, where one existed, is
   kept in `x-abdm-nha-operation-id`.
2. Callback paths moved to `webhooks`.
3. M4: the nine shared operations kept once; a one-line `summary` derived
   from `operationId` and path for every operation, marked
   `x-abdm-summary-derived: true`.
4. PHR: operations already declared elsewhere dropped from the `phr` module.
5. M1: header names normalised to `X-token`, `BENEFIT_NAME`,
   `TRANSACTION_ID`; `X-token` added to `PATCH /profile/account`.
6. Servers: the `gateway` module carries `dev.abdm.gov.in`; `m1` carries
   `abhasbx.abdm.gov.in`; M4 carries `apihspsbx.abdm.gov.in/v4/int`.
7. `openapi` set to `3.1.1` and `info` given the portal fields
   (`x-portal`, `x-abdm-gateway`, `x-abdm-module`, `x-abdm-phase`,
   `x-abdm-roles`, `x-abdm-sources` with hashes).
8. The M1 `info.description` is replaced by one sentence pointing at the
   getting-started encryption page. NHA's text carries the wrong cipher,
   the wrong certificate path and a third-party tool; it is not published.
   The full original stays in the raw file.

Nothing else: no schema, example, description or response is altered.
`x-abdm-errors` blocks are not written; see Errors.

## Journeys

A journey file per module, hand-written,
`catalogue/openapi/hiecm/v3/journeys/<module>.yaml`:

```yaml
- id: m1-create-aadhaar-otp
  title: Create an ABHA, Aadhaar OTP
  steps:
    - {op: gateway_sessions, example: default}
    - {op: m1_public_certificate}
    - {op: m1_enrollment_request_otp, example: "ABHA enrolment via Aadhaar-Send OTP"}
    - {op: m1_enrol_by_aadhaar, example: "Create ABHA by verifying OTP"}
    - {op: m1_enrollment_request_otp, example: "Mobile Update - Send OTP", optional: true}
    - {op: m1_enrollment_auth_by_abdm, example: "Mobile Update - Verify OTP", optional: true}
    - {op: m1_enrol_suggestion}
    - {op: m1_enrol_abha_address, example: "ABHA Address"}
```

`example` names an entry in the operation's request `examples` map, exactly
as NHA named it. A step may cite an operation from another module (the
session call). A journey is the unit the sidebar, the endpoint pages and the
skills are built from. The `x-abdm-use-case` extension and flow-atom
ordering are removed.

M1 journeys, from the 15 September collection folders: five creation
journeys (Aadhaar OTP, face, fingerprint, iris, demographic, child), the
login journeys (mobile, Aadhaar number, ABHA number by Aadhaar OTP and by
mobile OTP, biometric by face, fingerprint and iris, ABHA address by each
method), find ABHA (by mobile OTP, Aadhaar OTP, face, fingerprint, iris),
profile and card, mobile update, re-KYC, child KYC, benefit programmes,
session and tokens. Password and email journeys are not written.

Other modules: one journey per NHA tag in the order the file lists the
operations, callbacks placed after the call that triggers them. These are
the only journeys until NHA supplies flow documents.

## Generator changes

`scripts/build-api-reference.mjs`:

- Reads journeys instead of `x-abdm-use-case` and flow atoms. The sidebar
  for a module is its journeys in file order; each journey is a category
  whose items are its steps in order. An operation appears once per journey
  that names it, so `enrol/byAadhaar` renders five times under ABHA
  creation, each page opening on that journey's example.
- Page route: `api/<module>/<journey-id>/<n>-<operationId>`. Operations no
  journey names render under a final category "Other operations" in spec
  order, so nothing in a spec is unreachable.
- Errors: the module error page is generated from the `code` values found
  in the module's response examples, with NHA's message text, nothing else.
  The `x-abdm-errors` reader and the action column are removed.
- `x-abdm-requirement` badges are removed with their script.

`scripts/compile-skills.mjs`: a build skill's loops are its module's
journeys. Each loop lists the steps' curls from the spec examples and the
exit condition from the last step's 200 example. Error skills list the
module's error codes with NHA's message. `skills-src/` loops for retired
modules (`hiecm-p1/p2/p3-*`) are deleted; `phr-*`, `subscription-*` and
`scan-and-pay-*` are added as generated stubs.

Removed scripts: `build-requirements.mjs`, `build-test-matrix.py`,
`lint-annexure.mjs` (the annexure is deleted), and the flow-atom reader in
`build-atom-routes.mjs`. `check-source-freshness.mjs` reads
`MANIFEST.md`. `lint-atoms.mjs` unchanged. `package.json` scripts updated.

## Catalogue atoms

Deleted: all of `catalogue/hiecm/` (endpoints, callbacks, flows, errors,
tests, troubleshooting, concepts, decisions), `catalogue/annexure/`, and
these shared atoms that cite a retired document:
`shared/glossary/{abdm,abha-address,abha-number,care-context,consent-artefact,fhir,hfr,hie-cm,hiu,hip,hpr,nrces,nhpr,phr,request-id,txn-id,timestamp-header,x-cm-id}.md`,
`shared/sandbox/{callback-url,registration-and-credentials}.md`.

Kept: `shared/fhir/`, the remaining glossary entries, `shared/concepts/`,
`shared/decisions/`, `shared/sandbox/{first-fifteen-minutes,going-live,wasa}.md`
after a source check that none cites a retired document, `uhi/`, `nhcx/`.

Rewritten from the new set: the 18 deleted glossary entries are recreated
only where the final set defines the term (header glossary entries from the
spec parameters; `hip`, `hiu`, `phr` from the tag descriptions). Entries the
set does not define are not recreated.

No endpoint, callback, flow or error atoms are written. Endpoint pages
render from the spec. Error pages render from examples. Atoms for these come
back when NHA supplies flow and error documents.

## Site

Generated: `site/docs/hiecm/v3/api/**` and `site/src/data/api*` are rebuilt
by the generator. `site/static/specs/` is synced. `site/static/skills/` and
the plugin skills are recompiled.

Hand-written pages are not edited. The build's broken-link report is written
to `docs/superpowers/plans/2026-09-16-broken-links-for-content-session.md`
and handed to the content-review session. Docusaurus `onBrokenLinks` stays
as configured; if it fails the build, the list is the deliverable and the
build is rerun once that session lands.

## Verification

1. `npm run lint:specs` with zero errors on all eight specs.
2. `node scripts/ingest-nha.mjs --check` reproduces the committed specs.
3. `npm run lint:atoms`, `lint:sources`, `check:plugins`, `check:icons`,
   `validate:skills`, `lint:content`, `lint:agent` pass.
4. `npm run build` succeeds, or fails only on links into pages the content
   session owns.
5. Residue grep: no file outside `.git/` contains any retired filename,
   retired raw hash, `nha-2026-09-0[145]`, `nha-2026-09-11`, `aarogya`,
   `M1_postman`, `ABDM_M[123]_API_Swagger`, `Proposed Simplified`,
   `ErrorCode-Message`, `Building-HI`, or `ABHA-Creation-and-Verification`.
6. `adversarial-reviewer` dispatched on the branch before the PR.

## The set is final

Decided 19 September 2026, after an operation by operation comparison against
`main`. The 16 September drop is the whole of what the portal publishes. Where
the set carries no source for something `main` published, the portal stops
publishing it, and that is the intended outcome rather than a gap to fill.

The comparison found 212 operations on `main` with no source in the set and 179
in the set that `main` never carried. The net is 299 operations down to 253.
Milestone by milestone, counting operations and callbacks together:

| Module | main | this branch |
| --- | --- | --- |
| Gateway | 11 | 11 |
| M1 | 44 | 30 |
| M2 | 20 | 21 |
| M3 | 14 | 12 |
| M4 | 2 | 100 |
| P1, P2, P3 | 147 | 51 |
| P4, Scan and Pay, Subscriptions | 0 | 28 |
| `phr-services` | 61 | module deleted |

The PHR side carries the reduction: 208 operations down to 79. These areas are
no longer published, because no file in the set mentions them. Teleconsulting,
ambulance booking, blood bank, NHCX, DigiLocker records, family management,
notifications, care context linking on the PHR side, and PHR side consent
management.

Two consequences follow from the same rule and are accepted with it. The
Catalogue holds 60 atoms where `main` held 365, all of `catalogue/hiecm/`
having been deleted. The generated error reference carries 20 codes where
`main` carried 922, because error pages now render from specification examples
rather than from the 49 error atoms. Both come back when NHA supplies flow and
error documents.

## Out of scope

- Hand-written site pages (other session).
- New flow, error, test or endpoint atoms.
- Sandbox verification of any operation. Every generated page carries no
  verification claim.
- Reauthoring the integrator skills for the Haiku floor (separate plan).
- Closing `feat/m1-simplified-flow`: superseded; close after this merges.
