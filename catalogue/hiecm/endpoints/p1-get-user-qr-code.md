---
id: hiecm.endpoint.p1-get-user-qr-code
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Get User QR Code
summary: Fetches a QR code that carries the signed in person's details.
generated: true
operation: p2_get_v3_phr_app_login_profile_qrcode
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_qrcode.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_qrcode.mdx#p1-get-user-qr-code.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Get User QR Code

## In plain words

Fetches a QR code for the person signed in to a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. Scanning it gives the person's details, such as name, gender and address. Send the user token in `X-token` and `X-AUTH-TOKEN`. The call takes no body and answers `202`.

## When it goes wrong

A `401` with `900902` and `Missing Credentials` means a token header is missing.
