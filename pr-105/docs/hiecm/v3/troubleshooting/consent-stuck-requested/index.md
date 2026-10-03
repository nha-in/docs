# Consent stuck in Requested

You raised a consent request and it has not moved to Granted or Denied. Requested is the starting state of the consent request itself, not of the [consent artefact](/docs/pr-105/docs/hiecm/v3/getting-started/glossary#consent-artefact) it can produce: the artefact is created only once the patient grants. Nothing has failed yet, the patient has not yet acted, or something kept them from ever seeing it. See [Consent, two objects, not one](/docs/pr-105/docs/hiecm/v3/concepts/consent#two-objects-not-one) for the full state model.

Before working through the checks, confirm the request itself was accepted, and check its current state rather than only waiting: the [M3 API reference](/docs/pr-105/docs/hiecm/v3/api/m3) documents the consent request status call.

## Work through these in order

1. **Does the patient's app show the request at all?** The gateway notifies the patient through the ABHA App when a consent request is raised. If the patient uses a third party PHR app instead, that app needs an approved subscription with the gateway to be notified of a new consent request; without one, the request can sit unseen even though it was accepted.
2. **Has the request expired?** A consent request carries a window the requester sets for the patient to respond, separate from how long access lasts once granted. See [Consent](/docs/pr-105/docs/hiecm/v3/concepts/consent#consent-artefact) for the two clocks. Running out of the request window moves the state to Expired, not Requested, so checking the current status tells you if this has already happened.
3. **Was it raised against the right ABHA address?** An address that is malformed or does not exist produces an error and the request goes nowhere. A syntactically valid address that belongs to a different real patient will not error at all: the request is delivered and seen, just by the wrong person, not the one you meant. Getting the address right matters more than passing validation.

### How you know it worked

The consent request status reports Granted or Denied rather than Requested. A Granted result also carries the id of at least one consent artefact, and a granted request can produce more than one.

### When it goes wrong

If the patient's app shows the request, it has not expired, and the address is correct, and the state is still Requested after a reasonable wait, this is expected: Requested means the patient has not decided yet, and there is no call that makes them decide faster. If you believe the patient acted and the state did not change, raise a request on the [support ticketing platform](https://sandboxsupport.abdm.gov.in/). Report the consent request id, the `REQUEST-ID` from the init call, the `TIMESTAMP`, and the status response. See [what to put in a support request](/docs/pr-105/docs/hiecm/v3/troubleshooting#what-to-put-in-a-support-request) for the full report format.

This symptom can surface as an invalid or non-existent ABHA address on the [error codes reference](/docs/pr-105/docs/hiecm/v3/reference/error-codes).

Notes for AI agents

**Before you start.** Confirm the consent request was accepted and hold its consent request id. Read the current state from the consent request status call rather than waiting on the next callback.

**What happens.** Check in order: the patient's app shows the request, the request window has not run out, and the ABHA address is the patient you meant. A third party PHR app sees a new consent request only through an approved subscription.

**How you know it worked.** The status call reports Granted or Denied. A grant carries at least one consent artefact id; store every one.

**When it goes wrong.** Requested with all three checks passing means the patient has not decided, and no call makes them decide. Do not raise a second request for the same need. If the patient says they acted and the state has not moved, hand the person the support report: the consent request id, the init call's `REQUEST-ID`, the `TIMESTAMP` and the status response.

## Next

[NextStill stuck? Read Consent end to endThe full state model, the two clocks, and who holds what.](/docs/hiecm/v3/concepts/consent)
