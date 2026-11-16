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
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://100.65.158.41:8901/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "PMJAY HSPA",
        "images": "PMJAY logo IMAGE",
        "short_desc": "Pradhan Mantri Jan Arogya Yojana - Hospital Engagement Module",
        "long_desc": "PMJAY - HEM"
      },
      "providers": [
        {
          "id": "HOSP27G13867",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
            }
          }
        },
        {
          "id": "HOSP27G13869",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
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
