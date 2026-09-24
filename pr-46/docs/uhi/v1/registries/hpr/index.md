# HPR on UHI

The [HPR](/docs/pr-46/docs/uhi/v1/getting-started/glossary#hpr) is the national register of health professionals. On UHI it names the person a patient is booking: the doctor in a consultation.

## Where it appears

| Field                                                 | Stage                                                                                            | Required |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------- |
| `catalog.providers[].fulfillments[].agent.id`         | The catalogue an [HSPA](/docs/pr-46/docs/uhi/v1/getting-started/glossary#hspa) returns on search | Yes      |
| `catalog.providers[].fulfillments[].agent.tags`       | The same catalogue entry                                                                         | No       |
| `order.fulfillment.agent.id`                          | The order, from select onward                                                                    | Yes      |
| `chat.sender.person.id` and `chat.receiver.person.id` | Chat, when the doctor is one end of it                                                           | Yes      |

## Two forms of the same identifier

The practitioner appears two ways in the same sample. `agent.id` carries the readable address, `<HPR_ADDRESS>`. The tag block beside it carries the numeric ID, `@abdm/gov.in/hpr_id`, as `<HPR_ID>`.

Send the address in `agent.id`. The tag is optional, and it sits with the other practitioner tags The same block also carries: `@abdm/gov.in/experience`, `/languages`, `/education`, `/hpr_id`, `/hfr_id` and `/hip_id`.

## Where the ID comes from

Not from UHI. A professional is registered in the HPR through [M4](/docs/pr-46/docs/hiecm/v3/api/m4) on HIE-CM, and UHI quotes what M4 wrote. If your HSPA lists a doctor who has no HPR ID, the catalogue entry has no valid `agent.id` to carry, and there is no UHI call that will mint one.

## Next

- [HFR on UHI](/docs/pr-46/docs/uhi/v1/registries/hfr), the facility the practitioner works in
- [M4 Registry Integration](/docs/pr-46/docs/hiecm/v3/api/m4), where both are written
