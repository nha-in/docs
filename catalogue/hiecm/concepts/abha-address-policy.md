---
id: hiecm.concept.abha-address-policy
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: What an ABHA address is allowed to be
summary: The characters and shapes an ABHA address may take, and the default
  address every ABHA number is issued.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/registries/abha.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/registries/abha.mdx#abha-address-policy.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.abha-number-and-address
  endpoints:
    - hiecm.endpoint.p1-enrollment-address-suggestion
    - hiecm.endpoint.p1-enrollment-address-exists
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.abha-number
  flows:
    - hiecm.flow.p1-create-abha-address
---

# What an ABHA address is allowed to be

## In plain words

ABHA Addresses must comply with defined validation standards.

**Permitted Characters**

- Alphabetic characters (A-Z)
- Numeric characters (0-9)
- Dot (.)

**Validation Rules**

- Cannot begin with a numeric character.
- Cannot begin or end with a dot (.).
- Must conform to ABDM validation requirements at the time of creation.
- Mobile numbers cannot be used directly as ABHA Addresses.

Organizations should rely on ABDM validation services to verify address eligibility.

Every ABHA number is issued a default address built from its 14 digits. A person cannot create that address themselves, and can create a readable one beside it. Offer addresses built from the person's name rather than an empty field.

## Before you start

Know whether the address is being created against an ABHA number or against a mobile number with a self declared profile. See [P1 Registration and login](/docs/hiecm/v3/milestones/p1).

## What happens

Validate the rules above in your own form before you submit, so a refused address becomes an inline message. Offer the suggestions the service returns from `/abha/api/v3/enrollment/enrol/suggestion` during M1 enrolment. Send the chosen address without the `@` suffix where the call asks for it.

## How you know it worked

The address is created and the person can sign in with it. Before that, your form refuses an address that begins with a digit, begins or ends with a dot, or is a mobile number.

## When it goes wrong

The address is taken: show alternatives rather than an error alone. The person expects to use their mobile number as their address: say in the form that this is not allowed, rather than letting them find out on submission.
