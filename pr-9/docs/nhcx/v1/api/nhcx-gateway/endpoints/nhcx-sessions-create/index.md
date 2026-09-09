# Mint a session token from client credentials

`POST /api/hiecm/gateway/v3/sessions`

Exchanges the Milestone 1 client ID and secret for a bearer token. The token goes on every later NHCX call in the `bearer_auth` header, with the word `Bearer` and a space in front of it.

An older address, `/gateway/v0.5/sessions`, appears throughout the portal's earlier documents. It takes the client ID and secret alone, without the three headers below and without `grantType`, and returns the same body. Treat it as superseded.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 607f0d74-0913-4345-afd0-70123442eb64' \
  --header 'TIMESTAMP: 2026-09-04T06:15:51.975Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<your client id>",
  "clientSecret": "<your client secret>",
  "grantType": "client_credentials"
}'
```
