# 5.On status

`POST /teleconsulting/on_status`

Callback carrying the current status of a teleconsultation order.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/on_status \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_status",
    "timestamp": "2025-01-23T08:31:13.622657Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>",
    "message_id": "<TXN_ID>"
  },
  "message": {
    "order": {
      "id": "<TXN_ID>",
      "state": "CONFIRMED",
      "terms": [
        {
          "type": "Cancellation",
          "descriptor": {
            "name": "<NAME>",
            "short_desc": "Short description of cancellation terms",
            "long_desc": "Cancellation: Full refund if cancelled 48 hrs before consultation time. \n Rescheduling: No charges for rescheduling 48 hrs prior to consultation time."
          },
          "reasonRequired": false,
          "timePeriod": "2025-01-21T10:37:29.147Z",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Refund",
          "descriptor": {
            "name": "<NAME>",
            "short_desc": "Short description of refund terms",
            "long_desc": "No Show: If doctor does not show up - full refund. No refund if patient does not turn up for appointment"
          },
          "reasonRequired": false,
          "timePeriod": "2025-01-21T10:37:29.147Z",
          "reason": "",
          "termsState": "AGREED"
        },
        {
          "type": "Payment",
          "descriptor": {
            "name": "<NAME>",
            "short_desc": "Short description of paymet terms",
            "long_desc": "Long description of payment terms"
          },
          "reasonRequired": false,
          "timePeriod": "2025-01-21T10:37:29.147Z",
          "reason": "",
          "termsState": "AGREED"
        }
      ],
      "item": {
        "id": "1",
        "descriptor": {
          "code": "Consultation",
          "name": "<NAME>"
        },
        "price": {
          "currency": "INR",
          "value": "400"
        },
        "fulfillment_id": "<TXN_ID>"
      },
      "fulfillment": {
        "id": "<TXN_ID>",
        "type": "Online",
        "agent": {
          "id": "6733141611297598",
          "name": "<NAME>",
          "gender": "M",
          "image": "https://doctorlistingingestionpr.blob.core.windows.net/doctorprofilepic/doctor_male_1.png",
          "tags": {
            "@abdm/gov/in/education": "MBBS",
            "@abdm/gov/in/experience": "null",
            "@abdm/gov/in/languages": "English,Hindi",
            "@abdm/gov/in/hpr_id": "<EMAIL>"
          }
        },
        "start": {
          "time": {
            "timestamp": "2025-01-21T21:30:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2025-01-21T21:45:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "<TXN_ID>",
          "@abdm/gov.in/teleconsultation/uri": "https://t.bfhl.me/aXdvTS"
        }
      },
      "billing": {
        "name": "<NAME>",
        "address": {
          "area_code": "",
          "city": "",
          "country": "INDIA",
          "door": "",
          "locality": "",
          "state": "",
          "name": "<NAME>"
        },
        "phone": "<MOBILE>"
      },
      "quote": {
        "price": {
          "currency": "INR",
          "value": "400"
        },
        "breakup": [
          {
            "title": "Consultation",
            "price": {
              "currency": "INR",
              "value": "400"
            }
          },
          {
            "price": {
              "currency": "INR",
              "value": "0"
            },
            "title": "SGST @ 5%"
          },
          {
            "price": {
              "currency": "INR",
              "value": "0"
            },
            "title": "CGST @ 5%"
          },
          {
            "price": {
              "currency": "INR",
              "value": "0"
            },
            "title": "Registration"
          }
        ]
      },
      "customer": {
        "person": {
          "gender": "F",
          "dob": "<DATE_OF_BIRTH>",
          "dayOfBirth": 13,
          "monthOfBirth": 11,
          "yearOfBirth": 1995
        },
        "id": "tashu_1995@sbx"
      },
      "payment": {
        "uri": "https://rzp.io/rzp/37aBZqYa",
        "type": "ON-ORDER",
        "status": "PAID",
        "tl_method": "http/get",
        "params": {
          "transaction_id": "",
          "redirect_url": "https://uhieuasandbox.abdm.gov.in/on_paymentStatus",
          "amount": "400"
        }
      },
      "provider": {
        "id": "6733141613873079"
      }
    }
  }
}'
```
