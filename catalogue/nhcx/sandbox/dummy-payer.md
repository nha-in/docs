---
id: nhcx.sandbox.dummy-payer
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The dummy payer and what it answers
summary: >-
  The built-in test insurer in the sandbox, which use cases it answers, and the
  two test calls that make it approve, reject, query or send a payment notice.
sources:
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-3.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q3 and Q16.
related:
  sandbox:
  - nhcx.sandbox.test-participants
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.sandbox-exit
  endpoints:
  - nhcx.endpoint.dummy-payer-process-request
  - nhcx.endpoint.dummy-payer-paymentnotice-init
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.communication-on-request
  - nhcx.endpoint.paymentnotice-on-request
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.payment-notice
  - nhcx.flow.insurance-plan-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.query-update
  - nhcx.fhir.payment-notice
  concepts:
  - nhcx.concept.message-identifiers
  glossary:
  - nhcx.glossary.payer
  - nhcx.glossary.correlation-id
---

# The dummy payer and what it answers

## In plain words

The dummy payer is a test insurer in the NHCX sandbox, participant code `1000003538@hcx`. Send your requests to it as you would to a real payer.

For eligibility and insurance plan requests it answers on its own. For preauthorisations, claims and payment notices, you tell it what to do through two test calls.

## Before you start

- You have a sandbox session token. See [environments and base URLs](environments-and-base-urls.md).
- You fetched the dummy payer's certificate with `/fetch/certs` for `1000003538@hcx`.
- Your callback URL receives deliveries. See [callback URL rules](callback-url-requirements.md).

## What happens

### Use cases

| Use case | What you do |
|---|---|
| Insurance plan | Send `/v1/insuranceplan/request`. Use provider id `32722` and policy number `100217` in the FHIR bundle. |
| Coverage eligibility | Send `/v1/coverageeligibility/check`. |
| Preauthorisation | Send `/v1/preauth/submit`, then call the action API. |
| Claim | Send `/v1/claim/submit`, then call the action API. |
| Communication | Submit, then call the action API with `Query`. |
| Payment notice | Call the payment notice trigger. |

### The action API

After a preauthorisation or claim submit, choose the payer's answer. Pass the correlation id of your submit:

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/process/request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "action": "<Approve|Reject|Query>",
    "method": "<Preauth|Claim>",
    "correlationId": "<X_HCX_CORRELATION_ID_OF_YOUR_SUBMIT>"
  }'
```

- `Approve` or `Reject`: the final answer arrives on `/v1/preauth/on_submit` or `/v1/claim/on_submit`.
- `Query`: the dummy payer sends `/v1/communication/request` while the case stays with it. Answer with the supporting documents on `/v1/communication/on_request`. The final answer then arrives on the `on_submit` path.

### The payment notice trigger

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/paymentNotice/init' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "providerId": "<YOUR_PARTICIPANT_CODE>",
    "claimNumber": "<CLAIM_NUMBER_OF_YOUR_APPROVED_CLAIM>"
  }'
```

`/v1/paymentnotice/request` then arrives at your endpoint. Acknowledge it on `/v1/paymentnotice/on_request`. See [the payment notice bundle](../fhir/payment-notice.md).

These two test APIs take the token in the `bearer_auth` header, prefixed with `Bearer`.

## How you know it worked

- After `Approve`, `/v1/preauth/on_submit` or `/v1/claim/on_submit` arrives with a `ClaimResponse` for your claim number, reason code `approved`.
- After `Query`, `/v1/communication/request` arrives first, and the final `on_submit` arrives after your `/v1/communication/on_request`.
- After the payment notice trigger, `/v1/paymentnotice/request` arrives for the claim number you passed.

## When it goes wrong

- **Nothing arrives after your submit.** For preauthorisations and claims, the dummy payer waits for the action API. Call it with the correlation id of the submit.
- **The action API cannot find your case.** The `correlationId` is not the one you sent in the submit's protected header. Copy it from your request log.
- **The action API returns `401`.** The token expired or is missing its `Bearer ` prefix. Get a fresh token.
- **The trigger works, and still nothing reaches your server.** The problem is your callback path. See [callback URL rules](callback-url-requirements.md).
