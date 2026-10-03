---
id: hiecm.troubleshooting.hip-did-not-acknowledge-consent-notify
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: HIP did not acknowledge the HIP consent notify, although data arrived
summary: >
  A message says a record holder never confirmed it was told about the
  patient's consent, even though records were received. The confirmation is a
  separate call the record holder owes, and each record holder owes its own.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_consent_request_hip_notify.mdx
    fetched: 2026-10-03
    hash: sha256:eda4a95e57ffcf726159d079a823788eab0425a896e00ff540f412351322ba3d
    note: >
      site/docs/_notes/hiecm/m2_post_v3_consent_request_hip_notify.mdx. The
      consent notification to the HIP bridge, and that it is acknowledged
      through on-notify.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_consent_v3_request_hip_on_notify.mdx
    fetched: 2026-10-03
    hash: sha256:f1169f8bb206c7b0f43215e9296b60410b408d0b9d277b898c585355338fa928
    note: >
      site/docs/_notes/hiecm/m2_post_consent_v3_request_hip_on_notify.mdx.
      The acknowledgement call: one object, the consentId, the request id it
      answers, and its codes.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m2.mdx
    fetched: 2026-10-03
    hash: sha256:7547c4e326a6eb97ef5eea84731cf865839943b762c2c504232e597c96e2a84e
    note: >
      site/docs/hiecm/v3/milestones/m2.mdx. Journey 3, phase 2: consent
      artefact delivery to the HIP and the acknowledgement that follows.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m3.mdx
    fetched: 2026-10-03
    hash: sha256:0a86c99c35671087c5c6137324aa74294c07ca326116297781ba1d17f8ed26af
    note: >
      site/docs/hiecm/v3/milestones/m3.mdx. Separate consent artefacts where
      data is requested from multiple HIPs, and each HIP notified on its own
      bridge.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/errors/m2.mdx
    fetched: 2026-10-03
    hash: sha256:b0b0036c6d3d0d8b17b31e3587353dba177a7b67219d3bd3dad23b7b445747df
    note: >
      site/docs/_notes/hiecm/errors/m2.mdx. ABDM-2500 and its second message,
      for a reply whose request id matches no waiting request.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    hash: sha256:4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718
    note: >
      The hip/notify callback and the hip/on-notify acknowledgement, whose
      request id is the one from the notification.
related:
  endpoints:
    - hiecm.endpoint.m2-consent-hip-on-notify
    - hiecm.endpoint.m3-consent-hiu-on-notify
  callbacks:
    - hiecm.callback.m3-on-consent-request-notify-hip
  flows:
    - hiecm.flow.journey-consent-to-records
  troubleshooting:
    - hiecm.troubleshooting.no-callback-on-my-server
  errors:
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
  concepts:
    - hiecm.concept.consent-artefact
  glossary:
    - hiecm.glossary.hip
    - hiecm.glossary.hiu
---

# HIP did not acknowledge the HIP consent notify, although data arrived

## In plain words

When a patient allows their records to be shared, ABDM tells every hospital
that holds those records. Each hospital has to confirm that it got the
message. That confirmation is its own step, separate from sending the
records.

This message means at least one hospital has not confirmed. It can appear
for some hospitals and not others, because a consent that covers several
hospitals is split into one permission per hospital, and each hospital is
told, and confirms, on its own. Records from one hospital say nothing about
whether another has confirmed.

The confirmation is the record holder's to send. In ABDM's terms the record
holder is the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) and the
requester is the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu).

## What happens

### What the HIP owes

1. ABDM posts the consent to the HIP's bridge at
   `/api/v3/consent/request/hip/notify`, with the `REQUEST-ID`, `TIMESTAMP`
   and `X-HIP-ID` headers. A `GRANTED` notification carries the full consent
   artefact.
2. The HIP answers that POST with `200 OK`.
3. The HIP then calls `POST /api/hiecm/consent/v3/request/hip/on-notify`. The
   body carries one `acknowledgement` with `status` and the artefact's
   `consentId`, and the notification's request id in `response.requestId`.
   The call returns `202 Accepted`.

Step 2 is not the acknowledgement. Step 3 is.

### The check that separates the causes

Ask which side you are on, then look for step 3 in the HIP's logs for the
`consentId` in question: was the call sent, and what came back?

| What you find | Cause | Fix |
| --- | --- | --- |
| You are the HIU, and the HIP is another organisation's | The HIP has not acknowledged. Nothing in your own calls changes that | Note the HIP and the `consentId`, try again later, and report it through [Support](/docs/support) if it persists |
| The HIP answered `200 OK` and made no on-notify call | The handler stops after step 2 | Add the on-notify call for every notification: granted, revoked and expired |
| The on-notify call was sent and refused | The body or headers are wrong. `response.requestId` must be the `REQUEST-ID` of the notification, not a new one. `acknowledgement` is one object on the HIP's call, where the HIU's call takes an array | Correct the body. A reply whose request id matches no waiting request is refused with `ABDM-2500`, "No mapping found for" |
| No notification reached the HIP's bridge at all | A callback problem, not an acknowledgement problem | See [no callback reaches my server](no-callback-on-my-server.md) |

## How you know it worked

For each consent notification on the HIP's bridge there is one on-notify
call carrying the same `consentId`, with `response.requestId` equal to the
notification's `REQUEST-ID`, and it returned `202 Accepted`.

## When it goes wrong

The on-notify call is refused with a header code:

- `ABDM-2402`, "Invalid Timestamp": check `TIMESTAMP` against your clock.
- `ABDM-2404`, "Invalid Request Id": send a fresh UUID in `REQUEST-ID`.
- `ABDM-2500`, "Authorization header is missing": send the gateway session
  token.

If every notification has an accepted acknowledgement and the message still
appears, raise a request through [Support](/docs/support) with the
`consentId`, the HIP ID, and the `REQUEST-ID` and `TIMESTAMP` of the
notification and of the acknowledgement.

## Questions this answers

- Encrypted data is received, but for some HIPs the following error appears: HIP did not acknowledge the HIP consent notify. Please try again after some time.
- What does "HIP did not acknowledge the HIP consent notify" mean?
- How does a HIP acknowledge a consent notification?
- Why does the consent error show for only some hospitals?
- Is returning 200 to the consent notify callback enough?
