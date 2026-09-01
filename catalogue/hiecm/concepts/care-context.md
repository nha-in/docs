---
id: hiecm.concept.care-context
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Care contexts, how records are grouped so they can be found
summary: >
  A care context is the unit a provider links to a patient's ABHA
  address, carrying a reference number and a display name and nothing
  clinical.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: NHA milestone pack for M2.
verified:
  status: unverified
related:
  glossary: [shared.glossary.care-context]
  concepts: [hiecm.concept.roles]
---

# Care contexts, how records are grouped so they can be found

## In plain words

When your system creates a health record, ABDM does not want the record.
It wants to know that a record exists and roughly what it is about, so a
patient can find it later.

A [care context](../../shared/glossary/care-context.md) is that unit. It
holds a reference number your system understands, and a display name a
person recognises.

## Before you start

You need a facility id, and you need to be publishing rather than
reading, because linking is HIP behaviour. Read
[roles](roles.md) if you are unsure which direction you are acting in.

## What happens

The structure NHA documents is small on purpose.

```json
{
  "patient": {
    "referenceNumber": "TMH-PUID-001",
    "display": "TMH records for a patient",
    "careContexts": [
      { "referenceNumber": "2375639", "display": "OPD records for 3 Oct 2022" }
    ]
  }
}
```

NHA's recommendation is one care context per outpatient visit and one per
inpatient admission. That gives an event shaped grouping a person can
recognise months later.

The consent manager is data blind. It stores these identifiers and this
display string, and never the record behind them.

## How you know it worked

You have understood this when you can answer both of these.


  1. A patient had three tests during one visit. How many care contexts,
     and why?
  2. Which of these belongs in a display name: "OPD records for 3 October",
     or "Diabetes follow up, HbA1c 8.2"?

## When it goes wrong

The failure that matters is putting clinical information in the display
name. A diagnosis or a result in that string leaks it into a system
designed never to hold it, and it is visible to anyone who can list the
patient's contexts.

The second failure is one care context per record. That produces a list
no person can navigate.

