---
id: shared.glossary.snomed-ct
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: SNOMED CT, and the licence you need in India
summary: >
  The clinical terminology ABDM codes records with. It is free to use in
  India and it still requires a licence, which is the question NHA is
  asked most often about it.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/faq
    status: docs-only
    note: >
      NHA's sandbox FAQ carries eleven questions on SNOMED CT,
      terminology licensing and code distribution.
  - url: https://www.nrces.in/standards/snomed-ct
    status: docs-only
    note: NRCeS's SNOMED CT resource page, which NHA points integrators at.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.fhir, shared.glossary.hi-type, shared.glossary.nrces]
---

# SNOMED CT, and the licence you need in India

## In plain words

SNOMED CT is the clinical terminology ABDM uses to say what a record
means. FHIR gives the record its shape, and SNOMED CT gives its content a
code, which is why the two turn up together in every conversation about
bundles.

## Before you start

You need to know that ABDM records are FHIR bundles, because SNOMED CT
codes sit inside them rather than alongside them.

## What happens

The licence question has an answer that sounds like a contradiction and
is not. NHA states both halves plainly:

> "Yes, an Affiliate License is required for use of SNOMED CT in India.
> The Ministry of Health and Family Welfare (MoH&FW), Government of India
> has made SNOMED CT freely available for all use within India."

So it costs nothing and you still have to hold a licence. NHA is asked
this twice in its own FAQ, in both directions, and answers the same way:
SNOMED CT is the intellectual property of SNOMED International, and the
Affiliate License Agreement carries terms that apply whether or not money
changes hands.

Where things live:

| What | Where |
|---|---|
| The licence | Member Licensing and Distribution Service, mlds.ihtsdotools.org |
| Release files | The same service, once the licence is approved |
| India extensions | NRCeS national releases, nrces.in/services/national-releases |
| Common Drug Codes for India, CDCI | The same NRCeS national releases page |
| Browsing content | browser.ihtsdotools.org, or C-DAC's CSNOFinder |
| Integration tooling | C-DAC's SNOMED CT Toolkit, CSNOtk |

Two answers worth carrying, because they come up in design rather than
in setup. Mapping ICD to SNOMED CT is one to many, and the SNOMED CT to
ICD-10 map refset shipped with the International Edition is what resolves
it. And SNOMED CT gives a drug's dosage form and route but not its daily
dose limit or frequency: NHA's position is that those are decision
support, to be built in the application on top of the attributes SNOMED
CT does define.

## How you know it worked

You hold an Affiliate License, you can download the release files, and
you know which codes came from the International Edition and which from
the India extension.

## When it goes wrong

Reading "free in India" as "no licence needed" and skipping the
registration. That is the single most common misreading, and NHA answers
it as a separate FAQ entry precisely because it keeps happening.

Expecting SNOMED CT to carry prescribing intelligence. It carries the
attributes; the advice is yours to build.
