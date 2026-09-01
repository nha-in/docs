---
id: shared.sandbox.registration-and-credentials
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: Registering on the ABDM sandbox and getting credentials
summary: >
  How to get the client id and client secret every ABDM call depends
  on, and what to expect while you wait.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 1.docx
    status: not-yet-hashed
    note: NHA milestone pack for M1.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.gateway-session]
  endpoints: [hiecm.endpoint.gateway-sessions]
---

# Registering on the ABDM sandbox and getting credentials

## In plain words

Nothing in ABDM works without a client id and a client secret. You get
them by registering your application on the ABDM sandbox.

Everything else in this catalogue assumes you have them.

## Before you start

You need an email address you control and a description of what you are
building. Have the role in mind before you register: read
[roles](../../hiecm/concepts/roles.md), because what you register as
decides which APIs answer you. Register for what your software does,
publishing or reading or both, rather than for what kind of product it
is.

## What happens

You register at https://sandbox.abdm.gov.in, and the console issues a
client id and a client secret. Those two values are then exchanged for
an access token on every session call.

Keep the secret server side. It is a credential, not a configuration
value, and it does not belong in a mobile or browser build.

This catalogue contains no credentials, not even expired ones.

## How you know it worked

You have a client id and a client secret, and the session call returns
an `accessToken` rather than an error. That is the check. Possession of
the values is not the same as them working.

Run [the session call](../../hiecm/endpoints/gateway-sessions.md) once
and keep the response.

## When it goes wrong

You are waiting on NHA and cannot proceed. Some approvals are not
instant and are outside anyone's control here. If registration is
pending, you have not done anything wrong and there is no request you
can send to speed it up.

Some sandbox endpoints refuse with an authorisation error because of
gateway subscription state rather than anything you sent. If a call
that should work refuses consistently with correct credentials, raise
it on the NHA dev forum rather than rewriting your client.

