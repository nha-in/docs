---
id: shared.sandbox.wasa
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: WASA and the Safe to Host certificate
summary: >
  The security audit every integrator passes before production. It is
  done by a CERT-In empanelled auditor, on the staging URL, and it
  covers each platform separately.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/faq
    status: docs-only
    note: >
      NHA's sandbox FAQ carries nine questions on WASA. The answers below
      are drawn from them.
  - url: https://www.cert-in.org.in/PDF/Empanel_org_2021.pdf
    status: docs-only
    note: >
      The list of empanelled auditors NHA points integrators at when they
      ask where to get WASA done.
verified:
  status: unverified
  against: docs-only
related:
  sandbox: [shared.sandbox.registration-and-credentials]
---

# WASA and the Safe to Host certificate

## In plain words

WASA is the security audit of your application. You cannot go to
production without it, and it is a separate exercise from anything
functional: passing every milestone test still leaves this to do.

The output is a Safe to Host certificate, issued by an auditor NHA
accepts. If your application already holds a valid Safe to Host
certificate, you do not need to do WASA again.

## Before you start

Have the modules you intend to certify actually built. NHA is explicit
that if one audit is to cover several modules, those modules have to
exist before you apply.

## What happens

The rules that catch integrators out, in NHA's own terms:

| Question | Answer |
|---|---|
| Who does it | An auditor from the CERT-In empanelled list |
| Which URL | Conducted on the staging URL, licensed to the same application in production |
| Scope | The whole application if it has never been audited |
| Sequential modules | A later module is audited on its own, subtracting the part already certified |
| iOS, Android, website | Separate audits. One audit of a shared ABHA base URL does not cover the apps |
| After a code change | Required again if the change is major, or touches the backend. Minor changes can be ignored |
| Already hold Safe to Host | No WASA needed, unless the certificate has expired |

The scope rule is worth reading twice. If application XYZ is already in
production with a certificate and you add module A, only module A is
audited. If nothing has been audited before, the audit covers everything.

## How you know it worked

You hold a Safe to Host certificate, in date, naming the application you
are about to run in production, and covering every platform you ship.

## When it goes wrong

Assuming one audit covers every platform. It does not. An integrator
shipping a website, an Android app and an iOS app needs three.

Auditing production rather than staging. The audit is conducted on
staging and the certificate then licenses the same application in
production, so pointing an auditor at a live production URL is the wrong
way round.

Treating a backend change as minor. NHA leaves the minor case to
judgement, but anything touching the backend is named as requiring a new
audit, and discovering that at the exit gate is expensive.
