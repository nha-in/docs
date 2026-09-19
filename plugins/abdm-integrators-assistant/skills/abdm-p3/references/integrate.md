# Integrate P3, PHR subscriptions

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

19 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
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
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/approve` | This API will be invoked by the patient/user from PHR application to approve su… |
| `POST` | `/api/hiecm/subscription-requests/v3/{request-id}/deny` | This API will be invoked by the patient/user from PHR application to deny subsc… |
| `GET` | `/api/hiecm/subscription-requests/v3/{subscription-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `POST` | `/api/hiecm/subscription-requests/v3/disable/{subscription-id}` | This API will be invoked to disable the subscription by subscription ID. |
| `POST` | `/api/hiecm/subscription-requests/v3/enable/{subscription-id}` | This API will be invoked to enable the subscription by subscription ID. |
| `PUT` | `/api/hiecm/subscription-requests/v3/patients/{subscription-id}` | This API will be invoked to edit the subscription details. |
| `GET` | `/api/hiecm/subscription-requests/v3/request/{request-id}` | This API will be invoked by the patient/user from PHR application to fetch his/… |
| `GET` | `/api/hiecm/subscription-requests/v3/requests` | This API will be invoked by the patient/user from PHR application to fetch his/… |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-AUTH-TOKEN` | JWT Authentication token which was issued by ABDM after successful validation of username and password |
## A request, in full

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/.well-known/openid-configuration \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx'
```
