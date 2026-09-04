---
name: hiecm-p3-build
description: "Use when scaffolding the patient side of ABDM Milestone 3 in a PHR application (subscriptions, auto approval, granting and revoking consent, fetching records): builds each P3 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step."
---
# HIE-CM P3 build

Scaffolds an ABDM P3 integration one flow at a time. P3 covers subscriptions, auto approval policies, and fetching the records a granted consent covers.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Fetch and store the records a linked care context points at (`hiecm.flow.p3-fetch-records`)

**Before you start**

Four things must already be true, each checkable:

- The care context is linked to the person's health address. See
  find records held elsewhere and link them.
- Your application implements the HIU role. A PHR application is an HIU
  as well, not instead.
- You have a subscription, so you are told when a care context appears or
  changes. See
  subscribe and set an auto approval policy.
- You can store records for the long term. Fetching without storing means
  fetching again, and the person loses their history when the request
  window closes.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p3 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The records arrive for the care context the notification named, your
application has stored them, and they are displayed in date order. Asking
again is not needed, which is what proves they were stored rather than
held for the length of a screen.

A grant on its own is not the exit condition. A granted consent with no
health information request behind it leaves the person with permission
and no records.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- ABDM-1112 when the artefact is expired or has
  been revoked. Revocation is the person exercising a right, so it is a
  state to handle rather than an error to report.
- Records fetched but not stored, which reads as working until the
  consent window closes and the history disappears.
- A health information type the application cannot display, from the
  seven the test cases cover.

### Subscribe to a user's account and set an auto approval policy (`hiecm.flow.p3-subscribe-and-auto-approve`)

**Before you start**

Three things must already be true, each checkable:

- The person is signed in and holds an
  ABHA address. See
  sign a user in.
- You can receive and surface device notifications, because that is what
  a subscription produces.
- You have screens to list subscriptions, approve them, deny them and
  edit them. Editing covers health information types, types of visit and
  the time period.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p3 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The subscription is listed as approved on your own subscriptions screen,
and a change to the person's account produces a notification your
application receives.

For the policy, the HIE-CM returned an auto approval id and you stored
it. The observable proof is the next new care context: a consent request
raised against it is granted without the person being asked.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- A policy with no stored auto approval id, which leaves the person
  unable to turn it off. The person must be able to disable a policy at
  any time.
- A subscription created before the person was asked, which is a consent
  failure rather than a technical one.
- Notifications received but not surfaced, so the application knows about
  a new record and the person does not.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/p3
- The flows as diagrams: /docs/hiecm/v3/milestones/p3
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

