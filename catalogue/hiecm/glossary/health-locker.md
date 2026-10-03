---
id: hiecm.glossary.health-locker
type: glossary
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Health locker, an app that keeps a person's records for the long term
summary: >
  A patient's health app that keeps copies of their records: it is told when
  a new record exists, fetches it with the person's permission, and stores
  it.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p4.mdx
    fetched: 2026-10-03
    hash: sha256:e913ada995a1082f78b5556191aa8343d451dea048a36f46cfda557583d49f89
    note: >
      site/docs/hiecm/v3/milestones/p4.mdx. What a health locker is, how it
      receives records, who needs it, and what processing uploaded documents
      needs.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    fetched: 2026-10-03
    hash: sha256:c196a376b3937da6154b60c56956b941c9ff8306a91757bc2cc027b35912ebd6
    note: >
      site/docs/hiecm/v3/milestones/p3.mdx. Subscriptions, auto approval and
      fetching a record.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/subscription.yaml
    hash: sha256:19e2be6557790fecf8f9b5e2374ee25bb5e432b6aa11a9f673d93a0228eb61b0
    note: >
      The setup locker operation with X-LOCKER-ID and consentAutoApprovalId,
      and the locker listing operations.
related:
  glossary:
    - hiecm.glossary.p4
    - hiecm.glossary.p3
    - hiecm.glossary.hrp
    - shared.glossary.phr
  flows:
    - hiecm.flow.p4-receive-records
    - hiecm.flow.p3-subscribe-and-auto-approve
    - hiecm.flow.p3-fetch-records
  concepts:
    - hiecm.concept.phr-subscriptions
    - hiecm.concept.playbook-phr-app
  endpoints:
    - hiecm.endpoint.p3-setup-locker
---

# Health locker, an app that keeps a person's records for the long term

## In plain words

A health locker is a patient's health app that keeps their records for the
long term, under their control. A hospital keeps the original. The locker
keeps the person's own copy.

It does three things.

1. **It subscribes.** A subscription is a standing request to be told when
   something changes on a person's health account. The locker is told when a
   hospital links a new record, and when an existing one gains new data. A
   notification carries no record.
2. **It fetches with consent.** For a new record the locker raises a consent
   request, and after the person grants it, asks the hospital for the record.
   For new data on a record it already covers, it reuses the existing
   consent.
3. **It stores.** What arrives is kept for the person's long term access.

Auto consent, also called auto approval, is what saves the person from
approving every one of those requests by hand. The person agrees once that
the app may collect new records. While that policy is on, each consent
request the app raises is granted at once. The person can switch it off at
any time.

A health locker is built by anyone whose
[PHR](/docs/hiecm/v3/getting-started/glossary#phr) application stores
records and does not only display them. It is the fourth PHR milestone,
[P4 Locker](/docs/hiecm/v3/milestones/p4), and it builds on
[P3 Subscription](/docs/hiecm/v3/milestones/p3): the same subscription and
consent calls, plus the locker setup and settings calls.

### Uploading records

P4 is about receiving and keeping records that facilities have linked. On
documents the person uploads, the rule is this: processing documents the
person uploads needs certification as a Health Locker, a
[Health Repository Provider](/docs/hiecm/v3/getting-started/glossary#hrp),
which requires [M2](/docs/hiecm/v3/milestones/m2).

### In the calls

- Set up the locker for a patient with
  `POST /api/hiecm/subscription-requests/v3/setup-locker`, sending the
  locker's identifier in `X-LOCKER-ID`. The response carries a
  `consentAutoApprovalId`.
- A subscription raised by a health locker is approved automatically, for all
  HIPs and all health information types.
- Notifications come in two categories: `LINK`, a new care context linked at
  a HIP, and `DATA`, new data on a care context already linked.
- The calls about a patient carry `X-AUTH-TOKEN`, the person's login token,
  beside the gateway session token.

How the locker turns a notification into a stored record is in
[receive and keep records as a health locker](/docs/hiecm/v3/milestones/p4#p4-receive-records).

## How you know it worked

You have understood this when you can say whether your app stores records or
only shows them, and what a notification does and does not contain.

## When it goes wrong

- **A notification arrived and no records did.** The notification only says
  that something changed. Raise the consent request, or the health
  information request under an existing consent.
- **A patient call is refused.** `X-AUTH-TOKEN` holds the gateway session
  token where it needs the person's login token.
- **P4 is left out of the count.** A PHR app has four milestones, and an app
  that keeps records needs the fourth.

## Questions this answers

- What is subscription, Auto consent and health locker?
- What is P4? Can't we use it for uploading and linking of health records
- Can user also upload records in PHR application and will they get linked to ABHA Address?
- What is a health locker in ABDM?
- Who needs to build a health locker?
- Does a subscription notification contain the health record?
