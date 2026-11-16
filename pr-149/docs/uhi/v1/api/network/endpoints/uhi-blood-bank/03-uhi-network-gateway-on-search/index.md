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
    "domain": "nic2008:86906",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "e-RaktKosh",
        "images": "e-RaktKosh IMAGE",
        "short_desc": "e-RaktKosh: A Centralized Blood Bank Management System",
        "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
      },
      "providers": [
        {
          "id": "0",
          "descriptor": {
            "name": "Azad Panchi Group's, Janseva Blood Centre",
            "short_desc": "Charitable/Vol",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 16
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Azad Panchi Group's, Janseva Blood Centre",
              "short_desc": "Charitable/Vol",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
            }
          }
        },
        {
          "id": "1",
          "descriptor": {
            "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
            "short_desc": "Govt.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 88
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
              "short_desc": "Govt.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
            }
          }
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
