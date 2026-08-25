---
title: P1 PHR identity and profile
sidebar_label: Overview
sidebar_position: 0
description: "How a patient gets into their own PHR: registration, login, the profile they see, the family members they manage."
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-p1.yaml
---

# P1 PHR identity and profile

P1 is the patient side of [M1](/docs/hiecm/v3/api/m1). M1 is how a hospital system creates an [ABHA](/docs/hiecm/v3/getting-started/glossary#abha); P1 is how the patient's own application does it, and how it maintains the account afterwards.

## What is in it

Registration and login, the profile the patient reads and edits, family members they manage on one account, and DigiLocker documents they pull in.

## Where this comes from

NHA has published no OpenAPI file for the PHR role. These operations are derived from NHA's Aarogya Setu collection, which is NHA's own PHR, so the same calls and the same error codes reach any PHR implementation.

Nothing here has been run against the sandbox from this repository.

The full operation list is in the [P1 PHR identity and profile API reference](/reference/hiecm-p1).
