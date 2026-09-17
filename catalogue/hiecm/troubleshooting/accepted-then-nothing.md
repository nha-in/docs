---
id: hiecm.troubleshooting.accepted-then-nothing
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: Discovery or linking was accepted, then nothing happens
summary: >
  You started discovery or care context linking, the first call was
  accepted, and the flow has stalled somewhere in the middle. Which
  callback in the chain is missing, and how to escalate with enough
  detail that NHA can find the stuck request.
sources:
  - file: site/docs/api/hie-cm/index.md
    fetched: 2026-08-24
    hash: sha256:a070aca723ef1184dd2e88514af0778baec3c1f24f0abab161c89cd447efe85d
    note: The same source m2-link-care-context.md draws on for the M2 call sequence.
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: NHA milestone pack for M2, the same source asynchronous-callbacks.md draws on.
related:
  concepts: [hiecm.concept.asynchronous-callbacks]
  flows: [hiecm.flow.m2-link-care-context]
  callbacks:
    - hiecm.callback.m2-on-discovery-request
    - hiecm.callback.m2-on-link-init
    - hiecm.callback.m2-on-link-confirm
  errors:
    - hiecm.error.abdm-1056
    - hiecm.error.abdm-2406
  glossary: [shared.glossary.request-id, shared.glossary.hiu, shared.glossary.phr]
skills:
  - hiecm-m2-debug
---

# Discovery or linking was accepted, then nothing happens

## In plain words

You started an M2 flow, one or more calls came back accepted, and then
it stalled. Discovery and linking are chains of several calls with a
callback between each pair, and the flow reads as broken from the
outside whichever link is missing, so you have to find which one.

## Before you start

- You know which flow you are in: discovery, where whoever is asking
  takes the [HIU](shared.glossary.hiu) role and looks for records at
  your facility, or linking, where you attach a care context to a
  patient's ABHA address. See
  [link a care context](hiecm.flow.m2-link-care-context) for the
  linking sequence.
- You have the `REQUEST-ID` from the call where the chain started. See
  [REQUEST-ID](shared.glossary.request-id): every callback in
  the chain should carry it, so it is what lets you find where the chain
  broke.

## What happens

Map the chain to the callback that should have arrived at each step, and
check each in order from the start:

1. **Discovery request.** Your call to discover a patient produces an
   inbound
   [discovery request callback](hiecm.callback.m2-on-discovery-request)
   to your bridge. If this has not arrived, the problem is upstream of
   your system entirely; escalate rather than continuing down this list.
2. **Link initiation.** Starting a link produces an inbound
   [link init callback](hiecm.callback.m2-on-link-init). If discovery
   completed but this never arrives, the stall is at the handoff into
   linking.
3. **Link confirmation.** The gateway's callback to your registered URL
   confirming the link is the
   [link confirm callback](hiecm.callback.m2-on-link-confirm). See
   [link a care context](hiecm.flow.m2-link-care-context): do not treat
   the synchronous acknowledgement to your link request as success. The
   confirmation is this callback, and the care context only becomes
   visible in the patient's [PHR](shared.glossary.phr) app after it
   arrives.
4. **`REQUEST-ID` reuse.** If you generated the same `REQUEST-ID` for
   more than one call in the chain, or reused one from an earlier
   attempt, responses and callbacks can no longer be told apart.
   Generate a fresh one per call.

For any step above, before assuming it is missing, first rule out a
callback URL problem: [the callback never arrives](callback-never-arrives.md)
covers registration and reachability, which is the more common cause
than the gateway itself failing to send.

## How you know it worked

For linking, the care context appears when the patient's PHR app runs
discovery against your facility, after the link confirm callback
reports success. For discovery, your system answers the inbound
discovery callback with the matching care contexts you hold.

## When it goes wrong

If you have identified which callback in the chain is missing and ruled
out a callback URL problem, escalate on the NHA dev forum. Report which
step of the chain stopped, the `REQUEST-ID` from the call that started
it, the `TIMESTAMP`, and every response and callback body you did
receive up to the point it stalled, so NHA can trace the request on
their side rather than only on yours.

The errors this symptom can surface:
[ABDM-1056](hiecm.error.abdm-1056), the care context is already linked
or the link reference number is invalid; and
[ABDM-2406](hiecm.error.abdm-2406), calls made out of the logical
sequence.
