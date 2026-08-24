---
title: M2 API sequence
sidebar_label: API sequence
sidebar_position: 4
description: The M2 calls and callbacks in the order they happen, and which side of each one you build.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 API sequence

Milestone 2 (M2) of [ABDM](/docs/overview/glossary#abdm) is not a set of calls you make and wait on. Half of it is calls that arrive at your system from [NHA](/docs/overview/glossary#nha)'s [HIE-CM](/docs/overview/glossary#hie-cm) gateway, which you have to be listening for. This page puts every step in order and says which side you build.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 2. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What this page can and cannot tell you

NHA's M2 document presents its request and response tables as screenshots. Those images carry no text, so the conversion produced nothing for them. The step names, the direction of each call and the obligations below are all from the document's prose, which did convert. The field lists, the exact paths and the payload shapes are not transcribed, and we will not invent them.

Where you need a shape, use the [M2 API reference](/reference/hiecm-m2) and the [gateway reference](/reference/hiecm-gateway), and treat NHA's own sandbox documentation as the authority.

One endpoint is named in the prose and so is safe to state: `health-information/notify`, which you call after a data push completes.

## Base URLs

| Environment | Base URL |
|---|---|
| Sandbox | `https://dev.abdm.gov.in` |
| Production | `https://apis.abdm.gov.in` |

## Direction key

| Marker | Meaning |
|---|---|
| **You call** | Your system makes an outbound request to NHA |
| **You receive** | NHA calls an endpoint you expose. You must be reachable, and you must answer. |
| **You push** | Your system makes an outbound request to a URL another party supplied |

## Sequence 1: HIP initiated linking

The flow when you already hold the patient's [ABHA address](/docs/overview/glossary#abha-address).

### Step 1: Get a session token

**You call.** NHA's M2 document does not describe this step. Its error list rejects a call with ABDM-2500, Authorization header is missing, which is what tells you every [HIP](/docs/overview/glossary#hip) call carries an access token. The session call is the one shared with [M1](/docs/api/hie-cm/m1/api-sequence).

### Step 2: Get a link token for the patient

**You call.** NHA's document says the [link token](/docs/overview/glossary#link-token) is generated and stored at the time the patient registers with you. Validity is six months. Validate the stored token before each use, and do not send an expired one.

If no valid token exists, regenerate it through demographic authentication. NHA links the swagger for that route from its own linking page.

### Step 3: Link the care context

**You call.** Send the patient reference and the [care contexts](/docs/overview/glossary#care-context) to link, authorised by the link token. Each care context is a reference number and a display name. The structure is on the [use cases](/docs/api/hie-cm/m2/use-cases) page.

### Step 4: NHA notifies subscribed PHR apps

Nothing for you to build. NHA sends the notification to every [PHR](/docs/overview/glossary#phr) app subscribed to that ABHA address, both when a new care context is linked and when an existing one gains new records.

## Sequence 2: Notification to mobile

The flow when you hold a mobile number, a name, an age and a gender, but no ABHA address.

### Step 1: Notify that a record is ready

**You call.** Made once the health record is ready to share. This triggers NHA to send the patient an SMS carrying a deep link into a PHR app.

Everything after that is between the patient and NHA. They open the app, create an ABHA address if they need one, and then run the discovery sequence below against your system.

## Sequence 3: Discovery and link

This sequence starts in the patient's PHR app with a [discovery](/docs/overview/glossary#discovery) request. It reaches you as inbound traffic. Implementing it correctly is mandatory for every HIP.

### Step 1: Discovery request

**You receive.** The gateway sends you verified identifiers, which are the ABHA address, mobile number, name, gender and year of birth, and unverified identifiers, which are facility issued identifiers such as a patient ID.

### Step 2: Discovery response

**You call.** Your answer to a discovery request goes back as a separate callback, not in the body of the inbound request. NHA's error list names an on-discovery step separately from the discovery request, which is what tells you the exchange is asynchronous. The prose does not describe it.

What you return is a list of care contexts for the matched patient. Two rules bind it.

- Each care context is a reference number and a display name.
- No clinical or sensitive data goes in the response. No diagnosis, no test result, no report content.

If you find no confident match, return no care contexts. A wrong match hands one patient another patient's records.

### Step 3: Link init

**You receive.** The patient has picked the care contexts they want linked, and the gateway asks you to start the link. NHA's error list names this step init and its answer on-init.

### Step 4: Link confirm

**You receive.** The gateway confirms the link. NHA's error list names this step confirm and its answer on-confirm.

The field lists for steps 3 and 4 are among the screenshots that did not convert. What the error list does tell you is that the linking flow is validated against the care context count, the patient reference number, the patient display value and the link reference number. There is a distinct code for each of those being wrong. It does not say which of the two steps raises which code.

## Sequence 4: Health record request and data transfer

This sequence is triggered by an [HIU](/docs/overview/glossary#hiu) holding a [consent artefact](/docs/overview/glossary#consent-artefact). It reaches you through the gateway.

### Step 1: Health information request

**You receive.** The gateway forwards the HIU's request, carrying a transaction ID the HIE-CM generated for the whole exchange. The request includes the consent ID, the data push URL, the date and time range, and the HIU's [ECDH](/docs/overview/glossary#ecdh) public key and nonce.

### Step 2: Validate before you do anything else

Three checks, all named by NHA.

| Check | Fail condition |
|---|---|
| Consent status | Expired, paused or revoked |
| Date range | Falls outside the range the consent artefact permits |
| Encryption parameters | Incorrect or incompatible |

NHA's error list carries codes for the first two checks: ABDM-1061 and ABDM-1062 for the consent, ABDM-1063 for the date range. It carries no code for bad encryption parameters, so decide yourself what your system does when they do not validate. See [errors](/docs/api/hie-cm/m2/errors).

### Step 3: Package, encrypt and sign

Build the [FHIR](/docs/overview/glossary#fhir) bundle. Encrypt it with the ECDH parameters from the request. Sign the encrypted payload with your long term private key. The mechanics are on the [use cases](/docs/api/hie-cm/m2/use-cases) page.

### Step 4: Push the data

**You push.** Send the encrypted data and the transaction ID to the data push URL the HIU supplied. That URL can differ from the HIU's registered gateway URL, so use the one in the request rather than one you looked up.

Three constraints:

- 20 minutes from the start of the request. This is the current timeout.
- Split large datasets, such as CT or MRI images, across multiple parts.
- Stream very large files rather than sending one large payload.

### Step 5: Notify the gateway

**You call.** `health-information/notify` tells the HIE-CM the transfer is complete. This is the one M2 endpoint NHA's document names in text.

### Step 6: The HIU notifies its outcome

Nothing for you to build. The HIU tells the HIE-CM whether it received and processed the data, or whether the transfer failed.

## Headers and correlation

NHA's document does not list the request headers in text. Its error code table does name the things the gateway rejects, which is the honest floor of what your calls carry and what your endpoints must echo back.

| Named in the error list | What it implies |
|---|---|
| Authorization header is missing | A bearer token on every call |
| The X Auth token is invalid | A patient scoped token on the flows that carry one |
| Invalid X-CM-ID | A consent manager identifier header |
| Invalid Timestamp | A timestamp the gateway checks for freshness |
| Invalid Request Id, Request id not found | A request ID you generate and the gateway correlates on |
| Invalid TransactionId | The transaction ID from the gateway, echoed on every step of one exchange |
| Request with this request id already exists | Repeating a request ID is rejected, so generate a new one per request |
| Invalid API sequence flow, please follow logical flow | The steps above run in order. Skipping one is an error, not a shortcut. |

Treat that table as a checklist of what to get right, not as a transcription of NHA's header spec. For the header names and casing, use NHA's sandbox documentation and the [gateway reference](/reference/hiecm-gateway).

## Next

[Errors](/docs/api/hie-cm/m2/errors) lists NHA's codes for these flows. [Test cases](/docs/api/hie-cm/m2/test-cases) is what to run once the sequence above is wired up.
