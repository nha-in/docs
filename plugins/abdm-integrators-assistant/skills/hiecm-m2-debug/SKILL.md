---
name: hiecm-m2-debug
description: "Use when an ABDM Milestone 2 call fails or a linking or data transfer flow is stuck: matches the error against the Catalogue's M2 error atoms and walks to a named fix, verified by the original step succeeding."
---
# HIE-CM M2 debug

Diagnoses a failed M2 call. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Errors

### ABDM-1022, you have been rate limited (`hiecm.error.abdm-1022`)

**Observed as**

You are sending more requests than ABDM accepts from your client, and it
has started refusing them.

NHA also publishes `ABDM-2429` with the same meaning, so handle both.

**Fix**

Back off exponentially and add jitter. Do not retry immediately.

If this happens during normal use rather than during a burst, the fix is
architectural: batch your work, cache what does not change, and stop
polling anything that has a callback.

**Exit condition: the original call now succeeds**

Requests are accepted again at your normal rate. If you have been sending in bursts, confirm the rate over a minute rather than over a second.

### ABDM-1026, the token that authorises care context linking is not usable (`hiecm.error.abdm-1026`)

**Observed as**

Linking a care context needs a link token, and the one you sent is not
valid for this link.

NHA lists several closely related codes here, which is a sign that link
tokens are where M2 integrations get stuck.

**Fix**

Validate the token before use rather than after failure. It is a JWT, so
its expiry is readable without calling anything.

If it has expired, regenerate it through demographic authentication. Do
not retry the same token.

**Exit condition: the original call now succeeds**

The link call is accepted and the confirming callback arrives naming the care contexts you sent.

### ABDM-1032, one of the required headers is absent or malformed (`hiecm.error.abdm-1032`)

**Observed as**

A required header is missing or unusable, and NHA is not saying which
one.

This is the code you get when the more specific header codes do not
apply.

**Fix**

Check each required header is present, spelled exactly as NHA spells it,
including the hyphens and the case, and carries a well formed value.

NHA also publishes more specific codes: `ABDM-2402` for the timestamp,
`ABDM-2403` for the consent manager id, `ABDM-2404` for the request id
and `ABDM-2500` for a missing authorisation header. Receiving the generic
code means none of those matched.

**Exit condition: the original call now succeeds**

The call returns its normal response. Log the full header set you sent on the failing request, so the next occurrence is a comparison rather than a hunt.

### ABDM-1035, your provider identity is not recognised (`hiecm.error.abdm-1035`)

**Observed as**

ABDM does not recognise the HIP id on this call.

This is usually a registration problem rather than a request problem, so
no amount of retrying will change it.

**Fix**

Confirm the facility exists in the Health Facility Registry and that your
software is linked to it. That is M4 work, which this catalogue does not
cover yet.

Until the registration is right, the integration cannot proceed. This is
not a code to work around.

**Exit condition: the original call now succeeds**

The call is accepted and, in a linking flow, the callback arrives naming your HIP id.

### ABDM-1056, care context already linked or invalid link reference (`hiecm.error.abdm-1056`)

**Observed as**

The gateway rejected your link request for one of two documented
reasons: this care context has already been linked to the patient's
ABHA, or the link reference number you sent does not match anything the
gateway knows. Match the message text to tell the two apart.

**Fix**

Already linked: treat it as success after verifying by discovery that
the care context is present; do not retry the link. Invalid reference
number: restart the link flow to obtain a fresh reference rather than
guessing at the value.

**Exit condition: the original call now succeeds**

The link flow's exit condition from hiecm.flow.m2-link-care-context is
observed for the care context you intended, or, for the already linked
case, discovery shows the care context present, which means there was
nothing left to do.

### ABDM-1062, ABHA mismatch in linking, consent not granted in consent flow (`hiecm.error.abdm-1062`)

**Observed as**

One code, two meanings, depending on which flow raised it. In the M2
linking flow it means the ABHA number in your request is not the one the
link token was issued for. In the consent and data flow it means the
patient has not granted the consent you are acting on. Do not write a
handler that assumes one meaning from the code alone; its neighbours
ABDM-1061 and ABDM-1063 carry the same trap.

**Fix**

Linking fix: fetch a fresh link token for this patient and retry.
Consent fix: check the consent artefact's status before requesting data;
a denied or expired consent will not start working by retrying.

**Exit condition: the original call now succeeds**

Linking case: the link call succeeds, meaning its exit condition from
hiecm.flow.m2-link-care-context is observed, once the ABHA number
matches the token. Consent case: the data request succeeds once a
granted consent artefact is quoted correctly.

### ABDM-1063, HIP id mismatch in linking, invalid date range in consent (`hiecm.error.abdm-1063`)

**Observed as**

Like its neighbour ABDM-1062, this code means different things in
different flows. In the M2 linking flow it means the HIP id in your
request is not the one the link token was issued for. In the consent and
data flow it means the date range you asked for is invalid. Read the
message text to know which case you are in.

**Fix**

Linking fix: fetch the link token under the same HIP id that will send
the link request; audit which facility identity each step runs as.
Consent fix: read the consent artefact's permitted date range and
request inside it.

**Exit condition: the original call now succeeds**

Linking case: the link call succeeds, its exit condition per
hiecm.flow.m2-link-care-context observed, once the HIP id matches the
token. Consent case: the data request succeeds with a range inside what
the consent artefact grants.

### ABDM-1064, you sent no body where one was required (`hiecm.error.abdm-1064`)

**Observed as**

The call needs a JSON body and none arrived.

It is usually a client configuration problem rather than a missing field.

**Fix**

Send the JSON body the operation documents, with
`Content-Type: application/json`.

If your client looks correct, log the outgoing request as it leaves your
process rather than as you constructed it. That is where proxies show up.

**Exit condition: the original call now succeeds**

The call returns its normal response for the operation you were making.

### ABDM-1170, the address is malformed or does not exist here (`hiecm.error.abdm-1170`)

**Observed as**

The ABHA address you sent is not one ABDM will accept.

The environment suffix is the usual reason, and it is the one people
chase longest because the address looks correct.

**Fix**

Check the suffix matches the environment you are calling.

If it does, check the address against NHA's policy, then confirm the
account exists by looking it up before linking against it.

**Exit condition: the original call now succeeds**

The call is accepted and, in a linking flow, the confirming callback names the same address you sent.

### ABDM-2402, your clock is wrong (`hiecm.error.abdm-2402`)

**Observed as**

Your `TIMESTAMP` header is too far from the gateway's own clock, so the
request was refused before anything else was looked at.

This is a clock problem, not a formatting preference, and it fails every
call in the module rather than one.

**Fix**

Take the timestamp from a synchronised clock and format it as ISO 8601
UTC, with milliseconds and the `Z` suffix, for example
`2026-08-25T15:51:15.339Z`. Do not format the value by hand.

Send UTC with the `Z` suffix. The sandbox rejects IST offsets, which was
confirmed by observation against the ABHA sandbox on 26 August 2026.

If it still fails, compare your host clock against a time server. A drift
of more than a few minutes is enough.

**Exit condition: the original call now succeeds**

The call you were making returns its normal response rather than this code. If you are unsure, send the same request twice a minute apart and confirm both are accepted.

### ABDM-2403, you are pointed at the wrong consent manager (`hiecm.error.abdm-2403`)

**Observed as**

The `X-CM-ID` header does not name a consent manager the gateway
recognises for this host.

In practice this nearly always means sandbox and production have been
mixed: the right host with the other environment's value.

**Fix**

Set `X-CM-ID: sbx` when the host is `dev.abdm.gov.in`, and
`X-CM-ID: abdm` when it is `apis.abdm.gov.in`.

The durable fix is to derive both from one environment setting, so they
cannot disagree.

**Exit condition: the original call now succeeds**

The call returns its normal response. Confirm by checking that your configured host and your `X-CM-ID` come from the same environment configuration, not from two places.

### ABDM-2404, your REQUEST-ID is missing, malformed or reused (`hiecm.error.abdm-2404`)

**Observed as**

The `REQUEST-ID` header is not a UUID the gateway will accept.

It matters more than it looks. In the asynchronous flows this value is
how the callback that answers your call is matched to it, so a bad one
breaks correlation as well as this request.

**Fix**

Generate a fresh UUID per request and log it before sending.

If you are reusing a value deliberately to retry, generate a new one
instead. Retrying is not the same as repeating.

**Exit condition: the original call now succeeds**

The call returns its normal response, and in an asynchronous flow the callback arrives carrying the same `REQUEST-ID` you sent.

### ABDM-2406, invalid API sequence (`hiecm.error.abdm-2406`)

**Observed as**

The gateway tracks where you are in a flow, and your call does not fit.
NHA's documented messages are "Invalid API sequence flow, please follow
logical flow" and "The status is invalid. Please follow the logical
status flow or transition." In plain terms: a step you depend on has not
happened yet, or has already moved past the state your call assumes.

**Fix**

Work out which step the gateway believes you are on, not which step you
believe you are on: check what your last confirmed callback was, then
resume from the step after it. Do not retry the rejected call in place;
if the sequence has genuinely diverged, restart the flow from its first
step.

**Exit condition: the original call now succeeds**

The step you retried in its correct position succeeds, and the flow's
own exit condition, per its flow atom such as
hiecm.flow.m2-link-care-context, is observed.

### ABDM-2500, you did not send a session token (`hiecm.error.abdm-2500`)

**Observed as**

The call arrived with no `Authorization` header, so the gateway does not
know which application is calling.

Every ABDM call except the session call itself needs this.

**Fix**

Get an access token from the session endpoint and send it as
`Authorization: Bearer <ACCESS_TOKEN>`.

If tokens expire mid-session, refresh on `expiresIn` rather than waiting
for a failure, since a failed refresh presents as this code rather than
as a refresh error.

**Exit condition: the original call now succeeds**

The call returns its normal response. A stronger check is to confirm your client sends the header on every route, not only on the ones you tested.

### ABDM-9999, ABDM is failing and not saying why (`hiecm.error.abdm-9999`)

**Observed as**

A catch-all. Something failed inside ABDM and it is not telling you what.

Nothing about your request is necessarily wrong.

**Fix**

Retry with exponential backoff, and stop after a bounded number of
attempts so a retry loop does not turn into a rate limit block.

If it persists across hours, raise it on the NHA dev forum with your
`REQUEST-ID` and `TIMESTAMP`. Those are what makes a report traceable.

**Exit condition: the original call now succeeds**

The same request, unchanged, succeeds later. That is the test: if changing nothing fixes it, it was never yours.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m2
- The flows as diagrams: /docs/hiecm/v3/milestones/m2
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

