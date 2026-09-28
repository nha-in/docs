---
id: hiecm.flow.m1-create-child-abha
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create a child ABHA under a parent's account
summary: A logged in parent or guardian creates a child ABHA, corrects its
  details and lists the children on their account, for approved integrators
  only.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m1.mdx#m1-create-child-abha.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-enrolment-by-aadhaar
    - hiecm.endpoint.m1-enrolment-list-children
    - hiecm.endpoint.m1-profile-update-account
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
    - hiecm.flow.m1-login-by-mobile
  concepts:
    - hiecm.concept.gateway-session
---

# Create a child ABHA under a parent's account

## In plain words

ABDM supports guardian-based management of ABHA accounts for eligible children
in accordance with applicable policies and implementation guidelines. This
functionality is currently made available only to select government
integrators, subject to approval by the National Health Authority (NHA). The
workflow includes creation of a child ABHA linked to a verified parent or
guardian account, updating child profile information, and retrieval of child
accounts associated with the parent or guardian.

## Before you start

Approval for this route, the parent or guardian logged in so you hold their `X-token`, and the child's name, date of birth and gender.

## What happens

Create with `enrol/byAadhaar`, `authMethods` set to `child`, and a `child` block carrying `name`, `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `gender` and `parentConsent`, sent with the parent's `X-token` and the `Benefit-Name` header. Correct a child's details through `PATCH /abha/api/v3/profile/account`; a child ABHA without KYC can be updated once. List the children with `/abha/api/v3/enrollment/profile/children`.

## How you know it worked

The create response carries the child's `ABHANumber`, and listing the parent's children returns that child. The listing is the proof that the account hangs off the right parent.

## When it goes wrong

The parent's account has reached its limit of child accounts, and the next create is refused. The parent's token has expired, which reads as an authorisation failure rather than a validation one.
