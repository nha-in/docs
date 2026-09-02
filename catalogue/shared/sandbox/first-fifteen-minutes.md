---
id: shared.sandbox.first-fifteen-minutes
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: Your first fifteen minutes with ABDM
summary: >
  Everything you can do before NHA approves your sandbox registration:
  read one real gateway session exchange and assemble your own first
  call, ready to paste the moment credentials arrive.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-gateway.yaml
    status: not-yet-hashed
    note: >
      The gateway session operation, recorded in NHA's Postman
      collection and carried through to site/src/data/api/gateway-sessions-create.json.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.gateway-sessions]
  concepts: [hiecm.concept.gateway-session]
  sandbox: [shared.sandbox.registration-and-credentials]
  troubleshooting: [hiecm.troubleshooting.everything-returns-401]
---

# Your first fifteen minutes with ABDM

## In plain words

You cannot run a live [ABDM](../glossary/abdm.md) call until
[NHA](../glossary/nha.md) approves your sandbox registration, and NHA does not publish how long
that takes. This page is the honest quick win instead: in about fifteen minutes, with nothing
but a browser, you read one complete recorded exchange of the
[gateway session](../../hiecm/concepts/gateway-session.md) call and leave with your own first
call already written.

## Before you start

Nothing but a browser. No editor, no terminal, no credentials. That is the point of this page:
everything below runs while you are still waiting on NHA.

## What happens

Three steps, about fifteen minutes together.

1. **Register in the sandbox app, about 2 minutes.** This starts NHA's review clock. Do it
   first, because the wait is the one step you cannot shorten. See
   [registration and credentials](registration-and-credentials.md).
2. **Read one recorded exchange, about 5 minutes.** Below is the gateway session call, the one
   every other ABDM call depends on, exactly as it appears in NHA's Postman collection. It is
   recorded from NHA's collection, not run live: nobody has executed this call from this
   repository.
3. **Assemble your own first call, about 5 minutes.** A filled in curl with placeholders named
   for where each value comes from, so the moment your credentials arrive, pasting them in is
   the only step left.

### The recorded exchange

Method and path: `POST /api/hiecm/gateway/v3/sessions`, sandbox host
`https://dev.abdm.gov.in`.

| Header | Value in the recording |
| --- | --- |
| `REQUEST-ID` | `5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11` |
| `TIMESTAMP` | `2026-08-25T15:51:15.339Z` |
| `Content-Type` | `application/json` |

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>",
  "grantType": "client_credentials"
}'
```

NHA's collection records that a successful call answers `200` and its description says a
session was created and a bearer token was issued. The collection carries no captured response
body, only the field list: `accessToken`, `expiresIn`, `refreshExpiresIn`, `refreshToken` and
`tokenType`. See [the endpoint page](../../hiecm/endpoints/gateway-sessions.md) for what each
field means. Nothing here invents a body NHA never recorded.

### Your own first call

The same request, with the credential placeholders named for where they come from and a fresh
`X-CM-ID` for the sandbox:

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: <A_FRESH_UUID_YOU_GENERATE>' \
  --header 'TIMESTAMP: <CURRENT_ISO_8601_UTC_TIMESTAMP>' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<CLIENT_ID_FROM_SANDBOX_REGISTRATION>",
  "clientSecret": "<CLIENT_SECRET_FROM_SANDBOX_REGISTRATION>",
  "grantType": "client_credentials"
}'
```

Save it. When NHA emails your client id and client secret, this is the one paste away from
your first real call.

## How you know it worked

For the recorded exchange, you can now say what the session endpoint returns and where the
token goes on every later call: a `200` carrying `accessToken`, sent afterwards as
`Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other gateway call.

For your own first call, this is `Not yet observed`. It stays that way until you run it, and
running it needs the credentials NHA has not issued yet.

## When it goes wrong

Questions about registration itself, including how long the review is taking, go to
[NHA's developer forum](https://devforum.abdm.gov.in). See [Support](/docs/support) for the
report format.

If your first real call fails with a 401, that is a different problem from registration: see
[Everything returns 401](../../hiecm/troubleshooting/everything-returns-401.md).

While NHA reviews your registration, use the wait. See
[registration and credentials](registration-and-credentials.md) for what to read next: picking
your role and the milestone table.
