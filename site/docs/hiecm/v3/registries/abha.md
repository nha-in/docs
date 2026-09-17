---
title: ABHA, the patient registry
sidebar_label: ABHA
description: The registry that identifies patients, the 14 digit ABHA number, the ABHA address, and what every milestone assumes about both.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-m1.yaml, catalogue/openapi/hiecm/v3/hiecm-p1.yaml
sidebar_position: 1
covers: [hiecm.concept.abha-number-and-address, hiecm.concept.abha-address-policy]
sidebar_class_name: sidebar-icon sidebar-icon--id-card
---

# ABHA, the patient registry

[ABHA](/docs/hiecm/v3/getting-started/glossary#abha) is the Ayushman Bharat Health Account, the patient half of [Registries](/docs/hiecm/v3/registries). It answers "who is this patient", and every record flow in [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) starts from that answer.

## One account, two identifiers

| | ABHA number | ABHA address |
| --- | --- | --- |
| What it looks like | 14 digits, hyphenated in samples as `91-XXXX-XXXX-XXXX` | A readable name, such as `name@abdm` |
| How it is issued | After an Aadhaar based [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) check passes | Chosen by the person, or issued as a default |
| What it is for | The identity anchor. One person, one number | Routing. It is the handle other systems address records to |
| Can exist alone | No. It always carries a default address | Yes. A person can hold an address with no number |

Store both. You match a patient record against the number, and you send the address when you link a [care context](/docs/hiecm/v3/getting-started/glossary#care-context) or ask for consent. The number is issued only after a strong KYC process completes.

## How identity is verified

Verification runs against Aadhaar through the ABHA service, so your system never calls Aadhaar directly. There are four routes:

| Route | How the person proves identity |
| --- | --- |
| Aadhaar [OTP](/docs/hiecm/v3/getting-started/glossary#otp) | A code sent to the Aadhaar linked mobile number |
| Face authentication | A QR code scanned in the ABHA app, then face capture |
| Biometrics | Fingerprint or IRIS on a registered device, which returns a signed PID block |
| Demographic authentication | Name, date of birth and gender matched against Aadhaar |

### Child ABHA

Child ABHA is created with a parent's consent. Its APIs are intended for use only by specific government integrators approved by NHA.

## The ABHA address

The shape is `name@abdm`.

- **Every number gets a default address**, the number with an `@sbx` or `@abdm` suffix. The `preferredAbhaAddress` field holds it.
- **A person can then create a memorable one.** A suggestion call offers addresses, and a custom address is accepted, linked to the number.
- **An address can exist without a number.** One can be created from a mobile number, name, year of birth and gender, with no KYC. Expect accounts with no number behind them.

### Address policy

These rules apply:

- Letters, numbers, one optional dot and one optional underscore are allowed.
- It starts and ends with a letter or number.
- It is 8 to 18 characters long.

## What an address is allowed to be

The address is validated on creation, so a form that accepts what the rules
above refuse produces a failure the person cannot act on.

A password is created alongside the address: at least 8 characters, at least
one uppercase letter, one digit and one special character from `!@#$%^&*-`.

Offer suggestions rather than an empty box and a policy. Two calls exist for
it, address suggestions and address exists.

## What an ABHA record holds

The profile response carries:

| Field | What it is |
| --- | --- |
| `ABHANumber` | The 14 digit number, hyphenated |
| `preferredAbhaAddress` | The address, with its suffix |
| `mobile` | The communication mobile number |
| `firstName`, `middleName`, `lastName`, `name` | Name parts and the joined name |
| `yearOfBirth`, `monthOfBirth`, `dayOfBirth` | Date of birth as three separate strings |
| `gender` | A single letter |
| `email` | Present once an email is verified, otherwise `null` |
| `profilePhoto` | Base64 image data with no data URI prefix |

The communication mobile number need not be the Aadhaar linked one. It is verified separately, by its own OTP, after enrolment. Email is optional throughout. An ABHA also carries a card, downloadable as an image, and a QR code, both M1 calls. Field level detail is on [the M1 API reference](/docs/hiecm/v3/api/m1).

## Where the calls go

```text
Sandbox     https://abhasbx.abdm.gov.in/abha/api/v3/
```

Login by fingerprint or iris uses the same base URL, through `/v3/profile/login/verify` with a `bio` or `iris` block.

## What M1 does with it

[M1](/docs/hiecm/v3/api/m1) is the only milestone that writes to this registry. It covers creation, login, profile management and sessions.

## What every other milestone assumes

- **[M2](/docs/hiecm/v3/api/m2)** links a care context to the ABHA address and answers [discovery](/docs/hiecm/v3/getting-started/glossary#discovery) against it. See [Linking records](/docs/hiecm/v3/concepts/linking).
- **[M3](/docs/hiecm/v3/api/m3)** raises a consent request against the ABHA address. See [Consent](/docs/hiecm/v3/concepts/consent).
- **[PHR applications](/docs/hiecm/v3/concepts/phr)** sign a person in by ABHA address and show the records linked to it.

No flow starts without an ABHA, so M1 comes first even when your real goal is M2 or M3.

## Next

- [NHPR](/docs/hiecm/v3/registries/nhpr), the professional and facility registries.
- [M1 Create, ABHA Creation and Verification](/docs/hiecm/v3/api/m1), the guide.
- [M1 API reference](/reference/hiecm-m1).
- [Sandbox data dictionary](/docs/hiecm/v3/reference/data-dictionary), test identities.
