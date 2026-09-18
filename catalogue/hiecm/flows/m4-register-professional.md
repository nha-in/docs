---
id: hiecm.flow.m4-register-professional
type: flow
gateway: hiecm
milestone: M4
version: abdm-v3
title: Register a professional's profile on the HPR
summary: >
  Turn a bare identity number into a registered professional by adding
  qualifications, council registration and current work, then uploading
  the certificates that prove them.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m4.yaml
    fetched: 2026-09-04
    hash: sha256:626bfe09e359114b32b6cc5552223527a6e997a30687a5370a717ef49dd6cde4
    note: >
      NHA's M4 file as ingested on this branch. The register professional
      call has no published method or path yet.
  - file: site/docs/hiecm/v3/api/m4/undocumented.md
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The M4 operations and fields page. The mandatory documents, the
      degree codes and the master data rule come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/HPR-Test-Cases-Final.xlsx
    fetched: 2026-09-04
    hash: sha256:257abae73f4c07d5d5145047fa34f63a792783de52dedfc8dd3f5892c52a4eea
    note: >
      NHA's HPR test case sheet, 60 cases from HPR-002 to HPR-080. It
      names the sandbox paths several of these calls use, which no
      specification in the catalogue had.
related:
  endpoints:
    - hiecm.endpoint.m4-hpr-register-professional
    - hiecm.endpoint.m4-hpr-fetch-professional-info
    - hiecm.endpoint.m4-hpr-fetch-documents-list
    - hiecm.endpoint.m4-hpr-upload-document
  flows:
    - hiecm.flow.m4-create-hpid
    - hiecm.flow.m4-onboard-facility
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.his-5005
    - hiecm.error.his-5011
  glossary:
    - shared.glossary.hpr
    - shared.glossary.hpid
    - shared.glossary.nhpr
skills:
  - hiecm-m4-build
---

## In plain words

An [HPID](shared.glossary.hpid) says who a professional is. It
does not say what they are qualified to do. Registering the professional
adds the qualifications, the council registration and the current place
of work, and attaches the certificates that back them.

Only after this does the [HPR](shared.glossary.hpr) hold a
profile rather than an identity.

## Before you start

Four things must already be true, each checkable:

- The professional holds an HPID. See
  [get an HPID](m4-create-hpid.md).
- You hold the `hprToken` that create HPID returned. This call carries it
  in the payload, not only in a header.
- You hold a gateway session token. See
  [the gateway session](hiecm.concept.gateway-session).
- You have fetched the code lists this call needs. Council, course,
  college, university, state, district and language all go in as codes.
  The call takes codes, not names, and the subcategory codes here are
  not the ones create HPID used.

## What happens

```mermaid
sequenceDiagram
    participant S as Your system
    participant H as HPR service
    Note over S: Holds the access token and the hprToken
    S->>H: Fetch master data: councils, courses, colleges, universities, languages
    H-->>S: Code lists
    S->>H: Register professional, with the hprToken in the payload
    H-->>S: Registration result
    S->>H: Retrieve the professional document list
    H-->>S: Document ids to upload against
    loop One call per document
        S->>H: Upload a document
        H-->>S: Upload result
    end
```

1. **Fetch the master data first.** Every code you are about to send has
   a list behind it. Fetching them is cheaper than a rejected
   registration, and the lists change without notice.
2. **Register the professional.** The `hprToken` goes in the payload.
   Qualifications, council registration and current work go with it.
3. **Retrieve the document list.** It tells you which document ids this
   professional must upload against.
4. **Upload each document, one call per document.** Two are always
   mandatory: the degree certificate and the registration certificate. A
   proof of work certificate is mandatory as well when the professional
   works for government, or for both government and private.

NHA's HPR test case sheet names the sandbox paths for this journey, all
on the host `https://doctorsbx.abdm.gov.in`:

| Call | Path |
|---|---|
| Register professional | `/apis/v1/doctors/register-professional-new` |
| Fetch the professional's details | `/apis/v1/doctors/fetch-professional-info` |
| Update the professional | `/apis/v1/doctors/update-professional` |
| Fetch the document list | `/apis/v1/doctors/fetch-documents-list` |
| Upload one document | `/apis/v1/uploads/upload-document` |

The master data calls have no published path. None of the five above has
been called from this repository.

## How you know it worked

The register professional call returns a success result for the HPID you
sent, and the document list call then returns the ids that professional
must upload against. After the uploads, retrieving the professional's
profile shows the qualification and council registration you sent rather
than an empty profile.

A registration with its mandatory documents missing is not finished, even
where the registration call itself was accepted.

## When it goes wrong

The failures the M4 sources document, each with its fix in the linked
error atom:

- [HIS-5005](hiecm.error.his-5005) when this professional is already
  registered, which is a state to read rather than an error to retry.
- [HIS-5011](hiecm.error.his-5011) when the `hprToken` has expired
  between creating the HPID and registering the profile.
- A code that is not on the current master list, which reads as a
  validation failure on a field you believed was correct. Refetch the
  list rather than trusting a value you cached.
