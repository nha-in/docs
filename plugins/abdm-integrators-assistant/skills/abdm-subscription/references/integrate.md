# Integrate Subscriptions

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

17 operations, grouped by the journey they belong to.

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
| `POST` | `/api/hiecm/subscription-requests/v3/hiu/care-context/on-notify` | This API will be invoked by the HIU to respond to /api/v3/hiu/subscription/noti… |
| `POST` | `/api/hiecm/subscription-requests/v3/hiu/on-notify` | This API will be invoked by the HIU to respond to /subscription-requests/hiu/no… |
| `POST` | `/api/hiecm/subscription-requests/v3/init` | This API will be invoked by the HIU/patient/user to initiate subscription reque… |
| `POST` | `/api/v3/hiu/hiecm/subscription-requests/on-init` | This is a callback API for /api/hiecm/subscription-requests/v3/init. |
| `POST` | `/api/v3/hiu/subscription-requests/hiu/notify` | This is a callback API when a subscription request is approved or denied. |
| `POST` | `/api/v3/hiu/subscription/notify` | This is a callback API to notify the subscribed HIU when a care context is link… |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `X-HIU-ID` | Identifier of the health information user to which the request was intended |
## A request, in full

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/.well-known/openid-configuration \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx'
```
