---
id: hiecm.concept.m3-plural-artefacts-and-codes
type: concept
gateway: hiecm
milestone: M3
version: abdm-v3
order: 1
router: >
  One consent request can produce more than one artefact, so store the
  request id and every artefact id. Taking the first element is the bug
  that silently drops half a fetch.
title: Read plural as plural, and never translate a code into a meaning
summary: >
  A consent request produces more than one artefact, and the same error code
  means different things in different modules, so carry ABDM's own message.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      Consent status and fetch both returned 202 with a zero length body while
      the specification documents them as synchronous 200s carrying a status
      and an artefact array. The ids used did not exist, which weakens it.
  - url: https://sandbox.abdm.gov.in/
    status: documented-2026-09-16
    note: >
      ABDM-1112 appears as an unusable consent in one place and as a DigiLocker
      gender mismatch in a module error table. ABDM-1062 appears as a withheld
      consent in one and a link token mismatch in another.
related:
  concepts:
    - hiecm.concept.m3-refuse-to-guess
    - hiecm.concept.m2-exchange-not-call
---

# Read plural as plural, and never translate a code into a meaning

## In plain words

Two habits cause most of the avoidable failures on the consent side, and both
are about reading what came back rather than what you expected.

A consent request produces more than one artefact. Taking the first element is
the bug that silently drops half a fetch.

And the same error code means different things in different modules, so a code
alone is not a meaning.

## Before you start

- A consent request you have raised, and somewhere to keep its artefacts.
- Exchanges keyed by request id, from
  [the unit of work is an exchange](m2-exchange-not-call.md), because these
  calls answer twice like the linking ones.

## What happens

Hold the collection. A length of one is a case, not the normal case. It is worth
having a function whose existence prevents any call site from reaching for the
first element, because the failure is silent: half the records simply never
arrive, and nothing reports an error.

Carry ABDM's message through to the screen and never translate a code into words
of your own. `ABDM-1112` is an unusable consent in one place and a DigiLocker
gender mismatch in a module error table. `ABDM-1062` is a withheld consent in
one and a link token mismatch in another. Whichever you choose to display, you
will be wrong for the other module, and the message ABDM sent is the only part
that names the actual cause.

Expect these calls to be asynchronous. Consent status and consent fetch both
return `202` with an empty body, while the specification documents them as
synchronous responses carrying a status and an artefact array. Treat the
acknowledgement as an acknowledgement. This was observed against ids that do not
exist, so it is weaker evidence than a run against a real consent would be, and
it is worth confirming on your own data before building on it.

## How you know it worked

Raise a consent covering more than one care context. The number of artefacts you
hold matches the number ABDM returned, and a fetch runs for each one.

Trigger a refusal. The screen shows ABDM's own message text alongside the code,
and no wording of your own has replaced it.

## When it goes wrong

- A fetch returns fewer records than the consent covers, and nothing errors.
  Something took the first artefact and discarded the rest.
- A displayed explanation contradicts what ABDM sent. A code was translated
  locally instead of the message being carried through.
- A `202` with an empty body is read as a failure. It is an acknowledgement, and
  the answer arrives on the callback.
