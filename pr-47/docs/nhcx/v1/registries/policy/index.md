# Policy registry

Before any claim-side call, the beneficiary has to be matched to a policy, and the policy tells you which participant to address. This page covers the lookup and the link that makes it work. The [Participant registry](/docs/pr-47/docs/nhcx/v1/registries/participant) covers how to find the payer in the first place.

## Finding a policy

Once the payer is known, the beneficiary has to be matched to a policy with that payer. The lookup accepts three identifiers, and a system that does not know which will work should try them in order of reliability.

- **ABHA number.** The strongest, and the one to try first.
- **Member ID.** The policy or member number captured at admission.
- **Mobile number.** The weakest, since a number may be shared or out of date.

What comes back, for each policy, is the insurer, who processes claims for it, the member ID, and the product. Two of those are participant codes and they are not always the same.

**Send claims to the processor, not the insurer.** An insurer may handle its own claims, in which case its `payerid` and `processingid` are the same code. Or it may use a TPA, in which case `processingid` is the TPA's participant code and that is where every request must go. The policy lookup tells you which. Put `processingid` on the envelope as the recipient. Pointing at `payerid` instead is the portal's seventh most common mistake, and the request goes nowhere useful.

A lookup that succeeds is worth keeping. The policy set for a patient does not change between one department and the next, so cache against the patient and provide a way to force a refresh. If the lookup returns no processor code, stop; no claim-side call can be addressed.

## Linking a policy to ABHA

The reason an ABHA number works as a policy identifier at all is that someone linked it earlier.

Linking is a Payer-side action, performed when the policy is created. The insurer links the beneficiary's ABHA number, mobile and member ID to the policy's products, naming itself as the payer and its TPA, or itself, as the processor. Only the party named as payer or processor can de-link it later; the exchange checks the caller's credentials against the link. If an insurer changes TPA, every affected policy is de-linked and re-linked with the new processor.

The effect is felt at the point of care. A beneficiary who walks in with only an ABHA number can be resolved to a policy without a card or a member ID, which is the whole point of linking it in the first place.
