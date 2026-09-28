---
id: hiecm.endpoint.p2-profile-on-share
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Answer a profile share with a token number
summary: The facility's answer to a profile share, carrying the token number the
  person shows at the counter.
generated: true
operation: scan-and-register_post_patient_share_v3_on_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/scan-and-register_post_patient_share_v3_on_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/scan-and-register_post_patient_share_v3_on_share.mdx#p2-profile-on-share.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-scan-and-share
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-profile-share-callback
---

# Answer a profile share with a token number

## In plain words

The facility's answer to a profile share. After ABDM posts a person's profile to your [Health Information Provider (HIP)](/docs/hiecm/v3/getting-started/glossary#hip) bridge, send this call. Put the token number the person shows at the counter in `acknowledgement.profile.tokenNumber`.

## What happens

Set `response.requestId` to the `REQUEST-ID` of the share request ABDM posted. Send either `acknowledgement` or `error`.

## How you know it worked

You receive `202`. ABDM passes the answer to the person's PHR app.

## When it goes wrong

`400` with `ABDM-1006` means the body is invalid. `408` with `ABDM-1007` means the answer came too late.
