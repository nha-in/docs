---
id: hiecm.troubleshooting.no-callback-on-my-server
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: No callback reaches my server
summary: >
  Your call was accepted and the answer that should follow never arrived at
  your server. One lookup shows what ABDM holds for you, and it separates the
  four likely causes.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/getting-started/sandbox.mdx
    fetched: 2026-10-03
    hash: sha256:f064694d25f7f6b75afaa5a78b1f6418459d53c09b9f77cd374b06053a1698ac
    note: >
      site/docs/hiecm/v3/getting-started/sandbox.mdx. Step 3: one base URL,
      reachable from the public internet, and a tunnel that changes URL on
      restart.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_services.mdx
    fetched: 2026-10-03
    hash: sha256:5441058e78c8435775fe65e978d6311fb8aff441d558ca0c0eeb78a83a453fa2
    note: >
      site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_services.mdx. What
      the bridge services call returns.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_patch_gateway_v3_bridge_url.mdx
    fetched: 2026-10-03
    hash: sha256:6a474b25bd926e56e5d62b37c2bc559c0eefe4c19956934c4e92381917b1a83a
    note: site/docs/_notes/hiecm/gateway_patch_gateway_v3_bridge_url.mdx. Setting the bridge callback URL.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m2.mdx
    fetched: 2026-10-03
    hash: sha256:7547c4e326a6eb97ef5eea84731cf865839943b762c2c504232e597c96e2a84e
    note: >
      site/docs/hiecm/v3/milestones/m2.mdx. Prerequisites 2 and 3: the
      facility ID mapped to the client ID so callbacks are received, and the
      callback URL.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/callback-never-arrives.mdx
    fetched: 2026-10-03
    hash: sha256:e08dec72ebfba90e54a6d8718a87f7076a6435496e7fb01f70b806460ead35a0
    note: >
      site/docs/hiecm/v3/troubleshooting/callback-never-arrives.mdx. The
      published checklist this diagnosis sits beside.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
    note: The bridge services, bridge service by id and bridge URL operations.
related:
  troubleshooting:
    - hiecm.troubleshooting.callback-never-arrives
    - hiecm.troubleshooting.accepted-then-nothing
  endpoints:
    - hiecm.endpoint.gateway-list-bridge-services
    - hiecm.endpoint.gateway-update-bridge-url
    - hiecm.endpoint.gateway-get-bridge-service-by-id
  concepts:
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.m2-inbound-is-a-surface
  flows:
    - hiecm.flow.m4-link-bridge
  sandbox:
    - shared.sandbox.sandbox-to-hip-or-hiu-id
  glossary:
    - hiecm.glossary.bridge
    - shared.glossary.request-id
---

# No callback reaches my server

## In plain words

Most ABDM calls answer in two parts. First comes a quick "received". The real
answer comes later, when ABDM sends a message to an address on your server.
That later message is the callback.

When no callback reaches you, the usual reason is that ABDM is sending it to
an address that is wrong, private or switched off, or that it does not know
the facility belongs to you. ABDM's side shows the message as sent, so
nothing on your side reports a fault.

Start with one lookup that shows what ABDM holds for you. It tells you which
of the causes below applies.

## Before you start

Confirm the original call returned `202 Accepted` or `200`. If it returned
an error, no callback was ever going to follow: read that error instead.

Do not resend the original call while you check. A resend with a new
`REQUEST-ID` starts a second exchange.

## What happens

### The check that separates the causes

Call `GET /api/hiecm/gateway/v3/bridge-services` with your gateway session
token. It returns your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge)
and every service registered under it. Read three things:

- the `url` in the `bridge` object
- whether the bridge is `active` or `blocklisted`
- the `services` list, and the `types` each service holds, such as `HIP` or
  `HIU`

### The likely causes, in order

| What the lookup shows | Cause | Fix |
| --- | --- | --- |
| The `url` is not the one your server answers on | The callback URL was never set, or it changed. A development tunnel gives a new URL on every restart | Set it with `PATCH /api/hiecm/gateway/v3/bridge/url`, sending the new address in `url`. A `202` with no body confirms it. Read it back with the lookup |
| The `url` is right, and the facility you are calling for is missing from `services`, or lacks the type the flow needs | The facility is not linked to your bridge in that role. The facility ID has to be mapped to your client ID for callbacks to reach you | Link the facility to the bridge with type `HIP` or `HIU`. See [from sandbox registration to a HIP ID](../../shared/sandbox/sandbox-to-hip-or-hiu-id.md) |
| The `url` and the service are both right | The address is not reachable from the public internet. A URL that answers only on your machine, or behind a VPN, receives nothing | Expose it over public HTTPS, and keep it listening at all times. ABDM posts when the answer is ready, not when you ask |
| Everything above is right, and your server logs show the POST arriving | Your handler is the fault: it errors, times out, or looks for the path in the wrong place | Answer fast with a success status before you process the body. Each callback path is relative to the registered URL |

A `204` with `ABDM-1001` on the lookup means nothing is registered against
the bridge yet. That is the first cause and the second together.

One more case looks like a missing callback and is not. The callback arrived
and carries an `error` object in place of the result. That is the answer.
Read the code in it.

## How you know it worked

A POST reaches your registered URL, and its `response.requestId` equals the
`REQUEST-ID` you sent on the call that caused it. Until you have seen that
once, the callback path is unproven.

## When it goes wrong

If the lookup shows the right URL, the right service and type, and the
address is public, and still nothing arrives, raise a request through
[Support](/docs/support). Report the API you called, the `REQUEST-ID`, the
`TIMESTAMP` and the response you got. Never include an access token, a client
secret or a patient's identifiers.

The general checklist, including a request that expired before the other
party answered, is on
[the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives).
When some callbacks in a chain arrive and one does not, use
[accepted, then nothing](/docs/hiecm/v3/troubleshooting/accepted-then-nothing).

## Questions this answers

- Not getting call back on my server?
- Why is my callback URL not being called by ABDM?
- The API returned 202 but nothing came back, what should I check first?
- How do I see which callback URL ABDM has for my bridge?
- My tunnel URL changed, how do I update the callback URL?
