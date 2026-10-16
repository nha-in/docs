---
id: hiecm.concept.playbook-phr-app
type: concept
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Building a PHR app, the patient's health app, from P1 to P4
summary: >
  What a patient's health app is, the four steps to build one in order, what
  each step gives the patient, what gets tested, where to start and what
  usually goes wrong.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/index.mdx
    fetched: 2026-10-03
    hash: sha256:79bccae8506ce0cc24668357c0f2e855fb14d764ea3e7286924b0be1e622c8dc
    note: >
      site/docs/hiecm/v3/milestones/index.mdx. The four PHR milestones, and
      which milestones a PHR application needs.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p1.mdx
    fetched: 2026-10-03
    hash: sha256:556636d38af798285ee3ccd5d90e0351ab01e9c8d0aab2f2191cefe5a9930b60
    note: site/docs/hiecm/v3/milestones/p1.mdx. Creation paths, login routes, tokens and the PHR public key.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p2.mdx
    fetched: 2026-10-03
    hash: sha256:3627ab722e43c1b1a58640748fd2bd8b953d11347187e849340716de58db436a
    note: site/docs/hiecm/v3/milestones/p2.mdx. Scan and register, discovery and linking, the profile.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    fetched: 2026-10-03
    hash: sha256:c196a376b3937da6154b60c56956b941c9ff8306a91757bc2cc027b35912ebd6
    note: site/docs/hiecm/v3/milestones/p3.mdx. Subscriptions, auto approval, consent management, fetching records.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p4.mdx
    fetched: 2026-10-03
    hash: sha256:e913ada995a1082f78b5556191aa8343d451dea048a36f46cfda557583d49f89
    note: site/docs/hiecm/v3/milestones/p4.mdx. The health locker, and what processing uploaded documents needs.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/participants/phr.md
    fetched: 2026-10-03
    hash: sha256:1fccf9d9390b99f53195d55d87c243c885c06613684f78d75c4ed19380e83550
    note: >
      site/docs/hiecm/v3/concepts/participants/phr.md. The PHR application's
      two roles and the ABDM Application Directory listing.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/resources/test-cases/phr.md
    fetched: 2026-10-03
    hash: sha256:70fcecaa970157b6a94ab04013ee55d8c84a2160966b51a975ed60e11eaf9a90
    note: site/docs/hiecm/v3/resources/test-cases/phr.md. The PHR test cases page.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
    - hiecm.flow.p1-login
    - hiecm.flow.p2-scan-and-share
    - hiecm.flow.p2-discover-and-link
    - hiecm.flow.p3-subscribe-and-auto-approve
    - hiecm.flow.p3-fetch-records
    - hiecm.flow.p4-receive-records
    - hiecm.flow.journey-user-initiated-linking
    - hiecm.flow.journey-consent-to-records
  concepts:
    - hiecm.concept.phr-subscriptions
    - hiecm.concept.consent-in-a-phr-app
    - hiecm.concept.roles
  glossary:
    - shared.glossary.phr
    - hiecm.glossary.p1
    - hiecm.glossary.p2
    - hiecm.glossary.p3
    - hiecm.glossary.p4
    - hiecm.glossary.health-locker
  sandbox:
    - shared.sandbox.sandbox-to-hip-or-hiu-id
    - shared.sandbox.going-live
---

# Building a PHR app, the patient's health app, from P1 to P4

## In plain words

A PHR app is the patient's own health app. In it a person holds their health
account, finds the records hospitals hold about them, decides who may see
those records, and keeps copies for the long term. PHR stands for
[personal health record](/docs/hiecm/v3/getting-started/glossary#phr).

A patient may use the ABHA app, or a PHR app built by another organisation.
Every such app is built in the same four steps. They are
called P1, P2, P3 and P4, and they are built in that order because each one
needs the one before it.

| Step | In plain words | What the patient can do when it is built |
| --- | --- | --- |
| [P1 Registration and login](/docs/hiecm/v3/milestones/p1) | Sign up and sign in | Create a health account address and sign in to it |
| [P2 Consents Management](/docs/hiecm/v3/milestones/p2) | Profile and finding records | Manage their profile and card, share their profile at a hospital counter by scanning its code, and find and attach old records |
| [P3 Subscription](/docs/hiecm/v3/milestones/p3) | Permission and reading records | Hear about new records, approve or refuse requests to see them, withdraw a permission, and read the records in the app |
| [P4 Locker](/docs/hiecm/v3/milestones/p4) | Keeping records | Have the app collect and keep every new record for the long term |

There is no fifth step. One case adds work from the facility side: an app
that processes documents the person uploads needs certification as a Health
Locker, which requires [M2](/docs/hiecm/v3/milestones/m2). See
[health locker](../glossary/health-locker.md).

## What each step produces

**P1.** An [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address)
such as `name@abdm` for every user, by three creation paths: mobile number,
an existing 14 digit ABHA number, or Aadhaar number. Then login, by every
route: mobile number, ABHA address, ABHA number and Aadhaar number. All
three creation paths and every login route are mandatory.

**P2.** The profile, the ABHA address card and the QR code. Scan and register
at a facility. Discovery and user initiated linking, told end to end in
[user initiated linking](../flows/journey-user-initiated-linking.md).

**P3.** A subscription, so the app hears when a care context is linked or
updated. An auto approval policy the user can switch off at any time.
Screens to view, narrow, grant, deny and revoke consent. Fetching a record:
the app acts as the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu), so it
raises the consent request and the health information request itself. The
whole exchange is in
[consent request to records received](../flows/journey-consent-to-records.md).

**P4.** A health locker set up for each patient, subscribed to their ABHA
address, that turns each `LINK` or `DATA` notification into a fetched and
stored record.

## What is tested

Functional testing runs once, for the whole app, not step by step. The test
cases for a PHR application, milestones P1 to P4, are not yet published. See
[PHR application test cases](/docs/hiecm/v3/resources/test-cases/phr).

Build to the rules the milestone pages mark as mandatory or as certification
matters:

- Every login route and all three creation paths are built.
- Consent for scan and register is taken in the specified wording.
- A subscription is created only after the person agrees to it.
- The three linking outcomes show the specified messages.
- The person can disable an auto approval policy at any time.

After sandbox exit the app is listed in the ABDM Application Directory with
its official name and marketplace URLs.

## Where to start

1. Apply for sandbox access and register a callback URL. P2 and P3 answer on
   callbacks, so the URL is needed early. See
   [sandbox access](/docs/hiecm/v3/getting-started/sandbox).
2. Fetch the PHR public key from
   `GET /abha/api/v3/phr/app/login/public/certificate`. It is a different key
   from the ABHA service's, and every sensitive value in P1 is encrypted with
   it.
3. Build P1 creation by mobile number first. It needs only a mobile number
   and the OTP sent to it.
4. Then build P2, P3 and P4 in order.

## What usually goes wrong

- **Counting three steps.** The fourth, P4, is the one that keeps the
  records.
- **A duplicate ABHA address.** Show the addresses already linked to the
  mobile number or ABHA number before offering to create one.
- **The wrong token.** Calls about a patient carry `X-AUTH-TOKEN`, the
  person's login token. The gateway session token is a different token.
- **A linked record treated as a record in hand.** A linked care context is a
  pointer. Reading it needs a consent request and a health information
  request.
- **A notification treated as permission.** A subscription says a record
  exists. It gives nobody the record.
- **A grant with nothing behind it.** A granted consent with no health
  information request leaves the person with permission and no records.
- **Records fetched and not stored.** They are gone when the consent window
  closes.

## How you know it worked

You have understood this when you can answer two questions. Which of the four
steps lets a patient read a record in the app? Does your app process
documents the person uploads, and so need M2 as well?

## Questions this answers

- How to Build a PHR application
- What are the milestones in PHR creation
- Is there a Patient app in ABDM and how do I build one?
- Do I require any additional milestone rather than P1-P4 for building PHR application?
- What does each PHR milestone give the patient?
- In what order should I build P1, P2, P3 and P4?
