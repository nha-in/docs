---
id: hiecm.flow.m4-register-professional
type: flow
gateway: hiecm
milestone: M4
version: abdm-v3
title: Register a professional's profile on the HPR
summary: Turn a bare identity number into a registered professional by adding
  qualifications, council registration and current work, then uploading the
  certificates that prove them.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m4.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/milestones/m4.mdx#m4-register-professional. Edit the
      page, never this file.
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
  glossary:
    - shared.glossary.hpr
    - shared.glossary.hpid
---

# Register a professional's profile on the HPR

## In plain words

The HP-ID is an identity, not a professional profile. The professional profile is created through the registration process, which captures details such as qualifications, council registration, and current work information. Professional registration requires the HPR Token returned from Journey 1.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HPR service
    Note over S: Holds the HPR token from Journey 1
    S->>H: GET /apis/v1/masters/medical-councils, courses,<br/>colleges, universites, states, district, languages
    H-->>S: Code lists
    S->>H: POST /apis/v1/doctors/register-professional-new<br/>hprToken, practitioner {healthProfessionalType,<br/>officialMobile, officialEmail, personal,<br/>qualification,
    H-->>S: hprId, referenceNumber, status
    S->>H: POST /apis/v1/doctors/fetch-documents-list<br/>hprid
    H-->>S: documentList {profileDetails, qualificationDetails,<br/>registrationDetails}
    S->>H: POST /apis/v1/uploads/upload-document<br/>hpr_token, document [document_id, document_type,<br/>fileType, data]
    H-->>S: degreeCertificate, registrationCertificate,<br/>proofOfWorkCertificate {status, msg}
    S->>H: POST /apis/v1/doctors/fetch-professional-info<br/>practitioner {id}
    H-->>S: practitioners [identifier, registrations,<br/>qualifications, hpr_id]
```

The following documents are mandatory for upload: the qualification degree certificate, and the registration certificate. A proof of work certificate is mandatory for professionals working in government, or in both government and private settings.

The registration API requires codes rather than names. Therefore, the application must first fetch the relevant master data through the respective master APIs and use the corresponding codes during registration. Master data includes council, course, college, university, state, district and language.

## Before you start

The professional holds an HP-ID from Journey 1, you hold the `hprToken`, and you hold a gateway session token.

## What happens

Fetch the master lists first and send codes, never names. Call `/apis/v1/doctors/register-professional-new` with the `hprToken` in the payload. Fetch the document list, then upload one document per call to `/apis/v1/uploads/upload-document`. Corrections later go to `/apis/v1/doctors/update-professional-new`.

## How you know it worked

Registration returns the `hprId` and a status, the uploads report each certificate's status, and `/apis/v1/doctors/fetch-professional-info` shows the qualification and registration you sent. A registration with a mandatory document missing is not finished, even though the register call was accepted.

## When it goes wrong

A code that is not on the current master list reads as a validation failure on a field you believed was right: fetch the list again rather than trusting a cached value. A professional who is already registered is a state to read, not an error to retry.
