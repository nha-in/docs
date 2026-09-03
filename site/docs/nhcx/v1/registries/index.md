---
title: Registries
sidebar_label: Participants and identifiers
description: The participant registry NHCX runs, and how ABDM's three identifiers appear on this gateway.
verification: unverified
source: NHCX__NHCX-Website_DocumentDetails.md
sidebar_position: 3
---

# Registries

NHCX has a registry of its own, and it is not a registry of people. After this page you will know
what is registered on this gateway and what is not.

## The participant registry

Every provider and every payer onboards as a participant, in sandbox first and then in
production. The participant is the entry: an organisation with a role, not a doctor and not a
patient.

The production onboarding document, row 5 of [the index](/docs/nhcx/v1), is where the role and
registry enums live, along with the validations applied to them. Row 16 is the Postman collection
for the participant service APIs. The enum values live there and are not reproduced here.

The participant service is also what a claim is routed by: NHCX sits in the middle and moves
messages between registered participants.

## ABDM's three registries

[ABHA](/docs/nhcx/v1/getting-started/glossary#abha) identifies a patient, the HPR a practitioner, the HFR a
facility. All three are ABDM wide, and a hospital that is on both gateways will already hold the
last two from its [HIE-CM](/docs/nhcx/v1/getting-started/glossary#hie-cm) onboarding.

How each appears inside a claim is not yet published. No row describes a
field, and the two gateways share no API surface, so a mapping copied from HIE-CM would be a
guess. The value sets a bundle must use are row 11.

If you need the identifiers themselves, they are written on HIE-CM:
[registries](/docs/hiecm/v3/registries) has all three, and
[M4](/docs/hiecm/v3/api/m4) is the milestone that creates the provider side.

## Next

- [Core concepts](/docs/nhcx/v1/concepts), what a claim is made of
- [NHCX](/docs/nhcx/v1), the full document index
