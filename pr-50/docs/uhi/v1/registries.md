# Registries

UHI touches four registries, and only one of them belongs to UHI. After this page you will know which identifier goes in which field, and which ones onboarding asks you for.

| Registry                                        | Identifies                                                                                                                                                                       | Where it appears in UHI                                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Network registry                                | A subscriber on the UHI network: an [EUA](/docs/pr-50/docs/uhi/v1/getting-started/glossary#eua), an [HSPA](/docs/pr-50/docs/uhi/v1/getting-started/glossary#hspa) or the gateway | `POST /api/v1/networkregistry/lookup`, to fetch a counterparty's public key before a signed point to point call |
| [ABHA](/docs/pr-50/docs/uhi/v1/registries/abha) | The patient                                                                                                                                                                      | `order.customer.id`, and the person ids in chat                                                                 |
| [HPR](/docs/pr-50/docs/uhi/v1/registries/hpr)   | The practitioner                                                                                                                                                                 | `fulfillment.agent.id`, and an `hpr_id` tag                                                                     |
| [HFR](/docs/pr-50/docs/uhi/v1/registries/hfr)   | The facility or store                                                                                                                                                            | An `hfr_id` tag on a fulfillment                                                                                |

## The network registry is UHI's own

The other three are ABDM registries that UHI quotes. The network registry is UHI's, and it holds something the others do not: the public key each subscriber registered at onboarding. Both sides of a signed call look the counterparty up in it. [UHI gateway](/docs/pr-50/docs/uhi/v1/concepts/network-and-protocol) has the lookup and the signing.

## Onboarding does not ask for the other three

The onboarding form asks for your organisation details, your role, your callback URL and your public key. It does not ask for an [HPR](/docs/pr-50/docs/uhi/v1/getting-started/glossary#hpr) ID or an [HFR](/docs/pr-50/docs/uhi/v1/getting-started/glossary#hfr) entry, and no UHI document in this portal makes either a condition of joining the network.

They arrive by the back door instead. Your application must have completed [M2](/docs/pr-50/docs/hiecm/v3/api/m2) with [HIE-CM](/docs/pr-50/docs/uhi/v1/getting-started/glossary#hie-cm) before it can be onboarded to any UHI service, and that route does require a facility in the HFR and a professional in the HPR. See [Onboarding](/docs/pr-50/docs/uhi/v1/getting-started/onboarding) for the gate, and [HIE-CM's registries](/docs/pr-50/docs/hiecm/v3/registries) for what M4 writes into them.

## What UHI never does

UHI creates no registry entry. It issues no ABHA number, registers no professional and enrols no facility. Every identifier in a UHI message was written by a milestone on HIE-CM and is being quoted here, which is why a wrong one fails at the far end rather than at the gateway.
