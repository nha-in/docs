---
title: Registries, ABHA, HPR and HFR
sidebar_label: Registries
sidebar_position: 3
description: The three national directories behind ABDM, what each one holds and which module writes to it.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# Registries, ABHA, HPR and HFR

[ABDM](/docs/overview/glossary#abdm) has three national directories. [ABHA](/docs/overview/glossary#abha) identifies patients, [HPR](/docs/overview/glossary#hpr) identifies healthcare professionals, [HFR](/docs/overview/glossary#hfr) identifies facilities. Every other API assumes these identifiers already exist, so a directory entry is usually the first thing you create. This page says what each registry holds and which module writes to it.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published documents for the simplified milestone
flows, M1 and M4. Nothing here has been run against the ABDM sandbox from
this repository, so treat request and response shapes as unconfirmed.
:::

## At a glance

| Registry | Identifies | Identifier | Written by |
| --- | --- | --- | --- |
| ABHA | A patient | 14 digit ABHA number, plus an ABHA address | [M1](/docs/api/hie-cm/m1) |
| HPR | A doctor, nurse, pharmacist or facility manager | HPR ID | [M4](/docs/api/hie-cm/m4) |
| HFR | A hospital, clinic, lab, imaging centre or pharmacy | Facility ID | [M4](/docs/api/hie-cm/m4) |

## ABHA, patient identity

ABHA is the Ayushman Bharat Health Account. NHA's M1 document describes it as a unique 14 digit identifier issued to a person only after a completed [KYC](/docs/overview/glossary#kyc) process. It is the anchor for everything else: a health record is linked to a patient by their ABHA, and a consent request is raised against it.

Two things carry the name ABHA, and they are not the same:

- **ABHA number.** The 14 digit number. Issued once identity is verified.
- **ABHA address.** A readable handle the patient chooses, for example from the suggestion API or by entering their own. This is what your system uses when it links a care context or requests consent.

### What an ABHA record holds

From the M1 document, the profile behind an ABHA covers the identity fields verified through Aadhaar, a communication mobile number, an optional verified email address, the linked ABHA address, and an ABHA card that can be downloaded as an image or QR code.

Identity verification is Aadhaar based. NHA's document lists four routes: Aadhaar OTP, face authentication through the ABHA app and the Aadhaar RD service, biometrics by fingerprint or iris through a registered device, and demographic authentication. Aadhaar OTP is mandatory for both private and government integrators. Demographic authentication is mandatory for government integrators only.

Child ABHA is a separate case. It is a 14 digit identifier for children under six who have no Aadhaar number, created with a parent or guardian's consent, and access is limited to specific government integrators approved by NHA leadership.

### Base URLs

```text
Sandbox     https://abhasbx.abdm.gov.in/abha/api/v3/
Production  https://abha.abdm.gov.in/api/abha/v3/
```

NHA's document notes that Aadhaar number login by fingerprint or iris uses the v3.1 base URL, `https://abhasbx.abdm.gov.in/abha/api/v3.1/`.

Details and call sequences are in [M1](/docs/api/hie-cm/m1) and the [M1 API reference](/reference/hiecm-m1).

## HPR, healthcare professionals

HPR is the Healthcare Professionals Registry. NHA describes it as a repository of verified healthcare professionals across modern and traditional systems of medicine. Doctors, nurses and pharmacists can enrol today, and NHA says further categories will be added.

The identifier is the HPR ID, also written as HPID in NHA's document. It is described there as a unique 14 digit, Aadhaar authenticated identifier issued to a registered healthcare professional or facility manager.

### What an HPR record holds

The registration payload is not transcribed in NHA's document, because the request and response samples were supplied as screenshots. What the document does give in text is the code sets a registration uses.

Category, used when creating an HPR ID:

| Code | Category |
| --- | --- |
| 1 | Doctor |
| 2 | Nurse |
| 6 | Pharmacist |

Sub category, which fixes the professional's system of medicine. These are the codes NHA lists for the create HPR ID call:

| Code | Sub category | Type |
| --- | --- | --- |
| 1 | Modern Medicine | doctor |
| 2 | Dentist | doctor |
| 3 | Ayurveda | doctor |
| 4 | Unani | doctor |
| 5 | Siddha | doctor |
| 6 | Homoeopathy | doctor |
| 89 | Sowa-Rigpa | doctor |
| 220 | Yoga and Naturopathy | doctor |
| 7 | Registered Auxiliary Nurse Midwife (RANM) | nurse |
| 8 | Registered Nurse (RN) | nurse |
| 9 | Registered Nurse and Registered Midwife (RN and RM) | nurse |
| 10 | Registered Lady Health Visitor (RLHV) | nurse |
| 33 | Pharmacist | pharmacist |

Read that table as belonging to one call only. NHA's document gives a second, different sub category code set for the register and update professional API, where Homoeopathy is 3, Sowa-Rigpa is 7 and Yoga and Naturopathy is 14. The two sets disagree. Check which call you are making before you send a code, and see [M4](/docs/api/hie-cm/m4).

Role, which decides what the person can do:

| Code | Role |
| --- | --- |
| 1 | Healthcare Professional |
| 2 | Facility Manager |
| 3 | Healthcare Professional and Facility Manager |

Role 2 and role 3 matter for HFR. NHA's document says the HFR create call takes a professional token in its header, generated from an HPR ID and password. So someone in your organisation needs an HPR ID with facility manager rights before you can register a facility.

### Base URLs

```text
Sandbox     https://apihspsbx.abdm.gov.in/v4/int/
Production  https://apinhpr.abdm.gov.in/v4/int/
```

The gateway session call that issues the access token for these APIs is documented at `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` with a `clientId`, `clientSecret` and `grantType` of `client_credentials`.

NHA's document also notes that some fields are sent encrypted rather than in the clear. The mobile number in the mobile verification call, and the email and password on creation, are RSA encrypted with the public key from the auth certificate endpoint `v4/int/api/v1/auth/cert`, using `RSA/ECB/PKCS1Padding`.

## HFR, health facilities

HFR is the Health Facility Registry. NHA describes it as a national directory of health facilities across modern and traditional systems of medicine, public and private, including hospitals, clinics, diagnostic laboratories, imaging centres and pharmacies.

A facility has to enrol in HFR before it can act as a [HIP](/docs/overview/glossary#hip) or [HIU](/docs/overview/glossary#hiu) on [HIE-CM](/docs/overview/glossary#hie-cm). The Facility ID is what identifies it in every record you later share.

### What an HFR record holds

NHA's document describes onboarding as five calls in a fixed order:

1. Deduplicate search, to check the facility is not already listed.
2. Basic facility information. This returns a tracking ID, which acts as the facility's identifier until submission.
3. Additional information.
4. Detailed information.
5. Submit facility details, which sends the facility for verification. Without this call the facility stays in draft.

Demographic fields are not free text. They use LGD codes from the Local Government Directory at [lgdirectory.gov.in](https://lgdirectory.gov.in/), fetched through the HFR master data APIs. The same applies to facility type, sub type, ownership and specialities. NHA's document states that HFR APIs accept only the code, never the display value.

On identifier formats, NHA's document is not consistent, so treat it with care. The bridge linkage and facility search sections describe a Facility ID as a 12 character value beginning with `IN`. The deduplicate search section describes its `facilityId` parameter as a 6 digit numeric value, labelled there as the facility unique ID. We have not run either call against the sandbox to establish which applies where.

### Bridge linkage

A bridge is your software's connection to ABDM. Bridge linkage attaches one or more bridges to a facility, and it is what makes your system resolvable as that facility's HIP or HIU.

From NHA's document, the call takes a facility ID, a facility name, a bridge ID, a HIP name, a bridge type of `HIP` or `HIU`, and an active flag. The HIP name is the name a patient sees in their [PHR](/docs/overview/glossary#phr) app when they search for the hospital. NHA's stated constraints on it: 15 characters or fewer, no special characters, and unique per bridge within a facility.

### Base URLs

The same base URLs as HPR:

```text
Sandbox     https://apihspsbx.abdm.gov.in/v4/int/
Production  https://apinhpr.abdm.gov.in/v4/int/
```

## What is missing here

NHA's M4 document carries its request and response samples as screenshots, so the payloads did not survive conversion. For every M4 call on this page we can tell you what the step does, what it needs and what order it comes in. We cannot yet give you the request body. Those shapes are not transcribed from NHA's document, and we will not guess them.

## Next

- [HIE-CM gateway](/docs/overview/building-blocks/hie-cm)
- [M1, ABHA identity](/docs/api/hie-cm/m1)
- [M4, HPR and HFR](/docs/api/hie-cm/m4)
- [Sandbox data dictionary](/docs/api/data-dictionary)
