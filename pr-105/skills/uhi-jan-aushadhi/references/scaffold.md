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


# UHI Jan Aushadhi build

Scaffolds UHI Jan Aushadhi one journey at a time: finding Jan Aushadhi Kendras, finding a medicine, and finding the Kendras that stock it.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Jan Aushadhi, Kendra search (`uhi-jan-aushadhi-kendra-search`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `nic2008:47721`, and `JANAUSHADHI` as both the fulfillment type and the item code and name. Every location filter is optional.

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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI",
        "start": {
          "time": {
            "timestamp": "2026-06-09T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-09T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "JANAUSHADHI",
          "name": "JANAUSHADHI"
        }
      },
      "location": {
        "gps": "17.39916197665472, 78.43400530708318",
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI",
        "start": {
          "time": {
            "timestamp": "2026-06-09T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-09T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "JANAUSHADHI",
          "name": "JANAUSHADHI"
        }
      },
      "location": {
        "gps": "17.39916197665472, 78.43400530708318",
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK10844",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2023-06-30T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "PUNE",
              "code": "490"
            },
            "state": {
              "name": "Maharashtra",
              "code": "27"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.51996721338908,73.86697649999999",
            "address": "Shop No.2,CTS No.350,Sai Appartment,Near KEM Hospital Rasta Peth, Pune, Pune, Maharashtra, India - 411011",
            "radius": {
              "type": "CONSTANT",
              "value": "1.19",
              "unit": "km"
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          }
        },
        {
          "id": "PMBJK08762",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2021-07-29T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "PUNE",
              "code": "490"
            },
            "state": {
              "name": "Maharashtra",
              "code": "27"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.51787100000001,73.86446748220898",
            "address": "Seth Tarachand Ayurvedic Hospital, Rasta Peth, Pune, Pune, Maharashtra, India - 411011",
            "radius": {
              "type": "CONSTANT",
              "value": "1.54",
              "unit": "km"
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK10844",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2023-06-30T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "PUNE",
              "code": "490"
            },
            "state": {
              "name": "Maharashtra",
              "code": "27"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.51996721338908,73.86697649999999",
            "address": "Shop No.2,CTS No.350,Sai Appartment,Near KEM Hospital Rasta Peth, Pune, Pune, Maharashtra, India - 411011",
            "radius": {
              "type": "CONSTANT",
              "value": "1.19",
              "unit": "km"
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          }
        },
        {
          "id": "PMBJK08762",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2021-07-29T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "PUNE",
              "code": "490"
            },
            "state": {
              "name": "Maharashtra",
              "code": "27"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.51787100000001,73.86446748220898",
            "address": "Seth Tarachand Ayurvedic Hospital, Rasta Peth, Pune, Pune, Maharashtra, India - 411011",
            "radius": {
              "type": "CONSTANT",
              "value": "1.54",
              "unit": "km"
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          }
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

An `on_search` arrives with your `transaction_id`. Each `providers[]` record is one Kendra, and its `id` is the Kendra code.

From `uhi.flow.jan-aushadhi-find-kendra`.

### Jan Aushadhi, medicine search (`uhi-jan-aushadhi-medicine-search`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call, with `context.domain` set to `nic2008:47721`. The citizen has typed a medicine name.

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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_MEDICINE",
        "start": {
          "time": {
            "timestamp": "2026-06-09T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-09T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "Paracetamol",
          "name": "Paracetamol"
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_MEDICINE",
        "start": {
          "time": {
            "timestamp": "2026-06-09T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-09T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "Paracetamol",
          "name": "Paracetamol"
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "77041",
          "descriptor": {
            "name": "Aceclofenac 100 mg Paracetamol 325 mg Serratiopeptidase 15 mg",
            "code": "638",
            "symbol": "",
            "short_desc": "",
            "long_desc": ""
          },
          "items": [
            {
              "id": "0",
              "price": {
                "currency": "INR",
                "value": "21.000"
              },
              "quantity": {
                "measure": {
                  "unit": "10's"
                }
              }
            }
          ]
        },
        {
          "id": "76476",
          "descriptor": {
            "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
            "code": "1",
            "symbol": "",
            "short_desc": "",
            "long_desc": ""
          },
          "items": [
            {
              "id": "0",
              "price": {
                "currency": "INR",
                "value": "10.320"
              },
              "quantity": {
                "measure": {
                  "unit": "10's"
                }
              }
            }
          ]
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "77041",
          "descriptor": {
            "name": "Aceclofenac 100 mg Paracetamol 325 mg Serratiopeptidase 15 mg",
            "code": "638",
            "symbol": "",
            "short_desc": "",
            "long_desc": ""
          },
          "items": [
            {
              "id": "0",
              "price": {
                "currency": "INR",
                "value": "21.000"
              },
              "quantity": {
                "measure": {
                  "unit": "10's"
                }
              }
            }
          ]
        },
        {
          "id": "76476",
          "descriptor": {
            "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
            "code": "1",
            "symbol": "",
            "short_desc": "",
            "long_desc": ""
          },
          "items": [
            {
              "id": "0",
              "price": {
                "currency": "INR",
                "value": "10.320"
              },
              "quantity": {
                "measure": {
                  "unit": "10's"
                }
              }
            }
          ]
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

The second `on_search` lists Kendras. Each carries the medicine in `items[]`, where `descriptor.flag` is `true` for in stock and `false` for out of stock.

From `uhi.flow.jan-aushadhi-find-medicine`.

### Jan Aushadhi, Kendras for a selected medicine (`uhi-jan-aushadhi-medicine-stock`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call, with `context.domain` set to `nic2008:47721`. The citizen has typed a medicine name.

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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_KENDRA",
        "start": {
          "time": {
            "timestamp": "2026-06-19T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-19T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "76476",
          "name": "76476"
        }
      },
      "location": {
        "district": {
          "code": "507",
          "name": "HYDERABAD"
        },
        "state": {
          "code": "36",
          "name": "Telangana"
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_KENDRA",
        "start": {
          "time": {
            "timestamp": "2026-06-19T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-19T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "76476",
          "name": "76476"
        }
      },
      "location": {
        "district": {
          "code": "507",
          "name": "HYDERABAD"
        },
        "state": {
          "code": "36",
          "name": "Telangana"
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK02126",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.35081180000000000,78.47271120000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": false
              }
            }
          ]
        },
        {
          "id": "PMBJK02129",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.39410330000000000,78.44249560000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": true
              }
            }
          ]
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
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "pmbi.hspa",
    "provider_uri": "https://staging-nha-pmbi.pmbi.co.in/api/store",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "https://janaushadhi.gov.in/img/bhartiya_janaushadhi_priyojna_2.svg",
        "short_desc": "",
        "long_desc": ""
      },
      "providers": [
        {
          "id": "PMBJK02126",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "1",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.35081180000000000,78.47271120000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": false
              }
            }
          ]
        },
        {
          "id": "PMBJK02129",
          "descriptor": {
            "name": "Jan Aushadhi Kendra",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": {
                "name": "<NAME>"
              },
              "start": {
                "time": {
                  "timestamp": "2018-04-13T00:00:00"
                }
              }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Jan Aushadhi Kendra"
            },
            "city": {
              "name": "",
              "code": ""
            },
            "district": {
              "name": "HYDERABAD",
              "code": "507"
            },
            "state": {
              "name": "Telangana",
              "code": "36"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "17.39410330000000000,78.44249560000000000",
            "address": "<ADDRESS>",
            "radius": {
              "type": "",
              "value": "",
              "unit": ""
            }
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>"
          },
          "items": [
            {
              "id": "76476",
              "descriptor": {
                "name": "Aceclofenac 100mg and Paracetamol 325mg Tablets",
                "code": "1",
                "symbol": "",
                "short_desc": "",
                "flag": true
              }
            }
          ]
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

The second `on_search` lists Kendras. Each carries the medicine in `items[]`, where `descriptor.flag` is `true` for in stock and `false` for out of stock.

From `uhi.flow.jan-aushadhi-find-medicine`.

## Where the detail is

- The service: /docs/uhi/v1/services/jan-aushadhi
- Every operation, with its body fields and responses: /docs/uhi/v1/api/network/jan-aushadhi
