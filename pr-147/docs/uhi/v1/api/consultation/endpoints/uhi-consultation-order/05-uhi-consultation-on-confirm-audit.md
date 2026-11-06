# Copy on_confirm to the Gateway audit

`POST /api/v1/uhi/on_confirm_audit`

Accepter for all the on_confirm_audit response from the HSPAs

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

Retry behaviour: not yet published.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_confirm_audit \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_confirm_audit",
    "timestamp": "2026-06-18T06:52:13.969464Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https: //uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "f1a1a6b2-ece2-46a0-8229-9e8b5610afcc",
    "message_id": "f1a1a6b2-ece2-46a0-8229-9e8b5610afcc"
  },
  "message": {
    "order": {
      "id": "3714-330853-9384",
      "provider": {
        "id": "1",
        "descriptor": {
          "name": "Test Hospital",
          "flag": false,
          "short_desc": "Expertise in every field with renowned staff.",
          "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
        },
        "categories": [
          {
            "id": "201",
            "parent_category_id": "101",
            "descriptor": {
              "name": "Cardiology",
              "code": "CARDIOLOGY",
              "flag": false
            }
          },
          {
            "id": "101",
            "parent_category_id": "",
            "descriptor": {
              "name": "Allopathy",
              "code": "ALLOPATHY",
              "flag": false
            }
          }
        ],
        "location": {
          "id": "1",
          "descriptor": {
            "name": "Test Hospital",
            "flag": false,
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
      },
      "state": "CONFIRMED",
      "item": {
        "id": "0",
        "descriptor": {
          "name": "Consultation",
          "code": "CONSULTATION",
          "flag": false
        },
        "price": {
          "currency": "INR",
          "value": "0.0"
        },
        "fulfillment_id": "79db6b5b-afe4-4297-b9b1-5148ed45372c"
      },
      "fulfillment": {
        "id": "79db6b5b-afe4-4297-b9b1-5148ed45372c",
        "type": "Physical",
        "tracking": false,
        "agent": {
          "id": "<HPR_ADDRESS>@hpr.ndhm",
          "name": "<NAME>",
          "image": "8+pftJAweP4Qf516iSSsjzm76sAvHuaXBAFLgjjOfwpDnJwaoQDIP8A9bpU6SOhyCfwqvtJOeKepJzgnH6UAU93cc0gcnj+tNJXPfNOJx+FAAWPTI6UFj1x+VJkY+7n6U0MOfl5oAmDEEds0pIcbehHIb0qNW78gU4jcvGOOlADNuTzwR/n/P8A9enxs0bAhtpB4IP+f/1GgfOcbsEcZFKEOQuMjvj/AD9PypAb+iTz32p2loVllV5QHSIMzbQctgLk9Aa9K0vwBBrD3EsWpmFFnkjWJ4n3AKxHILg9u9eeeBZIbfxlYyzMVjxOhI7FoXA/U4/GvZTr58M+C11R40aa8kMkanO3fJuk5IHQDcffGMjOa468E5aI6adRqO5HJ8LdN8ooZS4zjLGXPT1WQe35Vjn4faYtxPpys8UKpGUcQTnYXLDPL4wCAefx9ao+Hvilqtz4qjtNTED29zMsIWFdoibdg",
          "gender": "M",
          "tags": {
            "@abdm/gov.in/experience": "5.0",
            "@abdm/gov.in/languages": "Eng, Hin",
            "@abdm/gov.in/education": "MBBS",
            "@abdm/gov.in/hpr_id": "<HPR_ID>"
          }
        },
        "start": {
          "time": {
            "timestamp": "2026-06-18T16:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-18T16:30:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "79db6b5b-afe4-4297-b9b1-5148ed45372c",
          "@abdm/gov.in/messaging_support": "true",
          "@abdm/gov.in/deep_link": "",
          "@abdm/gov.in/helpline_number": "",
          "@abdm/gov.in/chatbot_link": ""
        }
      },
      "billing": {
        "name": "<NAME>",
        "address": {
          "door": "",
          "name": "<NAME>",
          "locality": "<ADDRESS>",
          "city": "Pune",
          "state": "Maharashtra",
          "country": "INDIA",
          "area_code": "411058"
        },
        "phone": "<MOBILE_NUMBER>",
        "email": ""
      },
      "quote": {
        "price": {
          "currency": "INR",
          "value": "0.0"
        },
        "breakup": [
          {
            "title": "Consultation",
            "price": {
              "currency": "INR",
              "value": "0.0"
            }
          },
          {
            "title": "CGST @ 5%",
            "price": {
              "currency": "INR",
              "value": "0.0"
            }
          },
          {
            "title": "SGST @ 5%",
            "price": {
              "currency": "INR",
              "value": "0.0"
            }
          },
          {
            "title": "Registration",
            "price": {
              "currency": "INR",
              "value": "0"
            }
          }
        ]
      },
      "customer": {
        "person": {
          "dob": "<DOB>",
          "gender": "M",
          "dayOfBirth": "<DOB>",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>",
          "tags": {
            "@abdm/gov.in/abha_number": "<ABHA_NUMBER>"
          }
        },
        "id": "<ABHA_ADDRESS>"
      },
      "payment": {
        "uri": "",
        "type": "ON-ORDER",
        "status": "FREE",
        "params": {
          "transaction_id": "",
          "amount": "0.0",
          "mode": "",
          "vpa": "",
          "redirect_url": ""
        }
      },
      "terms": [
        {
          "type": "Commercial",
          "descriptor": {
            "name": "Commercial terms and conditions",
            "flag": false,
            "short_desc": "Short description of commercial terms",
            "long_desc": "Long description of commercial terms"
          },
          "reasonRequired": false,
          "timePeriod": "2026-06-18T16:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Settlement",
          "descriptor": {
            "name": "Settlement terms and conditions",
            "flag": false,
            "short_desc": "Short description of Settlement terms",
            "long_desc": "Long description of Settlement terms"
          },
          "reasonRequired": false,
          "timePeriod": "2026-06-18T16:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Cancellation",
          "descriptor": {
            "name": "Cancellation terms and conditions",
            "flag": false,
            "short_desc": "Short description of Cancellation terms",
            "long_desc": "Cancellation: Full refund if cancelled 48 hrs before consultation time. \\n Rescheduling: No charges for rescheduling 48 hrs prior to consultation time"
          },
          "reasonRequired": false,
          "timePeriod": "2026-06-18T16:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Refund",
          "descriptor": {
            "name": "Refund terms and conditions",
            "flag": false,
            "short_desc": "Short description of Refund terms",
            "long_desc": "No Show: If doctor does not show up - full refund. No refund if patient does not turn up for appointment"
          },
          "reasonRequired": false,
          "timePeriod": "2026-06-18T16:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Payment",
          "descriptor": {
            "name": "Payment terms and conditions",
            "flag": false,
            "short_desc": "Short description of Payment terms",
            "long_desc": "Long description of Payment terms"
          },
          "reasonRequired": false,
          "timePeriod": "2026-06-18T16:00:00",
          "reason": "",
          "termsState": "AGREED"
        }
      ],
      "authorization": {
        "type": "PIN",
        "token": "3774",
        "valid_from": "2026-06-18T00:00:00",
        "valid_to": "2026-06-18T23:59:00",
        "status": "GENERATED"
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
- `message.order.id` (object)
- `message.order.provider` (object)
- `message.order.provider.id` (object)
- `message.order.state` (object, required)
- `message.order.item` (object)
- `message.order.item.id` (object)
- `message.order.item.descriptor` (object)
- `message.order.fulfillment` (object)
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
