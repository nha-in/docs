---
id: hiecm.flow.p3-subscribe-and-auto-approve
type: flow
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscribe to a user's account and set an auto approval policy
summary: Ask a person's permission to hear about changes to their health
  account, then set the policy that stops them approving a request every time a
  hospital adds a record.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/milestones/p3.mdx#p3-subscribe-and-auto-approve. Edit
      the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.p3-subscription-init
    - hiecm.endpoint.p3-consent-auto-approve
    - hiecm.endpoint.p3-approve-subscription-request
    - hiecm.endpoint.p3-consent-enable-auto-approve
    - hiecm.endpoint.p3-consent-disable-auto-approve
    - hiecm.endpoint.p3-get-all-subscription-requests-for-an-abha-address
  flows:
    - hiecm.flow.p3-fetch-records
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.consent-artefact
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.hie-cm
    - shared.glossary.phr
---

# Subscribe to a user's account and set an auto approval policy

## In plain words

1. Ask the user to confirm your app may retrieve new linked records
   automatically.
2. Set up an auto approval policy with the
   [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm).

While the policy is active, the consent request you raise on a new or updated
care context notification is granted immediately, and you fetch and store the
record. Disable the policy and a request arrives for each record instead.

The user must be able to disable the policy at any time, as easily as they
enabled it.

## Before you start

The person is signed in, a subscription is approved, and the app can surface device notifications.

## What happens

Ask the two questions separately: whether to subscribe, and whether new records may be retrieved automatically. Set the policy with `/api/hiecm/consent/v3/auto/approve`, naming the `hiu` and whether it applies to all HIPs; it answers 202 Accepted. The policy is later switched with `/api/hiecm/consent/v3/auto/approve/{consentId}/disable` and `/api/hiecm/consent/v3/auto/approve/{consentId}/enable`, where `consentId` is the auto approval id.

## How you know it worked

The next new care context produces a consent request that is granted without the person being asked, and the record is fetched.

## When it goes wrong

The app keeps no auto approval id, so the person cannot turn the policy off. A request arriving for each record after the policy is disabled is the system working, not failing.
