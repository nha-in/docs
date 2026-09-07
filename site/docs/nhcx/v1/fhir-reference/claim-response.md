---
title: Claim response
sidebar_label: Claim response
description: The payer's adjudication of a claim, and the three ways every payer bundle differs from a provider one.
verification: unverified
source: "Sample FHIR bundles, `claim/claim_queryUpdate_response.txt` and `claim/claimresponse_withQuery.txt`, compared against `preauth/enhancement/enhancement_resp.txt`; NHCX Integration Handbook §9.5, §10; NHCX-PMJAY-HMIS Integration Guide §8.5; Standard Error Codes, Claim"
sidebar_position: 13
---

# Claim response

The claim response is the payer's adjudication of a submitted claim. It arrives on `/v1/claim/on_submit` as a `Bundle` of type `collection` holding a `ClaimResponse` and the four resources it references. The same shape carries an approval, a partial approval, a query and a rejection; only `outcome`, `disposition` and the adjudication codes change. This chapter covers the approval and the reduction. The query, which uses the same bundle with different values, is chapter 12.

## In short

- Five entries carrying a `ClaimResponse`. The same shape carries approval, reduction, query and rejection.
- Payer bundles differ from provider bundles in three visible ways, including the `SUBSETTED` meta tag.
- Five other payer bundles in the same run misspell the identifier system as `pmajy`.
- Only `outcome`, `disposition` and the adjudication codes change between decisions.

## The bundle

Five entries, in this order in both claim response samples.

| Entry | Resource | What it is for |
| :---- | :---- | :---- |
| 1 | `ClaimResponse` | The adjudication |
| 2 | `Patient` | The beneficiary, by PMJAY ID |
| 3 | `Organization` | The payer, `NIIP` `1518` |
| 4 | `Organization` | The provider, `NPI` `IN1910000151` |
| 5 | `Coverage` | The policy, with a `class` entry |

Payer bundles differ from provider bundles in three visible ways. Every resource carries `meta.tag` `SUBSETTED` "Resource encoded in summary mode", including the `Bundle` itself. Entries use absolute HTTPS `fullUrl` values under `https://payer.nha.gov.in/claim/v1/claim/on_submit/claimresponse/`, not `urn:uuid:`, and each entry repeats that URL in an `entry.id` field, which is not a FHIR element. And `Bundle.meta.lastUpdated` holds the real time here rather than the frozen template value the provider bundles carry.

The `Bundle.identifier.system` is `https://payer.pmjay.nha.gov.in`, spelled correctly. Five other payer-generated bundles in the same sandbox run misspell it `pmajy`. The claim responses are not among them, so a parser that tolerates only the correct spelling will still break on the coverage and payment traffic.

## The ClaimResponse

| Path | Approval sample |
| :---- | :---- |
| `identifier[0].type.coding.code` | `CLN` |
| `identifier[0].system` | `https://hcx.pmjay.gov.in/v1/preauthorization` |
| `identifier[0].value` | `EO26AA2700001`, echoing the claim number |
| `status` | `active` |
| `use` | `claim`, mirroring the request |
| `created` | `2026-02-27T15:27:29+05:30` |
| `insurer` | Reference to the payer `Organization` |
| `requestor` | Reference to the provider `Organization` |
| `outcome` | `complete` |
| `disposition` | `ok` |
| `payeeType.coding` | `provider`, from `http://terminology.hl7.org/CodeSystem/payeetype` |

Three elements a builder expects are absent from both samples. There is no `request` reference back to the `Claim`, so the response is joined to its claim by `identifier.value` and by nothing else. There is no `preAuthRef`. There is no `processNote`, so the reduction is explained inside the adjudication rather than in a note, and `item.noteNumber` never appears.

`requestor` names the provider organisation as `IN1910000151` "CITY SUPERSPECIALITY HOSPITAL". The provider's own request bundle names the same registry ID "Usha Kiron", and the preauthorisation responses for the same case use a bare numeric `1652` with the superspeciality name. One transaction, one HFR ID, three identities. Match on the identifier value and never on the organisation name.

## Adjudication

The item-level array on the approved response carries six entries against `itemSequence` 1.

| Category | Field used | Value |
| :---- | :---- | :---- |
| `eligible` | `amount` | 2430.00 |
| `reason` | `reason.coding.display` | The audit trail string, below |
| `eligpercent` | `value` | 100 |
| `eligquant` | `value` | 1 |
| `status` | `reason.coding.code` | `Approved` |
| `deductible` | `amount` and `reason.coding` | 270, code `DEDUCT/01` |

Every category except `deductible` and the claim-level `status` binds to `https://hl7.org/fhir/R4/valueset-adjudication.html`, an HTML documentation page used as a code system. `deductible` and the claim-level status carry a `coding` with no `system` at all. Do not attempt to resolve either.

The deduction is the whole reason the benefit is less than the submission. Its reason code is `DEDUCT/01`, display "Non-Covered Service: The claimed service is not covered under the policy and therefore the amount is deducted." It appears only at item level. A reader that sums approved amounts without reading item deductions will report the wrong figure to the finance desk.

Above the items sits a single claim-level `adjudication` entry: category `status`, reason `approved` on the final response and `queried` on the query. That code, not `outcome`, is the decision.

## Totals

Three totals, and they are computed on two bases.

| `total[].id` | Category | Query response | Final response |
| :---- | :---- | :---- | :---- |
| `total` | `benefit` | 0 | 2430.00 |
| (none) | `submitted` | 2700.00 | 2700.00 |
| `PMJAY-T` | `eligible` | 2700.00 | 2430.00 |

On the claim both `benefit` and the `PMJAY-T` eligible total are cumulative and agree once the claim settles. On the enhancement response they do not: `benefit` reports only the increment while the `PMJAY-T` eligible total is cumulative. No document states the rule, and the discriminator is the `total[].id`, an internal string rather than a code. Read `benefit` as the payable amount for the exchange you are in, and treat the `PMJAY-T` entry as the running policy figure.

`total[submitted]` is 2700.00 in both responses. The provider's claim bundle declares `Claim.total.value` of 3300 with an item `factor` of 0.5. The payer's submitted figure matches neither, which means it comes from the payer's own record of the case rather than from the bundle it was sent. Do not reconcile your submitted amount against `total[submitted]`.

The `reason` string on the final response also mixes date formats inside itself:

```
 Auto approved by system.|null|USER1000099~02/27/2026, 03:02 ~Other~queried 1st attempt~CPD-Trust|System~27/02/2026, 03:20~NA~null~CITY SUPERSPECIALITY HOSPITAL|Approved
```

The payer's own entry is stamped `02/27/2026` and the provider's reply `27/02/2026`, month first then day first, in one string written by one system. Both times are on a 12 hour clock with no meridiem against a response created at 15:27. Parse this string for display only. Never derive a timestamp from it.

## Reading the outcome

| `outcome` | Claim-level `adjudication` reason | Meaning |
| :---- | :---- | :---- |
| `complete` | `approved` | Adjudicated. `total[benefit]` is payable, less any item deduction |
| `partial` | `queried` | A question. Totals are zeroed. See chapter 12 |
| `partial` | `approved` | Approved at a reduced amount, pending further processing |
| `complete` | `cancelled` | Rejected. Specified, not sampled |

`outcome` alone is not the decision. `partial` covers both a query and an interim approval, and the two need opposite handling. Read the claim-level adjudication reason first, then `disposition`, then the totals.

Settlement is a separate event. A `complete` and `approved` response closes the adjudication, not the money. The claim is closed only when the payment notice arrives with a UTR.

## There is no rejected claim sample

The sandbox run contains no rejected claim. Both claim responses in the archive are the query and the approval that followed it, and no bundle anywhere in the set carries `outcome` `complete` with reason `cancelled`, a populated `ClaimResponse.error`, or a `form` element. The rejection path is specified in the handbook and in the standard error code list, and the gateway's `ClaimError-1` onward codes are real, but nothing in the sample set demonstrates them. Build the rejection branch from the specification, and treat the field-level detail as unverified until a payer sends you one.
