---
id: hiecm.endpoint.m4-hpr-upload-document
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Upload one of the professional's documents
summary: Attaches a professional's certificates to their registration against
  the ids the document list returned.
generated: true
operation: m4_post_v1_uploads_upload_document
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_uploads_upload_document.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_uploads_upload_document.mdx#m4-hpr-upload-document.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-register-professional
  concepts:
    - hiecm.concept.gateway-session
---

# Upload one of the professional's documents

## In plain words

Attaches a healthcare professional's certificates to their registration in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr). The body carries the `hpr_token` and a `document` array. Each item names its `document_id`, from the document list call, its `document_type` and `fileType`, and carries the file as `data`.

## Before you start

The `hpr_token` for the professional, the `document_id` values from the document list call, and each file ready to send as `data`.

## How you know it worked

The response reports a `status` and a `msg` for each document type it received: `profilePhoto`, `degreeCertificate`, `registrationCertificate` and `proofOfWorkCertificate`.
