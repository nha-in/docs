---
name: hiecm-m1-debug
description: "Use when an ABDM Milestone 1 call fails or a login/enrolment flow is stuck: matches the error against the Catalogue's M1 error atoms and walks to a named fix, verified by the original step succeeding."
---
# HIE-CM M1 debug

Diagnoses a failed M1 call. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Errors

### 900900, the ABHA service rejected the call without saying why (`hiecm.error.900900`)

**Observed as**

A code from the ABHA service rather than from the gateway, observed in
NHA's own saved responses. The accompanying description names the API
path that was refused.

It means authentication failed and the service is not saying which part.

**Fix**

Check both tokens. Confirm `Authorization` carries a current session
token, and that `X-token` carries the token for the person whose account
you are reading.

If both look right, confirm the route is one your credentials are
entitled to call. Gateway subscription state produces refusals that look
like credential problems.

**Exit condition: the original call now succeeds**

The call returns the account or result you expected rather than an error envelope.

### 900901, the ABHA service rejected the credentials outright (`hiecm.error.900901`)

**Observed as**

A second ABHA service code observed in NHA's saved responses, paired with
the message "Invalid Credentials".

Unlike the unclassified failure, this one is definite: what you sent was
wrong, not merely unacceptable.

**Fix**

Re-check the client id and secret against the ones issued for this
environment, then get a fresh session token.

Sandbox credentials do not work against production. That is the most
common cause of a definite rather than an expired credential failure.

**Exit condition: the original call now succeeds**

The call returns its normal response. Verify by making the session call fresh and using its token immediately.

### ABDM-1013, the fourteen digit number is wrong or wrongly formatted (`hiecm.error.abdm-1013`)

**Observed as**

The ABHA number you sent is not one ABDM recognises.

Most often this is formatting rather than a wrong person.

**Fix**

Send the number in NHA's hyphenated form, and confirm you are sending a
number rather than an address.

If both look right, the account may not exist in this environment. A
sandbox account does not exist in production.

**Exit condition: the original call now succeeds**

The call returns the account you expected, and the number in the response matches the one you sent.

### ABDM-1016, your timestamp format is wrong (`hiecm.error.abdm-1016`)

**Observed as**

Your `TIMESTAMP` header is in a format the service does not accept, so
the request was refused before anything else was looked at.

This is a formatting problem, not a clock problem. Its sibling,
ABDM-2402 (hiecm.error.abdm-2402), is the clock drift case: the value is well
formed but too far from the gateway's own time. If your value parses as
ISO 8601 UTC with milliseconds and still fails, read that atom instead.

**Fix**

Format the header as ISO 8601 UTC with milliseconds and the `Z` suffix,
for example `2026-08-25T15:51:15.339Z`. That exact change is what turned
the observed failure into a success. Generate it from your language's
date library, for example `Instant.now().toString()` in Java or
`new Date().toISOString()` in JavaScript. Do not format the value by
hand.

If a well formed UTC value still fails, your clock has probably
drifted, which is ABDM-2402 (hiecm.error.abdm-2402)'s territory.

If you are matching error codes and never see `ABDM-1016`, check that
your parser is not doing an exact match on the `code` field. The
observed value carried a trailing colon and space.

**Exit condition: the original call now succeeds**

The call you were making returns its normal response rather than this
code. In the observed session, resending the identical request with the
`TIMESTAMP` reformatted to UTC succeeded immediately, so no wait or
retry backoff is involved.

### ABDM-1094, access to this feature is restricted (`hiecm.error.abdm-1094`)

**Observed as**

ABDM-1094 is an entitlement failure, HTTP 401. Your client id is not
allowed to do what it just tried. It carries two documented messages:
"Access to this feature is restricted. Please contact NHA to enable it"
means the endpoint itself is off limits for your client; "Invalid
Benefit Name" means the BENEFIT_NAME header you sent does not match a
benefit programme registered against your client.

**Fix**

Retrying does not help; entitlement is configuration, not a transient
state. Restricted message: stop calling the endpoint, or ask NHA to
enable the entitlement. Invalid benefit name: use the exact name NHA
gave you at onboarding.

**Exit condition: the original call now succeeds**

The original call returns a non 401 response. For the benefit name case,
NHA's own collection uses the exact registered name, such as
`healthid api`.

### ABDM-1107, invalid combinations of scopes (`hiecm.error.abdm-1107`)

**Observed as**

`scope` is an array, and the operations care about the combination rather than
about any one value in it. This code means the combination you sent is not one
this operation accepts, or is not the one the transaction was opened with.

```response
{"error": {"code": "ABDM-1107", "message": "Invalid combinations of scopes"}}
```

Observed on the sandbox on 2026-09-14: an enrolment OTP request sent
`["abha-enrol"]` and returned 200, and the verification that followed reused
`["abha-enrol"]` and was refused with this code.

**Fix**

- You reused one scope across a whole journey. Read the scope off the example
  for the operation you are calling, not off the one before it.
- You are on the enrolment path and meant to be on the login path. Aadhaar is a
  login identifier as well as an enrolment one, and the scope is the first
  place the two diverge. A patient who already holds an ABHA belongs on the
  login path, and sending them down enrolment creates a second ABHA number that
  nothing merges. See designing the ABHA journey.
- The transaction was opened for something else. `txnId` carries the scope it
  was created with, so a transaction cannot be reused across journeys.

**Exit condition: the original call now succeeds**

The call the refusal came from returns its own success body instead: a login
verification returns `authResult: "success"` with a token and an accounts
array, and an enrolment verification continues the enrolment.

### ABDM-1407, the person's account is switched off (`hiecm.error.abdm-1407`)

**Observed as**

The ABHA number exists but has been deactivated, so it cannot be used
until it is reactivated.

Nothing about your request is wrong.

**Fix**

There is no fix on your side. The person reactivates their own account,
which M1 exposes as a call.

What your system should do is say so plainly rather than presenting a
generic failure, because the person is the only one who can resolve it.

**Exit condition: the original call now succeeds**

The same call succeeds after the account is reactivated. There is nothing you can verify from your side while it is deactivated.

### ABDM-2401, the person scoped token is wrong or expired (`hiecm.error.abdm-2401`)

**Observed as**

This is not about your application's session token. It is about the token
that identifies one person, returned when they logged in and sent
afterwards as `X-token`.

The gateway accepted your application and rejected the person.

**Fix**

Have the person log in again, or refresh the token using the refresh
token rather than making them repeat the OTP.

If it persists, check you are not sending the application session token
in `X-token`. The two tokens are not interchangeable.

**Exit condition: the original call now succeeds**

The profile call returns the account you expected, and the identifiers in the response match the person who logged in.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m1
- The flows as diagrams: /docs/hiecm/v3/milestones/m1
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

