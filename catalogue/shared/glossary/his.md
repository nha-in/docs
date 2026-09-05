---
id: shared.glossary.his
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIS, hospital information system
summary: >
  Another name for an HMIS. Also, and unrelatedly, the prefix on every
  HPR and HFR error code, which is the more likely reason you are here.
sources:
  - file: site/docs/hiecm/v3/api/m4/undocumented.md
    status: not-yet-hashed
    note: >
      The M4 call list records 150 error codes prefixed HIS-. NHA does
      not say what the letters stand for there, and this entry does not
      guess.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hmis, shared.glossary.ims, shared.glossary.m4]
---

# HIS, hospital information system

## In plain words

Two different things wear these three letters, and only one of them is a
kind of software.

**As a system.** Hospital Information System, another name for an
[HMIS](hmis.md) or [HIMS](hims.md). Read [HMIS](hmis.md); it is the same
software and the same ABDM position.

**As an error code prefix.** Every error the HPR and HFR return is
prefixed `HIS-`, and there are 150 of them: `HIS-401`, `HIS-1128`,
`HIS-2022` and so on. NHA does not publish what the letters expand to in
that context, so do not read `HIS-1128` as a message about a hospital
information system. It is an [M4](m4.md) registry error. See
[the HPR and HFR call list](/docs/hiecm/v3/api/m4/undocumented).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when a code beginning `HIS-` sends you to the
M4 registry errors rather than to your hospital system's vendor.

## When it goes wrong

Reading the prefix as a component name and looking for the failure in
the wrong system. The prefix names the registry that answered, not the
software that asked.
