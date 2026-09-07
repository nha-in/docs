---
title: Session token
sidebar_label: Session token
description: Getting a bearer token from the ABDM gateway with your Milestone 1 credentials, and keeping it fresh.
verification: unverified
source: "Authenticating with NHCX (NHA); NHCX FAQs v1.2 #2, #3, #20; Common Mistakes while implementing through NHCX #6, #9; ABDM gateway v3 sessions call as used against the sandbox"
sidebar_position: 2
---

# Session token

Every call carries a bearer token. The token does not come from NHCX. It comes from the ABDM gateway, with the client ID and secret you were given for Milestone 1.

## In short

- The token comes from the ABDM gateway, not from NHCX, using your Milestone 1 client ID and secret.
- Three headers are mandatory on the sessions call: a fresh `REQUEST-ID`, a current `TIMESTAMP`, and `X-CM-ID`.
- On NHCX calls the token goes in `bearer_auth`, with the word `Bearer` in front.
- Sources disagree on the lifetime, so refresh on a timer and retry any `401` once with a fresh token.

## Getting one

```bash
curl --location 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  --header 'REQUEST-ID: 607f0d74-0913-4345-afd0-70123442eb64' \
  --header 'TIMESTAMP: 2026-09-04T06:15:51.975Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": "<your client id>",
    "clientSecret": "<your client secret>",
    "grantType": "client_credentials"
  }'
```

Three headers matter here, and none of them is optional.

- `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.
- `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand.
- `X-CM-ID` names the environment. It is `sbx` on the sandbox. The mirror and the adapter both use lowercase.

`grantType` is `client_credentials`. The older form of this call omitted it, which is why an otherwise correct request copied from an old sample can be rejected.

The response:

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 300,
  "refreshTokenIn": 300,
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "tokenType": "bearer"
}
```

An older address, `https://dev.abdm.gov.in/gateway/v0.5/sessions`, appears throughout the portal's earlier documents. It takes the client ID and secret alone, without the three headers and without `grantType`, and it returns the same body. Treat it as superseded: build against the v3 address above, and fall back to the older one only if v3 answers with an error that is not about your credentials.

## Using it

On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

```
bearer_auth: Bearer eyJhbGciOiJSUzI1NiIs...
```

Leaving out the `Bearer` prefix is the portal's own example of how to get a `401`.

## Keeping it fresh

The token is short-lived. The portal's documents put its life at 300 seconds in one place and 1200 in another, so do not rely on either. Build it like this:

- Keep the token and the time you got it.
- Before each call, if it is older than a few minutes, get a new one first.
- If any call answers `401`, get a new token and retry that call once. Do not retry with the same token; it will fail the same way.
- Never write the token or the secret to a log.

One token serves every call: the participant service, the use-case endpoints, and the status check.

## What can go wrong

| Symptom | Cause |
| :---- | :---- |
| `401` on the sessions call itself | Wrong client ID or secret, or Milestone 1 not complete |
| An error on the sessions call naming a header | `REQUEST-ID` reused or absent, `TIMESTAMP` stale or in the wrong format, or `X-CM-ID` missing |
| An error on the sessions call naming the body | `grantType` omitted, which the v3 address requires |
| `401 Sender is not authorized to execute the operation` on an NHCX call | Token expired |
| `401` immediately after getting a fresh token | `Bearer` prefix missing |
