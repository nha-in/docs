# Integrate P2, PHR management

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://abhasbx.abdm.gov.in` ABHA service, sandbox
- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

43 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/abha/api/v3/phr/app/login/profile` | Get Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/link` | 2 flows: Link Request |
| `GET` | `/abha/api/v3/phr/app/login/profile/phrCard` | Get PHR Card |
| `GET` | `/abha/api/v3/phr/app/login/profile/qrCode` | Get QR Code |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/logout` | Logout |
| `POST` | `/abha/api/v3/phr/app/login/profile/request/otp` | 4 flows: Send Otp - Update Email, Send Otp - Update Mobile, Send ABHA Otp - Lin… |
| `GET` | `/abha/api/v3/phr/app/login/profile/request/token` | Refresh Token |
| `GET` | `/abha/api/v3/phr/app/login/profile/switch-profile` | Switch Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/updateProfile` | Update Profile |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify` | 5 flows: Verify Otp - Update Email, Verify Otp - Update Mobile, Verify Password… |
| `POST` | `/abha/api/v3/phr/app/login/profile/verify/switch-profile/user` | Verify User Switch Profile |
| `GET` | `/api/hiecm/consent/v3/artefact` | This is ABDM HIE-CM API called to fetch all the consent artefact details of a p… |
| `GET` | `/api/hiecm/consent/v3/artefact/{artefact-id}` | This is ABDM HIE-CM API called to fetch the consent artefact details associated… |
| `GET` | `/api/hiecm/consent/v3/artefact/request/{request-id}` | This is ABDM HIE-CM API called to fetch all the consent artefact details associ… |
| `POST` | `/api/hiecm/consent/v3/auto/approve` | This is ABDM HIE-CM API called to setup an auto-approval policy for given HIU. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/disable` | This is ABDM HIE-CM API called to disable the auto-approval policy. |
| `POST` | `/api/hiecm/consent/v3/auto/approve/{auto-approval-id}/enable` | This is ABDM HIE-CM API called to enable the auto-approval policy. |
| `GET` | `/api/hiecm/consent/v3/request` | This is ABDM HIE-CM API called to fetch all the consent request details of a pa… |
| `GET` | `/api/hiecm/consent/v3/request/{request-id}` | This is ABDM HIE-CM API called to get the consent request details by request id. |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/approve` | This is ABDM HIE-CM API called by patients to approve the consent request raise… |
| `POST` | `/api/hiecm/consent/v3/request/{request-id}/deny` | This is ABDM HIE-CM API called by patients to deny the consent request raised b… |
| `POST` | `/api/hiecm/consent/v3/revoke` | This is ABDM HIE-CM API called by patients to revoke the granted consent from P… |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service id. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programs. |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `GET` | `/api/hiecm/hip/v3/link/patient/links` | This is the PHR APP API, this api will used to fetch all link care-context for … |
| `GET` | `/api/hiecm/patient-share/v3/profile/getTokenDetails` | This API will be invoked to get the historical token numbers of the patient |
| `POST` | `/api/hiecm/patient-share/v3/share` | This API will be invoked from the PHR-HIU application for sharing the patient/u… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/confirm` | This API will be invoked by the patient/user to confirm his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/init` | This API will be invoked by the patient/user to link his/her health records. |
| `POST` | `/api/hiecm/user-initiated-linking/v3/patient/care-context/discover` | This API will be invoked by the patient/user from PHR application to discover h… |
| `POST` | `/api/v3/hiu/patient/care-context/on-confirm` | This API endpoint is used by healthcare information users (HIUs) to receive con… |
| `POST` | `/api/v3/hiu/patient/care-context/on-discover` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/care-context/on-init` | This API endpoint is used by healthcare information users (HIUs) to receive the… |
| `POST` | `/api/v3/hiu/patient/on-share` | This API will be invoked to the HIU for sharing the response of HIECM's /api/hi… |
## Headers

| Header | What it is |
| --- | --- |
| `X-token` |  |
| `REQUEST-ID` | Unique UUID for each request. |
| `TIMESTAMP` | Request timestamp in UTC, ISO-8601 with Z. |
| `R-token` |  |
| `T-token` |  |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-AUTH-TOKEN` | JWT Authentication token which was issued by ABDM after successful validation of username and password |
| `X-HIU-ID` | Identifier of the health information user to which the request was intended |
## A request, in full

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```
