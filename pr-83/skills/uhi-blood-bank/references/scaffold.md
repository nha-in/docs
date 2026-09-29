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


# UHI Blood Bank discovery build

Scaffolds UHI Blood Bank discovery one journey at a time: finding blood banks that hold a blood group and component, near a location or in a district.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Blood stock discovery (`uhi-blood-bank`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `nic2008:86906` and `BloodStock`. Send the blood group in `item.descriptor`, the component in `category.descriptor`, and one location mode.

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
    "domain": "nic2008:86906",
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
          "code": "11",
          "name": "Whole Blood"
        }
      },
      "fulfillment": {
        "type": "BloodStock",
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
          "code": "17",
          "name": "AB+Ve"
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
    "domain": "nic2008:86906",
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
          "code": "11",
          "name": "Whole Blood"
        }
      },
      "fulfillment": {
        "type": "BloodStock",
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
          "code": "17",
          "name": "AB+Ve"
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
    "domain": "nic2008:86906",
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
        "name": "e-RaktKosh",
        "images": "e-RaktKosh IMAGE",
        "short_desc": "e-RaktKosh: A Centralized Blood Bank Management System",
        "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
      },
      "providers": [
        {
          "id": "0",
          "descriptor": {
            "name": "Azad Panchi Group's, Janseva Blood Centre",
            "short_desc": "Charitable/Vol",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 16
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Azad Panchi Group's, Janseva Blood Centre",
              "short_desc": "Charitable/Vol",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
            }
          }
        },
        {
          "id": "1",
          "descriptor": {
            "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
            "short_desc": "Govt.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 88
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
              "short_desc": "Govt.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
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
    "domain": "nic2008:86906",
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
        "name": "e-RaktKosh",
        "images": "e-RaktKosh IMAGE",
        "short_desc": "e-RaktKosh: A Centralized Blood Bank Management System",
        "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
      },
      "providers": [
        {
          "id": "0",
          "descriptor": {
            "name": "Azad Panchi Group's, Janseva Blood Centre",
            "short_desc": "Charitable/Vol",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 16
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Azad Panchi Group's, Janseva Blood Centre",
              "short_desc": "Charitable/Vol",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
            }
          }
        },
        {
          "id": "1",
          "descriptor": {
            "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
            "short_desc": "Govt.",
            "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
          },
          "categories": [
            {
              "id": "0",
              "parent_category_id": "101",
              "descriptor": {
                "name": "WholeBlood",
                "code": "11"
              }
            }
          ],
          "fulfillments": [
            {
              "id": "0",
              "type": "NotAvailable",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            },
            {
              "id": "1",
              "type": "Available",
              "start": {
                "time": {
                  "timestamp": "2023-01-03T12:30:00"
                }
              }
            }
          ],
          "items": [
            {
              "id": "1",
              "quantity": {
                "count": 88
              },
              "descriptor": {
                "name": "AB+Ve",
                "code": "17"
              },
              "category_id": "0",
              "fulfillment_id": "0"
            }
          ],
          "location": {
            "id": "1",
            "descriptor": {
              "name": "Metro Blood Centre,Civil Hospital Aundh Pune",
              "short_desc": "Govt.",
              "long_desc": "We are Test hospital. We have established a very profound name in the healthcare industry by providing expert services in every healthcare fields that we have."
            },
            "city": {
              "name": "Pune",
              "code": "022"
            },
            "district": {
              "name": "INDIA",
              "code": "+91"
            },
            "country": {
              "name": "INDIA",
              "code": "+91"
            },
            "gps": "18.5246036,73.792927",
            "address": "<ADDRESS>"
          },
          "contact": {
            "phone": "<MOBILE_NUMBER>",
            "email": "<EMAIL>",
            "tags": {
              "@abdm/gov.in/contact/fax": "7766728"
            }
          }
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

At least one `on_search` arrives with your `transaction_id`. Each blood group item carries `quantity.count` and a `fulfillment_id` that points to its availability.

From `uhi.flow.blood-bank-discovery`.

## Where the detail is

- The service: /docs/uhi/v1/services/blood-bank
- Every operation, with its body fields and responses: /docs/uhi/v1/api/network
