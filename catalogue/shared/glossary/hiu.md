---
id: shared.glossary.hiu
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIU, Health Information User
summary: >
  The role played by a system that asks to read someone else's health
  records.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 3.docx
    status: not-yet-hashed
    note: NHA milestone pack for M3.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles, hiecm.concept.consent-artefact]
---

# HIU, Health Information User

## In plain words

A doctor's console, an insurer, a referral system or an analytics product
acts as an HIU when it requests consent and then fetches records. The HIU
never gets data without a granted consent artefact, and the patient can
revoke that at any time.

This is the M3 role.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIU is without using the acronym itself.

## When it goes wrong

Building as though consent were permanent. A consent that worked yesterday can be revoked today, so handle the revoked state from the start.

