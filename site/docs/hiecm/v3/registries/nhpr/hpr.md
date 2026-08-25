---
title: HPR, the professional registry
sidebar_label: HPR
description: The Healthcare Professionals Registry, the HPID, what identifies a doctor, and the registration journey NHA's M4 document describes.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
sidebar_position: 1
---

# HPR, the professional registry

[HPR](/docs/hiecm/v3/getting-started/glossary#hpr) is the Healthcare Professionals Registry, the people half of [NHPR](/docs/hiecm/v3/registries/nhpr) alongside the [HFR](/docs/hiecm/v3/registries/nhpr/hfr). Registering there issues the professional an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid), their identity everywhere in [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm).

## Who can enrol

Three categories today, with more to be added later: doctor, nurse and pharmacist. Each professional also declares a system of medicine, from modern medicine, dentistry, Ayurveda, Unani, Siddha, Homoeopathy, Sowa-Rigpa, and yoga and naturopathy. A person can also enrol as a facility manager instead of a clinician, set by the role code:

| Role code | What the person is |
| --- | --- |
| 1 | Healthcare Professional |
| 2 | Facility Manager |
| 3 | Healthcare Professional and Facility Manager |

If nobody in your organisation holds role 2 or role 3, you cannot register a facility. See [HFR](/docs/hiecm/v3/registries/nhpr/hfr).

## The HPID

A unique 14 digit, Aadhaar authenticated identifier issued on successful registration to a healthcare professional or facility manager. NHA writes it both ways, HPID and HPR ID. Like an [ABHA](/docs/hiecm/v3/registries/abha), it comes in two forms:

| Form | Sample from NHA's document | Where it is used |
| --- | --- | --- |
| The number | `71-2665-5777-XXXX` | Sent as `hpId` or `hprIdNumber` |
| The address | `name@hpr.abdm` | Sent as `hprId`, with `domainName` of `@hpr.abdm` |

The professional chooses the readable part through a username suggestion call, the same pattern as the ABHA address suggestion in [M1](/docs/hiecm/v3/api/m1).

## What identifies a doctor

An HPID on its own is an authenticated person; the profile behind it makes them a doctor. NHA's register professional call groups it in five blocks:

| Block | What it holds |
| --- | --- |
| Personal information | Salutation and name, date of birth, gender, nationality, languages spoken, profile photo, official mobile and email |
| Communication address | Country, state, district, sub district, city and pincode, all as master data codes. Skipped if the address matches the [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) address |
| Registration | The council the professional is registered with, the registration number, the registration certificate, and whether the registration is permanent or renewable |
| Qualification | Degree or diploma obtained, college, university, year of award, and the degree certificate |
| Current work | Whether they are working, the purpose of that work, whether it is private, government or both, and the facility they work at |

Three codes decide what the professional may be. **Category** says doctor, nurse or pharmacist. **Subcategory** fixes the system of medicine. The **degree code** must agree with both. NHA's tables for all three are on [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented).

:::warning[The subcategory codes differ between two calls]
NHA's M4 document publishes one subcategory table for the create HPID call and a different one for the register professional call. The codes disagree. Homoeopathy is 6 in the first table and 3 in the second. Sowa-Rigpa is 89 and then 7. Yoga and naturopathy is 220 and then 14. We have not run either call, so we cannot tell you which table applies where. Fetch the codes from the HPRID subcategories master call rather than hard coding either one.
:::

The SMD ID identifies doctors only. Searching for nurse colleges by SMD returns a null college and university name, and NHA states this is expected: for nurses, SMD is always null.

## The registration journey

Two halves, in order. Nothing in the second works until the first produces a token.

**Half one, create the HPID.** Nine calls after the gateway session token: generate Aadhaar link, check Aadhaar authentication status, verify OTP and fetch user details, check whether an HPID already exists for this Aadhaar, mobile match, generate mobile OTP, verify mobile OTP, username suggestions, create HPID. The last returns the HPID and an `hprToken`, which the next call needs.

**Half two, register the professional.** Register professional writes the full profile, and its path is the one HPR write call that survived conversion: `POST https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/register-professional-new`. Then retrieve professional document list, upload documents, update professional and fetch professional details.

Three things to know first:

- The Aadhaar link URL is valid for 5 minutes only. NHA says to call the API again once it expires.
- `degreeCertificate` and `registrationCertificate` are mandatory uploads, and `proofOfWorkCertificate` is mandatory when the professional is government or both.
- NHA's document is inconsistent about the mobile OTP step. One note says to generate the OTP only after `demographicAuthViaMobile` comes back false. The paragraph beside it says to call it first and check the status afterwards. We have not run either order.

Call by call, with the parameters, is on [M4 user journey](/docs/hiecm/v3/api/m4/user-journey) and [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented).

## Getting an HPR token later

The `hprToken` from creation does not last. Three ways to get a fresh one, all still carrying the gateway access token in the `Authorization` header, because the HPR token proves who the professional is, not that your client may call.

| Route | Path |
| --- | --- |
| By password | `/v4/int/api/v1/auth/authPassword` |
| By mobile OTP, send | `/v4/int/api/v2/auth/loginViaMobileSendOTP` |
| By mobile OTP, log in | `/v4/int/api/v2/auth/login/userAuthorizedToken` |
| By Aadhaar OTP, send | `/v4/int/api/v1/auth/init` |
| By Aadhaar OTP, verify | `/v4/int/api/v1/auth/confirmWithAadhaarOtp` |

The bodies are on [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented), with a copy and paste error in NHA's document on the mobile verify path.

## What your system has to hold

Per professional: the HPID in both forms; the current HPR token, its expiry and a way to refresh it without re-registering the person; the transaction id, for one flow only; the master data ids you sent for council, course, college, university, language, country, state and district, since the registry rejects display values; and the certificates you uploaded with each document slot identifier.

Once, for the whole integration: client id and client secret for the gateway session call, and NHA's public certificate from `v4/int/api/v1/auth/cert`. Three fields are encrypted with it, cipher `RSA/ECB/PKCS1Padding`: the mobile number in mobile match, the OTP in mobile login, and the email and password in create HPID.

Upload limits: 1 MB for a profile photo, 5 MB for anything else, png, jpeg, jpg or PDF only. Attachments go as a `fileType` and a base64 `data` string.

## What did not survive the conversion

NHA's M4 document carries almost every request and response sample as a screenshot, which does not convert to text. Missing from our source, and reconstructed nowhere on this site:

- The method and path of all nine HPID creation calls, including create HPID itself, and every request and response body in that chain.
- The request and response samples for register professional. The field table survived. The payload did not.
- The method and path of retrieve professional document list, upload documents, update professional and fetch professional details, and their samples.
- Most of the 17 HPR master data calls. Seven carry a path in text and are listed on [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented). The rest carry only a name and a description.

The behaviour, the order, the parameter tables and the code lists survived. That sizes the work but does not write the calls, so open NHA's sandbox documentation for the healthcare professional registry alongside this page. We will not guess a payload we have not seen.

## Next

- [HFR](/docs/hiecm/v3/registries/nhpr/hfr), the facility half, which needs a token from this registry.
- [NHPR](/docs/hiecm/v3/registries/nhpr), the parent page.
- [M4 user journey](/docs/hiecm/v3/api/m4/user-journey), the same order as diagrams.
- [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented), the parameter tables and the error codes.
