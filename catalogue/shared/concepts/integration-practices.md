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
  - file: catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml
    hash: sha256:6ab5cfe77c29032fac5fbf25c8e28529f22951e459374fa618f570f15e25551b
    note: >
      The certificate response that carries the encryption algorithm beside
      the key, and the TIMESTAMP header format.
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
    note: >
      Error codes that may be returned bare or with a trailing ": "
      separator.
verified:
  status: unverified
related:
---

# How to work on an ABDM integration

## In plain words

A milestone rule tells you what one call does. These tell you how to work, and
they hold whichever milestone you are on.

The pattern they share is worth saying once: **an error message can name the
wrong thing.** A refusal caused by the encryption, the headers or the clock can
read as if a value were wrong. Working well here means suspecting the layer the
message did not mention.

## Before you start

Nothing. These apply from the first call, and several of them are about the
first call.

## What happens

- Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful.
- When ABDM publishes a value, read it rather than hard coding what it currently says. That covers a parameter, such as the encryption algorithm the certificate endpoints return beside the key, and it covers an enumeration: councils, courses, states, districts, purposes and HI types all have master data calls, and a table typed into your source goes stale silently. Refuse to act on a published value you do not recognise rather than falling back to a default.
- Read every field in a response, not the one you came for. The M1 certificate call returns the encryption algorithm next to the key.
- Prove an assumption against a call that is able to disagree with you. A call that refuses every input with one message cannot tell you which input was right.
- Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the value.
- Do not carry an encryption path from one module to another. Read the certificate and the algorithm from the registry you are calling.
- Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.
- Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.
- Check the host on any sample before you copy it. A request copied whole can be correct in every respect except where it is pointed, and that failure looks like credentials.
- Do not validate an identifier more strictly than the platform does. A schema that types a field as a UUID is not a promise that every value is one. Refusing a value ABDM would have accepted turns your own client into the thing that broke.
- Read a plural response as plural. A verification returns an accounts array and a consent request can produce more than one artefact. Store the collection and decide from its length.
- A documented callback path is not a documented callback payload. Log the whole body on arrival before you parse it, so a handler written against an assumed shape fails where you can see it.
- Decode a token before you use it. A call that hands you a token has not necessarily handed you the token the next call wants, and the claims are base64 that need no library to read.
- When a journey carries the same parameter through two calls, check what each call's specification asks for rather than carrying the first value forward.
- Do not infer which path an identifier belongs to from where that identifier is most discussed. Send every identifier to the lookup first and let the answer pick the path, so nobody who already holds an account is sent to create a second.
- Do not match an error code with string equality. A code may come back bare, as `ABDM-1001`, or with a trailing `: ` separator, as `ABDM-1001: `. Match on the code itself and tolerate the separator.
- Handle a failure that carries no body. Check for an empty body before you parse, or your client throws on the simplest failure there is.
- Back off on an authentication failure rather than retrying, and never loop a credential check.
- Send TIMESTAMP in UTC, ISO-8601 with milliseconds and a trailing Z, as in `2022-10-06T15:10:00.587Z`.
- Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.

## How you know it worked

You are working this way when a failure takes minutes rather than an afternoon.
Concretely: you can say which layer refused a call before you change anything,
you have not retried an authentication loop, and no constant in your source
duplicates a value ABDM publishes at runtime.

## When it goes wrong

- You changed two things and the call started working. You have not learned
  which, and the other one is still wrong somewhere else.
- You read a uniform negative as evidence. A call that refuses every input the
  same way has told you nothing.
- You trusted a message that named a field. The field is where the value
  landed, not where it went wrong.
- You retried an authentication failure. Back off instead, and find out why
  the first attempt failed.
