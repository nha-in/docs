---
title: Claim
sidebar_label: Overview
sidebar_position: 0
description: "The Claim calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
source: nhcx-package/apis/05-claim
generated: true
---

# Claim

The claim is where money actually moves.

## APIs

| Call | Called by | Method and path | What it does |
| --- | --- | --- | --- |
| [Provider: submit a claim](/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-submit) | Provider | `POST /v1/claim/submit` | Provider submits the final itemised Claim bundle (Claim.use claim), or a claim query response or resubmission; NHCX routes it to the payer. |
| [Payer: send the claim response](/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-on-submit) | Payer | `POST /v1/claim/on_submit` | Payer returns interim (response.partial) and final (response.complete) ClaimResponseBundles for a claim to the provider via NHCX. |

## One path, two meanings by scheme

Nothing in the envelope names the scheme, so the payer you address decides what `/v1/claim/submit` carries.

| Payer | What travels on `/v1/claim/submit` | Workflow |
| --- | --- | --- |
| General network | A provisional discharge submission first, then the final claim | `14`, then `15` |
| PMJAY | One combined discharge and claim submission. No separate discharge step exists | `15` |

[Discharge and claim](/docs/nhcx/v1/roles/provider/discharge-and-claim) and [PMJAY scheme rules](/docs/nhcx/v1/concepts/pmjay-use-cases#scheme-rules-the-hmis-must-implement) carry the detail.

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path | Hosted by |
| --- | --- |
| `/v1/claim/submit` | The payer |
| `/v1/claim/on_submit` | The provider |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx` |
| Production. | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Claim request](/docs/nhcx/v1/reference/fhir/claim-request)
- [Claim response](/docs/nhcx/v1/reference/fhir/claim-response)
- [Claim query and answer](/docs/nhcx/v1/reference/fhir/claim-query-and-answer)

The whole specification, with a request you can send from the page, is the [Claim API reference](/reference/nhcx-claim).
