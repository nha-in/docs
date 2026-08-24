---
id: hiecm.flow.m2-link-care-context
type: flow
gateway: hiecm
milestone: M2
title: Link a care context
summary: >
  Tell ABDM that this patient had a visit at your facility.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-1035]
  endpoints: [hiecm.endpoint.link-add-contexts]
---

## In plain words

Linking a care context makes a visit discoverable. A failure here often
returns ABDM-1035 or ABDM-1037.

## What happens

Your system calls the add-contexts endpoint and waits for the callback.
