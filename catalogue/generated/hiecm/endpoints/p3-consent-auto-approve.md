---
id: hiecm.endpoint.p3-consent-auto-approve
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Set an auto approval policy
summary: Let consent requests from one health information user be approved
  automatically, within limits the person sets.
generated: true
operation: p2_post_consent_v3_auto_approve
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_consent_v3_auto_approve.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_consent_v3_auto_approve.mdx#p3-consent-auto-approve.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-consent-disable-auto-approve
    - hiecm.endpoint.p3-consent-enable-auto-approve
---

# Set an auto approval policy

## In plain words

Without a policy, the person approves every consent request from a [Health Information User (HIU)](/docs/hiecm/v3/getting-started/glossary#hiu) one at a time. An auto approval policy approves requests from one HIU automatically, within the sources, purposes and dates the person chose. Set `isApplicableForAllHIPs` to cover every facility, or list them in `includedSources`.

## Before you start

The person's explicit agreement that requests from this HIU may be approved automatically, asked as a question of its own. The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `202` with no body. The person must be able to turn the policy off at any time with the disable call.

## When it goes wrong

`404` with `ABDM-1001` means no data was found for the request. Check the HIU id.
