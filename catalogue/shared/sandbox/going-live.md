---
id: shared.sandbox.going-live
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: Going live, the sandbox exit process
summary: >
  How an integration leaves the sandbox for production: functional testing
  and the security audit, the Health Tech Committee demonstration, then
  production credentials.
sources:
  - url: https://sandbox.abdm.gov.in/docs/integration_and_exit_process
    status: docs-only
    note: >
      NHA's canonical exit process page, linked from the FAQ answer
      below. Its own content was not directly readable at write time
      (the page returned no body to an unauthenticated fetch), so the
      steps here are taken from the FAQ, which points here as the
      fuller source.
  - url: https://abdm.gov.in/FAQ
    fetched: 2026-09-02
    status: docs-only
    note: >
      The Sandbox category, the question "What to do when my
      integration is completed? What are the next steps?", and the
      related questions on functional testing and security assessment.
  - file: site/docs/hiecm/v3/getting-started/going-live.mdx
    status: reference
    note: >
      The published Go live page: stages 4 to 6 of sandbox integration, no
      per milestone submission. The body follows it.
related:
  sandbox: [shared.sandbox.wasa]
  glossary: [shared.glossary.nha, shared.glossary.abha]
---

# Going live, the sandbox exit process

## In plain words

Working in the sandbox is not the same as being live. Sandbox integration has six stages.
Stages 1 to 3 get you access and build the milestones. Stages 4 to 6 take you to production,
and you run them once, at the end.

There is no per milestone submission. Stages 4 to 6 cover your whole integration.

## Before you start

Every milestone your integration needs works end to end. The
[milestones page](/docs/hiecm/v3/milestones) says which ones apply to each entity you build
for, a facility, an insurer or a citizen. See [roles](hiecm.concept.roles) for which role that
entity takes on a given call. Start stage 4 once all of them are complete, not milestone by
milestone.

## What happens

1. **Stage 4: functional testing and the security audit.** Before testing, you demonstrate
   the [ABDM](shared.glossary.abdm) functionality you built to the integration team.
   Empanelled agencies then run both exercises. Functional testing produces a report and a
   certificate. The security audit produces the [Safe to Host certificate](wasa.md), and the
   [WASA](wasa.md) atom covers it in detail. You then upload the exit form on the sandbox with
   four things: the functional testing report and certificate, the security audit report, a
   signed undertaking, and any other supporting document the integration team requests.
2. **Stage 5: the Health Tech Committee demonstration.** You present the integrated solution
   to the Health Tech Committee (HTC) and obtain approval for production access. The committee
   records its decision in four review stages, each with its own reviewer and date, so the
   outcome arrives as a sequence rather than a single answer.
3. **Stage 6: go live.** You move the approved integration to production. Production
   credentials are issued once the committee approves.

Confirm the format of the functional testing report and the undertaking with the integration
team before you assemble them.

## How you know it worked

You hold production credentials: a production client id and client secret. They are not the
same values as your sandbox credentials.

You also switch base URLs. For the gateway session call, sandbox is `https://dev.abdm.gov.in`
with `X-CM-ID: sbx`, and production is `https://apis.abdm.gov.in`. For the
[ABHA](shared.glossary.abha) service, sandbox is `https://abhasbx.abdm.gov.in/abha/api/v3/`. A
production client id against a sandbox host, or the reverse, fails.

A call that worked in the sandbox returns the same result against the production host.

## When it goes wrong

Questions about the exit process itself, including where to submit the exit form or what
counts as a valid supporting document, go to the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/) or
`integration.support@nha.gov.in`. See [Support](/docs/support) for the report format.

If a call that worked in the sandbox fails in production, check the base URL and the `X-CM-ID`
header first: see [Everything returns 401](/docs/hiecm/v3/troubleshooting/everything-returns-401),
which covers this exact class of failure.
