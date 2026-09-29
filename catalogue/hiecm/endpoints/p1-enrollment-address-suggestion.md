---
id: hiecm.endpoint.p1-enrollment-address-suggestion
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Ask for address suggestions
summary: Returns ABHA addresses the person can choose from, built from their
  name and date of birth.
generated: true
operation: p1_post_v3_phr_app_enrollment_suggestion
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_suggestion.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_suggestion.mdx#p1-enrollment-address-suggestion.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.gateway-session
---

# Ask for address suggestions

## In plain words

A person should not have to invent an [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). Send the `txnId` of the verified registration with their name and date of birth, and the response lists candidates in `abhaAddressList`. They are suggestions, not reservations: the person may still type their own, and any choice goes through the existence check before you enrol it.

## Before you start

The `txnId` from the verified registration OTP. `firstName`, `lastName`, `dayOfBirth`, `monthOfBirth` and `yearOfBirth` are required. `email` is optional.

## When it goes wrong

A `400` carries `ABDM-9999` with a message that names the field: `Invalid First Name`, `Invalid Transaction Id`, `Invalid Day Of Birth`, `Invalid Month Of Birth` or `Invalid Year Of Birth`. One response can list several.
