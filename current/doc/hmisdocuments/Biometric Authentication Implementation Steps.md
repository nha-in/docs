# Biometric Authentication Implementation Steps

*Source: `hmisdocuments/Biometric Authentication Implementation Steps.docx` — extracted full content*

Biometric Authentication (Fingerprint, IRIS and Face Auth)

To comply with the mandatory requirements of the PMJAY scheme, all participating hospitals must follow the below authentication protocol during patient registration, the pre-authorization and claim/discharge workflow.

|  |  |  |
|---|---|---|
| Biometric Authentication Using ABHA APIs | <br>● At the time of registering the patient or initiating a pre-authorisation request, hospitals shall perform biometric authentication of the beneficiary using fingerprint, iris or face auth to ensure the physical presence of the patient. <br>● Upon successful biometric verification, the system shall generate a User Token. <br> | <br>● At the time of registering the patient or initiating a pre-authorisation request, hospitals shall perform biometric authentication of the beneficiary using fingerprint, iris or face auth to ensure the physical presence of the patient. <br>● Upon successful biometric verification, the system shall generate a User Token. <br> |
| Token Validity and Refresh Mechanism | <br>● The User Token issued after authentication remains valid for 30 minutes. <br>● Hospital systems must ensure that the token is refreshed automatically, as required, until completion of the relevant transaction cycle. <br>● If the token expires at any stage, a fresh biometric authentication must be initiated. This step is mandatory to meet the PMJAY requirement of ensuring proof of patient presence at the hospital. | <br>● The User Token issued after authentication remains valid for 30 minutes. <br>● Hospital systems must ensure that the token is refreshed automatically, as required, until completion of the relevant transaction cycle. <br>● If the token expires at any stage, a fresh biometric authentication must be initiated. This step is mandatory to meet the PMJAY requirement of ensuring proof of patient presence at the hospital. |
| Applicability | <br>● This authentication process is applicable only for beneficiaries whose ABHA ID is linked with their PMJAY card. <br>● For beneficiaries without ABHA linkage, the alternate PMJAY-approved KYC protocols may be followed as per the existing guidelines. <br> | <br>● This authentication process is applicable only for beneficiaries whose ABHA ID is linked with their PMJAY card. <br>● For beneficiaries without ABHA linkage, the alternate PMJAY-approved KYC protocols may be followed as per the existing guidelines. <br> |
| Handle Exemption | <br>● In cases where biometric/aadhaar authentication is not feasible, providers must obtain an Aadhaar exemption consent document. This document must be signed by both the patient and the hospital representative, digitally stored, and linked to the beneficiary record to maintain compliance with ABDM standards. <br> | <br>● In cases where biometric/aadhaar authentication is not feasible, providers must obtain an Aadhaar exemption consent document. This document must be signed by both the patient and the hospital representative, digitally stored, and linked to the beneficiary record to maintain compliance with ABDM standards. <br> |
| Key points | <br>● Biometric authentication or a valid exemption is mandatory for provider systems to submit claims in accordance with PMJAY policy. <br>● The process ensures compliance, security, and verifiable beneficiary identification throughout the claim submission workflow. <br> | <br>● Biometric authentication or a valid exemption is mandatory for provider systems to submit claims in accordance with PMJAY policy. <br>● The process ensures compliance, security, and verifiable beneficiary identification throughout the claim submission workflow. <br> |

Biometric Authentication – Fingerprint/IRIS Authentication

API Details

Auth INIT

Request curl:

curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init' \

--header 'accept: */*' \

--header 'Content-Type: application/json' \

--header 'Authorization: Bearer {{Token}}' \

--header ‘process: Preauth|Discharge' \

--header 'payerid: 123@hcx' \

--data-raw '{

"scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-iris-verify"]

"loginHint": "abha-number",

"loginId": "91-XXXX-XXXX-1234",

"otpSystem": "aadhaar",

"authMode": "FINGERPRINT"//FINGERPRINT,IRIS

}'

Response:

{

"txnId": "8c8a12e3-xxxx-4278-xxxx-10acffa44f07",

"authMode": null,

"message": "FingerPrint authentication request successfully sent.",

"status": null

}

--data-raw '{

"scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or  ["abha-login", "aadhaar-iris-verify"]

"authData": {

"authMethods": [

"bio"//bio | iris

],

"bio": {

"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",

"fingerPrintAuthPid": "string"

},

"iris": {

"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",

"irisAuthPid": "string"

},

"authMode": "FINGERPRINT" //FINGERPRINT,IRIS

}'

Response:

{

"txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",

"authResult": "success",

"message": "… verified successfully",

"token": "eyZhx….",

"refreshToken": "eyZhx….",

"expiresIn": 1800,

"refreshExpiresIn": 1296000,

"accounts": [

{

"ABHANumber": "91-XXXX-XXXX-1234",

"preferredAbhaAddress": "91XXXXXXXX1234@sbx",

"name": "Test Name",

"gender": null,

"dob": null,

"verifiedStatus": null,

"verificationType": null,

"status": "ACTIVE",

"profilePhoto": "base 64 image"

}

]

}

Auth Verify

Request curl:

curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify' \

--header 'accept: */*' \

--header 'Content-Type: application/json' \

--header 'Authorization: Bearer {{Token}}' \

--header ‘process: Preauth|Discharge' \

--header 'payerid: 123@hcx' \

--data-raw '{

"scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-iris-verify"]

"authData": {

"authMethods": [

"bio"//bio | iris

],

"bio": {

"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",

"fingerPrintAuthPid": "string"

},

"iris": {

"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",

"irisAuthPid": "string"

},

"authMode": "FINGERPRINT" //FINGERPRINT,IRIS

}'

Response:

{

"txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",

"authResult": "success",

"message": "…. verified successfully",

"token": "eyZhx….",

"refreshToken": "eyZhx….",

"expiresIn": 1800,

"refreshExpiresIn": 1296000,

"accounts": [

{

"ABHANumber": "91-XXXX-XXXX-1234",

"preferredAbhaAddress": "91XXXXXXXX1234@sbx",

"name": "Test Name",

"gender": null,

"dob": null,

"verifiedStatus": null,

"verificationType": null,

"status": "ACTIVE",

"profilePhoto": "base 64 image"

}

]

}

3. Auth Refresh Token:

During any ABHA transaction, when user enrolls or logs in, an X-Auth Token is generated. This token is used to fetch the user’s profile details and is valid for 30 minutes.

Along with the X-Auth Token, a Refresh Token is also provided. This Refresh Token is used to generate a new X-Auth Token through the given API. The Refresh Token is valid for 15 days.

If you need a new X-Auth Token after 15 days, you can call the same API again. It will give you a new Refresh Token, which will then be valid for another 15 days from the time it was generated.

To keep the Refresh Token active continuously, you can call the API once within every 10 days and store the new Refresh Token. This way, you can extend access to the X-Auth Token for as long as needed.

Request curl:

curl --location --request GET 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token' \

--header 'R-token: Bearer {{RefreshToken}}' \

--header 'Authorization: Bearer {{Auth}}' \

--header 'payerid: 123@hcx' \

--header 'process: Preauth|Discharge' \

Response:

{

"txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",

"authResult": "success",

"message": "OTP verified successfully",

"token": "eyZhx….",

"refreshToken": "eyZhx….",

"expiresIn": 1800,

"refreshExpiresIn": 1296000,

"accounts": [

{

"ABHANumber": "91-XXXX-XXXX-1234",

"preferredAbhaAddress": "91XXXXXXXX1234@sbx",

"name": "Test Name",

"gender": null,

"dob": null,

"verifiedStatus": null,

"verificationType": null,

"status": "ACTIVE",

"profilePhoto": "base 64 image"

--data-raw '{

"scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-iris-verify"]

"authData": {

"authMethods": [

"bio"//bio | iris

],

"bio": {

"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",

"fingerPrintAuthPid": "string"

},

}

]

}

NHCX Face-Auth API Curl

- Face Auth Init API:

Endpoint: https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init

cURL: curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init' \

--header 'Accept: application/json' \

--header 'Content-Type: application/json' \

--header 'Authorization: Bearer {{encodedJwt1}}' \

--header 'REQUEST-ID: {{$guid}}' \

--header 'TIMESTAMP: {{$isoTimestamp}}'

Response Data:

{

"txnId": "8ea0f277-d089-406b-8203-360e507e0354",

"message": "Transaction Id generated Successfully"

}

1.1 After executing the faceauth/init API, we need to generate the QR code using the following endpoint URL and scan the face authentication using this APK sandbox ABHA App , replacing the txnId with the newly generated value: https://phrsbx.abdm.gov.in/face-auth?txnId=b5dbd8b0-86b7-4f84-8a0b-762c433e19c2"

- Select the highlighted QR Code Icon in the Sand Box ABHA App.

- Click the Continue button and complete the face authentication scan.

- FACE AUTH Capture PID:

- Before performing face authentication, execute this API. The response will show the status as pending. Once the face authentication is complete, the response status will change to completed. A sample response is given below.

- Endpoint: https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid

- cURL: curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid' \

- --header 'Accept: application/json' \

- --header 'Content-Type: application/json' \

- --header 'Authorization: Bearer {{encodedJwt1}}' \

- --header 'REQUEST-ID: {{$guid}}' \

- --header 'TIMESTAMP: {{$isoTimestamp}}' \

- --data-raw '{

- "txnId" : "{{txnId}}"

- }'

Before Face Auth Response Data:

{

"status": "PENDING",

"message": "Awaiting PID capture"

}

After Face Auth Response Data:

{
    "status": "COMPLETE",
    "message": "PID capture successful"
}

- FACE AUTH Aadhar Verify:

- Replacing the existing txnId in the body or payload, Sample "txnId": " b5dbd8b0-86b7-4f84-8a0b-762c433e19c2",

- Generate the encrypted form of the Aadhaar using this URL and the following Public Key (X.509 format). “MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9Nwgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1AayfZp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7irDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkNergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXuiwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAlsIzQpnSVDUVEzv17grVAw078CAwEAAQ==”

- Enter your Aadhar number in the Encryption text box.

- Select the Transformation Algorithm "RSA/ECB/OAEPWithSHA-1AndMGF1Padding" from the drop-down.

- Click on encrypt button and copy the encrypted form of Aadhar and paste it in the verify API body or payload.

- Given your Aadhar linked mobile number in the verify API body or payload.

Endpoint: https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify

cURL: curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify' \

--header 'Accept: application/json' \

--header 'Content-Type: application/json' \

--header 'Authorization: Bearer {{encodedJwt1}}' \

--header 'REQUEST-ID: {{$guid}}' \

--header 'TIMESTAMP: {{$isoTimestamp}}' \

--header 'payerid: 1518@hcx' \

--header 'process: Preauth' \

--data-raw '{

"authData": {

"authMethods": [

"face_auth"

],

"face": {

"txnId": "{{txnId}}",

"aadhaar": "{{AdharNumber}}",

"mobile": "{{MobileNumber}}"

}

},

"authMode": "FACE_AUTH"

}'

Verify API Response Data:

{

"txnId": "eec3fa0e-ee6d-4f00-bd47-8cca09defdca",

"message": "This account already exist",

"tokens": {

"token": " BlfICWsKyVyuTyp46vGaCXK0ZBLOnnh8nYBv72YkrpoK6HbgCeVCW ",

"expiresIn": "1800",

"refreshExpiresIn": "1296000",

"refreshToken": "03PtNAF20NQrLz7tG5toq86SOCpBNUMgYluzUTALy9IsarOCHUseA"

},

"ABHAProfile": {

"preferredAddress": "91637688653202@sbx",

"firstName": "Palivela",

"middleName": "Siva",

"lastName": "Ganesh",

"dob": "16-08-1985",

"gender": "M",

"photo": "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBk”

"mobile": "9492123339",

"mobileVerified": true,

"email": null,

"phrAddress": [

"91637688653202@sbx"

],

"address": "4-104/1, chinnam peta, ramachandrapuram, Venkatayapalem, East Godavari, Andhra Pradesh",

"districtCode": "747",

"stateCode": "28",

"pinCode": "533262",

"abhaType": "STANDARD",

"stateName": "ANDHRA PRADESH",

"districtName": "Dr. B.R. Ambedkar Konaseema",

"communicationMobile": null,

"ABHANumber": "91-6376-8865-3202",

"abhaStatus": "ACTIVE"

}


---

*4 embedded image(s) extracted to `Biometric Authentication Implementation Steps_images/`*