---
id: nhcx.callback.coverageeligibility-check
type: callback
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Receiving POST /v1/coverageeligibility/check
summary: >-
  What your payer system receives when a hospital asks whether a patient's policy
  is in force and what it covers, and how to acknowledge it.
sources:
- url: https://hcxsbx.abdm.gov.in/coverageeligibilityhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/coverageeligibilityhcxservice.json
  hash: sha256:1723a4020b1b33d0bc1d7175609f0d05e6a6a78e8b4c52041222396639ceb52c
  fetched: '2026-09-14'
  note: 'API specification: coverageeligibilityhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/coverageeligibility/check.'
- url: https://hcxsbx.abdm.gov.in/images/cfcbe62e8378d4f48ee6.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Coverage Eligibility.pdf
  hash: sha256:69dd680ddac44231a97276a1d735e45777d8e43b5563b7248fd367a838d9744f
  fetched: '2026-09-14'
  note: Coverage Eligibility, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 7 Response to the coverageeligibility request.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Structure, Status Description.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q14 and Q21 (Not getting call back).
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. items 4, 7 and 8.
related:
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.coverageeligibility-on-check
  - nhcx.endpoint.participant-update
  callbacks:
  - nhcx.callback.coverageeligibility-on-check
  - nhcx.callback.error
  flows:
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.payer-process-a-request
  - nhcx.flow.receive-a-sealed-callback
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.validation
  tests:
  - nhcx.test.payer-uc-07
  errors:
  - nhcx.error.nhcx-1001
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1015
  - nhcx.error.nhcx-1016
  - nhcx.error.payr-1001
  - nhcx.error.payr-1004
  concepts:
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.participant-registry
  - nhcx.concept.encryption-certificate
  - nhcx.concept.four-message-legs
  - nhcx.concept.coverage-eligibility-purposes
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.recipient-cannot-decrypt
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  decisions:
  - nhcx.decision.key-encryption-algorithm
  - nhcx.decision.eligibility-purpose
  glossary:
  - shared.glossary.nhcx
  - nhcx.glossary.jwe
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
  - nhcx.glossary.protected-header
  - nhcx.glossary.participant-code
  - nhcx.glossary.payer
  - nhcx.glossary.provider
  - nhcx.glossary.coverage-eligibility
  - shared.glossary.fhir
  - shared.glossary.abha
  - shared.glossary.nrces
---

# Receiving POST /v1/coverageeligibility/check

## In plain words

Before treatment, a [provider](../glossary/provider.md) asks whether a patient's policy is in force and what it covers. [NHCX](../../shared/glossary/nhcx.md) delivers that question to your system as `POST /v1/coverageeligibility/check`. You receive it as the [payer](../glossary/payer.md). The request can also ask for the plan's benefits, or for what a preauthorisation will need. Acknowledge the delivery within 30 seconds. Then answer on [`/v1/coverageeligibility/on_check`](../endpoints/coverageeligibility-on-check.md).

## Before you start

**Who receives it:** the payer, as the system that processes the request for the policy. **Who sends it:** a provider, through NHCX.

- Your participant record in the [participant registry](../concepts/participant-registry.md) holds an `endpoint_url`. [NHCX](../../shared/glossary/nhcx.md) posts to that address with `/v1/coverageeligibility/check` appended.
- You set `endpoint_url` when you register, in [sandbox onboarding](../flows/sandbox-onboarding.md). You change it with [`/participant/update`](../endpoints/participant-update.md).
- The URL uses a domain name over HTTPS. It has no IP address and no port number.
- The server behind it is in India. Your firewall accepts calls from the NHCX egress addresses in [callback URL rules](../sandbox/callback-url-requirements.md).
- Your handler can open a [JWE](../glossary/jwe.md) with your private key. That key pairs with the certificate in your registry record. See [your encryption certificate](../concepts/encryption-certificate.md).
- Your handler answers within 30 seconds and does slow work afterwards. See [the 202 acknowledgement](../concepts/synchronous-acknowledgement.md).
- Your system can call [`/v1/coverageeligibility/on_check`](../endpoints/coverageeligibility-on-check.md) to answer.
- You also host [`/v1/error`](error.md), so a request that dies is never silent.

## What happens

```mermaid
sequenceDiagram
    participant S as Provider system
    participant N as NHCX gateway
    participant Y as Your payer system
    S->>N: POST /v1/coverageeligibility/check (sealed)
    N-->>S: 202 Accepted
    N->>Y: POST /v1/coverageeligibility/check (same sealed message)
    Y-->>N: 202 Accepted with receipt, within 30 seconds
    Note over Y: Decrypt, validate, process
    Y->>N: POST /v1/coverageeligibility/on_check (your answer)
    N->>S: POST /v1/coverageeligibility/on_check
```

### What arrives

[NHCX](../../shared/glossary/nhcx.md) sends `POST <YOUR_ENDPOINT_URL>/v1/coverageeligibility/check`. The JSON body carries one field, `payload`:

```json
{
  "payload": "<JWE_COMPACT_STRING>"
}
```

The payload is a JWE in compact form: five base64url parts joined by dots. Decode the first part to read the protected header. You do not need your private key for that step.

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "<PROVIDER_PARTICIPANT_CODE>",
  "x-hcx-recipient_code": "<YOUR_PARTICIPANT_CODE>",
  "x-hcx-api_call_id": "<API_CALL_ID_SET_BY_THE_SENDER>",
  "x-hcx-request_id": "<REQUEST_ID_SET_BY_THE_SENDER>",
  "x-hcx-correlation_id": "<CORRELATION_ID_SET_BY_THE_SENDER>",
  "x-hcx-timestamp": "<TIME_THE_SENDER_SEALED_IT>",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "<BENEFICIARY_ABHA_NUMBER>"
}
```

| Protected header | What it tells you |
|---|---|
| `x-hcx-sender_code` | The provider that sent it. Your answer goes back to this code. |
| `x-hcx-recipient_code` | Your participant code. |
| `x-hcx-api_call_id` | This one message. A repeat delivery carries the same value. |
| `x-hcx-request_id` | The originating request. Read it when present. |
| `x-hcx-correlation_id` | The whole exchange. Copy it into your answer. |
| `x-hcx-workflow_id` | The business step. Read it when present. See [workflow codes](../concepts/workflow-codes.md). |
| `x-hcx-timestamp` | When the sender sealed the message. |
| `x-hcx-status` | `request.initiated` for a new request. Accept `request.initiate` as the same value. |
| `x-hcx-ben-abha-id` | The beneficiary's [ABHA](../../shared/glossary/abha.md) number. Accept it with or without hyphens. |

Decrypt the payload with your private key. Use the algorithm the header names in `alg`. [RSA-OAEP or RSA-OAEP-256](../decisions/key-encryption-algorithm.md) covers both values. The plaintext is a [FHIR](../../shared/glossary/fhir.md) collection bundle: see [the coverage eligibility request bundle](../fhir/coverage-eligibility-request.md). Its purpose tells you what the provider asks; see [the three coverage eligibility purposes](../concepts/coverage-eligibility-purposes.md). Check the benefit, payer and provider identifiers in the request against your records.

### What you send back

Answer the delivery first, before you decrypt or act on it. Return HTTP status `202 Accepted` with this receipt:

```json
{
  "timestamp": "<CURRENT_TIME_AS_DD/MM/YYYY hh:mm:ss:sss>",
  "api_call_id": "<X_HCX_API_CALL_ID_FROM_THIS_DELIVERY>",
  "correlation_id": "<X_HCX_CORRELATION_ID_FROM_THIS_DELIVERY>",
  "result": {
    "sender_code": "<X_HCX_SENDER_CODE_FROM_THIS_DELIVERY>",
    "recipient_code": "<YOUR_PARTICIPANT_CODE>",
    "entity_type": "coverageeligibility",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```

- `api_call_id` and `correlation_id` repeat the values in this delivery.
- `result.sender_code` is the sender's code. `result.recipient_code` is yours.
- `result.entity_type` is `coverageeligibility` for this exchange.
- `result.protocol_status` is one of `request.queued`, `request.dispatched` or `request.error`.
- `error.code` and `error.message` stay empty when you accept the message.
- `timestamp` takes the form `DD/MM/YYYY hh:mm:ss:sss`.

### Retries and repeat deliveries

- NHCX waits 30 seconds for your 202 and receipt.
- A late answer, another status code or a receipt in another shape counts as a failed delivery. NHCX sends the same message again.
- After 5 attempts NHCX stops. It deletes the request and retires its correlation id. The original sender learns of it on its own `/v1/error`.
- A repeat delivery is the same sealed message, so it carries the same `x-hcx-api_call_id`. Record every `x-hcx-api_call_id` you accept.
- On a repeat, return 202 with the same receipt and do not process the message again.
- Never deduplicate on `x-hcx-correlation_id`. Every message in one exchange shares it.

### What you do next

Process the message, then answer on [`/v1/coverageeligibility/on_check`](../endpoints/coverageeligibility-on-check.md):

- Copy `x-hcx-correlation_id` from this message.
- Give your answer its own fresh `x-hcx-api_call_id`.
- Send it to the sender: its `x-hcx-sender_code` becomes your `x-hcx-recipient_code`.
- Set `x-hcx-status` to `response.complete` for your answer.
- Seal a CoverageEligibilityResponse bundle to the provider's certificate. Business failures, such as a provider not registered with you for the policy, go inside it. See [the coverage eligibility response bundle](../fhir/coverage-eligibility-response.md).
- If you cannot decrypt or validate this message, answer with a protocol response instead. Set `type` to `ProtocolResponse`, `x-hcx-status` to `response.error`, and fill `x-hcx-error_details`.

## How you know it worked

- NHCX receives your HTTP 202 and receipt within 30 seconds of the delivery.
- Your log shows one delivery per `x-hcx-api_call_id`. A second delivery with the same value means NHCX did not accept your receipt.
- You decrypted the payload and hold a CoverageEligibilityRequest bundle, stored against its `x-hcx-correlation_id`.
- Your answer on `/v1/coverageeligibility/on_check` gets its own 202 from NHCX. No NHCX error names its correlation id.

## When it goes wrong

- **It never arrives.** Check these in order.
  1. The `endpoint_url` in your registry record is the address you expect.
  2. It uses a domain name, with no IP address and no port number.
  3. Your server is in India, and your firewall accepts the NHCX egress addresses in [callback URL rules](../sandbox/callback-url-requirements.md).
  4. Your application routes the path to the handler: load balancer rules, service routes and endpoint versions.
  5. The provider addressed the message to your participant code. Providers address the processor code from their policy lookup, so check that code is yours.
  When NHCX cannot reach you, the sender is told [NHCX-1001](../errors/nhcx-1001.md), "Receiver system is not reachable." See [your callback URL is rejected or never called](../troubleshooting/callback-url-rejected.md).
- **The same message arrives again and again.** NHCX did not accept your receipt. It was later than 30 seconds, used another status code, or had another shape. Fix the receipt, and keep processing each `x-hcx-api_call_id` once. An invalid answer from a receiver is reported as [NHCX-1015](../errors/nhcx-1015.md), "Invalid response received from receiver."
- **You cannot decrypt it.** The sender sealed it to an old certificate, or your registry certificate does not match your private key. Still return 202 with the receipt. Then answer on `/v1/coverageeligibility/on_check` with a protocol response. [PAYR-1001](../errors/payr-1001.md) names a decryption failure. See [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **Your answer is refused.** [NHCX-1010](../errors/nhcx-1010.md) means NHCX holds no exchange with that correlation id. [NHCX-1016](../errors/nhcx-1016.md) means the action does not fit that correlation id. [NHCX-1011](../errors/nhcx-1011.md) means the `x-hcx-status` value is invalid. Copy the correlation id from this message, answer on the paired path, and use a documented status. See [responses arrive against the wrong request](../troubleshooting/duplicate-or-mismatched-correlation.md).
- **The request fails your business rules.** That is not a protocol error. Answer with a sealed CoverageEligibilityResponse that carries the decision and the reason. Keep protocol responses for messages you cannot open or validate. [PAYR-1004](../errors/payr-1004.md) names a provider not registered with you for the requested policy.
