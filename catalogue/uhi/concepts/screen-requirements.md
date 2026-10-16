---
id: uhi.concept.screen-requirements
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: What UHI app screens must do
summary: Screen rules checked at sign-off, from branding and disclaimers to
  showing terms before confirm and keeping the PIN out of storage.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/build-it-well.mdx#what-the-screens-must-do.
      Edit the page, never this file.
related:
  tests:
    - uhi.test.every-service-checks
    - uhi.test.consultation-go-live-checklist
  concepts:
    - uhi.concept.pmjay-hem-limits
    - uhi.concept.blood-bank-limits
---

# What UHI app screens must do

## In plain words

The service pages carry each service's own rules. The rules below are checked
at sign-off or required of every app.

| Rule | Service |
| --- | --- |
| Reach the feature within 3 taps, under a health or insurance category | [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem#concepts-explored) |
| Show "Powered by UHI" with PM-JAY and [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) branding | PM-JAY HEM |
| Show a fallback message on empty results | PM-JAY HEM |
| Display "Please confirm the hospital location by calling ahead, as details may change." | PM-JAY HEM |
| Show the phone number and a "call to confirm" disclaimer, because counts are indicative | [Blood Bank](/docs/uhi/v1/services/blood-bank) |
| Show the terms from `on_init` before enabling any confirm action | [Physical Consultation](/docs/uhi/v1/services/consultation), [Ambulance Booking](/docs/uhi/v1/services/ambulance) |
| Keep the 4-digit PIN in memory only, never in a database or a log | Physical Consultation |
| Show no driver or vehicle details in Phase 1 | Ambulance Booking |
| Show the transplant coordinator's phone first | [NOTTO](/docs/uhi/v1/services/notto) |
| Scope the screen to discovery. Do not build booking where the service has none | PM-JAY HEM, Blood Bank, Jan Aushadhi, NOTTO |
