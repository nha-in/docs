# Integrate PHR, the patient side

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://abhasbx.abdm.gov.in` ABHA service, sandbox
- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

152 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/abha/api/v3/phr/app/enrollment/enrol` | 3 flows: Enroll ABHA Address |
| `POST` | `/abha/api/v3/phr/app/enrollment/enrol` | 3 flows: Enroll ABHA Address |
| `GET` | `/abha/api/v3/phr/app/enrollment/isExists` | 3 flows: isExists API, isExists API Copy |
| `GET` | `/abha/api/v3/phr/app/enrollment/isExists` | 3 flows: isExists API, isExists API Copy |
| `POST` | `/abha/api/v3/phr/app/enrollment/request/otp` | 3 flows: OTP Request - Mobile, OTP Request - ABHA OTP, OTP Request - AADHAR OTP |
| `POST` | `/abha/api/v3/phr/app/enrollment/request/otp` | 3 flows: OTP Request - Mobile, OTP Request - ABHA OTP, OTP Request - AADHAR OTP |
| `POST` | `/abha/api/v3/phr/app/enrollment/suggestion` | 3 flows: Suggestion API |
| `POST` | `/abha/api/v3/phr/app/enrollment/suggestion` | 3 flows: Suggestion API |
| `POST` | `/abha/api/v3/phr/app/enrollment/verify` | 3 flows: OTP Verify - Mobile, OTP Verify - ABHA OTP, OTP Verify - AADHAR OTP |
| `POST` | `/abha/api/v3/phr/app/enrollment/verify` | 3 flows: OTP Verify - Mobile, OTP Verify - ABHA OTP, OTP Verify - AADHAR OTP |
| `GET` | `/abha/api/v3/phr/app/login/profile` | Get Profile |
| `GET` | `/abha/api/v3/phr/app/login/profile` | Get Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/link` | 2 flows: Link Request |
| `POST` | `/abha/api/v3/phr/app/login/profile/link` | 2 flows: Link Request |
| `GET` | `/abha/api/v3/phr/app/login/profile/phrCard` | Get PHR Card |
| `GET` | `/abha/api/v3/phr/app/login/profile/phrCard` | Get PHR Card |
| `GET` | `/abha/api/v3/phr/app/login/profile/qrCode` | Get QR Code |
| `GET` | `/abha/api/v3/phr/app/login/profile/qrCode` | Get QR Code |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/logout` | Logout |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/logout` | Logout |
| `POST` | `/abha/api/v3/phr/app/login/profile/request/otp` | 4 flows: Send Otp - Update Email, Send Otp - Update Mobile, Send ABHA Otp - Lin… |
| `POST` | `/abha/api/v3/phr/app/login/profile/request/otp` | 4 flows: Send Otp - Update Email, Send Otp - Update Mobile, Send ABHA Otp - Lin… |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/token` | Refresh Token |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/token` | Refresh Token |
| `GET` | `/abha/api/v3/phr/app/login/profile/switch-profile` | Switch Profile |
| `GET` | `/abha/api/v3/phr/app/login/profile/switch-profile` | Switch Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/updateProfile` | Update Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/updateProfile` | Update Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify` | 5 flows: Verify Otp - Update Email, Verify Otp - Update Mobile, Verify Password… |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify` | 5 flows: Verify Otp - Update Email, Verify Otp - Update Mobile, Verify Password… |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify/switch-profile/user` | Verify User Switch Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify/switch-profile/user` | Verify User Switch Profile |
| `GET` | `/abha/api/v3/phr/app/login/public/certificate` | PHR Certificate |
| `GET` | `/abha/api/v3/phr/app/login/public/certificate` | PHR Certificate |
| `POST` | `/abha/api/v3/phr/app/login/request/otp` | 7 flows: OTP Request - Mobile, OTP Request - Email, OTP Request - ABHAADDRES Mo… |
| `POST` | `/abha/api/v3/phr/app/login/request/otp` | 7 flows: OTP Request - Mobile, OTP Request - Email, OTP Request - ABHAADDRES Mo… |
| `POST` | `/abha/api/v3/phr/app/login/search` | Search Auth Methods - ABHAAddress |
| `POST` | `/abha/api/v3/phr/app/login/search` | Search Auth Methods - ABHAAddress |
| `POST` | `/abha/api/v3/phr/app/login/verify` | 8 flows: Login OTP Verify - Mobile, Login OTP Verify - Email, Login OTP Verify … |
| `POST` | `/abha/api/v3/phr/app/login/verify` | 8 flows: Login OTP Verify - Mobile, Login OTP Verify - Email, Login OTP Verify … |
| `POST` | `/abha/api/v3/phr/app/login/verify/user` | 6 flows: Verify User, Verify - User |
| `POST` | `/abha/api/v3/phr/app/login/verify/user` | 6 flows: Verify User, Verify - User |
| `POST` | `/abha/api/v3/profile/account/request/emailVerificationLink` | Email Verification Link |
| `POST` | `/abha/api/v3/profile/account/request/emailVerificationLink` | Email Verification Link |
| `GET` | `/api/hiecm/consent/v3/artefact` | This is ABDM HIE-CM API called to fetch all the consent artefact details of a p… |
| `GET` | `/api/hiecm/consent/v3/artefact` | This is ABDM HIE-CM API called to fetch all the consent artefact details of a p… |
| `GET` | `/api/hiecm/consent/v3/artefact/{artefact-id}` | This is ABDM HIE-CM API called to fetch the consent artefact details associated… |
| `GET` | `/api/hiecm/consent/v3/artefact/{artefact-id}` | This is ABDM HIE-CM API called to fetch the consent artefact details associated… |
| `GET` | `/api/hiecm/consent/v3/artefact/request/{request-id}` | This is ABDM HIE-CM API called to fetch all the consent artefact details associ… |
| `GET` | `/api/hiecm/consent/v3/artefact/request/{request-id}` | This is ABDM HIE-CM API called to fetch all the consent artefact details associ… |
| `POST` | `/api/hiecm/consent/v3/auto/approve` | This is ABDM HIE-CM API called to setup an auto-approval policy for given HIU. |
| `POST` | `/api/hiecm/consent/v3/auto/approve` | This is ABDM HIE-CM API called to setup an auto-approval policy for given HIU. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/disable` | This is ABDM HIE-CM API called to disable the auto-approval policy. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/disable` | This is ABDM HIE-CM API called to disable the auto-approval policy. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/enable` | This is ABDM HIE-CM API called to enable the auto-approval policy. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/enable` | This is ABDM HIE-CM API called to enable the auto-approval policy. |
| `GET` | `/api/hiecm/consent/v3/request` | This is ABDM HIE-CM API called to fetch all the consent request details of a pa… |
| `GET` | `/api/hiecm/consent/v3/request` | This is ABDM HIE-CM API called to fetch all the consent request details of a pa… |
| `GET` | `/api/hiecm/consent/v3/request/{request-id}` | This is ABDM HIE-CM API called to get the consent request details by request id. |
| `GET` | `/api/hiecm/consent/v3/request/{request-id}` | This is ABDM HIE-CM API called to get the consent request details by request id. |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/approve` | This is ABDM HIE-CM API called by patients to approve the consent request raise… |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/approve` | This is ABDM HIE-CM API called by patients to approve the consent request raise… |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/deny` | This is ABDM HIE-CM API called by patients to deny the consent request raised b… |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/deny` | This is ABDM HIE-CM API called by patients to deny the consent request raised b… |
| `POST` | `/api/hiecm/consent/v3/revoke` | This is ABDM HIE-CM API called by patients to revoke the granted consent from P… |
| `POST` | `/api/hiecm/consent/v3/revoke` | This is ABDM HIE-CM API called by patients to revoke the granted consent from P… |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service id. |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service id. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programs. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programs. |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `GET` | `/api/hiecm/hip/v3/link/patient/links` | This is the PHR APP API, this api will used to fetch all link care-context for … |
| `GET` | `/api/hiecm/hip/v3/link/patient/links` | This is the PHR APP API, this api will used to fetch all link care-context for … |
| `GET` | `/api/hiecm/patient-share/v3/profile/getTokenDetails` | This API will be invoked to get the historical token numbers of the patient |
| `GET` | `/api/hiecm/patient-share/v3/profile/getTokenDetails` | This API will be invoked to get the historical token numbers of the patient |
| `POST` | `/api/hiecm/patient-share/v3/share` | This API will be invoked from the PHR-HIU application for sharing the patient/u… |
| `POST` | `/api/hiecm/patient-share/v3/share` | This API will be invoked from the PHR-HIU application for sharing the patient/u… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/on-notify` | This is an API is called by HIU to notify to HIP so that confirm that the HIU r… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/on-notify` | This is an API is called by HIU to notify to HIP so that confirm that the HIU r… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/order-status` | This is an API is called by HIU to check the status of reports. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/order-status` | This is an API is called by HIU to check the status of reports. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/selection` | This is an API called by HIU to select the all open-order and send to HIP for a… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/selection` | This is an API called by HIU to select the all open-order and send to HIP for a… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/share/open-order` | This API will be invoked from the integrator application (any PHR application, … |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/share/open-order` | This API will be invoked from the integrator application (any PHR application, … |
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/approve` | This API will be invoked by the patient/user from PHR application to approve su… |
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/approve` | This API will be invoked by the patient/user from PHR application to approve su… |
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/deny` | This API will be invoked by the patient/user from PHR application to deny subsc… |
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/deny` | This API will be invoked by the patient/user from PHR application to deny subsc… |
| `GET` | `/api/hiecm/subscription-requests/v3/{subscription-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `GET` | `/api/hiecm/subscription-requests/v3/{subscription-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `POST` | `/api/hiecm/subscription-requests/v3/disable/{subscription-id}` | This API will be invoked to disable the subscription by subscription id. |
| `POST` | `/api/hiecm/subscription-requests/v3/disable/{subscription-id}` | This API will be invoked to disable the subscription by subscription id. |
| `POST` | `/api/hiecm/subscription-requests/v3/enable/{subscription-id}` | This API will be invoked to enable the subscription by subscription id. |
| `POST` | `/api/hiecm/subscription-requests/v3/enable/{subscription-id}` | This API will be invoked to enable the subscription by subscription id. |
| `PUT` | `/api/hiecm/subscription-requests/v3/patients/{subscription-id}` | This API will be invoked to edit the subscription details. |
| `PUT` | `/api/hiecm/subscription-requests/v3/patients/{subscription-id}` | This API will be invoked to edit the subscription details. |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/lockers` | The API provides the list of health locker that the ABHA address is subscribed … |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/lockers` | The API provides the list of health locker that the ABHA address is subscribed … |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/lockers/{lockerId}` | This API will be invoked to get health locker settings of a patient by locker i… |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/lockers/{lockerId}` | This API will be invoked to get health locker settings of a patient by locker i… |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/requests` | This API will be invoked to get all the consent and subscription requests with … |
| `GET` | `/api/hiecm/subscription-requests/v3/patients/requests` | This API will be invoked to get all the consent and subscription requests with … |
| `GET` | `/api/hiecm/subscription-requests/v3/request/{request-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `GET` | `/api/hiecm/subscription-requests/v3/request/{request-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `GET` | `/api/hiecm/subscription-requests/v3/requests` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `GET` | `/api/hiecm/subscription-requests/v3/requests` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm` | This API will be invoked by the patient/user to confirm his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm` | This API will be invoked by the patient/user to confirm his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/init` | This API will be invoked by the patient/user to link his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/init` | This API will be invoked by the patient/user to link his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/patient/care-context/discover` | This API will be invoked by the patient/user from PHR application to discover h… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/patient/care-context/discover` | This API will be invoked by the patient/user from PHR application to discover h… |
| `POST` | `/api/v3/hiu/patient/care-context/on-confirm` | This API endpoint is used by healthcare information users (HIUs) to receive con… |
| `POST` | `/api/v3/hiu/patient/care-context/on-confirm` | This API endpoint is used by healthcare information users (HIUs) to receive con… |
| `POST` | `/api/v3/hiu/patient/care-context/on-discover` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/care-context/on-discover` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/care-context/on-init` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/care-context/on-init` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/on-share` | This API will be invoked to the HIU for sharing the response of HIECM's /api/hi… |
| `POST` | `/api/v3/hiu/patient/on-share` | This API will be invoked to the HIU for sharing the response of HIECM's /api/hi… |
| `POST` | `/v3/patient/on-selection` | This is callback api for the API. This Api needs to implement by HIU to receive… |
| `POST` | `/v3/patient/on-selection` | This is callback api for the API. This Api needs to implement by HIU to receive… |
| `POST` | `/v3/patient/on-share/open-order` | This is a callback API for patient on-share. This Api needs to implement by HIU… |
| `POST` | `/v3/patient/on-share/open-order` | This is a callback API for patient on-share. This Api needs to implement by HIU… |
| `POST` | `/v3/patient/scan-pay/notify` | This is callback API for the notify API. This API needs to implement by HIU to … |
| `POST` | `/v3/patient/scan-pay/notify` | This is callback API for the notify API. This API needs to implement by HIU to … |
| `POST` | `/v3/patient/scan-pay/on-order-status` | This is callback for the on-order-status API. This API needs to implement by HI… |
| `POST` | `/v3/patient/scan-pay/on-order-status` | This is callback for the on-order-status API. This API needs to implement by HI… |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for each request. |
| `TIMESTAMP` | Request timestamp in UTC, ISO-8601 with Z. |
| `X-token` |  |
| `R-token` |  |
| `T-token` |  |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-AUTH-TOKEN` | JWT Authentication token which was issued by ABDM after successful validation of username and password |
| `X-HIU-ID` | Identifier of the health information user to which the request was intended |
## A request, in full

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/enrol \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "27d444b7-2a3d-46d8-bf67-e5590b6c46b6",
  "phrDetails": {
    "mobile": "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBD",
    "firstName": "John",
    "middleName": "",
    "lastName": "Doe",
    "yearOfBirth": "1997",
    "dayOfBirth": "",
    "monthOfBirth": "01",
    "gender": "M",
    "email": "",
    "profilePhoto": "",
    "address": "pune Maharashtra",
    "stateName": "Maharashtra",
    "stateCode": "27",
    "districtName": "Nashik",
    "districtCode": "123",
    "pinCode": "422003",
    "abhaAddress": "johndoe@sbx",
    "password": "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBD"
  }
}'
```
