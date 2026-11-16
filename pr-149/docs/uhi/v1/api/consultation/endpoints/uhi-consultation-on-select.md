# Send a quoted draft order

`POST /on_select`

Send draft order object with quoted price for selected items
 Currently not being used for doctor search will be used in vaccination search***

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

Retry behaviour: not yet published.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_select \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85110",
    "country": "IND",
    "city": "std:011",
    "action": "select",
    "core_version": "0.7.1",
    "message_id": "85a422c4-2867-4d72-b5f5-d31588e2f7c5",
    "timestamp": "2021-03-23T10:00:40.065Z"
  },
  "message": {
    "order": {
      "provider": {
        "id": "1",
        "descriptor": {
          "name": "MAX Hospitals"
        }
      },
      "items": [
        {
          "id": "1",
          "descriptor": {
            "name": "Consultation"
          },
          "fulfillment_id": "2",
          "provider_id": "1"
        }
      ],
      "fulfillment": {
        "id": "2",
        "type": "DIGITAL-OPD",
        "person": {
          "id": "1",
          "name": "<NAME>",
          "gender": "male",
          "image": "https://image/of/doctor.png",
          "cred": "uhiId:237402938409485039850935"
        },
        "time": {
          "range": {
            "start": "T10:15Z",
            "end": "T10:30Z"
          }
        }
      },
      "quote": {
        "price": {
          "currency": "INR",
          "value": "110",
          "breakup": [
            {
              "./dhp-0_7_1.consultation": "100"
            },
            {
              "./dhp-0_7_1.cgst": "5"
            },
            {
              "./dhp-0_7_1.sgst": "5"
            }
          ]
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
- `message.order` (object, required)
- `message.order.provider` (object)
- `message.order.items` (object[])
- `message.order.items.id` (object, required)
- `message.order.items.quantity` (object)
- `message.order.items.fulfillment_id` (object)
- `message.order.quote` (object)
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
