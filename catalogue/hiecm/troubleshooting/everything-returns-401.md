---
id: hiecm.troubleshooting.everything-returns-401
type: troubleshooting
gateway: hiecm
milestone: M1
version: abdm-v3
title: Everything returns 401
summary: >
  Every call you make is rejected, not just one endpoint. The checks
  that rule out the common causes, in order, before you assume the
  gateway itself is down.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: NHA's error code table, the same source ABDM-2402 and ABDM-2403 draw on.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.gateway-sessions]
  concepts: [hiecm.concept.gateway-session]
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2403
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-1032
  glossary: [shared.glossary.x-cm-id, shared.glossary.timestamp-header]
skills:
  - hiecm-m1-debug
  - hiecm-m2-debug
---

# Everything returns 401

## In plain words

Every call fails the same way, on every endpoint, not just one. That
pattern points at your session or your headers, not at any one operation
you are calling.

## Before you start

- More than one endpoint is failing. If only one call fails while others
  succeed, read that call's own error atom instead of this page.
- You have the response body, not only the status code. NHA's gateway
  returns a code in the body that names the actual reason.

## What happens

Work through these in order.

1. **Has your session token expired?** Session tokens are short lived.
   Read `expiresIn` from the response of
   [create a session and get an access token](../endpoints/gateway-sessions.md)
   rather than assuming a duration, and re-run that call for a fresh
   token instead of retrying the failing call with the old one.
2. **Are you calling the wrong environment's base URL?** A sandbox
   token is not valid against a production base URL, or the reverse.
   Confirm the host in the failing request matches the host you
   requested the session against.
3. **Is your clock wrong?** The `TIMESTAMP` header has to be close to
   the gateway's own clock, in ISO 8601 UTC. See
   [ABDM-2402, your clock is wrong](../errors/abdm-2402.md): a container
   host that was suspended and resumed is the usual cause, because its
   clock resumes behind.
4. **Is `X-CM-ID` missing or wrong for this environment?** See
   [ABDM-2403](../errors/abdm-2403.md). This header names the consent
   manager you are pointed at, and the wrong value fails every call the
   same way a missing session token does.

## How you know it worked

A call that was returning 401 now returns its normal response, and stays
that way across more than one call in a row. A single success after
several failures can be a token that was about to expire anyway; confirm
with a second call a minute or more later.

## When it goes wrong

If you have re-run the session call, confirmed the environment, fixed
the clock, and confirmed `X-CM-ID`, and calls still return 401 with no
code that matches the checks above, escalate on the NHA dev forum.
Report the API you called, the `REQUEST-ID` you sent, the `TIMESTAMP`
you sent, and the full response body, not just the status.

The errors this symptom most often turns out to be:
[ABDM-2402](../errors/abdm-2402.md), your clock is wrong;
[ABDM-2403](../errors/abdm-2403.md), you are pointed at the wrong consent
manager; [ABDM-2500](../errors/abdm-2500.md), you did not send a session
token; and [ABDM-1032](../errors/abdm-1032.md), a required header is
absent or malformed and NHA is not saying which one.
