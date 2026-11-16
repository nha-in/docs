# Send a catalog through the Gateway

`POST /api/v1/uhi/on_search`

Accepter for all the on_search response from the HSPAs

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "action": "on_search",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-04-16T17:52:00",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "flag": false,
        "images": "HSPA Image",
        "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
        "name": "NHA HSPA",
        "short_desc": "Ref HSPA: Ambulance Provider HSPA"
      },
      "providers": [
        {
          "categories": [
            {
              "descriptor": {
                "code": "PTA",
                "flag": false,
                "name": "Patient Transport Ambulances (PTA)"
              },
              "id": "3"
            },
            {
              "descriptor": {
                "code": "MVA",
                "flag": false,
                "name": "Mortuary Van/Ambulance"
              },
              "id": "4"
            },
            {
              "descriptor": {
                "code": "ALS",
                "flag": false,
                "name": "Advanced Life Support(ALS)"
              },
              "id": "1"
            },
            {
              "descriptor": {
                "code": "BLS",
                "flag": false,
                "name": "Basic Life Support(BLS)"
              },
              "id": "2"
            }
          ],
          "descriptor": {
            "flag": false,
            "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
            "name": "NHA HSPA",
            "short_desc": "HSPA"
          },
          "fulfillments": [
            {
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
            {
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:43:00"
                }
              },
              "id": "ML-BLS-01",
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              },
              "tracking": false,
              "type": "EMERGENCY"
            }
          ],
          "id": "1",
          "items": [
            {
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
            {
              "category_id": "2",
              "descriptor": {
                "flag": false,
                "long_desc": "disclaimer",
                "name": "Charges",
                "short_desc": "applicability"
              },
              "fulfillment_id": "ML-BLS-01",
              "id": "2",
              "price": {
                "currency": "INR",
                "estimated_Value": "300",
                "maximum_Value": "1000",
                "minimum_Value": "0",
                "value": "300.0"
              }
            }
          ]
        }
      ]
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
- `message.catalog` (object, required): Describes a DHP-Provider catalog
- `message.catalog.descriptor` (object)
- `message.catalog.categories` (object[])
- `message.catalog.fulfillments` (object[])
- `message.catalog.payments` (object[])
- `message.catalog.providers` (object[])
- `message.catalog.exp` (string): Time after which catalog has to be refreshed
- `error` (object): Describes an error object
- `error.type` (string, required)
- `error.code` (string, required): DHP specific error code. For full list of error codes, refer to error_codes.md in the root folder of this repo
- `error.path` (string): Path to json schema generating the error. Used only during json schema validation errors
- `error.message` (string): Human readable message describing the error

## Responses

- `200`: Acknowledgement of message received
  - `message` (object)
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
