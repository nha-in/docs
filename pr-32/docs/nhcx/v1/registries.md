# Registries

Nothing on NHCX can happen until two questions are answered: who am I sending this to, and which policy is it about. Neither is a claim exchange. Both are preconditions, and a system that skips them fails later with errors that look like claim problems but are not.

- [Participant registry](/docs/pr-32/docs/nhcx/v1/registries/participant): how a participant joins the network, registers its key and callback address, authenticates, and finds other participants.
- [Policy registry](/docs/pr-32/docs/nhcx/v1/registries/policy): how a beneficiary's policy is found, which participant code to address, and how a payer links a policy to ABHA.

## Why this comes first

A patient is not cashless simply because they hold insurance. Two things have to be true: the admission record must carry the scheme, payer, identifier and policy number, and the system must have resolved a valid processor code, product code and member ID. A patient can look correctly admitted as insured on screen while every NHCX call still fails, because the second condition was never met.

The order is fixed. Discover the payer, then discover the policy. Take the processor code, member ID and product from what came back, fetch the plan and its benefits, check eligibility, and only then submit a preauthorisation.

JWE, Status and Errors opens the envelope every one of those calls travels in. NHCX Use Cases lists the calls themselves.
