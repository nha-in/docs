---
id: hiecm.concept.playbook-hiu-software
type: concept
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Building software that reads records with consent, the HIU, with M1 and M3
summary: >
  What software has to do to read a patient's records held elsewhere: ask the
  patient, wait for their answer, then request, receive and unlock the
  records they allowed.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/index.mdx
    fetched: 2026-10-03
    hash: sha256:79bccae8506ce0cc24668357c0f2e855fb14d764ea3e7286924b0be1e622c8dc
    note: >
      site/docs/hiecm/v3/milestones/index.mdx. Which milestones a Health
      Information User needs.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m3.mdx
    fetched: 2026-10-03
    hash: sha256:0a86c99c35671087c5c6137324aa74294c07ca326116297781ba1d17f8ed26af
    note: >
      site/docs/hiecm/v3/milestones/m3.mdx. Key functionalities, who M3
      applies to, the prerequisites and the three journeys.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/consent.mdx
    fetched: 2026-10-03
    hash: sha256:74c5110506df29c30d455f318f78df86985440ff60dbe929bf680ce0f02fe7fa
    note: >
      site/docs/hiecm/v3/concepts/consent.mdx. The five consent states, the
      two clocks, expiry and revocation.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/participants/insurer.md
    fetched: 2026-10-03
    hash: sha256:205732f02ad4fd044012b98dfbe4d590d801f530600905c5586516647caafbd5
    note: >
      site/docs/hiecm/v3/concepts/participants/insurer.md. What an HIU that
      is not a facility confirms at onboarding.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/resources/test-cases/index.mdx
    fetched: 2026-10-03
    hash: sha256:23f6a19eb1601783d94585a8600dd11e92adb2fde5cef7c6450341a02ffad16f
    note: >
      site/docs/hiecm/v3/resources/test-cases/index.mdx. What the cases are,
      who runs them and the count per module.
related:
  flows:
    - hiecm.flow.journey-consent-to-records
    - hiecm.flow.m3-request-consent
    - hiecm.flow.m3-fetch-records
    - hiecm.flow.m4-link-bridge
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.m3-plural-artefacts-and-codes
    - hiecm.concept.roles
    - hiecm.concept.playbook-hip-software
  troubleshooting:
    - hiecm.troubleshooting.consent-requested-after-patient-approved
    - hiecm.troubleshooting.no-callback-on-my-server
    - hiecm.troubleshooting.unauthorized-on-an-api-call
  errors:
    - hiecm.error.abdm-1040
    - hiecm.error.abdm-1062
    - hiecm.error.abdm-1112
  glossary:
    - hiecm.glossary.hiu
    - hiecm.glossary.m1
    - hiecm.glossary.m3
    - hiecm.glossary.purpose-of-use
  sandbox:
    - shared.sandbox.sandbox-to-hip-or-hiu-id
    - shared.sandbox.going-live
---

# Building software that reads records with consent, the HIU, with M1 and M3

## In plain words

Some software needs to read a record it did not create. A doctor wants a
scan done at another hospital. An insurer checks a claim. A referral service
needs the history. In ABDM whoever asks to read a record is a Health
Information User, or [HIU](/docs/hiecm/v3/getting-started/glossary#hiu).

An HIU never takes a record. It asks the patient, and the patient says yes or
no in their own health app. On a yes, the HIU asks the record holder for the
records, receives them locked, and unlocks them. The patient can withdraw the
permission at any time.

Two milestones cover this, built in order.

| Milestone | In plain words | What it produces |
| --- | --- | --- |
| [M1 Identity](/docs/hiecm/v3/milestones/m1) | Know the patient | The gateway session token, and the patient's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address), which every consent request names |
| [M3 Health Information User](/docs/hiecm/v3/milestones/m3) | Ask, then read | A consent request, the consent artefacts a grant creates, a health information request, and the decrypted records |

M2 is not needed to read records. A facility that also shares its own records
adds it: see [software for a HIP](playbook-hip-software.md).

## What M3 needs before it can run

- Milestone 1 is complete.
- The entity or application is registered in NHPR to perform the HIU role,
  and its bridge is linked with type `HIU`. See
  [from sandbox registration to a HIU ID](../../shared/sandbox/sandbox-to-hip-or-hiu-id.md).
- A callback URL is registered and reachable from the public internet.
- You expose a `dataPushUrl` that accepts the encrypted records.

An HIU that is not a health facility, such as an insurer, confirms at
onboarding which registry entry it holds. The Health Facility Registry lists
hospitals, clinics, laboratories, imaging centres, pharmacies and blood
banks, and does not list insurers. Build M1 and M3 meanwhile.

## What M3 produces, in order

1. **A consent request.** It names the patient, the purpose, the kinds of
   record and the date range. You receive a consent request id.
2. **The consent status.** Granted, Denied, Revoked or Expired, and on a
   grant the id of every consent artefact created. One grant can create
   several, one for each record holder.
3. **The health information request.** Made against a valid artefact, with
   your `dataPushUrl` and your public key.
4. **The records.** Received encrypted, decrypted, and shown in a readable
   form. You then report receipt.

The exchange, with the record holder's side, is told end to end in
[consent request to records received](../flows/journey-consent-to-records.md).

## What is tested

An empanelled functional testing agency runs the test cases against what you
built. Testing runs once, for the whole integration.

| Module | What the cases cover | Cases |
| --- | --- | --- |
| M1 | ABHA creation, verification, profile update and profile sharing | [66 cases](/docs/hiecm/v3/resources/test-cases/m1) |
| M3 | Consent requests, and fetching records from other providers | [Not yet published](/docs/hiecm/v3/resources/test-cases/m3) |

## Where to start

1. Apply for sandbox access and register the callback URL. See
   [sandbox access](/docs/hiecm/v3/getting-started/sandbox).
2. Build the gateway session call from M1.
3. Raise one consent request against a sandbox ABHA address, and answer it
   in a PHR app signed in to that address.
4. Use a maintained implementation of the key exchange for decryption. Do
   not write it yourself.

## What usually goes wrong

- **Storing only the first artefact id.** A grant can carry several. Store
  and fetch every one.
- **Treating a grant as permanent.** Every fetch is a fresh permission check.
  Revoked and Expired are ordinary outcomes, not faults.
- **Asking for dates outside the artefact.** A wider window is refused, not
  trimmed.
- **Losing the private key.** Keep it until the transfer completes, or the
  data cannot be decrypted.
- **Reporting receipt early.** Records can span several pages. Collect every
  page before you report.
- **Checking the wrong URL.** The records arrive at the `dataPushUrl` you
  sent, not at your registered callback URL.
- **Retrying a denial.** Denied is the patient's answer. No retry changes it.
- **The request stays in Requested.** See
  [approved, but still Requested](../troubleshooting/consent-requested-after-patient-approved.md).

## How you know it worked

You have understood this when you can answer two questions. What do you hold
after a patient grants a request, and is it one thing or several? Where do
the records arrive, and who sends them?

## Questions this answers

- How do I read a patient's records from another hospital through ABDM?
- Which milestones does a HIU need?
- Does an insurer need a facility ID to act as a HIU?
- What does M3 produce and in what order should I build it?
- What usually goes wrong when fetching records with consent?
