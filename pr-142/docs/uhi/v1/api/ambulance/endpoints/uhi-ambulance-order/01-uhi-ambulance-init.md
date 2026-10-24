# Send the patient's details for a quote

`POST /init`

Initialise an order by providing billing and/or shipping details

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

```bash
curl --request POST \
  --url https://<provider_uri>/init \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "action": "init",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-01-05T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "billing": {
        "address": {
          "area_code": "500067",
          "city": null,
          "country": "INDIA",
          "door": "",
          "locality": "13-6-454/36/1, Hiranagar, Gudimalkapur, Asifnagar, Hyderabad, Andhra Pradesh",
          "name": "<NAME>",
          "state": "Telangana"
        },
        "email": "",
        "name": "<NAME>",
        "phone": "<MOBILE_NUMBER>"
      },
      "customer": {
        "id": "<ABHA_ADDRESS>",
        "person": {
          "dayOfBirth": "<DOB>",
          "dob": "<DOB>",
          "gender": "M",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>"
        }
      },
      "fulfillment": {
        "end": {
          "time": {
            "timestamp": "2026-01-05T12:35:00"
          }
        },
        "id": "ML-ALS-01",
        "start": {
          "time": {
            "timestamp": "2026-01-05T12:30:00"
          }
        },
        "tags": {
          "additional_services": "oxygen cylinder, etc",
          "deeplink_url": "https://deeplinkurl.com"
        },
        "tracking": true,
        "type": "EMERGENCY"
      },
      "item": {
        "category_id": "1",
        "descriptor": {
          "flag": true,
          "long_desc": "disclaimer",
          "name": "Charges",
          "short_desc": "applicability"
        },
        "fulfillment_id": "ML-ALS-01",
        "id": "1",
        "price": {
          "currency": "INR",
          "estimated_Value": "500",
          "maximum_Value": "1500",
          "minimum_Value": "200",
          "value": "500"
        }
      },
      "locations": [
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "SOURCE",
            "name": "SOURCE"
          },
          "gps": "12.423423,77.325647"
        },
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "DESTINATION",
            "name": "DESTINATION"
          },
          "gps": "12.423423,77.325647"
        }
      ],
      "provider": {
        "descriptor": {
          "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
          "name": "NHA HSPA",
          "short_desc": "HSPA DESC"
        },
        "id": "1"
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
- `message` (object, required)
- `message.order` (object, required)
- `message.order.provider` (object)
- `message.order.provider.id` (object)
- `message.order.items` (object[])
- `message.order.items.id` (object, required)
- `message.order.items.quantity` (object)
- `message.order.items.fulfillment_id` (object)
- `message.order.billing` (object)
- `message.order.fulfillment` (object)
- `message.order.quote` (object)

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
