# Registries

[UHI](/docs/pr-119/docs/uhi/v1/getting-started/glossary#uhi) reads one registry of its own and carries identifiers from three ABDM registries. This page shows which identifier goes in which field.

| Registry                                                              | Identifies                                                                                                                                                                                                                                               | Where it appears in UHI                                                                     |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Network registry](/docs/pr-119/docs/uhi/v1/concepts/registry-lookup) | A participant on the UHI network: an [EUA](/docs/pr-119/docs/uhi/v1/getting-started/glossary#eua), an [HSPA](/docs/pr-119/docs/uhi/v1/getting-started/glossary#hspa) or the [UHI Gateway](/docs/pr-119/docs/uhi/v1/getting-started/glossary#uhi-gateway) | `POST /api/v1/networkregistry/lookup`, which returns a participant's public key and details |
| [ABHA](/docs/pr-119/docs/uhi/v1/registries/abha)                      | The patient                                                                                                                                                                                                                                              | `order.customer.id`, and the sender in a chat message                                       |
| [HPR](/docs/pr-119/docs/uhi/v1/registries/hpr)                        | The doctor                                                                                                                                                                                                                                               | `fulfillment.agent.id`, an `hpr_id` tag, and the receiver in a chat message                 |
| [HFR](/docs/pr-119/docs/uhi/v1/registries/hfr)                        | The facility                                                                                                                                                                                                                                             | An optional `hfr_id` tag beside the doctor                                                  |

## The network registry is UHI's own

The network registry holds the public key each participant registered at onboarding. Look a participant up before you check the signature on a direct call it sent you. See [Network registry lookup](/docs/pr-119/docs/uhi/v1/concepts/registry-lookup).

The sandbox registration form asks for your role, your callback URL and your public key. See [Get your sandbox credentials](/docs/pr-119/docs/uhi/v1/getting-started/sandbox).

## Next steps

- [ABHA on UHI](/docs/pr-119/docs/uhi/v1/registries/abha), the patient in a booking
- [HPR on UHI](/docs/pr-119/docs/uhi/v1/registries/hpr), the doctor in a booking
- [Network registry lookup](/docs/pr-119/docs/uhi/v1/concepts/registry-lookup), the call every direct exchange needs
