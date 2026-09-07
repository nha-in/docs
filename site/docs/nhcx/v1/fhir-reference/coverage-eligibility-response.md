---
title: Coverage eligibility response
sidebar_label: Coverage eligibility response
description: The payer's answer, which echoes your whole request back before answering it, and how to index it without reading your own data.
verification: unverified
source: "NHCX Integration Handbook §7; Insurance Plan Implementation Guide, CoverageEligibility flattened tables; Coverage Eligibility (NHA); NHCX-PMJAY-HMIS Integration Guide §8.4.0; Sample FHIR bundles, `coverageeligibility/coverageresponse_validation.txt`, `coverageresponse_benefits.txt`, `coverageresponse_auth-requirement.txt`"
sidebar_position: 3
---

# Coverage eligibility response

The payer's answer to the eligibility question. It arrives on the `on_check` callback and it is not a small message, because the payer sends your entire request back before answering it. Understanding that structure is most of the work of parsing it.

## In short

- The payer sends your entire request back before answering it: eleven entries, of which the first six are the echo.
- Index the bundle by `fullUrl`, not by resource type, or you will read your own data back.
- The request id comes back truncated at the last slash. Match on `request.reference` instead.
- The patient is a different person on each side of the exchange. Do not overwrite your record.

## The bundle

Eleven entries. The first six are your request, echoed. The last five are the answer.

| # | Resource | Half | What it is |
| :---- | :---- | :---- | :---- |
| 1 | `CoverageEligibilityRequest` | echo | Your request resource, unchanged |
| 2 | `Patient` | echo | The patient as you sent it |
| 3 | `Organization` (`prov`) | echo | The hospital as you sent it |
| 4 | `Organization` (`pay`) | echo | The payer as you sent it |
| 5 | `Coverage` | echo | The policy stub as you sent it |
| 6 | `Practitioner` | echo | The enterer as you sent it |
| 7 | `CoverageEligibilityResponse` | answer | The answer, with `insurance[].item[]` |
| 8 | `Patient` | answer | The payer's own record for this beneficiary |
| 9 | `Coverage` | answer | The payer's own policy record, with real dates and class |
| 10 | `Organization` (payer, id `1518`) | answer | The payer as the payer sees itself |
| 11 | `Organization` (provider, id `IN1910000151`) | answer | The hospital as the payer sees it |

The echo is byte-identical to what you sent apart from two changes. Every echoed resource gains a `meta.tag` of `SUBSETTED` from `http://terminology.hl7.org/CodeSystem/v3-ObservationValue`. And `CoverageEligibilityRequest.id`, which you sent as `PMJAY/HP/S/G`, comes back as `G`: the payer has split the id on the last slash and kept the tail. Do not use that id to match the response to the request. Use `CoverageEligibilityResponse.request.reference`, which is intact.

Note that entries 8 to 11 duplicate entries 2 to 5 as resource types. Index the bundle by `fullUrl`, not by resource type, or you will read the request's `Patient` and think the payer returned your own data.

Every entry on both halves also repeats its `fullUrl` in a `Bundle.entry.id`. FHIR allows an `id` on any element but constrains it to at most 64 characters of letters, digits, hyphens and dots. These values are absolute URLs. A strict validator will reject them, and no consumer needs them.

## The answer

| Path | Value in the sample |
| :---- | :---- |
| `status` | `active` |
| `purpose[]` | Echo of the request's purpose |
| `outcome` | `complete` |
| `disposition` | `Policy is currently in-force` |
| `identifier[0]` | system `https://hcx.pmjay.gov.in/v1/coverageeligibility/check`, value `MD5SLS4X5-IN1910000151` |
| `request.reference` | The request's `fullUrl` |
| `patient`, `insurer`, `requestor` | References to entries 8, 10 and 11 |
| `insurance[0].coverage` | Reference to entry 9 |
| `insurance[0].inforce` | `true` |
| `meta.profile` | `http://hl7.org/fhir/StructureDefinition/CoverageEligibilityResponse` |

The response identifier is the PMJAY ID and the HFR ID joined by a hyphen, and it is the same value in all three responses. It identifies the beneficiary at the hospital, not the exchange. It is not a correlation key.

`meta.profile` is the base HL7 profile, not the NRCeS one. Every provider-generated resource in the set declares `https://nrces.in/ndhm/fhir/r4/StructureDefinition/...`; the payer's response resource declares plain HL7. The echoed half keeps the NRCeS profiles it arrived with.

## By purpose

**Validation.** One item, and it is the only response that carries money.

| Path | Value |
| :---- | :---- |
| `item.productOrService.coding` | system `http://snomed.info/sct0`, code `305056002`, display `Admission procedure` |
| `item.benefit[0].id` | `MD5SLS4X5/PMJAY-T` |
| `item.benefit[0].type.coding` | `http://terminology.hl7.org/CodeSystem/ex-benefitcategory`, code `30`, `Health Benefit Plan Coverage` |
| `item.benefit[0].allowedMoney` | 463730.00 INR |
| `item.benefit[0].usedMoney` | 36270.00 INR |
| `item.authorizationRequired` | `true` |

`allowedMoney` is the balance remaining, not the sum insured. The plan's `generalCost` for this policy is 500,000 INR, and 463,730 plus 36,270 is exactly that. There is one item per wallet; PMJAY beneficiaries can hold more than one, so read them all.

**Benefits and auth-requirements.** Both return the same single item:

| Path | Value |
| :---- | :---- |
| `item.productOrService.coding[0]` | code `MG004A`, display `Dengue fever`, **no system at all** |
| `item.excluded` | `true` |
| `item.authorizationRequired` | `true` |

There is no `benefit[]`, no `allowedMoney`, no `authorizationSupporting[]`. The handbook's element tables show `benefit[].type` values of `Procedure`, `Investigation` and `Stratification` for the benefits purpose, and `authorizationSupporting[]` codings carrying `MAND` document codes for auth-requirements. The samples carry none of it. Build for the fuller form and tolerate the leaner one.

## What the sample shows

`coverageresponse_validation.txt` is 16,042 bytes, `coverageresponse_benefits.txt` 15,729, `coverageresponse_auth-requirement.txt` 15,747. All three arrived on 26 February 2026 between 18:21 and 18:25, roughly five and a half hours after the requests.

The `benefits` and `auth-requirements` responses are identical in their `CoverageEligibilityResponse` apart from `purpose`, `created` and `Bundle.timestamp`. Every field that would distinguish an authorisation-requirements answer from a benefits answer is absent from both. The two purposes are not actually differentiated in this payer's implementation. If you need to know which documents a package demands, take them from the `InsurancePlan`, which does carry them, rather than from an `auth-requirements` response.

## Traps

**The payer identifier system is misspelled.** `Bundle.identifier.system` on all three responses is `https://payer.pmajy.nha.gov.in`. That is `pmajy`, not `pmjay`. Requests use the correct spelling. Two other payer-generated bundles share the typo, the payment notice and the cancel response, making five in all. Other payer bundles, including the insurance plan response, spell it correctly. Never key a lookup on this system string.

**A third spelling appears one entry further down.** The payer's own `Coverage.identifier.system` is `https://payer.pmjay.gov.in`, with no `nha`. Your request sent `https://payer.nha.gov.in` for the same policy code, and the `InsurancePlan` uses `https://payer.nha.gov.in` again. Three systems, one policy `PMJAY/HP/S/G`.

**The patient is a different person on each side of the exchange.** For the single PMJAY ID `MD5SLS4X5` the corpus holds two irreconcilable demographic records. The split is provider against payer, rather than one exchange against another.

| Side | Name | Gender | Birth date |
| :---- | :---- | :---- | :---- |
| Every provider-generated bundle: eligibility, preauthorisation and claim requests, including the `Patient` resources inside embedded clinical documents | Soubhik Biswas | `male` | 2004-09-18 |
| Payer-generated coverage responses | PALLVI | `female` | 0006-06-25 |
| Payer-generated claim responses | PALLVI | `other` | 2002-01-01 |

That reads as integrator test data on the provider side and the payer's real record on the other, never reconciled, and the payer's own two responses do not agree with each other either. The birth date `0006-06-25` is not a typo you can repair; it parses as the year 6 CE and any age calculation on it will produce nonsense. The `JHN` value differs too: `91-7182-8065-4077` in the request against `020700400170000003120007` in the response, and the response adds an `ABHA` identifier of `91-7034-1237-4240` in the format the request used for `JHN`. Treat the payer's `Patient` as authoritative for the policy, keep your own for the encounter, and never overwrite one with the other. Validate `birthDate` before display.

**`item.productOrService` loses its system.** You sent `MG004A` under `https://payer.pmjay.nha.gov.in`. It comes back with a bare code and display, no `system` element. A strict `CodeableConcept` matcher will fail to match it against anything.

**`http://snomed.info/sct0` is not SNOMED.** The trailing zero appears only in the validation response's admission concept. Code `305056002` is a real SNOMED concept, so the value is right and the system is wrong.

**`Coverage.relationship.coding.system` is an HTML page**, `https://terminology.hl7.org/6.5.0/CodeSystem-subscriber-relationship.html`, carrying the code `child`. The code is valid; the system is a link to documentation about the system.

**One identifier is an encrypted blob.** The payer's `Patient` carries an `ADN` (Aadhaar) identifier whose value is a 120-character ciphertext ending in `==`. Do not log it, do not display it, and do not try to validate it as a twelve-digit number.
