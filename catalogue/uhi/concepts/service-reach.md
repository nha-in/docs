---
id: uhi.concept.service-reach
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: How far each UHI service goes, and who answers its search
summary: Physical Consultation covers all four stages, Ambulance Booking reaches
  a quote, and the other services stop at discovery.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/index.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/index.mdx#how-far-each-service-goes. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.dofp-stages
  decisions:
    - uhi.decision.choose-role
    - uhi.decision.first-service
---

# How far each UHI service goes, and who answers its search

## In plain words

Some services stop at discovery: the patient finds what they need, then calls
ahead or visits. Physical Consultation goes all the way.

| Service | Discovery | Order | Fulfilment | Post-fulfilment | Who answers the search |
| --- | --- | --- | --- | --- | --- |
| [Physical Consultation](/docs/uhi/v1/services/consultation) | Yes | Yes | Yes | Yes | Any registered provider platform |
| [Ambulance Booking](/docs/uhi/v1/services/ambulance) | Yes | A quote, in Phase 1 | Phase 2 | Phase 2 | Any registered ambulance platform |
| [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem) | Yes | No | No | No | NHA |
| [Blood Bank](/docs/uhi/v1/services/blood-bank) | Yes | No | No | No | e-RaktKosh, and any approved blood bank system |
| [Jan Aushadhi](/docs/uhi/v1/services/jan-aushadhi) | Yes | No | No | No | PMBI |
| [NOTTO](/docs/uhi/v1/services/notto) | Yes | No | No | No | NOTTO |

A discovery-only service still does real work. PM-JAY HEM, for example, shows
which hospitals are empanelled today and the PM-JAY contact at each one, so the
patient knows where to go and whom to call.

The technical identity of each service is on its [service page](/docs/uhi/v1/services).
