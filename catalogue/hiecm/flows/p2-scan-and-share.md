---
id: hiecm.flow.p2-scan-and-share
type: flow
gateway: hiecm
milestone: P2
version: abdm-v3
title: Share a profile at a facility by scanning its code
summary: Let a person scan the code on a hospital counter and hand over their
  health address and profile, so registration happens without a form and later
  records find their way back to them.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p2.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p2.mdx#p2-scan-and-share.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.p2-patient-share
    - hiecm.endpoint.p2-profile-on-share
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.care-context
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.hie-cm
    - shared.glossary.hip
    - shared.glossary.hpid
    - shared.glossary.phr
---

# Share a profile at a facility by scanning its code

## In plain words

The facility displays a QR code holding a URL with two parameters: the HIP ID
and a facility defined context such as a counter code. Your app scans it, then:

1. Shows the user what will be shared.
2. Takes consent in the specified wording. It covers sharing the ABHA address
   and profile with that facility for registration, and the facility linking
   any records it generates.
3. Calls the [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) to share
   the details.
4. Waits for the facility, currently expected to respond within 30 seconds.
5. Displays the token number if the facility returned one.

Counter names arrive in the QR code: 1 to 250 characters, letters, digits and
spaces, with `.`, `-` and `_` allowed between them. A counter name cannot be the facility ID, the
[HPID](/docs/hiecm/v3/getting-started/glossary#hpid), the HIP ID or the HIP
name.

Records from that visit are linked to the person from the start, so discovery
is never needed for them.

## Before you start

The person is signed in and holds an ABHA address. Your app can read a QR code and take the HIP ID and the counter context out of its URL.

## What happens

Show what will be shared and take consent in the specified wording. Call `/api/hiecm/patient-share/v3/share` with `intent` set to `PROFILE_SHARE` and `metaData` carrying the `hipId` and the counter `context`. The facility's answer arrives on `/api/v3/hiu/patient/on-share`.

## How you know it worked

The acknowledgement arrives with status SUCCESS and a `profile` block carrying `tokenNumber` and `expiry`. Show the token number, because it is what the person needs at the counter, and treat its validity as the facility's to set.

## When it goes wrong

No answer within 30 seconds needs a screen that says so, not a spinner that never ends. A counter name that is really the facility ID or the HIP name leaves the person unable to tell counters apart. Consent taken in your own wording rather than the specified wording is a certification problem.
