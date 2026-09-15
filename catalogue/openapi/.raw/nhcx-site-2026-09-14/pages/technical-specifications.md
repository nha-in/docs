# https://hcxsbx.abdm.gov.in/#/technical-specifications

Technical Specifications
The technical specifications outline the digital architecture required to implement the health claims network, including detailed protocols for data exchange, authentication mechanism, and digital network management policies. These specifications establish the framework for interoperability, secure communication, and system governance across all participants.
Open Protocol for Health Claims Data Exchange
The Open Protocol, outlined in the Key Specifications, serves as the technological backbone for the Health Claims Data Exchange. The following sections detail the critical components of the protocol, designed in alignment with the architectural principles specified in the National Health Claims Exchange (NHCX) Open Specifications.
Key design elements considered for the protocol development include:  
Asynchronous Information Exchange: 
The protocol supports asynchronous data exchange to accommodate the large scale and non-linear processes prevalent in the healthcare industry.
Federated Deployment: 
It facilitates the federated deployment of multiple interconnected NHCX systems, allowing for decentralized control while maintaining interoperability across the ecosystem.
Data Security and Privacy:
The protocol ensures the protection of sensitive information by segregating data from personally identifiable information (PII) during transmission between applications. It also supports encryption and auditing of data exchanges to maintain security and integrity.
Unique Message Identifiers: 
Ecosystem partners can generate unique identifiers for each message exchange, enabling efficient tracking and management of individual transactions.
Business Flow Support:
The protocol allows for the transmission of multiple related messages that form part of a single business process, adhering to the requirements of different business scenarios.
Integration with Existing Registries:
It permits the utilization of existing registries for key entities such as beneficiaries, providers, and payers, while offering flexibility for specific use cases.
Use Case Extensibility:
The protocol is designed to be extensible, allowing it to adapt to the specific requirements of various programs or schemes. For example, the PMJAY scheme may require additional data elements for pre-authorization or claims processing as per its guidelines.
This open protocol ensures seamless, secure, and scalable communication within the health claims ecosystem, supporting the varied needs of all stakeholders. 
National Health Claims Exchange (NHCX) Protocols 
The exchange platform serves as the central routing engine, managing the flow of data between healthcare providers and other National Health Claims Exchange (NHCX) participants. It receives, validates, and processes data, ensuring it meets required formats and security standards. The platform handles data transformation when necessary, ensuring compatibility across systems, and securely routes the information to the appropriate recipients. In the case of errors, it manages retries or re-routing, maintaining a seamless exchange of data while ensuring compliance with regulations.
Key building blocks include: 
Exchange Protocol: Defines message flow terminologies.  
Message Structure: Specifies message formats and structures.
API Structure: Outlines APIs for data exchange between entities.
Error Handling: Details error codes and descriptions for message processing
Exchange Protocol Terminology  
Request:
The sender initiates the process by sending a message containing the necessary payload, following the protocol's message structure.
Response:
The recipient of the request responds with relevant payload defined by the protocol.
NHCX Systems:
These are runtimes on the NHCX platform that function as message receivers and forwarders on behalf of both senders and receivers. Depending on the use case, either the sender or receiver may participate in the process. For example, in the case of cashless claims, providers will be the senders in the Check Eligibility, PreAuth, and Claim Submission use cases, with payers acting as the recipients. Meanwhile, in the Payment Notice use case, payers will be the senders and providers will be the recipients.
Message:
The NHCX protocol facilitates the transfer of a Message that includes both a protocol header and content (payload and domain headers) as per the use case. The protocol header is a set of attributes that carries information necessary for NHCX to reliably forward the message to its destination. 
The content of the message has two parts:
Domain Headers:
This includes domain or use case specific information that is not required for transportation but provides additional information about the payload (such as the payload type).
Payload:
The domain object defined for the relevant use case. Typically, this data is encrypted using the recipient's key to ensure that NHCX systems cannot view it.
Senders and Receivers:
In the information exchange, two systems are involved and referred to as Senders and Receivers.
Message Flow
Step
Action
1. Sender to NHCX 
The sender sends the initial message to its preferred NHCX instance. 
NHCX validates the sender and recipient statuses.
NHCX responds with an acknowledgment to the sender. 
NHCX forwards the message to the end recipient or the next NHCX in the chain. 
NHCX to Receiver
Finally, NHCX verifies the recipient's status.
NHCX carries out necessary checks and transmits the message to the recipient. 
The recipient confirms receipt of the message. 
3. Receiver to NHCX
The receiver sends the response message to its chosen NHCX instance.
NHCX verifies the recipient and sender statuses.
NHCX carries out necessary signature verifications and sends an acknowledgment to the recipient. 
NHCX forwards the acknowledgment to the sender or the next NHCX in the chain.
4. NHCX to Sender 
NHCX verifies the sender's status.
Then, NHCX forwards the response message to the sender.
The sender acknowledges receipt of the response message. 
Message flow from NHCX to Sender
Message flow between NHCX and multiple recipients - Forward approach
Query Flow
Message Structure  
Overview
NHCX messages are designed to ensure secure and reliable communication by separating use case-specific information from generic transport and domain-specific headers. This structure is like JWE tokens defined in RFC7516. Refer 
link
for more information.
Key Components include: 
Protected Headers (
rotected Headers = Registered JOSE headers + NHCX Protocol Headers + NHCX Domain Headers
)
Payload (
Encrypted Domain Data
)
Protected Header  
JOSE Headers:
These follow the JSON Web Encryption header format specified in RFC7516. 
For initial NHCX implementations, NHA proposes using alg:RSA-OAEP and enc: A256GCM. 
NHCX Protocol Headers: 
These act as private headers, adhering to section 4.3 of RFC7516.
Each attribute begins with "x-NHCX-" to maintain clarity and avoid naming conflicts. 
Name
Description
Type
Addition Properties
x-hcx-sender_code
Registry code of the sender (e.g. provider or payer)
String
Mandatory
x-hcx-api_call_id
Sender generated unique id for each originating request unique for each call.
String
Mandatory
x-hcx-recipient_code
Registry code of the recipient (e.g. provider or payer)
String
Mandatory
x-hcx-request_id
Sender generated unique id for each originating request.
String
Optional
x-hcx-correlation_id
Unique id of the conversation (a collection of related messages). It may be chosen as the message_id of in the original sender’s (initiator’s) system. For return messages (asynchronous responses) responders are expected to populate with the one in the request.
String
Mandatory
x-hcx-workflow_id
Workflow id depicts the current process/state of the case. It may span over a series of message exchanges for a given transaction.
String
Optional
x-hcx-timestamp
Unix timestamp of the message while sending
datetime
Mandatory
x-hcx-debug_flag
Request to the server to include debug information. Useful in the time of integration testing and prod debugging. However, server(s) may choose to ignore this flag based on their policy.
ENUM
Error
Info
Debug
Optional
x-hcx-ben-abha-id
ABHA ID of the subscriber/member(beneficiary)
String
Mandatory
x-hcx-status
Operational status of the message. Depending on the leg of the message it would be:
Initiator's Status
request.initiated
Responder's Status
 response.complete
 response.partial
 response.error
String
Mandatory
x-hcx-error_details
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
x-hcx-debug_details
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
Status Description (Protected Header): 
request.initiated :
 Initiator will send this status to initiate the request cycle.
request.queued :
 When the request is queued at NHCX system, ready to be picked up for processing.(NHCX Internal)
request.dispatched :
 When the request has successfully reached the receipient's system.(NHCX Internal)
request.stopped :
 When the request has stopped completely after failure attempts to reach receipient. (NHCX Internal)
response.complete :
 Responder will send this status to close the complete request cycle while sending final response.
response.partial :
 Responder will use this status for partial response or to acknowledge the request.
response.error :
 Incase the request is rejected or any error encountered.
NHCX Domain Headers: 
Domain data specifications define these headers using a JSON object that maps domain-specific values. 
For instance, in claims use cases, these headers might include the total claimed amount and a list of procedures. 
All parameter names follow the format x-NHCX- <use_case_name>-<parameter_name>, where:
<use_case_name> is a concise identifier (less than 16 characters) representing the use case, ideally aligned with the API URI path. 
<parameter_name> is a short name (less than 32 characters) for the specific parameter. 
Therefore; Protected Headers = Registered JOSE headers + NHCX Protocol Headers + NHCX Domain Headers
Payload 
Domain data specifications define the use case-specific payload. This payload is base64 encoded and encrypted using JSON web encryption (as outlined in the JOSE header). 
Example: In cashless claims scenarios, the payload could be an FHIRV4 bundle of the appropriate type, encrypted according to relevant message security standards. 
Signatures:
JWE inherently provides integrity protection for both the encrypted payload and protected headers using Authenticated Encryption with Associated Data (AEAD) mechanisms (as defined in RFC7516). Therefore, additional signatures are not necessary.
API Structure 
Overview
The NHCX API structure adheres to a specific pattern for message exchange within the HCP (Health Care Provider) ecosystem. This structure is defined by the underlying protocol definition and message structure.
The expected format for API calls is as follows: 
<transport_protocol>://<server_address>/<protocol_version/><resource_name>/<action|on_action>
transport_protocol:
Always https for secure communication.
server_address:
The address of the server handling the API call (either an NHCX instance or a payer/provider system).
protocol_version:
Indicates the version of the API for compatibility and future updates.
resource_name:
Specifies the domain resource being targeted (e.g., "claims" or "coverage eligibility").
action: 
Defines the intended operation within the resource context.
on_action:
Represents the response callback from the receiving system to the original message.
Based on this pattern, the following APIs have been designed and deployed in the sandbox environment for the cashless use case. Detailed description for each API is provided separate annexure. 
S.No
Use Case
API End Point
Flow
Coverage Eligibility
/coverageeligibility/check
provider->NHCX->payer
Coverage Eligibility
/coverageeligibility/on_check
payer->NHCX->provider
Preauthorisation
/preauth/submit
provider->NHCX->payer
Preauthorisation
/preauth/on_submit
payer->NHCX->provider
Predetermination
/predetermination/submit
provider->NHCX->payer
Predetermination
/predetermination/on_submit
payer->NHCX->provider
Claim
/claim/submit
provider->NHCX->payer
Claim
/claim/on_submit
payer->NHCX->provider
Request Additional Attachments
/communication/request
payer->NHCX->provider
Send Attachments
/communication/on_request
provider->NHCX->payer
Payment
/paymentnotice/request
payer->NHCX->provider
Payment
/paymentnotice/on_request
provider->NHCX->payer
Status Check
/hcx/status
provider->NHCX,Payer->NHCX
Status Check
/NHCX/on_status
provider->NHCX,Payer->NHCX
Reprocess
/task/submit
provider->NHCX->payer
Reprocess
/task/on_submit
payer->NHCX->provider
Search
/search/submit
NHA->NHCX->Payer
Search
/search/on_submit
payer->NHCX->NHA
Error Handling
Overview
NHCX provides detailed guidelines for handling protocol-related errors, including their categorization, standardization, and asynchronous response mechanisms, especially when errors originate at the recipient end. Both the NHCX gateway and participant systems (primarily recipient systems) are required to validate specific conditions and raise appropriate error codes and details.
Follow the 
link
to know more. 
There are two main categories of errors: 
Gateway Errors:
These occur during protocol header validation by the NHCX gateway before processing the message. The gateway responds to the caller with error codes, either synchronously in the HTTP response to the API call or asynchronously in the callback API.
Recipient Errors:
These errors are encountered by recipient systems. They must be responded to the NHCX and then to the sender asynchronously.
NHCX Participant Registry 
NHCX registries serve as the definitive source of participant information on the platform. These registries may be expanded by integrating with existing registries within the healthcare ecosystem, such as the National Health Facility Registry provided by the NHA. The enrollment of participants in the registry is governed by procedure determined by NHA and Insurance regulatory and Development Authority of India (IRDAI). 
The benefits of leveraging an existing registry include:
A single source of truth for all entities at the source registry.  
The NHCX participant registry only needs to maintain supplementary information specific to its use case.  
Enhanced interoperability across systems.  
Aligned with the key design principles, NHCX registries are simplified, self-maintaining, support non-repudiability, accessible through OpenAPI’s, extensible, and designed with data privacy and security in mind.  
Each registry on the NHCX platform provides the following APIs:  
Create  
Update  
Delete  
Search  
Name
Description
Type
Addition Properties
participant_code
Machine-readable unique identifier of the participant, generated by the NHCX instance.
String
Mandatory
Unique across installations - namespaced as participant_code@NHCX_instance_code
registry_code
Health Facility Registry code or Payer Registry for the participant - used to validate and link the participant based on the role selected.
String
Optional
participant_name
A human-readable name for the participant
String
Mandatory
Unique within the NHCX instance context
roles
Roles assigned to the participant as per the definition in the domain specifications. This will be used for access control.
String
Mandatory
address
The physical address of the participant including its geolocation
JSON structure
Optional
email
Email ids for claims related communication
String
Optional
Maximum 3
phone
Landline number of the participant
String
Optional
Maximum 3
mobile
Mobile number for claims related communication
String
Mandatory
Minimum 1
Maximum 3
status
Current status of the participant on the instance. Can be:
Created (Not verified yet)
Active
Inactive
Blocked
String
Mandatory
signing_cert_path
URI/file path to the JWT signing certificate
String
Optional
encryption_cert
URI/file path to encryption certificate
String
Mandatory
endpoint_url
Default endpoint to make API calls
String
Mandatory
payment_details
Default payment details:
UPI ID, or
Ac Number + IFSC Code
JSON Structure
Optional
Data Security and Privacy in Claims Processing 
Ensuring the privacy and security of data 
involved in claims processing, which includes personal and health information, is crucial. This document outlines various approaches to achieve this goal:
Transport Security (HTTPS): 
All communication between participants and the National Health Claims Exchange (NHCX) must use 
HTTPS (Hypertext Transfer Protocol Secure).
This ensures a secure communication channel in both development (sandbox) and production environments. 
Message Security and Integrity (Encryption):
To protect sensitive information, the data payload is encrypted using a public key (certificate) specific to the final recipient. This key is established during participant onboarding. 
The encryption standard used is 
JSON Web Encryption (RFC7516)
API Security (Authentication and Authorization): 
A security mechanism using 
API keys
 is employed for authentication and authorization between participant systems and the NHCX gateway. 
These API keys are generated using 
JSON Web Tokens (JWT tokens)
 defined in 
RFC7519
. Follow 
link
to know more. 
All generated tokens have an expiration time set by NHCX instances. 
Participant systems obtain API keys from the NHCX gateway and include them in the "Authorization" HTTP header when making API calls. 
In summary, a layered approach is taken to data security: 
A secure communication channel is established using HTTPS.
Data payloads are encrypted using public key cryptography. 
API keys with expiration times control access to the system. 
This ensures comprehensive data security and privacy throughout the claims processing exchange. 
Securing NHCX Gateway APIs 
Each participant system, such as providers and payers, must obtain an API key from the NHCX gateway to authenticate itself to the gateway. The participant system should include the API key in the "Authorization" HTTP header when making any API call to the NHCX gateway. 
Obtaining an API Key:  
To access NHCX Gateway APIs, participant systems must first obtain an API key. After verifying and onboarding a participant, the NHCX instance provides the participant with a client ID and client secret. 
Client ID: 
This unique identifier represents the participant in the participant registry.
Client Secret:
A secret value used for authentication.
Request-Body:
{
"client_id": "client_id received by the participant",
"client_secret": "client_secret received by the participant"
}
To get an API key, the participant system calls the /gateway/v0.5/sessions endpoint with the provided client ID and client secret. Upon successful validation, the gateway instance returns an API token.
Response-Body:
{
"access_token": "the API key, a JWT access token",
"issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
"token_type": "Bearer",
"expires_in": 300
}
Revoking API Keys:  
NHCX instances can revoke an API key by generating a new client secret. The participant system must then obtain a new API key using the updated client secret. 
Securing Participant System APIs 
NHCX instances utilize self-generated JWT tokens to secure participant system APIs. These tokens contain the following components: 
Header:
 Specifies the token type (JWT) and algorithm (RS256). 
Payload:
Includes claims such as:
jti: A unique identifier for the token. 
ss: The NHCX instance identifier. 
sub: The NHCX instance identifier. 
iat: The issuance time. 
exp: The expiration time. 
Signature:
A digital signature computed using the NHCX instance's private key.
Audit and Reporting 
NHCX must record every received API call, including unencrypted information like domain headers, signature and encryption algorithm details, sender and recipient information, and signature verification status. 
Deployed NHCX systems will have the following features for auditing: 
Reporting:
They generate reports for various actors, including payers, providers, beneficiaries, regulators, and observers. Each system publishes a list of supported reports and their level of detail.
API Access: 
Audit information stored by NHCX instances is accessible through an API, allowing participating systems to query the audit log related to their transactions.


## Links on this page

- https://datatracker.ietf.org/doc/html/rfc7516
- https://hcxsbx.abdm.gov.in/#/documents
- https://datatracker.ietf.org/doc/html/rfc7516#section-5
- https://www.rfc-editor.org/rfc/rfc7519
