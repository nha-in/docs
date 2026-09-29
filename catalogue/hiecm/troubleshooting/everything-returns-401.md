---
id: hiecm.troubleshooting.everything-returns-401
type: troubleshooting
gateway: hiecm
milestone: M1
version: abdm-v3
title: Everything returns 401
summary: Every call is rejected the same way, which points at the session or the
  headers rather than any one operation.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/everything-returns-401.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/troubleshooting/everything-returns-401.mdx#everything-returns-401.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.gateway-sessions
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2403
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-1032
  glossary:
    - hiecm.glossary.x-cm-id
    - shared.glossary.timestamp-header
---

# Everything returns 401

## In plain words

1. **Has your session token expired?** Session tokens are short lived.
   Read `expiresIn` from the sessions call response rather than assuming
   a duration, and re-run it for a fresh token instead of retrying the
   failing call with the old one. See
   [authentication](/docs/hiecm/v3/reference/authentication).
2. **Are you calling the wrong environment's base URL?** A sandbox token
   is not valid against a production base URL, or the reverse. Look at
   the host in the failing request and the host you requested the
   session token from, side by side. If they differ, point every call
   at the same host you authenticated against.
3. **Is your clock wrong?** The `TIMESTAMP` header has to be close to
   the gateway's own clock, in ISO 8601 UTC. A container host that was
   suspended and resumed is the usual cause, because its clock resumes
   behind. See [authentication](/docs/hiecm/v3/reference/authentication).
4. **Is `X-CM-ID` missing or wrong for this environment?** Look at the
   literal value you sent, not the value you meant to send: `sbx` on
   the sandbox, `abdm` in production. This header names the consent
   manager you are pointed at, and the wrong value fails every call the
   same way a missing session token does.

### How you know it worked

A call that was returning 401 now returns its normal response, and stays
that way across more than one call in a row. A single success right
after several failures can be a token that was about to expire anyway;
confirm with a second call a minute or more later.

### When it goes wrong

If you have re-run the session call, confirmed the environment, fixed
the clock, and confirmed `X-CM-ID`, and calls still return 401 with no
matching code, raise a request on the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/). Report the API you
called, the `REQUEST-ID`, the `TIMESTAMP`, and the full response body.
See [what to put in a support request](/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report format.

The codes this symptom can surface are on the
[error codes reference](/docs/hiecm/v3/reference/error-codes): an
invalid timestamp, the wrong consent manager id, a missing session
token, or a required header that is absent or malformed.

## Before you start

Confirm that more than one endpoint fails the same way, and keep the full response body. If one call fails and others succeed, this page does not apply: read that call's error code.

## What happens

Check in order and stop at the first that fails: a fresh session token from `POST /api/hiecm/gateway/v3/sessions`, the same host for the session call and the failing call, a `TIMESTAMP` from a synchronised clock in ISO 8601 UTC, and the literal `X-CM-ID` value, `sbx` on the sandbox and `abdm` in production. Read `expiresIn` from the session response rather than assuming a lifetime.

## How you know it worked

Two calls a minute or more apart both return their normal response.

## When it goes wrong

After all four checks pass, stop retrying and hand the person the support report: the API called, `REQUEST-ID`, `TIMESTAMP` and the full response body. Never include the token or the client secret.
