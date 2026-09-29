---
id: hiecm.endpoint.m4-hpr-fetch-documents-list
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: List the documents this professional must upload
summary: Returns the documents the registry expects for a professional and the
  id to upload each one against.
generated: true
operation: m4_post_v1_doctors_fetch_documents_list
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_doctors_fetch_documents_list.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_doctors_fetch_documents_list.mdx#m4-hpr-fetch-documents-list.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-register-professional
  concepts:
    - hiecm.concept.gateway-session
---

# List the documents this professional must upload

## In plain words

A professional's registration in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) carries supporting documents. This call takes the professional's `hprid` and returns `documentList`, which says which documents the registry expects and the `id` to upload each one against.

## Before you start

A registered professional and their `hprid`.

## What happens

`documentList` groups the documents. `profileDetails` holds `profilePhoto` and `proofOfWorkCertificate`. `registrationDetails` holds `registrationCertificate` and `proofOfNameChangeRegCertificate`. `qualificationDetails` holds `degreeCertificate` and `proofOfNameChangeQualCertificate`. Each entry carries an `id` and `data`.

## How you know it worked

The response carries `documentList`. Upload each outstanding document with the upload call, using the entry's `id` as its `document_id`.
