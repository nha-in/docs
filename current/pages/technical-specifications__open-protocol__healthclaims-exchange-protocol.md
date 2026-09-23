# https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/healthclaims-exchange-protocol

National Health Claims Exchange (NHCX) Protocol
Building blocks of the National Health Claims Exchange protocol
As indicated in the
overall message flow diagram, 
 the exchange platform will be the routing engine that will be responsible for receiving the data from either participant (provider, payor, another NHCX instance, ...), and performing necessary validations, and forwarding it to the intended recipients.
Terminology
Request -
 Initiation of the flow by the sender by passing relevant payload in the message structure defined by this protocol. Requests may travel from Sender to the Receiver through a relay of NHCX instances.
Response - 
Response/reply by the recipient of the request by passing relevant response payload defined by this protocol. Responses may also travel from the “original request message” recipient to the “original request message” sender through a relay of NHCX instances. The key difference here is that a response is always sent as an earlier event received from the NHCX instance.
NHCX instance -
 A runtime of the NHCX platform that performs the role of message receiving and forwarding on behalf of senders and receivers. Based on the use case, any participating party may act as the sender (thereby a requester), or a receiver (thereby a recipient). E.g. for the cashless claims use cases defined so far - Providers will be the senders in case of CheckEligibility, PreAuth and ClaimSubmission use cases (and the payers will be recipients), while Payers will be the sanders in case of PaymentNotice (and the providers will be recipients).
Message -
 NHCX protocol transfers a Message that contains a transport envelope and the content as per the use case.
Transport envelop is a set attribute that carries the transport information for NHCX to reliably forward the message to the destination
Content would have two parts:
Business headers - any domain or use case specific information which may not be necessary for the transportation but allows more information about the payload, e.g. type of the payload
Payload - Domain object defined for the pertinent use case. Usually, this data will be encrypted using the recipient's key to ensure that NHCX instances cannot view this data
Senders and Receivers - Two systems participating in the information exchange. They may also be referred to as client/server as per current industry terminology. E.g. Provider(s) are senders in claims flow use case, and Payor(s) are senders in Payment Notice use case in the flow diagram above.
Overall Message Flow Diagram
NHCX protocol is designed for the exchanges to work in an asynchronous manner (like SMTP), therefore each use case will be completed in a cycle of messages as shown below:
Exchange Protocol
Sender to NHCX (Leg 1)
The sender
 (originator of the communication) sends the initial message to its preferred NHCX instance.
NHCX validates the status of the sender and the next intended recipient (maybe another NHCX instance) on its registries.
NHCX then performs required signature verifications etc before responding with an acknowledgement to the sender.
It then forwards it to either the end recipient (if registered with the same instance) or the next NHCX in the chain.
Steps 1 and 7 in the above diagram as examples of this leg.
NHCX to Receiver (Leg 2)
Final NHCX in the relay chain (could be the original NHCX itself) checks the status of the recipient on its registries,
performs needed verifications and forwards the message to the recipient.
The recipient acknowledges the receipt of the message.
Steps 3 and 9 in the above diagram as examples of this leg.
Receiver to NHCX (Leg 3)
The recipient
 (receiver of the original request message) sends the response message to its preferred NHCX instance.
NHCX validates the status of the recipient and original sender (maybe another NHCX instance) on its registries.
NHCX then performs required signature verifications etc before responding with an acknowledgement to the recipient.
It then forwards it to either the initial sender (if registered with the same instance) or the next NHCX in the chain.
Steps 4 and 10 in the above diagram as examples of this leg.
NHCX to Sender (Leg 4)
Final NHCX in the relay chain (could be the original NHCX itself) checks the status of the original sender on its registries,
Performs needed verifications and forwards the response message to the sender.
The sender acknowledges the receipt of the response message.
Steps 6 and 12 in the above diagram as examples of this leg.
Relays
In case Sender and receiver are listed/registered on different NHCX instances, there may be relays between the NHCXs. Steps 2, 5, 8 and 11 in the above diagram may involve such relays. Relay Architecture will be finalised after finalising the NHCX registry by NHA.
Message Structure
To facilitate safe, secure, and reliable message exchanges through NHCX, its message payload needs to be designed in a manner that separates the actual use case-specific information (payload) from transport and generic domain-specific information (headers). To achieve this, NHCX messages can be structured in line with
JWE tokens
as below (value in bracket are the corresponding JSON keys as per JWE):
Registered JOSE Headers
JSON Web encryption header as per
RFC7516.
For NHCX V1, this is proposed to be fixed to:
{
"alg":"RSA-OAEP","enc":"A256GCM"
}
NHCX Protocol Headers
Used as private headers as per
RFC7516.
section 4.3. Please note that all the parameter names are appended with “x-NHCX-” to avoid a collision.
The following table provides the protocol related header elements in the claims exchange:
Name
Description
Type
Addition Properties
x-NHCX-sender_code
Registry code of the sender (e.g. provider or payer)
String
Mandatory
x-NHCX-recipient_code
Registry code of the recipient (e.g. provider or payer)
String
Mandatory
x-NHCX-request_id
Sender generated unique id for each originating request.
String
Mandatory
x-NHCX-correlation_id
Unique id of the conversation (a collection of related messages). It may be chosen as the message_id of in the original sender’s (initiator’s) system. For return messages (asynchronous responses) responders are expected to populate with the one in the request.
String
Mandatory
x-NHCX-workflow_id
Unique id of workflow that may span over a series of message exchanges, e.g. an eligibility check, a preauth and then claims submission for a patient may be linked with such an id from the providers initiate a request on check eligibility
String
Optional
x-NHCX-timestamp
Unix timestamp of the message while sending
datetime
Mandatory
x-NHCX-debug_flag
Request to the server to include debug information. Useful in the time of integration testing and prod debugging. However, server(s) may choose to ignore this flag based on their policy.
ENUM
Error
Info
Debug
Optional
x-NHCX-status
Operational status of the message. Depending on the leg of the message it would be:
request.initiate
request.retry
 response.success
 response.fail
 response.sender_not_supported
 response.unhandled
 response.request_retry
String
Mandatory
x-NHCX-error_details
Expected to be used for providing details of the status. It Will be especially useful in scenarios where Operational status indicates an irrecoverable error. Key elements of this object are:
Code:
 error, info, debug code from the system - expected to be namespaced for better readability
Message:
 Short description of the detail
Trace:
 Long description supporting the Code
JSON Object - E.g.
{
error.code: “bad.input”, error.message: “Provider code not found”, trace: “”
}
Optional
x-NHCX-debug_details
Expected to be used for providing details of the status. It Will be especially useful in debugging scenarios Key elements of this object are:
Code:
 error, info, debug code from the system - expected to be namespaced for better readability
Message:
 Short description of the detail
Trace:
 Long description supporting the Code
JSON Object - E.g.
{
error.code: “bad.input”, error.message: “Provider code not found”, trace: “”
}
Optional
NHCX Domain Headers
JSON object containing a map of domain-specific header values as proposed in domain data specifications. E.g. For claims use cases, domain specs may decide to populate the total claimed amount, list of diagnostics/procedures. Please note that all such parameter names must follow the naming convention x-NHCX-
-
, where
use_case_name = short name (< 16 chars) given to the use case by domain working group, it is advisable to keep it the same as the one in API’s URI path
Parameter_name = short name (<32 chars) given to the parameter
Therefore the protected headers will be:
Protected Headers = (Registered JOSE headers) U (NHCX Protocol Headers) U (NHCX Domain Headers)
Payload 
Use case-specific base64 encoded, encrypted payload as defined in
Domain Data specifications.
This can be thought of as a private claim in JWT terminology. JSON web encryption as defined in
RFC7516
to be used for encrypting the payload with “alg” and “enc” as defined in the JOSE header above.
E.g. In the current cashless claims scenario, domain working groups have decided the payload to be an FHIR bundle of the appropriate type. Therefore the payload will be an encrypted FHIR bundle as defined in the domain data specs.
Signatures
As per
RFC7516
, cryptographic mechanisms used in JWE encrypts and provides integrity protection to encrypted payload and protected headers using Authenticated Encryption with Associated Data (AEAD), hence additional signatures are not needed for message integrity protection.
API Structure 
Based on the above protocol definition and the message structure, each use case API in the HCP ecosystem is expected to follow the following pattern for the onward and return journey of the use case message:
<transport_protocol>://<server_address>/<protocol_version/><resource_name>/<action|on_action>, where
transport_protocol - for NHCX V1 purpose it will always be https
server_address is the address of the server on which the API is called (an NHCX for payor/provider or a payor/provider/NHCX for an NHCX)
protocol_version - API version for the current protocol to help support protocol transitions
resource_name is the name of the domain resource that the API is serving. E.g. for cashless claims, it may be “claims”, “coverage eligibility”, etc. based on the use case.
action is the action sought within the context of that resource
on_action represents the callback from the receiving system for responding to the original message
Keeping this pattern in mind, in the current cashless use case following APIs are expected to be supported.
Please note that search APIs are expected to support search parameters as detailed in the
Domain Data specifications
. For FHIR based entities this is expected to be clearly published in the corresponding implementation guides. Visibility and availability of the attributes in the search result payloads are also expected to be defined in domain data specifications.
CoverageEligibility
Eligibility check
/coverageeligibility/check (provider->NHCX, NHCX->payor)
/coverageeligibility/on_check (payor->NHCX, NHCX->provider)
Claims 
PreAuth submission
/preauth/submit (provider->NHCX, NHCX->payor)
/preauth/on_submit (payor->NHCX, NHCX->provider)
PreAuth Search
/preauth/search (provider->NHCX, NHCX->payor)
/preauth/on_search (payor->NHCX, NHCX->provider)
Claim submission
/claim/submit (provider->NHCX, NHCX->payor)
/claim/on_submit (payor->NHCX, NHCX->provider)
Claims Search (Also supports status search)
/claim/search (provider|regulator|auditor->NHCX, NHCX->payor)
/claim/on_search (payor->NHCX, NHCX->provider|regulator|auditor)
Payments
Payment notice and acknowledgement
/paymentnotice/request (payor>NHCX, NHCX->provider-)
/paymentnotice/on_request (provider->NHCX, NHCX->payor)
Payment Search (Also supports status search)
/paymentnotice/search (provider->NHCX, NHCX->payor)
/paymentnotice/on_search (payor->NHCX, NHCX->provider)
Following 
 OpenAPI 3.0 specification
 details these APIs in detail.


## Links on this page

- https://datatracker.ietf.org/doc/html/rfc7516
