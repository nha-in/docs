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


# UHI Physical Consultation build

Scaffolds UHI Physical Consultation one journey at a time: finding a doctor near the patient, booking a slot, checking in with the PIN, and cancelling or messaging afterwards.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Discovery (`uhi-consultation-discovery`)

**Before you start**

The EUA has a public HTTPS `consumer_uri`, signs every call, and uses a fresh `transaction_id` per search. Set `context.domain` to `nic2004:85111` and the fulfillment type to `Physical`, which is case sensitive.

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
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "CARDIOLOGY",
          "name": "CARDIOLOGY"
        }
      },
      "fulfillment": {
        "agent": {
          "name": "ganesh"
        },
        "type": "Physical",
        "start": {
          "time": {
            "timestamp": "2022-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-16T00:00:00"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "Consultation",
          "name": "Consultation"
        }
      },
      "location": {
        "gps": "12.423423,77.325647",
        "radius": {
          "type": "CONSTANT",
          "value": "5",
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
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "CARDIOLOGY",
          "name": "CARDIOLOGY"
        }
      },
      "fulfillment": {
        "agent": {
          "name": "ganesh"
        },
        "type": "Physical",
        "start": {
          "time": {
            "timestamp": "2022-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-16T00:00:00"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "Consultation",
          "name": "Consultation"
        }
      },
      "location": {
        "gps": "12.423423,77.325647",
        "radius": {
          "type": "CONSTANT",
          "value": "5",
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
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Ref HSPA",
        "images": "HSPA IMAGE",
        "short_desc": "Reference HSPA Test hospital",
        "long_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."
      },
      "providers": [
        {
          "id": "1",
          "descriptor": {
            "name": "Test Hospital",
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "Cardiology",
                "code": "CARDIOLOGY"
              }
            },
            {
              "id": "101",
              "descriptor": {
                "name": "Allopathy",
                "code": "ALLOPATHY"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Physical",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/experience": "10.0",
                  "@abdm/gov.in/languages": "Hindi, English",
                  "@abdm/gov.in/education": "MBBS, BDS",
                  "@abdm/gov.in/hpr_id": "<HPR_ID>",
                  "@abdm/gov.in/hfr_id": "<HPR_ID>",
                  "@abdm/gov.in/hip_id": "IN2910000074"
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
                "name": "Consultation"
              },
              "price": {
                "currency": "INR",
                "value": "300.0"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Test Hospital",
              "short_desc": "Expertise in every field with renowned staff.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Delhi",
              "code": "011"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "3rd, 7th & 9th Floor, Tower-L, Jeevan Bharati Building, Connaught Place, New Delhi, Delhi 110001"
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
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2022-07-05T15:24:35",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Ref HSPA",
        "images": "HSPA IMAGE",
        "short_desc": "Reference HSPA Test hospital",
        "long_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."
      },
      "providers": [
        {
          "id": "1",
          "descriptor": {
            "name": "Test Hospital",
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "Cardiology",
                "code": "CARDIOLOGY"
              }
            },
            {
              "id": "101",
              "descriptor": {
                "name": "Allopathy",
                "code": "ALLOPATHY"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "Physical",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/experience": "10.0",
                  "@abdm/gov.in/languages": "Hindi, English",
                  "@abdm/gov.in/education": "MBBS, BDS",
                  "@abdm/gov.in/hpr_id": "<HPR_ID>",
                  "@abdm/gov.in/hfr_id": "<HPR_ID>",
                  "@abdm/gov.in/hip_id": "IN2910000074"
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
                "name": "Consultation"
              },
              "price": {
                "currency": "INR",
                "value": "300.0"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Test Hospital",
              "short_desc": "Expertise in every field with renowned staff.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Delhi",
              "code": "011"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "3rd, 7th & 9th Floor, Tower-L, Jeevan Bharati Building, Connaught Place, New Delhi, Delhi 110001"
          }
        }
      ]
    }
  }
}'
```

#### 5. Search the chosen HSPA for slots (`uhi_network_search`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "timestamp": "2024-06-25T05:01:39.587857Z",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "intent": {
      "provider": {
        "id": "1",
        "categories": [
          {
            "id": "201",
            "parent_category_id": "101",
            "descriptor": {
              "name": "Cardiology",
              "code": "CARDIOLOGY"
            }
          },
          {
            "id": "101",
            "descriptor": {
              "name": "ALLOPATHY",
              "code": "ALLOPATHY"
            }
          }
        ],
        "fulfillments": [
          {
            "type": "Online",
            "agent": {
              "id": "<HPR_ADDRESS>@hpr.ndhm",
              "image": null
            },
            "start": {
              "time": {
                "timestamp": "2024-06-25T10:30:27"
              }
            },
            "end": {
              "time": {
                "timestamp": "2024-06-25T23:59:59"
              }
            }
          }
        ],
        "items": [
          {
            "id": "1",
            "descriptor": {
              "name": "Consultation",
              "code": "CONSULTATION"
            },
            "price": {
              "currency": "INR",
              "value": "0.0"
            },
            "fulfillment_id": "1",
            "category_id": "201"
          }
        ]
      }
    }
  }
}'
```

#### 6. Send the doctor's slots (`uhi_network_on_search`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2024-06-25T05:01:39.587857Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "Ref HSPA",
        "short_desc": "Reference HSPA Test hospital",
        "long_desc": "Expert institution providing patient treatment with specialized health science and auxiliary healthcare staff and extraordinary medical equipments."
      },
      "providers": [
        {
          "id": "1",
          "descriptor": {
            "name": "Test Hospital",
            "short_desc": "Expertise in every field with renowned staff.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "fulfillments": [
            {
              "id": "21ddefb0-fc52-4837-959a-d79b100013c4",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T12:30:00"
                }
              }
            },
            {
              "id": "48f30a20-96de-4e92-adcc-25f8570f95b5",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T12:45:00"
                }
              }
            },
            {
              "id": "e486f6fc-8564-4234-b1f1-1d2aa673bb7c",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T12:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:00:00"
                }
              }
            },
            {
              "id": "db07e802-4091-4b83-bbe4-39e231743aa3",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:15:00"
                }
              }
            },
            {
              "id": "72488196-b2e4-41a2-bec1-a70ecdfd1286",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:30:00"
                }
              }
            },
            {
              "id": "cd4ea078-1e27-4e19-b4df-d98ba418cafb",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T13:45:00"
                }
              }
            },
            {
              "id": "cd9d91eb-4524-49b6-9a3d-c6a50a5a795c",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T13:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:00:00"
                }
              }
            },
            {
              "id": "1e922a92-192a-4238-bde2-c96f4b9bbb58",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:15:00"
                }
              }
            },
            {
              "id": "242717f2-b173-4b2e-b438-e4dda1f3d7f8",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:30:00"
                }
              }
            },
            {
              "id": "0c7d19ad-e967-4ce4-9174-9bc33db08df6",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T14:45:00"
                }
              }
            },
            {
              "id": "a5acad4d-19c1-4399-b39d-5861ccae57e4",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T14:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:00:00"
                }
              }
            },
            {
              "id": "8bc975aa-b1cc-4f68-b1ea-7e4538ea5590",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:15:00"
                }
              }
            },
            {
              "id": "1bbc0521-7e22-47d7-b37c-0ab041ba175d",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:30:00"
                }
              }
            },
            {
              "id": "9a40403b-0ad5-4eee-91df-e1ee576e07a5",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T15:45:00"
                }
              }
            },
            {
              "id": "53e27bf2-1212-4a1f-8500-60ac5ce49d93",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T15:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:00:00"
                }
              }
            },
            {
              "id": "dc892441-10ae-4ff2-8ce0-29d647f316e3",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:00:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:15:00"
                }
              }
            },
            {
              "id": "fa7ce31b-476c-41c3-9804-767032028802",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:15:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:30:00"
                }
              }
            },
            {
              "id": "39e9c31c-52ae-4b5e-b8d5-e1bc37124be1",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:30:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T16:45:00"
                }
              }
            },
            {
              "id": "f30530c7-1424-4186-99ba-122a343d1f9d",
              "type": "Online",
              "agent": {
                "id": "<HPR_ADDRESS>@hpr.ndhm",
                "name": "<NAME>",
                "gender": "M",
                "tags": {
                  "@abdm/gov.in/education": "MBBS",
                  "@abdm/gov.in/experience": "5.0",
                  "@abdm/gov.in/hpr_id": "<HPR_ADDRESS>@hpr.ndhm",
                  "@abdm/gov.in/languages": "Eng, Hin"
                }
              },
              "start": {
                "time": {
                  "timestamp": "2024-06-25T16:45:00"
                }
              },
              "end": {
                "time": {
                  "timestamp": "2024-06-25T17:00:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "0",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "21ddefb0-fc52-4837-959a-d79b100013c4"
            },
            {
              "id": "1",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "48f30a20-96de-4e92-adcc-25f8570f95b5"
            },
            {
              "id": "2",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "e486f6fc-8564-4234-b1f1-1d2aa673bb7c"
            },
            {
              "id": "3",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
            },
            {
              "id": "4",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "72488196-b2e4-41a2-bec1-a70ecdfd1286"
            },
            {
              "id": "5",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "cd4ea078-1e27-4e19-b4df-d98ba418cafb"
            },
            {
              "id": "6",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "cd9d91eb-4524-49b6-9a3d-c6a50a5a795c"
            },
            {
              "id": "7",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "1e922a92-192a-4238-bde2-c96f4b9bbb58"
            },
            {
              "id": "8",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "242717f2-b173-4b2e-b438-e4dda1f3d7f8"
            },
            {
              "id": "9",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "0c7d19ad-e967-4ce4-9174-9bc33db08df6"
            },
            {
              "id": "10",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "a5acad4d-19c1-4399-b39d-5861ccae57e4"
            },
            {
              "id": "11",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "8bc975aa-b1cc-4f68-b1ea-7e4538ea5590"
            },
            {
              "id": "12",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "1bbc0521-7e22-47d7-b37c-0ab041ba175d"
            },
            {
              "id": "13",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "9a40403b-0ad5-4eee-91df-e1ee576e07a5"
            },
            {
              "id": "14",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "53e27bf2-1212-4a1f-8500-60ac5ce49d93"
            },
            {
              "id": "15",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "dc892441-10ae-4ff2-8ce0-29d647f316e3"
            },
            {
              "id": "16",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "fa7ce31b-476c-41c3-9804-767032028802"
            },
            {
              "id": "17",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "39e9c31c-52ae-4b5e-b8d5-e1bc37124be1"
            },
            {
              "id": "18",
              "descriptor": {
                "name": "Consultation",
                "code": "CONSULTATION"
              },
              "price": {
                "currency": "INR",
                "value": "0.0"
              },
              "fulfillment_id": "f30530c7-1424-4186-99ba-122a343d1f9d"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Test Hospital",
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
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

The second `on_search` reaches your `consumer_uri` with the same `transaction_id` and at least one slot. Keep the slot's `fulfillments[].id`: it becomes the fulfillment id in `init`.

From `uhi.flow.consultation-discovery`.

### Order (`uhi-consultation-order`)

**Before you start**

Hold the chosen HSPA's `provider_uri` and `provider_id`, and the slot's `fulfillments[].id`, from the second `on_search`. Every call from here goes directly to the HSPA, signed, after looking up its public key.

**Act: the calls in this journey, in order**

#### 1. Initialise an order (`uhi_consultation_init`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/init \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "init",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "timestamp": "2024-06-25T05:09:45.791121Z",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "order": {
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
        "fulfillment_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
      },
      "fulfillment": {
        "id": "db07e802-4091-4b83-bbe4-39e231743aa3",
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
            "timestamp": "2024-06-25T13:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2024-06-25T13:15:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
        }
      },
      "billing": {
        "name": "<NAME>",
        "address": {
          "door": "",
          "name": "<NAME>",
          "locality": "<ADDRESS>",
          "city": null,
          "state": "Telangana",
          "country": "INDIA",
          "area_code": "500067"
        },
        "phone": "<MOBILE_NUMBER>",
        "email": ""
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
      }
    }
  }
}'
```

#### 2. Send the order with its quote and terms (`uhi_consultation_on_init`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_init \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_init",
    "timestamp": "2024-06-25T05:09:45.791121Z",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa",
    "transaction_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90",
    "message_id": "da1cc980-32af-11ef-bcbe-590b07ce8c90"
  },
  "message": {
    "order": {
      "id": "7661-863173-3384",
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
        "fulfillment_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
      },
      "fulfillment": {
        "id": "db07e802-4091-4b83-bbe4-39e231743aa3",
        "type": "Physical",
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
            "timestamp": "2024-06-25T13:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2024-06-25T13:15:00"
          }
        },
        "tags": {
          "@abdm/gov.in/slot_id": "db07e802-4091-4b83-bbe4-39e231743aa3"
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
          "termsState": "INITIATED"
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
          "termsState": "INITIATED"
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
          "termsState": "INITIATED"
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
          "termsState": "INITIATED"
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
          "termsState": "INITIATED"
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
        "id": "<ABHA_ADDRESS>",
        "person": {
          "gender": "M",
          "dayOfBirth": "<DOB>",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>",
          "dob": "<DOB>",
          "tags": {
            "@abdm/gov.in/abha_number": "<ABHA_NUMBER>"
          }
        }
      },
      "payment": {
        "type": "ON-ORDER",
        "status": "NOT_PAID"
      }
    }
  }
}'
```

#### 3. Confirm the order (`uhi_consultation_confirm`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

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

#### 4. Send the confirmed order and PIN (`uhi_consultation_on_confirm`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_confirm \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_confirm",
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

#### 5. Copy on_confirm to the Gateway audit (`uhi_consultation_on_confirm_audit`)

This call is sent to the UHI Gateway.

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

**Exit condition (Observe until this is true)**

`on_confirm` arrives with state `CONFIRMED` and `authorization.type: PIN`, a 4-digit token with status `GENERATED`. Show the PIN to the patient and keep it in memory only.

From `uhi.flow.consultation-order`.

### Fulfilment (`uhi-consultation-fulfilment`)

**Before you start**

The order is `CONFIRMED` and you hold its `order.id`. The EUA exposes `/on_update` and `/on_status`. The HSPA exposes `/status` and `/on_update`.

**Act: the calls in this journey, in order**

#### 1. Request the order status (`uhi_consultation_status`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/status \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "status",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "id": "8441-696786-1042"
    }
  }
}'
```

#### 2. Send the order status (`uhi_consultation_on_status`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_status \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_status",
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
      "state": "CONFIRMED",
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
        "status": "NOT_PAID",
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
        "status": "GENERATED"
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

#### 3. Copy on_status to the Gateway audit (`uhi_consultation_on_status_audit`)

This call is sent to the UHI Gateway.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_status_audit \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_status_audit",
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
      "state": "CONFIRMED",
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
        "status": "NOT_PAID",
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
        "status": "GENERATED"
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

#### 4. Send an order update to the HSPA (`uhi_consultation_on_update_to_hspa`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/on_update \
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
      "state": "DOCTOR_NO_SHOW",
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
          "@abdm/gov.in/teleconsultation/uri": "www.callmyhspa.com/tele"
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
      "authorization": {
        "type": "PIN",
        "token": 1234,
        "valid_from": "2024-06-24T00:00:00",
        "valid_to": "2024-06-24T23:59:00",
        "status": "GENERATED"
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

#### 5. Send an order update to the EUA (`uhi_consultation_on_update_to_eua`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

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

#### 6. Copy on_update to the Gateway audit (`uhi_consultation_on_update_audit`)

This call is sent to the UHI Gateway.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_update_audit \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_update_audit",
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
          "yearOfBirth": "<DOB>"
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

**Exit condition (Observe until this is true)**

An `on_update` with `COMPLETED` reaches the EUA, carrying `@abdm/gov.in/care_context_id`. Keep that id. With the doctor's `@abdm/gov.in/hip_id`, it lets the EUA fetch the records later.

From `uhi.flow.consultation-fulfilment`.

### Post-fulfilment (`uhi-consultation-post-fulfilment`)

**Before you start**

Hold the order's `order.id`. Pick the reason code from the lists under Cancellation and override reason codes, and send it exactly as listed.

**Act: the calls in this journey, in order**

#### 1. Cancel the order (`uhi_consultation_cancel`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/cancel \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "cancel",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "id": "8441-696786-1042",
      "state": "CANCELLED",
      "fulfillment": {
        "tags": {
          "@abdm/gov.in/cancelledby": "patient",
          "@abdm/gov.in/cancel_reason": "predefined cancel reason"
        }
      }
    }
  }
}'
```

#### 2. Send the cancelled order (`uhi_consultation_on_cancel`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_cancel \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_cancel",
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
      "state": "CANCELLED",
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
          "@abdm/gov.in/cancelledby": "patient",
          "@abdm/gov.in/cancel_reason": "predefined cancel reason"
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
        "status": "NOT_PAID",
        "tl_method": "",
        "params": {
          "transaction_id": "",
          "amount": "1000",
          "mode": "",
          "vpa": "",
          "redirect_url": ""
        }
      },
      "authorization": {
        "type": "PIN",
        "token": 1234,
        "valid_from": "2024-06-24T00:00:00",
        "valid_to": "2024-06-24T23:59:00",
        "status": "GENERATED"
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

#### 3. Copy on_cancel to the Gateway audit (`uhi_consultation_on_cancel_audit`)

This call is sent to the UHI Gateway.

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/on_cancel_audit \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_cancel_audit",
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
      "state": "CANCELLED",
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
          "@abdm/gov.in/cancelledby": "patient",
          "@abdm/gov.in/cancel_reason": "predefined cancel reason"
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
        "status": "NOT_PAID",
        "tl_method": "",
        "params": {
          "transaction_id": "",
          "amount": "1000",
          "mode": "",
          "vpa": "",
          "redirect_url": ""
        }
      },
      "authorization": {
        "type": "PIN",
        "token": 1234,
        "valid_from": "2024-06-24T00:00:00",
        "valid_to": "2024-06-24T23:59:00",
        "status": "GENERATED"
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

#### 4. Send a message to the HSPA (`uhi_consultation_on_message_to_hspa`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/on_message \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_message",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35.481906Z",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "chat": {
        "sender": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image hashed base64",
            "id": "<HPR_ADDRESS>@hpr.ndhm"
          }
        },
        "receiver": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image",
            "id": "<ABHA_ADDRESS>"
          }
        },
        "content": {
          "content_id": "e616e100-42e0-11ed-b5d7-51ae9d37b46f",
          "content_value": "Base64 Encoded text",
          "content_type": "text"
        },
        "time": {
          "timestamp": "2022-10-03T11:32:01"
        }
      }
    }
  }
}'
```

#### 5. Send a message to the EUA (`uhi_consultation_on_message_to_eua`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_message \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_message",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2022-07-05T15:24:35.481906Z",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "chat": {
        "sender": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image hashed base64",
            "id": "<ABHA_ADDRESS>"
          }
        },
        "receiver": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image",
            "id": "<HPR_ADDRESS>@hpr.ndhm"
          }
        },
        "content": {
          "content_id": "e616e100-42e0-11ed-b5d7-51ae9d37b46f",
          "content_value": "Base64 Encoded text",
          "content_type": "text"
        },
        "time": {
          "timestamp": "2022-10-03T11:32:01"
        }
      }
    }
  }
}'
```

**Exit condition (Observe until this is true)**

An `on_cancel` with `CANCELLED` reaches the EUA, and the HSPA has sent its copy to `on_cancel_audit`.

From `uhi.flow.consultation-post-fulfilment`.

## Where the detail is

- The service: /docs/uhi/v1/services/consultation
- Every operation, with its body fields and responses: /docs/uhi/v1/api/consultation
