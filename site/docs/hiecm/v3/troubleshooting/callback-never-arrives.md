---
title: The callback never arrives
sidebar_label: Callback never arrives
description: A call returned 202, and nothing followed on your registered callback URL. The checks in order.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_1.md
sidebar_position: 1
covers: [hiecm.troubleshooting.callback-never-arrives]
---

# The callback never arrives

You made a call, it came back with a 202 or a 200, and nothing else has
happened since. This is the most common report in
[HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) integration,
and the cause is almost always the callback URL rather than the call
itself.

That early response only means [NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s
gateway accepted your request. In M2 and M3 the real answer arrives
later, as a POST from the gateway to a URL you registered in advance.
See [the gateway](/docs/hiecm/v3/concepts/gateway) for why this is the
normal shape of these flows, and [callbacks](/docs/hiecm/v3/reference/callbacks)
for the inbound side you receive it on.

## Work through these in order

1. **Is the callback URL registered with the gateway?** Confirm it with
   the [update bridge callback URL](/docs/hiecm/v3/api/gateway/endpoints/gateway-update-bridge-url)
   call. Setting a URL in a console once is not the same as confirming
   the gateway has it.
2. **Is that URL reachable from the public internet over HTTPS?** ABDM
   posts to it from outside your network. A URL that only answers on
   your local machine or behind a VPN will never receive anything, and
   the original call gives you no signal that this is wrong.
3. **Did the request expire before the other party answered?** How long
   a request stays live before ABDM gives up is not stated in NHA's
   documents we have. If you have waited what feels like a long time,
   say so when you escalate rather than assuming a fixed window.
4. **Is your endpoint returning a non success status?** A handler that
   errors, times out, or is slow is a real problem, though NHA does not
   document a specific policy for when or whether delivery attempts
   stop. Deliveries can repeat, so your handler has to treat every one
   as possibly a retry of one it already handled. Respond quickly with a
   success status even before you have finished processing the callback
   body.

## How you know it worked

Your handler receives a POST at your registered URL, carrying the exact
`REQUEST-ID` you generated for the original call. Until you have
observed that once, treat the callback path as unproven even if the
registration call itself succeeded.

## When it goes wrong

If all four checks pass and the callback still has not arrived, escalate
on the [NHA dev forum](https://devforum.abdm.gov.in). Report the API you
called, the `REQUEST-ID`, the `TIMESTAMP`, and the response you got. See
[Support](/docs/support) for the full report format.

This symptom can surface as
[ABDM-9999](/docs/hiecm/v3/reference/error-codes), NHA's catch-all for a
failure it does not explain further.

<a class="next-step" href="/docs/hiecm/v3/api/m2/user-journey">
<span class="next-step__eyebrow">Next</span>
<span class="next-step__label">Still stuck? Check the M2 user journey</span>
<span class="next-step__detail">Confirm which step of the sequence your call sits in, so you know which callback should follow it.</span>
</a>
