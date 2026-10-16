                            UHI – Blood Bank Discovery | Integrator Onboarding Documentation


      National Health Authority


          Unified Health Interface
              Ayushman Bharat Digital Mission




Blood Bank Discovery Service
      Integrator Onboarding Documentation

                  Version 1.0 • April 2026



 National Health Authority | Ayushman Bharat Digital Mission | Page
                                                   UHI – Blood Bank Discovery | Integrator Onboarding Documentation

1. About This Document
This document is the onboarding reference for organisations integrating Blood Bank Discovery services
on the Unified Health Interface (UHI) network. It is designed to be useful for both functional teams
understanding the service and technical teams building the integration.


 Audience                    EUA and HSPA developers, digital health platforms, blood bank
                             management system operators
 Current Scope               Blood Bank Discovery (search / on_search only)
 Protocol                    UHI
 Domain Code                 nic2008:86906 (Blood Bank)
 Service Owner               National Health Authority (NHA), Ayushman Bharat Digital Mission
 Version                     1.0 – April 2026



2. Background
2.1 The Problem
When a patient or their family urgently needs blood – following an accident, during surgery, or in an
obstetric emergency – the typical experience involves calling multiple hospitals and blood banks one by
one, with no guarantee that the information received is current. A blood bank that reports two units of
O-negative blood available by phone may have dispensed those units by the time the family reaches
the facility. There is no single, reliable interface through which a health app can query live blood
availability across multiple blood banks in a given area.



2.2 What UHI Enables
UHI provides an open-protocol network over which End User Applications (EUAs) can send a
standardised blood availability search, and receive real-time responses from multiple Health Service
Provider Applications (HSPAs) – each representing one or more blood banks – simultaneously. The
result is a unified, current view of blood availability across participating blood banks HSPAs, delivered
directly into the patient-facing app, without the app needing to integrate with each blood bank system
separately.




                        National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation

3. User Story
Before UHI
Rahul’s mother is admitted for emergency surgery and requires two units of B-negative blood.
Rahul opens a health app on his phone and searches for blood banks near the hospital. The
app shows a static list of blood banks with no stock information. He calls the first three
numbers listed – one does not connect, one says they have no B-negative stock, and the
third says they had it this morning but it was just dispensed. Rahul is now an hour into the
emergency, still without blood, travelling between facilities on guesswork.

Pain points: No real-time stock information • No component-level filtering • Static, potentially
outdated contact data • No way to check multiple blood banks simultaneously

After UHI – With Blood Bank Discovery Integration
Rahul opens the same health app. He taps “Find Blood” and enters B-negative as the blood
group and Whole Blood as the component. The app uses his GPS location and searches
within a 10-kilometre radius. Within seconds, the app returns a list of blood banks that have
B-negative whole blood in stock right now, along with the number of units available, the blood
bank’s address, GPS location, and contact number. Rahul identifies the nearest one with
adequate stock and navigates there directly. The entire search takes under two minutes.

What changed: Livestock counts • Component-level search • GPS-based proximity filtering •
Simultaneous query across multiple blood banks

What This Means for Your App
 User need your app        Help patients and families locate blood of the right group and
 solves:                   component near them, in real time
 Trigger in the app:       A search action: “Find Blood” with blood group, component, and
                           location inputs
 API calls involved:       search (EUA → Gateway → Blood Bank HSPA) and on_search
                           (HSPA → Gateway → EUA)
 Data you receive:         Blood bank name, type, GPS location, address, phone, available
                           blood groups and components with unit counts
 What you display to       A real-time list of blood banks with matching stock within the
 the user:                 searched area




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                    UHI – Blood Bank Discovery | Integrator Onboarding Documentation




4. Blood Bank Discovery on UHI – Service Scope
4.1 Integration Roles
Blood Bank Discovery supports both EUA and HSPA integration, unlike some other UHI services that
are EUA-only. Organisations may onboard in either or both roles.


 EUA (End User Application)                           HSPA (Health Service Provider
                                                      Application)
 A patient-facing or clinician-facing application     A blood bank management system or
 that enables users to search for blood               aggregator that maintains a database of
 availability. The EUA sends search requests          blood bank inventory and responds to search
 to the Gateway and receives on_search                queries from the Gateway. The HSPA must
 responses at its callback URL.                       maintain its own independent blood bank
                                                      database at a standard comparable to
                                                      e-RaktKosh.



4.2 Current Capabilities
  •​ Search for blood availability by GPS proximity or by state and district
  •​ Filter by blood group (e.g. O-negative, B-positive, AB-negative) and blood component (e.g. Whole
     Blood, Packed Red Blood Cells, Platelet Concentrate)
  •​ Receive real-time stock counts and availability status (Available / Not Available) per blood group
     from participating blood banks
  •​ Retrieve blood bank contact details, GPS location, and address



5. Why Integrate
 Benefit                 What it means for your integration
 Reach a critical        Blood availability is a life-critical query. Integrating this service
 use case                positions your app as a trusted tool at moments that matter most to
                         users.
 Real-time,              Data flows from HSPAs connected to blood bank management
 government-valida       systems, ensuring stock counts are current rather than static.
 ted data
 Open network –          Unlike a single-source integration, the UHI network aggregates
 multiple HSPAs          responses from multiple registered Blood Bank HSPAs, giving your
                         users a broader view of availability across their area.
 EUA and HSPA            Organisations can participate as a consumer app (EUA), as a blood
 roles both open         bank data provider (HSPA), or as both, depending on their capabilities.
 No proprietary          UHI is an open-protocol network. Your integration works across all
 lock-in                 registered HSPAs without bilateral agreements with each one.

                        National Health Authority | Ayushman Bharat Digital Mission | Page
                                                   UHI – Blood Bank Discovery | Integrator Onboarding Documentation




6. API Integration – Discovery Flow
6.1 Service Identity
 Field                   Value                  Description
 domain                  nic2008:86906          Must be set to this value in every request.
                                                Incorrect values will result in no HSPA responding
                                                to your search.
 core_version            0.7.1                  UHI protocol version. Must match exactly.
 action (search)         search                 Set in the context block of outbound search
                                                requests.
 action (on_search)      on_search              Set by the HSPA in the response delivered to the
                                                EUA callback URL.
 fulfillment.type        BloodStock             Must be set to BloodStock in every search
                                                request. This is the fixed fulfillment type for all
                                                Blood Bank searches.


6.2 Authentication and Signing
All UHI API calls must be signed. The signing mechanism uses Ed25519 digital signatures and
BLAKE-512 body hashing.


 Component               Detail                 Notes
 Hashing algorithm       BLAKE-512              Used for computing the digest of the request body.
 Signing algorithm       Ed25519                Digital signature scheme used for all UHI API
                                                calls.
 EUA Authorization       Authorization: {...}   JSON object containing headers, algorithm, keyId,
 header
                                                created, expires, and signature fields.
 Gateway header          X-Gateway-Autho        Same format as EUA Authorization header; keyId
 (inbound)
                         rization               prefixed with gateway-nha.
 Key generation          Generator.java,        Clone the NHA GitHub repo and run
 utility
                         Option 1               Generator.java to generate your Ed25519 key
                                                pair.


 Note: Use the NHA key generation utility (Generator.java, Option 1) to generate your Ed25519 key
 pair. Share only the public key with NHA during onboarding. Repository:
 github.com/NHA-ABDM/UHI/tree/main/header_generator_utility



6.3 API Call Sequencing


                        National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation

The Blood Bank Discovery flow involves two API calls: a search sent by the EUA, and an on_search
response received asynchronously from the Blood Bank HSPA via the Gateway. Currently there is one
registered Blood Bank HSPA on the network – e-RaktKosh.


 Step   Actor /        Detail
        Action
 1      EUA POST       EUA constructs the search intent – blood group and component
        /search →      (mandatory), plus either GPS+radius or state+district for location – and
        Gateway        sends to the UHI Gateway.
 2      Gateway        Gateway immediately returns HTTP 200 ACK. This confirms receipt
        ACK →          only – the search result arrives separately and asynchronously.
        EUA
 3      Gateway        Gateway routes the search to the registered Blood Bank HSPA(s) on
        POST           the network.
        /search →
        Blood Bank
        HSPA(s)
 4      Blood Bank     Each HSPA queries its blood bank inventory database for matching
        HSPA           records. HSPAs backed by e-RaktKosh data return live stock counts.
        Queries
        blood bank
        database
 5      Blood Bank     HSPA returns a catalog of blood bank providers with availability status
        HSPA           (Available / NotAvailable) and unit counts per blood group.
        POST
        /on_search
        → Gateway
 6      Gateway        Gateway forwards the on_search response to the EUA’s consumer_uri
        POST           callback URL.
        /on_search
        → EUA
 7      EUA ACK        EUA returns HTTP 200 ACK and processes the response, aggregating
        → Gateway      results from multiple HSPAs as they arrive.


 Note: on_search responses arrive asynchronously. The Gateway ACK (Step 2) confirms receipt of the
 search only – it does not contain results. Implement a timeout window on your consumer_uri to
 aggregate and display results as they arrive.




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation




6.4 Search Filter Types
Blood Bank Discovery supports two location-based search modes. Blood group and blood component
can be combined with either mode.


 Search Mode        Mandatory Fields         Optional Fields           Notes
 GPS + Radius       GPS coordinates,         Blood group, blood        Returns all matching blood
                    radius (km)              component                 banks within the specified
                                                                       radius of the given
                                                                       coordinates. Blood group and
                                                                       component default to All if
                                                                       omitted.
 State + District   State code + name,       Blood group, blood        Returns all matching blood
                    district code +          component                 banks in the specified district.
                    name                                               Blood group and component
                                                                       default to All if omitted.


6.5 search – Full Field Reference
context (all fields mandatory)

 Field                 Type / Value            Description
 domain                nic2008:86906           Fixed value for Blood Bank Discovery. Must be
                                               present and exact.
 country               IND                     Fixed value.
 city                  std:011                 Standard city code. Use std:011 as the default.
 action                search                  Fixed value for outbound search requests.
 core_version          0.7.1                   Fixed UHI protocol version.
 consumer_id           String                  Your EUA identifier, as registered with NHA.
 consumer_uri          HTTPS URL               Your callback URL to receive on_search
                                               responses. Must be publicly accessible.
 transaction_id        UUID                    Unique identifier for this transaction. Use the
                                               same value in message_id.
 message_id            UUID                    Unique identifier for this message. Typically same
                                               as transaction_id.
 timestamp             ISO 8601                Request timestamp in UTC. Example:
                                               2025-01-08T07:58:36.421576Z




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation




message.intent (search fields)

 Field                                   Type / Value         Description
 item.descriptor.name                    Blood group          Name of the blood group being
                                         name or All          searched (e.g. O+Ve, AB-Ve). Use All
                                                              and code -1 to search across all
                                                              blood groups.
 item.descriptor.code                    Blood group          Numeric code from the Blood Group
                                         code or -1           Master List. Use -1 for All.
 category.descriptor.name                Component            Blood component being searched
                                         name                 (e.g. WholeBlood,
                                                              PlateletConcentrate). Refer to the
                                                              Blood Component Master List.
 category.descriptor.code                Component            Numeric code from the Blood
                                         code                 Component Master List.
 fulfillment.type                        BloodStock           Fixed value. Must always be
                                                              BloodStock.
 fulfillment.start.time.timestam         ISO 8601             Start of the availability window being
 p
                                                              queried.
 fulfillment.end.time.timestamp          ISO 8601             End of the availability window being
                                                              queried.
 location.gps                            lat,long string      Latitude and longitude of the search
                                                              origin point. Used for GPS-based
                                                              search.
 location.radius.type                    CONSTANT             Fixed value when using GPS-based
                                                              search.
 location.radius.value                   Numeric string       Radius in kilometres for GPS-based
                                                              search. Example: 10.0
 location.radius.unit                    km                   Fixed unit for radius. Must be km.
 location.state.name                     State name           State name for state+district search.
                                                              Example: DELHI
 location.state.code                     State code           Numeric state code. Example: 7 for
                                                              Delhi.
 location.district.name                  District name        District name for state+district
                                                              search. Example: SOUTH
 location.district.code                  District code        Numeric district code. Example: 83




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                UHI – Blood Bank Discovery | Integrator Onboarding Documentation




6.6 on_search – Response Field Reference
context fields

 Field               Type / Value            Description
 action              on_search               Fixed value in responses from HSPAs.
 provider_id         HSPA identifier         The identifier of the HSPA sending this response.
 provider_uri        HTTPS URL               The HSPA’s callback URL.
 consumer_id         Your EUA ID             Echoed from your original search request.
 consumer_uri        Your callback           Echoed from your original search request.
                     URL
 transaction_id      UUID                    Echoed from your original search request. Use to
                                             correlate responses.


message.catalog – provider record fields

 Field                                           Type / Value        Description
 catalog.descriptor.name                         String              Name of the HSPA / data
                                                                     source (e.g. e-RaktKosh).
 providers[].id                                  String              Unique identifier for this
                                                                     blood bank provider record.
 providers[].descriptor.name                     String              Name of the blood bank.
 providers[].descriptor.short_desc               String              Type of blood bank (e.g.
                                                                     Govt., Charitable/Vol).
 providers[].categories[].descriptor.nam         String              Blood component name (e.g.
 e
                                                                     WholeBlood).
 providers[].categories[].descriptor.cod         String              Blood component code (e.g.
 e
                                                                     11 for Whole Blood).
 providers[].fulfillments[].type                 Available /         Availability status for the
                                                 NotAvailable        associated blood group item.
 providers[].items[].descriptor.name             String              Blood group name (e.g.
                                                                     O+Ve, AB-Ve).
 providers[].items[].descriptor.code             String              Blood group code from the
                                                                     master list.
 providers[].items[].quantity.count              Integer             Number of units available for
                                                                     this blood group.



                     National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation

 Field                                             Type / Value        Description
 providers[].items[].fulfillment_id                String              References the fulfillment
                                                                       record indicating Available or
                                                                       NotAvailable.
 providers[].location.gps                          lat,long string     GPS coordinates of the blood
                                                                       bank.
 providers[].location.address                      String              Full address of the blood
                                                                       bank.
 providers[].location.city.name                    String              City name.
 providers[].location.state.name                   String              State name.
 providers[].location.district.name                String              District name.
 providers[].contact.phone                         String              Phone number of the blood
                                                                       bank.
 providers[].contact.email                         String              Email address of the blood
                                                                       bank.



7. Sample API Payloads
7.1 search – GPS-Based (Specific Blood Group and Component)
Searches for blood within a radius of the user’s GPS location. Returns all blood banks in the area with
matching stock. Set the blood group code in item.descriptor and the component in category.descriptor.

 context:
   domain: 'nic2008:86906' # Fixed for Blood Bank Discovery
   country: IND
   city: 'std:011'
   action: search
   core_version: 0.7.1
   consumer_id: <your-eua-id> # Your registered EUA identifier
   consumer_uri: <your-https-callback-url> # Must be publicly accessible HTTPS
   message_id: 5cc46ce0-cd96-11ef-957f-718cff4e4e0a # Unique UUID per call
   timestamp: '2025-01-08T07:58:36.421576Z'
   transaction_id: 5cc46ce0-cd96-11ef-957f-718cff4e4e0a # Links on_search back to
 this search
 message:
   intent:
     item:
       descriptor:
         name: O+Ve # Blood group name from the Blood Group Master List
         code: '15' # Blood group code – use -1 for All groups
     fulfillment:
       type: BloodStock # Fixed value for all Blood Bank searches
       start:
         time:
            timestamp: '2025-01-08T13:28:36'
       end:
         time:

                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                   UHI – Blood Bank Discovery | Integrator Onboarding Documentation

           timestamp: '2025-01-08T23:59:59'
     category:
       descriptor:
         name: WholeBlood # Blood component from the Blood Component Master List
         code: '11' # Component code
     location:
       gps: '17.3788008,78.4368212' # Lat,long of user location
       radius:
         type: CONSTANT # Fixed value when using GPS search
         value: '10.0' # Search radius in km
         unit: km




7.2 search – GPS-Based (All Blood Groups)
To search across all blood groups simultaneously, set item.descriptor.name to All and
item.descriptor.code to -1. The component filter can be set to a specific component or also left as All.
Use this variant when the patient needs any blood group urgently and availability is the primary
concern.

 context:
   domain: 'nic2008:86906' # Fixed for Blood Bank Discovery
   country: IND
   city: 'std:011'
   action: search
   core_version: 0.7.1
   consumer_id: <your-eua-id>
   consumer_uri: <your-https-callback-url>
   message_id: b054f460-2fad-11ef-9af0-3dc6dc6a0b02 # Unique UUID per call
   timestamp: '2025-01-08T07:58:36.421576Z'
   transaction_id: b054f460-2fad-11ef-9af0-3dc6dc6a0b02
 message:
   intent:
     item:
       descriptor:
         name: All # Search across all blood groups
         code: '-1' # -1 is the code for All blood groups
     fulfillment:
       type: BloodStock
       start:
         time:
            timestamp: '2025-01-08T13:28:36'
       end:
         time:
            timestamp: '2025-01-08T23:59:59'
     category:
       descriptor:
         name: WholeBlood # Set component; use All if component is also open
         code: '11'
     location:
       gps: '17.3788008,78.4368212' # Lat,long of user location
       radius:
         type: CONSTANT
         value: '10.0'
         unit: km



                        National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation




7.3 search – State and District
Use state and district when GPS coordinates are unavailable or when the user prefers to search by
location name. State and district codes are numeric. Replace gps and radius with district and state
inside location.

 context:
   domain: 'nic2008:86906' # Fixed for Blood Bank Discovery
   country: IND
   city: 'std:011'
   action: search
   core_version: 0.7.1
   consumer_id: <your-eua-id>
   consumer_uri: <your-https-callback-url>
   message_id: c51c2800-cd96-11ef-957f-718cff4e4e0a # Unique UUID per call
   timestamp: '2025-01-08T08:01:31.470967Z'
   transaction_id: c51c2800-cd96-11ef-957f-718cff4e4e0a # Links on_search back to
 this search
 message:
   intent:
     item:
       descriptor:
         name: All # Or specify a blood group name and code
         code: '-1'
     fulfillment:
       type: BloodStock # Fixed value for all Blood Bank searches
       start:
         time:
            timestamp: '2025-01-08T13:31:31'
       end:
         time:
            timestamp: '2025-01-08T23:59:59'
     category:
       descriptor:
         name: WholeBlood
         code: '11'
     location:
       district:
         name: SOUTH # District name in CAPS
         code: '83' # Numeric district code
       state:
         name: DELHI # State name in CAPS
         code: '7' # Numeric state code




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation




7.4 on_search – Sample Response
The HSPA sends this response to the EUA’s consumer_uri. Each provider record in the catalog
represents one blood bank. The fulfillment_id on each item links to a fulfillment record indicating
whether that blood group is Available or NotAvailable. The quantity count gives the number of units in
stock.

 context:
   domain: 'nic2008:86906'
   action: on_search # Fixed value in HSPA responses
   consumer_id: <your-eua-id>
   consumer_uri: <your-https-callback-url> # This URL receives the response
   provider_id: nha.hspa # Identifier of the responding HSPA
   provider_uri: 'https://hspasbx.abdm.gov.in/api/v1/bloodbank'
   transaction_id: c51c2800-cd96-11ef-957f-718cff4e4e0a # Matches the original
 search
   message_id: c51c2800-cd96-11ef-957f-718cff4e4e0a
 message:
   catalog:
     descriptor:
       name: e-RaktKosh # Name of the HSPA / data source
       short_desc: 'e-RaktKosh: A Centralized Blood Bank Management System'
     providers:
       - id: '0' # Unique provider ID for this blood bank
         descriptor:
           name: 'Janseva Blood Centre' # Blood bank name
           short_desc: Charitable/Vol # Blood bank type
         categories:
           - id: '0'
             descriptor:
               name: WholeBlood # Blood component
               code: '11'
         fulfillments:
           - id: '0'
             type: NotAvailable # Blood groups linked to id:0 are not in stock
           - id: '1'
             type: Available # Blood groups linked to id:1 are in stock
         items:
           - id: '0'
             descriptor:
               name: O+Ve # Blood group name
               code: '15' # Blood group code from master list
             quantity:
               count: 2 # Units available
             category_id: '0'
             fulfillment_id: '1' # Linked to Available – this blood group is in
 stock
           - id: '1'
             descriptor:
               name: AB+Ve


                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                 UHI – Blood Bank Discovery | Integrator Onboarding Documentation

                code: '17'
              quantity:
                count: 16
              category_id: '0'
              fulfillment_id: '0' # Linked to NotAvailable – this blood group is not
 in stock
         location:
           gps: '18.5246036,73.792927' # Lat,long of the blood bank
           address: 'Paud Road, Pune, Maharashtra'
           city:
             name: Pune
           state:
             name: Maharashtra
             code: '27'
           district:
             name: Pune
             code: '521'
         contact:
           phone: '<MOBILE_NUMBER>' # Blood bank contact number
           email: <EMAIL>




8. Blood Group and Component Master Lists
Use these codes in the item.descriptor.code (blood group) and category.descriptor.code (blood
component) fields of your search request.



8.1 Blood Group Master List
 Code                                               Value
 -1                                                 All
 11                                                 A+Ve
 12                                                 A-Ve
 13                                                 B+Ve
 14                                                 B-Ve
 15                                                 O+Ve
 16                                                 O-Ve
 17                                                 AB+Ve
 18                                                 AB-Ve
 22                                                 Oh+Ve
 23                                                 Oh-Ve




                      National Health Authority | Ayushman Bharat Digital Mission | Page
                                                UHI – Blood Bank Discovery | Integrator Onboarding Documentation




8.2 Blood Component Master List
Code                                               Value
11                                                 Whole Blood
12                                                 Packed Red Blood Cells
13                                                 Fresh Frozen Plasma
14                                                 Single Donor Platelet
16                                                 Platelet Rich Plasma
17                                                 Cryoprecipitate
18                                                 Single Donor Plasma
19                                                 Plasma
20                                                 Platelet Concentrate
21                                                 Cryo Poor Plasma
23                                                 Random Donor Platelets
24                                                 Platelets Additive Solutions
28                                                 SAGM Packed Red Blood Cells
29                                                 Irradiated RBC
30                                                 Leukoreduced RBC



9. Known Limitations
Limitation                                         Recommended Approach
GPS search may return incomplete results in        Always support state+district as a fallback
areas with low blood bank density                  search mode alongside GPS. Surface both
                                                   options in your UI.
Stock counts are updated at different              Display a disclaimer that counts are
frequencies: some blood banks on the               indicative and may have changed. Always
e-RaktKosh network update in real time;            recommend users call the blood bank to
others update on a day-to-day basis                confirm before travelling.
on_search responses arrive asynchronously,         Implement a timeout window (recommended:
with no defined end signal                         10–15 seconds). Aggregate and display


                     National Health Authority | Ayushman Bharat Digital Mission | Page
                                                     UHI – Blood Bank Discovery | Integrator Onboarding Documentation

 Limitation                                             Recommended Approach
                                                        results as they arrive rather than waiting for
                                                        all responses.
 No pagination on on_search responses                   Handle large payloads gracefully. Implement
                                                        client-side pagination or lazy loading for
                                                        display.
 No booking or reservation workflow available           Scope your UI to discovery only. Surface the
 in the current scope                                   blood bank contact number prominently so
                                                        users can call to reserve or confirm.



10. Onboarding Steps
Follow these steps in order to get onboarded onto Blood Bank Discovery on UHI.


 1       Express Intent        Reply to the NHA onboarding communication or contact your NHA
                               point of contact to initiate the onboarding process for Blood Bank
                               Discovery.
 2       Fill the              Complete the UHI onboarding form with your organisation details,
         Onboarding            integration type (EUA, HSPA, or both).
         Form
 3       Generate Your         Clone the NHA GitHub repo and run Generator.java (Option 1) to
         Key Pair              generate your Ed25519 key pair. Submit only the public key to
                               NHA. Repository:
                               github.com/NHA-ABDM/UHI/tree/main/header_generator_utility
 4       Access                NHA will provide sandbox access. Review the API documentation
         Sandbox and           at abdm.gov.in/uhi/resources/onboarding-documentation and test
         API Docs              using the UHI Postman Collection.
 5       Production            Once NHA sign-off is received on sandbox testing, your integration
         Go-Live               will be promoted to the production UHI network.



11. Technical Pre-requisites
For EUA Integrators
     •​ ABDM-compliant application with at least Milestone 2 (M2) of HIECM completed – this is the
        primary prerequisite
     •​ A publicly accessible HTTPS callback URL (consumer_uri) to receive asynchronous on_search
        responses
     •​ Implementation of UHI request signing (Ed25519 digital signature + BLAKE-512 body hashing)
     •​ Ability to handle asynchronous on_search responses – do not block on a synchronous reply to the
        search call
     •​ UHI Postman Collection for sandbox testing (available on request from NHA)



                          National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation

Note: ABDM M2 milestone completion with HIECM is a hard prerequisite. Applications that have not
completed M2 cannot be onboarded onto UHI services including Blood Bank Discovery.




For HSPA Integrators
  •​ Maintenance of an independent blood bank database at a standard comparable to e-RaktKosh,
     including real-time or near-real-time inventory data for blood groups and components
  •​ A publicly accessible HTTPS callback URL (provider_uri) to receive search requests from the
     Gateway
  •​ Implementation of UHI request signing (Ed25519 digital signature + BLAKE-512 body hashing)
  •​ Ability to respond to search requests with a correctly structured on_search payload within an
     acceptable latency window
  •​ Sandbox integration and NHA sign-off before production onboarding

Note: HSPA applicants must demonstrate that their blood bank database is maintained independently
and covers stock data of a scope and quality comparable to e-RaktKosh. Integrations that rely solely
on manually maintained or infrequently updated records will not be approved for production
onboarding.



12. Reference Resources
Resource                         Link / Details
Key Generation Utility           github.com/NHA-ABDM/UHI/tree/main/header_generator_utilit
(GitHub)                         y
Onboarding                       abdm.gov.in/uhi/resources/onboarding-documentation
Documentation
Onboarding Form                  https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration
Gateway API                      uhigatewaysandbox.abdm.gov.in/swagger-docs/v2.0.1/Gatewa
Specification (YAML)             y.yaml
API Collection (Swagger)         uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html
Signing Reference                github.com/NHA-ABDM/UHI/blob/main/docs/Signing UHI
                                 APIs_Final.docx
e-RaktKosh Portal                eraktkosh.in




                       National Health Authority | Ayushman Bharat Digital Mission | Page
                                                  UHI – Blood Bank Discovery | Integrator Onboarding Documentation

13. Contact and Support
For onboarding queries, technical support, or to express interest in integration as an EUA or HSPA,
reach out to your NHA point of contact or reply to the onboarding communication you received from
NHA.


 Organisation               National Health Authority (NHA), Ayushman Bharat Digital Mission
 Point of Contact           <EMAIL>, <EMAIL>,
                            <EMAIL>
 Service                    Unified Health Interface – Blood Bank Discovery




                       National Health Authority | Ayushman Bharat Digital Mission | Page

