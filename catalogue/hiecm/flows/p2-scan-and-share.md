---
id: hiecm.flow.p2-scan-and-share
type: flow
gateway: hiecm
milestone: P2
version: abdm-v3
title: Share a profile at a facility by scanning its code
summary: >
  Let a person scan the code on a hospital counter and hand over their
  health address and profile, so registration happens without a form and
  later records find their way back to them.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p2.yaml
    fetched: 2026-09-04
    hash: sha256:ec3f4f0f682a59a2e861a762ae86c62e98ae8fa15997ff86f900c89b2e8e0498
    note: >
      NHA's P2 file as ingested on this branch.
  - file: catalogue/openapi/.raw/nha-2026-09-05/NewDocumant-PHR-app.docx
    fetched: 2026-09-05
    hash: sha256:4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542
    note: >
      NHA's PHR application document. Source of the one token rule and of the
      disagreement between its narrative and its test case over how long a
      token lasts.
  - file: site/docs/hiecm/v3/milestones/p2.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P2 milestone page. The five steps, the 30 second wait and the
      counter name rules come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document: 120 operations with their paths, request
      bodies and error scenarios. It is where the endpoint atoms this
      flow cites come from.
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
skills:
  - hiecm-p2-build
---

## In plain words

A facility puts a code on its counter. A person scans it with their own
application, agrees to share, and the facility registers them without
anyone typing a name. Any records that visit produces are linked to the
person from the start, so discovery is never needed for them.

## Before you start

Three things must already be true, each checkable:

- The person is signed in and holds an
  [ABHA address](shared.glossary.abha-address). See
  [sign a user in](p1-login.md).
- Your application can read a code and take the two parameters out of the
  URL it holds: the HIP id and a facility defined context such as a
  counter code.
- You can hold a screen open for up to 30 seconds while the facility
  answers, and say what is happening while it does.

## What happens

1. **Scan and read.** The code holds a URL carrying the HIP id and the
   counter context.
2. **Show the person what will be shared,** before anything is sent.
3. **Take consent in the specified wording.** It covers two things: that
   the ABHA address and profile go to that facility for registration, and
   that the facility may link any records that visit generates.
4. **Call the [HIE-CM](shared.glossary.hie-cm) to share the
   details,** then wait. The facility is currently expected to answer
   within 30 seconds.
5. **Show the token number** if the facility returned one, because that
   is the thing the person needs at the counter.

6. **Hold the person to one token.** NHA asks that the application not let
   them generate a second one straight away.

Counter names arrive in the code: up to 20 alphanumeric characters, no
special characters. A counter name cannot be the facility id, the
[HPID](shared.glossary.hpid), the HIP id or the HIP name.

**How long a token lasts, and how long before another, are stated twice and
do not agree.** NHA's narrative says the application must not allow a second
token for 60 minutes. Its test case for the same screen says the token is
valid for 30 minutes and that the duration is configurable. Neither has been
run against the sandbox from here. Build the lock at 60 minutes, which is the
stricter reading, and treat validity as something the facility sets rather
than something you can assume.

## How you know it worked

The facility answers inside the 30 second window, and where it returns a
token number your application shows it. The person is registered at that
facility without giving their details at the desk, and records from that
visit arrive already linked rather than needing discovery.

## When it goes wrong

The failures these sources document, in rough order of frequency:

- No answer inside 30 seconds, which needs a screen that says so rather
  than a spinner that never ends.
- A counter name that is really the facility id or the HIP name, which
  the rules exclude and which makes the counter unidentifiable to the
  person.
- Consent taken in your own wording rather than the specified wording,
  which is a certification problem rather than a technical one.
