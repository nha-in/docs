---
id: hiecm.concept.callback-authenticity
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Proving a callback really came from ABDM
summary: Anything can post to your callback URL, so require the bearer token and
  a request id you sent before your handler acts.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/callback-authenticity.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/callback-authenticity.mdx#callback-authenticity.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.gateway-session
    - hiecm.concept.consent-artefact
  troubleshooting:
    - hiecm.troubleshooting.callback-never-arrives
---

# Proving a callback really came from ABDM

## In plain words

Every callback in the specifications declares bearer authentication. The token
arrives in the `Authorization` header as `Bearer <token>`. Check two things
before your handler does any work:

1. **A bearer token is present.** Reject a callback without one, and log the
   rejection.
2. **It answers a call you made.** Its `response.requestId` matches the
   `REQUEST-ID` of a request you sent. A callback that answers nothing you sent
   is not yours to act on.

The keys that verify the token's signature are not among the published gateway
calls. Confirm at onboarding how to verify the token, and meanwhile hold the two
checks above.

The signature inside a consent artefact is a different thing. It signs the
artefact's contents and proves the artefact was not altered. Checking the
delivery does not check the artefact, and checking the artefact does not check
the delivery.

### How you know it worked

A callback carrying a bearer token and a request id you sent is processed. The
same body with the `Authorization` header removed is rejected before your
handler reads the payload, and the rejection is logged. The second is the test
worth writing, because it is the only one that fails loudly when the check is
silently skipped.

### When it goes wrong

**The check is skipped under load.** A handler that checks inside a try block
and continues on failure is worse than one that never checked, because it reads
as safe. Fail closed.

**Nothing arrives at all**, which is a different problem. See
[the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives).

## Before you start

A callback URL registered for your bridge, and the understanding that a 202 on your own call is not the answer. See [a 200 means accepted, not done](/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks).

## What happens

In the handler, before parsing the body for action: require the `Authorization` header with a bearer token, then require that `response.requestId` matches a `REQUEST-ID` your system sent and has not already handled. Reject otherwise. Do not invent a signature check against a key source the specifications do not publish.

## How you know it worked

A test posts a valid callback body without `Authorization` and sees it rejected and logged before any handler work.

## When it goes wrong

Never fall back to processing a callback that failed a check while you investigate. A callback whose request id is unknown to you is logged and dropped, not retried.
