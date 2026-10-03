---
id: hiecm.concept.playbook-hip-software
type: concept
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Building software for a facility that shares records, the HIP, with M1 and M2
summary: >
  What hospital, clinic, lab or pharmacy software has to do to share the
  records it creates: identify the patient, attach each visit to their health
  account, and send the record when the patient allows it.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/index.mdx
    fetched: 2026-10-03
    hash: sha256:79bccae8506ce0cc24668357c0f2e855fb14d764ea3e7286924b0be1e622c8dc
    note: >
      site/docs/hiecm/v3/milestones/index.mdx. Which milestones facility
      software needs, and that the facility ID does not have to come from M4.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m2.mdx
    fetched: 2026-10-03
    hash: sha256:7547c4e326a6eb97ef5eea84731cf865839943b762c2c504232e597c96e2a84e
    note: >
      site/docs/hiecm/v3/milestones/m2.mdx. M2 functionalities, the three
      prerequisites, the eight HI types and the three journeys.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    fetched: 2026-10-03
    hash: sha256:0b835b84b8595445a6bb7d25ae9d232f5267ba455c76138601cd8b39d0268dda
    note: site/docs/hiecm/v3/milestones/m1.mdx. What M1 covers and what it does not.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/hip-hiu.md
    fetched: 2026-10-03
    hash: sha256:217a8565c096fa08554b2692b350c798261effe34a7a98315f38184df471d363
    note: >
      site/docs/hiecm/v3/concepts/hip-hiu.md. The five things M2 needs, how
      linking fits a clinical workflow, the end to end sandbox check, and
      what a HIP does not build.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/resources/test-cases/index.mdx
    fetched: 2026-10-03
    hash: sha256:23f6a19eb1601783d94585a8600dd11e92adb2fde5cef7c6450341a02ffad16f
    note: >
      site/docs/hiecm/v3/resources/test-cases/index.mdx. What the cases are,
      who runs them, the markings and the count per module.
related:
  flows:
    - hiecm.flow.journey-hip-initiated-linking
    - hiecm.flow.journey-user-initiated-linking
    - hiecm.flow.journey-consent-to-records
    - hiecm.flow.m2-link-care-context
    - hiecm.flow.m4-link-bridge
  concepts:
    - hiecm.concept.care-context
    - hiecm.concept.roles
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.playbook-hiu-software
  troubleshooting:
    - hiecm.troubleshooting.no-callback-on-my-server
    - hiecm.troubleshooting.blocked-for-24-hours-on-generate-token
    - hiecm.troubleshooting.linked-but-patient-sees-no-record
    - hiecm.troubleshooting.hip-did-not-acknowledge-consent-notify
  glossary:
    - hiecm.glossary.hip
    - hiecm.glossary.m1
    - hiecm.glossary.m2
    - hiecm.glossary.link-token
  sandbox:
    - shared.sandbox.sandbox-to-hip-or-hiu-id
    - shared.sandbox.going-live
---

# Building software for a facility that shares records, the HIP, with M1 and M2

## In plain words

A hospital, clinic, laboratory or pharmacy creates health records. In ABDM a
facility that shares the records it creates is a Health Information Provider,
or [HIP](/docs/hiecm/v3/getting-started/glossary#hip). Your software is what
makes the facility one.

The software has three jobs. It identifies the patient by their health
account at the front desk. It tells ABDM that a visit happened, so the
patient can find it. And when the patient allows someone to see a record, it
sends that record, locked so only the receiver can open it.

Two milestones cover this, built in order.

| Milestone | In plain words | What it produces |
| --- | --- | --- |
| [M1 Identity](/docs/hiecm/v3/milestones/m1) | The front desk | Create an [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) for a patient who has none, verify one they have, read and update the profile. No record is shared in M1 |
| [M2 Health Information Provider](/docs/hiecm/v3/milestones/m2) | Attach and share | Records in [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) format, visits linked to the patient's ABHA address, discovery answered, and encrypted records sent on request |

A facility that also reads records created elsewhere adds
[M3](/docs/hiecm/v3/milestones/m3): see
[software acting as a HIU](playbook-hiu-software.md).

## What M2 needs before it can run

M2 has three prerequisites, and none of them is code.

1. The facility is registered in the Health Facility Registry and holds a
   facility ID.
2. That facility ID is mapped to your client ID, so callbacks reach you.
3. A callback URL is set against your client ID.

The facility ID does not have to come from
[M4](/docs/hiecm/v3/milestones/m4). A facility can be registered by hand on
the NHPR portal. Build M4 when you want to register facilities or
professionals from your own software. The whole procedure is in
[from sandbox registration to a HIP ID](../../shared/sandbox/sandbox-to-hip-or-hiu-id.md).

## What M2 produces, in order

1. **Records in the right format.** Each health information type is a FHIR
   document bundle. There are eight types, seven clinical and one billing.
2. **Care contexts.** One per outpatient visit and one per inpatient
   admission: a reference number and a display name with nothing clinical in
   it.
3. **HIP initiated linking.** See
   [HIP initiated linking from start to finish](../flows/journey-hip-initiated-linking.md).
4. **Answering discovery.** Mandatory for every HIP. See
   [user initiated linking](../flows/journey-user-initiated-linking.md).
5. **The health information request and transfer.** See
   [consent request to records received](../flows/journey-consent-to-records.md).

## What is tested

An empanelled functional testing agency runs the test cases against what you
built, and its report quotes each case by its id. Testing runs once, for the
whole integration.

| Module | What the cases cover | Cases |
| --- | --- | --- |
| M1 | ABHA creation, verification, profile update and profile sharing | [66 cases](/docs/hiecm/v3/resources/test-cases/m1) |
| M2 | Linking care contexts, and sharing the records you hold | [Not yet published](/docs/hiecm/v3/resources/test-cases/m2) |

Each M1 case is marked Mandatory, Optional, or mandatory only for private or
only for government integrators. Read the marking before you scope the build.

There is one end to end check to run yourself on the sandbox: link a care
context for a patient, request it from a PHR app with consent, and see the
record appear in that app.

## Where to start

1. Apply for sandbox access and register the callback URL. See
   [sandbox access](/docs/hiecm/v3/getting-started/sandbox).
2. Get the facility ID early. M2 cannot be tested end to end without one.
3. Build M1, starting with the gateway session call.
4. Build M2 in the order above. Most of it belongs in a background job, not
   on the clinician's screen.

## What usually goes wrong

- **Treating `202 Accepted` as success.** It is receipt. The outcome arrives
  on a callback.
- **No callback arrives.** See
  [no callback reaches my server](../troubleshooting/no-callback-on-my-server.md).
- **A new link token for every visit.** A link token is valid for six months.
  Store it against the patient and reuse it. See
  [blocked for 24 hours](../troubleshooting/blocked-for-24-hours-on-generate-token.md).
- **Linking late.** Link when the record is ready to share, not at the end of
  the month. An unlinked record is absent, not private.
- **Clinical detail in a care context name.** Somebody who has not yet proved
  they are the patient can read it during discovery.
- **Skipping discovery.** Every HIP must answer it.
- **Sending data on a dead consent.** Refuse any request under an expired or
  revoked artefact, and share only records inside the requested date range.
- **Not acknowledging the consent notification.** See
  [HIP did not acknowledge](../troubleshooting/hip-did-not-acknowledge-consent-notify.md).

A HIP does not build consent screens. Consent is collected in the patient's
app, and your software checks the artefact.

## How you know it worked

You have understood this when you can answer two questions. Which three
things must be true of the facility before the first M2 call can succeed?
Which callback, not which response, tells you a care context is linked?

## Questions this answers

- How do I make my hospital software ABDM compliant so it can share records?
- Which milestones does a HIP need?
- Do I have to build M4 to get a facility ID for M2?
- What does M2 produce and in what order should I build it?
- What is tested for M1 and M2 before go live?
