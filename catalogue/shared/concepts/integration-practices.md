---
id: shared.concept.integration-practices
type: concept
gateway: shared
milestone: n/a
version: abdm-v3
title: How to work on an ABDM integration
summary: >
  The habits that decide whether a wrong assumption surfaces in a minute or
  after a day. They are not facts about any one milestone, which is why they
  sit here and ship with every skill.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: not-yet-hashed
    note: >
      Several practices name a behaviour recorded in the specifications or in
      their error tables.
  - file: (private) sandbox sessions, abhasbx.abdm.gov.in, 2026-08-25 to 2026-09-15
    status: not-publicly-citable
    role: corroboration
    note: >
      Most of these were paid for: each names a mistake somebody made against
      the sandbox and the shape of the refusal that followed.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.encrypted-identifiers, hiecm.concept.gateway-session, hiecm.concept.m1-journey-design, hiecm.concept.error-codes]
  errors: [hiecm.error.abdm-1107, hiecm.error.abdm-1094]
---

# How to work on an ABDM integration

## In plain words

A milestone rule tells you what one call does. These tell you how to work, and
they hold whichever milestone you are on.

Each names a mistake that has actually been made and the refusal that followed
it. The pattern they share is worth saying once: **in ABDM the error message
usually names the wrong thing.** A bad clock arrives as a 404, a wrong padding
arrives as an invalid mobile number, a transfer token arrives as an expired
one, and a locked client arrives as a wrong secret. Working well here means
suspecting the layer the message did not mention.

## Before you start

Nothing. These apply from the first call, and several of them are about the
first call.

## What happens

- Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful, and a bad clock can arrive as a 404.
- When ABDM publishes a value, read it rather than hard coding what it currently says. That covers a parameter, such as the encryption algorithm the certificate endpoints return beside the key, and it covers an enumeration: councils, courses, states, districts, purposes and HI types all have master data calls, and a table typed into your source is a table that goes stale silently. Refuse to act on a published value you do not recognise rather than falling back to a default.
- Read every field in a response, not the one you came for. The M1 certificate call returns the padding next to the key, and a catalogue that recorded only the key cost an integrator a day rediscovering it.
- Prove an assumption against a call that is able to disagree with you. An endpoint that refuses every input with one message cannot tell you which input was right, and testing against it turns a correct answer into a ruled out one.
- Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the number. Those failures are reported as if the value were wrong.
- Do not carry an encryption path from one module to another. The padding, the certificate and the key size belong to the registry you are calling, and a path that works in one module produces a value another cannot read.
- Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.
- Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.
- Check the host on any sample before you copy it. Published samples mix production and sandbox hosts while describing sandbox behaviour, so a request copied whole can be correct in every respect except where it is pointed. This costs an afternoon because the failure looks like credentials.
- Do not validate an identifier more strictly than the platform does. A schema that types a field as a UUID is not a promise that the values are UUIDs, and ABDM ships examples that are not. Refusing a value ABDM would have accepted turns your own client into the thing that broke, and the rejection never reaches a log anyone is reading.
- Read a plural response as plural. A verification returns an accounts array, a consent request produces more than one artefact, and taking the first element is the bug that assigns a visit to the wrong record or drops half a fetch. Store the collection and decide from its length; length one is a case, not the normal case.
- A documented callback path is not a documented callback payload. Several ABDM callbacks name a route and record no body anywhere, so a handler written against an assumed shape fails on the first real delivery, asynchronously, where nobody is watching. Log the whole body on arrival before you parse it.
- Decode a token before you use it. A call that hands you a token has not necessarily handed you the token the next call wants: an M1 login returns one whose JWT payload reads `"typ": "Transfer"`, and every profile call refuses it while blaming its age. The claims are base64 and need no library, and reading them turns a confusing refusal into an obvious one.
- When a journey carries the same parameter through two calls, check whether it is the same value in both. An array like `scope` is a combination the operation validates as a whole, and the combination can legitimately change between opening a transaction and confirming it. Reusing the opening value is refused as though the parameter itself were wrong.
- Do not infer which path an identifier belongs to from where that identifier is most discussed. Aadhaar fills ABDM's enrolment documentation and is also a login identifier, so wiring it to enrolment quietly creates a second account for everyone who already holds one. Send every identifier to the lookup first and let the answer pick the path.
- Do not match an error code with string equality. ABDM returns codes carrying trailing punctuation and whitespace, observed as `"code": "ABDM-9999: "`. Trim and compare on the prefix, or the branch you wrote for that code never runs.
- A failure does not always carry a body. An HTTP 401 with zero bytes was observed on a PHR profile call with no user token. Handle the empty body before you parse, or your client throws on the simplest failure there is.
- On a `HIS-` response from the registries, read `details[0].code` before the top level `code`. The outer code and the HTTP status describe the wrong thing: a 422 saying the data was wrong carried `HIS-403`, not permitted, one level down. Acting on the outer code sends you hunting through a payload that is fine.
- Repeated bad credentials lock the client. Eight consecutive failed session calls locked a sandbox client for about eight minutes, and every attempt in that window returned `Invalid user credentials`, which reads as a wrong secret rather than a temporary lock. Back off on an auth failure rather than retrying, and never loop a credential check.
- Send TIMESTAMP in UTC with milliseconds and a trailing Z. Local time is refused, sometimes as a 404.
- Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.

## How you know it worked

You are working this way when a failure takes minutes rather than an afternoon.
Concretely: you can say which layer refused a call before you change anything,
you have not retried an authentication loop, and no constant in your source
duplicates a value ABDM publishes at runtime.

## When it goes wrong

- You changed two things and the call started working. You have not learned
  which, and the other one is still wrong somewhere else.
- You read a uniform negative as evidence. An endpoint that refuses every input
  the same way has told you nothing, and a matrix run against it excludes the
  right answer along with the wrong ones.
- You trusted a message that named a field. The field is where the value
  landed, not where it went wrong.
- You retried an authentication failure. Repeated bad credentials lock the
  client for several minutes, and the lock reads exactly like a wrong secret.
