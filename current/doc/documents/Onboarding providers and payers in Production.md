# Onboarding providers and payers in Production

*Source: `documents/Onboarding providers and payers in Production.pdf` — extracted full text*

**Pages: 4**


---

## Page 1

Onboarding APIs:
Step 1 Participant Creation
APIs to be https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create
called
Use case To Create the participant in the NHCX system.
description
Validations • The registry type should be valid and one from the Valid Registry Enums
directory provided.
• The role should be valid and one from the Valid Role Enums directory
provided.
• The mobile number should be a valid one and is already registered in the
system.
-For Providers: The mobile number will be validated with the one recorded
in the HFR and both should match for the call to be successful.
-For Payers: The mobile number will be validated with the one recorded in
the NHCX Payer details and both should match for the call to be
successful.
• The passcode will be sent the registered number after successful
validation and the transaction id will be shared in the response; both can
be further used for confirmation.
Request {
Payload "registrytype":"10001",
"registryid":"XXXXX74586",
"role":["10001"],
"endpoint_url":"",
"mobilenumber":"XXXX748348",
"email":"sample@gmail.com"
}
Response {
"participantid": "XXXXX7583@hcx",
"facilityname": "TEST Hospitals",
"facilitycontact": "XXXXXXX452",
"facilityemail": "sample@gmail.com",
"transactionid": "1vouv8tlz2tnl-1fpspjhwj07c6",
"error": {
"code": null",
"message":null,
"trace": null

**Table 1.1**

| Step 1 | Participant Creation |
|---|---|
| APIs to be<br>called | https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create |
| Use case<br>description | To Create the participant in the NHCX system. |
| Validations | • The registry type should be valid and one from the Valid Registry Enums<br>directory provided.<br>• The role should be valid and one from the Valid Role Enums directory<br>provided.<br>• The mobile number should be a valid one and is already registered in the<br>system.<br>-For Providers: The mobile number will be validated with the one recorded<br>in the HFR and both should match for the call to be successful.<br>-For Payers: The mobile number will be validated with the one recorded in<br>the NHCX Payer details and both should match for the call to be<br>successful.<br>• The passcode will be sent the registered number after successful<br>validation and the transaction id will be shared in the response; both can<br>be further used for confirmation. |
| Request<br>Payload | {<br>"registrytype":"10001",<br>"registryid":"XXXXX74586",<br>"role":["10001"],<br>"endpoint_url":"",<br>"mobilenumber":"XXXX748348",<br>"email":"sample@gmail.com"<br>} |
| Response | {<br>"participantid": "XXXXX7583@hcx",<br>"facilityname": "TEST Hospitals",<br>"facilitycontact": "XXXXXXX452",<br>"facilityemail": "sample@gmail.com",<br>"transactionid": "1vouv8tlz2tnl-1fpspjhwj07c6",<br>"error": {<br>"code": null",<br>"message":null,<br>"trace": null |


---

## Page 2

}
}
Entity to NHCX
Implement
the API called
Step 2 Participant Creation confirmation
APIs to https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/validate?transactionId="
be called "&passcode=" "
Use case Confirm the request for the participant creation.
descripti
on
Validatio • Each trigger of the participant create API (Step 1) will generate new
ns Transaction_id & Passcode will be sent to the registered mobile number.
• The passcode is specific to each transaction_id and it’s validated for
confirmation.
Entity to NHCX
Impleme
nt the API
called
Step 3 Participant Updation
APIs to be https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update
called
Use case To update the participant details registered in the NHCX system.
description
Validations • The Participant Code should be a valid Participant Code already registered
in the NHCX system. (Creation confirmation also completed)
• The certificate (public key) should be base64 encrypted.
Request {
Payload "participantcode": "XXXXXXX934@hcx",

**Table 2.1**

|  | }<br>} |
|---|---|
| Entity to<br>Implement<br>the API called | NHCX |


**Table 2.2**

| Step 2 | Participant Creation confirmation |
|---|---|
| APIs to<br>be called | https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/validate?transactionId="<br>"&passcode=" " |
| Use case<br>descripti<br>on | Confirm the request for the participant creation. |
| Validatio<br>ns | • Each trigger of the participant create API (Step 1) will generate new<br>Transaction_id & Passcode will be sent to the registered mobile number.<br>• The passcode is specific to each transaction_id and it’s validated for<br>confirmation. |
| Entity to<br>Impleme<br>nt the API<br>called | NHCX |


**Table 2.3**

| Step 3 | Participant Updation |
|---|---|
| APIs to be<br>called | https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update |
| Use case<br>description | To update the participant details registered in the NHCX system. |
| Validations | • The Participant Code should be a valid Participant Code already registered<br>in the NHCX system. (Creation confirmation also completed)<br>• The certificate (public key) should be base64 encrypted. |
| Request<br>Payload | {<br>"participantcode": "XXXXXXX934@hcx", |


---

## Page 3

"encryptioncert": "certificate in base 64",
"endpointurl": "base url "
}
Response {
"participant_code": "XXXXX78934@hcx",
"status": "",
"transactionid": "1fdesnz05o61g-1dl43hc511j1g"
}
Entity to NHCX
Implement
the API
called
Step 4 Participant Updation confirmation
APIs to https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/update/validate?transacti
be onId=”"&passcode=""
called
Use Confirm the request for the participant updation.
case
descripti
on
Validatio • Each trigger of the participant update API (Step 3) will generate new
ns Transaction_id & Passcode will be sent to the registered mobile number.
• The passcode is specific to each transaction_id and it’s validated for
confirmation.
Note: transaction_id and passcode will be valid for 24 hours.
Entity to NHCX
Impleme
nt the
API
called
Note: In case the user has forgotten the transaction_id they need to create the request for creation
or updation again.

**Table 3.1**

|  | "encryptioncert": "certificate in base 64",<br>"endpointurl": "base url "<br>} |
|---|---|
| Response | {<br>"participant_code": "XXXXX78934@hcx",<br>"status": "",<br>"transactionid": "1fdesnz05o61g-1dl43hc511j1g"<br>} |
| Entity to<br>Implement<br>the API<br>called | NHCX |


**Table 3.2**

| Step 4 | Participant Updation confirmation |
|---|---|
| APIs to<br>be<br>called | https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/update/validate?transacti<br>onId=”"&passcode="" |
| Use<br>case<br>descripti<br>on | Confirm the request for the participant updation. |
| Validatio<br>ns | • Each trigger of the participant update API (Step 3) will generate new<br>Transaction_id & Passcode will be sent to the registered mobile number.<br>• The passcode is specific to each transaction_id and it’s validated for<br>confirmation.<br>Note: transaction_id and passcode will be valid for 24 hours. |
| Entity to<br>Impleme<br>nt the<br>API<br>called | NHCX |


---

## Page 4

Valid Role Enums :
PROVIDER("10001")
PAYER("10002")
AGENCY_TPA("10003")
AGENCY_REGULATOR("10004")
RESEARCH("10005")
MEMBER_ISNP("10006")
AGENCY_SPONSOR("10007")
HIE_HIO_HCX("10008")
EUA(“10009”)
Valid Registry Enums:
HFR ("10001")
NIN ("10002")
ROHINI(" 10003")
PAYER ("10004")
Participant Certificate Updation
API to be https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/update/cert
called
Description To update the certificate of the participant without the passcode Validation.
Validation • Participant ID & Certificate are both mandatory.
Note: The certificate should be encoded to base64.
Request {
Body "participantId":"XXXX@hcx",
"certificate":"base64"
}

**Table 4.1**

|  | Participant Certificate Updation |
|---|---|
| API to be<br>called | https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/update/cert |
| Description | To update the certificate of the participant without the passcode Validation. |
| Validation | • Participant ID & Certificate are both mandatory.<br>Note: The certificate should be encoded to base64. |
| Request<br>Body | {<br>"participantId":"XXXX@hcx",<br>"certificate":"base64"<br>} |
