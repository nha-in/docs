---
id: nhcx.error.nhcx-401
type: error
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'NHCX-401: the exchange does not accept your authorisation for this call'
summary: >-
  The exchange refused the call because it does not accept the token or the caller
  behind it, so renew the session token and check your participant may make this
  call.
sources:
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet NHCX Error Codes.
related:
  concepts:
  - nhcx.concept.error-code-spaces
  - nhcx.concept.session-token
  - nhcx.concept.access-control
  flows:
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.policy-link-and-delink
  callbacks:
  - nhcx.callback.error
  endpoints:
  - nhcx.endpoint.session-token
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
---

# NHCX-401: the exchange does not accept your authorisation for this call

## In plain words

The [NHCX](../../shared/glossary/nhcx.md) refused your call because it does not accept you as authorised to make it. The message text is `User Unauthorized`.

Nothing was forwarded to the recipient.

## Before you start

You sent a message through NHCX. The exchange returns a gateway code in one of two places:

- The synchronous acknowledgement to your call. The code is in `error.code` and the text in `error.message`.
- A report posted to your own `/v1/error` endpoint. The code is in `x-hcx-error_details.code`, the text in `x-hcx-error_details.message`, and `x-hcx-correlation_id` names the request.

The `/v1/error` report is a plain `ProtocolResponse` body, not a sealed payload. Your system must host `/v1/error` to see it. See [Receiving POST /v1/error](../callbacks/error.md).

## What happens

The exchange refuses the call when:

- The session token in `bearer_auth` has expired. A token lasts 1200 seconds (20 minutes), so a token that worked earlier can fail now.
- The token is not a valid token from the session call.
- The token was generated with a client id other than the one your participant was created with. Policy linking and de-linking accept only the participants named on the policy.

## How you know it worked

Send the corrected request. Your call returns HTTP 202 with an acknowledgement in which `error.code` and `error.message` are empty strings. `result.protocol_status` is `request.queued` or `request.dispatched`.

No report for that `x-hcx-correlation_id` arrives on your `/v1/error`. The recipient's answer arrives later on the `on_` path paired with your request.

## When it goes wrong

1. Call the session endpoint for a new token and retry with it. See [the session token](../concepts/session-token.md) and [POST /api/hiecm/gateway/v3/sessions](../endpoints/session-token.md).
2. Send the token as `bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>`. The exchange's own endpoints read `bearer_auth`, not `Authorization`.
3. Generate the token with the client id used when your participant was created.
4. If every call returns this code, see [Every call returns 401](../troubleshooting/everything-returns-401.md).
