---
id: shared.sandbox.going-live
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: Going live, the sandbox exit process
summary: >
  What NHA's FAQ says about leaving the sandbox for production: the
  demonstration, the functional testing and security audit, the exit
  form, and what NHA does not publish about any of it.
sources:
  - url: https://abdm.gov.in/FAQ
    fetched: 2026-09-02
    status: docs-only
    note: >
      The Sandbox category, the question "What are the steps for the
      exit process from Sandbox to Production?" and the related
      questions on functional testing and security assessment.
verified:
  status: unverified
  against: docs-only
related:
  sandbox: [shared.sandbox.registration-and-credentials, shared.sandbox.wasa]
  glossary: [shared.glossary.abdm, shared.glossary.nha, shared.glossary.hip,
             shared.glossary.hiu, shared.glossary.phr, shared.glossary.abha]
  concepts: [hiecm.concept.roles]
  troubleshooting: [hiecm.troubleshooting.everything-returns-401]
---

# Going live, the sandbox exit process

## In plain words

Passing every milestone's functional tests in the sandbox is not the same as being live.
Between the two sits an exit process [NHA](../glossary/nha.md) runs once, at the end, and it is
separate from any one milestone's certification.

## Before you start

Have every milestone your role needs already certified. The
[milestones page](/docs/hiecm/v3/getting-started/milestones)'s role table says which milestones
apply to a [PHR](../glossary/phr.md) application, a [HIP](../glossary/hip.md) or a
[HIU](../glossary/hiu.md); see [roles](../../hiecm/concepts/roles.md) for what those positions
mean. NHA's FAQ describes the exit process as something you run after integration is complete,
not milestone by milestone.

You also need the [Safe to Host certificate](wasa.md) NHA requires before production, which is
its own separate audit.

## What happens

NHA's FAQ describes the exit process in four steps, in this order:

1. **Demonstration.** NHA's FAQ says you demonstrate the [ABDM](../glossary/abdm.md)
   functionalities you built to the ABDM integration team.
2. **Functional testing and security audit.** NHA's FAQ says these run after the demonstration,
   done by NHA-empanelled agencies. The [WASA](wasa.md) atom covers the security audit in
   detail.
3. **Exit form submission.** NHA's FAQ names the documents you upload with the exit form on the
   sandbox: the functional testing report and certificate, the security audit report, a signed
   undertaking document, and any other supporting document NHA asks for.
4. **A second demonstration.** NHA's FAQ says that once the earlier steps are complete, the
   ABDM team schedules a demo for the Health Tech Committee (HTC). This is a different
   demonstration from step 1, to a different audience.

NHA's FAQ does not say how long any of these four steps take, individually or together.
NHA's documents do not say what the functional testing report or the undertaking document have
to contain beyond their names, so treat the exact evidence format as something to confirm with
NHA rather than something published.

## How you know it worked

You hold production credentials: a production client id and client secret, issued after the
exit process completes. They are not the same values as your sandbox credentials.

You also switch base URLs. The [M1 conventions page](/docs/hiecm/v3/api/m1/apis) records the
sandbox and production hosts side by side. For the gateway session call, sandbox is
`https://dev.abdm.gov.in` with `X-CM-ID: sbx`, and production is `https://apis.abdm.gov.in`
with `X-CM-ID: abdm`. For the [ABHA](../glossary/abha.md) service, sandbox is
`https://abhasbx.abdm.gov.in/abha/api/v3/` and production is
`https://abha.abdm.gov.in/api/abha/v3/`. A production client id against a sandbox host, or the
reverse, fails.

NHA's FAQ does not publish what a production client id or secret looks like, so this atom does
not describe their shape beyond that they differ from sandbox values.

## When it goes wrong

Questions about the exit process itself, including where to submit the exit form or what
counts as a valid supporting document, go to
[NHA's developer forum](https://devforum.abdm.gov.in) or `integration.support@nha.gov.in`, both
named in NHA's FAQ. See [Support](/docs/support) for the report format.

If a call that worked in the sandbox fails in production, check the base URL and the `X-CM-ID`
header first: see [Everything returns 401](../../hiecm/troubleshooting/everything-returns-401.md),
which covers this exact class of failure.
