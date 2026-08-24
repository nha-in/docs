---
id: shared.glossary.care-context
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Care context
summary: >
  A named group of a patient's health records at one facility, such as
  one outpatient visit.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.care-context]
---

# Care context

## In plain words

A care context is how a provider groups records so they can be found
later. It carries only two things: a reference number that the provider
uses internally, and a display name a person can recognise, such as "OPD
records for 3 October 2022".

It deliberately carries no clinical detail, because the consent manager
is data blind.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what Care context is without using the acronym itself.

## When it goes wrong

Putting a diagnosis or a test result in the display name. That leaks clinical information into a system designed never to hold it.

