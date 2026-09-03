---
title: Insurer
sidebar_label: Insurer
sidebar_position: 6
description: An insurer reads records as an HIU under consent, and settles claims on NHCX, a separate gateway with its own onboarding.
verification: unverified
source: catalogue/shared/glossary/hiu.md, site/docs/hiecm/v3/concepts/consent.md, site/docs/hiecm/v3/concepts/data-flow.md, site/docs/nhcx/v1/index.md, site/docs/hiecm/v3/milestones/index.mdx
---

# Insurer

You sit on two gateways, and they share no API surface. Clinical records move on
the [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm). Claims move on
[NHCX](/docs/hiecm/v3/getting-started/glossary#nhcx).

## Who you are in ABDM

On the HIE-CM you are an
[HIU](/docs/hiecm/v3/getting-started/glossary#hiu), a health information user.
That is a direction, not a category of company: you act as an HIU whenever you
ask to read records you did not create.

On NHCX you are a payer, which covers an insurer or a third party administrator
acting for one. You onboard as a participant, in sandbox first and then in
production.

Two gaps to know about before you plan.

- Which registry issues an insurer an identifier for the HIE-CM is not
  documented here. The [HFR](/docs/hiecm/v3/getting-started/glossary#hfr) lists
  hospitals, clinics, laboratories, imaging centres, pharmacies and blood banks,
  and does not name insurers. [M4](/docs/hiecm/v3/api/m4) is marked as required
  for an HIU, so raise this at onboarding rather than assuming an answer.
- No NHCX endpoint is documented here yet. Take the claim specification from
  the NHCX documentation.

## What you can do

On the HIE-CM you build [M1](/docs/hiecm/v3/api/m1) for identity and
[M3](/docs/hiecm/v3/api/m3) for consent and fetching.

- Raise a consent request naming the patient's
  [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) address, the purpose, the
  record types and the date range.
- Use the purpose code `HPAYMT`, Healthcare Payment, where payment is the reason
  you are asking. The patient reads that code.
- Wait. The patient decides, and may narrow the request before granting it, so
  read the artefact rather than assuming you got what you asked for.
- Fetch under the granted artefact and decrypt.
- Handle revocation. A consent that was live when you sent the request can be
  dead when the record holder validates it.

## Why it is worth it

You receive structured records from the system that created them, as
[FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundles, instead of scans
collected from the member. The permission behind each one is explicit, scoped
and time boxed, and both sides report the transfer.

What this does not give you is claim settlement. That is NHCX work, and a
separate integration.

## Next

[Consent](/docs/hiecm/v3/concepts/consent) covers what you may ask for, and
[NHCX](/docs/nhcx/v1) covers the claims gateway.
