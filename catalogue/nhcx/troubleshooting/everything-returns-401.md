---
id: nhcx.troubleshooting.everything-returns-401
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Every NHCX call returns 401
summary: >-
  Every call you make is rejected as unauthorised, not only one. The checks that
  rule out the token and headers, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3; page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, items 6, 9 and 10.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.1 Token Request.
- url: https://hcxsbx.abdm.gov.in/images/54d18468412741b759f3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Authenticating with NHCX.pdf
  hash: sha256:0ea90b635634844aaf8981e917cbf8b765ddd83a340f3c934883912599a62d8b
  fetched: '2026-09-14'
  note: Authenticating with NHCX, row 3 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Validation for De-Linking.
related:
  concepts:
  - nhcx.concept.session-token
  - nhcx.concept.policy-linking
  decisions:
  - nhcx.decision.session-endpoint
  endpoints:
  - nhcx.endpoint.session-token
  - nhcx.endpoint.get-session
  errors:
  - nhcx.error.nhcx-401
  sandbox:
  - nhcx.sandbox.environments-and-base-urls
  - nhcx.sandbox.support-contacts
---

# Every NHCX call returns 401

## In plain words

Every call to [NHCX](../../shared/glossary/nhcx.md) fails with `401`, often with the message `Sender is not authorized to execute the operation`. When every endpoint fails the same way, the fault is your token or the header carrying it, not any one operation.

## Before you start

- More than one endpoint is failing. If one call fails while others succeed, read that call's own error instead.
- You have the full response body, not only the status code.
- You know where your system gets its token. See [which session token endpoint to call](../decisions/session-endpoint.md).

## What happens

Work through these in order.

1. **Has the token expired?** This message appears when the session token has expired. Read the lifetime from the token response, `expiresIn` or `expires_in`, instead of assuming one. Fetch a new token and retry the failing call once. Retrying with the old token fails the same way. See [the session token every NHCX call carries](../concepts/session-token.md).
2. **Does the value start with `Bearer `?** The header value is the word `Bearer`, a space, then the token. A bare token gives `401`.
3. **Is the token in the header the call reads?** Send the same value in both `bearer_auth` and `Authorization`: `Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>`.
4. **Are the token and the host from the same environment?** A sandbox token does not work against a production host, or the reverse. Compare the host you minted the token on with the host of the failing call. See [environments and base URLs](../sandbox/environments-and-base-urls.md).
5. **Is the token call itself healthy?** If minting a token fails, check the credentials and the body format for the address you call. See [`POST /api/hiecm/gateway/v3/sessions`](../endpoints/session-token.md) and [`POST /get/session`](../endpoints/get-session.md).

## How you know it worked

A call that was returning `401` now returns its normal response, and keeps doing so across several calls over more than one token lifetime. One success after several failures can be a token that happened to be fresh; confirm again after the next refresh.

## When it goes wrong

A `401` on linking or de-linking a policy, while other calls work, is a different fault. The token must come from the client ID used when the payer or TPA named in the link was created. See [linking an ABHA to an insurance policy](../concepts/policy-linking.md).

If all five checks pass and calls still return `401`, the credentials may have been revoked or reissued. Contact NHCX support with the API you called, the time of the call and the full response body. Never send the token or the client secret. See [support contacts](../sandbox/support-contacts.md).

The error this symptom surfaces: [NHCX-401](../errors/nhcx-401.md), user unauthorized.
