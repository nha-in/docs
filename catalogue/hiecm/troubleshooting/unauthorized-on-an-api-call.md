---
id: hiecm.troubleshooting.unauthorized-on-an-api-call
type: troubleshooting
gateway: hiecm
milestone: M1
version: abdm-v3
title: Unauthorized on an API call
summary: >
  A call is refused as unauthorized. Which key was refused depends on whether
  the first call, every call, or only calls about one person fail, and one
  test tells the three apart.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx
    fetched: 2026-10-03
    hash: sha256:482d2fd88a4fd3cefad825a9b955235f989520a2cdf8691ca32f73b059516916
    note: >
      site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx. The
      session call, and 401 with 900901 for a wrong client id or secret.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/gateway.mdx
    fetched: 2026-10-03
    hash: sha256:15ebd5a733bade27568ed817e0cc6cbf925ed650917dc273a032321aaacb059a
    note: >
      site/docs/hiecm/v3/concepts/gateway.mdx. The session endpoint, the
      Authorization header, the two hosts, and the user token on profile
      calls.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/errors/m2.mdx
    fetched: 2026-10-03
    hash: sha256:b0b0036c6d3d0d8b17b31e3587353dba177a7b67219d3bd3dad23b7b445747df
    note: >
      site/docs/_notes/hiecm/errors/m2.mdx. ABDM-2500, ABDM-2401, ABDM-1065,
      ABDM-2403 and ABDM-2402.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/errors/m1.mdx
    fetched: 2026-10-03
    hash: sha256:a2bd7e8c836fd7a8ab0130a8e9db267813024127b47357b66ddaca7b5471c16e
    note: site/docs/_notes/hiecm/errors/m1.mdx. 900901, 900902 and 900900.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p1.mdx
    fetched: 2026-10-03
    hash: sha256:556636d38af798285ee3ccd5d90e0351ab01e9c8d0aab2f2191cefe5a9930b60
    note: site/docs/hiecm/v3/milestones/p1.mdx. Token lifetimes.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/everything-returns-401.mdx
    fetched: 2026-10-03
    hash: sha256:176d157a1231ba4dfe3fe12d6393d743b8f14ec2db9d857f21fa123b26ccb62d
    note: >
      site/docs/hiecm/v3/troubleshooting/everything-returns-401.mdx. The
      published checklist this diagnosis sits beside.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
    note: The session operation and its headers.
related:
  troubleshooting:
    - hiecm.troubleshooting.everything-returns-401
  endpoints:
    - hiecm.endpoint.gateway-sessions
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900901
    - hiecm.error.900900
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2403
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-1094
  glossary:
    - hiecm.glossary.x-cm-id
    - shared.glossary.timestamp-header
---

# Unauthorized on an API call

## In plain words

ABDM checks who is calling before it does anything. Your software proves who
it is with keys. There are three, and "unauthorized" means one of them was
refused.

- **Your organisation's keys.** A client id and a client secret, issued when
  your sandbox access was approved.
- **A short pass.** Your software swaps those keys for a pass and shows it on
  every call. The pass expires after a few minutes and has to be renewed.
- **The person's pass.** Calls about one patient's own account also need a
  pass that the patient received when they signed in.

Which one was refused depends on which calls fail. If the first call fails,
it is the organisation's keys. If every call after it fails, it is the short
pass or where the call was sent. If only calls about one person fail, it is
that person's pass.

## What happens

### The check that separates the causes

Run the session call on its own, against the host you are using:
`POST /api/hiecm/gateway/v3/sessions` with your `clientId`, your
`clientSecret` and `grantType` set to `client_credentials`. Then send the
failing call again at once with the `accessToken` it returned.

| What happens | Cause | Fix |
| --- | --- | --- |
| The session call itself answers `401` with `900901` | The client id or secret is wrong for this environment. A production client id against a sandbox host, or the reverse, fails | Use the credentials issued for the environment whose host you are calling: `https://dev.abdm.gov.in` for the sandbox, `https://apis.abdm.gov.in` for production |
| The session call succeeds, and the failing call now works | The pass you were sending had expired, or was never sent. `ABDM-2500`, "Authorization header is missing", is the second case | Send `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every call. Read `expiresIn` from the session response and renew before it runs out |
| The session call succeeds, and every other call still fails | The call goes to a different environment from the one that issued the pass, or a header beside the pass is refused: `X-CM-ID` or `TIMESTAMP` | Point every call at the host you authenticated against. Send `X-CM-ID` as `sbx` on the sandbox and `abdm` in production. Send `TIMESTAMP` in UTC from a synchronised clock |
| Gateway calls work, and only calls about a patient's account fail | The person's pass is missing, expired, or belongs to someone else. It travels in `X-token` on M1 profile calls and in `X-AUTH-TOKEN` on PHR calls. `ABDM-2401` and `ABDM-1065` name it | Have the person sign in again, or use the refresh token from their login. Never send your application's access token in its place |

Token lifetimes for planning renewal: the gateway session token is valid for
20 minutes, the user token from login for 30 minutes, and the refresh token
for 15 days. Read `expiresIn` from your own response and do not hard code a
value.

## How you know it worked

The call that was refused returns its normal response, and a second call a
minute or more later does too. One success straight after a renewal can be a
pass that was about to expire anyway.

## When it goes wrong

- The code is `900900`, "Unclassified Authentication Failure". Many M1 calls
  take two passes, the access token in `Authorization` and the person's token
  in `X-token`, and either can be the cause. Check both.
- The code is `ABDM-1094` with "Access to this feature is restricted. Please
  contact NHA to enable it." Your client is not enabled for that feature.
  Retrying does not help.
- Do not loop on a refusal. Back off, and find out why the first attempt
  failed.

If a fresh pass, the right host and the right headers still give
"unauthorized", raise a request through [Support](/docs/support) with the API
you called, the `REQUEST-ID`, the `TIMESTAMP` and the full response body.
Never include the token or the client secret. The longer checklist is on
[everything returns 401](/docs/hiecm/v3/troubleshooting/everything-returns-401).

## Questions this answers

- Why does an Unauthorized error appear when calling an API?
- I get 401 on the sessions call, what is wrong?
- My token worked a while ago and now every call fails, why?
- Which token goes in X-AUTH-TOKEN and which in Authorization?
- Do sandbox credentials work on the production URL?
