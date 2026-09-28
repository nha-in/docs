---
id: hiecm.endpoint.m1-enrolment-capture-pid
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Track face authentication status
summary: Reports whether the person has completed face authentication in the ABHA app.
generated: true
operation: m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e.mdx#m1-enrolment-capture-pid.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-create-abha-face-auth
---

# Track face authentication status

## In plain words

Reports how far the person has got with face authentication in the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) app. Send the `txnId` from the init call, with `scope` set to `["abha-enrol","face-verify"]`. `status` comes back as `PENDING`, `VERIFIED`, `FAILED` or `COMPLETE`. Once it is `COMPLETE`, continue to the create call.

## What happens

Poll every 5 to 10 seconds. You can also skip polling and call the create call once the ABHA app shows that the capture was submitted. Face login and Find ABHA by face use the same call.

## When it goes wrong

A 400 with `ABDM-1017` means the `txnId` is invalid or expired. Start again with the init call.
