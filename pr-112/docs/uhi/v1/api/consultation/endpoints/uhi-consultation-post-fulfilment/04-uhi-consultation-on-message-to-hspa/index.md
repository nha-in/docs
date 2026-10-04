# Send a message to the HSPA

`POST /on_message`

Inter-operable communication API between consumer and provider
***(Both HSPA and EUA will be consuming the same on_message API)***

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

Retry behaviour: not yet published.

```bash
curl --request POST \
  --url https://<provider_uri>/on_message \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_message",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35.481906Z",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "chat": {
        "sender": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image hashed base64",
            "id": "<HPR_ADDRESS>@hpr.ndhm"
          }
        },
        "receiver": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image",
            "id": "<ABHA_ADDRESS>"
          }
        },
        "content": {
          "content_id": "e616e100-42e0-11ed-b5d7-51ae9d37b46f",
          "content_value": "Base64 Encoded text",
          "content_type": "text"
        },
        "time": {
          "timestamp": "2022-10-03T11:32:01"
        }
      }
    }
  }
}'
```

## Headers

- `Authorization` (string, required): UHI Auth header

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
- `message` (object)
- `message.order` (object, required): Describes the details of an order
- `message.order.id` (string): Hash of order object without id
- `message.order.state` (string)
- `message.order.provider` (object)
- `message.order.provider.id` (object)
- `message.order.item` (object)
- `message.order.billing` (object)
- `message.order.fulfillment` (object)
- `message.order.quote` (object)
- `message.order.payment` (object)
- `message.order.created_at` (string)
- `message.order.updated_at` (string)
- `message.order.customer` (object)
- `error` (object): Describes an error object
- `error.type` (string, required)
- `error.code` (string, required): DHP specific error code. For full list of error codes, refer to error_codes.md in the root folder of this repo
- `error.path` (string): Path to json schema generating the error. Used only during json schema validation errors
- `error.message` (string): Human readable message describing the error

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
