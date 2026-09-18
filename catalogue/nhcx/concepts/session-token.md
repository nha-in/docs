---
id: nhcx.concept.session-token
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The session token every NHCX call carries
summary: >-
  Your system trades its client credentials for a short-lived bearer token and sends
  it on every call, while the exchange proves itself to you with a token of its
  own.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/api-security
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__api-security.md
  hash: sha256:9fe2d5a643356558131e5de801b5f325b76f80aa48e931ee6b77e088dd90a65c
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/api-security, text as shown on the site. API Security.
- url: https://hcxsbx.abdm.gov.in/images/54d18468412741b759f3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Authenticating with NHCX.pdf
  hash: sha256:0ea90b635634844aaf8981e917cbf8b765ddd83a340f3c934883912599a62d8b
  fetched: '2026-09-14'
  note: Authenticating with NHCX, row 3 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, items 6 and 9.
related:
  endpoints:
  - nhcx.endpoint.get-session
  - nhcx.endpoint.session-token
  decisions:
  - nhcx.decision.session-endpoint
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.payer-uc-06
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.jwe-envelope
  glossary:
  - shared.glossary.sandbox
  - shared.glossary.m1
---

# The session token every NHCX call carries

## In plain words

Every call your system makes to NHCX carries a session token. The token tells NHCX which participant is calling.

You get the token by sending your client ID and client secret to a session endpoint. The token expires after a short time, so your system fetches a new one before it lapses.

## Before you start

You need a client ID and client secret from the ABDM [sandbox](../../shared/glossary/sandbox.md) registration. If your system already has credentials for ABDM [Milestone 1](../../shared/glossary/m1.md), the same credentials work for NHCX.

## What happens

Two tokens are in play, one in each direction.

| Direction | Who issues it | How it is checked |
|---|---|---|
| Your system to NHCX | NHCX, from your client ID and secret | NHCX checks it on every call |
| NHCX to your endpoint | NHCX signs its own token with RS256 | You check it with the NHCX instance's public key |

```mermaid
graph LR
  C["Client ID + secret"] -->|session endpoint| T["Bearer token<br/>short lifetime"]
  T -->|header on every call| X["NHCX"]
  X -->|its own signed token<br/>on every delivery| E["Your endpoint"]
```

### Getting and keeping a token

- Call the session endpoint with your credentials. Which endpoint to call is covered in [choosing the session endpoint](../decisions/session-endpoint.md).
- Read the lifetime from the response, `expiresIn` or `expires_in` depending on the endpoint.
- Renew the token before it lapses, from a background task, so no request goes out with an expired token.
- Send it as `Bearer <ACCESS_TOKEN_FROM_SESSION_CALL>`. Each endpoint atom names the request header that carries it.

### Revocation

NHCX revokes access by issuing you a new client secret. Your old tokens stop working, and you must fetch a new token with the new secret.

### The token NHCX sends you

When NHCX delivers a message to your endpoint, it presents a token it signed itself with `alg` `RS256`. The claims are `jti`, `iss`, `sub`, `iat` and `exp`, with `iss` and `sub` both naming the NHCX instance. Validate the signature before you trust the delivery.

## How you know it worked

You have understood this when you can answer both of these.

1. Your token was issued at 10:00 and a call at 10:25 returns HTTP 401. What happened, and what does your system do before retrying?
2. Which token does your callback endpoint check when NHCX delivers a message, and whose key verifies it?

## When it goes wrong

**Expired token.** HTTP 401 with the message "Sender is not authorized to execute the operation" means the session token has expired. Fetch a new one and retry. See [NHCX-401](../errors/nhcx-401.md).

**Missing `Bearer` prefix.** The header value must start with `Bearer ` followed by the token. A bare token is refused with 401.

**Old secret.** After NHCX issues a new client secret, calls with tokens from the old secret fail. Update the secret in your configuration.

**Every call fails.** Work through [every call returns 401](../troubleshooting/everything-returns-401.md).
