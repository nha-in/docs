---
title: Predetermination, status and search
sidebar_label: Predetermination, status and search
description: Three exchanges defined by the specification and never observed, documented as far as the specification goes and no further.
verification: unverified
source: NHCX Technical Specifications, API structure table; Implementation Guide for Adoption of FHIR in ABDM and NHCX, use case rows 5 and 6; NHCX Requests and Responses for UseCases, Value sets, Search and Status sheets; Standards for NHCX, page 38; NHCX Usecases; Domain Specifications, e-objects; AWS Sandbox NHCX Use Case Postman Collection
sidebar_position: 18
---

# Predetermination, status and search

Three exchanges are defined by the specification and have never been observed. There is no sample bundle for any of them. The sandbox Postman collection lists all six of their endpoints. But the eight sandbox entries covering predetermination, communication, status and search all carry the same recycled placeholder ciphertext, so decrypting one tells you nothing about the domain payload inside. This chapter documents what the specification says and stops there.

## In short

- Three exchanges defined by the specification and never observed in a payload.
- The sandbox entries for all of them carry the same recycled placeholder ciphertext.
- Predetermination reuses `Claim` and `ClaimResponse`; only `Claim.use` changes.
- The teaching deck's enumeration of `Claim.use` is wrong, and its values are rejected.

## Predetermination

Predetermination asks the payer what it would pay for a proposed treatment, without committing the provider to deliver it and without reserving a benefit. It sits earlier than preauthorisation in the same lifecycle.

| Endpoint | Direction | Bundle |
| :---- | :---- | :---- |
| `POST /v1/predetermination/submit` | Provider to gateway to payer | `ClaimBundle` |
| `POST /v1/predetermination/on_submit` | Payer to gateway to provider | `ClaimResponseBundle` |

The bundles are the ones chapters 10 and 11 describe. Predetermination reuses `Claim` and `ClaimResponse` exactly as preauthorisation and claim do. Only `Claim.use` changes, which is the eleventh rule in chapter 01 applied to a third value.

| `Claim.use` | Exchange |
| :---- | :---- |
| `predetermination` | Predetermination |
| `preauthorization` | Preauthorisation, in every sample |
| `claim` | Claim, in every sample |

**The teaching deck's enumeration is wrong.** The Standards for NHCX deck shows `"use" : "claim | pre-auth | pre-det"`. Neither `pre-auth` nor `pre-det` is a valid FHIR R4 code. The real value set is `claim`, `preauthorization`, `predetermination`, and the samples confirm the first two. Anyone who treats the slide as normative emits payloads the payer rejects. Send `predetermination`.

The Domain Specifications page adds that `Claim` and `ClaimResponse` serve predetermination "in future", and the NHCX use case list says only that a payer application will store the request and respond. No payer in the mirror is recorded as having implemented it. Confirm support with the payer before building it, and expect the preauthorisation path to be the one that actually runs.

## Status

Status is a protocol operation, not a FHIR one. A sender asks the gateway what became of a message it already sent.

| Endpoint | Direction | Payload |
| :---- | :---- | :---- |
| `POST /v1/status` | Any participant to gateway | Empty string |
| `POST /v1/on_status` | Gateway to the asking participant | Status reported in the protected header |

The specification is explicit that the payload must be an empty string. There is no bundle, no `Task`, no resource of any kind. Everything travels in the JWE protected header. `x-hcx-correlation_id` must be the `x-hcx-api_call_id` of the message whose status you are checking, which is the only field that links the two. The callback returns `x-hcx-status` `request.dispatched`, and `x-hcx-error_details` where the original message failed.

Two naming conventions appear. The technical specifications table lists the pair as `/hcx/status` and `/NHCX/on_status`. The sandbox Postman collection uses `https://apisbx.abdm.gov.in/hcx/v1/status` and `/hcx/v1/on_status`. Build against the Postman form, which is the one the sandbox actually serves, and keep the path configurable.

Because status carries no FHIR, there is nothing in this chapter for a bundle builder. It belongs in the reference only so that no one goes looking for a `Task` shape that does not exist.

## Search

Search is not a provider exchange. It lets an authorised entity, named in the specification as NHA or IRDAI, ask a payer for the claim documents behind a case number. The flow is NHA to gateway to payer, and back.

| Endpoint | Direction | Bundle |
| :---- | :---- | :---- |
| `POST /v1/search/submit` | Authorised entity to gateway to payer | `Task` bundle |
| `POST /v1/search/on_submit` | Payer to gateway to entity | `Task` bundle with `ClaimResponse`s |

The request is a `Task` with `status` `requested`, `basedOn` carrying the request reference, and one or more inputs from the standard input-type value set. The response is a `Task` whose `output` references the matching `ClaimResponse` resources in the same bundle, resolved the same way as a reprocess or cancel answer.

| Input type | Meaning |
| :---- | :---- |
| `ClaimNumber` | The case number |
| `InitimationNumber` | The preauthorisation or claim intimation number, spelled as shown |
| `PolicyNumber` | The member's policy |
| `ProductNumber` | The benefit product |
| `PayerId`, `ProviderId` | The two participants |
| `FromDate`, `ToDate` | The search window |
| `FinanceYear` | Policy or financial year |
| `ServiceCode` | A benefit or service code |

**The task code for search is given three ways.** The NHCX value set defines `search` as the code used to search claim responses for given inputs. The Search sheet in the same document says the request carries `code` `status` and the callback carries `code` `poll`. An earlier draft of this reference said `search` on the request and `poll` on the answer. Nothing has been observed, so none of the three can be confirmed. If you implement search, agree the code with the payer in writing first.

`response.partial` is a valid status on `/v1/search/on_submit`, so a search may be answered across several callbacks against one correlation ID.
