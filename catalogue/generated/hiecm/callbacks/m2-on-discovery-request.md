---
id: hiecm.callback.m2-on-discovery-request
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: A discovery request for a patient you may hold records for
summary: ABDM asks the HIP to find a patient's unlinked care contexts from their
  name, gender, year of birth and identifiers.
generated: true
operation: m2_post_v3_hip_patient_care_context_discover
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_patient_care_context_discover.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_patient_care_context_discover.mdx#m2-on-discovery-request.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# A discovery request for a patient you may hold records for

## In plain words

When a patient searches for their records, ABDM posts a discovery request to your [HIP](/docs/hiecm/v3/getting-started/glossary#hip) bridge at `/api/v3/hip/patient/care-context/discover`. It carries the patient's name, gender, year of birth, and verified and unverified identifiers. Search your records with them. Then answer through [on-discover](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-user-initiated-linking-hip/01-m2-post-user-initiated-linking-v3-patient-care-context-on-8c9340) with the unlinked care contexts you found.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers, and expects 202 Accepted. Keep `transactionId`: every later step of this linking flow carries it.

## When it goes wrong

A repeated discovery request is the `ABDM-1103` case, Duplicate Discovery request. Answer each discovery once.
