# 7.on_update

`POST /teleconsulting/on_update`

Callback carrying the provider's reply to a teleconsultation update.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/on_update \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_update",
    "timestamp": "2025-10-15T06:31:05.168137Z",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/teleconsulting",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>",
    "message_id": "<TXN_ID>"
  },
  "message": {
    "order": {
      "id": "1481-367013-4819",
      "provider": {
        "id": "1",
        "descriptor": {
          "name": "<NAME>",
          "flag": false,
          "short_desc": "Expertise in every field with renowned staff.",
          "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
        },
        "categories": [
          {
            "id": "201",
            "parent_category_id": "101",
            "descriptor": {
              "name": "<NAME>",
              "code": "CARDIOLOGY",
              "flag": false
            }
          },
          {
            "id": "101",
            "parent_category_id": "",
            "descriptor": {
              "name": "<NAME>",
              "code": "ALLOPATHY",
              "flag": false
            }
          }
        ],
        "location": {
          "id": "1",
          "descriptor": {
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "city": {
            "name": "<NAME>",
            "code": "011"
          },
          "country": {
            "name": "<NAME>",
            "code": "+91"
          },
          "gps": "18.5246036,73.792927",
          "address": "<ADDRESS>"
        }
      },
      "state": "COMPLETED",
      "item": {
        "id": "0",
        "descriptor": {
          "name": "<NAME>",
          "code": "CONSULTATION",
          "flag": false
        },
        "price": {
          "currency": "INR",
          "value": "0.0"
        },
        "fulfillment_id": "<TXN_ID>"
      },
      "fulfillment": {
        "id": "<TXN_ID>",
        "type": "Physical",
        "agent": {
          "id": "<EMAIL>",
          "name": "<NAME>",
          "image": "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",
          "gender": "M",
          "tags": {
            "@abdm/gov.in/experience": "5.0",
            "@abdm/gov.in/languages": "English, Hindi",
            "@abdm/gov.in/education": "MBBS",
            "@abdm/gov.in/hpr_id": "<ABHA_NUMBER>"
          }
        },
        "start": {
          "time": {
            "timestamp": "2025-10-15T17:50:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2025-10-15T18:10:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "<TXN_ID>",
          "@abdm/gov.in/doctors_key": "<@ABDM/GOV.IN/DOCTORS_KEY>"
        }
      },
      "billing": {
        "name": "<NAME>",
        "address": {
          "name": "<NAME>",
          "locality": "Flat 12, Sample Street",
          "city": "JALGAON",
          "state": "MAHARASHTRA",
          "country": "INDIA",
          "area_code": "424101"
        },
        "phone": "<MOBILE>"
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
        "id": "ganesh2305@sbx",
        "person": {
          "gender": "M",
          "dayOfBirth": 23,
          "monthOfBirth": 5,
          "yearOfBirth": 1992,
          "dob": "<DATE_OF_BIRTH>"
        }
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
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Short description of commercial terms",
            "long_desc": "Long description of commercial terms"
          },
          "reasonRequired": false,
          "timePeriod": "2025-10-15T17:50:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Settlement",
          "descriptor": {
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Short description of Settlement terms",
            "long_desc": "Long description of Settlement terms"
          },
          "reasonRequired": false,
          "timePeriod": "2025-10-15T17:50:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Cancellation",
          "descriptor": {
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Short description of Cancellation terms",
            "long_desc": "Cancellation: Full refund if cancelled 48 hrs before consultation time. n Rescheduling: No charges for rescheduling 48 hrs prior to consultation time"
          },
          "reasonRequired": false,
          "timePeriod": "2025-10-15T17:50:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Refund",
          "descriptor": {
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Short description of Refund terms",
            "long_desc": "No Show: If doctor does not show up - full refund. No refund if patient does not turn up for appointment"
          },
          "reasonRequired": false,
          "timePeriod": "2025-10-15T17:50:00",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Payment",
          "descriptor": {
            "name": "<NAME>",
            "flag": false,
            "short_desc": "Short description of Payment terms",
            "long_desc": "Long description of Payment terms"
          },
          "reasonRequired": false,
          "timePeriod": "2025-10-15T17:50:00",
          "reason": "",
          "termsState": "AGREED"
        }
      ],
      "authorization": {
        "type": "PIN",
        "token": "<TOKEN>",
        "valid_from": "2025-10-15T00:00:00",
        "valid_to": "2025-10-15T23:59:00",
        "status": "GENERATED"
      }
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from `POST /api/hiecm/gateway/v3/sessions`.

## Body

- `context` (object, required)
- `context.domain` (string, required)
- `context.country` (string, required)
- `context.city` (string, required)
- `context.action` (string, required)
- `context.timestamp` (string, required)
- `context.core_version` (string, required)
- `context.consumer_id` (string, required)
- `context.consumer_uri` (string, required)
- `context.provider_id` (string, required)
- `context.provider_uri` (string, required)
- `context.transaction_id` (string, required)
- `context.message_id` (string, required)
- `message` (object, required)
- `message.order` (object, required)
- `message.order.id` (string, required)
- `message.order.provider` (object, required)
- `message.order.provider.id` (string, required)
- `message.order.provider.descriptor` (object, required)
- `message.order.provider.categories` (object[], required)
- `message.order.provider.location` (object, required)
- `message.order.state` (string, required)
- `message.order.item` (object, required)
- `message.order.item.id` (string, required)
- `message.order.item.descriptor` (object, required)
- `message.order.item.price` (object, required)
- `message.order.item.fulfillment_id` (string, required)
- `message.order.fulfillment` (object, required)
- `message.order.fulfillment.id` (string, required)
- `message.order.fulfillment.type` (string, required)
- `message.order.fulfillment.agent` (object, required)
- `message.order.fulfillment.start` (object, required)
- `message.order.fulfillment.end` (object, required)
- `message.order.fulfillment.tags` (object, required)
- `message.order.billing` (object, required)
- `message.order.billing.name` (string, required)
- `message.order.billing.address` (object, required)
- `message.order.billing.phone` (string, required)
- `message.order.quote` (object, required)
- `message.order.quote.price` (object, required)
- `message.order.quote.breakup` (object[], required)
- `message.order.customer` (object, required)
- `message.order.customer.id` (string, required)
- `message.order.customer.person` (object, required)
- `message.order.payment` (object, required)
- `message.order.payment.uri` (string, required)
- `message.order.payment.type` (string, required)
- `message.order.payment.status` (string, required)
- `message.order.payment.params` (object, required)
- `message.order.terms` (object[], required)
- `message.order.terms.type` (string, required)
- `message.order.terms.descriptor` (object, required)
- `message.order.terms.reasonRequired` (boolean, required)
- `message.order.terms.timePeriod` (string, required)
- `message.order.terms.reason` (string, required)
- `message.order.terms.termsState` (string, required)
- `message.order.authorization` (object, required)
- `message.order.authorization.type` (string, required)
- `message.order.authorization.token` (string, required)
- `message.order.authorization.valid_from` (string, required)
- `message.order.authorization.valid_to` (string, required)
- `message.order.authorization.status` (string, required)

## Responses

- `200`: No response body is documented for this request.
