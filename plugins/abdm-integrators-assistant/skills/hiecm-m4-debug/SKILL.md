---
name: hiecm-m4-debug
description: "Use when an ABDM Milestone 4 call fails or an HPR or HFR registration is stuck: matches the HIS error against the Catalogue's M4 error atoms and walks to a named fix, verified by the original step succeeding."
---
# HIE-CM M4 debug

Diagnoses a failed M4 call. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Errors

### HIS-1124, the bridge is not linked to this facility (`hiecm.error.his-1124`)

**Observed as**

A facility ID and a bridge id are two separate registrations. Until they
are linked, the bridge cannot act for the facility, and a call that
assumes it can is refused.

**Fix**

Link the bridge, and check the `type`. A facility whose software both
publishes and requests records needs one link of each type, not one link
that claims both.

**Exit condition: the original call now succeeds**

The bridge linkage call reports the link present and active, and the
call that failed then succeeds.

### HIS-1128, that HIP name is already in use (`hiecm.error.his-1128`)

**Observed as**

The HIP name is what a patient sees in their own application when they
search for this hospital. It must be unique for every bridge on a
facility, so a second bridge cannot reuse the first one's name.

**Fix**

Choose a different name inside the three rules: 15 characters or fewer,
no special characters, unique on this facility. NHA's worked example
builds it from the hospital name plus the bridge name.

**Exit condition: the original call now succeeds**

The bridge linkage call is accepted with the new name, and the facility
carries two bridges with two distinct names.

### HIS-1132, the registry detected a duplicate facility (`hiecm.error.his-1132`)

**Observed as**

The registry runs its own duplicate detection on the values you send,
independently of whether you ran the deduplicate search first.

**Fix**

Search, then decide. Where the match is genuinely a different facility
at the same address, the distinguishing detail belongs in the name and
address fields before you write again.

**Exit condition: the original call now succeeds**

The deduplicate search returns the matching facility, and your system
continues with that facility rather than creating one.

### HIS-2045, the session behind your transaction id has expired (`hiecm.error.his-2045`)

**Observed as**

Aadhaar authentication runs as a session on the registry's side, keyed to
the `txnId` you were given. That session has ended. The id is not wrong,
it is finished.

**Fix**

Do not retry with the same `txnId`. It cannot be revived, and a retry
loop on it will spend its attempts against a session that has closed.
Start the flow again from generate Aadhaar link.

**Exit condition: the original call now succeeds**

Generate the Aadhaar link again, redirect with the fresh URL, and the
step that failed is accepted with the new `txnId`.

### HIS-3021, this Aadhaar already has an HPID (`hiecm.error.his-3021`)

**Observed as**

A person gets one HPID. The registry has found an existing one against
this Aadhaar and refused to create another. This is a state, not a
fault.

**Fix**

Do not treat this as a failed registration. Read the existing HPID and
continue to registering the profile. If the person says they never
registered, they may have done so inside another product using the same
Aadhaar.

**Exit condition: the original call now succeeds**

Check HPID exists by Aadhaar returns the existing HPID, and your system
carries on with that number rather than a new one.

### HIS-4003, that facility already exists (`hiecm.error.his-4003`)

**Observed as**

Onboarding creates a facility record. The registry has found one that
already matches and refused to duplicate it.

**Fix**

Do not create a second record. Take the existing facility ID and
continue from bridge linkage. Where the existing record is wrong, update
it rather than replacing it.

**Exit condition: the original call now succeeds**

The deduplicate search returns the existing facility and its id, which
is the id to carry into bridge linkage.

### HIS-5005, this professional is already registered (`hiecm.error.his-5005`)

**Observed as**

Registering a professional adds qualifications and council registration
to an existing HPID. The registry already holds that record.

**Fix**

Do not retry the registration. Read the profile, and use the update
professional calls where a detail genuinely needs to change.

**Exit condition: the original call now succeeds**

Retrieving the profile returns the qualification and council
registration already held, which is the outcome the registration was
for.

### HIS-5011, your HPR token has expired (`hiecm.error.his-5011`)

**Observed as**

The HPR token is not the gateway access token. It represents the
professional rather than your client, and it has a life of its own that
ends earlier than the work sometimes takes.

**Fix**

Get a new HPR token, by password, mobile OTP or Aadhaar OTP, and repeat
the call. Do not confuse this with a rejected gateway access token,
which fails differently and is refreshed differently.

**Exit condition: the original call now succeeds**

A freshly obtained HPR token is accepted and the call that failed
succeeds unchanged.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m4
- The flows as diagrams: /docs/hiecm/v3/milestones/m4
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

