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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK02126",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.35081180000000000,78.47271120000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": false
              }
            }
          ]
        },
        {
          "id": "PMBJK02129",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.39410330000000000,78.44249560000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": true
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
