---
title: Preauthorisation response
sidebar_label: Preauthorisation response
description: The payer's decision as a ClaimResponse, the three elements every sample is missing, and why the beneficiary comes back changed.
verification: unverified
source: "Sample FHIR bundles, `preauth/Query/preauth_response_queryUpdate_App.txt`, `preauth/preauth_request.txt`; NHCX PMJAY Integration Handbook §8.5.1 to §8.5.4, Appendix C.1, Appendix D; NHCX-PMJAY-HMIS Integration Guide §8.4; NHCX Requests and Responses, value sets"
sidebar_position: 9
---

# Preauthorisation response

The payer answers a preauthorisation asynchronously on the provider's `/v1/preauth/on_submit` callback. The payload is a collection bundle whose spine is a `ClaimResponse` carrying the same case number as the request. There are four possible answers: approved, partially approved, queried and rejected. Only the approved and the queried forms have real samples; the queried one is chapter 09. This chapter covers the approval, and documents the other two from specification.

## In short

- The payer's decision as a `ClaimResponse` carrying the same case number as the request.
- Three elements the handbook documents are absent from every sample, including `preAuthRef`.
- The case number in `identifier[0].value` is what actually travels forward to the claim.
- The beneficiary comes back as a different person. Do not overwrite your patient record from a response.

## The bundle

Five entries, in this order, and the response bundle is small because the payer echoes nothing clinical back.

| Entry | Resource | What it is for |
| :---- | :---- | :---- |
| 0 | `ClaimResponse` | The decision |
| 1 | `Patient` | Beneficiary, PMJAY ID only |
| 2 | `Organization` | Payer, `NIIP` `1518`, "SHA HP" |
| 3 | `Organization` | Provider, `NPI` `1652`, "CITY SUPERSPECIALITY HOSPITAL" |
| 4 | `Coverage` | The policy, with the renewal code in `class` |

`Bundle.id` is `PreauthorizationResponseDocument-VB26AA2600001`. The bundle and every resource in it carry `meta.tag` `SUBSETTED`, "Resource encoded in summary mode", from `http://terminology.hl7.org/CodeSystem/v3-ObservationValue`. That tag is on every payer-generated bundle in the corpus. Do not read it as an error; it is how the payer marks a projection of its own record.

## The fields that matter

| Path | Value in the approval sample |
| :---- | :---- |
| `ClaimResponse.identifier[0]` | type `CLN`, system `https://hcx.pmjay.gov.in/v1/preauthorization`, value `VB26AA2600001` |
| `ClaimResponse.status` | `active` |
| `ClaimResponse.use` | `preauthorization`, mirroring the request |
| `ClaimResponse.created` | `2026-02-26T21:39:04+05:30` |
| `ClaimResponse.insurer` | reference to the payer `Organization` |
| `ClaimResponse.requestor` | reference to the provider `Organization` |
| `ClaimResponse.outcome` | `complete` |
| `ClaimResponse.disposition` | `approved by Sayantan` |
| `ClaimResponse.payeeType.coding` | system `http://terminology.hl7.org/CodeSystem/payeetype`, code `provider` |

Three elements the handbook documents are absent from every sample response. There is no `ClaimResponse.request` pointing back at the `Claim`. There is no `ClaimResponse.type`. Most consequentially, **there is no `preAuthRef`**. The flow chapter says `preAuthRef` is the reference to quote on the later claim. No PMJAY response carries one. The case number in `identifier[0].value` is what actually travels forward, and it is the same value in the request, the response, the enhancement and the claim.

`disposition` is a free-text sentence with an operator's first name in it. It is an audit note, not a status. Never parse it.

## Adjudication

Adjudication appears at two levels and you need both.

At claim level, `ClaimResponse.adjudication[0]` has `category.coding.code` `status` and `reason.coding.code` `approved`. Neither coding carries a `system`. This is the field that tells approved from queried from cancelled.

At item level, `ClaimResponse.item[0]` has `itemSequence` 1, matching `Claim.item[0].sequence`, and five adjudication entries. Every one of them binds its category to `https://hl7.org/fhir/R4/valueset-adjudication.html`, an HTML documentation page used as a code system URL.

| Category code | Element used | Value |
| :---- | :---- | :---- |
| `eligible` | `amount.value` | `2700.0` |
| `reason` | `reason.coding.display` | `other d` |
| `eligpercent` | `value` | `100` |
| `eligquant` | `value` | `1` |
| `status` | `reason.coding.code` | `Approved` |

Note the case. The claim-level reason code is lower case `approved`; the item-level status code is capitalised `Approved`. Compare case-insensitively.

The `id` on the item is `Item/Item/1`, a doubled prefix. It is cosmetic, but it will surprise anyone keying on it.

## Totals

`ClaimResponse.total` is an array of two, and the two entries are distinguished by an `id`, not by their category system.

| `total[].id` | Category code | Amount |
| :---- | :---- | :---- |
| `total` | `benefit` | `2700.0` |
| `PMJAY-T` | `eligible` | `2700.0` |

The `benefit` entry carries the adjudication ValueSet URL as its system. The `PMJAY-T` entry carries no system at all. Neither carries a `currency`.

On a first approval the two agree, so nothing forces you to notice the difference. They stop agreeing on an enhancement, where `benefit` becomes the increment and `PMJAY-T eligible` stays cumulative. Chapter 08 works that through. Key your reconciliation on `total[].id`, not on the category code, and decide now which basis your ledger uses, because no source states a rule.

## Reading the answer

`outcome` alone is ambiguous. `complete` means the payer finished processing, which covers both approval and rejection. Read `outcome` together with `adjudication[0].reason.coding.code`.

| `outcome` | Claim-level reason | Meaning | Workflow |
| :---- | :---- | :---- | :---- |
| `complete` | `approved` | Approved in full | 21 |
| `partial` | `approved` | Approved at a reduced amount, reason in `processNote` | 21 |
| `partial` | `queried` | The payer wants more; the case stays open | 24 |
| `complete` | `cancelled` | Rejected | 23 |

The handbook contradicts itself here. Section 8.5.4 and its accompanying note say a rejection is `outcome = complete` with adjudication reason `cancelled`. Appendix C.1 instead maps `outcome = error` to the internal status REJECTED. The narrative form is the one the note argues for explicitly, and the one the workflow sheet supports. Treat `complete` plus `cancelled` as the rejection, and `error` as a gateway or validation failure rather than an adjudication result. Handle both defensively.

## What the samples show

`preauth/Query/preauth_response_queryUpdate_App.txt`, 6,846 bytes, 5 entries. The approval. `outcome` `complete`, claim-level reason `approved`, `total[benefit]` 2700.0, item `eligpercent` 100 and `eligquant` 1. The requested amount was 3,300, so the payer approved 2,700 without marking the response `partial` and without a `processNote` explaining the reduction. Do not expect `partial` to be set whenever a number is cut.

`preauth/enhancement/enhancement_resp.txt` is the other approval, covered in chapter 08. `preauth/preauthresponse_with_query.txt` is the query, covered in chapter 09.

**There is no rejected preauthorisation sample, and no partially approved one.** The handbook specifies both field by field. A partial approval adds `copay` and `benefit` adjudications, a `noteNumber` and a `processNote` with the reduction explained, plus a `preAuthRef` for the reduced amount. A rejection sets `outcome` `complete`, claim-level reason `cancelled`, and a human-readable `disposition`. Neither has been observed in a payload. Build to the specification, log what actually arrives, and be ready for the shapes to differ.

## Answer early, decide later

A payer that stays silent until a person decides loses the conversation. NHCX
redelivers a submission it has had no response to, then drops it and retires
the correlation id; the verdict is refused with `NHCX-1010`, *no data with
given correlation id for call back request*. Both live payers answer twice on
one correlation: a `ClaimResponse` with `outcome: queued` and a disposition
saying the request is with an adjudicator, and then the decision. A provider
system must therefore treat a queued answer as an acknowledgement, not as the
one answer it will accept.

## Traps

**Provider identity is not consistent across one transaction.** The request names the provider `Organization` with `NPI` `IN1910000151` and the name "Usha Kiron". Both preauthorisation responses for that same case use a bare numeric `NPI` `1652` and the name "CITY SUPERSPECIALITY HOSPITAL". The claim and payment bundles for the case use `IN1910000151` with the second name. So three combinations of identifier and name for one hospital in one case. Match a response to a request on the case number in `identifier[0].value`, never on the provider identifier or the organisation name.

**The `Coverage` identifier system changes direction.** The request puts the policy `PMJAY/HP/S/G` under `https://payer.nha.gov.in`; the response puts it under `https://payer.pmjay.gov.in`. The response also adds `Coverage.class` with the renewal code `PMJAY/HP/S/2024/R2` typed `XV`, which the request never sends.

**The beneficiary comes back as a different person.** The request describes a male born 2004-09-18 with one name. The response describes the same PMJAY ID `MD5SLS4X5` with a different name, `gender` `other`, and birth date 2002-01-01. Chapter 03 works through the full three-way divergence. Do not overwrite your patient record from a response.

**The adjudication category system is a web page.** `https://hl7.org/fhir/R4/valueset-adjudication.html` is documentation, and it is a ValueSet page used where a CodeSystem URL belongs. The correct system is `http://terminology.hl7.org/CodeSystem/adjudication`. Match on the code and ignore the system.
