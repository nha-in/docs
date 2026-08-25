---
title: M3 consent and fetching
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 3 gives you, who asks for consent, and the order to read the M3 pages.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 consent and fetching

In Milestone 3 (M3) of [ABDM](/docs/abdm/v3/glossary#abdm) your system asks a patient for permission to see their health records, then fetches them. You are the [HIU](/docs/abdm/v3/glossary#hiu); the [HIE-CM](/docs/abdm/v3/glossary#hie-cm) holds the consent, asks the patient on your behalf, and on a grant returns a [consent artefact](/docs/abdm/v3/glossary#consent-artefact) id. No artefact, no records.

## What M3 gives you

| Capability | What your system can do |
|---|---|
| Consent request | Ask a patient, by [ABHA](/docs/abdm/v3/glossary#abha) address, for named record types over a named date range |
| Status tracking | Check whether a request is pending, granted or denied |
| Consent artefacts | Receive the artefact ids created on a grant, and fetch each artefact |
| Health information request | Ask for the records an artefact covers |
| Data receipt | Receive encrypted records on your callback URL, decrypt them, and tell the gateway you got them |

M3 does not create identities, which is [M1](/docs/abdm/v3/api/m1), and does not publish records, which is the [HIP](/docs/abdm/v3/glossary#hip) side, [M2](/docs/abdm/v3/api/m2). A hospital that shares its own records and reads others' does both.

The patient must be known to you by ABHA address first. [NHA](/docs/abdm/v3/glossary#nha) gives one concrete route: the patient scans the health facility QR code at registration, and a doctor raises a consent request against the address.

## What the source is missing

NHA's M3 document is a change note, not a full specification. It removes three tabs, Requesting Consent, Storing Consent Artefacts and Display Health Records, and adds three: Request Consent API Workflow (HIE-CM Integration), Swagger API Sequence URL and Screen Sequence.

| Referred to | State in the source |
|---|---|
| Screen Sequence, and the Expiry screens | Screenshots only. No text survived the conversion. |
| The existing sequence diagrams it corrects | Screenshots only. The two corrected bridge URLs did survive, and are on the [API sequence](/docs/abdm/v3/api/m3/sequence) page. |
| Every request and response body | Screenshots only. Not transcribed. |

So these pages give you the flow, the endpoint paths and the code tables, not payloads. For field level detail use the [M3 API reference](/reference/hiecm-m3), the [gateway reference](/reference/hiecm-gateway) and NHA's [sandbox Swagger for consent management](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation/swagger?integration_label=https://sandboxcms.abdm.gov.in/uploads/consent_management_data_flow12_jan_ded6ab978d).

## Read M3 in this order

1. [User journey](/docs/abdm/v3/api/m3/user-journey). The request, the patient's decision, the fetch.
2. [Use cases](/docs/abdm/v3/api/m3/sequence). Purpose of use and [HI type](/docs/abdm/v3/glossary#hi-type) code tables, and what the patient controls.
3. [API sequence](/docs/abdm/v3/api/m3/sequence). The calls and callbacks in order.
4. [Errors](/docs/abdm/v3/api/m3/errors). What can go wrong at each stage.
5. [Steps and calls](/docs/abdm/v3/api/m3/sequence). Every step of every use case, with the call it makes and what to see when it works.

Sandbox test data: [data dictionary](/docs/abdm/v3/reference/data-dictionary). Channels: [support](/docs/support).
