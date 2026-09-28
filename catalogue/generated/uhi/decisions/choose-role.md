---
id: uhi.decision.choose-role
type: decision
gateway: uhi
milestone: n/a
version: uhi-v1
title: Choosing your UHI role, EUA or HSPA
summary: Build an EUA for a patient-facing app or an HSPA for a provider system;
  HSPA is open only for Physical Consultation, Blood Bank and Ambulance.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/index.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/index.mdx#choose-your-role. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.participants
    - uhi.concept.service-reach
  decisions:
    - uhi.decision.first-service
  glossary:
    - shared.glossary.eua
    - shared.glossary.hspa
---

# Choosing your UHI role, EUA or HSPA

## In plain words

| If you | You are | You build |
| --- | --- | --- |
| Build a patient-facing app | An EUA | The search, your callback endpoints, and the screens that render results |
| Run a provider system that answers searches | An HSPA | A `search` endpoint that answers from your own registry, and the booking calls your service supports |

You can be an HSPA only for Physical Consultation, Blood Bank Discovery and
Ambulance Booking. For the other three, the HSPA already exists and you build
only the EUA.

An EUA must complete [Milestone 2](/docs/hiecm/v3/milestones/m2) on
[HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) before it can be
onboarded onto any UHI service.
