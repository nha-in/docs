---
id: hiecm.flow.p2-discover-and-link
type: flow
gateway: hiecm
milestone: P2
version: abdm-v3
title: Find records held elsewhere and link them
summary: >
  Let a person search for a facility they visited, discover the records
  it holds for them, and attach those records to their health address
  after an OTP confirms it is them.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p2.yaml
    fetched: 2026-09-04
    hash: sha256:ec3f4f0f682a59a2e861a762ae86c62e98ae8fa15997ff86f900c89b2e8e0498
    note: >
      NHA's P2 file as ingested on this branch. The PHR error codes are
      recorded once against P1 rather than repeated here.
  - file: site/docs/hiecm/v3/milestones/p2.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P2 milestone page, compiled from NHA's PHR application
      document. The discovery fields, the three specified messages, the
      10 second answer and the 2 hour record window come from here.
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
    - hiecm.endpoint.p2-care-context-discover
    - hiecm.endpoint.p2-link-care-context-init
    - hiecm.endpoint.p2-link-care-context-confirm
    - hiecm.endpoint.p2-all-providers
    - hiecm.endpoint.p2-provider-by-provider-id
    - hiecm.endpoint.p2-govt-programs
  flows:
    - hiecm.flow.p2-scan-and-share
    - hiecm.flow.p3-fetch-records
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.care-context
    - hiecm.concept.asynchronous-callbacks
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.care-context
    - shared.glossary.discovery
    - shared.glossary.hip
    - shared.glossary.hrp
    - shared.glossary.otp
    - shared.glossary.phr
skills:
  - hiecm-p2-build
---

## In plain words

A person visits a hospital and gives no health address. The hospital
still holds their records. Discovery is how their own application finds
those records afterwards, and linking is how the records become part of
the person's account.

This is the mirror of [M2](shared.glossary.m2). There, a
provider publishes a [care context](hiecm.concept.care-context). Here,
the person finds one and claims it.

## Before you start

Four things must already be true, each checkable:

- The person is signed in and holds an
  [ABHA address](shared.glossary.abha-address). See
  [sign a user in](p1-login.md).
- You hold a verified mobile number for them. Discovery carries it.
- You can show only participating facilities in the search. A facility
  qualifies when it is registered in the [HIP](shared.glossary.hip) role
  with an active bridge link.
- You can hold a request open across a callback. Discovery is answered
  asynchronously. See
  [asynchronous callbacks](hiecm.concept.asynchronous-callbacks).

## What happens

```mermaid
sequenceDiagram
    actor U as User
    participant A as Your PHR app
    participant CM as HIE-CM
    participant HIP as The facility
    U->>A: Searches for the facility by name
    A->>CM: Discovery request: name, year or date of birth, gender, mobile, ABHA address
    CM->>HIP: forwards the discovery request
    HIP-->>CM: care contexts it holds, expected within 10 seconds
    CM-->>A: the care contexts
    A->>U: Shows only the contexts that are not already linked
    U->>A: Selects contexts and confirms
    A->>CM: Link request
    CM->>HIP: forwards it
    HIP->>U: OTP to the registered mobile number
    U->>A: Enters the OTP
    A->>CM: Confirms with the OTP
    CM-->>A: Care contexts linked to the ABHA address
```

1. **Search, then discover.** The discovery request carries name, year or
   date of birth, gender, the verified mobile number and the ABHA
   address. A provider issued registration number is optional and
   narrows the match when the person has one.
2. **Show what came back, minus what is already linked.** Never show a
   care context that is already linked. A person offered the same record
   twice cannot tell which of the two is theirs.
3. **Let the person select and confirm.** The facility sends an
   [OTP](shared.glossary.otp) to the mobile number it has
   registered, which may not be the one in your application.
4. **Verify the OTP.** On success the care contexts link to the ABHA
   address.

The same flow serves government health programmes such as CoWIN,
AB-PMJAY, e-Sanjeevani OPD, e-Sanjeevani HWC and RCH, each with one
programme specific optional field.

Three situations have wording NHA specifies, and an application should
use it rather than its own:

| Situation | Message |
|---|---|
| The facility is unreachable | "Couldn't Connect: We are sorry. Unable to contact your hospital. Please try again later" |
| The person never visited | "No health records found" |
| Everything is already linked | "No new health record to link: Records of all visits are already linked and there is nothing new to link" |

The three calls this flow makes are published on the consent manager, under
`/api/hiecm/user-initiated-linking/v3/`. The endpoint atoms carry them.

## How you know it worked

The care contexts the person selected are linked to their ABHA address,
and running discovery against that facility again returns them as already
linked rather than as new. The records themselves should arrive within
two hours.

A linked care context is not a record in hand. Fetching what a link
points at is a consent flow. See
[fetch the records](p3-fetch-records.md).

## When it goes wrong

The failures these sources document, in rough order of frequency:

- The facility does not answer inside the expected 10 seconds, which is
  the unreachable case and has its own specified wording.
- Nothing comes back, because the person gave a different name or date of
  birth at the facility than they hold in their profile.
- Everything comes back already linked, which is the third specified
  message and not an error.
- The OTP goes to the mobile number the facility registered, which the
  person may no longer use.
