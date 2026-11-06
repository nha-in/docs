# Confirm the order

`POST /confirm`

Confirms the order by agreeing to the fullfillment terms

Sign this request first: [Signing](/docs/uhi/v1/concepts/signing).

```bash
curl --request POST \
  --url https://<provider_uri>/confirm \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "confirm",
    "timestamp": "2024-06-24T09:18:51.128672Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": " https: //uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": " https: //hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "ee219380-3213-11ef-8788-59590da7b6ce",
    "message_id": "ee219380-3213-11ef-8788-59590da7b6ce"
  },
  "message": {
    "order": {
      "id": "8673-410643-5926",
      "provider": {
        "id": "1"
      },
      "item": {
        "id": "0",
        "descriptor": {
          "name": "Consultation",
          "code": "CONSULTATION"
        },
        "price": {
          "currency": "INR",
          "value": "0.0"
        },
        "fulfillment_id": "654f28ee-f459-4fb7-b9f0-8b457453daf5"
      },
      "fulfillment": {
        "id": "654f28ee-f459-4fb7-b9f0-8b457453daf5",
        "type": "Online",
        "agent": {
          "id": "<HPR_ADDRESS>@hpr.ndhm",
          "name": "<NAME>",
          "image": "<BASE64_PHOTO>",
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
            "timestamp": "2024-06-24T16:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2024-06-24T16:15:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "654f28ee-f459-4fb7-b9f0-8b457453daf5"
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
          "name": "<NAME>",
          "locality": "<ADDRESS>",
          "state": "Telangana",
          "country": "INDIA",
          "area_code": "500067"
        },
        "email": "",
        "phone": "<MOBILE_NUMBER>"
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
            "title": "SGST @ 5%",
            "price": {
              "currency": "INR",
              "value": "0"
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
            "title": "Registration",
            "price": {
              "currency": "INR",
              "value": "0"
            }
          }
        ]
      },
      "customer": {
        "id": "<ABHA_ADDRESS>",
        "person": {
          "gender": "M",
          "dob": "<DOB>",
          "dayOfBirth": "<DOB>",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>",
          "tags": {
            "@abdm/gov.in/abha_number": "<ABHA_NUMBER>"
          }
        }
      },
      "payment": {
        "status": "NOT_PAID",
        "type": "PRE-ORDER",
        "params": {
          "transaction_id": "",
          "amount": "1000",
          "mode": "",
          "vpa": "",
          "redirect_url": "https: //uhieuasandbox.abdm.gov.in/on_paymentStatus"
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
- `message` (object, required)
- `message.order` (object, required)
- `message.order.provider` (object)
- `message.order.provider.id` (object)
- `message.order.state` (object)
- `message.order.items` (object[])
- `message.order.items.id` (object, required)
- `message.order.items.quantity` (object)
- `message.order.items.fulfillment_id` (object)
- `message.order.billing` (object)
- `message.order.fulfillment` (object)

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
