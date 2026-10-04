---
id: hiecm.callback.m2-on-data-notification
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The provider pushes encrypted health information to the URL named in the
  request
summary: The HIP posts the encrypted records straight to the HIU's data push
  URL, outside the gateway.
generated: true
operation: m2_post_health_information_transfer
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_health_information_transfer.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_health_information_transfer.mdx#m2-on-data-notification.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The provider pushes encrypted health information to the URL named in the request

## In plain words

The [HIP](/docs/hiecm/v3/getting-started/glossary#hip) posts the encrypted records straight to the `dataPushUrl` the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) named in its health information request. This call does not pass through the ABDM gateway. `/health-information/transfer` stands for that URL. Each entry is a [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundle of media type `application/fhir+json`, encrypted with keys agreed through [ECDH](/docs/hiecm/v3/getting-started/glossary#ecdh).

Send each page with your gateway access token as `Authorization: Bearer <token>`; the sandbox's PHR push URL accepts it. Put one entry on each page, with fresh `keyMaterial` for that page. The key and IV come from the page's key material, so entries sharing a page share them. `checksum` is the MD5 of the entry's content before encryption, in hexadecimal.

## Before you start

The HIU exposes the `dataPushUrl` and keeps the private key behind the `keyMaterial` it sent. An authorization token is mandatory on this call: send the gateway access token as `Authorization: Bearer <token>`.

## What happens

The body carries `transactionId`, `pageNumber`, `pageCount`, `entries` and the sender's `keyMaterial`, in the same shape as the requester's `keyMaterial`. Each entry has `content`, `media`, `checksum` and `careContextReference`. `checksum` is the MD5 of the content before encryption, as a hexadecimal string. Send one entry per page and generate fresh key material and a fresh nonce for every page; several entries on one page would share a key and IV.

## How you know it worked

The receiver answers 202 Accepted, decrypts every entry, and each MD5 matches.

## When it goes wrong

Records can span several pages. Collect every page up to `pageCount` before you report the transfer.
