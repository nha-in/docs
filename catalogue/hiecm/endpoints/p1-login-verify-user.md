---
id: hiecm.endpoint.p1-login-verify-user
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Say which address is signing in
summary: >
  Resolves a sign in to one health address when the credential carries several.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.25. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p1-login]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Say which address is signing in

## In plain words

One mobile number can hold several addresses. This is the call that says which of them the person is signing in as.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A verified login transaction, and the address the person chose.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/verify/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "abhaAddress":"johndoe@abdm", "txnId":"*{{transactionId}}*" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.25. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries the session for the address chosen, not for the number.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
