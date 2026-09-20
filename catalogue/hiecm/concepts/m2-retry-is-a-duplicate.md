---
id: hiecm.concept.m2-retry-is-a-duplicate
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
order: 3
title: A refused request is still remembered, so a retry is a duplicate
summary: >
  ABDM records a link token request even when it refuses it, so retrying inside
  the window is refused as a duplicate and no longer names the original cause.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      The same generate-token request for the same unknown ABHA address was
      sent twice. At 14:17:42 it returned 400 ABDM-9999 user not found. At
      14:18:51, 69 seconds later, it returned 400 ABDM-1092 duplicate link
      token request.
related:
  concepts:
    - hiecm.concept.m2-exchange-not-call
    - hiecm.concept.m2-never-block-the-desk
---

# A refused request is still remembered, so a retry is a duplicate

## In plain words

ABDM records a link token request even when it refuses the patient, and
deduplicates the next identical request against the one it refused. So a retry
inside that window cannot succeed, and its refusal no longer names the original
cause.

The second message says duplicate, which reads as though the first attempt had
worked. It had not.

## Before you start

- Exchanges you can look back through, from
  [the unit of work is an exchange](m2-exchange-not-call.md), because the
  original refusal is the one carrying the real cause.

## What happens

The same request for the same unknown address, sent twice:

| When | Result |
|---|---|
| 14:17:42 | `400`, `ABDM-9999`, user not found |
| 14:18:51, 69 seconds later | `400`, `ABDM-1092`, duplicate link token request |

The length of the deduplication window is not published. It is at least sixty
nine seconds.

So do not offer a button that cannot work. Where a duplicate is the answer,
explain it, and say that the earlier refusal is the one that names the cause.
Point the reader back at the first exchange rather than at the second.

This is the reason the first refusal has to be kept rather than replaced. An
interface that overwrites the last error with the newest one destroys the only
message that explained anything.

## How you know it worked

Send a request that is refused, then send it again inside the window. The
interface shows `ABDM-1092`, does not present it as a new failure, and links
back to the first exchange and its `ABDM-9999`.

The retry control is absent or disabled while the window is open, rather than
present and failing.

## When it goes wrong

- A retry loop runs and every attempt after the first says duplicate. Nothing is
  checking whether a retry can succeed.
- The cause of a failure cannot be found because the newest message replaced it.
  Keep every exchange, and treat the first refusal as the authoritative one.
- A duplicate refusal is read as evidence that the first request succeeded.
  It is not. The first was refused, and ABDM remembered the refusal.
