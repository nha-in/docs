---
id: uhi.concept.jan-aushadhi-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Jan Aushadhi service identity for flows A, B and C
summary: One domain, nic2008:47721, and three fulfillment types that select
  Kendras, medicines or stock, with the PMBI HSPA's id, URL and key id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/jan-aushadhi.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/jan-aushadhi.mdx#service-identity. Edit the
      page, never this file.
related:
  flows:
    - uhi.flow.jan-aushadhi-find-kendra
    - uhi.flow.jan-aushadhi-find-medicine
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
    - uhi.glossary.pmbi
---

# Jan Aushadhi service identity for flows A, B and C

## In plain words

| Field | Flow A | Flow B | Flow C |
| --- | --- | --- | --- |
| `context.domain` | `nic2008:47721` | `nic2008:47721` | `nic2008:47721` |
| `context.core_version` | `0.7.1` | `0.7.1` | `0.7.1` |
| `intent.fulfillment.type` | `JANAUSHADHI` | `JANAUSHADHI_MEDICINE` | `JANAUSHADHI_KENDRA` |
| `intent.item.descriptor.code` | `JANAUSHADHI` | Medicine name, no spaces | `medicineId` from flow B |
| `intent.item.descriptor.name` | `JANAUSHADHI` | Medicine name | `medicineId` from flow B |

| HSPA | Value |
| --- | --- |
| Provider ID | `pmbi.hspa` |
| Sandbox URL | `https://staging-nha-pmbi.pmbi.co.in/api/store` |
| Public key ID | `pmbi.hspapid.jak`, for checking the HSPA's signatures |
| Gateway endpoint | `POST /api/v1/uhi/search` |
