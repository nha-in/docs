# API references

Every endpoint below is generated from the specification that declares it. Each one has its own page with the headers, the body and a request you can send.

This page lists every module, including any that the role you have chosen does not use. The sidebar shows only yours.

## Session

1 endpoint, with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-session)

## Coverage eligibility

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-eligibility)

## Pre-authorisation

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-preauth)

## Predetermination

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-predetermination)

## Claim

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-claim)

## Reprocess, cancel and shortfall

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-task)

## Payment notice

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-payment-notice)

## Communication

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-communication)

## Status and search

6 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-status)

## Insurance plan

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-insurance-plan)

## Participant registry

23 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-registry)

## Onboarding

5 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-onboarding)

## PMJAY adjudicator

4 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-adjudicator)

## Other

12 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-other)

## ABHA biometric authentication

6 endpoints, each with its own page in the sidebar.

[Read the whole specification](/docs/pr-29/reference/nhcx-biometric)

## Callbacks with no documented trigger

2 callbacks are declared at module level with no call named against them. Which call produces each one is not documented, so this page does not say.

| Module                          | Method | Arrives at                                                                                         | What it carries                                     |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Reprocess, cancel and shortfall | POST   | [`/v1/task/submit`](/docs/pr-29/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-submit)       | Receive task submit (reprocess or cancel)           |
| Reprocess, cancel and shortfall | POST   | [`/v1/task/on_submit`](/docs/pr-29/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-on-submit) | Receive task callback (reprocess or cancel outcome) |
