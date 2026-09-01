---
id: hiecm.troubleshooting.otp-never-arrives
type: troubleshooting
gateway: hiecm
milestone: M1
version: abdm-v3
title: The OTP never arrives
summary: >
  You requested an OTP and nothing has appeared on the phone. The
  checks that rule out the common causes, in order.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection, the same source
      m1-create-abha-aadhaar-otp.md draws on.
verified:
  status: unverified
related:
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp]
  endpoints: [hiecm.endpoint.m1-enrolment-request-otp]
  errors:
    - hiecm.error.abdm-1022
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-9999
  glossary: [shared.glossary.otp, shared.glossary.txn-id]
skills:
  - hiecm-m1-debug
---

# The OTP never arrives

## In plain words

You called
[send an OTP to begin or continue an enrolment](../endpoints/m1-enrolment-request-otp.md)
and got back a `txnId`, and the phone you are watching has not received
anything.

## Before you start

- The request call itself succeeded and returned a `txnId`. If it
  failed, work through [everything returns 401](everything-returns-401.md)
  or the error atom the response names instead.
- You know which phone should receive the OTP for the call you made. See
  the next check: it is not always the phone in front of you.

## What happens

Work through these in order.

1. **Is this the Aadhaar mobile, and are you holding it?** In the
   Aadhaar OTP enrolment flow, only the mobile number registered against
   that Aadhaar number receives the OTP, and NHA's flow document is
   explicit that this is not necessarily the phone the person is
   holding. See [create an ABHA using an Aadhaar OTP](../flows/m1-create-abha-aadhaar-otp.md).
   Confirm which number Aadhaar has on file before assuming delivery
   failed.
2. **Have you requested an OTP for this transaction more than a few
   times in a short window?** See
   [ABDM-1022, you have been rate limited](../errors/abdm-1022.md). NHA
   also publishes `ABDM-2429` with the same meaning. A retry loop that
   fires the request call again on every failure can trigger this
   without the failure ever showing in your own logs, because the rate
   limit response can look like a plain timeout depending on how your
   client surfaces it.
3. **Has the transaction expired before you tried to verify it?** NHA's
   documents do not state how long a `txnId` remains valid. What
   [the enrolment flow](../flows/m1-create-abha-aadhaar-otp.md) does say
   is that a failed enrolment call should not be retried blindly: start
   a fresh OTP request rather than reusing an old `txnId` if enough time
   has passed that you are unsure it is still live.

## How you know it worked

The phone registered against the identifier you sent receives an SMS
carrying an OTP, and verifying it with that `txnId` succeeds. Do not
treat receipt of a `txnId` from the request call alone as delivery: the
request call answering does not confirm the SMS was sent.

## When it goes wrong

If you have confirmed the receiving number, are not rate limited, and
the transaction is fresh, and the OTP still has not arrived, escalate on
the NHA dev forum rather than requesting again. Report the API you
called, the `REQUEST-ID` you sent, the `TIMESTAMP` you sent, and the
full response body including the `txnId`.

The errors this symptom can surface:
[ABDM-1022](../errors/abdm-1022.md), rate limited;
[ABDM-2404](../errors/abdm-2404.md), your `REQUEST-ID` is missing,
malformed or reused; and [ABDM-9999](../errors/abdm-9999.md), NHA's
catch-all for a failure it does not explain further.
