---
id: nhcx.sandbox.callback-url-requirements
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Callback URL rules and the egress addresses to allow
summary: >-
  What the web address that receives exchange messages must look like, the three
  addresses the exchange sends from, and how fast your server must answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q14 and Q21 (Not getting call back).
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 5, 7 and 9.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Steps 1 and 3 payloads.
related:
  callbacks:
  - nhcx.callback.error
  sandbox:
  - nhcx.sandbox.prerequisites
  - nhcx.sandbox.environments-and-base-urls
  concepts:
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.four-message-legs
  - nhcx.concept.participant-registry
  flows:
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.report-a-processing-error
  - nhcx.flow.sandbox-onboarding
  endpoints:
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.v2-participant-update
  decisions:
  - nhcx.decision.status-poll-or-wait
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.accepted-then-no-callback
  glossary:
  - shared.glossary.nhcx
---

# Callback URL rules and the egress addresses to allow

## In plain words

[NHCX](../../shared/glossary/nhcx.md) delivers every answer, query and notice to a web address you register, your callback URL. Nothing comes back in the response to your own call.

The address must follow a few rules, your firewall must accept the exchange's addresses, and your server must answer each delivery quickly.

## Before you start

- You have a server you control, hosted in India, with a domain name and a valid HTTPS certificate.
- You know which callback paths your role receives. A provider receives paths such as `/v1/coverageeligibility/on_check`, `/v1/preauth/on_submit` and `/v1/claim/on_submit`.
- You can change firewall rules on that server.

## What happens

### The address rules

- Use a domain name. An IP address is not accepted.
- Do not put a port number in the URL.
- Host the server in India.
- Register the base address as `endpoint_url` when you create or update your participant. Serve each callback path under it.

### Allow the exchange's addresses

Deliveries come from these three NAT addresses. Allow all three in your firewall, load balancer and any gateway in front of your service:

- `3.109.99.210`
- `13.126.152.0`
- `13.200.129.223`

### Answer every delivery

Reply to each delivery with HTTP `202 Accepted` within 30 seconds. The body echoes the ids from the message:

```json
{
  "timestamp": "<TIMESTAMP>",
  "api_call_id": "<X_HCX_API_CALL_ID_FROM_THE_REQUEST>",
  "correlation_id": "<X_HCX_CORRELATION_ID_FROM_THE_REQUEST>",
  "result": {
    "sender_code": "<SENDER_PARTICIPANT_CODE>",
    "recipient_code": "<YOUR_PARTICIPANT_CODE>",
    "entity_type": "<coverageeligibility|preauth|claim|task|payment|insuranceplan>",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

If the exchange gets no `202` in time, it treats the delivery as failed and retries. It resends a rejected or malformed exchange up to five times, then ends the request. After the fifth failure, it deletes the request for that correlation id.

Process the message after you reply. If the message cannot be processed, report it on `/v1/error`. See [report a processing failure](../flows/report-a-processing-error.md).

### Changing the address

Update `endpoint_url` with the participant update call. See [onboard as a participant in the sandbox](../flows/sandbox-onboarding.md).

## How you know it worked

Send a coverage eligibility check to the [dummy payer](dummy-payer.md). Your server logs a `POST /v1/coverageeligibility/on_check` from one of the three NAT addresses. Your server answered it with `202`.

A registered URL that has never received a delivery is not yet proven.

## When it goes wrong

**It never arrives.** Check in this order:

1. The registered URL uses a domain name, with no IP address and no port.
2. The server is hosted in India.
3. All three NAT addresses are allowed in every firewall and gateway in front of the server.
4. The URL path, load balancer rules and service routing send the path to the right handler, on the right version.
5. Your server answers with `202` within 30 seconds.

If all five hold, ask the exchange for the status of the request. See [poll with /v1/status or wait](../decisions/status-poll-or-wait.md) and [accepted with 202 and no callback](../troubleshooting/accepted-then-no-callback.md).

**The same message arrives again.** Your earlier reply was late or not `202`, so the exchange retried. Make your handler safe to run twice for the same `x-hcx-api_call_id`.

**The registration update rejects your URL.** See [your callback URL is rejected or never called](../troubleshooting/callback-url-rejected.md).
