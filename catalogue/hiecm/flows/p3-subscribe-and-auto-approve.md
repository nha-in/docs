---
id: hiecm.flow.p3-subscribe-and-auto-approve
type: flow
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscribe to a user's account and set an auto approval policy
summary: >
  Ask a person's permission to hear about changes to their health
  account, then set the policy that stops them approving a request every
  time a hospital adds a record.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p3.yaml
    fetched: 2026-09-04
    hash: sha256:f24958ad08da0e2b8063682ddbec4d71a0134a2da3d85f2a8b8b651c59349121
    note: >
      NHA's P3 file as ingested on this branch. The PHR error codes are
      recorded once against P1 rather than repeated here.
  - file: site/docs/hiecm/v3/milestones/p3.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P3 milestone page, compiled from NHA's PHR application
      document. The four notification kinds, the three auto approval
      steps and the screen requirements come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document: 120 operations with their paths, request
      bodies and error scenarios. It is where the endpoint atoms this
      flow cites come from.
verified:
  status: unverified
  against: docs-only
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
    - shared.glossary.care-context
    - shared.glossary.hie-cm
    - shared.glossary.phr
skills:
  - hiecm-p3-build
---

## In plain words

A subscription is how an application hears about changes to a person's
health account without asking repeatedly. An auto approval policy is what
stops the person being asked to approve a consent request every time a
hospital adds one record.

Both are permissions the person gives, and both must be as easy to
withdraw as they were to give.

## Before you start

Three things must already be true, each checkable:

- The person is signed in and holds an
  [ABHA address](shared.glossary.abha-address). See
  [sign a user in](p1-login.md).
- You can receive and surface device notifications, because that is what
  a subscription produces.
- You have screens to list subscriptions, approve them, deny them and
  edit them. Editing covers health information types, types of visit and
  the time period.

## What happens

1. **Ask before you subscribe.** The person's consent comes first, not
   after the subscription exists.
2. **Create the subscription.** An approved subscription tells your
   application about four things: a new
   [care context](hiecm.concept.care-context), a modified care context,
   a new consent request, and a new subscription request. Surface each as
   a device notification.
3. **Ask whether records may be retrieved automatically.** This is a
   second question, not the same one.
4. **Set up the auto approval policy with the
   [HIE-CM](shared.glossary.hie-cm),** and save the auto
   approval id it returns. Without that id you cannot manage or withdraw
   the policy later.

Set a subscription up at address creation and at first login on a new
install, which are the two moments a person has no history to lose.

While a policy is active, a consent request raised on a new or updated
care context notification is granted at once and your application fetches
the record. Disable the policy and a request arrives for each record
instead, which is the system working correctly rather than failing.

## How you know it worked

The subscription is listed as approved on your own subscriptions screen,
and a change to the person's account produces a notification your
application receives.

For the policy, the HIE-CM returned an auto approval id and you stored
it. The observable proof is the next new care context: a consent request
raised against it is granted without the person being asked.

## When it goes wrong

The failures these sources document, in rough order of frequency:

- A policy with no stored auto approval id, which leaves the person
  unable to turn it off. The person must be able to disable a policy at
  any time.
- A subscription created before the person was asked, which is a consent
  failure rather than a technical one.
- Notifications received but not surfaced, so the application knows about
  a new record and the person does not.
