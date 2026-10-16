UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1




                               National Health Authority
                                 Ayushman Bharat Digital Mission



                        Unified Health Interface
                          Ambulance Booking Service
                           Integrator Onboarding Documentation




​




                                        Version 1.1 • July 2026

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​       ​       ​       Integrator Onboarding Documentation | v1.1

1. About This Document

This document provides technical and operational guidance for organisations integrating with the
Ambulance Booking service on the Unified Health Interface (UHI) network under the Ayushman Bharat
Digital Mission (ABDM).
The document covers two integration roles:
   •​   End User Application (EUA): consumer-facing applications through which patients or caregivers
        discover and initiate ambulance booking.
   •​   Health Service Provider Application (HSPA): platforms operated by ambulance service providers
        that receive, process, and respond to booking requests.
Phase 1 of the Ambulance Booking service covers discovery and quote initiation: the search/on_search and
init/on_init flows. Booking confirmation, dispatch, and live tracking WILL BE COVERED in PHASE 2.




2. Background

2.1 The Problem
Access to a timely ambulance remains a critical gap in India's emergency healthcare response.
Fragmented information across providers, lack of real-time availability data, and the absence of a
standardised booking interface means that patients and caregivers must rely on word-of-mouth or manual
calls during time-critical emergencies. Private ambulance providers operate with little interoperability,
and their services are largely invisible to general-purpose health applications.


2.2 What UHI Enables
UHI provides an open, interoperable protocol layer that allows any compliant EUA to discover and initiate
ambulance bookings across any compliant HSPA, without bilateral integrations. An EUA sends a
standardised search request through the UHI Gateway; any registered HSPA within range responds with
availability, pricing, and estimated arrival time. The patient selects an option and initiates a booking
through the same standardised flow.
This enables ambulance providers to be discoverable across multiple consumer apps simultaneously, and
enables consumer apps to offer ambulance booking without building direct partnerships with each
provider.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​         ​        ​       ​          Integrator Onboarding Documentation | v1.1

3. User Story

Riya is in Pune when her father collapses at home. She opens a UHI-compliant health app on her phone
and selects "Book Ambulance". She enters her father's location and requests an emergency ALS
ambulance. Within seconds, the app shows her two available ambulances nearby, their estimated arrival
times, and indicative charges. She selects the ALS option, and requests a callback from the respective
provider that she has selected.




4. Ambulance Booking on UHI – Service Scope

4.1 Integration Roadmap
The Ambulance Booking service is being launched in two phases.

 Phase                  Scope                                 APIs Covered


 Phase 1 (Current)      Discovery and dispatch                search, on_search, init, on_init
                        initiation


 Phase 2                Full booking, dispatch, live          confirm, on_confirm, status, on_status, cancel,
 (Upcoming)             tracking                              on_cancel, on_update




4.2 Patient-Facing Capabilities (Phase 1)
   •​    Search for available ambulances by EMERGENCY CASE TYPE only and ambulance class (ALS, BLS, or
         ALL).
   •​    Provide pickup location (GPS + address) for EMERGENCY searches.
   •​    Receive a catalog of available ambulances from HSPAs, with estimated arrival time windows and
         indicative pricing.
   •​    Initiate a booking by sending patient details to the selected HSPA and receiving a call for the ambulance
         dispatch.

4.3 Out of Scope (Phase 1)
   •​    NON-EMERGENCY flow to be taken up in Phase 2.
   •​    Booking confirmation and order creation through EUA (Phase 2).
   •​    Driver and vehicle details: these are available only post-confirmation and must not appear in Phase 1
         payloads.
   •​    Live tracking and dispatch status updates on the EUA (Phase 2).
   •​    State-operated ambulance networks (e.g., 108 services) are not in scope for UHI integration currently.



National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​         ​        ​       ​        Integrator Onboarding Documentation | v1.1

5. Why Integrate

For EUA Integrators
   •​   Offer ambulance booking natively within your health app without bilateral agreements with individual
        providers.
   •​   Access real-time availability and pricing from all compliant ambulance HSPAs on the UHI network through
        a single integration.
   •​   Support both emergency and scheduled non-emergency ambulance (in future) needs within the same
        flow.

For HSPA Integrators
   •​   Make your ambulance fleet discoverable across all UHI-compliant consumer applications simultaneously.
   •​   Standardised protocol reduces custom integration effort per EUA partner.
   •​   Reach patients at the point of intent, through health applications already in use.




6. API Integration – Ambulance Booking Flow

6.1 Service Identity

 Parameter                          Value


 Domain                             nic2008:86909


 Core Version                       0.7.1


 Gateway (Discovery)                search routes through the UHI Gateway. All post-discovery calls (init
                                    onwards) are direct EUA-to-HSPA.




6.2 Authentication and Signing

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​       ​         ​     Integrator Onboarding Documentation | v1.1

All UHI API calls must be signed. The signing mechanism uses Ed25519 digital signatures and
BLAKE-512 body hashing.

 Component                       Detail


 Hashing algorithm               BLAKE-512 (for computing the digest of the request body)


 Signing algorithm               Ed25519 digital signature scheme


 EUA Authorization header        Authorization: {"headers":"(created) (expires)
                                 digest","algorithm":"ed25519","keyId":"<eua-id>|<key-id>|ed25519","c
                                 reated":"<epoch>","expires":"<epoch>","signature":"<base64-sig>"}


 Gateway header (inbound to      X-Gateway-Authorization header in same format, with keyId prefixed
 EUA)                            by gateway-nha


 Key generation utility          https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utilit
                                 y

All UHI API calls must be cryptographically signed. This applies to both EUAs (signing their search
requests) and the PMBI HSPA (signing its on_search responses). The signing mechanism is built on
Ed25519 digital signatures and BLAKE-512 body hashing.


UHI has designed its own Header Generation Toolkit. You will have to run the jar file on Terminal, enter
onboarding details like Subscriber ID, Public Key ID and the exact payload (in a string format) of the
specific search or on_search, into the toolkit to generate the signed header that needs to be added to the
request for authorization. Find more information here.



 Note: Your public key has already been registered with NHA. Keep your private key secure, never
 share it. EUAs must generate their own key pair during onboarding and submit only the public key to
 NHA to receive the onboarding details.



Clone the linked GitHub repository and run Generator.java (Option 1) to generate headers. Submit only
the Public Key to NHA. Watch this video for guidance.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​      ​       ​         Integrator Onboarding Documentation | v1.1

6.3 API Call Sequencing
Phase 1 covers two request-response pairs. Discovery (search/on_search) routes through the UHI
Gateway. Quote initiation (init/on_init) is a direct peer-to-peer call between the EUA and the selected
HSPA.

 No.    API              Interaction                      Purpose             Response    Category


 1      search           EUA → Gateway → HSPAs            Patient             ACK /       Acknowledgem
                                                          searches for        NACK        ent
                                                          available
                                                          ambulances by
                                                          case type,
                                                          requirements,
                                                          and pickup
                                                          location


 2      on_search        HSPA → Gateway → EUA             HSPA responds       ACK /       Acknowledgem
                                                          asynchronously      NACK        ent
                                                          with a catalog
                                                          of available
                                                          ambulances,
                                                          pricing
                                                          (indicative),
                                                          and range of
                                                          ETA


 3      init             EUA → HSPA (direct)              EUA sends           ACK /       Acknowledgem
                                                          patient details,    NACK        ent
                                                          billing info, and
                                                          selected
                                                          fulfilment to
                                                          initiate a
                                                          booking quote


 4      on_init          HSPA → EUA (direct)              HSPA responds       ACK /       Acknowledgem
                                                          with a              NACK        ent
                                                          confirmed
                                                          quote, payment
                                                          terms, and
                                                          cancellation



National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​        ​       ​       ​        Integrator Onboarding Documentation | v1.1

 No.    API              Interaction                        Purpose             Response       Category

                                                            policy for EUA
                                                            review




Step-by-step sequence
   1.​ EUA sends a search request to the UHI Gateway with case type (EMERGENCY), ambulance class
       (ideally put ALL), pickup GPS, and optional additional services.
   2.​ The Gateway broadcasts the search to all registered ambulance HSPAs.
   3.​ Each HSPA that has availability responds asynchronously with an on_search catalog to the EUA's
       callback URL (consumer_uri). Multiple HSPAs may respond to the same search.
   4.​ The EUA presents available options to the user. The user selects a fulfillment (a specific ambulance).
   5.​ The EUA sends an init request directly to the selected HSPA, carrying the order details, patient
       information, and selected fulfillment ID.
   6.​ The HSPA responds asynchronously with an on_init payload containing the quote, terms and conditions
       and . The EUA presents this to the user for review before proceeding to confirm (Phase 2).


Note: Driver and vehicle details (the agent block) must not be included in any Phase 1 payload. These
fields are only populated post-confirmation in Phase 2.



6.4 Search Filter Types

                           Ambulance Class
 Case Type                                             Required Location Fields
                           Codes


 EMERGENCY                 ALS, BLS, ALL               SOURCE only (pickup GPS + address)


 NON_EMERGENCY             ALS, BLS, ALL               SOURCE (pickup) and DESTINATION (drop-off),
                                                       both GPS + address required




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​     ​      ​            ​      Integrator Onboarding Documentation | v1.1

6.5 search – Request Field Reference

context (all fields mandatory)

 Field                    Type             Required          Description / Notes


 context.domain           string           Mandatory         Fixed: nic2008:86909


 context.country          string           Mandatory         Fixed: IND


 context.city             string           Mandatory         STD code of the city, e.g. std:011 for Delhi,
                                                             handle in the backend only like you will do it
                                                             for all other context fields


 context.action           string           Mandatory         Fixed: search


 context.core_version     string           Mandatory         Fixed: 0.7.1


 context.consumer_id      string           Mandatory         Registered EUA identifier


 context.consumer_uri     string           Mandatory         HTTPS callback URL of the EUA to receive
                                                             on_search responses


 context.message_id       string (UUID)    Mandatory         Unique identifier for this message


 context.timestamp        ISO 8601         Mandatory         Request timestamp


 context.transaction_id   string (UUID)    Mandatory         Shared across all messages in a single
                                                             transaction




message.intent (request filters)

 Field                                          Type          Required       Description / Notes


 message.intent.category.descriptor.code        string        Optional       Ambulance class filter: ALS,
                                                                             BLS or set ALL to return all
                                                                             classes.


 message.intent.fulfillment.type                string        Mandatory      Case type: EMERGENCY or
                                                                             NON_EMERGENCY




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​     ​         ​            ​    Integrator Onboarding Documentation | v1.1

 Field                                             Type         Required    Description / Notes


 message.intent.fulfillment.start.time.time        ISO 8601     Mandatory   Requested pickup time. Use
 stamp                                                                      current datetime for
                                                                            EMERGENCY.


 message.intent.fulfillment.end.time.timest        ISO 8601     Optional    Latest acceptable time window
 amp                                                                        end. WILL BE USED IN CASES
                                                                            FOR NON EMERGENCY ONLY


 message.intent.fulfillment.tags.additional_       string       Optional    Comma-separated list of
 services                                                                   additional services required,
                                                                            e.g. oxygen cylinder


 message.intent.locations[SOURCE].gps              string       Mandatory   Pickup location GPS
                                                                            coordinates: lat,long


 message.intent.locations[SOURCE].addres           string       Mandatory   Pickup location address text
 s


 message.intent.locations[DESTINATION].            string       Condition   Required for NON_EMERGENCY
 gps                                                            al          only [future scope]. Drop-off
                                                                            GPS coordinates.


 message.intent.locations[DESTINATION].            string       Condition   Required for NON_EMERGENCY
 address                                                        al          only. Drop-off address text.


 message.intent.item.descriptor.code               string       Mandatory   Fixed: AMBULANCE




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​        ​      Integrator Onboarding Documentation | v1.1

6.6 on_search – Response Field Reference

context fields

 Field                     Type           Required       Description / Notes


 context.action            string         Mandatory      Fixed: on_search


 context.provider_id       string         Mandatory      Registered HSPA identifier


 context.provider_uri      string         Mandatory      HSPA callback URL


 context.transaction_id    string         Mandatory      Matches the transaction_id from the search
                                                         request


 context.message_id        string         Mandatory      Matches the message_id from the search
                                                         request




message.catalog – provider and fulfillment fields

 Field                                      Type         Required     Description / Notes


 catalog.descriptor.name                    string       Mandatory    Name of the HSPA


 catalog.descriptor.images                  string       Optional     HSPA logo URL (ideally base64
                                            (URL)                     format)


 catalog.descriptor.flag                    boolean      Mandatory    false = service active; true =
                                                                      service paused


 providers[].id                             string       Mandatory    Provider identifier


 providers[].categories[].code              string       Mandatory    Ambulance class code: ALS, BLS


 providers[].fulfillments[].id              string       Mandatory    Unique fulfillment ID, e.g.
                                                                      ML-ALS-01. Referenced in
                                                                      item.fulfillment_id.


 providers[].fulfillments[].type            string       Mandatory    Case type: EMERGENCY or
                                                                      NON_EMERGENCY. Must match
                                                                      the search request type.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​       ​        ​     Integrator Onboarding Documentation | v1.1

 Field                                         Type         Required    Description / Notes


 providers[].fulfillments[].tracking           boolean      Mandatory   true if real-time tracking is
                                                                        supported for this fulfillment


 providers[].fulfillments[].start.time.time    ISO 8601     Mandatory   Estimated earliest arrival time
 stamp


 providers[].fulfillments[].end.time.timest    ISO 8601     Mandatory   Estimated latest arrival time
 amp


 providers[].fulfillments[].tags.additional_   string       Optional    Additional services available for
 services                                                               this fulfillment


 providers[].fulfillments[].tags.deeplink_u    string       Optional    Deeplink into the HSPA app for
 rl                                            (URL)                    this ambulance option


 providers[].items[].id                        string       Mandatory   Item identifier


 providers[].items[].descriptor.flag           boolean      Mandatory   true = payment required; false =
                                                                        no payment required


 providers[].items[].price.value               string       Mandatory   Base indicative price in INR


 providers[].items[].price.estimated_Value     string       Optional    Estimated total charge


 providers[].items[].price.minimum_Value       string       Optional    Minimum advance or base
                                                                        charge


 providers[].items[].price.maximum_Value       string       Optional    Maximum expected charge


 providers[].items[].fulfillment_id            string       Mandatory   Links item to fulfillment by ID




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​            ​   ​      Integrator Onboarding Documentation | v1.1

6.7 init – Request Field Reference
The init call is sent directly from the EUA to the HSPA (not through the Gateway). It carries the selected
order details along with patient, billing, and location information.

 Field                                     Type         Required       Description / Notes


 context.provider_id                       string       Mandatory      HSPA identifier, carried from
                                                                       on_search response


 context.provider_uri                      string       Mandatory      HSPA callback URL, carried from
                                                                       on_search response


 order.provider.id                         string       Mandatory      Provider ID selected by the user,
                                                                       from on_search


 order.item.id                             string       Mandatory      Item ID selected by the user, from
                                                                       on_search


 order.item.fulfillment_id                 string       Mandatory      Fulfillment ID selected by the user,
                                                                       from on_search


 order.fulfillment.id                      string       Mandatory      Matches item.fulfillment_id


 order.fulfillment.type                    string       Mandatory      Case type: EMERGENCY or
                                                                       NON_EMERGENCY [future]


 order.fulfillment.tracking                boolean      Mandatory      Carried from on_search fulfillment


 order.fulfillment.tags.additional_s       string       Optional       Additional services requested by the
 ervices                                                               patient


 order.fulfillment.tags.deeplink_url       string       Optional       Deeplink URL if provided by HSPA in
                                                                       on_search


 order.billing.name                        string       Mandatory      Patient or responsible person name


 order.billing.address                     object       Mandatory      Pickup address (locality, state,
                                                                       country, area_code)


 order.billing.phone                       string       Mandatory      Patient contact number




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​            ​    ​         Integrator Onboarding Documentation | v1.1

 Field                                    Type          Required       Description / Notes


 order.customer.id                        string        Mandatory      ABHA address of the patient, e.g.
                                                                       <ABHA_ADDRESS>


 order.customer.person.dob                string        Optional       Patient date of birth
                                          (YYYY-MM-
                                          DD)


 order.customer.person.gender             string        Optional       Patient gender: M / F / O


 order.locations[SOURCE]                  object        Mandatory      Pickup GPS and address


 order.locations[DESTINATION]             object        Conditiona     Required for NON_EMERGENCY.
                                                        l              Optional for EMERGENY. Drop-off
                                                                       GPS and address.




6.8 on_init – Response Field Reference
The on_init response is sent by the HSPA directly to the EUA. It confirms the order structure, provides a
binding quote, and communicates payment and cancellation terms.

 Field                               Type              Required       Description / Notes


 order.id                            string            Mandatory      Order ID generated by the HSPA. Carry
                                                                      this in all subsequent Phase 2 calls.


 order.fulfillment.tags.terms_refe   string            Mandatory      URL to the HSPA terms document,
 rence                               (URL)                            versioned


 order.quote.price.value             string            Mandatory      Total confirmed price in INR


 order.quote.breakup[].title         string            Mandatory      Line item name, e.g. Ambulance Base
                                                                      Charge, Consumable Charges


 order.quote.breakup[].price.valu    string            Mandatory      Line item amount in INR
 e


 order.payment.type                  string            Mandatory      Payment timing: ON-ORDER (at
                                                                      booking) or PRE-ORDER (advance)




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​       ​         ​      Integrator Onboarding Documentation | v1.1

 Field                                Type           Required       Description / Notes


 order.payment.status                 string         Mandatory      Current payment status, e.g.
                                                                    NOT_PAID


 order.terms[].type                   string         Mandatory      Term type: Commercial, Settlement,
                                                                    Cancellation, Refund, Payment


 order.terms[].termsState             string         Mandatory      State of term acceptance: INITIATED
                                                                    (awaiting EUA review)


 order.locations[SOURCE]              object         Mandatory      Pickup GPS and address, echoed from
                                                                    init


 order.locations[DESTINATION]         object         Conditiona     Drop-off GPS and address, echoed
                                                     l              from init for NON_EMERGENCY




Note:
The agent block (driver name, vehicle number, phone) must not appear in on_init. These fields are
populated only in on_confirm (Phase 2)


Most of these fields will be just sent to you but you can skip showing it to users right now. Once, we get to
the whole flow, this API would add more value before the citizen can finalise the booking.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1

7. Sample API Payloads

7.1 search – Emergency Request
Sent by the EUA to the Gateway. Searches for any available ALS ambulance for an emergency case with
pickup in Pune.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "search",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "timestamp": "2026-03-23T15:24:35",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "intent": {
        "category": {
          "descriptor": {
            "code": "ALS",
            "name": "ALS"
          }
        },
        "fulfillment": {
          "type": "EMERGENCY",
          "start": {
            "time": {
              "timestamp": "2026-01-05T15:24:35"
            }
          },
          "end": {
            "time": {
              "timestamp": "2026-01-05T23:59:59"
            }
          },
          "tags": {
            "additional_services": "oxygen cylinder, etc"
          }
        },
        "locations": [
          {
            "descriptor": {

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​       ​    ​      ​       Integrator Onboarding Documentation | v1.1
                 "code": "SOURCE",
                 "name": "SOURCE"
               },
               "gps": "12.423423,77.325647",
               "address": "<ADDRESS>"
              }
            ],
            "item": {
              "descriptor": {
                "code": "AMBULANCE",
                "name": "AMBULANCE"
              }
            }
        }
    }
}



7.2 search – Non-Emergency Request [FUTURE]
Sent by the EUA to the Gateway. Searches for a BLS ambulance for a scheduled transfer with pickup and
destination specified.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "search",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "timestamp": "2026-01-05T15:24:35",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "intent": {
        "category": {
          "descriptor": {
            "code": "BLS",
            "name": "BLS"
          }
        },
        "fulfillment": {
          "type": "NON_EMERGENCY",
          "start": {
            "time": {

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
                 "timestamp": "2026-01-05T15:24:35"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2026-01-05T23:59:59"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc"
              }
            },
            "locations": [
              {
                "descriptor": {
                  "code": "SOURCE",
                  "name": "SOURCE"
                },
                "gps": "12.423423,77.325647",
                "address": "<ADDRESS>"
              },
              {
                "descriptor": {
                  "code": "DESTINATION",
                  "name": "DESTINATION"
                },
                "gps": "12.900000,77.600000",
                "address": "<ADDRESS>"
              }
            ],
            "item": {
              "descriptor": {
                "code": "AMBULANCE",
                "name": "AMBULANCE"
              }
            }
        }
    }
}




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​        ​   ​      ​       Integrator Onboarding Documentation | v1.1

7.3 on_search – Emergency Response
Sent by the HSPA asynchronously to the EUA’s consumer_uri. Returns a catalog of available fulfillments
and pricing for the emergency search.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "on_search",
      "timestamp": "2026-04-16T17:52:00",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "provider_id": "<hspa-id>",
      "provider_uri": "https://<hspa-callback-url>/api/v1/hspa/ambulance",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "catalog": {
        "descriptor": {
          "name": "Medulance HSPA",
          "images": "https://example.com/logo.png",
          "flag": false,
          "short_desc": "Medulance: Ambulance Provider HSPA",
          "long_desc": "Description of the HSPA."
        },
        "providers": [
          {
            "id": "1",
            "descriptor": {
              "name": "Medulance",
              "flag": false,
              "short_desc": "Medulance Image",
              "long_desc": "HSPA description."
            },
            "categories": [
              {
                "id": "1",
                "descriptor": {
                  "name": "Advanced Life Support (ALS)",
                  "code": "ALS",
                  "flag": false
                }
              },


National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
              {
              "id": "2",
              "descriptor": {
                "name": "Basic Life Support (BLS)",
                "code": "BLS",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                       "name": "Patient Transport Ambulances (PTA)", *IGNORE ANY
RESPONSE FOR PTA, NOT IN SCOPE
                "code": "PTA",
                "flag": false
              }
            },
            {
              "id": "4",
              "descriptor": {
                "name": "Mortuary Van / Ambulance",
                "code": "MVA",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "ML-ALS-01",
              "type": "EMERGENCY",
              "tracking": true,
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              }
            },
            {

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
                "id": "ML-BLS-01",
                "type": "EMERGENCY",
                "tracking": false,
                "start": {
                  "time": {
                    "timestamp": "2026-01-05T12:35:00"
                  }
                },
                "end": {
                  "time": {
                    "timestamp": "2026-01-05T12:43:00"
                  }
                },
                "tags": {
                  "additional_services": "oxygen cylinder, etc",
                  "deeplink_url": "https://deeplinkurl.com"
                }
             }
           ],
           "items": [
             {
               "id": "1",
               "descriptor": {
                 "name": "Charges",
                 "flag": true,
                 "short_desc": "Applicability note",
                 "long_desc": "Disclaimer text"
               },
               "price": {
                 "currency": "INR",
                 "value": "500",
                 "estimated_Value": "500",
                 "minimum_Value": "200",
                 "maximum_Value": "1500"
               },
               "category_id": "1",
               "fulfillment_id": "ML-ALS-01"
             },
             {
               "id": "2",
               "descriptor": {
                 "name": "Charges",
                 "flag": false,
                 "short_desc": "Applicability note",
                 "long_desc": "Disclaimer text"
               },
               "price": {

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​                ​        ​         ​         Integrator Onboarding Documentation | v1.1
                              "currency": "INR",
                              "value": "300",
                              "estimated_Value": "300",
                              "minimum_Value": "0",
                              "maximum_Value": "1000"
                            },
                            "category_id": "2",
                            "fulfillment_id": "ML-BLS-01"
                        }
                    ]
                }
            ]
        }
    }
}



    Note: Fulfilment ID referencing: Each fulfillment id (e.g. ML-ALS-01) is used twice: once where it's declared in
    fulfillments[], and once where it's referenced by items[].fulfillment_id, linking that item's charge to the specific
    fulfillment. The item also carries category_id, so the full chain is category → fulfillment → item, joined entirely through
    the item object.



7.4 on_search – Non-Emergency Response [FUTURE]
Same structure as 7.3 above, with fulfillment.type set to NON_EMERGENCY for the applicable fulfillment.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "on_search",
      "timestamp": "2026-04-16T17:52:00",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "provider_id": "<hspa-id>",
      "provider_uri": "https://<hspa-callback-url>/api/v1/hspa/ambulance",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "catalog": {
        "descriptor": {
          "name": "Medulance HSPA",
          "images": "https://example.com/logo.png",
          "flag": false,
          "short_desc": "Medulance: Ambulance Provider HSPA",

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
         "long_desc": "Description of the HSPA."
       },
       "providers": [
         {
           "id": "1",
           "descriptor": {
             "name": "Medulance",
             "flag": false,
             "short_desc": "Medulance Image",
             "long_desc": "HSPA description."
           },
           "categories": [
             {
               "id": "1",
               "descriptor": {
                 "name": "Advanced Life Support (ALS)",
                 "code": "ALS",
                 "flag": false
               }
             },
             {
               "id": "2",
               "descriptor": {
                 "name": "Basic Life Support (BLS)",
                 "code": "BLS",
                 "flag": false
               }
             },
             {
               "id": "3",
               "descriptor": {
                 "name": "Patient Transport Ambulances (PTA)",
                 "code": "PTA",
                 "flag": false
               }
             },
             {
               "id": "4",
               "descriptor": {
                 "name": "Mortuary Van / Ambulance",
                 "code": "MVA",
                 "flag": false
               }
             }
           ],
           "fulfillments": [
             {

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
               "id": "ML-ALS-01",
               "type": "NON_EMERGENCY",
               "tracking": true,
               "start": {
                 "time": {
                   "timestamp": "2026-01-05T12:30:00"
                 }
               },
               "end": {
                 "time": {
                   "timestamp": "2026-01-05T12:35:00"
                 }
               },
               "tags": {
                 "additional_services": "oxygen cylinder, etc",
                 "deeplink_url": "https://deeplinkurl.com"
               }
             },
             {
               "id": "ML-BLS-01",
               "type": "EMERGENCY",
               "tracking": false,
               "start": {
                 "time": {
                   "timestamp": "2026-01-05T12:35:00"
                 }
               },
               "end": {
                 "time": {
                   "timestamp": "2026-01-05T12:43:00"
                 }
               },
               "tags": {
                 "additional_services": "oxygen cylinder, etc",
                 "deeplink_url": "https://deeplinkurl.com"
               }
             }
           ],
           "items": [
             {
               "id": "1",
               "descriptor": {
                 "name": "Charges",
                 "flag": true,
                 "short_desc": "Applicability note",
                 "long_desc": "Disclaimer text"
               },

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​          ​     ​      ​     Integrator Onboarding Documentation | v1.1
                          "price": {
                            "currency": "INR",
                            "value": "500",
                            "estimated_Value": "500",
                            "minimum_Value": "200",
                            "maximum_Value": "1500"
                          },
                          "category_id": "1",
                          "fulfillment_id": "ML-ALS-01"
                        },
                        {
                          "id": "2",
                          "descriptor": {
                            "name": "Charges",
                            "flag": false,
                            "short_desc": "Applicability note",
                            "long_desc": "Disclaimer text"
                          },
                          "price": {
                            "currency": "INR",
                            "value": "300",
                            "estimated_Value": "300",
                            "minimum_Value": "0",
                            "maximum_Value": "1000"
                          },
                          "category_id": "2",
                          "fulfillment_id": "ML-BLS-01"
                        }
                    ]
                }
            ]
        }
    }
}




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​         ​     ​       Integrator Onboarding Documentation | v1.1

7.5 init – Request
Sent by the EUA directly to the selected HSPA. Carries patient details, billing, selected item and
fulfillment, and both pickup and destination.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "init",
      "timestamp": "2026-01-05T15:24:35",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "provider_id": "<hspa-id>",
      "provider_uri": "https://<hspa-callback-url>/api/v1/hspa/ambulance",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "order": {
        "provider": {
          "id": "1",
          "descriptor": {
            "name": "Medulance",
            "short_desc": "Medulance Image",
            "long_desc": "HSPA description."
          }
        },
        "item": {
          "id": "1",
          "descriptor": {
            "name": "Charges",
            "flag": true,
            "long_desc": "Disclaimer",
            "short_desc": "Applicability"
          },
          "price": {
            "currency": "INR",
            "value": "500",
            "estimated_Value": "500",
            "minimum_Value": "200",
            "maximum_Value": "1500"
          },
          "category_id": "1",
          "fulfillment_id": "ML-ALS-01"


National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
       },
       "fulfillment": {
         "id": "ML-ALS-01",
         "type": "EMERGENCY",
         "tracking": true,
         "start": {
           "time": {
             "timestamp": "2026-01-05T12:30:00"
           }
         },
         "end": {
           "time": {
             "timestamp": "2026-01-05T12:35:00"
           }
         },
         "tags": {
           "additional_services": "oxygen cylinder, etc",
           "deeplink_url": "https://deeplinkurl.com"
         }
       },
       "billing": {
         "name": "<NAME>",
         "address": {
           "door": "",
           "name": "Patient Name",
           "locality": "<ADDRESS>",
           "state": "State",
           "country": "INDIA",
           "area_code": "500067"
         },
         "phone": "9XXXXXXXXX",
         "email": ""
       },
       "customer": {
         "id": "<abha-address>@sbx",
         "person": {
           "dob": "<DOB>",
           "gender": "M",
           "dayOfBirth": "<DOB>",
           "monthOfBirth": "<DOB>",
           "yearOfBirth": "<DOB>"
         }
       },
       "locations": [
         {
           "descriptor": {
             "code": "SOURCE",

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​     ​       ​      Integrator Onboarding Documentation | v1.1
                    "name": "SOURCE"
                  },
                  "gps": "12.423423,77.325647",
                  "address": "<ADDRESS>"
                },
                {
                  "descriptor": {
                    "code": "DESTINATION",
                    "name": "DESTINATION"
                  },
                  "gps": "12.900000,77.600000",
                  "address": "<ADDRESS>"
                }
            ]
        }
    }
}




7.6 on_init – Response
Sent by the HSPA directly to the EUA’s consumer_uri. Contains a confirmed quote with breakup, payment
terms, and cancellation policy.
{
    "context": {
      "domain": "nic2008:86909",
      "country": "IND",
      "city": "std:011",
      "action": "on_init",
      "timestamp": "2026-04-16T17:54:01",
      "core_version": "0.7.1",
      "consumer_id": "<your-eua-id>",
      "consumer_uri": "https://<your-callback-url>/api/v1/euaService",
      "provider_id": "<hspa-id>",
      "provider_uri": "https://<hspa-callback-url>/api/v1/hspa/ambulance",
      "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
      "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
    },
    "message": {
      "order": {
        "id": "7661-863173-3384",
        "provider": {
          "id": "1",
          "descriptor": {
            "name": "Medulance",
            "flag": false,


National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
           "short_desc": "Medulance Image",
           "long_desc": "HSPA description."
         }
       },
       "item": {
         "id": "1",
         "descriptor": {
           "name": "Charges",
           "flag": true,
           "short_desc": "Applicability",
           "long_desc": "Disclaimer"
         },
         "price": {
           "currency": "INR",
           "value": "500",
           "estimated_Value": "500",
           "minimum_Value": "200",
           "maximum_Value": "1500"
         },
         "category_id": "1",
         "fulfillment_id": "ML-ALS-01"
       },
       "fulfillment": {
         "id": "ML-ALS-01",
         "type": "EMERGENCY",
         "tracking": true,
         "start": {
           "time": {
             "timestamp": "2026-01-05T12:30:00"
           }
         },
         "end": {
           "time": {
             "timestamp": "2026-01-05T12:35:00"
           }
         },
         "tags": {
           "terms_reference": "https://termsreference.com",
           "additional_services": "oxygen cylinder, etc",
           "deeplink_url": "https://deeplinkurl.com"
         }
       },
       "billing": {
         "name": "<NAME>",
         "address": {
           "door": "",
           "name": "Patient Name",

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
           "locality": "<ADDRESS>",
           "state": "State",
           "country": "INDIA",
           "area_code": "500067"
         },
         "email": "",
         "phone": "9XXXXXXXXX"
       },
       "quote": {
         "price": {
           "currency": "INR",
           "value": "500.0"
         },
         "breakup": [
           {
             "title": "Ambulance Base Charge",
             "price": {
               "currency": "INR",
               "value": "400.0"
             }
           },
           {
             "title": "Consumable Charges",
             "price": {
               "currency": "INR",
               "value": "100.0"
             }
           }
         ]
       },
       "customer": {
         "id": "<abha-address>@sbx",
         "person": {
           "gender": "M",
           "dayOfBirth": "<DOB>",
           "monthOfBirth": "<DOB>",
           "yearOfBirth": "<DOB>",
           "dob": "<DOB>"
         }
       },
       "payment": {
         "type": "ON-ORDER",
         "status": "NOT_PAID"
       },
       "terms": [
         {
           "type": "Commercial",

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​    ​       ​      ​       Integrator Onboarding Documentation | v1.1
           "descriptor": {
             "name": "Commercial terms and conditions",
             "flag": false,
             "short_desc": "Short description",
             "long_desc": "Long description"
           },
           "reasonRequired": false,
           "timePeriod": "2024-11-12T09:00:00",
           "reason": "",
           "termsState": "INITIATED"
         },
         {
           "type": "Cancellation",
           "descriptor": {
             "name": "Cancellation terms and conditions",
             "flag": false,
             "short_desc": "Short description",
             "long_desc": "Long description"
           },
           "reasonRequired": false,
           "timePeriod": "2024-11-12T09:00:00",
           "reason": "",
           "termsState": "INITIATED"
         },
         {
           "type": "Payment",
           "descriptor": {
             "name": "Payment terms and conditions",
             "flag": false,
             "short_desc": "Short description",
             "long_desc": "Long description"
           },
           "reasonRequired": false,
           "timePeriod": "2024-11-12T09:00:00",
           "reason": "",
           "termsState": "INITIATED"
         }
       ],
       "locations": [
         {
           "descriptor": {
             "code": "SOURCE",
             "name": "SOURCE",
             "flag": false
           },
           "gps": "12.423423,77.325647",
           "address": "<ADDRESS>"

National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​     ​       ​      Integrator Onboarding Documentation | v1.1
                },
                {
                  "descriptor": {
                    "code": "DESTINATION",
                    "name": "DESTINATION",
                    "flag": false
                  },
                  "gps": "12.900000,77.600000",
                  "address": "<ADDRESS>"
                }
            ]
        }
    }
}




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​        ​       ​        ​       Integrator Onboarding Documentation | v1.1

8. Known Limitations (Phase 1)

   •​   Phase 1 does not include booking confirmation and non emergency flow right now. The init/on_init flow
        provides a quote and terms for review only. The fulfilment and post fulfilment flow is part of Phase 2.
   •​   Driver and vehicle details are not available in Phase 1. The agent block must not be present in any Phase
        1 payload.
   •​   Live tracking and dispatch status updates are not available in Phase 1.
   •​   State-operated ambulance networks and all other government services (108, 102, 112 services) are out of
        scope currently. You will be informed in advance whenever that gets in the scope.
   •​   Network availability is variable by region. HSPAs respond only for areas in which they operate. No
        response from an HSPA does not indicate a network error.


9. Onboarding Steps

Follow these steps in order to get onboarded onto the Ambulance Booking service on UHI.

   1.​ Express Intent: Reply to the NHA onboarding communication or contact your NHA point of contact to
       initiate the onboarding process.
   2.​ Complete the ABDM M2 / HIECM Milestone: Completion of ABDM Milestone 2 (M2) of the Health
       Information Exchange and Consent Manager (HIECM) is a mandatory prerequisite for UHI production
       access for End User Application. Ensure your application has achieved this milestone before proceeding.
   3.​ Fill the Onboarding Form: Complete the UHI onboarding form with your organisation details, integration
       role (EUA or HSPA), Sandbox Callback URL (HTTPS), and your public key.
   4.​ Generate Your Key Pair: Clone the NHA GitHub repository and run Generator.java (Option 1) to
       generate your Ed25519 key pair. Submit only the public key to NHA. Repository:
       github.com/NHA-ABDM/UHI/tree/main/header_generator_utility
   5.​ Access Sandbox and API Documentation: NHA will provide sandbox credentials. Review the API
       documentation at abdm.gov.in/uhi/resources/onboarding-documentation and test using the UHI Postman
       Collection for Ambulance Booking.
   6.​ Sandbox Testing and NHA Sign-off: Complete integration testing against the integration test cases in
       Section 11. Once NHA sign-off is received on sandbox testing, your integration will be promoted to the
       production UHI network.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​         ​       ​       ​        Integrator Onboarding Documentation | v1.1

10. Technical Pre-requisites

For EUA Integrators
   •​   ABDM-compliant application with at least Milestone 2 (M2) of HIECM completed. This is the primary
        prerequisite for UHI production access.
   •​   A publicly accessible HTTPS callback URL (consumer_uri) to receive asynchronous on_search and
        on_init responses.
   •​   Implementation of UHI request signing (Ed25519 digital signature + BLAKE-512 body hashing).
   •​   Ability to handle asynchronous responses. Do not block on a synchronous reply to search or init.
   •​   Support for the EMERGENCY flow at minimum. NON_EMERGENCY support is recommended, not
        required.
   •​   Display of HSPA-provided terms (cancellation, payment) from on_init before allowing the user to proceed
        to confirm.



For HSPA Integrators
   •​   A publicly accessible HTTPS callback URL to receive search and init requests from the Gateway and
        EUAs respectively.
   •​   Implementation of UHI request signing (Ed25519 + BLAKE-512) for all outbound responses.
   •​   Real-time or near-real-time ambulance availability data. Integrations relying solely on manually
        maintained records will not be approved for production onboarding.
   •​   Ability to respond to search with an on_search catalog within the response time SLA defined by NHA.
   •​   Ability to respond to init with an on_init payload that includes a confirmed quote, payment terms, and
        cancellation policy.
   •​   Compliance with the agent block restriction: driver and vehicle details must not appear in any Phase 1
        payload.




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​       ​     ​       Integrator Onboarding Documentation | v1.1

11. Reference Resources

 Resource                          Link / Details


 Key Generation Utility            github.com/NHA-ABDM/UHI/tree/main/header_generator_utility
 (GitHub)


 Onboarding Documentation          abdm.gov.in/uhi/resources/onboarding-documentation


 Onboarding Form                   https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration


 API Collection (Postman)          Link to the postman collection


 Signing Reference                 github.com/NHA-ABDM/UHI/blob/main/docs/Signing%20UHI%20AP
                                   Is_Final%20(1).docx


 Phase 1 Wireframe (EUA Flow)      https://quick-ambulance-flow.lovable.app/


 Full Booking Wireframe (Phase     https://ambulancebookingservice.lovable.app/
 2)




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​     ​       ​        Integrator Onboarding Documentation | v1.1

12. Integration Test Cases

Category A – Context Validation

 Test ID               Test Description                                    Expected Outcome


 AMB-A-01              Verify that all mandatory context fields are        Gateway returns ACK;
                       present and correctly valued in a search request    search is forwarded to
                       (domain, country, action, core_version,             HSPAs
                       consumer_id, consumer_uri, message_id,
                       timestamp, transaction_id)


 AMB-A-02              Send a search request with a missing                Gateway returns NACK
                       consumer_uri                                        with appropriate error code


 AMB-A-03              Send an on_init response with a transaction_id      EUA rejects or flags the
                       that does not match the originating init request    response as mismatched


 AMB-A-04              Verify that provider_id and provider_uri are        HSPA receives the request
                       correctly populated in init using values from the   and returns ACK
                       on_search response




Category B – Search Filter Validation

 Test ID               Test Description                                    Expected Outcome


 AMB-B-01              Send an EMERGENCY search with only SOURCE           HSPA returns on_search
                       location (no DESTINATION). Verify HSPA              catalog for EMERGENCY
                       responds with on_search.                            type


 AMB-B-02              Send a NON_EMERGENCY search with both               HSPA returns on_search
                       SOURCE and DESTINATION. Verify HSPA                 catalog for
                       responds with on_search – FUTURE SCOPE              NON_EMERGENCY type


 AMB-B-03              Send a NON_EMERGENCY search with only               Gateway or HSPA returns
                       SOURCE location (no DESTINATION)- FUTURE            NACK; missing
                       SCOPE                                               DESTINATION for
                                                                           NON_EMERGENCY




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​     ​       ​      ​        Integrator Onboarding Documentation | v1.1

 Test ID               Test Description                                       Expected Outcome


 AMB-B-04              Send a search with category code ALS. Verify           on_search catalog contains
                       on_search only returns ALS fulfillments.               only ALS fulfillments


 AMB-B-05              Send a search with no category code (ALL). Verify      on_search catalog contains
                       on_search returns all available ambulance              all available fulfillment
                       classes.                                               types


 AMB-B-06              Send a search with additional_services tag. Verify     Fulfillments include or
                       HSPA reflects the requested services in                acknowledge the
                       on_search.                                             additional_services field




Category C – on_search Response Validation

 Test ID               Test Description                                       Expected Outcome


 AMB-C-01              Verify that each fulfillment in on_search contains     All fulfillments have
                       a unique id and the correct type (EMERGENCY or         unique IDs and correct
                       NON_EMERGENCY)                                         type


 AMB-C-02              Verify that each item in on_search contains a          All fulfillment_id values
                       fulfillment_id that matches a fulfillment id in the    resolve correctly within the
                       same provider block                                    catalog


 AMB-C-03              Verify that the fulfillment.type in on_search          No type mismatch between
                       matches the type sent in the search request            search and on_search


 AMB-C-04              Verify that the agent block (driver/vehicle details)   No agent block present in
                       is absent from on_search payloads                      any on_search fulfillment


 AMB-C-05              Verify that transaction_id in on_search matches        transaction_id values
                       the transaction_id from the search request             match




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​     ​       ​       ​       Integrator Onboarding Documentation | v1.1

Category D – init / on_init Validation

 Test ID               Test Description                                     Expected Outcome


 AMB-D-01              Send an init request referencing an item.id and      HSPA returns ACK and
                       fulfillment_id that exist in the prior on_search     responds with on_init
                       response


 AMB-D-02              Verify that on_init contains a non-empty order.id    order.id is present and
                                                                            unique


 AMB-D-03              Verify that on_init contains a confirmed quote       quote.breakup has at least
                       with at least one breakup line item                  one entry with title and
                                                                            price


 AMB-D-04              Verify that on_init contains terms with              All required term types
                       termsState: INITIATED for Commercial,                present with correct state
                       Cancellation, and Payment types


 AMB-D-05              Verify that the agent block is absent from on_init   No driver name, vehicle
                       payloads                                             number, or agent phone in
                                                                            on_init


 AMB-D-06              Verify that on_init echoes SOURCE and                Location data preserved
                       DESTINATION locations from the init request          and matches init request


 AMB-D-07              Send an init with a customer.id in ABHA address      HSPA accepts and
                       format                                               processes correctly; on_init
                                                                            returned




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​     ​       ​       ​      Integrator Onboarding Documentation | v1.1

Category E – UX and Best Practice Compliance

 Test ID               Test Description                                    Expected Outcome


 AMB-E-01              EUA must display HSPA name and logo (from           HSPA branding visible in
                       catalog.descriptor) in the ambulance listing        EUA search results
                       screen WHENEVER ITS COMING ON THE
                       RESPONSE.


 AMB-E-02              EUA must display estimated arrival window           ETA shown per ambulance
                       (fulfillment.start and end timestamps) per          listing
                       ambulance option


 AMB-E-03              EUA must display the indicative price from          Price shown before user
                       item.price.value in the listing                     selects an option


 AMB-E-04              EUA must display the full on_init terms             Terms screen shown;
                       (cancellation, payment) to the user before          confirm CTA gated on
                       enabling the confirm action                         review


 AMB-E-05              EUA must not display driver or vehicle details at   No agent-related UI in
                       any point during Phase 1 (pre-confirmation)         search, listing, or init
                                                                           review screens




Category F – Edge Cases

 Test ID               Test Description                                    Expected Outcome


 AMB-F-01              No HSPA responds to a search request within the     EUA handles empty result
                       expected window                                     gracefully and shows
                                                                           appropriate message to
                                                                           user


 AMB-F-02              HSPA sends on_search with an empty providers        EUA handles gracefully; no
                       array                                               crash or display error


 AMB-F-03              EUA sends a duplicate search request (same          Gateway deduplicates or
                       transaction_id)                                     HSPA ignores duplicate
                                                                           gracefully




National Health Authority – Ayushman Bharat Digital Mission​
UHI – Ambulance Booking Service​      ​       ​      ​       Integrator Onboarding Documentation | v1.1

 Test ID                Test Description                                     Expected Outcome


 AMB-F-04               HSPA sends on_init with payment.type set to          EUA correctly displays
                        PRE-ORDER and a non-zero minimum_Value               advance payment
                                                                             requirement to user




13. Contact and Support

For onboarding queries, technical support, or to express interest in integration as an EUA or HSPA, reach
out to your NHA point of contact or reply to the onboarding communication you received from NHA.

 Organisation                    National Health Authority (NHA), Ayushman Bharat Digital Mission


 Points of Contact               <EMAIL>, <EMAIL>


 Service                         Unified Health Interface – Ambulance Booking




National Health Authority – Ayushman Bharat Digital Mission​

