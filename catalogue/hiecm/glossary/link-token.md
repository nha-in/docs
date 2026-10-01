---
id: hiecm.glossary.link-token
type: glossary
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Link token, the token that authorises linking
summary: The token that authorises your system to link a care context to a
  patient's ABHA address.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_hiecm.mdx
    status: page
    note: Generated from site/docs/_glossary/_hiecm.mdx#link-token. Edit the page,
      never this file.
related:
  concepts: []
---

# Link token, the token that authorises linking

## In plain words

The token that authorises a [Health Information Provider](/docs/hiecm/v3/getting-started/glossary#hip) to link [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context) to a patient's [ABHA Address](/docs/hiecm/v3/getting-started/glossary#abha-address).

## How you know it worked

You can say what a link token authorises and what to do when it has expired.

## When it goes wrong

A stored link token is used without checking that it is still valid. Validate it before every link. If it has expired, generate a new one through demographic authentication, then link.
