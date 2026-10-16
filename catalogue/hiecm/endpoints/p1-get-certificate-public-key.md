---
id: hiecm.endpoint.p1-get-certificate-public-key
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: GET Certificate (Public key)
summary: Returns the public certificate a PHR app encrypts sensitive values with
  before sending them.
generated: true
operation: p1_get_v3_phr_app_login_public_certificate
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_get_v3_phr_app_login_public_certificate.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_get_v3_phr_app_login_public_certificate.mdx#p1-get-certificate-public-key.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# GET Certificate (Public key)

## In plain words

Returns the public certificate a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app encrypts sensitive values with before it sends them. Fetch it before registration or login. The call takes no request body, only the `REQUEST-ID` and `TIMESTAMP` headers with your access token.

## Before you start

An access token for the `Authorization` header, a fresh UUID for `REQUEST-ID`, and the current time in UTC for `TIMESTAMP`.

## What happens

You fetch the certificate once and encrypt with it every value the registration, login and profile calls take encrypted.
