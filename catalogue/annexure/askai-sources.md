---
title: Ask AI sources
description: Every NHA document the assistant's knowledge and its evaluation depend on, with where it was fetched from and when.
---

# Ask AI sources

One row per NHA document. `id` is stable and is what an eval case or an atom cites, as `annexure#<id>`. `hash` is the sha256 of the fetched file where the source is a file, truncated to its first 16 hex characters and prefixed `sha256:`; a page rendered by a JavaScript application has no stable bytes to hash and says `page` instead. `atoms` and `cases` are counts kept current by `npm run lint:annexure`, which fails when a citation points nowhere.

| id | url | what | fetched | hash | atoms | cases |
|---|---|---|---|---|---|---|
| sandbox-faq-general | https://sandbox.abdm.gov.in/sandbox/v3/faq | NHA sandbox FAQ, the General tab: integration queries raised by integrators, thirteen questions on 2026-09-03 | 2026-09-03 | page | 0 | 21 |
| sandbox-faq-m1 | https://sandbox.abdm.gov.in/sandbox/v3/faq | NHA sandbox FAQ, the Milestone 1 tab | 2026-09-03 | page | 0 | 23 |
| sandbox-faq-m2 | https://sandbox.abdm.gov.in/sandbox/v3/faq | NHA sandbox FAQ, the Milestone 2 tab | 2026-09-03 | page | 0 | 17 |
| sandbox-faq-m3 | https://sandbox.abdm.gov.in/sandbox/v3/faq | NHA sandbox FAQ, the Milestone 3 tab | 2026-09-03 | page | 0 | 16 |
| abdm-faq-sandbox | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Sandbox category | 2026-09-03 | page | 0 | 25 |
| abdm-faq-abha-number | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the ABHA Number category | 2026-09-03 | page | 0 | 0 |
| abdm-faq-hpr | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Healthcare Professionals Registry category | 2026-09-03 | page | 0 | 0 |
| abdm-faq-hfr | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Health Facility Registry category | 2026-09-03 | page | 0 | 0 |
| abdm-faq-general | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the General category | 2026-09-03 | page | 0 | 21 |
| glossary | site/docs/_glossary/_hiecm.mdx | This portal's glossary, from which the shared glossary atoms were moved | 2026-09-17 | sha256:0f8b53081bee4c0e | 0 | 18 |
| ask-ai-panel | ai-widget/README.md | This portal's Ask AI panel: what the assistant does, what a reader can give it, what it keeps and what it will not do | 2026-09-23 | sha256:969f1a400a866759 | 1 | 1 |
| final-m4-m4-hfr-json | catalogue/openapi/.raw/nha-2026-09-16/M4/M4-HFR.json | NHA's final M4 HFR swagger, 16 September 2026 | 2026-09-16 | sha256:25291734dd378285 | 0 | 0 |
| final-m4-m4-hpid-json | catalogue/openapi/.raw/nha-2026-09-16/M4/M4-HPID.json | NHA's final M4 HPID swagger, 16 September 2026 | 2026-09-16 | sha256:7e2eb837caa110f8 | 0 | 0 |
| final-m4-m4-hpr-json | catalogue/openapi/.raw/nha-2026-09-16/M4/M4-HPR.json | NHA's final M4 HPR swagger, 16 September 2026 | 2026-09-16 | sha256:fe3e5b211cf9f1c0 | 0 | 0 |
| final-abha-m1-abha-collection-json | catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Collection.json | NHA's M1 ABHA Postman collection, supplying the order of M1 calls | 2026-09-16 | sha256:ea48dc0600f8322c | 0 | 0 |
| final-abha-m1-abha-swagger-1-yaml | catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml | NHA's final M1 ABHA swagger, 16 September 2026 | 2026-09-16 | sha256:6ab5cfe77c29032f | 0 | 0 |
| final-hiecm-consent-management-data-flow-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml | NHA's final consent management data flow swagger, 16 September 2026 | 2026-09-16 | sha256:4b0af51af2e2b5bf | 0 | 0 |
| final-hiecm-gateway-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml | NHA's final gateway swagger, 16 September 2026 | 2026-09-16 | sha256:d3bc599054c2570a | 0 | 0 |
| final-hiecm-hip-initiated-linking-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/hip-initiated-linking.yaml | NHA's final HIP initiated linking swagger, 16 September 2026 | 2026-09-16 | sha256:8c4036b49028e243 | 0 | 0 |
| final-hiecm-link-token-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/link-token.yaml | NHA's final link token swagger, 16 September 2026 | 2026-09-16 | sha256:2e9cdca38bd2b223 | 0 | 0 |
| final-hiecm-patient-share-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/patient-share.yaml | NHA's final patient share swagger, 16 September 2026 | 2026-09-16 | sha256:8de274b417bbb860 | 0 | 0 |
| final-hiecm-scan-and-pay-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/scan-and-pay.yaml | NHA's final scan and pay swagger, 16 September 2026 | 2026-09-16 | sha256:fe6c61d73f40d1ce | 0 | 0 |
| final-hiecm-subscription-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/subscription.yaml | NHA's final subscription swagger, 16 September 2026 | 2026-09-16 | sha256:19e2be6557790fec | 0 | 0 |
| final-hiecm-user-initiated-linking-yaml | catalogue/openapi/.raw/nha-2026-09-16/hiecm/user-initiated-linking.yaml | NHA's final user initiated linking swagger, 16 September 2026 | 2026-09-16 | sha256:848439c9e1fd123e | 0 | 0 |
| final-phr-phr-and-locker-swagger-yaml | catalogue/openapi/.raw/nha-2026-09-16/phr/PHR and Locker Swagger.yaml | NHA's final PHR and Locker swagger, 16 September 2026 | 2026-09-16 | sha256:a7e1b7e0b56b7529 | 0 | 0 |
| final-phr-phr-and-locker-postman-collection-json | catalogue/openapi/.raw/nha-2026-09-16/phr/PHR and locker.postman_collection.json | NHA's PHR and Locker Postman collection, 16 September 2026 | 2026-09-16 | sha256:8f503595767bc080 | 0 | 0 |
