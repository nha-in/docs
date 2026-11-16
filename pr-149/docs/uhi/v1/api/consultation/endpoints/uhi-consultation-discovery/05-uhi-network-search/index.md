# Search the chosen HSPA for slots

`POST /search`

Search for services by intent
 *** First search coming from UHI gateway will include header(X-Gateway-Authorisation)
 Second search will be a peer to peer connection and will now contain contain the header Authorisation***

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

```bash
curl --request POST \
  --url https://<provider_uri>/search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "timestamp": "2024-06-25T05:01:39.587857Z",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "intent": {
      "provider": {
        "id": "1",
        "categories": [
          {
            "id": "201",
            "parent_category_id": "101",
            "descriptor": {
              "name": "Cardiology",
              "code": "CARDIOLOGY"
            }
          },
          {
            "id": "101",
            "descriptor": {
              "name": "ALLOPATHY",
              "code": "ALLOPATHY"
            }
          }
        ],
        "fulfillments": [
          {
            "type": "Online",
            "agent": {
              "id": "<HPR_ADDRESS>@hpr.ndhm",
              "image": null
            },
            "start": {
              "time": {
                "timestamp": "2024-06-25T10:30:27"
              }
            },
            "end": {
              "time": {
                "timestamp": "2024-06-25T23:59:59"
              }
            }
          }
        ],
        "items": [
          {
            "id": "1",
            "descriptor": {
              "name": "Consultation",
              "code": "CONSULTATION"
            },
            "price": {
              "currency": "INR",
              "value": "0.0"
            },
            "fulfillment_id": "1",
            "category_id": "201"
          }
        ]
      }
    }
  }
}'
```

## Headers

- `Authorization` (string, required): UHI Auth header. For second search only. For first search, UHI gateway shall pass X-Gateway-Authorization header

## Body

- `context` (object, required): Describes a DHP message context
- `context.domain` (object, required)
- `context.country` (object, required)
- `context.city` (object, required)
- `context.action` (string, required): Defines the DHP API call. Any actions other than the enumerated actions are not supported by DHP Protocol One of: search, select, init, confirm, status, on_search, on_select, on_init, on_confirm, on_confirm_audit, on_status, on_status_audit, on_cancel_audit.
- `context.core_version` (string, required): Version of DHP core API specification being used
- `context.consumer_id` (string, required): Unique id of the Consumer. By default it is the fully qualified domain name of the Consumer
- `context.consumer_uri` (string, required): URI of the Consumer for accepting callbacks. Must have the same domain name as the consumer_id
- `context.provider_id` (string): Unique id of the Provider. By default it is the fully qualified domain name of the Provider
- `context.provider_uri` (string): URI of the Provider. Must have the same domain name as the provider_id
- `context.transaction_id` (string, required): This is a unique value which persists across all API calls from search through confirm
- `context.message_id` (string, required): This is a unique value which persists during a request / callback cycle
- `context.timestamp` (string, required): Time of request generation in RFC3339 format
- `context.key` (string): The encryption public key of the sender
- `context.ttl` (string): The duration in ISO8601 format after timestamp for which this message holds valid
- `message` (object, required)
- `message.intent` (object): Intent of a user. Used for searching for services
- `message.intent.descriptor` (object)
- `message.intent.provider` (object)
- `message.intent.fulfillment` (object)
- `message.intent.payment` (object)
- `message.intent.category` (object)
- `message.intent.item` (object)
- `message.intent.tags` (object)

## Responses

- `200`: Acknowledgement of message received
  - `message` (object, required)
  - `message.ack` (object, required)
  - `error` (object): Describes an error object
  - `error.type` (string, required)
  - `error.code` (string, required): DHP specific error code. For full list of error codes, refer to error_codes.md in the root folder of this repo
  - `error.path` (string): Path to json schema generating the error. Used only during json schema validation errors
  - `error.message` (string): Human readable message describing the error

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "message": {
    "ack": "<ACK>"
  },
  "error": {
    "type": "<TYPE>",
    "code": "<CODE>",
    "path": "<PATH>",
    "message": "<MESSAGE>"
  }
}
```
