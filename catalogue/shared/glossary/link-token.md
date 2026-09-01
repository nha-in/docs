---
id: shared.glossary.link-token
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Link token, the token that authorises linking
summary: >
  The token that authorises your system to link a care context to a
  patient's ABHA address.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# Link token, the token that authorises linking

## In plain words

The token that authorises your system to link a [care context](care-
context.md) to a patient's [ABHA address](abha-address.md); your system
obtains it when the patient registers and stores it against that
patient. NHA's M2 document gives it a validity of six months and says to
validate it before use. If you do not hold a valid one, regenerate it
through demographic authentication before you link.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say how long a link token lasts and what to do when it has expired.

## When it goes wrong

Using a stored token without checking it. NHA gives it six months of
validity and says to validate before use. If you do not hold a valid
one, regenerate it through demographic authentication before linking.
