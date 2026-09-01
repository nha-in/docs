---
id: shared.glossary.ayushman-card
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Ayushman card, and why it is not an ABHA
summary: >
  The PM-JAY entitlement card that lets a beneficiary receive cashless
  treatment. It is a different scheme from ABDM and confusing it with an
  ABHA is the most common public misunderstanding.
sources:
  - url: https://nha.gov.in/PM-JAY
    status: docs-only
    note: >
      NHA's PM-JAY pages, which describe the scheme, the entitlement and
      the beneficiary identification system. The official FAQ uses the
      term golden card.
  - url: https://abdm.gov.in/abdm
    status: docs-only
    note: >
      NHA's ABDM material, which states that the Ayushman card, earlier
      known as the golden card, should not be confused with ABHA.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.abha, shared.glossary.abdm]
---

# Ayushman card, and why it is not an ABHA

## In plain words

An Ayushman card identifies someone as a beneficiary of PM-JAY, the
scheme that pays for their hospital treatment. It answers the question
"who pays".

An ABHA identifies a person's health records across the country. It
answers the question "whose records are these".

They come from two different schemes that the National Health Authority
happens to run both of. Holding one tells you nothing about the other.
Having an ABHA does not entitle anyone to free treatment, and having an
Ayushman card does not create any health record linkage.

## Before you start

Nothing. This entry exists because people arrive believing the two are
the same card.

## What happens

| | Ayushman card | ABHA |
|---|---|---|
| Scheme | PM-JAY | ABDM |
| Answers | Who pays for treatment | Whose health records these are |
| Who qualifies | Eligible families, by deprivation criteria | Anyone who wants one |
| Cost of treatment | Covered up to the scheme limit | Not covered, ABDM pays for nothing |
| How it is obtained | Identification against the beneficiary database | Self registration or assisted, in minutes |

Other names for the same card: golden card, e-card, PM-JAY card. NHA's
own FAQ still uses golden card, and older material calls the scheme
NHPM or AB-NHPM, which was its name before it was renamed PM-JAY.
Beneficiaries aged seventy and over receive it as the Ayushman Vay
Vandana card.

## How you know it worked

You can answer someone who says "I have an Ayushman card, do I need an
ABHA" without hedging. The answer is yes if they want their records
linked, because the card does not do that.

## When it goes wrong

Building a patient lookup that treats one identifier as the other. They
come from different systems with different formats, and a card number
will not resolve against any ABDM API.

Telling a citizen that creating an ABHA will get them free treatment.
It will not, and NHA's own FAQ addresses the question directly because
it is asked so often.
