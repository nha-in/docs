---
id: shared.glossary.x-cm-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: X-CM-ID
summary: >
  The header naming which consent manager you are talking to, sbx on
  the sandbox and abdm in production.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2403]
---

# X-CM-ID

## In plain words

`X-CM-ID` names which consent manager a call is addressed to. On the
sandbox it is `sbx`. In production it is `abdm`.

The value is not an environment name that happens to look like a suffix.
It is the suffix. Take an ABHA address, drop everything up to and
including the `@`, and what remains is the value of this header. NHA
says exactly that: get it from the HIE-CM domain name after the `@` in
the address. The architecture allows for several consent managers, each
with its own domain, and this header is how a call reaches the right one.
Today NHA runs one, which is why the header looks like an environment
switch.

It is a header, not part of the URL, so it is easy to leave pointing at
the wrong consent manager while the host is right.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what X-CM-ID is without using the acronym itself.

## When it goes wrong

Sending the sandbox value against the production host, or the reverse. NHA has a dedicated error code for an invalid value here, which tells you how often it happens.

