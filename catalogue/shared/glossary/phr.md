---
id: shared.glossary.phr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: PHR, personal health record application
summary: >
  The application a patient uses to see consent requests and to approve,
  deny or revoke them.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/consent-management-data-flow.yaml
    fetched: 2026-09-16
    hash: sha256:4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718
related: {}
---

# PHR, personal health record application

## In plain words

A personal health record application is the patient's own side of ABDM. The
specification describes what a patient does from it:

> This API endpoint is used to deny a consent request from the Personal
> Health Record (PHR) or mobile application. By invoking this API, users can
> reject a consent request, preventing the Health Information User (HIU) from
> accessing their health data.

Approval, denial and revocation all reach ABDM from this application, so it
is where a patient's control over their records is exercised.

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
