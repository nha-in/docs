---
id: hiecm.endpoint.p1-process-link-request-via-abha-number
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Process Link Request via ABHA OTP
summary: Links the ABHA number to the signed in ABHA address after the OTP to
  the ABHA number's mobile is verified.
generated: true
operation: p2_post_v3_phr_app_login_profile_link
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_link.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_link.mdx#p1-process-link-request-via-abha-number.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Process Link Request via ABHA OTP

## In plain words

After the one time password sent to the ABHA number's mobile is verified, this call links the [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) to the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in. Send `action` `LINK` and the `txnId` from the OTP steps as `transactionId`.

## Before you start

A `txnId` whose OTP was verified with `authResult` `success`, and the user token in `X-token`.

## How you know it worked

`authResult` is `success` and `message` is `ABHA number is securely linked to ABHA address`.

## When it goes wrong

`ABDM-9999` with `Transaction is not found for UUID.` or `Invalid Transaction Id` means the transaction is wrong or spent. `Invalid Account Action` means `action` is not `LINK`.
