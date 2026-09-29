# Proving a callback came from ABDM

To receive callbacks you register a URL that ABDM can reach. Reachable by ABDM means reachable by everyone, because it is an ordinary address on the public internet. A POST arriving there tells you nothing about who sent it.

The callbacks you host carry instructions about a named person's health records: a request to discover what you hold, a [consent artefact](/docs/pr-77/docs/hiecm/v3/concepts/consent) saying somebody agreed, an instruction to transfer records to a given address. A system that acts on whatever arrives will act on whatever an attacker sends.

## In short

- Anything can post to your callback URL, so check every callback before your handler acts.
- Require a bearer token in `Authorization`, and a `response.requestId` that matches a request you sent.
- Fail closed. A check that is skipped on error is worse than none.

## Check every callback before you act on it

Every callback in the specifications declares bearer authentication. The token arrives in the `Authorization` header as `Bearer <token>`. Check two things before your handler does any work:

1. **A bearer token is present.** Reject a callback without one, and log the rejection.
2. **It answers a call you made.** Its `response.requestId` matches the `REQUEST-ID` of a request you sent. A callback that answers nothing you sent is not yours to act on.

The keys that verify the token's signature are not among the published gateway calls. Confirm at onboarding how to verify the token, and meanwhile hold the two checks above.

The signature inside a consent artefact is a different thing. It signs the artefact's contents and proves the artefact was not altered. Checking the delivery does not check the artefact, and checking the artefact does not check the delivery.

### How you know it worked

A callback carrying a bearer token and a request id you sent is processed. The same body with the `Authorization` header removed is rejected before your handler reads the payload, and the rejection is logged. The second is the test worth writing, because it is the only one that fails loudly when the check is silently skipped.

### When it goes wrong

**The check is skipped under load.** A handler that checks inside a try block and continues on failure is worse than one that never checked, because it reads as safe. Fail closed.

**Nothing arrives at all**, which is a different problem. See [the callback never arrives](/docs/pr-77/docs/hiecm/v3/troubleshooting/callback-never-arrives).

Notes for AI agents

**Before you start.** A callback URL registered for your bridge, and the understanding that a 202 on your own call is not the answer. See [a 200 means accepted, not done](/docs/pr-77/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks).

**What happens.** In the handler, before parsing the body for action: require the `Authorization` header with a bearer token, then require that `response.requestId` matches a `REQUEST-ID` your system sent and has not already handled. Reject otherwise. Do not invent a signature check against a key source the specifications do not publish.

**How you know it worked.** A test posts a valid callback body without `Authorization` and sees it rejected and logged before any handler work.

**When it goes wrong.** Never fall back to processing a callback that failed a check while you investigate. A callback whose request id is unknown to you is logged and dropped, not retried.

## Next

- [A 200 means accepted, not done](/docs/pr-77/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks), why answers arrive as callbacks.
- [The API specifications](/docs/pr-77/docs/hiecm/v3/concepts/api-specifications), where every callback is described.
- [Consent](/docs/pr-77/docs/hiecm/v3/concepts/consent), the artefact whose own signature this page does not cover.
