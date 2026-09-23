# https://hcxsbx.abdm.gov.in/#/domain-specifications/domain-data-specifications/domain-data-models/e-objects

eObjects
This version of the NHCX specification defines the domain model specifications required for the following eObjects:
Coverage Eligibility Request and Coverage Eligibility Response
Claim Request and Claim Response: These objects will be used for both Pre-Authorization and Claim use cases (and for Pre-Determination also in future).
Payment Notice and Payment Reconciliation
As mentioned in the design considerations for domain specification, the eObjects leverage HL7/FHIR4 specification and extend it, wherever required.
Coverage Eligibility Request
As per the design considerations and guidelines listed in the previous sections, the coverage eligibility request payload has to be created as an FHIR document bundle. The bundle should have the following resources:
Resource
Description
Composition
type:
 should be a code representing Coverage Eligibility Request document type.
section:
 The document shall have one section with a single entry having reference to CoverageEligibilityRequest resource.
structure definition:
CoverageEligibilityRequest Document
CoverageEligibilityRequest
The document must contain a CoverageEligibilityRequest resource.
FHIR Profile:
link
structure definition:
CoverageEligibilityRequest
Patient
The document should contain a Patient resource with minimal required information about the patient (refer to rows #38-42 in the “
CoverageEligibilityRequest
” sheet).
FHIR Profile details:
Patient resources should mandatorily have an NDHM identifier.
Patient resources can also have a hospital Id (Medical record number).
Patient resources can also have an insurance id (PMJAY ID).
Patient resources can also have employee IDs and other business identifiers.
Structure Definition: 
Patient
Coverage
The document should contain one or more Coverage resources with minimal information of the policy about which the information is requested (refer to row#30 in the “
CoverageEligibilityRequest
” sheet). FHIR Profile details:
Coverage resources should mandatorily have an identifier for the policy ID issued by the insurer.
Structure definition : 
Coverage
Domain Headers:
Key
Description
Search Parameters:
Key
Description
Coverage Eligibility Response
Resource
Description
Composition
type:
 should be a code representing Coverage Eligibility Request document type.
section:
 The document shall have one section with a single entry having reference to CoverageEligibilityRequest resource.
structure definition:
CoverageEligibilityRequest Document
CoverageEligibilityRequest
The document must contain a CoverageEligibilityRequest resource.
FHIR Profile:
link
structure definition:
CoverageEligibilityRequest
Coverage
The document should contain one or more Coverage resources with minimal information of the policy about which the information is requested (refer to row#30 in the “
CoverageEligibilityRequest
” sheet). FHIR Profile details:
Coverage resources should mandatorily have an identifier for the policy ID issued by the insurer.
Structure definition : 
Coverage
Domain Headers:
Key
Description
Search Parameters:
Key
Description
Claim Request
Claim object is used by providers to submit pre-authorization and claim requests to the payers. The same eObject can be used for both these use cases and the usage can be differentiated by the value of “claim.use” element. The value of this element should be set as
“preauthorization”
 for Pre-Authorization requests and as
“claim”
 for Claim requests.
Resource
Description
Composition
type:
 should be a code representing Coverage Eligibility Request document type.
section:
 The document shall have one section with a single entry having reference to CoverageEligibilityRequest resource.
structure definition:
CoverageEligibilityRequest Document
CoverageEligibilityRequest
The document must contain a CoverageEligibilityRequest resource.
FHIR Profile:
link
structure definition:
CoverageEligibilityRequest
Patient
The document should contain a Patient resource with minimal required information about the patient (refer to rows #38-42 in the “
CoverageEligibilityRequest
” sheet).
FHIR Profile details:
Patient resources should mandatorily have an NDHM identifier.
Patient resources can also have a hospital Id (Medical record number).
Patient resources can also have an insurance id (PMJAY ID).
Patient resources can also have employee IDs and other business identifiers.
Structure Definition: 
Patient
Coverage
The document should contain one or more Coverage resources with minimal information of the policy about which the information is requested (refer to row#30 in the “
CoverageEligibilityRequest
” sheet). FHIR Profile details:
Coverage resources should mandatorily have an identifier for the policy ID issued by the insurer.
Structure definition : 
Coverage
Encounter
Details of the Encounters during which this Claim was created or to which the creation of this Claim is associated.
FHIR Profile:
link
Structure Definition:
Encounter
Condition
Details of the health conditions relevant to this Claim request.
FHIR Profile:
link
Structure Definition:
Condition
Signature resources
List of signatures by Hospital, Doctor and Patient associated with this Claim request.
Structure Definition:
Signature
Domain Headers:
Key
Description
Usage
“preauthorization” or “claim”, to indicate the use case this eObject is being used for.
Search Parameters:
Key
Description
Claim Response
ClaimResponse object is used by payers to send the response for pre-authorization and claim requests to the providers. The same eObject can be used for both these use cases and the usage can be differentiated by the value of “ClaimResponse.use” element. The value of this element should be set as “
preauthorization
” for Pre-Authorization responses and as “
claim
” for Claim responses.
Resource
Description
Composition
type:
 should be a code representing Coverage Eligibility Request document type.
section:
 The document shall have one section with a single entry having reference to CoverageEligibilityRequest resource.
structure definition:
CoverageEligibilityRequest Document
Claim Response
The document must contain a ClaimResponse resource.
FHIR Profile: 
Link
Structure Definition: 
ClaimResponse
Domain Headers:
Key
Description
Usage
“preauthorization” or “claim”, to indicate the use case this eObject is being used for.
Search Parameters:
Key
Description
Payment Notice
Resource
Description
Composition
type:
 should be a code representing Payment Notice document type.
section:
 The document shall have one section with a single entry having reference to PaymentNotice resource.
PaymentNotice
The document must contain a PaymentNotice resource.
FHIR Profile:
link
Structure Definition:
PaymentNotice
PaymentReconciliation
The document should contain a PaymentReconciliation resource with information about the payment related to this payment notice.
FHIR Profile:
link
Structure Definition:
PaymentReconciliation
Domain Headers:
Key
Description
Search Parameters:
Key
Description
previous
   Domain Data Models
next
Implementation Guide  
