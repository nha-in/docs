---
id: shared.sandbox.callback-url
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: The callback URL, and why M2 and M3 need one before anything works
summary: >
  ABDM answers most M2 and M3 calls by posting to a URL you
  registered, so that URL has to be public and reachable before those
  flows can complete.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 1.docx
    status: not-yet-hashed
    note: NHA milestone pack for M1.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.asynchronous-callbacks]
  glossary: [shared.glossary.request-id]
---

# The callback URL, and why M2 and M3 need one before anything works

## In plain words

In M2 and M3 the answer to your call does not come back in the
response. It arrives later as a POST from ABDM to a URL you registered
in advance.

If that URL is not reachable from the public internet, the flow appears
to hang and nothing tells you why.

## Before you start

You need registered credentials. See
[registration and credentials](registration-and-credentials.md).

Read [asynchronous calls and callbacks](../../hiecm/concepts/asynchronous-callbacks.md)
first, because the shape of the problem matters more than the setup.

## What happens

You register a base URL with ABDM. ABDM posts callbacks to paths under
it, carrying the `REQUEST-ID` you sent on the original call so you can
match them up.

During development the URL usually points at a tunnel to a local
process. In production it is an endpoint in your own infrastructure that
is available continuously, because ABDM will post whether or not you are
ready.

## How you know it worked

You make a call that produces a callback and your handler receives a
POST carrying the same `REQUEST-ID` you generated.

Until you have observed that once, treat the callback path as unproven.
A registered URL that has never received anything is not evidence.

## When it goes wrong

It never arrives. This is the most common report in ABDM integration,
and the cause is nearly always one of: the URL is not public, the path
is wrong, the handler is too slow, or the handler returned an error and
ABDM stopped.

The same callback arrives twice. Deliveries can repeat, so a handler
that appends on every POST will duplicate data. Key on the
`REQUEST-ID`.

You are behind a tunnel that changed address. Development tunnels
reissue URLs, and the registered value goes stale silently.

