# ABHA on UHI

[ABHA](/docs/pr-15/docs/uhi/v1/getting-started/glossary#abha) is the patient's account: a 14 digit number and a readable address such as `name@abdm`. UHI uses the address, never the number, and only as a name for the person the booking is for.

## Where it appears

| Field                     | Service                                                                                  | Required  | Example                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `order.customer.id`       | [Physical consultation](/docs/pr-15/docs/uhi/v1/concepts/services/physical-consultation) | Yes       | `rahul.k001@sbx`                                                                                                       |
| `order.customer.id`       | [Ambulance booking](/docs/pr-15/docs/uhi/v1/concepts/services/ambulance-booking)         | Mandatory | `91XXXXXXXXXX@sbx`                                                                                                     |
| `chat.sender.person.id`   | Physical consultation                                                                    | Yes       | The ABHA address of the sender, or the doctor's [HPR](/docs/pr-15/docs/uhi/v1/registries/hpr) ID when the doctor sends |
| `chat.receiver.person.id` | Physical consultation                                                                    | Yes       | The other side of the same pair                                                                                        |

The `@sbx` suffix in both examples is the sandbox one. Production addresses end `@abdm`, so an address hardcoded from a sandbox test will fail once you are promoted.

## What UHI does not do with it

Nothing is verified here. UHI carries the address through the booking; it does not check that it exists, does not authenticate the person behind it, and creates no ABHA of its own. A patient who has no ABHA gets one through [M1](/docs/pr-15/docs/hiecm/v3/api/m1) on HIE-CM, which is where creation, login and [KYC](/docs/pr-15/docs/uhi/v1/getting-started/glossary#kyc) live.

Nor does an ABHA address in a UHI message give anyone a right to the patient's records. Records move on HIE-CM, under a consent artefact, and never as part of a booking. See [Consent on HIE-CM](/docs/pr-15/docs/hiecm/v3/concepts/consent) if that is what you are building.

## Next

- [HPR on UHI](/docs/pr-15/docs/uhi/v1/registries/hpr), the practitioner side of the same booking
- [Physical consultation](/docs/pr-15/docs/uhi/v1/concepts/services/physical-consultation), where both appear in full
