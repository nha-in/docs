# Send a catalog to the EUA

`POST /on_search`

Sends catalogue.

The header X-Gateway-Authorisation is sent only by UHI gateway during first onsearch only. 
The header Authorisation is passed by HSPA to EUA during second onsearch and following APIs.
Both headers are required on respective calls as mentioned above.

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

Retry behaviour: not yet published.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2026-08-21T10:02:42",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "notto.hspa",
    "provider_uri": "https://notto.mohfw.gov.in/notto/integrationservice/uhi/transplant-retrieval-centres",
    "transaction_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606",
    "message_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "NOTTO",
        "images": "NOTTO image url",
        "flag": false,
        "short_desc": "National Organ And Tissue Transplant Organization"
      },
      "providers": [
        {
          "id": 6086143.1,
          "descriptor": {
            "name": "MEDANTA THE MEDICITY",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Pancreas",
                "code": "8",
                "flag": false
              }
            },
            {
              "id": "7",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "5",
              "descriptor": {
                "name": "Cornea",
                "code": "10",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Intestine",
                "code": "7",
                "flag": false
              }
            },
            {
              "id": "6",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2009"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "28.439161, 77.041129",
            "address": "<ADDRESS>",
            "district": {
              "name": "GURGAON"
            },
            "state": {
              "name": "HARYANA"
            }
          },
          "contact": {
            "phone": "0124-4141414",
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "0124-4141414",
              "website": ""
            }
          }
        },
        {
          "id": "24474288.1",
          "descriptor": {
            "name": "ZYDUS HOSPITALS AND HEALTHCARE RESEARCH PVT LTD",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2015"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "23.058744, 72.516632",
            "address": "<ADDRESS>",
            "district": {
              "name": "AHMADABAD"
            },
            "state": {
              "name": "GUJARAT"
            }
          },
          "contact": {
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "079-66190716",
              "website": ""
            }
          }
        }
      ]
    }
  }
}'
```

## Headers

- `Authorization` (string, required): Passed by HSPA for second onsearch. For first onsearch, UHI gateway shall pass X-Gateway-Authorization header

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
