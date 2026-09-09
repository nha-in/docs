# Preauthorisation request

The preauthorisation request is the first bundle in the exchange that carries clinical content. It asks the payer to approve a treatment before it is given. The provider posts it to `/v1/preauth/submit` under workflow 12, and the payer answers asynchronously on `/v1/preauth/on_submit`. The payload is one collection bundle whose spine is a `Claim` with `use` set to `preauthorization`. Chapter 07 covers the answer, chapter 08 the enhancement, chapter 09 the query round trip.

## In short

- The first bundle carrying clinical content, with a `Claim` of `use = preauthorization` as its spine.
- The sample carries 31 entries, two of which are the request proper and the rest the resources it points at.
- Two reference styles coexist in one bundle, and a parser has to handle both.
- A live run in September 2026 settled several open questions: the sample's oddities are tolerated, not required.

## The bundle

The sample bundle carries 31 entries in this order. Two of them are the request proper; the rest are the resources the `Claim` points at, plus two complete ABDM clinical documents flattened into the same bundle.

| Entry | Resource | `fullUrl` | What it is for |
| :---- | :---- | :---- | :---- |
| 0 | `Claim` | absolute | The request itself |
| 1 | `Patient` | absolute | Beneficiary, PMJAY ID and jurisdictional health number |
| 2 | `Organization` | absolute | Provider, HFR ID as `NPI` |
| 3 | `Organization` | absolute | Payer, registry ID as `NIIP` |
| 4 | `Coverage` | absolute | The policy |
| 5 | `Practitioner` | absolute | The treating doctor, referenced from `careTeam` |
| 6 to 17 | `Composition`, `Organization`, `Practitioner`, `Encounter`, `Appointment`, `Patient`, four `Observation`, `DiagnosticReport`, `DocumentReference` | `urn:uuid:` | One ABDM `DiagnosticReportRecord`, titled "Lipid Profile" |
| 18 to 29 | the same twelve resource types | `urn:uuid:` | A second `DiagnosticReportRecord`, titled "Haemoglobin Estimation" |
| 30 | `Procedure` | absolute | The planned procedure, referenced from `Claim.procedure` |

Two reference styles coexist in one bundle. The request resources use absolute URLs under `https://payer.nha.gov.in/preauthorization/v1/preauth/submit/…`. The embedded documents use `urn:uuid:`. Both resolve; a parser has to handle both.

## The fields that matter

| Path | Value in the sample |
| :---- | :---- |
| `Claim.identifier[0].type.coding` | system `…/CodeSystem/ndhm-identifier-type-code`, code `CLN`, "Claim number" |
| `Claim.identifier[0].system` | `https://hcx.pmjay.gov.in/v1/preauthorization` |
| `Claim.identifier[0].value` | `VB26AA2600001`, the case number, also the bundle identifier |
| `Claim.status` | `active` |
| `Claim.type.coding` | code `737481003`, "Inpatient care management (procedure)" |
| `Claim.use` | `preauthorization` |
| `Claim.created` | `2026-02-26T15:49:36+05:30` |
| `Claim.priority.coding` | system `http://terminology.hl7.org/CodeSystem/processpriority`, code `normal` |
| `Claim.insurance[0]` | `sequence` 1, `focal` true, `coverage` reference |
| `Claim.total.value` | `3300`, with no `currency` |

The item is one line and it is where most rejections start.

| Path                                                                   | Value                                                                  |     |
| :--------------------------------------------------------------------- | :--------------------------------------------------------------------- | --- |
| `item[0].sequence`                                                     | `1`                                                                    |     |
| `item[0].careTeamSequence`, `.diagnosisSequence`, `.procedureSequence` | `[1]` each                                                             |     |
| `item[0].category.coding`                                              | system `https://payer.pmjay.nha.gov.in`, code `MP`, "General medicine" |     |
| `item[0].productOrService.coding`                                      | system `http://snomed.info/sct`, code `MG0111A`, "Pleural Effusion"    |     |
| `item[0].programCode`                                                  | system `…/CodeSystem/ndhm-program-code`, code `AB-PMJAY`               |     |
| `item[0].modifier.coding`                                              | system `https://payer.pmjay.nha.gov.in`, code `STRAT006b`, "HDU"       |     |
| `item[0].servicedPeriod`                                               | `2026-02-22` to `2026-02-27`                                           |     |
| `item[0].quantity.value`, `.unitPrice.value`, `.net.value`             | `1`, `3300`, `3300`                                                    |     |
| `item[0].factor`                                                       | `0.5`                                                                  |     |

Note the arithmetic. `net` equals `unitPrice` multiplied by `quantity` with `factor` ignored. `0.5` is carried on every sample item and never applied. Send it because the samples send it, but do not compute with it, and do not expect the payer to.

Diagnosis is one entry: `A97`, "Dengue", in `https://payer.pmjay.nha.gov.in`, with `type` given as SNOMED `148006` "Preliminary diagnosis". The handbook's tables ask for ICD-10 at `http://hl7.org/fhir/sid/icd-10` and for `admitting` or `clinical` as the type. No sample uses either. Follow the payer.

`careTeam[0]` carries only `sequence` and `provider`. The `role` and `qualification` elements the handbook documents are absent from every preauthorisation sample. `billablePeriod` is absent too, although chapter 01's tenth rule and the handbook both describe it; the admission and discharge window appears only as `item.servicedPeriod` and `Coverage.period`.

## Supporting information

The request carries four entries, all in category `INV`.

| Seq | Category | Code | Meaning | Value |
| :---- | :---- | :---- | :---- | :---- |
| 1 | `INV` | `MAND0408` | Clinical notes, history, admission notes | `valueAttachment`, `image/jpeg`, 261,752 base64 characters |
| 2 | `INV` | `MAND0455` | CXR PA view or CECT chest abdomen and pelvis | `valueAttachment`, `application/pdf` |
| 3 | `INV` | `MAND0409` | Any investigations done | `valueReference` to entry 6, the "Lipid Profile" `Composition` |
| 4 | `INV` | `MAND0570` | Planned line of management | `valueReference` to entry 18, the "Haemoglobin Estimation" `Composition` |

The `MAND…` codes come from `https://payer.pmjay.nha.gov.in` and are the document checklist the eligibility call returns with purpose `auth-requirements`. Send the code and the display exactly as the checklist gave them.

## What the sample shows

`preauth/preauth_request.txt`, 374,611 bytes, 31 entries, case `VB26AA2600001`, `Bundle.timestamp` `2026-02-26T15:49:37+05:30`. It is a single-item inpatient request for 3,300 with two attached images and two embedded structured reports.

It is unrepresentative in one important way. **It carries no admission-date or encounter-date supporting information at all.** The flow chapter tells you to send registration date as `EDT` under category `OTH`, and admission date as `ADDD` under category `ONS`. The handbook agrees. This sample sends neither. The only sample in the whole preauthorisation family that does carry them is the query answer, described in chapter 09. Treat their absence here as a defect in the capture, not as permission to omit them.

## Verified live

On 5 and 6 September 2026 the reference request under `apps/reference/provider/preauth/request` was sent to the SHA HP sandbox from a second hospital, and it settles several of the open questions above. The bundle was refused until every `item`, `procedure` and `supportingInfo` entry carried an element id, and the `Claim` carried its number as `id` (`PAYR-1027`). It was then refused until the `Practitioner` carried an `HPIN` identifier (`PAYR-1083`). It then passed validation, and was stopped only by the scheme's one-live-preauthorisation rule (`PAYR-1238`). Along the way the SHA accepted all of these:

- `factor` 1 in place of the sample's `0.5`.
- The category `MG` under `…/ndhm-benefit-category`, in place of the sample's `MP` under the payer's own system.
- The package under `…/ndhm-procedure-code` rather than SNOMED.
- An ICD-10 diagnosis with `admitting` as its type.
- A `careTeam` with `role` and a SNOMED `qualification`.
- A `billablePeriod`, and `ADDD` and `EDT` dates.
- A request with none of the four `MAND…` documents. Treat the sample's oddities as tolerated, not required. Building a Provider 10 has the whole run.

## Traps

**Supporting-info category is populated from the code value set.** Every one of the four entries sets `category.coding.system` to `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code` with code `INV`. The category belongs in `…/CodeSystem/ndhm-supportinginfo-category`. The value set that is right for `code` has been used for `category`. The date entries in the query answer bundle get the category system right, so both forms exist in the same corpus. Send what the payer's validator accepts, and expect to see the wrong-system form in anything you receive.

**The package code sits in two systems inside one bundle.** `Claim.item[0].productOrService.coding.system` is `http://snomed.info/sct` for code `MG0111A`. The `Procedure` at entry 30 gives the same code `MG0111A` with the same display in `https://payer.pmjay.nha.gov.in`. `MG0111A` is not a SNOMED concept in either place. The eligibility request binds the same code to the payer system as well, so `http://snomed.info/sct` in `productOrService` is the outlier and it is the one every preauthorisation and claim sample uses. Mirror it.

**`Claim.use` has three valid FHIR values and a teaching deck names none of them.** The deck offers `claim | pre-auth | pre-det`. The real R4 codes are `claim`, `preauthorization` and `predetermination`, and the samples use `preauthorization` and `claim`. `pre-auth` and `pre-det` are not codes at all. Anyone treating the slide as normative emits payloads the gateway rejects.

**`Claim.type` binds to a ValueSet URL.** The system is `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-claim-type`, not a `CodeSystem` URL. A strict validator objects. Every sample does it, so send it.

**A supporting-info `valueReference` points at a `Composition`, not a `DocumentReference`.** Chapter 01's seventh rule says documents are `DocumentReference`s. Here entries 3 and 4 reference the `Composition` at the head of an embedded ABDM record, and the `DocumentReference` inside that record is reached only through the `Composition`. Follow the reference, then walk the document.

**The document titles do not match the codes they are filed under.** Code `MAND0409`, "any investigations done", references a Lipid Profile. Code `MAND0570`, "Planned line of management", references a Haemoglobin Estimation. This is sandbox test data, not a rule. Do not copy the mismatch.

**Inline attachments are base64-encoded twice.** Both `valueAttachment.data` values in this bundle decode to another base64 string, which then decodes to the real JPEG and the real PDF. The `DocumentReference` attachments inside the two embedded documents, in the same bundle, are encoded once and decode straight to `%PDF-1.4`. So one bundle carries two encodings of the same kind of payload. A payer that decodes once renders a blank document. Encode once, and when you receive an attachment, sniff the decoded bytes for a file signature before trusting it.

**`Bundle.meta.lastUpdated` is frozen** at `2025-11-11T15:09:41.516+05:30` on this and every other provider request bundle, while `Bundle.timestamp` holds the real submission time. Read `timestamp`.
