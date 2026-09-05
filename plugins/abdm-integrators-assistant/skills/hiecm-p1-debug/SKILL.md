---
name: hiecm-p1-debug
description: "Use when a call from a PHR application fails anywhere in P1, P2 or P3: matches the AS error against the Catalogue's PHR error atoms, which NHA records once for the whole patient side, and walks to a named fix verified by the original step succeeding."
---
# HIE-CM P1 debug

Diagnoses a failed PHR application call, anywhere in P1, P2 or P3. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Errors

### AS-1013, no records were found for that health address (`hiecm.error.as-1013`)

**Observed as**

Discovery asked a facility for records held against this person and the
facility answered with none. That is an answer, not a fault.

**Fix**

Show the specified wording, "No health records found", rather than an
error. Offer the person a way to check the details they are searching
with, since a mismatch and a genuine absence look identical from here.

**Exit condition: the original call now succeeds**

Discovery against a facility the person did visit returns care contexts
rather than none.

### AS-1018, the transaction id is wrong or has expired (`hiecm.error.as-1018`)

**Observed as**

Registration and login run as a transaction. Each step carries the id
of the one before. That transaction has closed, which is why a step that
worked minutes ago fails now.

**Fix**

Start the flow again rather than retrying with the same id. Where this
happens often, the screen is holding people too long between steps.

**Exit condition: the original call now succeeds**

The flow restarted from its first step is accepted, and the later steps
carry the new transaction id.

### AS-1038, the OTP is wrong or has expired (`hiecm.error.as-1038`)

**Observed as**

Every route into a PHR account is checked by a code sent to a phone.
This is the code being refused. The message does not separate wrong from
expired, so your screen should not claim to know which it was.

**Fix**

Send a new code once the 60 second lock releases, and clear the field
first. Do not retry the same code: it is refused for the same reason a
second time.

**Exit condition: the original call now succeeds**

A freshly sent code is accepted and the person is signed in, or the
address is created.

### AS-1066, that care context is already linked (`hiecm.error.as-1066`)

**Observed as**

Discovery returned a care context that the person's account already
holds. Linking it again would create a duplicate, so it is refused.

**Fix**

Treat it as done rather than as a failure. Filter it out of the list and
show the specified message when everything discovered is already linked.

**Exit condition: the original call now succeeds**

The care context is present on the person's account, which was the
outcome the link was for.

### AS-1073, the consent artefact has expired (`hiecm.error.as-1073`)

**Observed as**

A consent artefact carries a validity period. It has passed. Records
cannot be fetched under an expired artefact, and no retry changes that.

**Fix**

Raise a fresh consent request. Do not retry against the old artefact,
and do not present the expiry to the person as an error in your
application.

**Exit condition: the original call now succeeds**

A fetch under a currently valid artefact is accepted and the records
arrive.

### AS-1109, that auto approval policy is already disabled (`hiecm.error.as-1109`)

**Observed as**

Auto approval is a policy the person can switch off at any time. This
one is already switched off, so the call had nothing to do.

**Fix**

Treat it as success and refresh the screen. The person asked for the
policy to be off, and it is off.

**Exit condition: the original call now succeeds**

Reading the policy shows it disabled, which is the state the call was
asking for.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/p1
- The flows as diagrams: /docs/hiecm/v3/milestones/p1
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

