# 2026-09-28: the UHI set, ingested

Written by `scripts/ingest-uhi.mjs` from `gateway/UHI Documentation Requirements.yaml` (the contract) and `gateway/UHI Gateway Service.yaml` (which example belongs to which service). Every line is one edit the script made; nothing else was changed. Rerun the script to regenerate the specs and this log.

| Module | Operation | Edit |
| --- | --- | --- |
| network | `uhi_network_gateway_search` | example "Second search (HPR Address)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_search` | example "Second search (HPR Address)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_gateway_on_search` | example "1st Onsearch for search with Specialty(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_gateway_on_search` | example "1st on_search for search by Doctor name(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_gateway_on_search` | example "1st on_search for search Doctor by PinCode(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_gateway_on_search` | example "2nd on_search response " carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_on_search` | example "1st Onsearch for search with Specialty(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_on_search` | example "1st on_search for search by Doctor name(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_on_search` | example "1st on_search for search Doctor by PinCode(PhysicalConsultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_on_search` | example "2nd on_search response " carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| consultation | `uhi_consultation_init` | example "Patient provides any additional billing and fulfillment details and finalizes booking (Consultation)" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| consultation | `uhi_consultation_confirm` | example "Confirm request for the order" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| consultation | `uhi_consultation_on_confirm` | example "HSPA Platform sends FAILED status" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| consultation | `uhi_consultation_on_confirm_audit` | example "HSPA Platform sends FAILED status" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so |
| network | `uhi_network_gateway_search` | 6 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| network | `uhi_network_search` | 6 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| network | `uhi_network_gateway_on_search` | 6 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| network | `uhi_network_on_search` | 6 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_init` | 1 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_confirm` | 1 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_confirm_audit` | 1 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_status` | 7 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_status_audit` | 7 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_update_to_eua` | 5 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_update_to_hspa` | 1 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_update_audit` | 5 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_cancel` | 2 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| consultation | `uhi_consultation_on_cancel_audit` | 2 example(s) titled Teleconsultation left out: the portal documents Physical Consultation only |
| all | `Ack` | Ack.properties.ack referred to Ack itself; it becomes status, the ACK the guide shows in {"ack": {"status": "ACK"}} |
| network | `uhi_network_gateway_search` | operationId was `searchUsingPOST`; kept in x-abdm-nha-operation-id |
| network | `uhi_network_gateway_search` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| network | `uhi_network_gateway_on_search` | operationId was `searchUsingPOST_1`; kept in x-abdm-nha-operation-id |
| network | `uhi_network_gateway_on_search` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| network | `uhi_network_search` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| network | `uhi_network_on_search` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| network | `uhi_network_registry_lookup` | operationId was `gatewayLookupUsingPOST`; kept in x-abdm-nha-operation-id |
| network | `uhi_network_registry_lookup` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_select` | Authorization header parameter added, as NHA declares it on every other operation and the guide signs every call |
| consultation | `uhi_consultation_select` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_on_select` | Authorization header parameter added, as NHA declares it on every other operation and the guide signs every call |
| consultation | `uhi_consultation_on_select` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_init` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_on_init` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_confirm` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_on_confirm` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_status` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_on_status` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_cancel` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| consultation | `uhi_consultation_on_cancel` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_update_to_eua` | path `/on_update(EUA)` becomes `/on_update#to-eua`, with the real endpoint `/on_update` in x-actual-path |
| consultation | `uhi_consultation_on_update_to_eua` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_update_to_hspa` | path `/on_update(HSPA)` becomes `/on_update#to-hspa`, with the real endpoint `/on_update` in x-actual-path |
| consultation | `uhi_consultation_on_update_to_hspa` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_message_to_eua` | path `/on_message(EUA)` becomes `/on_message#to-eua`, with the real endpoint `/on_message` in x-actual-path |
| consultation | `uhi_consultation_on_message_to_eua` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_message_to_hspa` | path `/on_message(HSPA)` becomes `/on_message#to-hspa`, with the real endpoint `/on_message` in x-actual-path |
| consultation | `uhi_consultation_on_message_to_hspa` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_confirm_audit` | operationId was `AuditOnConfirmPOST`; kept in x-abdm-nha-operation-id |
| consultation | `uhi_consultation_on_confirm_audit` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_status_audit` | operationId was `AuditOnStatusPOST`; kept in x-abdm-nha-operation-id |
| consultation | `uhi_consultation_on_status_audit` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_update_audit` | operationId was `AuditOnUpdatePOST`; kept in x-abdm-nha-operation-id |
| consultation | `uhi_consultation_on_update_audit` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| consultation | `uhi_consultation_on_cancel_audit` | operationId was `AuditOnCancelPOST`; kept in x-abdm-nha-operation-id |
| consultation | `uhi_consultation_on_cancel_audit` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| ambulance | `uhi_ambulance_init` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link |
| ambulance | `uhi_ambulance_on_init` | summary from gateway/UHI Gateway Service.yaml; description is NHA's, followed by the signing link and the retry line |
| all | `info` | termsOfService `termsOfServiceUrl` and license `https://licenseUrl.com` are NHA's placeholders and are left out |
| all | `servers` | the sandbox server is listed first and the beta server last, described as used only when NHA asks; participant calls name the HSPA's provider_uri or the EUA's consumer_uri |
| all | `openapi` | 3.0.3 becomes 3.1.1; the role-grouped file carries no nullable, so no schema changes |
| all | `dates` | date and timestamp strings are quoted so a YAML 1.1 reader keeps them as strings |
