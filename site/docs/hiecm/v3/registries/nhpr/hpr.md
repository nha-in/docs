---
title: HPR, the professional registry
sidebar_label: HPR
description: The Healthcare Professionals Registry, the HPID, what identifies a doctor, and the registration journey.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-m4.yaml
sidebar_position: 1
sidebar_class_name: sidebar-icon sidebar-icon--stethoscope
---

# HPR, the professional registry

[HPR](/docs/hiecm/v3/getting-started/glossary#hpr) is the Healthcare Professionals Registry, the people half of [NHPR](/docs/hiecm/v3/registries/nhpr) alongside the [HFR](/docs/hiecm/v3/registries/nhpr/hfr). Registering there issues the professional an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid), their identity everywhere in [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm).

## Who can enrol

Categories include doctor, nurse and pharmacist. Each professional also declares a system of medicine, such as modern medicine, dentistry, Unani, Siddha, and yoga and naturopathy. A person can also enrol as a facility manager, `facility_manager` in `hprType`.

## The HPID

An Aadhaar authenticated identifier issued on successful registration to a healthcare professional or facility manager. It is written both ways, HPID and HPR ID. Like an [ABHA](/docs/hiecm/v3/registries/abha), it comes in two forms:

| Form | Sample | Where it is used |
| --- | --- | --- |
| The number | `71-1********-0212` | Sent as `hpId` or `hprIdNumber` |
| The address | `name@hpr.abdm` | Sent as `hprId`, with `domainName` of `@hpr.abdm` |

The professional chooses the readable part through a username suggestion call, the same pattern as the ABHA address suggestion in [M1](/docs/hiecm/v3/api/m1).

## What identifies a doctor

An HPID on its own is an authenticated person; the profile behind it makes them a doctor. The register professional call groups it in five blocks:

| Block | What it holds |
| --- | --- |
| Personal information | Salutation and name, date of birth, gender, nationality, languages spoken, profile photo, official mobile and email |
| Communication address | Country, state, district, sub district, city and pincode, all as master data codes. Skipped if the address matches the [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) address |
| Registration | The council the professional is registered with, the registration number, the registration certificate, and whether the registration is permanent or renewable |
| Qualification | Degree or diploma obtained, college, university, year of award, and the degree certificate |
| Current work | Whether they are working, the purpose of that work, whether it is private, government or both, and the facility they work at |

Three codes decide what the professional may be. **Category** says doctor, nurse or pharmacist. **Subcategory** fixes the system of medicine. The operations that take them, and their fields, are in [the M4 API reference](/docs/hiecm/v3/api/m4).

## The registration journey

Two halves, in order. Nothing in the second works until the first produces a token.

**Half one, create the HPID.** Nine calls follow the management token, in this order:

1. Generate Aadhaar link
2. Check Aadhaar authentication status
3. Verify OTP and fetch user details
4. Check whether an HPID already exists for this Aadhaar
5. Mobile match
6. Generate mobile OTP
7. Verify mobile OTP
8. Username suggestions
9. Create HPID

The last returns the HPID and a `token`, which the next call takes as `hprToken`.

**Half two, register the professional.** Register professional writes the full profile, at `POST https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/register-professional-new`. Then retrieve professional document list, upload documents, update professional and fetch professional details.

Call by call, with the parameters, is on [M4 user journey](/docs/hiecm/v3/milestones/m4) and [the M4 API reference](/docs/hiecm/v3/api/m4).

## Getting an HPR token later

The `hprToken` from creation does not last. Three ways to get a fresh one, all still carrying the bearer token in the `Authorization` header, because the HPR token proves who the professional is, not that your client may call.

| Route | Path |
| --- | --- |
| By password | `/v4/int/api/v1/auth/authPassword` |
| By mobile OTP, send | `/v4/int/api/v2/auth/loginViaMobileSendOTP` |
| By Aadhaar OTP, send | `/v4/int/api/v1/auth/init` |
| By Aadhaar OTP, verify | `/v4/int/api/v1/auth/confirmWithAadhaarOtp` |

The bodies are on [the M4 API reference](/docs/hiecm/v3/api/m4).

## What your system has to hold

Per professional, store:

- The HPID, in both forms.
- The current HPR token, its expiry, and a way to refresh it without re-registering the person.
- The transaction id, for one flow only.
- The master data ids you sent for council, course, college, university, language, country, state and district.
- The certificates you uploaded, with each document slot identifier.

Once, for the whole integration: the username and password for the management token call, and the public certificate from `v4/int/api/v1/auth/cert`. Fields such as the mobile number in mobile match and the OTPs are sent encrypted.

Attachments go as a `fileType` and a base64 `data` string.

## Request and response formats

This page gives the behaviour, the call order, the parameter tables and the
code lists. Take the request and response shapes from [the M4 API
reference](/docs/hiecm/v3/api/m4) alongside it.

## Next

- [HFR](/docs/hiecm/v3/registries/nhpr/hfr), the facility half, which needs a token from this registry.
- [NHPR](/docs/hiecm/v3/registries/nhpr), the parent page.
- [M4 user journey](/docs/hiecm/v3/milestones/m4), the same order as diagrams.
- [the M4 API reference](/docs/hiecm/v3/api/m4), its operations and their fields.
