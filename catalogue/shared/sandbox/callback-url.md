---
id: shared.sandbox.callback-url
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: The callback URL, and why M2 and M3 need one before anything works
summary: >
  This is where the gateway's incoming notifications land while you are
  testing: ABDM posts callbacks to the webhook receiver URL you register
  in the sandbox. That URL must be publicly reachable, usually through a
  tunnel to your local process.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 1.docx
    status: not-yet-hashed
    note: NHA milestone pack for M1.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Last writer wins on the bridge URL. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  concepts: [hiecm.concept.asynchronous-callbacks, hiecm.concept.bridge-url-ownership]
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

Read [asynchronous calls and callbacks](hiecm.concept.asynchronous-callbacks)
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
reissue URLs, and the registered value goes stale silently. After every
change, re-register and prove delivery with one round trip. See
[who owns the bridge URL](hiecm.concept.bridge-url-ownership).

Another system registered the same client id after you did. The gateway
holds one URL per client id and the last write wins, so every callback
goes to them and nothing tells you.

