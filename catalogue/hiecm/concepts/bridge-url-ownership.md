---
id: hiecm.concept.bridge-url-ownership
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Who owns the bridge URL, and proving a change took
summary: >
  The gateway holds one callback URL per client id, the last write wins,
  and nothing reads it back. After any change, prove delivery with one
  cheap round trip before trusting a single callback.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Sections 1.6, 1.7 and 5.3. Observed by an integrator on 2026-09-16,
      not yet run from this repository.
related:
  endpoints:
    - hiecm.endpoint.gateway-update-bridge-url
    - hiecm.endpoint.gateway-get-bridge-service-by-id
    - hiecm.endpoint.m2-hip-link-care-context
    - hiecm.endpoint.m3-consent-request-init
  callbacks:
    - hiecm.callback.m2-on-carecontext-result
    - hiecm.callback.m3-on-consent-request-init
  concepts:
    - hiecm.concept.asynchronous-callbacks
  sandbox:
    - shared.sandbox.callback-url
  troubleshooting:
    - hiecm.troubleshooting.callback-never-arrives
  glossary:
    - shared.glossary.bridge
skills:
  - hiecm-m2-build
  - hiecm-m2-debug
  - hiecm-m3-build
  - hiecm-m3-debug
---

# Who owns the bridge URL, and proving a change took

## In plain words

Your [bridge](shared.glossary.bridge) URL is where ABDM posts every
callback. The gateway stores exactly one URL per client id. Whoever
patches it last owns every callback from that moment, and there is no
call that tells you which URL is registered now.

Two things follow. A client id shared between two systems, such as a
team's sandbox id used by a developer laptop and a staging server, sends
all callbacks to whichever system registered last, silently. And a
tunnel that changes address on restart needs the URL re-registered and
proven after every restart.

## Before you start

- A client id and secret. See [registration and credentials](shared.sandbox.registration-and-credentials).
- A public URL for your bridge. See [the callback URL](shared.sandbox.callback-url).

## What happens

```mermaid
sequenceDiagram
  participant A as System A
  participant GW as HIE-CM gateway
  participant B as System B, same client id
  A->>GW: PATCH /gateway/v3/bridge/url, URL of A
  GW-->>A: 200
  B->>GW: PATCH /gateway/v3/bridge/url, URL of B
  GW-->>B: 200
  Note over GW: one URL per client id, now B
  GW->>B: every callback for the client id
  A->>GW: GET /gateway/v3/bridge-service/serviceId/{id}
  GW-->>A: endpoints: {}, the URL is not in the response
```

[Update bridge URL](hiecm.endpoint.gateway-update-bridge-url) replaces
the URL for the whole client id. [Get bridge service by id](hiecm.endpoint.gateway-get-bridge-service-by-id)
confirms the client is active as HIP, HIU or PHR, and returns
`"endpoints": {}`, so it cannot confirm the URL.

The only proof is delivery. After any change to the URL, run one cheap
round trip before doing anything else:

- As a HIP: link a test care context and wait for
  [the link result](hiecm.callback.m2-on-carecontext-result). It arrives
  within about a second when the URL is right.
- As a HIU: send a consent init and wait for
  [the on-init callback](hiecm.callback.m3-on-consent-request-init).

If the round trip does not complete, no other callback will either.
Stop and fix the URL before reading any other symptom.

Keep the administrative routes of your own service, including whatever
sets the bridge URL, unreachable through the tunnel. Refuse requests
that arrive with `X-Forwarded-For` or from a non loopback address.

## How you know it worked

You have understood this when you can answer both of these.

1. Callbacks that worked yesterday have stopped, and the gateway returns
   200 on every call you make. What did somebody else do, and what one
   call tells you?
2. You restarted your tunnel. What two things happen before you retry
   the flow that was failing?

## When it goes wrong

Callbacks stop for hours and every outbound call still succeeds. Another
system with your client id patched the URL. Re-register and run the
round trip.

You look for a read endpoint to confirm the URL and find
`endpoints: {}`. There is none. Delivery is the check.

A scan and share scan produces nothing on your bridge. Same cause, same
fix. See [scan and share](hiecm.concept.scan-and-share).
