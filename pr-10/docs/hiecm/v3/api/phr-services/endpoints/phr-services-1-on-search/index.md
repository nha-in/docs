# 1. on_search

`POST /api/teleconsulting/on_search`

Callback carrying the teleconsultation providers and services that matched a search.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/teleconsulting/on_search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:080",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://100.65.158.41:8901/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>",
    "message_id": "e9"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "<NAME>",
        "images": "HSPA IMAGE",
        "short_desc": "Reference HSPA Test hospital",
        "long_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."
      },
      "providers": [
        {
          "id": "1",
          "descriptor": {
            "name": "<NAME>",
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "1",
              "parent_category_id": "101",
              "descriptor": {
                "name": "<NAME>",
                "code": "CARDIOLOGY"
              }
            },
            {
              "id": "101",
              "descriptor": {
                "name": "<NAME>",
                "code": "ALLOPATHY"
              }
            },
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "<NAME>",
                "code": "GENERAL MEDICINE, PHARMACY, DENTAL SURGERY"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Online",
              "agent": {
                "id": "<EMAIL>",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov/in/experience": "10.0",
                  "@abdm/gov/in/languages": "Hindi, English",
                  "@abdm/gov/in/education": "MBBS, BDS",
                  "@abdm/gov/in/hpr_id": "<ABHA_NUMBER>"
                }
              }
            },
            {
              "id": "1",
              "type": "Online",
              "agent": {
                "id": "<EMAIL>",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov/in/experience": "5.0",
                  "@abdm/gov/in/languages": "Eng, Hin",
                  "@abdm/gov/in/education": "MBBS",
                  "@abdm/gov/in/hpr_id": "<ABHA_NUMBER>"
                }
              }
            }
          ],
          "items": [
            {
              "id": "0",
              "descriptor": {
                "name": "<NAME>"
              },
              "price": {
                "currency": "INR",
                "value": "20.0"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            },
            {
              "id": "1",
              "descriptor": {
                "name": "<NAME>"
              },
              "price": {
                "currency": "INR",
                "value": "300.0"
              },
              "category_id": "1",
              "fulfillment_id": "1"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "<NAME>",
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
        }
      ]
    }
  }
}'
```
