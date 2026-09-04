---
name: hiecm-p2-build
description: "Use when scaffolding the patient side of ABDM Milestone 2 in a PHR application (discovery, user initiated linking, scan and share at a facility): builds each P2 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step."
---
# HIE-CM P2 build

Scaffolds an ABDM P2 integration one flow at a time. P2 covers discovering records held elsewhere, linking care contexts to a health address, and sharing a profile at a facility.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Find records held elsewhere and link them (`hiecm.flow.p2-discover-and-link`)

**Before you start**

Four things must already be true, each checkable:

- The person is signed in and holds an
  ABHA address. See
  sign a user in.
- You hold a verified mobile number for them. Discovery carries it.
- You can show only participating facilities in the search. A facility
  qualifies when it is a HIP linked to an
  HRP.
- You can hold a request open across a callback. Discovery is answered
  asynchronously. See
  asynchronous callbacks.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p2 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The care contexts the person selected are linked to their ABHA address,
and running discovery against that facility again returns them as already
linked rather than as new. The records themselves should arrive within
two hours.

A linked care context is not a record in hand. Fetching what a link
points at is a consent flow. See
fetch the records.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- The facility does not answer inside the expected 10 seconds, which is
  the unreachable case and has its own specified wording.
- Nothing comes back, because the person gave a different name or date of
  birth at the facility than they hold in their profile.
- Everything comes back already linked, which is the third specified
  message and not an error.
- The OTP goes to the mobile number the facility registered, which the
  person may no longer use.

### Share a profile at a facility by scanning its code (`hiecm.flow.p2-scan-and-share`)

**Before you start**

Three things must already be true, each checkable:

- The person is signed in and holds an
  ABHA address. See
  sign a user in.
- Your application can read a code and take the two parameters out of the
  URL it holds: the HIP id and a facility defined context such as a
  counter code.
- You can hold a screen open for up to 30 seconds while the facility
  answers, and say what is happening while it does.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/p2 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The facility answers inside the 30 second window, and where it returns a
token number your application shows it. The person is registered at that
facility without giving their details at the desk, and records from that
visit arrive already linked rather than needing discovery.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- No answer inside 30 seconds, which needs a screen that says so rather
  than a spinner that never ends.
- A counter name that is really the facility id or the HIP name, which
  the rules exclude and which makes the counter unidentifiable to the
  person.
- Consent taken in your own wording rather than the specified wording,
  which is a certification problem rather than a technical one.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/p2
- The flows as diagrams: /docs/hiecm/v3/milestones/p2
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

