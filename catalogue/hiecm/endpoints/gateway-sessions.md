---
id: hiecm.endpoint.gateway-sessions
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create a session and get an access token
summary: >
  Send the client id and client secret from your ABDM sandbox
  registration.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 4 (NHPR).docx
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-gateway.yaml,
      which comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2403, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-gateway-build
---

# Create a session and get an access token

## In plain words

Send the client id and client secret from your ABDM sandbox
registration. The response carries a bearer token that every module
API accepts in the `Authorization` header.

This is the one call that does not itself need a bearer token, which
is why `security` is empty here.

The token is short lived. Read `expiresIn` from the response rather
than assuming a duration, and refresh before it runs out instead of
waiting for a 401.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

NHA's own collection records responses for this operation at status 200, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This has not been run against the sandbox from this repository. When you run it, record the response here and set `verified.status` accordingly.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The consent manager id does not match the host. See [ABDM-2403](../errors/abdm-2403.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

