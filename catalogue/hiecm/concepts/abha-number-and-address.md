---
id: hiecm.concept.abha-number-and-address
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: ABHA number and ABHA address, and why there are two
summary: Two identifiers, the ABHA number for who the person is and the ABHA
  address for where their records are routed.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/registries/abha.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/registries/abha.mdx#abha-number-and-address. Edit the
      page, never this file.
related:
  glossary:
    - shared.glossary.abha-number
    - shared.glossary.abha-address
---

# ABHA number and ABHA address, and why there are two

## In plain words

An ABHA account consists of two key identifiers:

### 1. ABHA Number

The ABHA Number is a unique 14-digit identifier assigned to an individual after successful identity verification.

**Key Characteristics**

- Unique to each individual.
- Acts as the primary health identity within ABDM.
- Used for patient identification across healthcare systems.
- Issued after completion of the KYC verification process.
- Always associated with at least one ABHA Address.

### 2. ABHA Address

The ABHA Address is a unique and user-friendly identifier in the format: `user@abdm`

**Key Characteristics**

- Facilitates secure routing of health information and consent requests.
- Can be shared with healthcare providers for record linking and data exchange.
- A default ABHA Address is generated along with every ABHA Number.
- Users may subsequently create a personalized ABHA Address.

The number answers who the person is. The address answers where their records are routed, and it is the identifier care contexts are linked to and consent requests are raised against. One number can carry more than one address, and one mobile number can carry several ABHA numbers, which is common in a family. That is why a login by mobile can return a list of accounts to choose from.

## What happens

Store the ABHA number as the patient's stable identity and the address as the routing handle beside it. Use the address wherever a call routes to the person: linking and consent.

## How you know it worked

You can answer two questions. An address a patient gives you routes to an existing account; it does not create one. Your patient record keys on the ABHA number, because a person can hold several addresses and add more later.

## When it goes wrong

An address stored as the primary key breaks when the person adds or changes one. A sandbox address does not exist in production, and the refusal reads as not found rather than as the wrong environment.
