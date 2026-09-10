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
| glossary | site/docs/_glossary/_hiecm.mdx | This portal's glossary, from which the shared glossary atoms were moved | 2026-09-03 | sha256:b38e31aa0161e094 | 0 | 33 |
| phr-v3-documents | catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx | NHA's ABHA and PHR V3 document, supplied directly rather than published at a URL: the patient side operations with their paths, request bodies and error scenarios | 2026-09-04 | sha256:99320fbc4b9703fc | 0 | 5 |
| m1-abha-collection | catalogue/openapi/.raw/M1 ABHA Collection.postman_collection.json | NHA's M1 ABHA Postman collection: the recorded requests behind the M1 endpoint atoms, and the source of the x-abdm-use-case tags the curated specification carries | 2026-09-04 | sha256:ade3e48084d37ec2 | 0 | 1 |
| spec-errors-m1 | catalogue/openapi/hiecm/v3/hiecm-m1.yaml | NHA M1 error table as curated in the catalogue | 2026-09-03 | sha256:48351b6fef3958c3 | 0 | 5 |
| spec-errors-m2 | catalogue/openapi/hiecm/v3/hiecm-m2.yaml | NHA M2 error table as curated in the catalogue | 2026-09-03 | sha256:0fac31a008fe78b2 | 0 | 11 |
| spec-errors-m3 | catalogue/openapi/hiecm/v3/hiecm-m3.yaml | NHA M3 error table as curated in the catalogue | 2026-09-03 | sha256:490efae0c96f0f93 | 0 | 2 |
