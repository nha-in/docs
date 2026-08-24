---
title: M4 APIs
sidebar_label: APIs
sidebar_position: 3
description: The HPR and HFR endpoints NHA's M4 document names, the request detail that survived, and what is still missing.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# M4 APIs

This page lists every call NHA's Milestone 4 document names, for the [HPR](/docs/overview/glossary#hpr) and the [HFR](/docs/overview/glossary#hfr). NHA pasted most of the request and response samples into that document as screenshots. Those screenshots did not convert to text, so for many calls we have the name, the purpose and the parameter list, but not the method or the path. Every gap is marked below. Nothing on this page is invented.

:::caution[Phase 2 on this site]
M4 is Phase 2 for this portal. This page is a map of the surface, not a build guide. Use it to size the work and to find the right call. Expect to open NHA's sandbox documentation alongside it for the paths this page does not have.
:::

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 4 (NHPR). Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What did not survive conversion

Read this first, so nothing below surprises you.

NHA's document carries about 95 screenshots. Each one is a request or a response sample. In most cases the screenshot is the only place the method and path appear, so both are missing here. The calls affected are:

- The whole HPID creation chain: generate Aadhaar link, check Aadhaar authentication status, verify OTP and fetch user details, check whether an HPID exists by Aadhaar, the mobile match call, generate mobile OTP, verify mobile OTP, username suggestions and create HPID. Only the base URL and the parameter behaviour survived.
- All five HFR onboarding calls: deduplicate search, basic facility information, additional information, detailed information and submit facility. The parameter tables survived in full. The paths did not.
- Bridge linkage. The parameter table survived. The path did not.
- All the HFR utility and search calls: master types, master data, LGD lookups, facility type, facility subtype, ownership subtype, specialities, PSU details, search facility, nearby search, send OTP to contact and validate OTP.
- Register professional, retrieve professional document list, upload documents, update professional and fetch professional details. Field tables survived. Only register professional carries its path in text.
- Most of the HPR master data calls. A handful carry their path in text and are listed below.

Where a request body is not shown on this page, it is because NHA's document does not carry one in text. We will not guess a payload.

## Session token

This is the first call you make, and one of the few whose method, URL and body all survived in text. It is the same session pattern as [M1](/docs/api/hie-cm/m1), issued by the [HIE-CM](/docs/overview/glossary#hie-cm) gateway.

| | |
|---|---|
| Method | `POST` |
| URL | `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` |
| URL, second host | `https://live.abdm.gov.in/api/hiecm/gateway/v3/sessions` |

NHA's M4 document gives both hosts for this call and labels neither. See [the note on environments](/docs/api/hie-cm/m4#environments).

Headers NHA's document names for this call:

| Header | Value |
|---|---|
| `REQUEST-ID` | A fresh UUID for each call, for end to end tracing |
| `TIMESTAMP` | The time the request was made, ISO 8601 |
| `X-CM-ID` | `sbx` in sandbox, `abdm` in production |

Request body:

```json
{
  "clientId": "<CLIENT_ID_FROM_SANDBOX_SIGNUP>",
  "clientSecret": "<CLIENT_SECRET_FROM_SANDBOX_SIGNUP>",
  "grantType": "client_credentials"
}
```

Response shape:

```json
{
  "accessToken": "<JWT>",
  "expiresIn": 1200,
  "refreshExpiresIn": 1800,
  "refreshToken": "<JWT>",
  "tokenType": "bearer"
}
```

`expiresIn` is inconsistent across the samples in NHA's document. One shows `36000`, another shows `1200`. Read the value from your own response rather than hard coding either.

Every later call carries this token. NHA's document repeats the same instruction on nearly every page: the `Authorization` header value is the word `Bearer`, one space, then the access token.

## Encryption

Three fields in the calls further down this page are sent encrypted, not in clear: the mobile number in the mobile match call, the [OTP](/docs/overview/glossary#otp) in the HPR mobile login, and the email and password in create HPID. All three use the same public certificate, so fetch it once.

| | |
|---|---|
| Method | `GET` |
| Sandbox URL | `https://apihspsbx.abdm.gov.in/v4/int/api/v1/auth/cert` |
| Production URL | `https://apinhpr.abdm.gov.in/v4/int/api/v1/auth/cert` |

The response is a PEM public key, beginning `-----BEGIN PUBLIC KEY-----`. NHA's document names the cipher as `RSA/ECB/PKCS1Padding`.

## HPID creation

Nine calls, in this order. NHA's document gives the behaviour of each but not the path.

| Step | Call | What it does | Detail we have |
|---|---|---|---|
| 1 | Generate Aadhaar link | Returns a `txnId` and a temporary URL for the professional to complete Aadhaar authentication on. The URL expires after 5 minutes | Behaviour only |
| 2 | Check Aadhaar authentication status | Optional polling. Takes the `txnId`. Returns a bare boolean, not an object | Behaviour only |
| 3 | Verify OTP and fetch user details | Takes the `txnId`. Returns demographic and address details from Aadhaar, with the mobile number masked | Behaviour only |
| 4 | Check HPID exists by Aadhaar | Returns the [HPID](/docs/overview/glossary#hpid) already registered for this Aadhaar, if there is one | Behaviour only |
| 5 | Mobile match | Checks whether the mobile number is the one on the Aadhaar record. The mobile number is encrypted. The response field is `demographicAuthViaMobile` | Behaviour only |
| 6 | Generate mobile OTP | Only if `demographicAuthViaMobile` is false. Takes the mobile number and the `txnId` | Behaviour only |
| 7 | Verify mobile OTP | Takes the OTP and the `txnId` | Behaviour only |
| 8 | Username suggestions | Takes the `txnId`. Returns suggested HPR usernames | Behaviour only |
| 9 | Create HPID | Takes the professional's details. Email and password are encrypted with the public certificate. Returns the HPID and an `hprToken` | Code tables below |

### Codes for create HPID

Category:

| Code | Name |
|---|---|
| 1 | Doctor |
| 2 | Nurse |
| 6 | Pharmacist |

Subcategory, as used by create HPID:

| Code | Name | HPR type |
|---|---|---|
| 1 | Modern Medicine | doctor |
| 2 | Dentist | doctor |
| 3 | Ayurveda | doctor |
| 4 | Unani | doctor |
| 5 | Siddha | doctor |
| 6 | Homoeopathy | doctor |
| 89 | Sowa-Rigpa | doctor |
| 220 | Yoga and Naturopathy | doctor |
| 7 | Registered Auxiliary Nurse Midwife (RANM) | nurse |
| 8 | Registered Nurse (RN) | nurse |
| 9 | Registered Nurse and Registered Midwife (RN and RM) | nurse |
| 10 | Registered Lady Health Visitor (RLHV) | nurse |
| 33 | Pharmacist | pharmacist |

Role:

| Code | Name |
|---|---|
| 1 | Healthcare Professional |
| 2 | Facility Manager |
| 3 | Healthcare Professional and Facility Manager |

:::note[The subcategory codes differ between calls]
NHA's document publishes a second subcategory table for register professional and update professional, and the codes do not match the create HPID table above. In that second table Dentistry is 2, Homoeopathy is 3, Ayurveda is 4, Unani is 5, Siddha is 6, Sowa-Rigpa is 7, the nurse codes run 8 to 11, Pharmacist is 13 and Yoga and Naturopathy is 14. We have not confirmed which table applies to which call. Fetch the codes from the HPRID subcategories master API rather than hard coding either table.
:::

## Getting an HPR token

The HPR token is different from the gateway access token. It represents the professional, not your client. NHA's document gives three ways to get one. All three carry the gateway access token in the `Authorization` header as well.

### Login by password

One call. The professional supplies their HPR ID and password.

| | |
|---|---|
| Method | `POST` |
| Path | `/v4/int/api/v1/auth/authPassword` |

```json
{
  "idType": "hpr_id",
  "domainName": "@hpr.abdm",
  "hprId": "<USERNAME_CHOSEN_AT_CREATE_HPID>@hpr.abdm",
  "password": "<PASSWORD_THE_PROFESSIONAL_SET>"
}
```

The `token` in the response is the HPR token. NHA's document also points you at the HPR Swagger page at `https://apihspsbx.abdm.gov.in/v4/int/swagger-ui/index.html?urls.primaryName=HPR` to try the same call in a browser.

The `expiresIn` value in this response sample is `1739710198`, which reads as a Unix timestamp rather than a number of seconds. The other two login flows return `1800`. We have not run the call, so we cannot tell you which reading is right.

### Login by mobile OTP

Four calls.

| Step | Method and path | Body |
|---|---|---|
| 1. Send OTP | `POST /v4/int/api/v2/auth/loginViaMobileSendOTP` | `{ "mobile": "9999999999" }` |
| 2. Get public certificate | `GET /v4/int/api/v1/auth/cert` | None |
| 3. Verify OTP | Path not confirmed, see below | `{ "txnId": "<TXN_ID_FROM_STEP_1>", "otp": "<OTP_ENCRYPTED_WITH_THE_PUBLIC_CERT>", "mobile": "<MOBILE_NUMBER>" }` |
| 4. Login with HPR ID | `POST /v4/int/api/v2/auth/login/userAuthorizedToken` | `{ "hpId": "<HPR_ID_FROM_STEP_3>", "txnId": "<TXN_ID_FROM_STEP_3>" }` |

Step 3 is a problem in the source. NHA's document repeats the send OTP path, `loginViaMobileSendOTP`, for the verify OTP call. That reads like a copy and paste error in the document. We have not run it, so we cannot tell you the correct path. Check NHA's Swagger page for the verify endpoint.

Step 1 response:

```json
{
  "txnId": "061c660d-8752-4639-945d-e77a7ea6f564",
  "mobileNumber": null
}
```

Step 3 response, listing the HPR IDs linked to that mobile number:

```json
{
  "txnId": "fc6d879c-e535-4ff1-9443-5dc6031efcc1",
  "mobileLinkedHpIdDTO": [
    {
      "hprIdNumber": "**-****-0326-3829",
      "name": "Test",
      "hprId": "*****@hpr.abdm"
    }
  ]
}
```

Step 4 response, which is the HPR token:

```json
{
  "token": "<HPR_TOKEN_JWT>",
  "expiresIn": 1800,
  "refreshToken": "<REFRESH_JWT>",
  "refreshExpiresIn": 10800
}
```

### Login by Aadhaar OTP

Two calls.

| Step | Method and path | Body |
|---|---|---|
| 1. Send OTP | `POST /v4/int/api/v1/auth/init` | `{ "idType": "hpr_id", "domainName": "@hpr.abdm", "authMethod": "AADHAAR_OTP", "hprId": "<HPR_ID>" }` |
| 2. Verify OTP | `POST /v4/int/api/v1/auth/confirmWithAadhaarOtp` | `{ "otp": "<OTP>", "txnId": "<TXN_ID_FROM_STEP_1>" }` |

Step 1 returns `{ "txnId": "..." }`. Step 2 returns the same token object as step 4 of the mobile flow.

## Register professional

This is the one HPR write call whose path survived in text.

| | |
|---|---|
| Method | `POST` |
| Sandbox URL | `https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/register-professional-new` |

The `hprToken` from create HPID goes in the payload, not the header. The gateway access token goes in the `Authorization` header.

The payload is large. NHA's document groups it into personal information, communication address, registration data, qualification data and current work details. Selected fields, with the rules NHA states:

| Field | Mandatory | Notes |
|---|---|---|
| `hprToken` | Yes | From create HPID, or from a login call |
| `healthProfessionalType` | Yes | `doctor`, `nurse` or `pharmacist`. An empty or wrong value makes the whole request invalid |
| `salutation`, `firstName` | Yes | `middleName` and `lastName` are optional |
| `nationality` | Yes | ID from the countries master |
| `languagesSpoken` | Yes | Comma separated master codes, for example `1,5` |
| `isCommunicationAddressAsPerKYC` | No | `0` means the communication address fields below become mandatory. `1` means they do not |
| `category` | Yes | Category code, for example `1` for doctor |
| `categoryId` | Yes | Subcategory code, for example `1` for Modern Medicine |
| `registeredWithCouncil`, `registrationNumber` | Yes | Council ID comes from the councils master |
| `nameOfDegreeOrDiplomaObtained` | Yes | ID from the courses master |
| `college`, `university` | Yes | IDs from the master data. Send `0` for "Any Other" |
| `yearOfAwardingDegreeDiploma` | Yes | `monthOfAwardingDegreeDiploma` is optional |
| `currentlyWorking` | Yes | `0` or `1`. If `0`, `reasonForNotWorking` becomes mandatory |
| `chooseWorkStatus` | Yes | `0` private, `1` government, `2` both |
| `ministry` | Conditional | Mandatory when `chooseWorkStatus` is `1` or `2`. Values from the get all ministry master |
| `isPermanentOrRenewable` | Conditional | Mandatory for a doctor. If `Renewable`, `renewableDueDate` is mandatory. Not required for a nurse |

Three conditional rules NHA calls out separately:

- When `chooseWorkStatus` is `1` or `2`, the `category` field inside `personalInformation` must be `C` for central government or `S` for state government. When it is `0`, send `category` as an empty string. The field is mandatory either way.
- When `chooseWorkStatus` is `1` or `2`, the `facilityDeclarationData` object is mandatory.
- If `facilityId` is not supplied, then `facilityName`, `facilityAddress`, `facilityPincode`, state, district and `facilityType` all become mandatory. If `facilityId` is supplied, then `facilityDepartment` and `facilityDesignation` become mandatory.

### Degree codes

| Code | Degree | System of medicine |
|---|---|---|
| 4060 | MBBS | Modern Medicine |
| 4074 | BDS | Dentistry |
| 4079 | BAMS | Ayurvedic |
| 4082 | BUMS | Unani |
| 61 | BSMS | Siddha |
| 74 | BTMS | Sowa-Rigpa |
| 40 | BHMS | Homoeopathy |
| 9568 | BPharm | Pharmacist |

### Attachments

Every attachment in the payload uses the same shape:

```json
{
  "fileType": "image/jpeg",
  "data": "<BASE64_ENCODED_FILE>"
}
```

NHA's document lists the accepted `fileType` values as `image/jpeg`, `image/png` and `certificate.pdf`. That third value is a file name, not a media type, so the PDF case is unclear in the source. The samples are inconsistent too, showing bare `jpeg`, `png` and `pdf` in some places and the full media type in others.

### A note on nurses

NHA's document is explicit about one difference. The SMD ID identifies doctors only. Searching for nurse colleges by SMD returns a null college or university name. That is expected behaviour, not a failure. For nurses, SMD is always null.

## The other professional calls

| Call | Parameters that survived | Path |
|---|---|---|
| Retrieve professional document list | `hprid` | Not in text |
| Upload documents | `hpr_token`, `document_id`, `document_type`, `data` (base64) | Not in text |
| Update professional | The same field table as register professional, with `hprToken` from a login call | Not in text |
| Fetch professional details | `id` (HPR ID, mandatory), `name` (minimum 3 letters), `contactNumber`, `state`, `registrationNumber`, `stateCouncilName` | Not in text |
| Search facility from HPR | `ownershipCode`, `stateLGDCode`, `districtLGDCode`, `subdistrictLGDCode`, `pincode`, `facilityName`, `facilityId`, `page`, `resultsPerPage` | Not in text |

Upload document rules NHA states: the profile photo must be 1 MB or smaller, other documents 5 MB or smaller, and the accepted types are png, jpeg, jpg and pdf. The document types are `profilePhoto`, `degreeCertificate`, `registrationCertificate`, `proofOfWorkCertificate`, `proofOfNameChangeRegCertificate` and `proofOfNameChangeQualCertificate`. Which identifier you send as `document_id` depends on the type:

| Document type | Identifier to use |
|---|---|
| `profilePhoto` | Parent identifier |
| `degreeCertificate` | Qualification block identifier |
| `registrationCertificate` | Registration block identifier |
| `proofOfWorkCertificate` | Parent identifier |
| `proofOfNameChangeRegCertificate` | Registration block identifier |
| `proofOfNameChangeQualCertificate` | Qualification block identifier |

## HFR onboarding

Five calls, in this order. None of the paths survived. All of the parameter tables did.

### 1. Deduplicate search

Run this before you create anything, so you do not create a second record for a facility that already exists.

| Param | Required | Notes |
|---|---|---|
| `facilityId` | No | 6 digit numeric facility unique ID |
| `name` | Yes | Alphanumeric, one space between words |
| `address` | No | Alphanumeric plus `-_.(),/` |
| `district` | Yes | District LGD code |
| `subDistrict` | Yes | Sub district LGD code |
| `village` | No | Village LGD code |
| `geolocation` | No | Latitude and longitude, 1 to 6 decimal places |

LGD codes come from the Local Government Directory at [lgdirectory.gov.in](https://lgdirectory.gov.in/), and from the LGD lookup calls listed further down.

### 2. Basic facility information

This is the call that creates the record. It returns a tracking ID that acts as the facility ID for every later call in the sequence.

This call needs an HPR token in the header, generated from an HPR ID and password.

Mandatory fields NHA names:

| Param | Notes |
|---|---|
| `facilityName` | First character must be a letter or a digit |
| `ownershipCode` | `G` government, `P` private, `PP` public private |
| `ownershipSubTypeCode` | `C` or `S` when ownership is `G`. `P` or `NP` when ownership is `P` or `PP` |
| `ownershipSubTypeCode2` | From the ownership subtype call |
| `workingInPsu`, `facPsuName` | Only when ownership is `G` and subtype is `C` |
| `systemOfMedicineCode` | From master data with `type=MEDICINE`. Comma separate for several |
| `facilityTypeCode`, `facilitySubType` | From the facility type and facility subtype calls |
| `specialityTypeCode` | From master data with `type=SPECIALITY-TYPE` |
| `facilityOperationalStatus` | From master data with `type=FACSTATUS` |
| `typeOfServiceCode` | From master data with `type=TYPESERVICE`. Not required for diagnostic laboratory, imaging centre, cath laboratory, dialysis centre, blood bank or pharmacy |
| `facilityAddressDetails` | Country, state, district and sub district LGD codes, address line 1, pincode, latitude and longitude |
| `facilityUploads` | `facilityBoardPhoto` and `facilityBuildingPhoto`, each as a `name` and a base64 `value`, maximum 5 MB, extension in the name matching the file |
| `timingsOfFacility` | `workingDays` and `openingHours`, mandatory when the facility is functional. Hours accept `10:00 AM-2:00 PM` or `24*7` |

Optional fields include `facilityRegion` (`R` rural or `U` urban), the contact block, the address proof block and `abdmCompliantSoftware`.

### 3. Additional information

Takes the tracking ID plus a set of yes or no flags, each answered with a code from master data `type=GENERAL-INFO-OPTIONS`: `hasDialysisCenter`, `hasPharmacy`, `hasBloodBank`, `hasCathLab`, `hasDiagnosticLab`, `hasImagingCenter`. When an imaging centre is present, `servicesByImagingCenter` carries a service code and an equipment count for each service.

It also carries the facility's existing scheme identifiers, all optional: `nhrrId`, `nin`, `abpmjayId`, `rohiniId`, `echsId`, `cghsId`, `ceaRegistration` and `stateInsuranceSchemeId`.

### 4. Detailed information

Takes the tracking ID plus the sections that apply to this facility. Which sections apply depends on the facility type, the type of service and the system of medicine. NHA's rules:

- Specialities are required for most facility types, but not for blood bank, cath laboratory, diagnostic laboratory, dialysis centre, imaging centre or pharmacy.
- For IPD and day care, medical infrastructure is mandatory. For IPD, at least one of the bed counts must be greater than zero. For day care, at least one of the day care bed counts must be greater than zero.
- For OPD where the system of medicine is dentistry, `countDentalChairs` is mandatory.
- For imaging centre, diagnostic laboratory, blood bank and pharmacy, medical infrastructure is not required at all.
- `totalNumberOfBeds` must be equal to or greater than the sum of the individual bed counts.
- The pharmacy, blood bank, diagnostic and imaging sections are each required when the facility is of that type or offers that service.

### 5. Submit facility

| Param | Required | Notes |
|---|---|---|
| `trackingId` | Yes | From the basic information call |
| `sourceOfInformation` | No | Leave empty and the facility is treated as a submitted entity |
| `sourceUniqueID` | No | The facility's ID in your own source system |

This call needs an `x-hpird-auth` token in the header. Until you make this call the facility stays in draft and goes nowhere.

## Bridge linkage

Links one facility to one or more bridges. Path not in text.

| Param | Required | Notes |
|---|---|---|
| `facilityId` | Yes | Starts with `IN`, 12 characters in total |
| `facilityName` | Yes | Alphanumeric plus `-_.(),/` |
| `bridgeId` | Yes | Alphanumeric |
| `hipName` | Yes | The name a patient sees in their [ABHA](/docs/overview/glossary#abha) or [PHR](/docs/overview/glossary#phr) app. 15 characters or fewer, no special characters, unique for every bridge on a facility |
| `type` | Yes | `HIP` or `HIU` |
| `active` | Yes | `true` or `false` |

## HFR search and master data

None of these paths survived in text. Two are named inside other parameter descriptions: `v1.5/facility/fetchfacilitytype` and `/v1.5/facility/get-specialities`.

| Call | Parameters | Notes |
|---|---|---|
| Master types | None | A GET. Returns the list of master data set types |
| Master data | `type` | The type comes from master types |
| LGD states | None | A GET. Returns states with their districts nested |
| LGD districts | `stateCode` | |
| LGD sub districts | `districtCode` | |
| Facility type | `ownershipCode`, `systemOfMedicineCode` | Ownership accepts `G` or `P` here |
| Facility subtype | `facilityTypeCode` | |
| Ownership subtype | `ownershipCode`, `ownerSubtypeCode` | |
| Get specialities | `systemOfMedicineCode` | One system of medicine per call |
| PSU details by ministry | Ministry code from ownership subtype | |
| Search facility | Either `facilityId`, or `ownershipCode` with `stateLGDCode` and `facilityName`. Plus `page` (minimum 1) and `resultsPerPage` (minimum 10) | Fuzzy match on name, exact match on everything else |
| Nearby search | `centerLat`, `centerLon`, `radiusInKm`, `from`, `size` are mandatory. `abdmSoftware`, `facilityOwnership`, `hospitalSpecialityType`, `speciality` and `facilityName` are optional filters | Results are ordered by distance, nearest first |
| Send OTP to contact | `facilityId` | Returns a transaction ID and sends an OTP to the facility's registered mobile |
| Validate OTP | `facilityId`, `sourceId`, `otp`, `source`, `transactionId` | `source` accepts `Government programs` |

## HPR master data

NHA's document lists 17 master data calls: system of medicine, medical councils, languages, universities, courses, colleges, countries, states, districts, sub districts, nurse affiliated boards, nurse councils, nurse college by state, affiliated board by state councils, get all ministry, HPRID categories and HPRID subcategories.

These are the only master data paths the document carries in text at all:

| Call | Method and path |
|---|---|
| Countries | `GET /v4/int/apis/v1/masters/countries/{country_id}` |
| States | `GET /v4/int/apis/v1/masters/states/{state_id}` |
| Districts | `GET /v4/int/apis/v1/masters/district/{state_id}` |
| Sub districts | `GET /v4/int/apis/v1/masters/sub-districts/{district_id}` |
| Languages | `GET /v4/int/apis/v1/masters/languages/{language_id}` |
| Courses | `GET /v4/int/apis/v1/masters/courses` |
| Nurse affiliated boards | `GET /v4/int/apis/v1/masters/affiliated-board` |

Three of these appear as complete URLs in NHA's document: countries, states and nurse affiliated boards. The other four appear only as path fragments inside field descriptions, so the `/v4/int/` prefix on those is our reading of the base URL, not a quote from the document.

Where a path variable is shown, NHA's document says it is optional. Drop it and you get the full list. Countries returns:

```json
{
  "id": 356,
  "alpha_2_code": "IN",
  "alpha_3_code": "IND",
  "enShortName": "India",
  "nationality": "Indian"
}
```

Two calls take parameters that survived:

| Call | Parameters |
|---|---|
| HPRID categories | `role`: `1` healthcare professional, `2` facility manager, `3` both |
| HPRID subcategories | `role` as above, plus `categoryCode` from the categories call |

NHA's document also publishes a system of medicine table with a twelfth row, `12 Registered Pharmacist`, filed under `nurse`. That looks like an error in the source table. Fetch the list from the master API rather than copying it.

## Error codes

NHA's M4 document publishes 150 error codes, all prefixed `HIS-`. They fall into six groups.

| Range | What it covers | Examples |
|---|---|---|
| `HIS-400` to `HIS-504` | The HTTP level failures | `HIS-401` user is not authorized, `HIS-403` forbidden, `HIS-503` requested service is unavailable |
| `HIS-1xxx` | Validation and facility errors, 103 of them | `HIS-1002` the field value should not be empty, `HIS-1124` bridge not linked, `HIS-1128` HIP name already exists, `HIS-1132` duplicate facility detected |
| `HIS-2xxx` | Aadhaar, OTP and session errors | `HIS-2022` invalid OTP, `HIS-2031` request expired, `HIS-2045` session expired |
| `HIS-3xxx` | Aadhaar data and HPID state | `HIS-3001` resident data not available, `HIS-3021` HPRID already exists, `HIS-3031` invalid token |
| `HIS-4xxx` | Facility record errors | `HIS-4003` facility already exists, `HIS-4032` invalid state code, `HIS-4055` invalid image format |
| `HIS-5xxx` | Registration workflow errors | `HIS-5005` already registered, `HIS-5011` token expired |

The full list is in NHA's sandbox documentation for the [healthcare professional registry](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=healthcare-professional-registry). We have not run any of these calls, so we cannot tell you which codes you will meet most often.

## Where to go next

- The interactive reference: [M4 API reference](/reference/hiecm-m4).
- The order of calls, as diagrams: [M4 user journeys](/docs/api/hie-cm/m4/user-journey).
- If a path on this page is missing and you need it now, ask on [support](/docs/support).
