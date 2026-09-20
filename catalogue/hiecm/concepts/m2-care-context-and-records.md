---
id: hiecm.concept.m2-care-context-and-records
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: A care context and its records are one thing
summary: >
  A bundle with no care context cannot be sent, and a care context with nothing
  behind it is a promise the next discovery cannot keep.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      Taken from a working desk that generated bundles and linked care contexts
      against the sandbox. No bundle has been served to a receiver, because no
      consent has been served.
related:
  concepts:
    - hiecm.concept.m2-inbound-is-a-surface
    - hiecm.concept.m2-exchange-not-call
---

# A care context and its records are one thing

## In plain words

A care context is the visit. The records are what happened at it. Neither is
useful alone.

A bundle nobody can name a care context for cannot be sent. A care context with
nothing behind it is a promise the next discovery cannot keep: another facility
finds the visit, asks for the records, and there are none.

So store them together and show them together.

## Before you start

- A patient whose ABHA is linked, so a care context has somewhere to attach.
- A structural check you can run before storing, because a bundle that fails
  validation locally fails remotely, asynchronously, with nobody watching.

## What happens

Show the counts that matter to a patient rather than the ones that are easy to
compute: visits opened, documents attached, and visits not yet findable
elsewhere. The third is the one worth surfacing, because it means a record
exists that no other facility can reach.

Validate before storing, not before sending. Refusing to store a bundle the
receiver could not read is cheap. Discovering it after a consent has been served
is not.

Let the desk inspect a bundle before it goes: the profile it claims, the
resources inside it, the attachment type, and whether every reference resolves
within the bundle. The upload itself wants a drop target, a title prefilled from
the filename but editable, and named refusals for type and for size. Show a hash
and a size so a file is identifiable in a list without keeping a second copy of
it.

Write the title for the patient. They read it in their own application months
later, not the receptionist filing it today.

Never log the attachment. It is a patient's record, and it belongs in the bundle
and in the encrypted payload built from it, nowhere else.

## How you know it worked

Open a visit and attach nothing. The interface counts it as a visit not yet
findable elsewhere, rather than as a completed link.

Attach a document and the same count falls by one.

Try to store a bundle whose references do not resolve inside it. Storing is
refused, and the refusal names the reference that pointed outward.

## When it goes wrong

- Another facility discovers a visit and receives nothing. A care context was
  linked with no records behind it.
- A bundle is refused at the far end, asynchronously, with no explanation
  reaching the desk. It was validated before sending rather than before storing.
- A list of visits becomes slow to open. Bundles are being held in the list
  rather than stored separately and read when needed.
