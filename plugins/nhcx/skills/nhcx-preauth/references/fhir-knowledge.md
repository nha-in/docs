# FHIR knowledge: every bundle sent and received

Sources: the bundles under `nhcx-package/fhir` (the hospital pins in `B1` to `B9`, the payer answers in `C3` to `C11`, the live PMJAY hospital captures in `D1` to `D13`) and the chapters under `nhcx-package/docs/05-FHIR Reference`. Get the package as `references/material.md` says.

## 1. Where the examples live

| Set | Path | What it is |
| --- | --- | --- |
| Pinned hospital bundles | `nhcx-package/fhir/B1` to `B9`, the lower-case files (`B3/preauth-request.json`) | One bundle per message a hospital sends, written to the specification with placeholders. A build is held to these byte for byte. The pin map is in `references/material.md`. |
| Payer answers | `nhcx-package/fhir/C3` to `C11` | One file per message the payer sends: the generic answer and, where one exists, its `-pmjay` twin. Feed these into your readers. |
| Live hospital captures | `nhcx-package/fhir/D1` to `D13` (PMJAY) and the capitalised B files such as `B3/B3-request.json` (generic) | Bundles taken from the sandbox wire, with the beneficiary's identifiers replaced |
| The catalogue | `nhcx-package/fhir/index.yaml` | For each file: direction, side, scheme (`generic` or `pmjay`), workflow id, focal resource, origin. Origin `example` means placeholders, not a payload; `wire` means a capture. |
| The NRCeS IG's own example | `nhcx-package/fhir/B4/communication-request.json` | The communication TaskBundle for the payer's request comes from the IG |
| Your build's archive | `<cases dir>/<claim number>/NNN-<usecase>-<direction>.json` and `transactions.txt` (modules 7.1 and 7.3) | Every envelope one episode sent and received, in order |
| Chapters | `nhcx-package/docs/05-FHIR Reference/*.md` | Element by element: `08-Preauthorisation Request.md`, `12-Claim Request.md`, `13-Claim Response.md`, `17-Communication.md`, `15-Cancel, Reprocess and Shortfall.md`, `16-Payment Notice and Acknowledgement.md`, `06-Insurance Plan Response, Package-Based.md`, `19-Codes and Value Sets.md` |

Pins, by leg. Paths are under `nhcx-package/fhir/`.

| Leg | Provider pin | Payer answer or capture |
| --- | --- | --- |
| Coverage eligibility | `B1/discovery.json`, `B1/validation.json`, `B1/benefits.json`, `B1/auth-requirements.json` | `C3/validation-response.json`, `C3/discovery-response.json`, `C3/benefits-response.json`, `C3/C3-response-generic.json`; PMJAY `C3/coverage-eligibility.json`, `C3/C3-benefits-pmjay.json`, `C3/C3-response-pmjay.json` |
| Insurance plan | `B2/insurance-plan-request.json` | `C4/C4-response-pmjay.json` (package-based, abridged), `C4/C4-response-generic.json` (coverage-based) |
| Pre-auth 12, enhancement 13, query answer 19 or 131 | `B3/preauth-request.json`, `B3/preauth-enhancement.json`, `B3/preauth-queryupdate.json` | `C5/C5-received-wf20.json`, `C5/C5-approved-wf21.json`, `C5/preauth-queried.json`, `C5/C5-rejected-wf23.json`, `C5/C5-enhancement-approved-wf22.json`; PMJAY the `-pmjay` twins and `C5/C5-queried-wf24.json` |
| Cancel PC01 | `B3/preauth-cancel.json` | `C10/C10-cancelled-wfPC02.json`, `C10/C10-cancelled-wfPC02-pmjay.json` |
| Claim 15, query answer 161 | `B5/claim-request.json`, `B5/claim-queryupdate.json` | `C7/C7-received-wf25.json`, `C7/C7-approved-wf26.json`, `C7/claim-queried.json`, `C7/C7-rejected-wf291.json`; PMJAY the `-pmjay` twins, `C7/C7-approved-deduction-wf26-pmjay.json` and `C7/C7-queried-wf27.json` |
| Reprocess 36, release 36 | `B5/claim-reprocess.json`, `B5/claim-release.json` | `C10/C10-arbitration-wf37.json`, `C10/C10-arbitration-wf37-pmjay.json` |
| Payment acknowledgement | `B7/payment-notice-ack.json` | The notice you answer: `C9/C9-notice-wf30.json`; PMJAY `C9/payment-notice.json`, `C9/C9-notice-tds-wf30-pmjay.json` |
| Communication reply | `B4/communication-response.json` | `B4/communication-request.json` (the query you answer; the IG's example), `C6/C6-preauth-query-wf24.json` and `C6/C6-claim-query-wf27.json` (live, generic), `C6/C6-notification-wfN02.json` (PMJAY) |
| Status enquiry | None. The published call carries no bundle (`nhcx-package/docs/05-FHIR Reference/18-Predetermination, Status and Search.md`). | None captured |

## 2. Conventions every hospital bundle follows

From `nhcx-package/docs/05-FHIR Reference/01-Bundles and Conventions.md` and the pins:

- `Bundle.type` is `collection`; `Bundle.meta.profile` names the NRCES bundle profile (`ClaimBundle`, `TaskBundle`, `CoverageEligibilityRequestBundle`); every resource names its own profile under `https://nrces.in/ndhm/fhir/r4/StructureDefinition/`.
- Every entry has an absolute `fullUrl` under one base, `https://nhcx.abdm.gov.in/...`, and every reference resolves to another entry. A thing that is genuinely not in the bundle is named by identifier, not by a URL. The chapter's rule 3 also accepts `urn:uuid:` references; parse both.
- `Bundle.id` is fixed per shape: `coverage-validation-request-generic`, `preauth-request-generic`, `preauth-enhancement-request-generic`, `claim-queryupdate-request-generic`, `preauth-cancel-request-generic`.
- No `meta.versionId`, no `meta.lastUpdated`, no bundle `timestamp` on a request. The communication reply and acknowledgement are the exception: the IG example carries `meta.lastUpdated` and `timestamp`, and the build writes them.
- Money carries `currency: INR`; the total equals the sum of the item nets; whole numbers are written as integers.
- Instants are IST with `+05:30`. The four coverage pins in `B1` stamp `created` at `+05:00`, so leave `created` out of the byte comparison.

## 3. Coverage eligibility request

Builder: `build_coverage_request`. Seven entries, in this order and at these urls:

1. `CoverageEligibilityRequest` at `/coverage-eligibility/request`: `identifier: [{system: https://nhcx.abdm.gov.in}]`, `status active`, `priority normal`, `purpose: [<purpose>]`, `patient`, `created`, `enterer` (the PractitionerRole), `provider`, `insurer`, `facility` (the Location), `insurance: [{focal: true, coverage}]`, and `item[]` on `benefits` and `auth-requirements`.
2. `Patient` at `/patient`: identifiers typed `PMJAY` (NDHM identifier-type system) and `MB` (v2-0203), both the member id. Nothing else; demographics are the payer's to return.
3. `Organization` provider at `/provider`: identifier `NPI` under `https://nhcx.abdm.gov.in` = the facility's registry id (HFR id); `type prov`; `name`.
4. `Organization` payer at `/payer`: identifier `NIIP` = the participant code without `@hcx` (`1518`); `type pay`.
5. `Location` at `/location`: `name`, `managingOrganization` the provider.
6. `Coverage` at `/coverage`: identifier `NH` = the policy code, or `NONE` on a discovery; `status active`; `type HIP`; `subscriber`, `beneficiary`, `subscriberId` = member id; `relationship self`; `payor`.
7. `PractitionerRole` at `/practitioner-role`: `code` SNOMED `307988006` Medical technician.

Items (`eligibility_item`): `category` under `https://nhcx.abdm.gov.in/category-code` (the specialty), `productOrService` under `https://nhcx.abdm.gov.in/product-code` (the package), `quantity.value` as an integer, and each ward tier quoted through the package as a `modifier` coding with code and display and no system. No money, no diagnosis, no sequence.

The four purposes differ only in `purpose`, the Coverage identifier and whether `item` is present.

Reader (`parse_validation_bundle`): the payer echoes the request's entries and appends its own, so take the last `CoverageEligibilityResponse`, `Patient` and `Coverage`. Read `insurance[0].inforce`, `outcome`, `disposition`, `item[].authorizationRequired`, the largest `benefit[].allowedMoney` with its `usedMoney`, the Patient's name, gender, birth date, address, `ABHA` identifier and photo, the Coverage's `class[0].name` and `period`. The SHA answers on workflow id `5` (`nhcx-package/fhir/C3/C3-response-pmjay.json`).

Auth-requirements reader (`parse_auth_bundle`, with `supporting_entry`; examples `C3/C3-response-generic.json` and `C3/C3-response-pmjay.json`): one `insurance[0].item` per line quoted, each with `authorizationRequired`, `excluded`, `benefit[0]` and `authorizationSupporting[]`. Each supporting entry is a CodeableConcept whose `text` is free text the scheme overloads: `fullUrl: <questionnaire url>` marks a form to answer; `Type: pre` or `Type: post` says which leg a document is due at; `Procedure Code: X` says for which line. The space after the colon is sometimes missing; match both. A form is always wanted at pre-auth; a document only when its stage is `pre`.

## 4. Insurance plan request and the plan

Request (`build_plan_request`): a `TaskBundle` with one entry, a `Task` at `https://nhcx.abdm.gov.in/insurance/request`: `status requested`, `intent order`, `code poll` on the HL7 financial task code system, inputs typed `policyNumber` and `providerId` under the NDHM task-input code system. No id, no timestamp, no requester. At least one input is mandatory. Bundle id `insurance-request-generic`.

Answer: an `InsurancePlanBundle` with one `InsurancePlan`, an `Organization`, and one `Questionnaire` per form the plan names (the same form repeated once per benefit that needs it; collect by `url`). The parser (`parse_plan_bundle`) reads both published shapes and merges them on package code:

- `plan[].specificCost[].category` (the specialty) then `benefit[].type` (the package) then `cost[]`: the cost typed `Procedure` is the package rate; `Stratification` and `Implant` costs are money paid over the rate, named by their `qualifiers[0]`.
- `coverage[].benefit[].limit[]`: the limit whose code is the package's own is the rate; the rest (STRAT codes, implants) are tiers.
- Extensions on the plan, the coverage and each benefit, matched by a squashed url family: `Claim-Condition` children name conditions (`ProcedureType`, `IsDayCare`, and so on); `Claim-SupportingInfoRequirement` children are one nested requirement per document, each with `category`, `code` (`MAND0409` and the like) and `documentationUrl` pointing at a Questionnaire. Requirements on the `InsurancePlan` resource itself are policy-wide (proof of identity, the consent forms).
- A `Questionnaire` under `/questionnaire/` is a policy form; under `/stgquestionnaire/` a treatment-guideline checklist. Questions live on `item.prefix` far more often than `item.text`; answer options are plain strings; `initialSelected` is the payer's default.

Store it once per facility and policy and copy it onto later episodes (`reuse_plan`). The PMJAY master runs to tens of megabytes; the validator cannot check it whole.

## 5. The Claim bundle: pre-authorisation, enhancement, query answer, claim, predetermination

One document for every leg (`claim_bundle`). Entries, in order and at these urls:

1. `Claim` at `https://nhcx.abdm.gov.in/<leg>/<flow>`: leg `preauth`, `claim` or `predetermination`; flow `request`, `enhancement` or `queryupdate`.
2. `Patient` at `/patient`, `id 1`: identifiers `PMJAY` (member id), `ABHA` (when known), `MB` (member id); `name.text`, `telecom`, `gender`, `birthDate`.
3. `Organization` provider at `/provider`, `id 1`; `Organization` payer at `/payer`, `id 2` (as in section 3).
4. `Coverage` at `/coverage`, `id 1`: `NH` identifier = policy code, `subscriberId` = member id.
5. `Practitioner` at `/practitioner` (the second and later at `/practitioner/2` and so on), `id n`: identifiers `HPID` under `https://nhcx.abdm.gov.in`, `MD` (licence) when known, and `HPIN` under `https://hpr.abdm.gov.in`. PMJAY looks the practitioner up by the `HPIN` typed identifier and refuses a bundle without one with PAYR-1083. `qualification.code` under HL7 v2-0360 with the table's own display (`degree_coding`).
6. `Procedure` at `/procedure/n`, `id n`, one per package: `status preparation` before treatment, `completed` on the claim; `code` SNOMED `71388002` with `text` = the package display; `performedDateTime`.
7. `QuestionnaireResponse` at `/questionnaireresponse/n`, one per answered form: `questionnaire` = the plan's Questionnaire url, `status completed`, `subject` the Patient, `authored`, `item[].answer[]` typed by the question (`valueString`, `valueDateTime`, `valueBoolean`, `valueInteger`, `valueDecimal`, `valueAttachment`).

The Claim itself:

- `id` = the claim number; `identifier[0]` typed `CLN` under `https://nhcx.abdm.gov.in` = the claim number. Element ids on every list the payer indexes: `item[].id = Item/n`, `procedure[].id = Procedure/n`, `supportingInfo[].id = SupportingInformation/n`. PAYR-1027 is an item without one.
- `status active`, `type` SNOMED `737481003` inpatient care, `use` = `preauthorization`, `claim` or `predetermination`, `billablePeriod`, `created`, `insurer`, `provider`, `priority normal`.
- `careTeam[]`: sequence, provider reference, role `primary` for the first and `assist` after, `qualification` SNOMED specialty.
- `diagnosis[]`: ICD-10 under `http://hl7.org/fhir/sid/icd-10`, type `admitting`, `onAdmission yes`.
- `procedure[]`: sequence, `type` under `https://nhcx.abdm.gov.in/procedure-type` = the plan's `ProcedureType` condition lower-cased (`conservative`, `medical`, `surgical`), `date`, `procedureReference` with the package display.
- `insurance[0]`: `sequence 1`, `focal true`, `coverage`; on the claim `preAuthRef: ["<ref>"]`. The pin carries the pre-auth's own claim number there (`B5/claim-request.json` quotes `B3/preauth-request.json`'s claim id). The build carries the payer's `ClaimResponse.preAuthRef`, which the live capture `nhcx-package/fhir/D9/D9-request.json` shows as `2026091110000810`.
- `item[]` (`claim_items`): one per procedure or implant, never per tier. `sequence`, `careTeamSequence`, `diagnosisSequence`, `procedureSequence` (its own Procedure), `informationSequence` (every supportingInfo), `category` under `ndhm-benefit-category` (the specialty), `productOrService` under `ndhm-procedure-code` (the package), `modifier[]` one coding per ward tier with code and display and no system, `programCode` `AB-PMJAY` under `ndhm-program-code` for PMJAY and none for a generic payer, `servicedPeriod` as dates, `quantity`, `unitPrice` = net divided by quantity, `factor` from the scheme's multiple-procedure rule (1, 0.5, 0.25 by cost rank; PMJAY only), `net` = the line plus its tiers.
- `total` = the sum of the nets.

supportingInfo (`supporting_info`), every entry numbered once the list is assembled (PAYR-1019 is an entry without `sequence`):

| When | category | code | value |
| --- | --- | --- | --- |
| every leg, one per attached document | `INV` (or the document's own category) under `ndhm-supportinginfo-category` | the plan's requirement code (`MAND0408`) under `https://nhcx.abdm.gov.in/document-code`, else `ODN` | `valueAttachment {contentType, data, title}` |
| every leg | `ONS` | `ADDD` | `valueString` admission instant |
| every leg | `OTH` | `EDT` | `valueString` admission instant |
| claim | `HDS` | the plan's summary code (`MAND0006` in the pin) else `HDS` | `valueAttachment` the discharge summary |
| claim, when a surgery time is known | `ONS` | `PSP` | `valueString` surgery instant |
| claim | `ONS` | `DSDE` | `valueString` discharge instant, or the death instant |
| claim, death only | `ONS` | `DTM` | `valueString` death instant (PAYR-1096 and PAYR-1503 without it) |
| claim | `DIS` | `DTH`, `LAMA`, `DAMA` or `DTM` | `valueString` the stage: `Before Surgery`, `During Surgery`, `After Surgery` |
| query answer (flow `queryupdate`) | `NMI` | `CQD` | `valueString` the desk's reply. The SHA reads its query response comments from here; an answer without one is decided as if none was given |
| every leg, one per answered form | `INF` (or `STG` for a treatment guideline) | `ODN` (or `STG`) | `valueReference` to the QuestionnaireResponse entry |

Which forms ride (`required_forms`): with an auth-requirements ruling, the forms it named for the leg; without one, at pre-auth every guideline form the plan attaches to the quoted packages; and on both legs every policy-level form. The scheme refuses a pre-auth that answers neither biometrically nor with its Authentication Consent questionnaire (PAYR-1256, PAYR-1271), a claim without the consent answered again at discharge (PAYR-1363, PAYR-1364), and a package without its STG questionnaire (PAYR-1254, PAYR-1365). The live D4 capture carries two policy questionnaires; the live D9 claim carries four, including the Discharge Consent (`nhcx-package/fhir/D9/D9-request.json`).

Which documents ride (`required_documents`, `preauth_documents`): the ruling's list for the leg, else the plan's list for the quoted packages at pre-auth and whatever was not attached there at the claim. A file attached against a requirement carries that requirement's code; a file nobody asked for carries `ODN`. Never drop one. Content types the scheme takes: pdf, jpg, jpeg, png (PAYR-1008 otherwise).

The legs differ in these ways only:

| Leg | flow | use | Procedure status | Extra |
| --- | --- | --- | --- | --- |
| Pre-auth 12 | `request` | `preauthorization` | `preparation` | |
| Enhancement 13 | `enhancement` | `preauthorization` | `preparation` | every line, old and new, under the same claim number; the costlier package at factor 1 and the other at 0.5 (the live capture `nhcx-package/fhir/D6/D6-enhancement.json` carries the two lines at 1 and 0.5) |
| Query answer 19 or 131 | `queryupdate` | `preauthorization` | `preparation` | the `NMI`/`CQD` reply |
| Claim 15 | `request` | `claim` | `completed` | discharge scalars, summary, `preAuthRef`, the claim under the pre-auth's number (ERR-PYR-CLM-007) |
| Claim query answer 161 | `queryupdate` | `claim` | `completed` | as the claim, plus `NMI`/`CQD` |
| Predetermination | `request` | `predetermination` | `preparation` | sent on `v1/preauth/submit` with workflow 12 |

LAMA and DAMA before or during surgery (`claim_lines`): the claim carries one item, procedure `LM100` at the plan's rate (the sandbox prices it at zero), no tier, and the payer disqualifies every approved item (PAYR-1362 if the package is still there). After surgery the package stands and `LM100` is not used. PAYR-1270 is `LM100` on a pre-auth.

## 6. The ClaimResponse you read

Shape (`nhcx-package/docs/01-Overview/07-Payer Flexibility.md`, "Answer detail"): `ClaimResponse`, `Patient`, the two `Organization` entries, `Coverage`, in that order. Fields to read (`parse_claim_response`):

- `use`: `preauthorization` or `claim`; a bundle with none is whatever you sent on that thread.
- `outcome`: `queued` (acknowledgement), `partial` (queried, or approved for less), `complete`, `error` (rejected).
- `adjudication[]` at claim level: the entry whose `category` is `status` carries `reason.coding.code`: `submitted`, `approved`, `queried`, `rejected`, `cancelled`.
- `preAuthRef`: the payer's case number; see `flow-knowledge.md` section 3 for which answers carry it.
- `identifier[0].value`: your claim number, echoed on every answer.
- `total[]`: a repeating list by `category`, never positional: `benefit` (granted this round), `eligible` (what the case stands at), `submitted`; PMJAY adds `tax` and `incentive`.
- `item[].adjudication[]` by category: `eligible` (amount), `status` (reason `Approved`, `Queried`, `Rejected`), `reason` (the desk's remark, pipe-delimited `USER~datetime~type~comment~trust`, kept verbatim), `eligpercent`, `eligquant`, `deductible` with its reason after a claim.
- `processNote[].text`.
- `type` is present only on the pre-auth acknowledgement (SNOMED `737481003`).

The status rule (`verdict_status`): `queued` or reason `submitted` is still `submitting`; reason `cancelled` is `rejected`; reason `queried` is `queried`; outcome `error` is `rejected`; outcome `partial` is `partial` only with reason `approved`, else `queried`; outcome `complete` is `approved` with reason `approved` or none, else `queried`. Never read `outcome` alone.

## 7. Task bundles the hospital sends

A `TaskBundle` with the `Task` at `https://nhcx.abdm.gov.in/<leg>/<action>` followed by the provider and payer Organizations. The Task: `status requested` (`completed` on an acknowledgement), `intent order`, `code` on the HL7 financial task code system with no display, `description`, `authoredOn`, `requester` the provider, `owner` the payer.

| Task | code | reasonCode (NDHM reason code system) | inputs | Other |
| --- | --- | --- | --- | --- |
| Cancel PC01 | `cancel` | one of `treatmentplanchanged`, `patientrequest`, `financialconstraints`, `alternativetreatment`, `duplicateclaim`, `administrativeerror`, `other` (with `other` the description is the only justification) | `claimNumber`, `intimationNumber` (both typed under `ndhm-task-input-type-code`) | anchor `/preauth/cancel` |
| Reprocess 36 | `reprocess` | `claimrejected`, `partialpayment` or `rejectiondisputed` with the reference's displays | `claimNumber`, `intimationNumber` (the standard's spelling), one `document` input per attachment as `valueAttachment` | `basedOn[0].identifier` typed `CLN`; `for.identifier` typed `PMJAY` on the scheme, `MB` elsewhere; anchor `/claim/reprocess` |
| Release 36 | `release` | `partialpayment` | `claimNumber`, `amount` as `valueMoney` under `https://nhcx.abdm.gov.in/task-input-type` | `basedOn` as above; anchor `/claim/release` |
| Status | `status` | none | `claimNumber` | anchor `/<leg>/status`; not in the package, whose status call carries no bundle (`18-Predetermination, Status and Search.md`); refused by PMJAY |
| Payment acknowledgement 17 | `status`, `status completed` | none | none; `output[]`: `status` = `paymentack` under the NDHM task-output systems, and `claimNumber` | anchor `/payment/notice-ack` |

The spelling rule: the input is `intimationNumber`, the standard's spelling, on every Task. A reprocess under any other spelling is refused with PAYR-1008 (proven live; `nhcx-package/docs/01-Overview/07-Payer Flexibility.md`, "One spelling on the Task"). The pinned cancel and reprocess Tasks carry the same spelling, so the offline comparison diffs them unchanged.

## 8. Task answers you read

`parse_task_response`: find the `Task`, then follow each `output[].valueReference` to the entry it names; when that is a `ClaimResponse`, read it with the same parser as a verdict.

- PC02 (`nhcx-package/fhir/C10/C10-cancelled-wfPC02.json`): Task `completed`, code `approve`, `output[0]` an `include` reference to a `ClaimResponse` with adjudication reason `cancelled`, `use preauthorization`. Accept the cancel when the Task status is `completed` or `accepted` and the outcome is not `error`. Retire the claim number after an accepted cancel.
- 37 (`nhcx-package/fhir/C10/C10-arbitration-wf37.json`): Task `accepted`, code `approve`, a `ClaimResponse` with outcome `queued`, `use claim`. Put the claim leg back to `submitting`; the new verdict comes on the claim's own thread.
- A status answer: none captured in the package. A generic payer that answers a status Task sends a Task `completed`, code `status`, `output[]` with `claimNumber` and a `claimStatus` string; PMJAY refuses the enquiry instead.

## 9. The communication loop

The query, generic payer (`nhcx-package/fhir/C6/C6-preauth-query-wf24.json`; the IG's example at `nhcx-package/fhir/B4/communication-request.json`): a `TaskBundle` with a `Task` `poll`, `requested`, `intent order`, `reasonCode additionalinfo`, one `include` input pointing at the `CommunicationRequest`; the request with `identifier` (the claim number), `basedOn` the Claim, `payload[].contentString` one per ask, `reasonCode[].text` repeating them; then the Claim, Patient, the two Organizations, Practitioner and Coverage. It arrives on `v1/communication/request` on a new correlation id, with the queried leg's correlation id in `x-hcx-workflow_id` when the payer sends one.

The notification, PMJAY (`nhcx-package/fhir/C6/C6-notification-wfN02.json`): a Task `poll`, `completed`, `intent proposal`, reason `information` under `http://terminology.hl7.org/CodeSystem/communication-category`, a `CommunicationRequest` with one `contentString`, and the two Organizations.

Reader (`parse_communication_request`): the first `CommunicationRequest`; the claim numbers it names in `about[]`, `basedOn[]` and `identifier[]`; the asks from `payload[].contentString`, else `reasonCode[].text`, else the Task's `description`; the Task's `intent` and `reasonCode`. Match the claim by those numbers first, then by a request id already held, then by the correlation id of one of your sends, then by the workflow id as a thread.

The reply (`build_communication_bundle`; pin `nhcx-package/fhir/B4/communication-response.json`): a `TaskBundle` with `meta.lastUpdated`, `identifier` under the payer system, `timestamp`, and entries in this order:

1. `Task` at `urn:uuid:<id>`: `status completed`, `intent order`, `code deliver` under `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes`, `authoredOn`, `requester` the provider, `owner` the payer, one `input` typed `include` (HL7 financialtaskinputtype) pointing at the Communication, `reasonCode` echoed from the request's Task when it carried one.
2. `Communication` at `urn:uuid:<id>`: `identifier` echoed from the request, `basedOn: [{reference: <the request's fullUrl>}]`, `about: [{reference: <the Claim's fullUrl>}]`, `status completed`, `category notification`, `priority routine`, `recipient` the payer, `sender` the provider, `payload[]`: a `contentString` for the text, then one `contentAttachment {contentType, title, creation, data}` per document, each with an `extension` carrying the document code. The extension url is participant-defined (`17-Communication.md`): write it under your own system and keep one url. `inResponseTo` is never set: FHIR allows only a Communication there and the validator refuses a request.
3. The `CommunicationRequest` echoed as it arrived.
4. The case as the payer holds it, lifted from the queried leg's own bundle: `Claim`, `Patient`, provider `Organization`, payer `Organization`, `Practitioner`, `Coverage`.

Envelope for the reply: `x-hcx-correlation_id` = the request's, `x-hcx-workflow_id` = the request's, else the queried leg's correlation id, else the claim number; sender and recipient swapped.

The acknowledgement of a notification: the payer's own bundle sent back with `Task.status` set to `completed`, its intent and reason as sent, the provider Organization ahead of the payer's, a fresh `timestamp`. A request that came without a Task gets one built round it, coded `poll`, intent `proposal`, pointing at the request. The package's `B4/communication-acknowledgement.json` is a different shape: a `status` Task, `completed`, with a `status` output and the two Organizations, and no CommunicationRequest.

## 10. The payment notice you read and the acknowledgement you send

Notice (`nhcx-package/fhir/C9/C9-notice-wf30.json`; PMJAY `C9/payment-notice.json` and `C9/C9-notice-tds-wf30-pmjay.json`): a Task `deliver`, `requested`, with a `status` input; a `PaymentNotice` with a `CLN` identifier (the claim number), `amount`, `paymentStatus paid`; a `PaymentReconciliation` with the same identifier, `disposition`, `paymentDate`, `paymentAmount`, `paymentIdentifier` typed `UTR`, and `detail[]` lines (`RF` and `Payment` in `payment-notice.json`; `TDS` and `Payment` in the other two); the two Organizations. It arrives on `v1/paymentnotice/request` on a new thread, workflow 30, 31 or 33.

Reader (`parse_payment_notice`): the claim number from the `CLN` identifier on the notice, the reconciliation, the Task, or the first entry's untyped identifier, never from the bundle identifier; the amount from the notice or `paymentAmount`; the UTR; the details. Dedupe on the notice's correlation id; a second notice with the same `PaymentNotice.id` updates the first (`record_payment`). Count money once per UTR (`paid_total`).

Acknowledgement: the Task in section 7, sent on `v1/paymentnotice/on_request` to whoever sent the notice (not always the claim's payer), with `x-hcx-correlation_id` = the notice's and `x-hcx-workflow_id` = `17` for PMJAY or the notice's own id for a generic payer.

## 11. Validating a bundle

The package ships no validator. Use the HL7 FHIR validator (`validator_cli.jar`, from HL7) with the NRCeS IG package `ndhm.in`, version 6.5.0. A bundle refused with PAYR-1004 or PAYR-1008 goes through the validator before anything else (`nhcx-package/docs/06-Reference/02-Troubleshooting.md`). The rules it checks against are in `nhcx-package/docs/05-FHIR Reference/01-Bundles and Conventions.md`.

```sh
java -Xmx4g -jar validator_cli.jar <file.json ...> \
  -version 4.0.1 -ig <the ndhm.in package.tgz> -tx n/a -output result.json
```

Pass every file in one call; starting the JVM is the slow part. `-tx n/a` keeps the terminology checks offline; drop it to add them. A bundle passes when the output holds no issue of severity error or fatal.

The provider pins carry 0 to 13 errors each and the SHA accepted every one as it stands. An error that says "a code the profile does not define" is the scheme's own vocabulary, not a fault to fix. A warning is advice.
