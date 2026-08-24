---
title: M3 consent and fetching
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 3 gives you, who asks for consent, and the order to read the M3 pages.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 consent and fetching

Milestone 3 (M3) of [ABDM](/docs/overview/glossary#abdm) is the milestone where your system asks a patient for permission to see their health records, and then fetches them. You are the [HIU](/docs/overview/glossary#hiu), the health information user. The patient's consent is held by the [HIE-CM](/docs/overview/glossary#hie-cm), which asks the patient on your behalf. If the patient grants it, you receive a [consent artefact](/docs/overview/glossary#consent-artefact) id, and that id is what buys you the data. No consent artefact, no records.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What the source is, and what it is missing

[NHA](/docs/overview/glossary#nha)'s M3 document is a change note, not a full specification. It was written to edit an existing set of tabs. It says three tabs are to be removed:

- Requesting Consent
- Storing Consent Artefacts
- Display Health Records

And three are to be added:

- Request Consent API Workflow (HIE-CM Integration)
- Swagger API Sequence URL
- Screen Sequence

Two of those three added tabs arrived as text: the API workflow and the Swagger link. The Screen Sequence did not. Three things the document refers to are not present in it in any readable form.

| Referred to | State in the source |
|---|---|
| Screen Sequence, and the Expiry screens | Screenshots only. No text survived the conversion. |
| The existing sequence diagrams it corrects | Screenshots only. The two corrected bridge URLs did survive, and are on the [API sequence](/docs/api/hie-cm/m3/api-sequence) page. |
| Every request and response body | Screenshots only. Not transcribed. |

So this page set gives you the flow, the endpoint paths and the code tables. It does not give you payloads. For field level detail use the [M3 API reference](/reference/hiecm-m3) and the [gateway reference](/reference/hiecm-gateway), and NHA's own [sandbox Swagger for consent management](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation/swagger?integration_label=https://sandboxcms.abdm.gov.in/uploads/consent_management_data_flow12_jan_ded6ab978d).

## What M3 gives you

| Capability | What your system can do |
|---|---|
| Consent request | Ask a patient, by [ABHA](/docs/overview/glossary#abha) address, for named record types over a named date range |
| Status tracking | Check whether a request you sent is still pending, granted or denied |
| Consent artefacts | Receive the artefact ids created when the patient grants, and fetch each artefact |
| Health information request | Ask for the records that an artefact covers |
| Data receipt | Receive encrypted records on your callback URL, decrypt them, and tell the gateway you got them |

M3 does not create identities. That is [M1](/docs/api/hie-cm/m1). It does not publish records either. Publishing records is the [HIP](/docs/overview/glossary#hip) side, which is [M2](/docs/api/hie-cm/m2). A system can be both. A hospital that shares its own records and reads other hospitals' records does M2 and M3.

## Where the flow starts

The patient has to be known to you by ABHA address before you can ask for anything. NHA's document gives one concrete route. The patient scans the health facility QR code at registration. Your facility now holds their ABHA address, and a doctor can raise a consent request against it.

## Phase scope

M1 to M3 are Phase 1 on this site. [M4](/docs/api/hie-cm/m4) and [UHI](/docs/api/uhi) are Phase 2. [NHCX](/docs/api/nhcx) is out of scope for V1.

## Read M3 in this order

1. [User journey](/docs/api/hie-cm/m3/user-journey). Three diagrams: the request, the patient's decision, the fetch.
2. [Use cases](/docs/api/hie-cm/m3/use-cases). Why you are allowed to ask, what you may ask for, and what the patient can do about it. The purpose of use and [HI type](/docs/overview/glossary#hi-type) code tables are here.
3. [API sequence](/docs/api/hie-cm/m3/api-sequence). The calls and callbacks in order.
4. [Errors](/docs/api/hie-cm/m3/errors). What can go wrong at each stage.
5. [Test cases](/docs/api/hie-cm/m3/test-cases). What to check before you call M3 done.

Sandbox test data is in the [data dictionary](/docs/api/data-dictionary). If you get stuck, [support](/docs/support) lists the channels.
