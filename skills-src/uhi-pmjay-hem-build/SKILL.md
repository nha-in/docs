---
name: uhi-pmjay-hem-build
description: "Use when scaffolding UHI PM-JAY HEM hospital discovery: builds each journey as an observe-orient-decide-act loop against the sandbox."
---
# UHI PM-JAY HEM hospital discovery build

Scaffolds UHI PM-JAY HEM hospital discovery one journey at a time: finding PM-JAY empanelled hospitals by speciality, near a location or in a district.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### PM-JAY HEM hospital discovery (`uhi-pmjay-hem`)

**Before you start**

The EUA has a public HTTPS `consumer_uri`, a subscriber ID, and signs every call. Set `nic2004:85112`, `PMJAYHEM` and `PMJAY` exactly. Send a state, or GPS with all three radius fields.

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
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a",
    "timestamp": "2022-11-14T07:20:54.005277Z",
    "transaction_id": "dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "start": {
          "time": {
            "timestamp": "2022-07-22T13:21:41"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-22T23:59:59"
          }
        },
        "type": "PMJAYHEM"
      },
      "item": {
        "descriptor": {
          "code": "PMJAY",
          "name": "PMJAY",
          "flag": false
        }
      },
      "location": {
        "gps": "17.3787973,78.4368433",
        "radius": {
          "type": "CONSTANT",
          "value": "13.0",
          "unit": "km"
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
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a",
    "timestamp": "2022-11-14T07:20:54.005277Z",
    "transaction_id": "dfa04e10-63ec-11ed-9f98-49dd5c7c4d8a"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "start": {
          "time": {
            "timestamp": "2022-07-22T13:21:41"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-22T23:59:59"
          }
        },
        "type": "PMJAYHEM"
      },
      "item": {
        "descriptor": {
          "code": "PMJAY",
          "name": "PMJAY",
          "flag": false
        }
      },
      "location": {
        "gps": "17.3787973,78.4368433",
        "radius": {
          "type": "CONSTANT",
          "value": "13.0",
          "unit": "km"
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
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://100.65.158.41:8901/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "PMJAY HSPA",
        "images": "PMJAY logo IMAGE",
        "short_desc": "Pradhan Mantri Jan Arogya Yojana - Hospital Engagement Module",
        "long_desc": "PMJAY - HEM"
      },
      "providers": [
        {
          "id": "HOSP27G13867",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
            }
          }
        },
        {
          "id": "HOSP27G13869",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
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
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://100.65.158.41:8901/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "PMJAY HSPA",
        "images": "PMJAY logo IMAGE",
        "short_desc": "Pradhan Mantri Jan Arogya Yojana - Hospital Engagement Module",
        "long_desc": "PMJAY - HEM"
      },
      "providers": [
        {
          "id": "HOSP27G13867",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
            }
          }
        },
        {
          "id": "HOSP27G13869",
          "descriptor": {
            "name": "General Hospital Wardha",
            "short_desc": "State.",
            "long_desc": "Empanelled.",
            "symbol": "Hospital",
            "code": "G",
            "flag": false
          },
          "categories": [
            {
              "id": "1",
              "descriptor": {
                "name": "Cardiology",
                "code": 100002
              }
            },
            {
              "id": "2",
              "descriptor": {
                "name": "General Medicine",
                "code": 100005
              }
            }
          ],
          "fulfillments": [
            {
              "id": "1",
              "type": "Establishment Date",
              "start": {
                "time": {
                  "timestamp": "1915"
                }
              }
            },
            {
              "id": "2",
              "type": "Empaneled Date",
              "start": {
                "time": {
                  "timestamp": "2018-09-14 16:03:16.0"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "General Hospital Wardha"
            },
            "city": {
              "name": "ONGOLE",
              "code": "517001"
            },
            "district": {
              "name": "PRAKASAM",
              "code": "517"
            },
            "state": {
              "name": "Andhra Pradesh",
              "code": 28
            },
            "country": {
              "name": "INDIA",
              "code": 91
            },
            "gps": "15.497097,80.048688",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "contact": "<MOBILE_NUMBER>",
              "nodalOfficerNumber": "<MOBILE_NUMBER>"
            }
          }
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

An `on_search` arrives with your `transaction_id`, and each record in `catalog.providers[]` is one empanelled hospital.

From `uhi.flow.pmjay-hem-discovery`.

## Where the detail is

- The service: /docs/uhi/v1/services/pmjay-hem
- Every operation, with its body fields and responses: /docs/uhi/v1/api/network/pmjay-hem
