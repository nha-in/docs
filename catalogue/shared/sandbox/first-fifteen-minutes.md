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
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
    note: >
      The gateway session operation. The header and body values shown
      are this file's example values.
  - url: https://abdm.gov.in/FAQ
    fetched: 2026-09-02
    status: docs-only
    note: >
      Sandbox category, "How to integrate digital health solutions in
      the sandbox?": application takes around 10 minutes, processed in
      a maximum of 5 working days.
  - file: catalogue/openapi/hiecm/v3/hiecm-gateway.yaml
    status: read-from-spec-2026-09-23
    note: The session call answers 202 Accepted with the token fields.
  - file: site/docs/hiecm/v3/getting-started/sandbox.mdx
    status: reference
    note: >
      Once access is approved, the client id and client secret are issued
      inside the sandbox application.
related: {}
---

# Your first fifteen minutes with ABDM

## In plain words

You cannot run a live [ABDM](shared.glossary.abdm) call until
[NHA](shared.glossary.nha) approves your sandbox registration. NHA's FAQ publishes a maximum
for that review: applications are processed within 5 working days. This page gives you a
genuine fifteen minutes of your own while that runs: with nothing but a browser, read one
complete transcribed exchange of the
[gateway session](/docs/hiecm/v3/concepts/gateway) call and leave with your own first
call already written. Applying for sandbox access is a separate step, worth doing first since
it starts NHA's review clock.

## Before you start

Nothing but a browser. No editor, no terminal, no credentials. That is the point of this page:
everything below runs while you are still waiting on NHA.

## What happens

Apply first, then spend fifteen minutes of your own on the two steps below.

1. **Register in the sandbox app, about 10 minutes.** NHA's FAQ gives this estimate for the
   application itself, and a maximum of 5 working days for it to be processed. This starts
   NHA's review clock, so do it before anything else. See
   [sandbox access](/docs/hiecm/v3/getting-started/sandbox).
2. **Read one transcribed exchange, about 5 minutes.** Below is the gateway session call, the
   one every other ABDM call depends on. The header and body values shown are example values
   from the specification rather than a recorded response, so read the shape and expect your
   own values to differ.
3. **Assemble your own first call, about 10 minutes.** A filled in curl with placeholders named
   for where each value comes from, so the moment your credentials arrive, pasting them in is
   the only step left.

### The transcribed exchange

Method and path: `POST /api/hiecm/gateway/v3/sessions`, sandbox host
`https://dev.abdm.gov.in`.

| Header | Example value in the specification |
| --- | --- |
| `REQUEST-ID` | `5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11` |
| `TIMESTAMP` | `2026-08-25T15:51:15.339Z` |
| `X-CM-ID` | `sbx` |
| `Content-Type` | `application/json` |

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>",
  "grantType": "client_credentials"
}'
```

A successful call answers `202 Accepted`, with a session created and a bearer token issued.
The response carries `accessToken`, `expiresIn`, `refreshExpiresIn`, `refreshToken` and
`tokenType`. See
[the endpoint page](/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/01-gateway-post-gateway-v3-sessions)
for what each field means.

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

Save it. Once your access is approved, your client id and client secret are issued inside the
sandbox application, and this is the one paste away from your first real call.

### What you test M1 with

Everything in the sandbox is test data, and no test identities are published
with it. There is no fixture Aadhaar number and no fixed OTP: an OTP goes to
whichever handset the identifier is registered against, and a real one
receives it.

So plan for this before you reach your first OTP call:

- **A mobile you can read an SMS on.** This unlocks the whole login journey,
  and it is the cheapest thing to arrange. Your own is fine.
- **An Aadhaar whose linked mobile you hold**, if you intend to build ABHA
  creation or anything that ends in a KYC verified ABHA number. Without one
  you can build and read the creation calls but never complete them.

Two consequences worth designing around. Never point an OTP call at a number
nobody on your team answers, because a real person receives that message. And
attempts are counted against the transaction rather than against you, so a
retry loop against one number spends the transaction rather than trying again.

## How you know it worked

For the transcribed exchange, you can now say what the session endpoint returns and where the
token goes on every later call: a `202` carrying `accessToken`, sent afterwards as
`Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other gateway call.

For your own first call, this is `Not yet observed`. It stays that way until you run it, and
running it needs the credentials NHA has not issued yet.

## When it goes wrong

Registration is processed within 5 working days. If you are past that
with no word, raise it on the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/) or at
`integration.support@nha.gov.in`. See [Support](/docs/support) for the
report format.

If your first real call fails with a 401, that is a different problem from registration: see
[Everything returns 401](/docs/hiecm/v3/troubleshooting/everything-returns-401).

While NHA reviews your registration, use the wait. See
[sandbox access](/docs/hiecm/v3/getting-started/sandbox) for what to read next, then
[the milestones page](/docs/hiecm/v3/milestones) to pick your role and your milestones.
