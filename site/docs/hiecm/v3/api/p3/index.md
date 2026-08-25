---
title: P3 PHR consent and notifications
sidebar_label: Overview
sidebar_position: 0
description: How a patient grants, reviews and revokes consent, and how they are told any of it happened.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-p3.yaml
---

# P3 PHR consent and notifications

P3 is the other side of [M3](/docs/hiecm/v3/api/m3). M3 is a requester asking for records; P3 is the patient deciding.

## What is in it

Consent requests received, artefacts granted, revocation, and the notification feed that surfaces all of it.

Build for revocation from the start. A consent that worked yesterday can be withdrawn today, and that is the system working correctly.

## Where this comes from

Derived from NHA's Aarogya Setu collection rather than from a specification. Nothing here has been run against the sandbox from this repository.

The full operation list is in the [P3 PHR consent and notifications API reference](/reference/hiecm-p3).
