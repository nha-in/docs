---
id: hiecm.concept.care-context
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Care contexts, how records are grouped so they can be found
summary: A care context is the unit a provider links to a patient's ABHA
  address, carrying a reference number and a display name and nothing clinical.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/care-context.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/concepts/care-context.mdx#care-context.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.roles
---

# Care contexts, how records are grouped so they can be found

## In plain words

Each care context contains only two pieces of information:

- **Reference ID.** A unique internal identifier assigned by the
  [HRP](/docs/hiecm/v3/getting-started/glossary#hrp) (HMIS/LMIS). Used to link
  and retrieve the associated health records.
- **Display Name.** A user-friendly description to help identify the group of
  records. Must not include any sensitive or confidential information such as
  test results or diagnoses. Example: "OPD records (X-Ray, Prescription) from
  3rd March 2023".

### Recommended approach for structuring care contexts

To ensure clarity and usability, it is recommended to organise patient data as
follows:

- Create one care context per outpatient visit (OPD)
- Create one care context per inpatient admission (IPD)

This approach provides a clear and event-based grouping of health records.

### JSON structure of care contexts

```json
{
  "patient": {
    "referenceNumber": "TMH-PUID-001",
    "display": "TMH records for Kiran Kumar",
    "careContexts": [
      {
        "referenceNumber": "2375639",
        "display": "OPD records for 03 Oct 2022"
      }
    ]
  }
}
```

## Before you start

Your system acts as the HIP for the records it groups, and the facility holds a facility ID. Linking is how a care context reaches the patient: see [linking](/docs/hiecm/v3/concepts/linking).

## What happens

Give each care context a `referenceNumber` your own system resolves to the records behind it, and a `display` a person recognises months later. Group by encounter: one per outpatient visit, one per inpatient admission, not one per test or document.

## How you know it worked

Three tests in one visit are one care context. A display name reads like "OPD records for 03 Oct 2022" and carries no diagnosis or result.

## When it goes wrong

A diagnosis or result in `display` leaks clinical information into a system built never to hold it, visible to anyone who can list the patient's care contexts. One care context per record produces a list no person can navigate.
