# Integrate Scan and pay

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

46 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
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
| `PATCH` | `/api/hiecm/gateway/v3/scanPay/updateVersion` | This API is used to update version to the serviceId. |
| `PATCH` | `/api/hiecm/gateway/v3/scanPay/updateVersion` | This API is used to update version to the serviceId. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/on-selection` | This is an API is called by HIP to share payment bundle alone with procedures o… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/on-selection` | This is an API is called by HIP to share payment bundle alone with procedures o… |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/on-share/open-order` | This is an API called by HIP to HIE-CM to send all the open order for patient. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/on-share/open-order` | This is an API called by HIP to HIE-CM to send all the open order for patient. |
| `GET` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/details` | This is retrieve the all the details of the user. |
| `GET` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/details` | This is retrieve the all the details of the user. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/notify` | This is an API called by HIP to send the payment status to HIU. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/notify` | This is an API called by HIP to send the payment status to HIU. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/on-order-status` | This is an API is called by HIP to check the status of reports. |
| `POST` | `/api/hiecm/scan-gateway/v3/patient/scan-pay/on-order-status` | This is an API is called by HIP to check the status of reports. |
| `POST` | `/v3/patient/scan-pay/on-notify` | This is an callback API for on-notify API need to implement by HIP to received … |
| `POST` | `/v3/patient/scan-pay/on-notify` | This is an callback API for on-notify API need to implement by HIP to received … |
| `POST` | `/v3/patient/scan-pay/order-status` | This is callback API for the order_status API. This Api needs to implement by H… |
| `POST` | `/v3/patient/scan-pay/order-status` | This is callback API for the order_status API. This Api needs to implement by H… |
| `POST` | `/v3/patient/selection` | This is the call back api for the selection API. This API needs to implement by… |
| `POST` | `/v3/patient/selection` | This is the call back api for the selection API. This API needs to implement by… |
| `POST` | `/v3/patient/share/open-order` | This is an API is called by HIU to check the status of reports. |
| `POST` | `/v3/patient/share/open-order` | This is an API is called by HIU to check the status of reports. |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-AUTH-TOKEN` | JWT Authentication token which was issued by ABDM after successful validation of username and password |
| `X-HIP-ID` | Identifier of the health information provider to which the request was intended |
## A request, in full

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/.well-known/openid-configuration \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx'
```
