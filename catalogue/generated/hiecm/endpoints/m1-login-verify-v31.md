---
id: hiecm.endpoint.m1-login-verify-v31
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Sign in with a biometric, v3.1
summary: Signs a person in with a fingerprint or iris capture in one call on the
  v3.1 path.
generated: true
operation: m1_post_v3_1_profile_login_verify_fingerprint
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_1_profile_login_verify_fingerprint.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_1_profile_login_verify_fingerprint.mdx#m1-login-verify-v31.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Sign in with a biometric, v3.1

## In plain words

Version 3.1 of login verification, on the `/abha/api/v3.1` base path. A fingerprint or iris sign in takes one call, with no send request step. Send the encrypted Aadhaar number and the capture from a registered device. Face sign in uses the same path as its last step, after face authentication completes in the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) app. The response carries the `token` and the accounts it opens.

## Before you start

For fingerprint, send `scope` as `["abha-login", "aadhaar-bio-login-verify"]`, `authMethods` as `["bio_login"]`, and `aadhaar` and `fingerPrintAuthPid` inside `bio_login`.

## When it goes wrong

A 400 with `Invalid Fingerprint Auth PID` means the capture was refused: capture again. A 404 with `ABDM-1114` means no ABHA is registered with that Aadhaar number.
