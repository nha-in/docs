---
id: shared.glossary.dsc
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: DSC, Digital Solution Company
summary: >
  NHA's term for the company that builds ABDM compliant software for
  patients or health facilities. It is the entity that certifies, as
  distinct from the software that integrates.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's Getting Started page, which defines DSCs as organizations
      that provide software to patients or health facilities and names
      them the primary users of the sandbox.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.hrp, shared.glossary.hip, shared.glossary.hiu]
  decisions: [shared.decision.role-model-two-axes]
---

# DSC, Digital Solution Company

## In plain words

A DSC is the company that makes the software. NHA's own words: an
organization that provides software to patients or health facilities,
and the primary user of the sandbox.

If you are reading this because you build an HMIS, an EMR, a lab system
or a patient app and you want to connect it to ABDM, you are a DSC. The
sandbox account, the certification and the production credentials belong
to you. The facilities that use your software have their own separate
registration.

## Before you start

Nothing.

## What happens

The distinction that matters is company against deployment. A DSC
certifies a product once. Each facility running it then registers
separately in the Health Facility Registry and is linked to your
software.

So one DSC leads to many facilities, and the identifiers do not
interchange. Your client id identifies your software. The facility id
identifies whose records you are acting on, and it travels in the
`X-HIP-ID` header per call.

Certification is per milestone, and the milestones follow what your
software does rather than what kind of product it is.

## How you know it worked

You can say which identifier answers which question: the client id says
which software is calling, and the facility id says on whose behalf.

## When it goes wrong

Assuming certification covers the facilities too. It does not. A
certified product still cannot act for a facility that is not registered
and linked, and that is a common cause of an authorisation failure that
looks like a credentials problem.
