---
id: hiecm.endpoint.m1-benefit-link-or-delink
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Link or unlink a benefit record from an ABHA
summary: >
  Link or unlink a benefit record from an ABHA.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Link or unlink a benefit record from an ABHA

## In plain words

One call does both directions. NHA's saved success response names the
scheme and confirms the link in a human readable `status` string rather
than a code, so match on the HTTP status and the scheme, not on that
text.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The person logged in, so you hold their `X-token`. See [log somebody in](../flows/m1-login-by-mobile.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/linkAndDelink' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

NHA's own collection records responses for this operation at status 200, 400, 401, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This has not been run against the sandbox from this repository. When you run it, record the response here and set `verified.status` accordingly.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The person scoped token is wrong or expired. See [ABDM-2401](../errors/abdm-2401.md).
- Authentication fails without saying why. See [900900](../errors/900900.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

