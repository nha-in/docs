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


# UHI Ambulance Booking build

Scaffolds UHI Ambulance Booking one journey at a time: finding an ambulance for a pickup, and getting a quote with its terms.

## How this skill runs

Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.

Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.

## Journeys

### Discovery (`uhi-ambulance-discovery`)

**Before you start**

The EUA has a public HTTPS `consumer_uri` and signs every call. Set `context.domain` to `nic2008:86909`, the item code to `AMBULANCE` and the fulfillment type to `EMERGENCY`.

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
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-03-23T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "ALL",
          "name": "ALL"
        }
      },
      "fulfillment": {
        "type": "EMERGENCY",
        "start": {
          "time": {
            "timestamp": "2026-01-05T15:24:35"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-01-05T23:59:59"
          }
        },
        "tags": {
          "additional_services": "oxygen cylinder, etc"
        }
      },
      "locations": [
        {
          "descriptor": {
            "code": "SOURCE",
            "name": "SOURCE"
          },
          "gps": "28.61469203602857,77.20759019852424",
          "address": "<ADDRESS>"
        }
      ],
      "item": {
        "descriptor": {
          "code": "AMBULANCE",
          "name": "AMBULANCE"
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
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-03-23T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "ALL",
          "name": "ALL"
        }
      },
      "fulfillment": {
        "type": "EMERGENCY",
        "start": {
          "time": {
            "timestamp": "2026-01-05T15:24:35"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-01-05T23:59:59"
          }
        },
        "tags": {
          "additional_services": "oxygen cylinder, etc"
        }
      },
      "locations": [
        {
          "descriptor": {
            "code": "SOURCE",
            "name": "SOURCE"
          },
          "gps": "28.61469203602857,77.20759019852424",
          "address": "<ADDRESS>"
        }
      ],
      "item": {
        "descriptor": {
          "code": "AMBULANCE",
          "name": "AMBULANCE"
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
    "domain": "nic2008:86909",
    "action": "on_search",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-04-16T17:52:00",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "flag": false,
        "images": "HSPA Image",
        "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
        "name": "NHA HSPA",
        "short_desc": "Ref HSPA: Ambulance Provider HSPA"
      },
      "providers": [
        {
          "categories": [
            {
              "descriptor": {
                "code": "PTA",
                "flag": false,
                "name": "Patient Transport Ambulances (PTA)"
              },
              "id": "3"
            },
            {
              "descriptor": {
                "code": "MVA",
                "flag": false,
                "name": "Mortuary Van/Ambulance"
              },
              "id": "4"
            },
            {
              "descriptor": {
                "code": "ALS",
                "flag": false,
                "name": "Advanced Life Support(ALS)"
              },
              "id": "1"
            },
            {
              "descriptor": {
                "code": "BLS",
                "flag": false,
                "name": "Basic Life Support(BLS)"
              },
              "id": "2"
            }
          ],
          "descriptor": {
            "flag": false,
            "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
            "name": "NHA HSPA",
            "short_desc": "HSPA"
          },
          "fulfillments": [
            {
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "id": "ML-ALS-01",
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:30:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              },
              "tracking": true,
              "type": "EMERGENCY"
            },
            {
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:43:00"
                }
              },
              "id": "ML-BLS-01",
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              },
              "tracking": false,
              "type": "EMERGENCY"
            }
          ],
          "id": "1",
          "items": [
            {
              "category_id": "1",
              "descriptor": {
                "flag": true,
                "long_desc": "disclaimer",
                "name": "Charges",
                "short_desc": "applicability"
              },
              "fulfillment_id": "ML-ALS-01",
              "id": "1",
              "price": {
                "currency": "INR",
                "estimated_Value": "500",
                "maximum_Value": "1500",
                "minimum_Value": "200",
                "value": "500"
              }
            },
            {
              "category_id": "2",
              "descriptor": {
                "flag": false,
                "long_desc": "disclaimer",
                "name": "Charges",
                "short_desc": "applicability"
              },
              "fulfillment_id": "ML-BLS-01",
              "id": "2",
              "price": {
                "currency": "INR",
                "estimated_Value": "300",
                "maximum_Value": "1000",
                "minimum_Value": "0",
                "value": "300.0"
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
    "domain": "nic2008:86909",
    "action": "on_search",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-04-16T17:52:00",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "flag": false,
        "images": "HSPA Image",
        "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
        "name": "NHA HSPA",
        "short_desc": "Ref HSPA: Ambulance Provider HSPA"
      },
      "providers": [
        {
          "categories": [
            {
              "descriptor": {
                "code": "PTA",
                "flag": false,
                "name": "Patient Transport Ambulances (PTA)"
              },
              "id": "3"
            },
            {
              "descriptor": {
                "code": "MVA",
                "flag": false,
                "name": "Mortuary Van/Ambulance"
              },
              "id": "4"
            },
            {
              "descriptor": {
                "code": "ALS",
                "flag": false,
                "name": "Advanced Life Support(ALS)"
              },
              "id": "1"
            },
            {
              "descriptor": {
                "code": "BLS",
                "flag": false,
                "name": "Basic Life Support(BLS)"
              },
              "id": "2"
            }
          ],
          "descriptor": {
            "flag": false,
            "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
            "name": "NHA HSPA",
            "short_desc": "HSPA"
          },
          "fulfillments": [
            {
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "id": "ML-ALS-01",
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:30:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              },
              "tracking": true,
              "type": "EMERGENCY"
            },
            {
              "end": {
                "time": {
                  "timestamp": "2026-01-05T12:43:00"
                }
              },
              "id": "ML-BLS-01",
              "start": {
                "time": {
                  "timestamp": "2026-01-05T12:35:00"
                }
              },
              "tags": {
                "additional_services": "oxygen cylinder, etc",
                "deeplink_url": "https://deeplinkurl.com"
              },
              "tracking": false,
              "type": "EMERGENCY"
            }
          ],
          "id": "1",
          "items": [
            {
              "category_id": "1",
              "descriptor": {
                "flag": true,
                "long_desc": "disclaimer",
                "name": "Charges",
                "short_desc": "applicability"
              },
              "fulfillment_id": "ML-ALS-01",
              "id": "1",
              "price": {
                "currency": "INR",
                "estimated_Value": "500",
                "maximum_Value": "1500",
                "minimum_Value": "200",
                "value": "500"
              }
            },
            {
              "category_id": "2",
              "descriptor": {
                "flag": false,
                "long_desc": "disclaimer",
                "name": "Charges",
                "short_desc": "applicability"
              },
              "fulfillment_id": "ML-BLS-01",
              "id": "2",
              "price": {
                "currency": "INR",
                "estimated_Value": "300",
                "maximum_Value": "1000",
                "minimum_Value": "0",
                "value": "300.0"
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

An `on_search` reaches your `consumer_uri` with your `transaction_id` and at least one fulfillment. Store `context.provider_id` and `context.provider_uri` from it for `init`.

From `uhi.flow.ambulance-discovery`.

### Order (`uhi-ambulance-order`)

**Before you start**

Hold `context.provider_id`, `context.provider_uri`, the chosen item id and fulfillment id from `on_search`, and the patient's ABHA address. `init` goes directly to the HSPA, signed, after looking up its public key.

**Act: the calls in this journey, in order**

#### 1. Send the patient's details for a quote (`uhi_ambulance_init`)

This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.

```bash
curl --request POST \
  --url https://<provider_uri>/init \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "action": "init",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-01-05T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "billing": {
        "address": {
          "area_code": "500067",
          "city": null,
          "country": "INDIA",
          "door": "",
          "locality": "13-6-454/36/1, Hiranagar, Gudimalkapur, Asifnagar, Hyderabad, Andhra Pradesh",
          "name": "<NAME>",
          "state": "Telangana"
        },
        "email": "",
        "name": "<NAME>",
        "phone": "<MOBILE_NUMBER>"
      },
      "customer": {
        "id": "<ABHA_ADDRESS>",
        "person": {
          "dayOfBirth": "<DOB>",
          "dob": "<DOB>",
          "gender": "M",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>"
        }
      },
      "fulfillment": {
        "end": {
          "time": {
            "timestamp": "2026-01-05T12:35:00"
          }
        },
        "id": "ML-ALS-01",
        "start": {
          "time": {
            "timestamp": "2026-01-05T12:30:00"
          }
        },
        "tags": {
          "additional_services": "oxygen cylinder, etc",
          "deeplink_url": "https://deeplinkurl.com"
        },
        "tracking": true,
        "type": "EMERGENCY"
      },
      "item": {
        "category_id": "1",
        "descriptor": {
          "flag": true,
          "long_desc": "disclaimer",
          "name": "Charges",
          "short_desc": "applicability"
        },
        "fulfillment_id": "ML-ALS-01",
        "id": "1",
        "price": {
          "currency": "INR",
          "estimated_Value": "500",
          "maximum_Value": "1500",
          "minimum_Value": "200",
          "value": "500"
        }
      },
      "locations": [
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "SOURCE",
            "name": "SOURCE"
          },
          "gps": "12.423423,77.325647"
        },
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "DESTINATION",
            "name": "DESTINATION"
          },
          "gps": "12.423423,77.325647"
        }
      ],
      "provider": {
        "descriptor": {
          "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
          "name": "NHA HSPA",
          "short_desc": "HSPA DESC"
        },
        "id": "1"
      }
    }
  }
}'
```

#### 2. Send the quote and terms (`uhi_ambulance_on_init`)

This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.

```bash
curl --request POST \
  --url https://<consumer_uri>/on_init \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "action": "on_init",
    "city": "std:011",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "core_version": "0.7.1",
    "country": "IND",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "timestamp": "2026-04-16T17:54:01",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "order": {
      "billing": {
        "address": {
          "area_code": "500067",
          "country": "INDIA",
          "door": "",
          "locality": "13-6-454/36/1, Hiranagar, Gudimalkapur, Asifnagar, Hyderabad, Andhra Pradesh",
          "name": "<NAME>",
          "state": "Telangana"
        },
        "email": "",
        "name": "<NAME>",
        "phone": "<MOBILE_NUMBER>"
      },
      "customer": {
        "id": "<ABHA_ADDRESS>",
        "person": {
          "dayOfBirth": "<DOB>",
          "dob": "<DOB>",
          "gender": "M",
          "monthOfBirth": "<DOB>",
          "yearOfBirth": "<DOB>"
        }
      },
      "fulfillment": {
        "end": {
          "time": {
            "timestamp": "2026-01-05T12:35:00"
          }
        },
        "id": "ML-ALS-01",
        "start": {
          "time": {
            "timestamp": "2026-01-05T12:30:00"
          }
        },
        "tags": {
          "additional_services": "oxygen cylinder, etc",
          "deeplink_url": "https://deeplinkurl.com",
          "terms_reference": "https://termsreference.com"
        },
        "tracking": true,
        "type": "EMERGENCY"
      },
      "id": "7661-863173-3384",
      "item": {
        "category_id": "1",
        "descriptor": {
          "flag": true,
          "long_desc": "disclaimer",
          "name": "Charges",
          "short_desc": "applicability"
        },
        "fulfillment_id": "ML-ALS-01",
        "id": "1",
        "price": {
          "currency": "INR",
          "estimated_Value": "500",
          "maximum_Value": "1500",
          "minimum_Value": "200",
          "value": "500"
        }
      },
      "locations": [
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "SOURCE",
            "flag": false,
            "name": "SOURCE"
          },
          "gps": "12.423423,77.325647"
        },
        {
          "address": "<ADDRESS>",
          "descriptor": {
            "code": "DESTINATION",
            "flag": false,
            "name": "DESTINATION"
          },
          "gps": "12.423423,77.325647"
        }
      ],
      "payment": {
        "status": "NOT_PAID",
        "type": "ON-ORDER"
      },
      "provider": {
        "descriptor": {
          "flag": false,
          "long_desc": "India's first, GPS based technology platform for fast and reliable first point medical attention. With an increasing emphasis on promoting independent living today, having access to the nearest ambulance to you can provide much needed peace of mind in a worst case scenario.",
          "name": "HSPA",
          "short_desc": "HSPA DESC"
        },
        "id": "1"
      },
      "quote": {
        "breakup": [
          {
            "price": {
              "currency": "INR",
              "value": "50.0"
            },
            "title": "Ambulance Base Charge"
          },
          {
            "price": {
              "currency": "INR",
              "value": "50.0"
            },
            "title": "Consumable Charges"
          }
        ],
        "price": {
          "currency": "INR",
          "value": "100.0"
        }
      },
      "terms": [
        {
          "descriptor": {
            "flag": false,
            "long_desc": "Long descripiton of commercial terms",
            "name": "Commercial terms and conditions",
            "short_desc": "Short description of commercial terms"
          },
          "reason": "",
          "reasonRequired": false,
          "termsState": "INITIATED",
          "timePeriod": "2024-11-12T09:00:00",
          "type": "Commercial"
        },
        {
          "descriptor": {
            "flag": false,
            "long_desc": "Long descripiton of settlement terms",
            "name": "Settlement terms and conditions",
            "short_desc": "Short description of settlement terms"
          },
          "reason": "",
          "reasonRequired": false,
          "termsState": "INITIATED",
          "timePeriod": "2024-11-12T09:00:00",
          "type": "Settlement"
        },
        {
          "descriptor": {
            "flag": false,
            "long_desc": "Long descripiton of cancellation terms",
            "name": "Cancellation terms and conditions",
            "short_desc": "Short description of cancellation terms"
          },
          "reason": "",
          "reasonRequired": false,
          "termsState": "INITIATED",
          "timePeriod": "2024-11-12T09:00:00",
          "type": "Cancellation"
        },
        {
          "descriptor": {
            "flag": false,
            "long_desc": "Long descripiton of refund terms",
            "name": "Refund terms and conditions",
            "short_desc": "Short description of refund terms"
          },
          "reason": "",
          "reasonRequired": false,
          "termsState": "INITIATED",
          "timePeriod": "2024-11-12T09:00:00",
          "type": "Refund"
        },
        {
          "descriptor": {
            "flag": false,
            "long_desc": "Long descripiton of payment terms",
            "name": "Payment terms and conditions",
            "short_desc": "Short description of payment terms"
          },
          "reason": "",
          "reasonRequired": false,
          "termsState": "INITIATED",
          "timePeriod": "2024-11-12T09:00:00",
          "type": "Payment"
        }
      ]
    }
  }
}'
```

**Exit condition (Observe until this is true)**

`on_init` reaches your `consumer_uri` with an `order.id`, a quote and all five terms. Show the cancellation and payment terms before any confirm action. The HSPA then calls the caregiver to arrange dispatch.

From `uhi.flow.ambulance-order`.

## Where the detail is

- The service: /docs/uhi/v1/services/ambulance
- Every operation, with its body fields and responses: /docs/uhi/v1/api/ambulance
