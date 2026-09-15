---
id: hiecm.concept.gateway-session
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The gateway session, the first call in every integration
summary: >
  Every ABDM call carries a bearer token from one session endpoint,
  and it is short lived by design.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 4 (NHPR).docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M4, which carries the session request and
      response.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.gateway-sessions]
  errors: [hiecm.error.abdm-2500]
---

# The gateway session, the first call in every integration

## In plain words

Before anything else, your application exchanges its client id and client
secret for an access token. That token goes on every other call as
`Authorization: Bearer`.

The token identifies your application. It does not identify a patient.
That distinction matters in M1, where user scoped calls need a second
token as well.

## Before you start

You need a client id and secret from registering on the ABDM sandbox.
See [registration and credentials](shared.sandbox.registration-and-credentials).

## What happens

One endpoint issues the token, and every module uses it, including M4 on
its different host.

```mermaid
sequenceDiagram
  participant App as Your application
  participant GW as ABDM gateway
  App->>GW: POST /api/hiecm/gateway/v3/sessions
  Note right of App: clientId, clientSecret, grantType
  GW-->>App: accessToken, expiresIn, refreshToken
  App->>GW: any other call, Authorization Bearer accessToken
```

Two tokens exist in M1 and they are not interchangeable. The session
token says which application is calling. The `X-token` returned by login
says which person the call is about. Profile calls need both.

## How you know it worked

You have understood this when you can answer both of these.


  1. Your token stops working after some hours. Where do you read the
     lifetime from, and what should you not do instead?
  2. A profile read returns an authorisation error although the session
     token is fresh. What is missing?

### Two tokens, and `ABDM-1094` rarely means what it says

The gateway access token goes in `Authorization` with a `Bearer ` prefix, the
way every other API you have used expects. The user token goes in `X-token`,
and NHA's own specification writes that one as `X-Token: {token}` with no
prefix.

What was observed on the sandbox on 2026-09-14, one second after a login
returned its token, is that a profile call refuses it either way:

| Sent as | Refusal |
|---|---|
| `X-token: Bearer <token>` | `401 {"code": "ABDM-1094", "message": "X-token expired"}` |
| `X-token: <token>` | `400 {"message": "Invalid X-token"}` |

Both refusals were on a token one second old, so neither is about age. The
cause in that case was the kind of token rather than the header shape: a login
verification returns a transfer token, not a session token, and it has to be
exchanged first. See
[verify a login OTP](../endpoints/m1-login-verify.md).

So read `ABDM-1094` on a profile call as "this token is not the one this call
wants", and work through three things in order: is it the exchanged session
token rather than the transfer token, is the prefix right, and only then, has
it aged out. The message names the last of the three and it is the least
likely.

## When it goes wrong

Hardcoding a token lifetime. NHA has changed it, so read `expiresIn`
rather than assuming.

Putting the client secret in a mobile or browser build. It is a
credential and belongs server side.

