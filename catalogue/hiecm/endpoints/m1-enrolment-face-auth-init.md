---
id: hiecm.endpoint.m1-enrolment-face-auth-init
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Start face authentication and get a transaction id
summary: Starts face authentication and returns the transaction id the ABHA app
  completes it with.
generated: true
operation: m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33.mdx#m1-enrolment-face-auth-init.
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

# Start face authentication and get a transaction id

## In plain words

Starts face authentication and returns a `txnId`. For an enrolment, send `scope` as `["abha-enrol","face-auth"]`. Hand that id to the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) app by an app intent, or as a QR code the person scans. The person completes the face capture in the ABHA app, and you follow its progress with the capture status call. The same call starts the face authentication login journey.

## How you know it worked

A 200 with a `txnId`. Keep it: every later step of the face journey uses it.

## When it goes wrong

A 400 with `Invalid Scope` means the `scope` values are wrong for this call.
