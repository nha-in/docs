---
id: hiecm.flow.p2-discover-and-link
type: flow
gateway: hiecm
milestone: P2
version: abdm-v3
title: Find records held elsewhere and link them
summary: Let a person search for a facility they visited, discover the records
  it holds for them, and attach those records to their health address after an
  OTP confirms it is them.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p2.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p2.mdx#p2-discover-and-link.
      Edit the page, never this file.
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
    - shared.glossary.discovery
    - shared.glossary.hip
    - shared.glossary.hrp
    - shared.glossary.otp
    - shared.glossary.phr
---

# Find records held elsewhere and link them

## In plain words

The user searches for the facility by name. Only participating facilities
appear, and the facility must be a HIP linked to an
[HRP](/docs/hiecm/v3/getting-started/glossary#hrp). Your app sends a discovery
request carrying the HIP ID and unverified identifiers of type `MR`, `MOBILE`,
`ABHA_NUMBER` or `ABHA_ADDRESS`.

The user selects care contexts and confirms. The HIP sends an
[OTP](/docs/hiecm/v3/getting-started/glossary#otp) to the registered mobile
number, and on successful verification the care contexts link to the ABHA
address.

The same flow works for government health programmes such as CoWIN, AB-PMJAY,
e-Sanjeevani OPD, e-Sanjeevani HWC and RCH, each with a programme specific
optional field.

Three failures have specified copy.

| Situation | Message |
| --- | --- |
| The HIP is unreachable | "Couldn't Connect: We are sorry. Unable to contact your hospital. Please try again later" |
| The user never visited the facility | "No health records found" |
| Everything is already linked | "No new health record to link: Records of all visits are already linked and there is nothing new to link" |

Records should arrive within 2 hours.

## Before you start

The person is signed in and holds an ABHA address. Your search lists only facilities that are HIPs with an active bridge link. Discovery answers on a callback, so your app holds the request open across it.

## What happens

Discover with `/api/hiecm/user-initiated-linking/v3/patient/care-context/discover`, carrying the `hip` and the `unverifiedIdentifiers`; the care contexts arrive on `/api/v3/hiu/patient/care-context/on-discover`. Show only those not already linked. Start the link with `/api/hiecm/user-initiated-linking/v3/link/care-context/init`, answered on `/api/v3/hiu/patient/care-context/on-init`, then confirm with the OTP at `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm`, answered on `/api/v3/hiu/patient/care-context/on-confirm`.

## How you know it worked

The on-confirm callback lists the linked care contexts, and discovery against the same facility now returns them as already linked rather than as new. A linked care context is not a record in hand: fetching it is a consent flow, see [P3](/docs/hiecm/v3/milestones/p3#p3-fetch-records).

## When it goes wrong

The facility does not answer: show the specified unreachable message. Nothing comes back, often because the name or date of birth given at the facility differs from the profile. Everything comes back already linked: that is the third specified message, not an error. The OTP goes to the mobile the facility registered, which the person may no longer use.
