# Integrate M2, linking and sharing

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

32 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api/hiecm/consent/v3/request/hip/on-notify` | This is ABDM HIE-CM API called by HIP to acknowledge the notification sent when… |
| `POST` | `/api/hiecm/data-flow/v3/health-information/hip/on-request` | Health information data request acknowledgement from HIP. |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open ID configuration. |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service ID. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programmes. |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate Keycloak token/access token. |
| `POST` | `/api/hiecm/hip/v3/link/carecontext` | This API will be used to perform HIP initiated linking. |
| `POST` | `/api/hiecm/hip/v3/link/context/notify` | This API will be used to notify CM about any update on the already linked care … |
| `POST` | `/api/hiecm/hip/v3/link/patient/links/sms/notify2` | This API will be used by HIP to send SMS notification to patient that a care co… |
| `POST` | `/api/hiecm/patient-share/v3/on-share` | This API will be invoked by the HIP for sharing the response of HIECM's /api/hi… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm` | This API will be invoked by the HIP for sharing the response of /api/hiecm/user… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/link/care-context/on-init` | As a result of the initialization, HIP has to generate a unique reference-numbe… |
| `POST` | `/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover` | HMIS/LIMS/HIP has to ensure that only unlinked records of the patient has to be… |
| `POST` | `/api/hiecm/v3/token/generate-token` | API used to generate link token to link the health records |
| `POST` | `/api/v3/consent/request/hip/notify` | This is a callback API to notify HIP when consent is APPROVED or REVOKED. |
| `POST` | `/api/v3/hip/health-information/request` | Health information data request to HIP. |
| `POST` | `/api/v3/hip/link/care-context/confirm` | This API endpoint is used to confirm the linking of care contexts for a patient… |
| `POST` | `/api/v3/hip/link/care-context/init` | This API endpoint is used to initiate the linking of care contexts for a patien… |
| `POST` | `/api/v3/hip/patient/care-context/discover` | This API endpoint is used to discover care contexts associated with a patient. … |
| `POST` | `/api/v3/hip/patient/share` | This API will be invoked to the HIP for sharing the response of HIECM's /api/hi… |
| `POST` | `/api/v3/hip/token/on-generate-token` | This is a call back API of [/api/hiecm/v3/token/generate-token]. |
| `POST` | `/api/v3/link/on_carecontext` | This API endpoint is a callback API that will be called by HIE-CM. The response… |
| `POST` | `/api/v3/links/context/on-notify` | This API endpoint is a call back API for /api/hiecm/hip/v3/link/context/notify … |
| `POST` | `/api/v3/patients/sms/on-notify` | This API endpoint is a call back API for /api/hiecm/hip/v3/link/patient/links/s… |
| `POST` | `/health-information/transfer` | health information transfer API |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-HIP-ID` | Identifier of the health information provider to which the request was intended |
| `X-LINK-TOKEN` | JWT Authentication token which was issued by ABDM after successful validation of username and password |
## A request, in full

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hip/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "OK",
    "consentId": "e3c74829-3f82-4f94-959e-e10f57bcd57b"
  },
  "error": {
    "code": "ABDM-1001",
    "message": "unable to connect database"
  },
  "response": {
    "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71"
  }
}'
```
