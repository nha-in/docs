---
id: hiecm.troubleshooting.callback-never-arrives
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: The callback never arrives
summary: >
  You sent a request, got back a 202 or 200, and the answer that was
  supposed to follow on your registered callback URL never came. The
  checks this catalogue recommends, in the order it recommends
  checking them, not a record of how often each has been the cause.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: NHA milestone pack for M2, the same source asynchronous-callbacks.md draws on.
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 1.docx
    status: not-yet-hashed
    note: NHA milestone pack for M1, the same source callback-url.md draws on.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.asynchronous-callbacks]
  sandbox: [shared.sandbox.callback-url]
  endpoints: [hiecm.endpoint.gateway-update-bridge-url]
  errors: [hiecm.error.abdm-9999]
  glossary: [shared.glossary.request-id]
skills:
  - hiecm-m2-debug
  - hiecm-m3-debug
---

# The callback never arrives

## In plain words

You made a call, it returned quickly with a 202 or a 200, and nothing
else has happened since. This is a common report in
[HIE-CM](../../shared/glossary/hie-cm.md) integration. The checks below
are in the order this catalogue recommends checking, not a record of
how often each has turned out to be the actual cause.

That early response only means the gateway accepted your request. In M2
and M3 the real answer arrives later, as a POST from
[NHA](../../shared/glossary/nha.md)'s gateway to a URL you registered in
advance. See [asynchronous calls and callbacks](../concepts/asynchronous-callbacks.md)
for why this is the normal shape of these flows, not a fault.

## Before you start

- The call itself returned 202 or 200, not an error. If it failed
  outright, work through [everything returns 401](everything-returns-401.md)
  or the error atom the response body names instead.
- You have the `REQUEST-ID` you sent on the original call. See
  [REQUEST-ID](../../shared/glossary/request-id.md). It is the only
  reliable way to match a callback to the call that caused it, and NHA
  needs it if you escalate.
- You can read your callback receiver's logs, or add logging to it if it
  has none yet.

## What happens

Work through these checks in this order. This is the sequence this
catalogue recommends checking, not a record of how often each has
turned out to be the actual cause.

1. **Is the callback URL registered with the gateway?** Confirm with
   [update HIP/HIU bridge callback URL](../endpoints/gateway-update-bridge-url.md).
   A URL you set once in a console but never confirmed against the
   gateway is not the same thing as a registered URL.
2. **Is that URL reachable from the public internet over HTTPS?** ABDM
   posts to it from outside your network. A URL that only answers on
   your local machine or behind a VPN will never receive anything, and
   nothing tells you that from the original call. See
   [the callback URL](../../shared/sandbox/callback-url.md).
3. **Did the request expire before the other party answered?** How long
   a request stays live before ABDM gives up is not stated in NHA's
   documents this catalogue has. If you have waited what seems like a
   long time, say so when you escalate rather than assuming a fixed
   window.
4. **Is your endpoint returning a non success status?** A handler that
   errors, times out, or is too slow is a real problem, though NHA's
   documents do not describe a specific policy for when or whether
   delivery attempts stop. The asynchronous callbacks atom does confirm
   deliveries can repeat, so your handler has to treat every delivery as
   possibly a retry of one it already handled. Respond quickly with a
   success status even before you have finished processing the callback
   body.

## How you know it worked

Your handler receives a POST at your registered URL, carrying the exact
`REQUEST-ID` you generated for the original call. Until you have
observed that once for this integration, treat the callback path as
unproven, even if the registration call succeeded.

## When it goes wrong

If all four checks pass and the callback still has not arrived, escalate
on the NHA dev forum rather than continuing to guess. Report the API you
called, the `REQUEST-ID` you sent, the `TIMESTAMP` you sent, and the
response you received, so the exact call is identifiable. NHA's forum is
the right place for a callback that a correctly registered, reachable,
fast-responding URL still never receives.

The error this symptom can surface once you do get a response is
[ABDM-9999](../errors/abdm-9999.md), NHA's catch-all for a failure it
does not explain further.
