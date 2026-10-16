# L1. Discovery

#### L1G. GOAL
Find out what the target HMIS already has for every spec item: screens, APIs, callbacks, FHIR builders and parsers (mappers), database tables, and gateway pieces. Record each one as found, partial or missing, with the file and lines where it lives.

#### L1I. INPUTS
- The target repository.
- The NHCX knowledge source ([KNOWLEDGE.md](../references/KNOWLEDGE.md)).
- The spec indexes: [screens](../screens/INDEX.md), [apis](../apis/INDEX.md), [callbacks](../callbacks/INDEX.md), [fhir](../fhir/INDEX.md), [database](../database/INDEX.md), [gateway](../gateway/INDEX.md).

### L1.0 Pick the knowledge source
Call the nhcx-docs MCP `catalogue_info`. If it answers, the source is the MCP; record its catalogue version. If not, download the latest `nhcx-package` release zip into `nhcx-plan/knowledge/`, extract it and check it against `MANIFEST`, as [KNOWLEDGE.md](../references/KNOWLEDGE.md) describes. Write `nhcx-plan/knowledge.json`. Every later step reads NHCX facts from this source.

If neither is reachable (no MCP, and the release cannot be downloaded after 3 attempts, or its files fail the `MANIFEST` check), stop: log L1.0 as `blocked` with what was tried, tell the user, and do not continue to L1.1. Building from memory is not an allowed fallback.

### L1.1 Scan for NHCX before reading anything else
Search the whole target once for NHCX signatures before matching spec by spec: `x-hcx-`, `hcx`, `nhcx`, `coverageeligibility`, `preauth`, `claim/submit`, `paymentnotice`, `communication/request`, `JWE`, `RSA-OAEP`, `participant/get/policies`, `abdm`, `abha`, `resourceType`, `Bundle`, `nrces`. Record every hit with file and lines.
- **No hits at all:** the target is greenfield for NHCX. Every A, C, F and G id is `missing`: write one `items` entry per kind with `"spec": "A*"` (and so on) and `status: missing`, and match only screens (L1.4) and database (L1.7) spec by spec, since those depend on the HMIS's own screens and tables.
- **Hits:** match spec by spec (L1.4 to L1.8), starting from the files the scan found.

### L1.2 Identify the technology
Read the build files, entry points and folder layout. Record:
- which side of the exchange the target is, `provider` or `payer`, by the test in SKILL.md (WHICH SIDE). A `payer` target ends this skill's discovery here: log it, tell the user, and continue with the payer folder's SKILL.md and its own L1
- languages and versions; web framework; UI technology (server-rendered, SPA, mobile)
- database engine, ORM or query layer, migration tool and where migrations live
- how routes are declared; how background jobs or schedulers run
- test framework and how tests run; lint, type-check and build commands
- how configuration and secrets are read
- the HMIS navigation shell (sidebar, navbar, home screen) where a "Claims" entry would go

Then, the language being known, write the report builder and its wrappers ([LOG.md](LOG.md#logh-reporthtml)): `nhcx-plan/report.py` (or `report.mjs`, `report.php`, the target language's equivalent, standard library only), `nhcx-plan/make-report.sh` and `nhcx-plan/make-report.bat`. Run `make-report.sh once` (or the `.bat`) and open the page: at this point it shows the target, the skill and its version, L1 in progress, and every other file as "not yet written". Every later step rebuilds it through the same script.

### L1.3 Find the domain entities
Locate patient, practitioner (doctor, staff), organization (facility), encounter (admission, visit), diagnosis, procedure, billing and insurance entities. For each: model or table name, file and lines, primary key, and the fields that look relevant to D3, D2, D1, D4, D5 and D9.

Then look for an **ABDM module** already in the HMIS or mounted beside it (a plug, an app or a package): search `abdm`, `abha`, `hiecm`, `hip`, `hiu`, `health_facility`, `hf_id`, `hfr`, `consent`. Record it under `abdm` in `discovery.json`: whether one exists, its facility record and HFR id field, its ABHA record or identifier configuration and the identifier system it uses, its ABHA screens (link, create, verify) and their entry points, its session token code and cache key, and its **M2 health records**: the record model (the document bundles it holds or builds per `hiType`, search `hiType`, `care_context`, `DocumentReference`, `discharge_summary`, `DiagnosticReport`, `Prescription`), the care context's link to the admission, and the function that renders a record to PDF for the patient. Every one of these that exists is reused, not rebuilt ([SCAFFOLDING.md](../references/SCAFFOLDING.md), section 4a); L2 maps each reused field, and L3 leaves out the A19 and S13 to S15 ABHA additions when the module has them. A target with no ABDM module records `"abdm": {"present": false}`.

Also locate the **billing or accounts module**: the bill or invoice of an admission, its payments or receipts, and adjustments. [D21. claim_payment](../database/D21-claim-payment.md) posts payer payments there (SCAFFOLDING section 4, Billing).

### L1.4 Match screens (S1 to S16)
For each S spec, search the UI for a screen that does the same job (by route, title, form fields, table columns). Record the route, component or template file and lines, and which of the spec's fields, actions and states it covers.

### L1.5 Match APIs and callbacks (A1 to A17, C1 to C10)
Search for outbound NHCX or ABDM calls (paths such as `coverageeligibility`, `preauth`, `claim/submit`, `communication`, `paymentnotice`, `participant/get/policies`) and inbound routes (`/in/`, `/v1/`, `on_check`, `on_submit`, `callback`). Record handler files and lines, and which pseudocode steps of the spec they already do.

### L1.6 Match FHIR mappers (F1 to F19)
Search for code that builds or reads FHIR resources (`resourceType`, bundle builders, profile URLs, FHIR libraries). For each F spec record the builder or parser file and lines, the profile it uses, and elements it fills or reads.

### L1.7 Match database (D1 to D30)
Compare the target schema with each D spec: existing table, matching columns, missing columns, conflicting types or meanings.

### L1.8 Match the gateway (G1 to G11)
Look for NHCX protocol code: JWE encryption, `x-hcx-*` headers, ABDM session tokens, participant registry lookups, a message ledger. Record what exists and whether it runs in-process or as a separate service.

### L1.9 Write discovery.json
One entry per spec id. A spec with no match is still listed, as `missing`.

### L1.10 Ask the integration decisions
Some behaviour is the hospital's to decide, not the protocol's, and the skill never guesses it. Before L2, ask the user each question below (one message, numbered), record every answer in `nhcx-plan/plan.json` under `decisions` with the key given, and build the screens to the answer. A question whose answer the user leaves open is recorded as the default in brackets and flagged in the progress log.

| Key | Question | Default | Where it lands |
|---|---|---|---|
| `claim.registrationRequired` | Must a claim start from a patient on the register, or may a walk-in start one on identifiers alone? | required | S1. Search Policy (in nhcx-coverage), [S19. NHCX Settings](../screens/S19-nhcx-settings.md), [D1. organization](../database/D1-organization.md) |
| `claim.captureMemberId` | Is the member id asked for at the start, beside the ABHA and mobile numbers? | yes | S1. Search Policy (in nhcx-coverage), [S19. NHCX Settings](../screens/S19-nhcx-settings.md) |
| `plan.trigger` | When the case's payer has no package master yet: is the InsurancePlan fetch sent automatically on opening the case, or by the desk ("Fetch insurance plan")? | manual | S7. Insurance Plan (in nhcx-preauth) |
| `plan.refresh` | Is a stored master refreshed automatically on a schedule, or only by the desk ("Fetch again")? If automatically, how often? | manual | S7. Insurance Plan (in nhcx-preauth) |
| `plan.scope` | Is the master fetched once per payer and policy and reused across cases, or fetched for every case? | once, reused | S7. Insurance Plan (in nhcx-preauth), D10. claim_plan (in nhcx-coverage) |
| `plan.fields` | Which fields of the payer's InsurancePlan does the hospital need on screen? The reader must carry every field the knowledge package's InsurancePlan example holds (F5. InsurancePlan (in nhcx-preauth)); L6 checks the reader against that example. | all of F5. InsurancePlan (in nhcx-preauth) | F5. InsurancePlan (in nhcx-preauth), S7. Insurance Plan (in nhcx-preauth) |
| `preauth.benefitsFirst` | Is the benefits check (A2 `benefits`) offered on the quoted set before the pre-authorisation? It never blocks the send. | offered | S8. Line Items (in nhcx-preauth), S3. Policy Discovery (in nhcx-coverage) |
| `preauth.authRequirementsFirst` | Is the authorisation-requirements ruling (S8.2) offered before the pre-authorisation? It never blocks the send. | offered | S8. Line Items (in nhcx-preauth) |
| `preauth.admission` | May a pre-authorisation be sent before the patient is admitted (an intimation on a planned admission), or only against a current stay? | before admission allowed: the admission is never a condition of the pre-authorisation | S4. Claim Creation Form (in nhcx-preauth), S9. Pre-authorisation (in nhcx-preauth) |
| `preauth.autoCancelHours` | When a pre-authorisation is approved and the patient is not admitted within how many hours is it withdrawn automatically (A6 cancel)? 0 means never. | 0 (never) | S9. Pre-authorisation (in nhcx-preauth), [A6. Task Submit (cancel, status, reprocess, release)](../apis/A6-task-submit.md) |
| `preauth.queryMode` | Confirmed from the payer adapter, not asked: a line-item query is answered by resubmitting the pre-authorisation (PMJAY, `resubmit`); an order-level query comes as a CommunicationRequest and is answered with a Communication (S10. Communication (in nhcx-communication)). | from [PAYERS.md](../references/PAYERS.md) | S9. Pre-authorisation (in nhcx-preauth), S10. Communication (in nhcx-communication) |
| `documents.additional` | May the desk attach documents beyond those the payer named (an "Additional document" row with a free code)? | yes | S9. Pre-authorisation (in nhcx-preauth), [S11. Claim Submission](../screens/S11-claim-submission.md), [D28. claim_document](../database/D28-claim-document.md) |
| `documents.aadhaar` | Is the beneficiary's Aadhaar carried as supporting information (identifier typed `ADN`) on the pre-authorisation and the claim, where the payer wants it? | where the payer wants it | S9. Pre-authorisation (in nhcx-preauth), F8. Claim (in nhcx-preauth), [F15. Patient](../fhir/F15-patient.md) |
| `verification.biometric` | Is the beneficiary's biometric authentication (S18. Beneficiary Verification (in nhcx-coverage)) required at this hospital for every payer, only where the payer requires it, or not used? | where the payer requires it | S18. Beneficiary Verification (in nhcx-coverage), [PAYERS.md](../references/PAYERS.md) |
| `claim.admissionRequired` | Is a claim refused unless the case is on an admission in the HMIS? | yes: the claim always needs the stay it bills | [S11. Claim Submission](../screens/S11-claim-submission.md) |
| `claim.dischargeIntimation` | Does the hospital send a discharge intimation to the payer before the claim? If yes, the Claim tab gains a "Discharge intimation" step (an A6 Task on the pre-authorisation thread, or the payer's own form) and the discharge is recorded there. | no | [S11. Claim Submission](../screens/S11-claim-submission.md), [S6. Claim Detail](../screens/S6-claim-detail.md) |
| `payer.letters` | Which payer documents does the desk need to see on the case: the approval letter (code `PAU`) and any document the payer attaches to its ClaimResponse or CommunicationRequest? | all | S9. Pre-authorisation (in nhcx-preauth), S10. Communication (in nhcx-communication), C5. Pre-auth Reply (in nhcx-preauth) |

The answers shape L3's integration plan; a later change of an answer is a `corrected` entry in the progress log and reopens the spec it lands on.

#### L1O. OUTPUT
`nhcx-plan/discovery.json`:

```json
{
  "target": {"repo": "<name>", "commit": "<sha>", "discovered_at": "<ISO time>"},
  "technology": {
    "side": "provider",
    "languages": [{"name": "", "version": ""}],
    "framework": "", "ui": "", "database": "", "orm": "",
    "migrations": {"tool": "", "dir": ""},
    "routing": {"file": "", "lines": ""},
    "jobs": "", "tests": {"framework": "", "command": ""},
    "lint": "", "typecheck": "", "build": "",
    "config": "", "navigation": {"file": "", "lines": ""}
  },
  "entities": [
    {"name": "patient", "spec": "D3", "model": "", "file": "", "lines": "", "key": ""}
  ],
  "abdm": {
    "present": true,
    "module": "<package or plug name>",
    "facility": {"model": "", "hfr_field": "", "file": ""},
    "abha": {"model": "", "number_field": "", "identifier_system": "", "file": ""},
    "screens": [{"what": "link | create | verify", "entry": "", "file": ""}],
    "token": {"function": "", "cache_key": "", "file": ""},
    "records": {"model": "", "hitype_field": "", "care_context": {"model": "", "encounter_field": ""}, "render": {"function": "", "file": ""}}
  },
  "billing": {"bill": {"model": "", "file": ""}, "receipt": {"model": "", "file": ""}, "adjustment": {"model": "", "file": ""}},
  "items": [
    {
      "spec": "S9",
      "kind": "screen | api | callback | fhir | database | gateway",
      "status": "found | partial | missing",
      "locations": [{"file": "", "lines": "", "what": "handler | template | builder | model | migration"}],
      "covers": ["what of the spec already exists"],
      "gaps": ["what of the spec is absent"],
      "notes": ""
    }
  ],
  "corrections": []
}
```

#### L1L. LOG
Record in `nhcx-plan/progress.json` and regenerate `nhcx-plan/progress.md`, as [LOG.md](LOG.md) describes. One entry per sub-step. L1.0 logs the source chosen, and for the package the download, extraction and `MANIFEST` check. L1.1 logs the scan's hits (or that there were none). L1.2 logs the report builder and the two wrapper scripts as created, and the first build of `nhcx-plan/report.html`. L1.4 to L1.8 also log the spec ids they matched, and L1.9 logs `nhcx-plan/discovery.json` as created or modified.

#### L1X. EXIT
- `nhcx-plan/knowledge.json` names the source and its version; for the package, the zip and extracted folder are under `nhcx-plan/knowledge/` and match `MANIFEST`.
- Every S, A, C, F, D and G id from the indexes appears once in `items`, or its whole kind appears as one `missing` entry (`"spec": "A*"`) when L1.1 found no NHCX code.
- Every `found` or `partial` item has at least one location, and each location opens to the lines named.
- `technology` has no empty field the later steps need (framework, database, migrations, tests).
- `nhcx-plan/plan.json` holds a `decisions` entry for every key of L1.10, each either the user's answer or the default marked as such.
- `abdm` says whether an ABDM module exists and, when it does, names its facility, ABHA, screen and token locations; `billing` names the bill, receipt and adjustment models or says they do not exist.
- Every sub-step of L1 has its `started` and closing entries in progress.json, and every file changed is named in one.
