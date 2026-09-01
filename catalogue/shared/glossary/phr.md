---
id: shared.glossary.phr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: PHR, Personal Health Record application
summary: >
  An application a patient uses to see their own records, link them
  and act on consent requests.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 1.docx
    status: not-yet-hashed
    note: NHA milestone pack for M1.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hip, shared.glossary.hiu]
  decisions: [shared.decision.role-model-two-axes]
---

# PHR, Personal Health Record application

## In plain words

A PHR app is the patient's side of ABDM. It is where somebody creates an
ABHA, discovers records held at facilities they visited, links them, and
approves or denies consent requests from providers.

PHR is a position, meaning which side of the HIE-CM you sit on. The
provider side is held by hospital and lab systems. Position is fixed for
the life of an application, unlike HIP and HIU, which describe single
interactions and which a PHR app takes on as well.

If you are building for the patient rather than for a facility, you are
building a PHR app, and M1 is where you start. It is not where you stop.
A PHR app that lets a patient upload a record is publishing, which is
HIP behaviour and M2 work. NHA's own sandbox documentation carries the
question of what a PHR does in M2, which is a fair sign that starting at
M1 and stopping there is the common mistake.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what PHR is without using the acronym itself.

## When it goes wrong

A PHR app still needs its own registration and credentials. It is not a client of somebody else's integration.

