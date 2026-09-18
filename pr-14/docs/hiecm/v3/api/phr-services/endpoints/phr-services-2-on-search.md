# 2. on_search

`POST /teleconsulting/on_search`

Callback carrying the teleconsultation providers and services that matched a search.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/on_search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
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
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
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
              "type": "Physical",
              "agent": {
                "id": "<EMAIL>",
                "image": "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",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov/in/experience": "10.0",
                  "@abdm/gov/in/languages": "Hindi, English",
                  "@abdm/gov/in/education": "MBBS, BDS",
                  "@abdm/gov/in/hpr_id": "<ABHA_NUMBER>"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2023-01-03T12:45:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Physical",
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
              },
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2023-01-03T12:45:00"
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
- `message.catalog` (object, required)
- `message.catalog.descriptor` (object, required)
- `message.catalog.descriptor.name` (string, required)
- `message.catalog.descriptor.images` (string, required)
- `message.catalog.descriptor.short_desc` (string, required)
- `message.catalog.descriptor.long_desc` (string, required)
- `message.catalog.providers` (object[], required)
- `message.catalog.providers.id` (string, required)
- `message.catalog.providers.descriptor` (object, required)
- `message.catalog.providers.categories` (object[], required)
- `message.catalog.providers.fulfillments` (object[], required)
- `message.catalog.providers.items` (object[], required)
- `message.catalog.providers.location` (object, required)

## Responses

- `200`: No response body is documented for this request.
