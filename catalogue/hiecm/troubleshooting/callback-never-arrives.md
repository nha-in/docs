---
id: hiecm.troubleshooting.callback-never-arrives
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: The callback never arrives
summary: A call returned 202 or 200 and the callback that should follow never
  reached your registered URL.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/troubleshooting/callback-never-arrives.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/troubleshooting/callback-never-arrives.mdx#callback-never-arrives.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.gateway-update-bridge-url
  errors:
    - hiecm.error.abdm-9999
  glossary:
    - shared.glossary.request-id
---

# The callback never arrives

## In plain words

The checks are in the order we recommend, not a record of how often each has
turned out to be the cause.

1. **Is the callback URL registered with the gateway?** Confirm it with
   the [update bridge callback URL](/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/03-gateway-patch-gateway-v3-bridge-url)
   call. Setting a URL in a console once is not the same as confirming
   the gateway has it.
2. **Is that URL reachable from the public internet over HTTPS?** ABDM
   posts to it from outside your network. A URL that only answers on
   your local machine or behind a VPN will never receive anything, and
   the original call gives you no signal that this is wrong.
3. **Did the request expire before the other party answered?** How long
   a request stays live before ABDM gives up is not published. If you
   have waited what feels like a long time, say so when you escalate
   rather than assuming a fixed window.
4. **Is your endpoint returning a non success status?** A handler that
   errors, times out, or is slow is a real problem. Deliveries can repeat,
   so your handler has to treat every one as possibly a retry of one it
   already handled. Respond quickly with a success status, even before you
   have finished processing the callback body.

### How you know it worked

Your handler receives a POST at your registered URL, carrying the exact
`REQUEST-ID` you generated for the original call. Until you have
observed that once, the callback path is unproven, even if the
registration call itself succeeded.

### When it goes wrong

If all four checks pass and the callback still has not arrived, raise a request on the
[support ticketing platform](https://sandboxsupport.abdm.gov.in/). Report the API you
called, the `REQUEST-ID`, the `TIMESTAMP`, and the response you got. See
[what to put in a support request](/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report format.

This symptom can surface as
[ABDM-9999](/docs/hiecm/v3/reference/error-codes), the catch-all for a
failure the gateway does not explain further.

## Before you start

Confirm the original call returned 202 or 200. If it returned an error, the callback was never going to come: read that error instead.

## What happens

Run the four checks in order and stop at the first that fails: the bridge URL is registered, it answers over public HTTPS, the request had time to be answered, and your handler returns a success status fast. Do not resend the original call while checking, because a resend with a new `REQUEST-ID` starts a second exchange.

## How you know it worked

A POST reaches the registered URL and its request id matches the `REQUEST-ID` of the call that caused it.

## When it goes wrong

After the four checks pass, stop and hand the person the support report: the API called, `REQUEST-ID`, `TIMESTAMP` and the response body. Never put an access token, a client secret or a patient identifier in it.
