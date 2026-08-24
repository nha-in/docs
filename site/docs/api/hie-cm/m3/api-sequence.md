---
title: M3 API sequence
sidebar_label: API sequence
sidebar_position: 4
description: The consent and data flow endpoints in the order you call them, with what each step is for.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 API sequence

This is the order of calls for Milestone 3 (M3) of [ABDM](/docs/overview/glossary#abdm): consent request, notification, artefact fetch, data request, data push, receipt. Your system is the [HIU](/docs/overview/glossary#hiu). Every call goes through [NHA](/docs/overview/glossary#nha)'s [gateway](/docs/overview/glossary#gateway), and almost every result comes back later on a callback rather than in the response body.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What this page can and cannot tell you

NHA's M3 document pasted every request and response as a screenshot. None of that converted to text. So for each step below you get the path and what the step is for. You do not get the payload, and nothing here invents one.

The document also states HTTP methods for only two paths, the two bridge URL corrections at the end of this page. Methods for the rest are not stated in the source, so they are not stated here.

For fields, bodies and methods, use the [M3 API reference](/reference/hiecm-m3), the [gateway reference](/reference/hiecm-gateway), and NHA's [sandbox Swagger for consent management](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation/swagger?integration_label=https://sandboxcms.abdm.gov.in/uploads/consent_management_data_flow12_jan_ded6ab978d).

## The sequence at a glance

| # | Step | Path | Direction |
|---|---|---|---|
| 1 | Consent request init | `/api/hiecm/consent/v3/request/init` | You call the gateway |
| 2 | on-init | `/api/v3/hiu/consent/request/on-init` | Callback to you |
| 3 | Request status | `/api/hiecm/consent/v3/request/status` | You call the gateway |
| 4 | on-status | Path not stated in the source | Callback to you |
| 5 | Patient grants or denies | No API. The patient acts in their [PHR](/docs/overview/glossary#phr) app. | |
| 6 | Consent request notify, HIU | `/api/v3/hiu/consent/request/notify` | Callback to you |
| 7 | Consent request notify, HIP | `/api/v3/consent/request/hip/notify` | Callback to the [HIP](/docs/overview/glossary#hip) |
| 8 | on-notify | `/api/hiecm/consent/v3/request/hiu/on-notify` | You call the gateway |
| 9 | Consent fetch | `/api/hiecm/consent/v3/fetch` | You call the gateway |
| 10 | on-fetch | `/api/v3/hiu/consent/on-fetch` | Callback to you |
| 11 | Health information request | `/api/hiecm/data-flow/v3/health-information/request` | You call the gateway |
| 12 | on-request | `/api/v3/hiu/health-information/on-request` | Callback to you |
| 13 | Data push | Your own data push callback URL | HIP pushes to you |
| 14 | Health information notify | `/api/hiecm/data-flow/v3/health-information/notify` | You call the gateway |

## 1. Consent request

### Step 1: raise the request

`/api/hiecm/consent/v3/request/init`

A doctor raises a consent request to view a patient's previous health records for a date range, a from date and a to date. The request names the patient by [ABHA](/docs/overview/glossary#abha) address, the purpose of use, and the [HI types](/docs/overview/glossary#hi-type) wanted. The codes for those two are on the [use cases](/docs/api/hie-cm/m3/use-cases) page.

### Step 2: on-init

`/api/v3/hiu/consent/request/on-init`

You receive a callback carrying the consent request and the request id. Store the request id. Every later step in the consent half of the flow quotes it.

### Step 3: request status

`/api/hiecm/consent/v3/request/status`

A tracking call. You give the request id and find out whether the request is completed, still in progress or failed, with error detail where there is any. It exists because the flow is asynchronous. Use it to answer "what happened to that request" without waiting for a callback that may not come.

### Step 4: on-status

The status result comes back as a callback with the current state of the request. NHA's document gives three states.

| Status | Meaning |
|---|---|
| Requested | The patient has not responded yet |
| Granted | The patient approved |
| Denied | The patient refused |

The document does not state the callback path for on-status. It is the one path in this sequence that did not convert. Check the [M3 API reference](/reference/hiecm-m3) for it.

## 2. Patient action and notification

### Step 5: the patient decides

No API call of yours. The patient receives the consent request, reads it, and grants or denies. That decision is their approval or rejection of sharing their health information.

### Step 6: your notification

`/api/v3/hiu/consent/request/notify`

When the patient acts, you are notified. On a grant the notification carries every consent artefact id created against the request, along with the request id. One request can produce several artefacts, because the patient's records live in several places.

### Step 7: the HIP's notification

`/api/v3/consent/request/hip/notify`

The record holder is notified too, with all care context references. Both sides learn the decision, so both can proceed with sharing or stop.

You do not call this. It matters to you because it is the reason a HIP will accept your later data request.

### Step 8: on-notify

`/api/hiecm/consent/v3/request/hiu/on-notify`

Your acknowledgement back to the gateway. You send the consent artefact id along with the request id.

## 3. Fetching the consent artefact

### Step 9: consent fetch

`/api/hiecm/consent/v3/fetch`

Once consent is granted, you fetch the artefact itself by its [consent artefact](/docs/overview/glossary#consent-artefact) id. The artefact is the approved permission: who, what, why, which date range, and until when.

### Step 10: on-fetch

`/api/v3/hiu/consent/on-fetch`

The artefact detail arrives on your callback. NHA's document describes this callback as carrying the patient's health information as permitted by the consent.

## 4. Requesting and receiving data

### Step 11: health information request

`/api/hiecm/data-flow/v3/health-information/request`

You ask for the records. The request quotes the consent id and the request id, which is what ties it to a valid, approved consent. This is also where you supply the data push URL, the callback the records will be delivered to.

### Step 12: on-request

`/api/v3/hiu/health-information/on-request`

The gateway replies to your configured callback URL with the transaction id, the request id and the current status of the request. This is an acknowledgement of the request. It is not the data.

### Step 13: data push

The records arrive at the same callback URL you gave as the data push URL. They arrive encrypted.

Your work here is two things, in NHA's own framing. Decrypt the data, meaning convert it back from its encrypted form. Then present it in a format a person can read, as plain text or structured output.

The M3 document does not specify the encryption scheme. It is [ECDH](/docs/overview/glossary#ecdh) key exchange, specified on the HIP side in NHA's M2 document. See [M2](/docs/api/hie-cm/m2).

### Step 14: notify the gateway

`/api/hiecm/data-flow/v3/health-information/notify`

Tell NHA's gateway that you received the data. This closes the transaction.

## Bridge URL corrections

NHA's document ends with two corrections to sequence diagrams published elsewhere. These are the only two paths in the document that carry an HTTP method. Both are bridge URLs, hosted on the bridge base URL registered for that participant.

| Correction | Path |
|---|---|
| Consent notify to the HIU bridge | `POST {hiuBridgeUrl}/v0.5/consents/hiu/notify` |
| Health information request to the HIP bridge | `POST {hipBridgeUrl}/v0.5/health-information/hip/request` |

The diagrams these corrections belong to are images in the source document, so they are not reproduced here. The corrected URLs are, because they converted cleanly and they are the substance of the correction.

## Next

- [Errors](/docs/api/hie-cm/m3/errors), for what can fail at each of these steps.
- [Test cases](/docs/api/hie-cm/m3/test-cases), for what to check before you call M3 done.
