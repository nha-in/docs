---
title: PMJAY sandbox run
sidebar_label: PMJAY sandbox run
description: What the SHA HP sandbox actually accepted and refused over two days in September 2026, and what each refusal turned out to mean.
verification: verified
source: "the SHCX sandbox run of 5 and 6 September 2026 against `apisbx.abdm.gov.in` and `apisbeta.nha.gov.in`, recorded in the NHCX Adapter's ledger and the provider's exchange ledger; NHCX Payer Service API Workflow Guide for External Integrators; NHCX PMJAY Integration Handbook §4.1 and Appendix A (error codes); Sample FHIR bundles, `preauth/preauth_request.txt`; `apps/reference/provider`, validated with the HL7 validator against ndhm.in 6.5.0"
sidebar_position: 10
---

# PMJAY sandbox run

Everything before this chapter was written from NHA's documents. This chapter is written from a run against the live NHCX sandbox on 5 and 6 September 2026. In it: the provider participant `1000003463@hcx`, the SHA HP payer `1518@hcx`, the beneficiary `MD5SLS4X5`, the SHA's package master, and the NHCX Payer Service that adjudicates a PMJAY case. It records what the SHA actually accepted and refused, in the order a hospital meets it, and what each refusal turned out to mean. Where this chapter and an earlier one disagree, this one is the evidence.

On the second day the whole journey went through, over the live sandbox. A pre-authorisation raised in the provider application was accepted, approved at PPD-Trust, enhanced, discharged, claimed, and walked through the claim roles to approval. Nine refusals were met and settled on the way, and each is written up below in the order it arrives.

## In short

- Written from a live run against the SHA HP sandbox on 5 and 6 September 2026, end to end to an approved claim.
- Nine refusals were met and settled. Where this page and an earlier one disagree, this one is the evidence.
- `PAYR-1027` is structural: the item needs a FHIR element id, not a different package code.
- A PMJAY case is not decided over NHCX. The integrator drives it through the Payer Service by role.
- The claim goes out under the pre-authorisation's number and bills the package alone.

## The run in one table

| Step | Call | What the SHA answered | Where the shape lives |
| :---- | :---- | :---- | :---- |
| Policy search | registry `/participant/get/policies` | The member's cover: `PMJAY for Himachal`, policy `PMJAY/HP/S/G` | |
| Discovery, validation, benefits, auth-requirements | `/v1/coverageeligibility/check` | Answered every time, purpose by purpose; validation says `active` to 2 April 2028 | `apps/reference/provider/coverage/*` |
| Package master | `/v1/insuranceplan/request`, plan Task | `PAYR-1401` for `PMJAY/CH/S/G`; the full master, 1,053 packages, for `PMJAY/HP/S/G` | `apps/reference/provider/insurance` |
| Preauthorisation | `/v1/preauth/submit`, workflow 12 | `PAYR-1027`, then `PAYR-1083`, then `PAYR-1238`, each fixed in turn as below | `apps/reference/provider/preauth/request` |
| Adjudication | Payer Service `get/user-role`, `process/case` | `PPD-Trust` approved the pre-auth and the enhancement; `CEX-Trust`, `CPD-Trust`, `ACO-Trust`, `SHA-Trust` walked the claim to approval | this chapter |
| Enhancement | `/v1/preauth/submit`, workflow 13 | accepted and approved on the same case, ₹1,500 added | `apps/reference/provider/preauth/enhancement` |
| Claim | `/v1/claim/submit`, workflow 15 | accepted, queued, then approved after the role walk | `apps/reference/provider/claim/request` |
| Status enquiry, reprocess | `/v1/task/submit` | refused: `status` and `reprocess` are not combinations the SHA takes | this chapter |

The coverage and plan flows passed with the reference bundles unchanged. Everything from the pre-authorisation on had something to teach, and the refusals below are in the order they arrive.

## PAYR-1027: "Invalid item id" means the item has no `id`

The message reads *Invalid item id found for item in claim component. Hence request will not be processed further.* Every reading of it as a package-code problem was wrong. The same bundle was refused with `MG0111A`, `MG004C` and `MG0105A`, with and without a stratification tier, and with the category as `MG` from the master. It was refused again as the reference bundle itself, byte for byte apart from dates. What the SHA was missing was the FHIR **element id** on each `Claim.item`.

The NHA sample bundles carry these ids and the reference bundles did not. The payer service reads the Claim's lists by them:

| Element | `id` | Example |
| :---- | :---- | :---- |
| `Claim` | the claim number | `"id": "PA000247"` |
| `Claim.item[n]` | `Item/n` | `"id": "Item/1"` |
| `Claim.procedure[n]` | `Procedure/n` | `"id": "Procedure/1"` |
| `Claim.supportingInfo[n]` | `SupportingInformation/n` | `"id": "SupportingInformation/3"` |
| `Patient`, `Coverage`, the provider `Organization` | `1` | |
| the payer `Organization` | `2` | |
| `Practitioner`, `Procedure` | their serial | `"id": "1"` |

With those in place the very same bundle moved past every item check. `PAYR-1028`, *invalid item sequence*, and `PAYR-1029`, *invalid bundle id*, sit in the same block of structural rules. Read them the same way: an element the service addresses by id or sequence is missing that handle, not carrying a wrong value.

## PAYR-1083: the Practitioner needs an `HPIN` identifier

*No HPR details found for the practitioner for resource https://nhcx.abdm.gov.in/practitioner. Please send the details in the identifier for Practitioner resource with category code as HPIN.* The reference practitioner carried the HPR id typed `HPID` and the registration number typed `MD`. The SHA looks the doctor up by the identifier typed `HPIN` from `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code`, and the NHA sample carries the same HPR id twice, once as `HPID` and once as `HPIN`, both under `https://hpr.abdm.gov.in`. Send all three:

```json
"identifier": [
  { "type": { "coding": [{ "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "HPID", "display": "Healthcare Professional ID (HPID)" }] }, "system": "https://nhcx.abdm.gov.in", "value": "71-5566-2211-8834" },
  { "type": { "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MD", "display": "Medical License number" }] }, "system": "https://nhcx.abdm.gov.in", "value": "KMC/2012/22907" },
  { "type": { "coding": [{ "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "HPIN", "display": "Health Practitioner ID issued by NDHM" }] }, "system": "https://hpr.abdm.gov.in", "value": "71-5566-2211-8834" }
]
```

The sandbox did not check the HPR id against the registry; a well-formed 14-digit id was enough. Production may not be as kind. In the same bundle the `careTeam.qualification` went out as a SNOMED specialty concept (`394802001` General medicine) and the `Practitioner.qualification` as a v2-0360 degree code (`MD`), as the reference has them. The SHA did not object to either, and both were free text in the first refused attempt. Treat coding them as prudent rather than proven necessary.

## PAYR-1238: one live preauthorisation per beneficiary per hospital

*Beneficiary is having an active preauthorization request at this hospital with reference number PMJAY/HP/S/2024/R2/2026090410000443. Hence the request will not be processed. Kindly cancel the active preauthorization request or raise a claim to proceed.* This is a scheme rule, not a bundle fault, and it will bite any team that shares one sandbox beneficiary across several deployments. The reference number's last sixteen digits, `2026090410000443`, are the SHA's **case id**, and that id is what the Payer Service wants; see the next section. The remedy is either a cancel Task (`PC01`) from the hospital that raised it, or a `Reject` at `PPD-Trust` on the Payer Service. Until one of those happens, every new preauthorisation for that beneficiary at that hospital is refused with this code. The refusal arrives *after* the bundle has passed validation, which is how we know the bundle was right.

Two earlier refusals are worth naming because they are easy to mistake for bundle faults. `PAYR-1401`, *policy not allowed for the hospital*, on the package master means the policy number is one the hospital is not empanelled under, `PMJAY/CH/S/G` here. Ask again with the beneficiary's own policy from the eligibility answer, `PMJAY/HP/S/G`, and the master arrives. And before any of this, a request whose item had no package code at all, `UNCODED`, was refused with `PAYR-1027` too, because it also had no item id. A package code that is not in the master is a later rule, `PAYR-1248`, which names the code.

## PAYR-1256 and PAYR-1363: Consent stands in for biometrics

*Response for Authentication Consent Questionnaire is missing for case number %s. This must be sent if the biometric authentication for patient is not available.* PMJAY authenticates the beneficiary biometrically at admission and again at discharge. A system with no biometric device sends the scheme's own consent questionnaire instead. The questionnaire is the **plan's**: its url and link ids come out of the package master, so they have to be read off the master rather than written into the code. In the SHA HP master they are:

| Form | `Questionnaire.url` | Questions |
| :---- | :---- | :---- |
| Authentication Consent (pre-authorisation) | `https://payer.gov.in/policy/questionnaire/100024` | `100093` attachment, Medical Superintendent Declaration Form (During Admission); `100095` string, Remarks |
| Discharge Consent (claim) | `https://payer.gov.in/policy/questionnaire/100466` | `135477` attachment, Medical Superintendent Declaration Form (During Discharge) |

The answers ride exactly as the NHA sample carries them: a `QuestionnaireResponse` naming the questionnaire's url, and a supporting-info entry of category `INF`, code `ODN`, whose `valueReference` points at that response. `PAYR-1363` is the same refusal at the claim, naming the discharge form.

## PAYR-1019, PAYR-1008 and ERR-PYR-CLM-007: three more on the claim

**`PAYR-1019`, invalid sequence in supporting info.** Adding the questionnaire entries after the dated ones left them without a `sequence`. Every `supportingInfo` element needs one, numbered from 1 with no gaps, and the numbering has to happen after the list is complete rather than as each piece is built.

**`PAYR-1008`, invalid content type in attachment for item MB.** The SHA reads `application/pdf`, `application/jpg`, `application/jpeg`, `application/png` and `application/fhir+json`, and nothing else. A generated document sent as `text/plain` is refused, so this application now writes its itemised bill, discharge summary and record extracts as one-page PDFs.

**`ERR-PYR-CLM-007`, no prior preauthorization or claim record found for case number %s.** The SHA keeps one case per episode and looks the claim up by the number the pre-authorisation was raised under. A claim sent under a number of its own finds no case. The claim goes out under the pre-authorisation's number; the claim row still owns its correlation id, so the answer lands on the right record.

## PAYR-1245: one conservative Procedure per case

An enhancement adding a second package coded `Conservative` is refused: *only one conservative procedure can be booked for a case, but received request for 2*. The master's `ProcedureType` decides this, and in the SHA HP master 157 of 200 packages are `Conservative`, 37 `Medical`, 6 `Surgical`. An enhancement on a conservative case has to add a `Medical` package (Acute Haemodialysis `MG072C` went through and was approved at ₹1,500) or an add-on the master flags as enhanceable.

## The enhancement names no case of its own

The acknowledgement of an enhancement comes back with `preAuthRef` null: the enhancement is decided on the case its parent opened, and the payer service answers only for that case number. A provider system therefore has to carry the parent's case reference onto the child when it raises one, or its desk call will be refused with *Event Meta Log not found for correlationId*.

## One request at a time on a case

`PAYR-1322`, *active instance found for case number %s*, is the rule behind several of the timings above: the scheme takes one request at a time on a case. A claim raised while an enhancement is still queued is refused with it, and the payer service's role lookup still answers `PPD-Trust` because the case has not left the pre-authorisation queue. Two consequences for a provider system:

- **Read the role before every desk action, and treat a pre-authorisation role on a claim as "not yet".** The role names where the case is, not what you are asking about.
- **The desk refuses an action for a request the exchange has not finished delivering**, with *Event Meta Log not found for correlationId*, and refuses one for a case mid-filing with *Case not found for caseId*. Both mean "try again shortly"; the end-to-end test in `apps/e2e/tests/31-pmjay-happy.spec.ts` retries on exactly those two.

The SHA also re-queues an enhancement it has been asked to approve, answering `queued` again rather than a verdict, and decides it in its own time. On the run that went end to end the enhancement was approved a minute after the ask; on a later run it was still queued five minutes on. Nothing in the bundle changes that, and a test suite has to report the scheme's pace rather than assert it away.

## What the sandbox would not take

Two exchanges this application sends to other payers have no home at PMJAY, and both fail on the same validation:

- **Status enquiry.** A `Task` coded `status` is refused with `PAYR-1018` (no reason code) and, with one, `PAYR-1008` (*invalid input, code and reason code received … refer to the document*). The scheme's own tables use `status` only for the payment acknowledgement, so where a case stands is read from the payer service's role lookup instead, not asked for over NHCX.
- **Reprocess.** A `Task` coded `reprocess` with reason `partialpayment` on an approved, unpaid claim is refused the same way. The handbook gates a shortfall behind an acknowledged payment notice 33, and the sandbox had sent none, so nothing here proves the shape wrong. It does prove the combination is validated before the case is looked at.

Both refusals name a document of valid code-and-reason combinations that is not published in the material NHA ships.

## What the package master decides

The master the SHA returns for the beneficiary's policy is what the item must be coded from. For `MG0111A` it says:

| Field | Value | Where it goes on the Claim |
| :---- | :---- | :---- |
| package code and display | `MG0111A`, "Pleural Effusion (Pleural Effusion)" | `item.productOrService`, system `…/ndhm-procedure-code` |
| specialty | `MG`, "General Medicine" | `item.category`, system `…/ndhm-benefit-category` |
| `ProcedureType` | `Conservative` | `Claim.procedure.type`, `https://nhcx.abdm.gov.in/procedure-type`, code `conservative` |
| `StratificationAllowed` | `Y` | whether a ward tier may ride as `item.modifier` |
| stratification tiers | `STRAT006a` Routine Ward 1800, `STRAT006b` HDU 2700, `STRAT006c` ICU without ventilator 3600, `STRAT006d` ICU with ventilator 4500 | `item.modifier.coding`, code and display only, no system |
| `ApprovalNotRequired` | `N` | whether a preauthorisation is needed at all |
| `EnhancementAllowed` | `Y` | whether the package may be added on an enhancement |

The specialty is the code of the category the master files the package under, exactly as `PAYR-1114` says. A generic category (`GEN`) is wrong for every PMJAY package. The ward the patient is in maps onto the tiers by label. A general, semi-private, private or deluxe bed is the routine ward tier, an HDU bed the HDU tier. An ICU bed is the ICU tier without a ventilator unless the record says otherwise. The amount asked for stays the hospital's own; the tier's rate is what the SHA will pay for it, not what the hospital must claim.

The master also says what the **claim** may carry. A PMJAY package rate is all-inclusive, so the claim bills the package alone at the whole of what was billed. Room rent, consultations and investigations are not items of their own and would be refused as invalid item codes. The generic flow, where every bill line is an item, stays right for an indemnity payer.

## Adjudicating on the NHCX payer service

A PMJAY case is not decided over NHCX. It sits at `request.initiated` until somebody acts on it in the SHA's Transaction Management System. In the sandbox that somebody is the integrator, through two endpoints the *NHCX Payer Service API Workflow Guide for External Integrators* publishes.

**Token.** Both endpoints take `bearer_auth: Bearer <token>`, and the token is the ordinary ABDM session token: `POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` with the participant's `clientId`, `clientSecret` and `grantType: client_credentials`, plus `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID: sbx` headers. It lives 1,200 seconds. The gateway that already holds these credentials can hand it out; the NHCX Adapter does at `GET /token`.

**Who holds the case.**

```
POST https://apisbx.abdm.gov.in/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role
{ "caseid": "2026090410000443", "payerid": "1518" }
→ { "currentuserrole": "PPD-Trust", "errormessage": null }
```

`caseid` is the SHA's case id, the sixteen digits at the end of the reference `PMJAY/HP/S/2024/R2/2026090410000443`. It is **not** the hospital's claim number: asked about `PA000239` the service answers `No Data found with the caseid PA000239. Please use the current active case id.` A hospital therefore has to learn the SHA's case id for each preauthorisation it raises. The sandbox gives it out in two places: inside the `PAYR-1238` refusal of the next request, and, once a request is accepted, in the SHA's acknowledgement and status answers on the case. Store it beside the claim number the moment it is seen.

**Acting on it.** One endpoint, one body, the action spelled as the guide's table has it for the role that currently holds the case:

```
POST https://apisbeta.nha.gov.in/pmjay/hcx/nhcxpayerservice/wrapper/process/case
{
  "casenumber": "2026090410000443", "action": "Approve", "usecase": "PREAUTH",
  "receivercode": "1518", "sendercode": "1000003463", "memberid": "MD5SLS4X5",
  "correlationid": "<a fresh uuid>", "remarks": "ok"
}
```

| Step | Role | Actions | `usecase` |
| :---- | :---- | :---- | :---- |
| preauth | `PPD-Trust` | `Approve`, `Reject`, `Query` | `PREAUTH` |
| claim 1 | `CEX-Trust` | `Forward` | `CLAIM` |
| claim 2 | `CPD-Trust` | `cpdApprove`, `cpdReject`, `Pending` | `CLAIM` |
| claim 3 | Medical Audit Committee | `Approve`, `Reject`, `iQuery` | `Medical Audit Committee` |
| claim 4 | `ACO-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| claim 5 | `SHA-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| claim 6 | Claim Review Committee | `Approve`, `Reject`, `Pending` | `Claim Review Committee` |

Read the role before every action, use the exact spelling, and mint a new correlation id per call. A preauthorisation is one decision; a claim walks all six roles, and the `usecase` changes at the two committees. The decision then comes back to the hospital over NHCX as the `ClaimResponse` on the request's own correlation id, so the desk call and the callback are two halves of one step.

**The walk, as it ran.** The pre-authorisation was approved at `PPD-Trust` and came back over NHCX as a `ClaimResponse` with `outcome: complete` and a benefit of ₹2,070 against ₹3,300 asked (the SHA prices the package itself). The enhancement was approved on the same case for ₹1,500. The claim was forwarded by `CEX-Trust`, approved by `CPD-Trust` as `cpdApprove`, then by `ACO-Trust` and `SHA-Trust`, after which the role lookup answered with no role at all. The case was decided, and the verdict arrived on the claim's own thread. The Medical Audit Committee and the Claim Review Committee never held this case: the six steps in the guide's table are the roles a case *may* pass through, not a queue every case walks.

**Reading the role between actions is not optional.** The service moves the case on its own schedule, and the role that answers is the only one whose action names are legal. A cycle that assumes the next step in the table will be refused.

The provider application in this repository drives both endpoints from the episode screen: `GET /api/preauths/:id/adjudicator`, `POST /api/preauths/:id/adjudicate`, and the same under `/api/claims`. It records every action on its exchange ledger under the family `adjudication`, and gets its token from the adapter's `GET /token`. It stores the SHA's case reference the moment the acknowledgement carries it (`preauths.payer_case_ref`) and addresses the desk by the last segment of it, which is what the whole walk above ran on.

## What this changes in the earlier chapters

- **Chapter 05/01, the rules.** Add element ids to every Claim bundle (rule 12) and the `HPIN` identifier to every Practitioner (rule 13). Both are in the reference set under `apps/reference/provider`, which the three applications are held to byte for byte.
- **Chapter 05/06.** The sample's `factor: 0.5`, the `MP` category system and the SNOMED system on the package code are things the SHA tolerates, not things it needs. The reference bundle passed with `factor` 1, category `MG` under `…/ndhm-benefit-category` and the package under `…/ndhm-procedure-code`.
- **Chapter 07 of this part.** The specialty on the item is the master's category code, the ward tier the master's stratification code, the claim the package alone. The four mandatory `MAND…` documents the sample carries were not demanded at submission; expect them to be queried for.
- **The error table.** `PAYR-1027` is structural, not a code lookup, and so are `PAYR-1019` and `PAYR-1029`. `PAYR-1008` is about a content type or a code-and-reason combination, depending on where it lands.
- **Chapter 05/10, the claim.** Under PMJAY the claim carries the pre-authorisation's number, the package alone at the whole amount, the discharge consent questionnaire, and documents in a content type the payer reads.
