---
id: nhcx.troubleshooting.callback-url-rejected
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Your callback URL is rejected or never called
summary: >-
  Your registered endpoint is refused, or saved and never called. The checks that
  make it reachable, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 3, Steps 3 and 4.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. NHCX Participant Registry; Transport Security.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet NHCX Error Codes, NHCX-1001.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  endpoints:
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.update-validate
  sandbox:
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.support-contacts
  errors:
  - nhcx.error.nhcx-1001
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# Your callback URL is rejected or never called

## In plain words

[NHCX](../../shared/glossary/nhcx.md) delivers requests and answers to the endpoint URL in your participant record. Either the update that sets it is refused, or it saves and nothing ever arrives. Senders see `NHCX-1001`, receiver system not reachable, when your endpoint cannot be reached.

## Before you start

- Your participant is active and you can call the participant update. See [the participant registry and what a participant record holds](../concepts/participant-registry.md).
- You have read [callback URL requirements](../sandbox/callback-url-requirements.md).

## What happens

Work through these in order.

1. **Is the URL HTTPS and publicly reachable?** The endpoint must be HTTPS, publicly accessible and reachable from NHCX.
2. **Does it use a domain name?** Use a fully qualified domain name. An IP address or an explicit port number is not accepted.
3. **Is the server in India?** Callback servers must be hosted in India.
4. **Are the NHCX addresses allowed in?** Whitelist the NAT IPs `3.109.99.210`, `13.126.152.0` and `13.200.129.223` in your server configuration and firewall. Confirm no firewall rule blocks incoming requests from them.
5. **Did you confirm the update?** An update to your endpoint sends a passcode. The new endpoint activates only after you confirm it with [`/update/validate`](../endpoints/update-validate.md), within 24 hours. See [`POST /participant/update`](../endpoints/participant-update.md) and [`POST /v2/participant/update`](../endpoints/v2-participant-update.md).
6. **Does your application route the paths NHCX calls?** Requests arrive on the use case paths, such as `/v1/claim/on_submit`. Check that load balancers, API gateways and reverse proxies send each path to the right service and version.
7. **Does your endpoint answer fast enough?** Answer `202` within 30 seconds with the acceptance body. Otherwise NHCX retries five times, then deletes the request. See [the 202 acknowledgement and the 30 second rule](../concepts/synchronous-acknowledgement.md).

## How you know it worked

Your participant record shows the new endpoint as active. The next request or callback addressed to you arrives on the right path, and your endpoint answers it `202` within 30 seconds.

## When it goes wrong

If every check passes and nothing arrives, look at whether the request was ever sent to you. See [the request was accepted with 202 and no callback arrives](../troubleshooting/accepted-then-no-callback.md).

If the update itself keeps failing, contact NHCX support with your participant code, the endpoint URL and the full response. See [support contacts](../sandbox/support-contacts.md).

The error this symptom can surface: [NHCX-1001](../errors/nhcx-1001.md), the receiver system is not reachable.
