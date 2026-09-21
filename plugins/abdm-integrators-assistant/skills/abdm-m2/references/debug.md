# HIE-CM m2 debug

Every error below is an OODA loop: observe the error code and last request id, orient against the matched code, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error.

## Errors

### ABDM-1000

**NHA's list for the module:** `Unable to connect the database`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1001

**NHA's list for the module:** `No data found`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1004

**NHA's list for the module:** `SMS Gateway is unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1006

**NHA's list for the module:** `Bad Request, invalid request Body`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1007

**NHA's list for the module:** `Connection failed due to timeout`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1008

**NHA's list for the module:** `SMS service currently disabled`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1010

**NHA's list for the module:** `Validation failed`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1011

**NHA's list for the module:** `Gateway database unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1012

**NHA's list for the module:** `No records found against the ABHA Address`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1013

**NHA's list for the module:** `Invalid ABHA Number`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1015

**NHA's list for the module:** `Invalid Response`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1016

**NHA's list for the module:** `Invalid TimeStamp`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1017

**NHA's list for the module:** `Invalid TransactionId`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1018

**NHA's list for the module:** `Share Profile database unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1019

**NHA's list for the module:** `Dependent Service Unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1020

**NHA's list for the module:** `Unknown database`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1022

**NHA's list for the module:** `Too many requests`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1023

**NHA's list for the module:** `Invalid User`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1024

**NHA's list for the module:** `Dependent service unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1025

**NHA's list for the module:** `Invalid ServiceId`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1026

**NHA's list for the module:** `Invalid Link Token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1027

**NHA's list for the module:** `You are blocked. Please try again after 24 hours.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1028

**NHA's list for the module:** `HIP is unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1029

**NHA's list for the module:** `Redis server is unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1030

**NHA's list for the module:** `Invalid request ID`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1031

**NHA's list for the module:** `Invalid request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1032

**NHA's list for the module:** `Invalid header`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1033

**NHA's list for the module:** `HIU is unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1034

**NHA's list for the module:** `Notification service unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1035

**NHA's list for the module:** `Invalid HIP ID`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1036

**NHA's list for the module:** `Data does not matched`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1037

**NHA's list for the module:** `Counter and Care context count mismatch`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1038

**NHA's list for the module:** `ABHA address and Link token mismatch`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1040

**NHA's list for the module:** `Invalid HIU ID`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1041

**NHA's list for the module:** `Invalid Acknowledgement`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1042

**NHA's list for the module:** `Provider Mandatory`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1043

**NHA's list for the module:** `ABHA Address does not match with KYC details.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1044

**NHA's list for the module:** `Broadcast Failed`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1045

**NHA's list for the module:** `Database Access is restricted`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1046

**NHA's list for the module:** `Invalid Purpose`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1047

**NHA's list for the module:** `Purpose does not exist`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1048

**NHA's list for the module:** `Timeout`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1049

**NHA's list for the module:** `Invalid Profile Share Intent Keys`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1050

**NHA's list for the module:** `Invalid Profile Share Metadata Keys`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1051

**NHA's list for the module:** `Invalid ABHA Number or ABHA Address`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1052

**NHA's list for the module:** `Invalid TransactionId or response's requestId`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1401

**NHA's list for the module:** `HIP is not available`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1061

**NHA's list for the module:** `Consent artefact expired`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1062

**NHA's list for the module:** `Consent Not granted`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1063

**NHA's list for the module:** `Date Range given is invalid`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1064

**NHA's list for the module:** `request with this request id already exists`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1109

**NHA's list for the module:** `ABHA DB service unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1108

**NHA's list for the module:** `Notification DB service unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1201

**NHA's list for the module:** `IDP Gateway is unavailable`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**NHA's list for the module:** `Unknown exception`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1006

**NHA's list for the module:** `Invalid combinations of scopes`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1056

**NHA's list for the module:** `This care contexts has been already linked`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1055

**NHA's list for the module:** `Invalid HIP Id or PHR Id`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1056

**NHA's list for the module:** `Invalid Link Reference Number`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1057

**NHA's list for the module:** `Invalid Care Contexts`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1059

**NHA's list for the module:** `Invalid Care Contexts count`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1060

**NHA's list for the module:** `Invalid Patient Reference Number`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1061

**NHA's list for the module:** `Invalid Patient Display`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1062

**NHA's list for the module:** `ABHA number mismatch with Link token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1063

**NHA's list for the module:** `HIP Id mismatch with Link token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1064

**NHA's list for the module:** `Request body was missing`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1065

**NHA's list for the module:** `Invalid X Auth token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1066

**NHA's list for the module:** `Invalid JWT token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1067

**NHA's list for the module:** `Request body not required`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1170

**NHA's list for the module:** `Invalid ABHA address`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1084

**NHA's list for the module:** `ABHA address mismatch with X Auth token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1085

**NHA's list for the module:** `ABHA number mismatch with X Auth token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1086

**NHA's list for the module:** `Patient profile mismatch with X Auth token`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1087

**NHA's list for the module:** `Duplicate patient share request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1090

**NHA's list for the module:** `Duplicate HIP link request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1091

**NHA's list for the module:** `Duplicate Get links request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1092

**NHA's list for the module:** `Duplicate Link token request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1093

**NHA's list for the module:** `Duplicate Bridge request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1094

**NHA's list for the module:** `Duplicate bridge patch request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1095

**NHA's list for the module:** `Duplicate Bridge service request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1102

**NHA's list for the module:** `Profile information cannot be null`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1103

**NHA's list for the module:** `Duplicate Discovery request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1104

**NHA's list for the module:** `Duplicate Init request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1105

**NHA's list for the module:** `Duplicate Confirm request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1106

**NHA's list for the module:** `Duplicate On discovery request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1107

**NHA's list for the module:** `Duplicate On init request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1108

**NHA's list for the module:** `Duplicate On confirm request`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1109

**NHA's list for the module:** `Invalid On discovery response`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1110

**NHA's list for the module:** `Invalid On init response`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1111

**NHA's list for the module:** `Invalid On confirm response`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1112

**NHA's list for the module:** `Invalid or already expired consent artefact id`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1113

**NHA's list for the module:** `Duplicate health information provider data flow response`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1149

**NHA's list for the module:** `Intent type is not supported at HIP end`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1150

**NHA's list for the module:** `Bridge API version cannot be null`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1402

**NHA's list for the module:** `Acknowledgement is not received from HIP`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**NHA's list for the module:** `HIP is unable to generate a token at this time. Please try again later.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**NHA's list for the module:** `HIP is unable to process at this time. Please try again later.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1030

**NHA's list for the module:** `Request id not found`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2500

**NHA's list for the module:** `No mapping found for`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2401

**NHA's list for the module:** `The X Auth token is invalid.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2402

**NHA's list for the module:** `Invalid Timestamp`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2404

**NHA's list for the module:** `Invalid Request Id`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2429

**NHA's list for the module:** `Too many requests found`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2501

**NHA's list for the module:** `Payment status should be : SUCCESS,CANCELED,PENDING,FAIL,REFUND_INITIATED,REFUND_SUCCESS`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2500

**NHA's list for the module:** `Authorization header is missing`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2403

**NHA's list for the module:** `Invalid X-CM-ID`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2406

**NHA's list for the module:** `Invalid API sequence flow, please follow logical flow`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-2406

**NHA's list for the module:** `The status is invalid. Please follow the logical status flow or transition.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**NHA's list for the module:** `User not found`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9999

**NHA's list for the module:** `Cannot process the request at the moment, please try later.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9001

**NHA's list for the module:** `No open order against ABHA. Please ensure a minimum of one open order`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9002

**NHA's list for the module:** `No registration found at <<hospital name>>. Contact counter support`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9003

**NHA's list for the module:** `Hospital services temporarily unavailable. Please try again after some time.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9004

**NHA's list for the module:** `Services disrupted, please try again.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9005

**NHA's list for the module:** `Bank server not responding. Please try again later`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9006

**NHA's list for the module:** `Service details mismatch. Please ensure original service ID from HMIS`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-9007

**NHA's list for the module:** `The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1006

**NHA's list for the module:** `Invalid count, must be 2 digit and ranges between 1 to 20`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1407

**NHA's list for the module:** `The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it.`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

### ABDM-1006

**NHA's list for the module:** `Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice`. NHA names no HTTP status and no call for it.

**Exit condition: the original call now succeeds.**

## Where the detail is

- The operation that returns each code: /docs/hiecm/v3/api/m2

## Every code in the specification

The M2, health information provider services specification's examples return no error code yet. That is a gap in the specification, not a promise that this module cannot fail.

A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.
