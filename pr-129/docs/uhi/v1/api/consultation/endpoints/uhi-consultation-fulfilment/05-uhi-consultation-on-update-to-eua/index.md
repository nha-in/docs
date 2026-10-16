# Send an order update to the EUA

`POST /on_update`

Order status update API between consumer and provider
***(Both HSPA and EUA will be consuming the same on_update API)***

The header Authorisation is passed by HSPA to EUA

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

Retry behaviour: not yet published.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_update \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_update",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35.481906",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "id": "8441-696786-1042",
      "state": "APPOINTMENT_STARTED",
      "item": {
        "id": "1",
        "descriptor": {
          "code": "Consultation",
          "name": "Consultation"
        }
      },
      "fulfillment": {
        "id": "d680dd36-1d0d-43c6-96c4-dec0f06008ea",
        "type": "Physical",
        "agent": {
          "id": "<HPR_ADDRESS>@hpr.ndhm",
          "name": "<NAME>",
          "gender": "F",
          "tags": {
            "@abdm/gov.in/education": "MBBS,MS",
            "@abdm/gov.in/experience": "15.0",
            "@abdm/gov.in/languages": "English, Hindi, Marathi",
            "@abdm/gov.in/hpr_id": "<HPR_ID>",
            "@abdm/gov.in/hfr_id": "<HPR_ID>",
            "@abdm/gov.in/hip_id": "IN2910000074"
          }
        },
        "start": {
          "time": {
            "timestamp": "2022-09-15T15:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-09-15T15:15:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "d680dd36-1d0d-43c6-96c4-dec0f06008ea",
          "@abdm/gov.in/messaging_support": "true",
          "@abdm/gov.in/deep_link": "",
          "@abdm/gov.in/helpline_number": "",
          "@abdm/gov.in/chatbot_link": ""
        }
      },
      "terms": [
        {
          "type": "Commercial",
          "descriptor": {
            "name": "Commercial terms and conditions",
            "short_desc": "Short description of commercial terms",
            "long_desc": "Long descripiton of commercial terms"
          },
          "reasonRequired": false,
          "timePeriod": "2024-11-12T09:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Settlement",
          "descriptor": {
            "name": "Settlement terms and conditions",
            "short_desc": "Short description of settlement terms",
            "long_desc": "Long descripiton of settlement terms"
          },
          "reasonRequired": false,
          "timePeriod": "2024-11-12T09:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Cancellation",
          "descriptor": {
            "name": "Cancellation terms and conditions",
            "short_desc": "Short description of cancellation terms",
            "long_desc": "Long descripiton of cancellation terms"
          },
          "reasonRequired": false,
          "timePeriod": "2024-11-12T09:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Refund",
          "descriptor": {
            "name": "Refund terms and conditions",
            "short_desc": "Short description of refund terms",
            "long_desc": "Long descripiton of refund terms"
          },
          "reasonRequired": false,
          "timePeriod": "2024-11-12T09:00:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Payment",
          "descriptor": {
            "name": "Payment terms and conditions",
            "short_desc": "Short description of payment terms",
            "long_desc": "Long descripiton of payment terms"
          },
          "reasonRequired": false,
          "timePeriod": "2024-11-12T09:00:00",
          "reason": "",
          "termsState": "AGREED"
        }
      ],
      "billing": {
        "name": "<NAME>",
        "address": {
          "door": "",
          "name": " Flat no. 702, C Wing, The One Society Siddhivinayak Vihar Bhugaon, bavdhan Pirangut",
          "locality": "",
          "city": "Pune",
          "state": "Maharashtra",
          "country": "INDIA",
          "area_code": "412115"
        },
        "email": "<EMAIL>",
        "phone": "<MOBILE_NUMBER>"
      },
      "payment": {
        "uri": "",
        "type": "ON-ORDER",
        "status": "PAID",
        "tl_method": "",
        "params": {
          "transaction_id": "",
          "amount": "1000",
          "mode": "",
          "vpa": "",
          "redirect_url": ""
        }
      },
      "quote": {
        "price": {
          "currency": "INR",
          "value": "1000"
        },
        "breakup": [
          {
            "title": "Consultation",
            "price": {
              "currency": "INR",
              "value": "1000"
            }
          },
          {
            "title": "CGST @ 5%",
            "price": {
              "currency": "INR",
              "value": "0"
            }
          },
          {
            "title": "SGST @ 5%",
            "price": {
              "currency": "INR",
              "value": "0"
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
      "authorization": {
        "type": "PIN",
        "token": 1234,
        "valid_from": "2024-06-24T00:00:00",
        "valid_to": "2024-06-24T23:59:00",
        "status": "VERIFIED/HSPAOVERRIDE"
      },
      "customer": {
        "person": {
          "gender": "M",
          "dob": "<DOB>",
          "dayOfBirth": "<DOB>",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>",
          "tags": {
            "@abdm/gov.in/abha_number": "<ABHA_NUMBER>"
          }
        },
        "id": "<ABHA_ADDRESS>"
      },
      "provider": {
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
- `message` (object)
- `message.order` (object, required)
- `message.order.id` (object)
- `message.order.provider` (object)
- `message.order.provider.id` (object)
- `message.order.state` (object)
- `message.order.items` (object[])
- `message.order.items.id` (object)
- `message.order.items.quantity` (object)
- `message.order.billing` (object)
- `message.order.fulfillment` (object)
- `message.order.quote` (object)
- `message.order.payment` (object)
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
