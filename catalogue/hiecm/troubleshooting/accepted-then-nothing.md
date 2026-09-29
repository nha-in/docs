---
id: hiecm.troubleshooting.accepted-then-nothing
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: Discovery or linking was accepted, then nothing happens
summary: Discovery or linking was accepted and then stalled, and you need to
  find which callback in the chain is missing.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/accepted-then-nothing.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/troubleshooting/accepted-then-nothing.mdx#accepted-then-nothing.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.asynchronous-callbacks
  flows:
    - hiecm.flow.m2-link-care-context
  callbacks:
    - hiecm.callback.m2-on-discovery-request
    - hiecm.callback.m2-on-link-init
    - hiecm.callback.m2-on-link-confirm
  errors:
    - hiecm.error.abdm-1056
    - hiecm.error.abdm-2406
  glossary:
    - shared.glossary.request-id
    - hiecm.glossary.hiu
    - shared.glossary.phr
---

# Discovery or linking was accepted, then nothing happens

## In plain words

1. **Discovery request.** Your discovery call should produce an inbound
   discovery request callback to your bridge. If this never arrives, the
   problem sits upstream of your system entirely; escalate rather than
   continuing down this list.
2. **Link initiation.** Starting a link should produce an inbound link
   init callback. If discovery completed but this never arrives, the
   stall is at the handoff into linking.
3. **Link confirmation.** Do not treat the synchronous acknowledgement
   to your link request as success. The confirmation arrives as a
   separate callback to your registered URL, and the care context only
   becomes visible in the patient's PHR app once it does. See
   [linking](/docs/hiecm/v3/concepts/linking) for the full sequence.
4. **`REQUEST-ID` reuse.** If you generated the same `REQUEST-ID` for
   more than one call in the chain, or reused one from an earlier
   attempt, responses and callbacks can no longer be told apart.
   Generate a fresh one per call.

Before assuming any step above is genuinely missing, rule out a callback
URL problem first: [the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives)
covers registration and reachability, which is more common than the
gateway itself failing to send.

### How you know it worked

For linking, the care context appears when the patient's PHR app runs
discovery against your facility, after the link confirm callback reports
success. For discovery, your system answers the inbound discovery
callback with the care contexts you hold for that patient.

### When it goes wrong

If you have identified which callback in the chain is missing and ruled
out a callback URL problem, raise a request on the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/). Report which step of the
chain stopped, the `REQUEST-ID` from the call that started it, the
`TIMESTAMP`, and every response and callback body you did receive up to
the point it stalled. See [what to put in a support request](/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report
format.

This symptom can surface as a duplicate or invalid link reference, or a
call made out of the logical sequence, both on the
[M2 errors reference](/docs/hiecm/v3/api/m2/errors).

## Before you start

Know which chain you are in, discovery or linking, and hold the `REQUEST-ID` of the call that started it.

## What happens

Walk the chain in order and find the first callback that did not arrive: the discovery request on your bridge, then link init, then link confirm. Rule out the callback URL first, using the checks on [the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives). Generate a fresh `REQUEST-ID` for every call, because a reused one makes callbacks impossible to tell apart.

## How you know it worked

For linking, the link confirm callback reports success and the care context appears when the patient runs discovery. For discovery, your system answers the inbound discovery request with the care contexts it holds.

## When it goes wrong

Once the missing step is named and the callback URL is ruled out, stop and hand the person the support report: which step stopped, the starting `REQUEST-ID`, the `TIMESTAMP`, and every response and callback body received so far.
