---
id: uhi.test.consultation-go-live-checklist
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Physical Consultation go-live checklist
summary: The twenty items to complete before requesting production sign-off for
  Physical Consultation, from M2 and signing to promotion.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/consultation.mdx#go-live-checklist. Edit the
      page, never this file.
related:
  flows:
    - uhi.flow.consultation-discovery
    - uhi.flow.consultation-order
    - uhi.flow.consultation-fulfilment
  tests:
    - uhi.test.run-test-cases
    - uhi.test.every-service-checks
---

# Physical Consultation go-live checklist

## In plain words

Work through this list before you request sign-off for production.

| # | Item |
| --- | --- |
| 1 | [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) M2 milestone with HIE-CM completed |
| 2 | Ed25519 key pair generated with the header generator utility; public key submitted |
| 3 | Sandbox onboarding form completed |
| 4 | Sandbox access received and environment configured |
| 5 | HTTPS `consumer_uri` callback URL live and reachable |
| 6 | Direct EUA endpoints `/on_init`, `/on_confirm`, `/on_status` and `/on_update` exposed and exercised |
| 7 | Request signing implemented: Ed25519 and BLAKE-512 |
| 8 | Discovery run for every filter type: doctor name, GPS, state and district, city, pincode |
| 9 | Booking run: `init`, `on_init`, `confirm`, `on_confirm` |
| 10 | PIN received in `on_confirm` and shown to the user correctly |
| 11 | Status run: `status`, `on_status` |
| 12 | `on_update` handled for `APPOINTMENT_STARTED`, `COMPLETED` and `CANCELLED` |
| 13 | `DOCTOR_NO_SHOW` sent from the EUA |
| 14 | Edge cases handled: empty `on_search`, slot unavailable, cancellation terms |
| 15 | Terms shown before `confirm`; confirmed only with every term `AGREED` |
| 16 | Caching policy in place: TTL compliance, a parallel live search, 48 hours at most |
| 17 | All test cases passed in sandbox |
| 18 | Sign-off requested with sandbox evidence |
| 19 | Production `consumer_uri` and direct endpoints updated |
| 20 | Integration promoted to the production UHI network |
