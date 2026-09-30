---
id: shared.glossary.phr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: PHR, personal health record application
summary: >
  The patient's own app on ABDM, where a person creates and logs in with an
  ABHA address, links their records, controls consent and reads what is
  shared; built through the four PHR milestones P1 to P4.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    fetched: 2026-09-16
    hash: sha256:4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718
related: {}
---

# PHR, personal health record application

## In plain words

A personal health record application, a PHR app, is the patient's own app
on ABDM. From it a person creates an [ABHA address](abha-address.md) and logs
in with it, finds the records that facilities hold about them and links those
records to the address, decides who may see them, and reads the records they
have allowed to be shared.

To build a PHR application you implement four ABDM milestones, in order:
[P1](/docs/hiecm/v3/milestones/p1), registration and login;
[P2](/docs/hiecm/v3/milestones/p2), finding and linking records and sharing a
profile at a facility; [P3](/docs/hiecm/v3/milestones/p3), subscriptions,
consent and fetching records; and [P4](/docs/hiecm/v3/milestones/p4), a
health locker that keeps the records for the long term. P1 to P3 each mirror
a milestone on the provider side, M1 to M3, from the patient's side. P4
applies to an app that stores a person's records rather than only displaying
them.

Approval, denial and revocation of consent all reach ABDM from this
application, so it is where a patient's control over their records is
exercised.

## Before you start

You need a signed in patient, because every call in this role acts on the
account of the person holding the application.

## What happens

`p2_post_consent_v3_request_request_id_approve` is the call this application
makes when the patient agrees to a request, and the deny and revoke calls sit
beside it.

## How you know it worked

You have understood this when you can say who approves a consent request and
from which application.

## When it goes wrong

Building a consent flow that never surfaces the request to the patient, which
leaves a request that no one can act on.
