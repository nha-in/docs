---
title: Eligibility response
sidebar_label: Eligibility response
sidebar_position: 3
description: Constructing coverage eligibility answers across all 4 purposes
sidebar_class_name: sidebar-icon sidebar-icon--user-check
source: nhcx-package/docs/04-Building a Payer/03-Eligibility Response.md
generated: true
sidebar_custom_props:
  roles:
    - payer
---

# Eligibility response

The eligibility check is the one exchange a payer should answer without a human. It is asked at every registration and before every submission, and a provider that waits on it is a front desk that waits.

## What the system hosts

```
/v1/coverageeligibility/check      answer on /v1/coverageeligibility/on_check
```

Read `CoverageEligibilityRequest.purpose` and answer accordingly. Four purposes, four answers.

| Purpose | The question | What to return |
| :---- | :---- | :---- |
| `validation` | Is this coverage in force, and what is left? | `inforce`, and one benefit entry per wallet with allowed (balance) and used money |
| `discovery` | What coverages does this beneficiary have with you? | Every active coverage, so the provider can pick a policy code |
| `benefits` | For these packages, what is covered? | Per item: excluded or not, benefit type, allowed money, including stratification amounts |
| `auth-requirements` | For these packages, is preauthorisation required and what must come with it? | Per item: `authorizationRequired`, and `authorizationSupporting` listing every mandatory document and questionnaire by code |

Auth-requirements is the one that saves the most rework downstream. The `MAND` codes it returns are what the provider's document checklist is built from; the more precise they are, the fewer queries the adjudicator raises later.

## What to validate first

The reference payer refuses, with a named error, before it looks at coverage:

- An invalid purpose, or an invalid identifier.
- Multiple beneficiary records for one identifier.
- No hospital configuration, or a hospital not authorised for the policy.
- Items or stratifications it has no master data for.
- A quantity below one, an unknown payer ID, or a duplicate reference ID. Each becomes a protocol response with `response.error`, and each is cheaper to catch here than at preauthorisation.

Under PMJAY, also validate the biometric user token in the header. A request with neither a valid token nor the matching authentication-consent questionnaire response is not evidence of presence, and the payer's own error codes distinguish the two cases.

## What the four answers actually carry

The published samples show how much the four purposes differ. Only one of them carries money.

| Purpose | `insurance[].item[]` | Carries money | Carries `authorizationRequired` |
| :---- | :---- | :---- | :---- |
| `validation` | One item per wallet | Yes: `allowedMoney` and `usedMoney` | Yes |
| `discovery` | Every active coverage | No | No |
| `benefits` | One item per package asked about | Per package | Per package |
| `auth-requirements` | One item per package asked about | Per package | Yes, with `authorizationSupporting` |

The two money fields are a subtraction the provider has to make. A published sample carries 463,730 allowed against 36,270 used on a 500,000 family wallet, and the plan's `generalCost` reconciles with it exactly. Send both figures; do not send only the balance.

**One warning about the auth-requirements answer.** It is specified to return the mandatory documents, and the one published sample does not. That sample carries no benefit detail and no supporting-information requirements, and is indistinguishable from the plain benefits answer. A provider building its checklist from your answer alone will show an empty checklist. Populate `authorizationSupporting` properly, with the `MAND` codes and a display, and you save the adjudicator a query per case.

## What goes in the answer

A collection bundle: the `CoverageEligibilityResponse`, the `Patient` as the payer knows them, the `Coverage`, and the `Organization`s.

| Element | Set it to |
| :---- | :---- |
| `status` | `active` |
| `purpose` | Echo the request's |
| `outcome` | `complete` |
| `disposition` | One sentence a desk can read: "Policy is currently in-force" |
| `request` | Reference back to the request |
| `insurance.coverage` | The coverage found |
| `insurance.inforce` | `true` or `false` |
| `insurance.item[]` | Per wallet for validation; per package for benefits and auth-requirements |
| `item.benefit[].allowedMoney`, `usedMoney` | Balance and consumption |
| `item.authorizationRequired` | Whether preauthorisation is needed |
| `item.authorizationSupporting[]` | The mandatory document and questionnaire codes, with a display and a text saying whether pre or post |

Business refusals, "not a covered member", "policy expired", "coverage insufficient", go inside the sealed response as a `PAYR-10xx` reason, not in the envelope; the exchange never sees them. Protocol refusals go in the envelope.

## The forward instruction

The coverage eligibility specification gives it one sentence: a payer might respond with a forward instruction asking NHCX to submit the same request to another payer. No fields or flow are published for it, so there is nothing to build against. Until they are, a request for a coverage you do not hold is a business refusal inside the sealed response, as described above. Governance and Audit lists the question to ask at onboarding.

## Several purposes in one request

`purpose` allows more than one value. When a request carries several, process them in the defined order of precedence: discovery, then validation, then benefits, then authorization requirements. Never re-prioritise that order. One response addresses the applicable requirements of every purpose asked. If a request carries discovery and validation, process discovery first and then validation. Validation inherently covers discovery, so the one response satisfies both without a separate transaction. The same principle applies to any other combination.

The hospital's outbound JSON maps its own purposes onto the exchange's: `AUTHREQUIREMENTS` becomes `auth-requirements`, `BENEFITS` becomes `benefits`, and anything else becomes `validation`. Discovery is sent only when the hospital builds that purpose explicitly, so expect it rarely and only from systems that chose to.

## What the hospital screen keeps

Acknowledge within 30 seconds; decide later. Then build for what the hospital mapper keeps, which is less than the resource carries.

- The hospital wallet is `allowedMoney` plus `usedMoney` on benefit type `30` only. Wallet figures on any other benefit type never reach the screen.
- `purpose`, `outcome`, `inforce`, `status`, `disposition`, `period` and `authorizationRequired` are dropped by the hospital mapper. Do not rely on them to drive the hospital screen. Drive document collection from the insurance plan instead.
- Patient identifiers: `PI` is the case reference. Generate one if the request has none; do not reject. `ADN` is the Aadhaar number. The provider organisation carries `NPI`, yours `NIIP`.
- On discovery, identify the member from the Patient identifiers only, and return the products discoverable for that member. A request with no `Coverage` is valid here. Do not invent a product the registry has not linked.

## What to log

Every eligibility answer is a promise the provider will rely on when it registers the patient. Keep the request, the answer, the wallet figures at that moment and the plan version they came from, so that when a claim arrives against them, the adjudicator sees what was said.
