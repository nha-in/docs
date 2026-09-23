# Care contexts

A Care Context represents a logical grouping of a patient's health records. Each [HMIS](/docs/pr-29/docs/hiecm/v3/getting-started/glossary#hmis)/[LMIS](/docs/pr-29/docs/hiecm/v3/getting-started/glossary#lmis) system should define how patient data is organised into one or more care contexts in a meaningful and consistent way.

A care context serves as the unit that is associated with a patient's [ABHA address](/docs/pr-29/docs/hiecm/v3/getting-started/glossary#abha-address) within the system.

## Key design principles

The [HIE-CM](/docs/pr-29/docs/hiecm/v3/getting-started/glossary#hie-cm) (Health Information Exchange & Consent Manager) is designed to be data-blind.

- This means it does not access or store the actual health record content.
- Instead, it only works with identifiers and metadata related to care contexts.

## Components of a care context

Each care context contains only two pieces of information:

- **Reference ID.** A unique internal identifier assigned by the [HRP](/docs/pr-29/docs/hiecm/v3/getting-started/glossary#hrp) (HMIS/LMIS). Used to link and retrieve the associated health records.
- **Display Name.** A user-friendly description to help identify the group of records. Must not include any sensitive or confidential information such as test results or diagnoses. Example: "OPD records (X-Ray, Prescription) from 3rd March 2023".

## Recommended approach for structuring care contexts

To ensure clarity and usability, it is recommended to organise patient data as follows:

- Create one care context per outpatient visit (OPD)
- Create one care context per inpatient admission (IPD)

This approach provides a clear and event-based grouping of health records.

## JSON structure of care contexts

```json
{  "patient": {    "referenceNumber": "TMH-PUID-001",    "display": "TMH records for Kiran Kumar",    "careContexts": [      {        "referenceNumber": "2375639",        "display": "OPD records for O3 Oct 2022"      }    ]  }}
```

## Next steps

- [Linking](/docs/pr-29/docs/hiecm/v3/concepts/linking), how a care context reaches the patient's ABHA address.
- [M2 Attach](/docs/pr-29/docs/hiecm/v3/milestones/m2), the milestone that links care contexts and shares the records in them.
- [M2 API reference](/docs/pr-29/docs/hiecm/v3/api/m2), the calls that carry a care context.
