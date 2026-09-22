---
title: Personal Health Record (PHR) Application
sidebar_label: PHR application
sidebar_position: 7
description: 'The citizen facing application: its role in ABDM, the capabilities each phase adds, and why it is where consent is managed.'
covers: [hiecm.concept.phr-subscriptions]
source: PHR - Sandbox (2).docx, NHA content review of 21 September 2026, catalogue/openapi/hiecm/v3/hiecm-p1.yaml, catalogue/openapi/hiecm/v3/hiecm-p2.yaml, catalogue/openapi/hiecm/v3/hiecm-p3.yaml, catalogue/openapi/hiecm/v3/hiecm-p4.yaml
sidebar_class_name: sidebar-icon sidebar-icon--smartphone
---

# Personal Health Record (PHR) Application

The Personal Health Record ([PHR](/docs/hiecm/v3/getting-started/glossary#phr))
application functions as the primary digital interface for the Data Principal
(citizen) within the Ayushman Bharat Digital Mission
([ABDM](/docs/hiecm/v3/getting-started/glossary#abdm)) ecosystem. It facilitates
digital identity management, provides access to longitudinal health records,
and serves as the centralized node for consent artifact management.

## Role and positioning within the ABDM architecture

The PHR application operates on behalf of the citizen and securely connects
with healthcare facilities through the
[HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm). Health data is routed
using the citizen's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address).
The PHR application acts as an [HIU](/docs/hiecm/v3/getting-started/glossary#hiu)
for fetching clinical records and as a
[HIP](/docs/hiecm/v3/getting-started/glossary#hip) for sharing user-uploaded
health documents and facility linked health documents. It must be listed in
the ABDM Application Directory after Sandbox exit with its official name and
marketplace URLs.

## Authorized capabilities and milestones

| Integration phase | Functional capabilities |
| --- | --- |
| [Phase 1 (P1)](/docs/hiecm/v3/milestones/p1) | Facilitation of ABHA number and address creation, multiple authentication (four mandated login routes). |
| [Phase 2 (P2)](/docs/hiecm/v3/milestones/p2) | Execution of facility-level Scan & Share, profile management, ABHA card and QR code generation, legacy record discovery, and standardized [Care Context](/docs/hiecm/v3/getting-started/glossary#care-context) linkage. |
| [Phase 3 (P3)](/docs/hiecm/v3/milestones/p3) | Management of user locker subscriptions and system notifications, execution of consent decisions (approval/rejection), configuration of auto-approval policies, and the secure retrieval and storage of health records. |
| Health Locker ([M2](/docs/hiecm/v3/milestones/m2)) | Processing direct document uploads by the Data Principal necessitates certification as a Health Locker (Health Repository Provider), which requires the successful completion of Milestone 2 (M2) integration. |

## Significance and ecosystem value

The PHR application platform empowers citizens by providing a central
interface for consent management and control over their health information.
Through HIE-CM, users receive notifications on the creation or modification of
Care Contexts linked to their ABHA address, enabling aggregation of
longitudinal health records based on approved consent policies. In addition,
PHR applications and Health Lockers provide secure, long-term, user-managed
storage of health records, complementing the statutory record-retention
responsibilities of healthcare establishments.

## Your app needs a server

A PHR application is two parts, whatever it looks like to the user:

- **The app on the phone** signs the person in, shows the screens and scans codes.
- **A server you run** holds the client ID and secret, mints the
  [gateway session token](/docs/hiecm/v3/concepts/gateway), and hosts the
  callback URL registered for your bridge.

Every answer to a linking, consent or data request arrives at that callback URL
as a POST, so an app with no server never hears the answer. Never ship the
client secret inside the app.

## A subscription tells you a record exists

Any facility the person visits can link a care context to their ABHA address
without your application being part of it. A subscription is how you find out:
a standing watch on one address that notifies your callback when a care context
is linked or updated.

Set one up when the person creates an address in your app, and when they sign
in with an address your install has not seen. Ask for their consent first;
signing in does not imply it.

A subscription is not consent and gives nobody a record. Reading the record
still needs a consent, which is why a subscription usually runs alongside an
auto approval policy. [P3](/docs/hiecm/v3/milestones/p3) builds both.

## Deep links

A patient who registers at a facility without an ABHA address gets an SMS
carrying a deep link of the form `phr.abdm.gov.in/uhi/(hipcode)`. Tapping it
lists approved ABHA applications in random order, filtered to the person's
operating system.

Your app must accept the HIPCODE parameter. Launched through a deep link, it
skips its login or home screen and goes straight into discovery for that HIP.
Guide the person to enter the same name, date of birth, gender and mobile
number they gave the facility, since a mismatch stops the records being found.

To be listed, submit the application name, Play Store URL and App Store URL at
sandbox exit.

## What a PHR application does not build

- **Facility side clinical records.** No
  [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundles from a hospital
  or lab system, other than records your users upload.
- **[HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and
  [HFR](/docs/hiecm/v3/getting-started/glossary#hfr) registration.**
  [M4](/docs/hiecm/v3/milestones/m4) covers the professional and facility
  registries.
- **[UHI](/docs/hiecm/v3/getting-started/glossary#uhi) and
  [NHCX](/docs/hiecm/v3/getting-started/glossary#nhcx).** Booking, and claims
  and insurance exchange, run on separate gateways.

## Next steps

- [P1 Identity and login](/docs/hiecm/v3/milestones/p1): creating an ABHA
  address and the login routes, with the [P1 API reference](/reference/hiecm-p1).
- [P2 Linking and records](/docs/hiecm/v3/milestones/p2): scan and share,
  discovery, the profile and the card, with the
  [P2 API reference](/reference/hiecm-p2).
- [P3 Consent and notifications](/docs/hiecm/v3/milestones/p3): subscriptions,
  auto approval, consent and fetching records, with the
  [P3 API reference](/reference/hiecm-p3) and the
  [P4 health locker reference](/reference/hiecm-p4).
- [Get started](/docs/hiecm/v3/getting-started/sandbox) for sandbox signup and
  your first call.
