# Look up a network participant

`POST /api/v1/networkregistry/lookup`

The network participant will trigger the subscribe call to the registry to register its public key.

The header Authorisation is accepted and verified by the /lookup API. 
Use your header generation details to generate header and payload should contain details of partner on whom lookup is intended.

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/networkregistry/lookup \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "subscriber_id": "nha.eua",
  "type": "EUA",
  "domain": "nic2008:86201",
  "country": "IND",
  "city": "std:08752",
  "pub_key_id": "nha.eua.k1"
}'
```

## Headers

- `Authorization` (string, required): UHI Auth header

## Responses

- `200`: OK
  - `city` (string): City code
  - `country` (string): Country code as per ISO 3166-1 and ISO 3166-2 format
  - `domain` (string): Industry domain of the subscriber.
  - `encr_public_key` (string): Encryption public key of the dhp_consumer subscriber. Any dhp_provider must encrypt the requestBody.message value of the on_search API using this public key.
  - `participant_id` (string): A unique ID describing a participant on a network.
  - `pub_key_id` (string): A unique ID describing  public key uniquely on a network.
  - `status` (string) One of: INITIATED, SUBSCRIBED, UNSUBSCRIBED).
  - `subscriber_id` (string): Registered domain name of the subscriber. Must have a valid SSL certificate issued by a Certificate Authority of the operating region
  - `subscriber_url` (string): Callback URL of the subscriber. The Registry will call this URL's on_subscribe API to validate the subscriber's credentials
  - `type` (string) One of: consumer, provider, gateway.
  - `valid_from` (string): Keys valid from
  - `valid_until` (string): Keys valid until
- `201`: Created
- `401`: Unauthorized
- `403`: Forbidden
- `404`: No record found!
  - `type` (string, required)
  - `code` (string, required): DHP specific error code. For full list of error codes, refer to error_codes.md in the root folder of this repo
  - `path` (string): Path to json schema generating the error. Used only during json schema validation errors
  - `message` (string): Human readable message describing the error

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "city": "<CITY>",
  "country": "<COUNTRY>",
  "domain": "<DOMAIN>",
  "encr_public_key": "<ENCR_PUBLIC_KEY>",
  "participant_id": "<PARTICIPANT_ID>",
  "pub_key_id": "<PUB_KEY_ID>",
  "status": "INITIATED",
  "subscriber_id": "<SUBSCRIBER_ID>",
  "subscriber_url": "<SUBSCRIBER_URL>",
  "type": "consumer",
  "valid_from": "<VALID_FROM>",
  "valid_until": "<VALID_UNTIL>"
}
```
