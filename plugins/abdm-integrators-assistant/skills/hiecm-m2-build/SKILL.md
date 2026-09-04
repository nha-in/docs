---
name: hiecm-m2-build
description: "Use when scaffolding an integration against ABDM Milestone 2 (care contexts, linking, discovery, sharing records as a HIP): builds each M2 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call."
---
# HIE-CM M2 build

Scaffolds an ABDM M2 integration one flow at a time. M2 covers care contexts, HIP initiated linking, discovery, and pushing encrypted records to a requester.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Link a care context to a patient's ABHA (`hiecm.flow.m2-link-care-context`)

**Before you start**

Three things must already be true, each checkable:

- Your facility has a valid Facility ID registered in the HIP role.
- You hold a gateway session token from the sessions endpoint
  (gateway_sessions_create in the gateway reference).
- The patient has an ABHA address, which is the M1 module's job.

**Act: the calls in this flow, in order**

The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/m2 before acting, and treat the exit condition below as the thing to observe.

**Exit condition (Observe until this is true)**

The gateway's callback to your registered bridge URL reports success for
your link request, and the care context then appears when the patient's
PHR app runs discovery against your facility. Do not treat the
synchronous acknowledgement alone as success.

```observation schema=exit-condition
channel: callback
path: <YOUR_BRIDGE_URL>/on-link-confirmation
match:
  status: SUCCESS
timeout_seconds: unknown
note: exact callback path and timeout unconfirmed until M2 swagger is ingested
```

**If it goes wrong**

The frequent failures NHA's sources document, in rough order of
frequency, each with its fix in the linked error atom:

- hiecm.error.abdm-1056 when the care context is already linked or the
  link reference number is invalid.
- hiecm.error.abdm-1062 when the ABHA number does not match the link
  token.
- hiecm.error.abdm-1063 when the HIP id does not match the link token.
- hiecm.error.abdm-2406 when calls are made out of the logical sequence.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m2
- The flows as diagrams: /docs/hiecm/v3/milestones/m2
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

