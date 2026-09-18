---
id: nhcx.decision.eligibility-purpose
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Which coverage eligibility purpose to send
summary: >-
  Confirm the policy when the patient arrives, then ask what each planned treatment
  needs before you request approval for it.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 7.3 and 7.4.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.3; page 32 functional points.
- url: https://hcxsbx.abdm.gov.in/images/13093b5f9b88fe826123.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Insurance Plan IG.docx
  hash: sha256:e9c6c82b6d67fd8476d6d19a5961419beb04e3c0613533453ed1e16e2a569cc1
  fetched: '2026-09-14'
  note: Insurance Plan IG, row 25 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. CoverageEligibility tables.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 24 Unspecified Procedure, Q5.
related:
  concepts:
  - nhcx.concept.coverage-eligibility-purposes
  flows:
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.preauth-query-response
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.participant-get-policies
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  errors:
  - nhcx.error.payr-1032
  - nhcx.error.payr-1033
  - nhcx.error.payr-1101
  glossary:
  - nhcx.glossary.coverage-eligibility
---

# Which coverage eligibility purpose to send

## In plain words

A [coverage eligibility](../glossary/coverage-eligibility.md) check asks the payer about a patient's policy over [NHCX](../../shared/glossary/nhcx.md). The `purpose` element of the `CoverageEligibilityRequest` says what you are asking. Four values exist: `discovery`, `validation`, `benefits` and `auth-requirements`.

Send `validation` at registration or admission. Send `auth-requirements` before every preauthorisation and whenever a treatment is added.

## Before you start

- You know the patient's payer and policy. Get them from [`POST /participant/get/policies`](../endpoints/participant-get-policies.md).
- You can send a sealed eligibility request. See [check coverage eligibility](../flows/coverage-eligibility-check.md).
- You have read [the coverage eligibility purposes](../concepts/coverage-eligibility-purposes.md).

## What happens

Every purpose needs the beneficiary ID, the coverage or plan code, the payer ID and the provider ID.

| Purpose | Send it when | Extra input | What comes back |
|---|---|---|---|
| `discovery` | `/participant/get/policies` finds no policy for the patient | None | The active policy code. Use it in a `validation` check next |
| `validation` | At registration or admission | None | `insurance[*].inforce`, the wallet amount used and the amount still available |
| `benefits` | You need benefit detail for procedures | Procedure or package codes | Benefit details for the listed items |
| `auth-requirements` | Before each preauthorisation, and when a treatment is added | Procedure or package codes in `item[*]`, mandatory | Whether each item is covered, the covered amount, `authorizationRequired`, required questionnaires and `authorizationSupporting` document codes |

The default is `validation` first, then `auth-requirements` before each preauthorisation. `validation` tells you the policy is in force and how much wallet remains. `auth-requirements` tells you which documents and questionnaires the preauthorisation must carry, so you send it complete. Use `discovery` only as a fallback. An unspecified procedure also needs an `auth-requirements` check.

`purpose` is a list. One request may carry more than one value, for example `validation` and `auth-requirements` together.

## How you know it worked

- The answer on `/v1/coverageeligibility/on_check` has `outcome` `complete`.
- For `validation`, `insurance[*].inforce` is `true` and the wallet amounts are present.
- For `auth-requirements`, every item you sent comes back with `authorizationRequired` and any `authorizationSupporting` codes.
- The preauthorisation you then send carries every document and questionnaire those codes named.

## When it goes wrong

The purpose is chosen per request and nothing is registered, so switching is immediate.

- `PAYR-1033`: you sent a purpose that needs items without any `item[*]`. Add the procedure or package codes. See [PAYR-1033](../errors/payr-1033.md).
- `PAYR-1032` or `PAYR-1101`: the purpose is not one of the four values. Send it exactly as written above, lower case, no spaces. See [PAYR-1032](../errors/payr-1032.md) and [PAYR-1101](../errors/payr-1101.md).
- You skipped `auth-requirements` and the preauthorisation comes back queried for missing documents. Run the check, attach what it names, and answer the query. See [answer a payer query on a preauthorisation](../flows/preauth-query-response.md).
