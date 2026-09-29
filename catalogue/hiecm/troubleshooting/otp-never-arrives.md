---
id: hiecm.troubleshooting.otp-never-arrives
type: troubleshooting
gateway: hiecm
milestone: M1
version: abdm-v3
title: The OTP never arrives
summary: An OTP was requested and nothing reached the phone.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/otp-never-arrives.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/troubleshooting/otp-never-arrives.mdx#otp-never-arrives.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
  endpoints:
    - hiecm.endpoint.m1-enrolment-request-otp
  errors:
    - hiecm.error.abdm-1022
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-9999
  glossary:
    - shared.glossary.otp
    - shared.glossary.txn-id
---

# The OTP never arrives

## In plain words

1. **Is this the Aadhaar mobile, and are you holding it?** In the
   Aadhaar OTP enrolment flow, only the mobile number registered against
   that Aadhaar number receives the OTP. That is not necessarily the
   phone the person is holding while they enrol. See the
   [M1 user journey](/docs/hiecm/v3/milestones/m1) for the full
   enrolment sequence, and confirm which number Aadhaar has on file
   before assuming delivery failed.
2. **Have you requested an OTP for this transaction more than a few
   times in a short window?** You may have been rate limited. A retry
   loop that fires the request call again on every failure can trigger
   this without the failure showing clearly in your own logs, because a
   rate limit response can read like a plain timeout depending on how
   your client surfaces it.
3. **Has the transaction expired before you tried to verify it?** How
   long a `txnId` stays valid is not documented yet.
   A failed enrolment call should not be retried blindly: start a fresh
   OTP request rather than reuse an old `txnId` if enough time has
   passed that you are unsure it is still live.

### How you know it worked

The phone registered against the identifier you sent receives an SMS
carrying an OTP, and verifying it with that `txnId` succeeds. Receiving
a `txnId` from the request call alone does not confirm the SMS was sent.

### When it goes wrong

If you have confirmed the receiving number, are not rate limited, and
the transaction is fresh, and the OTP still has not arrived, raise a request on the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/) rather than requesting
again. Report the API you called, the `REQUEST-ID`, the `TIMESTAMP`, and
the full response body including the `txnId`. See
[what to put in a support request](/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report format.

This symptom can surface as a rate limit code or the catch-all
failure code, both on the
[error codes reference](/docs/hiecm/v3/reference/error-codes).

## Before you start

Confirm the request call returned a `txnId`. A failed request call is a different problem.

## What happens

Check in order: in the Aadhaar OTP enrolment flow, only the mobile registered against that Aadhaar receives the OTP, so ask which phone that is; then whether repeated requests have been rate limited; then whether the transaction is still live. Never loop the request call on failure, because each retry counts against the limit.

## How you know it worked

The SMS arrives on the registered phone and verifying it against the same `txnId` succeeds. A `txnId` alone does not prove the SMS was sent.

## When it goes wrong

Once the number, the rate limit and the transaction are ruled out, stop requesting and hand the person the support report: the API called, `REQUEST-ID`, `TIMESTAMP` and the full response body including the `txnId`.
