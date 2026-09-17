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
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-gateway.yaml,
      which comes from this source.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Standard headers, the session body and the 30 second refresh margin. The 415 without Content-Type is in catalogue/verification/hiecm.endpoint.gateway-sessions.json, run 2026-09-17.
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

- A client id and client secret from your sandbox registration. See
  [the gateway session](hiecm.concept.gateway-session).

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "clientId": "<YOUR_CLIENT_ID>",
  "clientSecret": "<YOUR_CLIENT_SECRET>",
  "grantType": "client_credentials"
}'
```

`Content-Type: application/json` is required. Without it the gateway
answers 400 with `ABDM-9999` and a message beginning
`415 UNSUPPORTED_MEDIA_TYPE`, because the body is read as
`application/octet-stream`. No `Authorization` header goes on this call:
it is the call that issues the token.

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

NHA's own collection records responses for this operation at status 200, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

The response carries `accessToken`, `expiresIn` and `refreshToken`. Refresh about 30 seconds before `expiresIn` runs out, and drop the cached token on any 401.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The consent manager id does not match the host. See [ABDM-2403](hiecm.error.abdm-2403).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

