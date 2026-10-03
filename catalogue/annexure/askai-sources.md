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
| abdm-faq-sandbox | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Sandbox category | 2026-09-03 | page | 0 | 26 |
| abdm-faq-abha-number | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the ABHA Number category | 2026-09-03 | page | 0 | 2 |
| abdm-faq-hpr | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Healthcare Professionals Registry category | 2026-09-03 | page | 0 | 0 |
| abdm-faq-hfr | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the Health Facility Registry category | 2026-09-03 | page | 0 | 0 |
| abdm-faq-general | https://abdm.gov.in/FAQ | abdm.gov.in FAQ, the General category | 2026-09-03 | page | 0 | 24 |
| glossary | site/docs/_glossary/_hiecm.mdx | This portal's glossary, from which the shared glossary atoms were moved | 2026-09-17 | sha256:0f8b53081bee4c0e | 0 | 34 |
| ask-ai-panel | ai-widget/README.md | This portal's Ask AI panel: what the assistant does, what a reader can give it, what it keeps and what it will not do | 2026-09-23 | sha256:969f1a400a866759 | 1 | 5 |
| build-with-ai | site/docs/hiecm/v3/getting-started/build-with-ai.mdx | This portal's Build with AI page: the Docs MCP server, the plugin, the skills and the Ask AI panel, which the terse portal feature cases point at instead of an ABDM fact | 2026-09-29 | sha256:ebd90fbc86e76710 | 0 | 5 |
| api-reference-m3 | site/docs/hiecm/v3/api/m3/index.mdx | This portal's M3 API reference overview, one of the module pages that offer a Postman collection and the shared sandbox environment | 2026-09-29 | sha256:ae7c7ecc1d1fbf0c | 0 | 2 |
| catalogue-version | catalogue/VERSION | This portal's catalogue version, the one value the meta version case expects an answer to repeat | 2026-09-29 | sha256:3b450c3d603cca2d | 0 | 1 |
| final-m4-m4-hfr-json | catalogue/hiecm/openapi/.raw/nha-2026-09-16/M4/M4-HFR.json | NHA's final M4 HFR swagger, 16 September 2026 | 2026-09-16 | sha256:25291734dd378285 | 0 | 0 |
| final-m4-m4-hpid-json | catalogue/hiecm/openapi/.raw/nha-2026-09-16/M4/M4-HPID.json | NHA's final M4 HPID swagger, 16 September 2026 | 2026-09-16 | sha256:7e2eb837caa110f8 | 0 | 0 |
| final-m4-m4-hpr-json | catalogue/hiecm/openapi/.raw/nha-2026-09-16/M4/M4-HPR.json | NHA's final M4 HPR swagger, 16 September 2026 | 2026-09-16 | sha256:fe3e5b211cf9f1c0 | 0 | 0 |
| final-abha-m1-abha-collection-json | catalogue/hiecm/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Collection.json | NHA's M1 ABHA Postman collection, supplying the order of M1 calls | 2026-09-16 | sha256:ea48dc0600f8322c | 0 | 7 |
| final-abha-m1-abha-swagger-1-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml | NHA's final M1 ABHA swagger, 16 September 2026 | 2026-09-16 | sha256:6ab5cfe77c29032f | 0 | 13 |
| final-hiecm-consent-management-data-flow-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml | NHA's final consent management data flow swagger, 16 September 2026 | 2026-09-16 | sha256:4b0af51af2e2b5bf | 0 | 20 |
| final-hiecm-gateway-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml | NHA's final gateway swagger, 16 September 2026 | 2026-09-16 | sha256:d3bc599054c2570a | 0 | 4 |
| final-hiecm-hip-initiated-linking-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/hip-initiated-linking.yaml | NHA's final HIP initiated linking swagger, 16 September 2026 | 2026-09-16 | sha256:8c4036b49028e243 | 0 | 10 |
| final-hiecm-link-token-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/link-token.yaml | NHA's final link token swagger, 16 September 2026 | 2026-09-16 | sha256:2e9cdca38bd2b223 | 0 | 6 |
| final-hiecm-patient-share-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/patient-share.yaml | NHA's final patient share swagger, 16 September 2026 | 2026-09-16 | sha256:8de274b417bbb860 | 0 | 0 |
| final-hiecm-scan-and-pay-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/scan-and-pay.yaml | NHA's final scan and pay swagger, 16 September 2026 | 2026-09-16 | sha256:fe6c61d73f40d1ce | 0 | 0 |
| final-hiecm-subscription-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/subscription.yaml | NHA's final subscription swagger, 16 September 2026 | 2026-09-16 | sha256:19e2be6557790fec | 0 | 0 |
| final-hiecm-user-initiated-linking-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/user-initiated-linking.yaml | NHA's final user initiated linking swagger, 16 September 2026 | 2026-09-16 | sha256:848439c9e1fd123e | 0 | 2 |
| final-phr-phr-and-locker-swagger-yaml | catalogue/hiecm/openapi/.raw/nha-2026-09-16/phr/PHR and Locker Swagger.yaml | NHA's final PHR and Locker swagger, 16 September 2026 | 2026-09-16 | sha256:a7e1b7e0b56b7529 | 0 | 1 |
| final-phr-phr-and-locker-postman-collection-json | catalogue/hiecm/openapi/.raw/nha-2026-09-16/phr/PHR and locker.postman_collection.json | NHA's PHR and Locker Postman collection, 16 September 2026 | 2026-09-16 | sha256:8f503595767bc080 | 0 | 0 |
| nha-review-2026-09-30 | docs/superpowers/specs/2026-09-30-askai-holistic-assistant-plan.md | NHA reviewers' verdicts on the Ask AI assistant, 29 and 30 September 2026: the QA sample, the PHR question set, the test-case workbook and the failed-case sheet, received as documents and summarised in section 1 of this plan | 2026-09-30 | sha256:3c87c38246d67995 | 0 | 20 |
