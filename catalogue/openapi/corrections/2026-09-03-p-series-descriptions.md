# Corrections, P1, P2, P3 and PHR application services: operation descriptions

Applied 2026-09-03 to `hiecm-p1.yaml`, `hiecm-p2.yaml`, `hiecm-p3.yaml` and
`hiecm-phr-services.yaml`. The upstream files, NHA's Postman collections
stored untouched under `catalogue/openapi/.raw/`, carry a name for each
request and no description. Every operation in these four files therefore
had no `description`, which fails `npm run lint:agent`: a chunk with no
prose retrieves against its path alone, and a coding agent reading the
generated page had nothing to tell it what the call does.

## What was added

One `description` per operation, 206 in all, written from the operation's
own signature: its method and path, the request name, its tag group, the
request body fields and the response fields. Where the collection groups
requests into a numbered sequence, the description names the step and the
callback that answers it. Nothing was written that the signature does not
support; where a name and its recorded response disagree (for example a
teleconsultation order list whose sample response carries LGD fields), the
description states the purpose the path and name give and does not describe
the sample.

Descriptions are reader prose, in the voice the portal uses everywhere:
what ABDM does, addressed to the integrator, with no reference to how the
text was produced.

## Re-applying after a future ingestion

Nothing regenerates these four files from the collection: the build reads
them and never writes them, and the only script that touches the collection
hashes it. A future NHA drop is brought in the way the 2026-09-01 drop was,
by diffing the drop against these files and keeping what is ours. The exact
text per `operationId` is the table at the end of this record, so if a
re-ingestion ever starts from the raw collection again, the descriptions can
be re-applied mechanically rather than rewritten.

## What was not changed

- No schema, parameter, path, tag or response was altered.
- Hardcoded sample values that the collections carry inside paths (a
  provider id `000`, a facility id `IN3310027864`, an ABHA address in a
  teleconsultation path) were left as they are. They are a separate
  correction, recorded in `PENDING.md`.
- No operation was run. Every one of these remains unverified, and the
  description says what the call is for, not what the sandbox returned.

## Confidence

HIGH for the 206 applied. Every description follows from the path, the
request name and the fields; none infers behaviour the signature does not
show. A reviewer who finds one that overreaches should shorten it to what
the signature supports rather than delete it, since an empty description
fails lint again.

## Operations touched, with the description applied

### hiecm-p1.yaml, 63 operations

| operationId | description |
|---|---|
| `p1_encryption` | Encrypts a value with the ABDM public key so it can be sent in the fields that only accept ciphertext, such as `loginId` and OTP values. |
| `p1_update_mobile_verify_otp` | Verifies the OTP sent for a mobile number update on an ABHA address. `authData` carries the transaction id and the encrypted OTP. |
| `p1_assign` | Links another ABHA address to the signed-in person's address under a relationship type, so the two profiles are managed as a family. |
| `p1_delink` | Removes the family link between the signed-in person's ABHA address and the related address given. |
| `p1_get_relationship_types` | Lists the relationship types an address can be assigned under, each with the id `assign` takes. |
| `p1_linked_by_me` | Lists the ABHA addresses the signed-in person has linked to their own as family members. |
| `p1_linked_to_me` | Lists the ABHA addresses that have linked the signed-in person's address as a family member. |
| `p1_reassign` | Moves an existing family link to a different relationship type without delinking and assigning again. |
| `p1_unassign` | Ends the family relationship with the related ABHA address given, on the signed-in person's side. |
| `p1_session_token` | Issues the access token every PHR application call carries as a bearer token, with its refresh token and both expiry windows. |
| `p1_certificate` | Returns the ABDM public key and the encryption algorithm to apply with it. Fetch it before encrypting any value for the PHR application services. |
| `p1_session_api` | Issues a gateway session token from a client id and secret. The token is the bearer credential for calls on the gateway host. |
| `p1_send_abha_otp_link_delink` | Sends an OTP to the ABHA number's registered contact to authorise linking or delinking an ABHA address. `loginId` is encrypted. |
| `p1_4_create_custom_phr_address` | Creates an ABHA address of the person's own choosing, once the registration transaction has been verified. |
| `p1_1_request_otp` | Starts ABHA address registration for a person who already holds an ABHA number, by sending an OTP. `loginId` is the encrypted ABHA number or Aadhaar. |
| `p1_5_get_phr_suggestions` | Suggests available ABHA addresses for the registration transaction, built from the person's verified profile. |
| `p1_2_verify_aadhaar` | Verifies the Aadhaar OTP for a registration transaction and records the person's consent to use Aadhaar for ABHA. |
| `p1_3_verify_auth` | Verifies the OTP for a registration transaction started against an ABHA number. `authData` carries the transaction id and the encrypted OTP. |
| `p1_4_check_phr_address_existence` | Checks whether an ABHA address is already taken before the person tries to register it. |
| `p1_2_get_districts_by_state_code` | Lists the districts of a state, keyed by LGD code, for the address section of registration. |
| `p1_3_search_lgd_by_pin_code` | Resolves a PIN code to its state and district LGD codes, so the address can be filled from the PIN alone. |
| `p1_1_get_all_states` | Lists every state with its LGD code, for the address section of registration. |
| `p1_5_register_details` | Completes mobile-based registration by submitting the person's profile details against the verified transaction, and creates the ABHA address. |
| `p1_1_request_otp_2` | Starts ABHA address registration for a person with no ABHA number, by sending an OTP to their mobile. `loginId` is the encrypted mobile number. |
| `p1_3_phr_address_suggestion` | Suggests available ABHA addresses from the person's name and date of birth, for a mobile-based registration transaction. |
| `p1_2_verify_otp` | Verifies the mobile OTP for a registration transaction. `authData` carries the transaction id and the encrypted OTP. |
| `p1_02_get_digilocker_account_get` | Returns the DigiLocker account linked to the signed-in ABHA address, if one has been connected. |
| `p1_03_get_access_token_oauth_callback_get` | Completes the DigiLocker OAuth flow: exchanges the authorisation code DigiLocker redirected back with for an access token. |
| `p1_10_get_hip_refresh_records_get` | Returns the records a refresh pulled from a HIP into DigiLocker, once the pull has completed. |
| `p1_08_fetch_incoming_records_bundle_post` | Fetches the FHIR bundle for one care context that a HIP has sent to the person's DigiLocker. |
| `p1_07_fetch_incoming_records_list_post` | Lists the records a HIP has sent to the person's DigiLocker within a date range. |
| `p1_09_pull_refresh_records_post` | Asks a HIP to send the person's latest records to DigiLocker. The records arrive later; poll the refresh endpoint for them. |
| `p1_01_get_health_records_list_get` | Lists the health records held in the person's DigiLocker. |
| `p1_06_read_uploaded_record_get` | Returns the content of one record the person uploaded to DigiLocker. |
| `p1_04_get_account_status_get` | Reports whether the person's DigiLocker account is connected and ready to receive records. |
| `p1_05_upload_record_post` | Uploads a file the person holds into their DigiLocker as a health record. |
| `p1_verify_and_assign` | Verifies the OTP for a family link transaction and, in the same step, links the given ABHA address under the relationship type. May also unassign a previous address. |
| `p1_get_district_with_statecode` | Lists the districts of a state with their LGD codes. |
| `p1_get_lgd_with_pincode` | Resolves a PIN code to its state and district LGD codes. |
| `p1_get_states` | Lists every state with its LGD code. |
| `p1_getprovidersbyid` | Returns one provider's registry entry: its identifier, facility type, whether it acts as a HIP, and whether it supports scan and pay. |
| `p1_iskycverified` | Reports whether the ABHA address given has completed KYC verification. |
| `p1_otp_request_aadhar_otp` | Starts a login by sending an OTP. `loginHint` names what the person is identifying with, and `loginId` is that value encrypted. |
| `p1_search_auth_methods_abhaaddress` | Returns the authentication methods available for an ABHA address, so the login can offer only the ones that will work. |
| `p1_login_otp_verify_aadhar` | Verifies the login OTP. On success the response carries the accounts linked to the identifier and a token for each, or a transaction to pick one with. |
| `p1_verify_user` | Completes a login that matched more than one account: selects the ABHA address to sign in as and returns its session tokens. |
| `p1_de_link_request` | Removes the link between the signed-in ABHA address and an ABHA number, against a verified transaction. |
| `p1_send_aadhaar_otp_link_delink` | Sends an Aadhaar OTP to authorise linking or delinking an ABHA number with the signed-in address. `loginId` is the encrypted Aadhaar. |
| `p1_verify_aadhaar_otp_link_delink` | Verifies the Aadhaar OTP for a link or delink transaction and returns the accounts it applies to. |
| `p1_get_notifications` | Lists the notifications delivered to the signed-in ABHA address. |
| `p1_update_mobile_request_otp` | Sends an OTP to a new mobile number so it can replace the one on the signed-in ABHA address. `loginId` is the encrypted new number. |
| `p1_get_profile` | Returns the signed-in person's ABHA profile: name, date of birth, gender and contact details. |
| `p1_get_phr_card` | Returns the person's ABHA card as an image for display or download. |
| `p1_link_request` | Links an ABHA number to the signed-in ABHA address, against a verified transaction. |
| `p1_get_qr_code` | Returns the QR code that encodes the person's ABHA address, for scanning at a facility. |
| `p1_logout` | Ends the session and invalidates its tokens. |
| `p1_send_abha_otp` | Sends an OTP to the contact registered on the signed-in ABHA address, to authorise a profile change. `loginId` is encrypted. |
| `p1_refresh_token` | Exchanges a refresh token for a new access token, so the session continues without signing in again. |
| `p1_set_preferred_abha_address` | Marks one of the person's ABHA addresses as the preferred one, against a verified transaction. |
| `p1_switch_profile` | Lists the other accounts the signed-in person can switch to and opens a transaction for the switch. |
| `p1_update_profile` | Updates the signed-in person's profile fields: name, date of birth, gender, contact details and photo. |
| `p1_verify_abha_otp` | Verifies the OTP sent for a profile change and returns the accounts and tokens it applies to. |
| `p1_verify_user_switch_profile` | Completes a profile switch: selects the ABHA address to continue as and returns its session tokens. |

### hiecm-p2.yaml, 49 operations

| operationId | description |
|---|---|
| `p2_bookmark_care_context` | Bookmarks a linked care context so it is easy to find again in the person's records. |
| `p2_get_care_context_links` | Lists the care contexts linked to the signed-in person's ABHA address, with the HIP each came from. |
| `p2_fetch_care_context_bundle_url` | Returns the download URLs for the FHIR bundles of one linked care context, with the fetch status. |
| `p2_get_linked_hips` | Lists the HIPs linked to the person whose records have not yet been transferred, with the base URL to download from. |
| `p2_get_file_metadata` | Returns a record file's name, size and chunk size, so it can be downloaded in parts. |
| `p2_download_file_chunk` | Downloads one chunk of a record file. Use the metadata call for the chunk size. |
| `p2_get_hip_ids` | Lists the HIPs whose records have been transferred for the person, with the base URL to download from. |
| `p2_get_data_flow_part_status` | Returns the status of one part of a health information transfer, by its transaction id. |
| `p2_get_health_information_by_transaction_id` | Returns the health information received for a transfer, by its transaction id. |
| `p2_health_information_on_request_callback` | Callback the gateway sends after a health information request: the transaction id for the transfer, or the error that stopped it. |
| `p2_get_links_by_hip` | Lists the person's linked care contexts grouped by HIP. |
| `p2_get_all_linked_care_contexts` | Lists every care context linked to the signed-in person, grouped by HIP. |
| `p2_add_my_record_bookmark` | Bookmarks a self-uploaded record by its care context reference. |
| `p2_delete_my_record_bookmark` | Removes a bookmark from a self-uploaded record. |
| `p2_get_all_care_context_links_for_abha_address` | Lists the care context links for an ABHA address with paging and filters: HIP, record type, bookmarked, self-uploaded and date range. |
| `p2_post_patient_consent_request` | Raises a consent request from the person's own PHR for records at the HIPs given, so they can be fetched into the app. |
| `p2_fetch_patient_health_information` | Fetches the health information received for the request ids given, with paging. |
| `p2_pull_patient_health_information` | Asks the HIPs given to send the person's records. The data arrives later through the transfer endpoint. |
| `p2_refresh_patient_health_information` | Asks the HIPs given to send any records added since the last transfer. |
| `p2_fetch_health_information_status` | Returns the transfer status for the transaction ids given. |
| `p2_get_patient_transaction_ids_by_hips` | Returns the transfer transaction ids for a person's records at the HIPs given, under the consent artefacts given. |
| `p2_phr_get_all_care_context_links` | Lists every care context linked to the signed-in person, grouped by HIP. |
| `p2_phr_save_care_context_bundle_url` | Records where the FHIR bundle for a care context was stored, with its fetch status. |
| `p2_phr_fetch_care_context_bundle_url` | Returns the download URLs for the FHIR bundles of one linked care context, with the fetch status. |
| `p2_phr_get_care_context_links` | Lists the care contexts linked to the signed-in person's ABHA address, with the HIP each came from. |
| `p2_phr_get_linked_hips` | Lists the HIPs whose records have been transferred for the person, with the base URL to download from. |
| `p2_phr_get_file_metadata` | Returns a record file's name, size and chunk size, so it can be downloaded in parts. |
| `p2_phr_download_file_chunk` | Downloads one chunk of a record file. Use the metadata call for the chunk size. |
| `p2_phr_pull_health_information_for_care_context` | Asks a HIP to send the records for one care context. The data arrives later through the transfer endpoint. |
| `p2_phr_refresh_patient_health_information` | Asks the HIPs given to send any records added since the last transfer. |
| `p2_mark_linked_facility_as_read` | Marks the records from one HIP as seen, clearing the unread indicator for that facility. |
| `p2_save_care_context_link` | Records a care context link for a person, with the HIP it came from and whether its data has been transferred. |
| `p2_search_care_context_links` | Searches the person's care context links by the query parameters given. |
| `p2_health_information_data_transfer_hip_to_hiu` | Receives a page of encrypted health information from a HIP, with the key material needed to decrypt it. Pages arrive in sequence under one transaction id. |
| `p2_public_health_lockers_unsubscribe` | Ends the person's subscription to a health locker, so it stops receiving their new records. |
| `p2_onpatientshare` | Callback the gateway sends after a profile share at a facility, acknowledging the share request. |
| `p2_call_back_link_on_confirm` | Callback the gateway sends after a link confirmation: the patient's linked care contexts, or the error that stopped it. |
| `p2_call_back_on_init` | Callback the gateway sends after a link is initiated: the link reference and how the person will authenticate, or the error that stopped it. |
| `p2_public_health_lockers_subscribe` | Subscribes the person to a health locker, so their new records are shared with it automatically. |
| `p2_public_get_subscribed_lockers_by_patientid` | Lists the health lockers a person is subscribed to. |
| `p2_profile_share` | Shares the person's profile with a facility after scanning its counter QR code, so the facility can register them without typing details. |
| `p2_as_recordshare_on_notify` | Callback the gateway sends to notify the PHR that a record share has been acted on. |
| `p2_as_record_on_share` | Callback the gateway sends with the outcome of a record share request. |
| `p2_as_recordshare` | Shares selected records with a facility after scanning its counter QR code. |
| `p2_as_recordshare_history` | Lists the record shares the person has made, with the sending and receiving facilities and the counter they were shared at. |
| `p2_03_link_confirm` | Confirms a user-initiated link with the OTP the HIP sent, completing the link of the discovered care contexts. |
| `p2_01_discovery` | Discovers the person's care contexts at a HIP using their demographics and any identifiers they hold there. |
| `p2_02_link_init` | Initiates linking of the care contexts discovered at a HIP. The HIP replies with how the person will authenticate. |
| `p2_call_back_on_discovery` | Callback the gateway sends with the care contexts discovered at the HIP, or the error that stopped discovery. |

### hiecm-p3.yaml, 35 operations

| operationId | description |
|---|---|
| `p3_get_all_consent_artefacts_by_abha_address` | Lists the consent artefacts granted by the signed-in ABHA address, with paging. |
| `p3_get_consent_request_list` | Lists the consent requests raised against the signed-in ABHA address, with paging. |
| `p3_get_consent_request_by_request_id` | Returns one consent request: who is asking, for what purpose, which record types, and its current status. |
| `p3_approve_consent_request` | Approves a consent request. `consents` names the HIPs and care contexts the person is granting, and the artefact ids come back. |
| `p3_get_all_consent_artefacts_by_request_id` | Lists the consent artefacts created when a request was approved, one per HIP. |
| `p3_deny_consent_request` | Denies a consent request, with the reason the person gave. |
| `p3_hiu_on_fetch_consent_artefact_fetch_callback` | Callback the gateway sends with a consent artefact the HIU asked to fetch, or the error that stopped it. |
| `p3_init_consent_request` | Raises a consent request as a HIU: names the patient, the purpose, the record types and the period of care wanted. |
| `p3_hiu_consent_notification` | Notification the gateway sends a HIU when a consent request is granted, denied, revoked or expires. |
| `p3_hiu_consent_request_on_init_callback` | Callback the gateway sends after a consent request is raised: the request id to track it by, or the error that stopped it. |
| `p3_disable_auto_approval` | Turns off an auto-approval policy, so later consent requests it would have matched wait for the person again. |
| `p3_enable_auto_approval` | Turns an auto-approval policy back on. |
| `p3_consent_auto_approve` | Creates an auto-approval policy: consent requests from the HIU named are approved without asking, for the sources included and not the ones excluded. |
| `p3_revoke_consent` | Revokes the consent artefacts given, so the HIUs holding them can no longer fetch under them. |
| `p3_get_consent_artefact_by_artefact_id` | Returns one consent artefact with its signature and current status. |
| `p3_get_links` | Lists the person's linked care contexts at the HIPs given, for choosing what to grant in a consent. |
| `p3_edit_subscription` | Edits a subscription and approves it in the same step, changing which HIPs and categories the HIU is subscribed to. |
| `p3_get_all_hiu_subscription_requests` | Lists the subscription requests HIUs have raised against the signed-in ABHA address, with paging. |
| `p3_initiate_subscription_request` | Raises a subscription request as a HIU: asks to be notified when the patient links new care contexts at the HIPs and categories named, for a period. |
| `p3_get_subscription_details_by_request_id` | Returns one subscription request with its status and details, by the request id. |
| `p3_get_subscription_details_by_subscription_id` | Returns one subscription with its details, by the subscription id. |
| `p3_approve_subscription_request` | Approves a subscription request for the sources included and not the ones excluded, or for every HIP. |
| `p3_deny_subscription_request` | Denies a subscription request, so the HIU is not notified of the person's new care contexts. |
| `p3_set_up_subscription_for_aarogya_setu` | Sets up the PHR application's own subscription, so it is notified when the person links new care contexts. |
| `p3_single_multiple_notification_read` | Marks one or more push notifications as read. |
| `p3_clear_notification` | Clears the push notifications given from the person's list. |
| `p3_add_feedback` | Records feedback from the person, with a title and body, against their ABHA. |
| `p3_get_all_notification_details` | Lists the person's push notifications with their read state and the unread count. |
| `p3_add_new_notification` | Creates a push notification for a person. |
| `p3_app_notification_token` | Returns the device token registered for push notifications to the signed-in person. |
| `p3_get_scheduled_push_notifications` | Lists the push notifications scheduled for later delivery, with their processing state. |
| `p3_schedule_push_notification_internal` | Schedules a push notification to a person for a given time, for example a medication reminder. |
| `p3_update_scheduled_push_notification` | Changes the delivery time of a scheduled push notification. |
| `p3_delete_push_notification` | Deletes a scheduled push notification by its id. |
| `p3_post_add_app_notification_token` | Registers a device token for push notifications, with the operating system it belongs to. |

### hiecm-phr-services.yaml, 59 operations

| operationId | description |
|---|---|
| `phr_services_step_3_init` | Initialises an ambulance booking for the service selected from search results. Beckn `init` action; the reply arrives at `on_init`. |
| `phr_services_step_4_on_init` | Callback carrying the provider's reply to an ambulance booking `init`: the quote and the terms to confirm. |
| `phr_services_step_2_on_search` | Callback carrying the ambulance providers and services that matched a search. |
| `phr_services_step_1_search` | Searches for ambulance services. Beckn `search` action; results arrive at `on_search`. |
| `phr_services_2_post_api_blood_bank_on_search` | Callback carrying the blood banks and stock that matched a search. |
| `phr_services_1_post_api_blood_bank_search` | Searches for blood banks and blood availability. Beckn `search` action; results arrive at `on_search`. |
| `phr_services_search_facilities_within_radius` | Finds health facilities within a radius of a point, filtered by ownership, speciality and facility type, with paging. |
| `phr_services_get_specialists` | Lists the specialities available for filtering a facility search. |
| `phr_services_get_orders_by_id` | Returns one teleconsultation order by its order id, with the service, the professional and the fulfilment time. |
| `phr_services_get_orders_by_abha_id` | Lists the teleconsultation orders placed by an ABHA address. |
| `phr_services_1_on_search` | Callback carrying the teleconsultation providers and services that matched a search. |
| `phr_services_1_first_search` | Searches for teleconsultation services by category. Beckn `search` action; results arrive at `on_search`. |
| `phr_services_create` | Saves a place as a bookmark for the signed-in ABHA address, with a title, address and coordinates. |
| `phr_services_delete` | Deletes one of the person's saved place bookmarks. |
| `phr_services_getbyabhaaddress` | Lists the places the signed-in ABHA address has bookmarked. |
| `phr_services_get_summary` | Lists the person's bookmarked places in summary form: title, address and coordinates. |
| `phr_services_update` | Updates the title or address of a saved place bookmark. |
| `phr_services_aarogya_setu_sandbox_url_api_health_service_doctor_` | Finds doctors within a radius of a point, filtered by name, speciality, facility ownership and type, with paging. |
| `phr_services_get_languanges` | Lists the languages a doctor can be filtered by. |
| `phr_services_aarogya_setu_sandbox_url_api_health_service_doc_2` | Lists the systems of medicine a doctor can be filtered by. |
| `phr_services_search_doctor_by_id` | Returns a doctor's registry profile by their ABHA number: registration, qualifications, system of medicine and experience. |
| `phr_services_get_distinct_category_list` | Lists the distinct facility categories, with the care settings each offers. |
| `phr_services_get_category_list` | Lists the facility categories available for filtering a search. |
| `phr_services_get_specialists_category_list` | Lists the specialities available for filtering a facility search. |
| `phr_services_get_doctor_details` | Lists the doctors at a facility, by the facility's search id. |
| `phr_services_get_system_of_medicine_list` | Lists the systems of medicine a facility can be filtered by. |
| `phr_services_get_facility_details_by_search_id` | Returns a facility's registry entry by its search id, including its contact person and address. |
| `phr_services_get_coverage_eligibility` | Checks whether a person's insurance policy covers them, through the National Health Claims Exchange. The result arrives at `on_check`. |
| `phr_services_get_policies` | Lists the insurance policies held against an ABHA number. `encryptedAbhaNumber` is the ABHA number encrypted. |
| `phr_services_search` | Searches a payer's records for a member's policy through the National Health Claims Exchange. The result arrives at `on_submit`. |
| `phr_services_on_check` | Callback carrying the payer's answer to a coverage eligibility check. |
| `phr_services_nhcx_onsubscribe` | Callback confirming a subscription to National Health Claims Exchange notifications. |
| `phr_services_subscribe` | Subscribes the PHR to National Health Claims Exchange notifications. Confirmation arrives at `on_subscribe`. |
| `phr_services_on_submit` | Callback carrying the payer's answer to a policy search. |
| `phr_services_get_details` | Lists the person's scan and pay requests with the status, order number and transaction id of each. |
| `phr_services_notify_status` | Returns the payment status of one scan and pay request, with the receipt link once paid. |
| `phr_services_openorder` | Opens a scan and pay order after the person scans a facility's payment counter QR code. |
| `phr_services_order_status` | Returns the status of a scan and pay order by its order number. |
| `phr_services_payment_order` | Creates the payment order for the procedures selected and returns the UPI intent to pay with. |
| `phr_services_update_payment` | Records the outcome of a scan and pay payment: the amount, the transaction id and the receipt. |
| `phr_services_4_confirm` | Confirms a teleconsultation booking. Beckn `confirm` action; the reply arrives at `on_confirm`. |
| `phr_services_get_categories` | Lists the teleconsultation categories available to search in. |
| `phr_services_get_categories_by_id` | Returns one teleconsultation category by its id. |
| `phr_services_get_orders_by_abha_id_and_type` | Lists the teleconsultation orders of an ABHA address, filtered by order type. |
| `phr_services_get_orders_by_abha_id_desc` | Lists the teleconsultation orders of an ABHA address, newest first. |
| `phr_services_3_init` | Initialises a teleconsultation booking for the service selected. Beckn `init` action; the reply arrives at `on_init`. |
| `phr_services_7_on_message` | Sends a message within a teleconsultation. Beckn `message` action. |
| `phr_services_6_on_cancel` | Callback carrying the provider's reply to a teleconsultation cancellation. |
| `phr_services_4_on_confirm` | Callback carrying the provider's confirmation of a teleconsultation booking, with the order details. |
| `phr_services_3_on_init` | Callback carrying the provider's reply to a teleconsultation `init`: the quote and the terms to confirm. |
| `phr_services_2_on_search` | Callback carrying the teleconsultation providers and services that matched a search. |
| `phr_services_5_on_status` | Callback carrying the current status of a teleconsultation order. |
| `phr_services_7_on_update` | Callback carrying the provider's reply to a teleconsultation update. |
| `phr_services_2_second_search` | Refines a teleconsultation search, for example by provider or time slot. Beckn `search` action; results arrive at `on_search`. |
| `phr_services_5_status` | Asks for the current status of a teleconsultation order. Beckn `status` action; the reply arrives at `on_status`. |
| `phr_services_6_on_update` | Updates a teleconsultation order, for example to reschedule. Beckn `update` action; the reply arrives at `on_update`. |
| `phr_services_on_search` | Callback carrying the PM-JAY empanelled facilities that matched a search. |
| `phr_services_rest_search` | Searches PM-JAY empanelled facilities and returns the results in the same call, without a callback. |
| `phr_services_search_2` | Searches PM-JAY empanelled facilities. Beckn `search` action; results arrive at `on_search`. |
