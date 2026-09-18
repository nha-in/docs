---
id: hiecm.concept.linking-triggers-self-fetch
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Linking triggers the patient's app to fetch the record at once
summary: >
  Within about ten seconds of a successful link and notify, the
  patient's PHR app raises a self requested consent and asks for the
  data. A HIP must be able to serve a record the moment it links it.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 3.5. Observed by an integrator on 2026-09-16, not yet run
      from this repository.
related:
  callbacks:
    - hiecm.callback.m2-on-context-notify-result
    - hiecm.callback.m3-on-consent-request-notify-hip
    - hiecm.callback.m2-on-health-information-request
  endpoints:
    - hiecm.endpoint.m2-hip-link-care-context
    - hiecm.endpoint.m2-hip-health-information-on-request
    - hiecm.endpoint.m2-hip-data-flow-notify
  flows:
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.context-notify-timing
    - hiecm.concept.consent-artefact
  glossary:
    - shared.glossary.purpose-of-use
skills:
  - hiecm-m2-build
---

# Linking triggers the patient's app to fetch the record at once

## In plain words

Linking is not the end of the HIP's work for a visit. It is the start of
a data flow you did not initiate. When the context notify is
acknowledged, the patient's [PHR](shared.glossary.phr) app raises a
consent on the patient's own behalf and pulls the newly linked record.
Your bridge sees the whole M2 data flow within seconds, without any HIU
being involved.

## Before you start

- The linking flow, end to end. See [link a care context](hiecm.flow.m2-link-care-context).
- What a consent artefact carries. See [the consent artefact](hiecm.concept.consent-artefact).

## What happens

```mermaid
sequenceDiagram
  participant HIP as Your facility (HIP)
  participant GW as HIE-CM gateway
  participant PHR as Patient's PHR app
  HIP->>GW: context notify
  GW->>HIP: on-notify, SUCCESS
  PHR->>GW: self requested consent, purpose PATRQT
  GW->>HIP: /api/v3/consent/request/hip/notify
  GW->>HIP: /api/v3/hip/health-information/request
  HIP->>GW: on-request
  HIP->>PHR: encrypted record to dataPushUrl
  HIP->>GW: data flow notify, TRANSFERRED
```

Within about five to ten seconds of the notify acknowledgement, two
callbacks land on your bridge in order:

1. [The consent notification](hiecm.callback.m3-on-consent-request-notify-hip)
   with `purpose.code` of `PATRQT`, "Self Requested", naming the care
   context you linked a moment ago.
2. [The health information request](hiecm.callback.m2-on-health-information-request)
   for that consent, carrying a `dataPushUrl` and key material.

You acknowledge the request, encrypt the record and push it, then send
the [data flow notify](hiecm.endpoint.m2-hip-data-flow-notify). This is
the ordinary M2 data flow. The only difference is when it happens.

So the record for a care context must be ready to serve, as a valid
[FHIR](shared.glossary.fhir) bundle, before you link that care
context. Linking a reference and building the document later means the
first fetch fails.

## How you know it worked

You have understood this when you can answer both of these.

1. You linked a care context at 10:00:00 and a health information request
   for it arrived at 10:00:08 with no HIU in your test. Who asked?
2. Your system links references at check in and generates the document
   at discharge. What happens at check in?

## When it goes wrong

The record is not yet built when the request arrives. The push fails or
carries an empty bundle, and the patient's app shows a broken record.

The consent notification handler expects a HIU's purpose code and
rejects `PATRQT`.

The HIP treats the unexpected request as an attack and drops it. The
signature verifies; it is the patient.
