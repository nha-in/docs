---
name: uhi-notto-build
description: "Use when scaffolding UHI NOTTO hospital discovery: builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# UHI NOTTO hospital discovery build

Scaffolds UHI NOTTO hospital discovery one journey at a time: finding hospitals authorised for an organ or tissue transplant, by state.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### NOTTO hospital discovery (`uhi-notto`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `nic2004:86100`, `NOTTO_HOSPITAL` and `NOTTO`. Send an organ or tissue code from the master list. State is optional, and district needs state.

**Act: the calls in this journey, in order**

#### 1. Search through the Gateway (`uhi_network_gateway_search`)

This call is sent to the UHI Gateway.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-07-15T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "3",
          "name": "Kidney"
        }
      },
      "fulfillment": {
        "type": "NOTTO_HOSPITAL",
        "start": {
          "time": {
            "timestamp": "2026-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-07-15T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "NOTTO",
          "name": "NOTTO"
        }
      }
    }
  }
}'
```

#### 2. Search an HSPA (`uhi_network_search`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-07-15T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "3",
          "name": "Kidney"
        }
      },
      "fulfillment": {
        "type": "NOTTO_HOSPITAL",
        "start": {
          "time": {
            "timestamp": "2026-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-07-15T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "NOTTO",
          "name": "NOTTO"
        }
      }
    }
  }
}'
```

#### 3. Send a catalog through the Gateway (`uhi_network_gateway_on_search`)

This call is sent to the UHI Gateway.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2026-08-21T10:02:42",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "notto.hspa",
    "provider_uri": "https://notto.mohfw.gov.in/notto/integrationservice/uhi/transplant-retrieval-centres",
    "transaction_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606",
    "message_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "NOTTO",
        "images": "NOTTO image url",
        "flag": false,
        "short_desc": "National Organ And Tissue Transplant Organization"
      },
      "providers": [
        {
          "id": 6086143.1,
          "descriptor": {
            "name": "MEDANTA THE MEDICITY",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Pancreas",
                "code": "8",
                "flag": false
              }
            },
            {
              "id": "7",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "5",
              "descriptor": {
                "name": "Cornea",
                "code": "10",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Intestine",
                "code": "7",
                "flag": false
              }
            },
            {
              "id": "6",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2009"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "28.439161, 77.041129",
            "address": "<ADDRESS>",
            "district": {
              "name": "GURGAON"
            },
            "state": {
              "name": "HARYANA"
            }
          },
          "contact": {
            "phone": "0124-4141414",
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "0124-4141414",
              "website": ""
            }
          }
        },
        {
          "id": "24474288.1",
          "descriptor": {
            "name": "ZYDUS HOSPITALS AND HEALTHCARE RESEARCH PVT LTD",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2015"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "23.058744, 72.516632",
            "address": "<ADDRESS>",
            "district": {
              "name": "AHMADABAD"
            },
            "state": {
              "name": "GUJARAT"
            }
          },
          "contact": {
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "079-66190716",
              "website": ""
            }
          }
        }
      ]
    }
  }
}'
```

#### 4. Send a catalog to the EUA (`uhi_network_on_search`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2026-08-21T10:02:42",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "notto.hspa",
    "provider_uri": "https://notto.mohfw.gov.in/notto/integrationservice/uhi/transplant-retrieval-centres",
    "transaction_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606",
    "message_id": "58ae09a0-9d19-11f1-b423-c52fd9bd5606"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "NOTTO",
        "images": "NOTTO image url",
        "flag": false,
        "short_desc": "National Organ And Tissue Transplant Organization"
      },
      "providers": [
        {
          "id": 6086143.1,
          "descriptor": {
            "name": "MEDANTA THE MEDICITY",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Pancreas",
                "code": "8",
                "flag": false
              }
            },
            {
              "id": "7",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "5",
              "descriptor": {
                "name": "Cornea",
                "code": "10",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Intestine",
                "code": "7",
                "flag": false
              }
            },
            {
              "id": "6",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2009"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "28.439161, 77.041129",
            "address": "<ADDRESS>",
            "district": {
              "name": "GURGAON"
            },
            "state": {
              "name": "HARYANA"
            }
          },
          "contact": {
            "phone": "0124-4141414",
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "0124-4141414",
              "website": ""
            }
          }
        },
        {
          "id": "24474288.1",
          "descriptor": {
            "name": "ZYDUS HOSPITALS AND HEALTHCARE RESEARCH PVT LTD",
            "code": "Private",
            "flag": false
          },
          "categories": [
            {
              "id": "4",
              "descriptor": {
                "name": "Hand",
                "code": "15",
                "flag": false
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Heart",
                "code": "4",
                "flag": false
              }
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Kidney",
                "code": "3",
                "flag": false
              }
            },
            {
              "id": "0",
              "descriptor": {
                "name": "Liver",
                "code": "2",
                "flag": false
              }
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Lung",
                "code": "12",
                "flag": false
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Establishment Year",
              "start": {
                "time": {
                  "timestamp": "2015"
                }
              },
              "tags": {
                "transplant_centre": "true",
                "retrieval_centre": "true",
                "tissue_bank": "false",
                "cornea": "false"
              }
            }
          ],
          "location": {
            "city": {},
            "gps": "23.058744, 72.516632",
            "address": "<ADDRESS>",
            "district": {
              "name": "AHMADABAD"
            },
            "state": {
              "name": "GUJARAT"
            }
          },
          "contact": {
            "email": "<EMAIL>",
            "tags": {
              "nodal_officer_contact": "079-66190716",
              "website": ""
            }
          }
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

An `on_search` arrives with your `transaction_id`. Each hospital carries the four capability tags and the transplant coordinator's `contact.phone`.

From `uhi.flow.notto-discovery`.

## Where the detail is

- The service: /docs/uhi/v1/services/notto
- Every operation, with its body fields and responses: /docs/uhi/v1/api/network/notto
