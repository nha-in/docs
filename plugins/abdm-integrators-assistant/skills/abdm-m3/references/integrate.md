# Integrate M3, consent and fetching

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

52 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api/hiecm/consent/v3/fetch` | This is ABDM HIE-CM API called by HIU to fetch the consent details |
| `POST` | `/api/hiecm/consent/v3/fetch` | This is ABDM HIE-CM API called by HIU to fetch the consent details |
| `POST` | `/api/hiecm/consent/v3/request/hiu/on-notify` | This is ABDM HIE-CM API called by HIU to acknowledge the notification sent when… |
| `POST` | `/api/hiecm/consent/v3/request/hiu/on-notify` | This is ABDM HIE-CM API called by HIU to acknowledge the notification sent when… |
| `POST` | `/api/hiecm/consent/v3/request/init` | This is ABDM HIE-CM API called by HIU to initiate the consent request |
| `POST` | `/api/hiecm/consent/v3/request/init` | This is ABDM HIE-CM API called by HIU to initiate the consent request |
| `POST` | `/api/hiecm/consent/v3/request/status` | This is ABDM HIE-CM API used by HIU to get consent request status |
| `POST` | `/api/hiecm/consent/v3/request/status` | This is ABDM HIE-CM API used by HIU to get consent request status |
| `POST` | `/api/hiecm/data-flow/v3/health-information/notify` | Notifications corresponding to events during data flow |
| `POST` | `/api/hiecm/data-flow/v3/health-information/notify` | Notifications corresponding to events during data flow |
| `POST` | `/api/hiecm/data-flow/v3/health-information/request` | Health information data request from HIU. |
| `POST` | `/api/hiecm/data-flow/v3/health-information/request` | Health information data request from HIU. |
| `GET` | `/api/hiecm/data-flow/v3/health-information/request/status/{transaction-id}` | API to get the current status of the Health Information Request. |
| `GET` | `/api/hiecm/data-flow/v3/health-information/request/status/{transaction-id}` | API to get the current status of the Health Information Request. |
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
| `POST` | `/api/v3/hiu/consent/on-fetch` | This is a callback API called by CM to provide fetched consent artefact details… |
| `POST` | `/api/v3/hiu/consent/on-fetch` | This is a callback API called by CM to provide fetched consent artefact details… |
| `POST` | `/api/v3/hiu/consent/request/notify` | This is a callback api to notify hiu when consent is APPROVED, DENIED or REVOKE… |
| `POST` | `/api/v3/hiu/consent/request/notify` | This is a callback api to notify hiu when consent is APPROVED, DENIED or REVOKE… |
| `POST` | `/api/v3/hiu/consent/request/on-init` | Callback API of consent request for patient HIU. |
| `POST` | `/api/v3/hiu/consent/request/on-init` | Callback API of consent request for patient HIU. |
| `POST` | `/api/v3/hiu/consent/request/on-status` | Callback API of consent status request. |
| `POST` | `/api/v3/hiu/consent/request/on-status` | Callback API of consent status request. |
| `POST` | `/api/v3/hiu/health-information/on-request` | Health information data request acknowledgement to HIU. |
| `POST` | `/api/v3/hiu/health-information/on-request` | Health information data request acknowledgement to HIU. |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-HIU-ID` | Identifier of the health information user to which the request was intended |
## A request, in full

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "consentId": "5f7a535d-a3fd-416b-b069-c97d021fbacd"
}'
```
