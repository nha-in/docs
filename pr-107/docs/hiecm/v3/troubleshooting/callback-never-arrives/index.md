# The callback never arrives

You made a call, it came back with a 202 or a 200, and nothing else has happened since. This is a common report in [HIE-CM](/docs/pr-107/docs/hiecm/v3/getting-started/glossary#hie-cm) integration.

That early response only means the gateway accepted your request. In M2 and M3 the real answer arrives later, as a POST from the gateway to a URL you registered in advance. See [a 200 means accepted, not done](/docs/pr-107/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks) for why this is the normal shape of these flows, and the [API reference](/docs/pr-107/docs/hiecm/v3/api), where each call names the callback it produces.

## Work through these in order

The checks are in the order we recommend, not a record of how often each has turned out to be the cause.

1. **Is the callback URL registered with the gateway?** Confirm it with the [update bridge callback URL](/docs/pr-107/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-gateway/03-gateway-patch-gateway-v3-bridge-url) call. Setting a URL in a console once is not the same as confirming the gateway has it.
2. **Is that URL reachable from the public internet over HTTPS?** ABDM posts to it from outside your network. A URL that only answers on your local machine or behind a VPN will never receive anything, and the original call gives you no signal that this is wrong.
3. **Did the request expire before the other party answered?** How long a request stays live before ABDM gives up is not published. If you have waited what feels like a long time, say so when you escalate rather than assuming a fixed window.
4. **Is your endpoint returning a non success status?** A handler that errors, times out, or is slow is a real problem. Deliveries can repeat, so your handler has to treat every one as possibly a retry of one it already handled. Respond quickly with a success status, even before you have finished processing the callback body.

### How you know it worked

Your handler receives a POST at your registered URL, carrying the exact `REQUEST-ID` you generated for the original call. Until you have observed that once, the callback path is unproven, even if the registration call itself succeeded.

### When it goes wrong

If all four checks pass and the callback still has not arrived, raise a request on the [support ticketing platform](https://sandboxsupport.abdm.gov.in/). Report the API you called, the `REQUEST-ID`, the `TIMESTAMP`, and the response you got. See [what to put in a support request](/docs/pr-107/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report format.

This symptom can surface as [ABDM-9999](/docs/pr-107/docs/hiecm/v3/reference/error-codes), the catch-all for a failure the gateway does not explain further.

Notes for AI agents

**Before you start.** Confirm the original call returned 202 or 200. If it returned an error, the callback was never going to come: read that error instead.

**What happens.** Run the four checks in order and stop at the first that fails: the bridge URL is registered, it answers over public HTTPS, the request had time to be answered, and your handler returns a success status fast. Do not resend the original call while checking, because a resend with a new `REQUEST-ID` starts a second exchange.

**How you know it worked.** A POST reaches the registered URL and its request id matches the `REQUEST-ID` of the call that caused it.

**When it goes wrong.** After the four checks pass, stop and hand the person the support report: the API called, `REQUEST-ID`, `TIMESTAMP` and the response body. Never put an access token, a client secret or a patient identifier in it.

## Next

[NextStill stuck? Check the M2 user journeyConfirm which step of the sequence your call sits in, so you know which callback should follow it.](/docs/hiecm/v3/milestones/m2)
