# HFR on UHI

The [HFR](/docs/pr-83/docs/uhi/v1/getting-started/glossary#hfr) is the national register of health facilities. On [UHI](/docs/pr-83/docs/uhi/v1/getting-started/glossary#uhi) it names the facility where a doctor practises.

## Where it appears

| Field                                                                          | Service                                                                                                                                        | Required |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `message.catalog.providers[].fulfillments[].agent.tags["@abdm/gov.in/hfr_id"]` | [Physical Consultation](/docs/pr-83/docs/uhi/v1/services/consultation), beside the doctor's [HPR](/docs/pr-83/docs/uhi/v1/registries/hpr) tags | No       |

## Next steps

- [HPR on UHI](/docs/pr-83/docs/uhi/v1/registries/hpr), the doctor this tag sits beside
- [Physical Consultation](/docs/pr-83/docs/uhi/v1/services/consultation), the service whose catalog carries this tag
