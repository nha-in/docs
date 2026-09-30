# Send the doctor's slots

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
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2024-06-25T05:01:39.587857Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Ref HSPA",
        "short_desc": "Reference HSPA Test hospital",
        "long_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."
      },
      "providers": [
        {
          "id": "1",
          "descriptor": {
            "name": "Test Hospital",
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "fulfillments": [
            {
              "id": "21ddefb0-fc52-4837-959a-d79b100013c4",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T12:30:00"
                }
              }
            },
            {
              "id": "48f30a20-96de-4e92-adcc-25f8570f95b5",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T12:45:00"
                }
              }
            },
            {
              "id": "e486f6fc-8564-4234-b1f1-1d2aa673bb7c",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:00:00"
                }
              }
            },
            {
              "id": "db07e802-4091-4b83-bbe4-39e231743aa3",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:15:00"
                }
              }
            },
            {
              "id": "72488196-b2e4-41a2-bec1-a70ecdfd1286",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:30:00"
                }
              }
            },
            {
              "id": "cd4ea078-1e27-4e19-b4df-d98ba418cafb",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:45:00"
                }
              }
            },
            {
              "id": "cd9d91eb-4524-49b6-9a3d-c6a50a5a795c",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:00:00"
                }
              }
            },
            {
              "id": "1e922a92-192a-4238-bde2-c96f4b9bbb58",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:15:00"
                }
              }
            },
            {
              "id": "242717f2-b173-4b2e-b438-e4dda1f3d7f8",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:30:00"
                }
              }
            },
            {
              "id": "0c7d19ad-e967-4ce4-9174-9bc33db08df6",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:45:00"
                }
              }
            },
            {
              "id": "a5acad4d-19c1-4399-b39d-5861ccae57e4",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:00:00"
                }
              }
            },
            {
              "id": "8bc975aa-b1cc-4f68-b1ea-7e4538ea5590",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:15:00"
                }
              }
            },
            {
              "id": "1bbc0521-7e22-47d7-b37c-0ab041ba175d",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:30:00"
                }
              }
            },
            {
              "id": "9a40403b-0ad5-4eee-91df-e1ee576e07a5",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:45:00"
                }
              }
            },
            {
              "id": "53e27bf2-1212-4a1f-8500-60ac5ce49d93",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:00:00"
                }
              }
            },
            {
              "id": "dc892441-10ae-4ff2-8ce0-29d647f316e3",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:15:00"
                }
              }
            },
            {
              "id": "fa7ce31b-476c-41c3-9804-767032028802",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:30:00"
                }
              }
            },
            {
              "id": "39e9c31c-52ae-4b5e-b8d5-e1bc37124be1",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:45:00"
                }
              }
            },
            {
              "id": "f30530c7-1424-4186-99ba-122a343d1f9d",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T17:00:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "0",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "21ddefb0-fc52-4837-959a-d79b100013c4"
            },
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
              "fulfillment_id": "48f30a20-96de-4e92-adcc-25f8570f95b5"
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "e486f6fc-8564-4234-b1f1-1d2aa673bb7c"
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
            },
            {
              "id": "4",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "72488196-b2e4-41a2-bec1-a70ecdfd1286"
            },
            {
              "id": "5",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "cd4ea078-1e27-4e19-b4df-d98ba418cafb"
            },
            {
              "id": "6",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "cd9d91eb-4524-49b6-9a3d-c6a50a5a795c"
            },
            {
              "id": "7",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "1e922a92-192a-4238-bde2-c96f4b9bbb58"
            },
            {
              "id": "8",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "242717f2-b173-4b2e-b438-e4dda1f3d7f8"
            },
            {
              "id": "9",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "0c7d19ad-e967-4ce4-9174-9bc33db08df6"
            },
            {
              "id": "10",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "a5acad4d-19c1-4399-b39d-5861ccae57e4"
            },
            {
              "id": "11",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "8bc975aa-b1cc-4f68-b1ea-7e4538ea5590"
            },
            {
              "id": "12",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "1bbc0521-7e22-47d7-b37c-0ab041ba175d"
            },
            {
              "id": "13",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "9a40403b-0ad5-4eee-91df-e1ee576e07a5"
            },
            {
              "id": "14",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "53e27bf2-1212-4a1f-8500-60ac5ce49d93"
            },
            {
              "id": "15",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "dc892441-10ae-4ff2-8ce0-29d647f316e3"
            },
            {
              "id": "16",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "fa7ce31b-476c-41c3-9804-767032028802"
            },
            {
              "id": "17",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "39e9c31c-52ae-4b5e-b8d5-e1bc37124be1"
            },
            {
              "id": "18",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "f30530c7-1424-4186-99ba-122a343d1f9d"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Test Hospital",
              "short_desc": "Expertise in every field with renowned staff.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Delhi",
              "code": "011"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "3rd, 7th & 9th Floor, Tower-L, Jeevan Bharati Building, Connaught Place, New Delhi, Delhi 110001"
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
