# HPR on UHI

The [HPR](/docs/pr-82/docs/uhi/v1/getting-started/glossary#hpr) is the national register of health professionals. On [UHI](/docs/pr-82/docs/uhi/v1/getting-started/glossary#uhi) it names the doctor a patient books in [Physical Consultation](/docs/pr-82/docs/uhi/v1/services/consultation).

## Where it appears

| Field                                                   | Stage                                                                                               | Required |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| `message.intent.fulfillment.agent.id`                   | A search by the doctor's HPR address                                                                | No       |
| `message.catalog.providers[].fulfillments[].agent.id`   | The catalog an [HSPA](/docs/pr-82/docs/uhi/v1/getting-started/glossary#hspa) returns in `on_search` | Yes      |
| `message.catalog.providers[].fulfillments[].agent.tags` | The same catalog entry                                                                              | No       |
| `order.fulfillment.agent.id`                            | The order                                                                                           | Yes      |
| `message.intent.chat.receiver.person.id`                | A message from the patient to the doctor                                                            | Yes      |

## Two forms of the same identifier

- **`agent.id`** carries the HPR address, in the form `<HPR_ADDRESS>@hpr.ndhm`.
- **The `@abdm/gov.in/hpr_id` tag** carries the HPR ID, `<HPR_ID>`, among the doctor's other tags.

The same tag block can carry `@abdm/gov.in/experience`, `languages`, `education`, `hfr_id` and `hip_id`.

## Next steps

- [HFR on UHI](/docs/pr-82/docs/uhi/v1/registries/hfr), the facility tag beside the doctor
- [ABHA on UHI](/docs/pr-82/docs/uhi/v1/registries/abha), the patient in the same booking
- [Physical Consultation](/docs/pr-82/docs/uhi/v1/services/consultation), the service where a patient books the doctor
