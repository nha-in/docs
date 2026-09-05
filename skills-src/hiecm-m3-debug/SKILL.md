---
name: hiecm-m3-debug
description: "Use when an ABDM Milestone 3 call fails or a consent or fetch flow is stuck: matches the error against the Catalogue's M3 error atoms and walks to a named fix, verified by the original step succeeding."
---
# HIE-CM M3 debug

Diagnoses a failed M3 call. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Errors

### ABDM-1040, your requester identity is not recognised (`hiecm.error.abdm-1040`)

**Observed as**

ABDM does not recognise the HIU id on this consent request.

Like the HIP version, this is a registration problem.

**Fix**

Confirm the entity is registered in the HIU role and that you are sending
the HIU id rather than the HIP id.

If your product holds both, keep them in separate configuration values so
they cannot be swapped.

**Exit condition: the original call now succeeds**

The consent request is accepted and the on-init callback arrives with a consent request id.

### ABDM-1112, the consent you are fetching against is no longer usable (`hiecm.error.abdm-1112`)

**Observed as**

The consent artefact you presented is unknown, expired or revoked.

This is often not a bug. A patient is allowed to revoke consent, and a
consent window is allowed to end.

**Fix**

Check the artefact's expiry before fetching, and treat revocation as a
normal state your system handles rather than an error it reports.

If you need continued access, raise a new consent request. Do not retry
against the old artefact.

**Exit condition: the original call now succeeds**

A fetch against a currently granted artefact is accepted and the data callback arrives.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m3
- The flows as diagrams: /docs/hiecm/v3/milestones/m3
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

