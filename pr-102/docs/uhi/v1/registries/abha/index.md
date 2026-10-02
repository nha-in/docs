# ABHA on UHI

[ABHA](/docs/pr-102/docs/uhi/v1/getting-started/glossary#abha) is the patient's account. [UHI](/docs/pr-102/docs/uhi/v1/getting-started/glossary#uhi) carries the patient's ABHA address to name the person a booking is for.

## Where it appears

| Field                                  | Service                                                                       | Required | Example              |
| -------------------------------------- | ----------------------------------------------------------------------------- | -------- | -------------------- |
| `order.customer.id`                    | [Physical Consultation](/docs/pr-102/docs/uhi/v1/services/consultation)       | Yes      | `<ABHA_ADDRESS>`     |
| `order.customer.id`                    | [Ambulance Booking](/docs/pr-102/docs/uhi/v1/services/ambulance), from `init` | Yes      | `<abha-address>@sbx` |
| `message.intent.chat.sender.person.id` | Physical Consultation, a message from the patient                             | Yes      | `<ABHA_ADDRESS>`     |

The `@sbx` suffix in the Ambulance Booking sample is a sandbox address.

## Next steps

- [HPR on UHI](/docs/pr-102/docs/uhi/v1/registries/hpr), the doctor on the other side of the same booking
- [Physical Consultation](/docs/pr-102/docs/uhi/v1/services/consultation), where both appear in full
