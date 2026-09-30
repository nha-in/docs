## Before the first journey

Register on the network before the first call. Each step below comes from the sandbox page; the first journey cannot pass until all four hold.

### Express intent to join UHI

Tell your [NHA](/docs/uhi/v1/getting-started/glossary#nha) point of contact
which service you want to integrate, and in which role.
[Services](/docs/uhi/v1/services) lists the six, and which roles each one is
open to.

**You get:** the onboarding kick-off.

From `uhi.sandbox.express-intent`.

### Generate your UHI key pair

Clone the
[Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility)
and run it. It generates your Ed25519 key pair, and later signs each payload
for you, so you do not implement Ed25519 and BLAKE-512 from scratch.

Keep the private key on your server. You share only the public key.

**You get:** a public key and a private key. See [Signing](/docs/uhi/v1/concepts/signing).

From `uhi.sandbox.key-pair`.

### Register in the UHI sandbox

Submit the sandbox registration form with three things:

| Field | What to give |
| --- | --- |
| Role | EUA or HSPA |
| Callback URL | Your public HTTPS `consumer_uri`, or `provider_uri` for an HSPA |
| Public key | The public half of the key pair from step 2 |

**You get:** a subscriber ID, a public key ID and sandbox access. The utility
signs with both IDs, so keep them.

From `uhi.sandbox.registration-form`.

### UHI Gateway base URLs for sandbox and production

| Environment | [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) base URL | Reference apps |
| --- | --- | --- |
| Sandbox | `https://uhigatewaysandbox.abdm.gov.in` | Reference EUA `http://uhieuasandbox.abdm.gov.in/api/v1/euaService`; reference HSPA `https://hspasbx.abdm.gov.in/api/v1/hspa` |
| Production | `https://uhigateway.abdm.gov.in` | Your own production endpoints |

A third host, `https://uhigatewaybeta.abdm.gov.in`, is for use only when asked
at onboarding. [Routes](/docs/uhi/v1/concepts/routes#gateway-endpoints) lists
every Gateway endpoint under these hosts.

From `uhi.sandbox.base-urls`.


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
- Every operation, with its body fields and responses: /docs/uhi/v1/api/network
