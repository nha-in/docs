---
title: Jan Aushadhi medicine search
sidebar_label: Jan Aushadhi medicine search
sidebar_position: 6
description: Search the Jan Aushadhi medicine catalogue, then find the Kendras that stock a chosen medicine.
verification: unverified
source: UHI__JanAushadhiKendra_medicineSearch_v0.3.md, UHI__UHI_JanAushadhiKendra_search_v0.3.md
---

# Jan Aushadhi medicine search

This is the two step version of Jan Aushadhi discovery: your user searches for a medicine by name, then you search again for the Kendras that carry it, with a stock flag on each. After this page you will know what changes from [Jan Aushadhi Kendra discovery](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra), which is `fulfillment.type` and `item.descriptor` and nothing else.

## Who does what

The same three parties as every [UHI](/docs/uhi/v1/getting-started/glossary#uhi) service. Your app is the [EUA](/docs/uhi/v1/getting-started/glossary#eua). [NHA](/docs/uhi/v1/getting-started/glossary#nha) runs the Gateway. PMBI runs the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) that holds the medicine and stock data. Signing, onboarding and the Gateway base URLs are on [UHI services](/docs/uhi/v1).

## Message flow

Two round trips, four calls in total. Each `search` gets an immediate HTTP 200 ACK from the Gateway, and the real answer arrives later on your `consumer_uri`.

| Step | Call | Who acts | What comes back |
| --- | --- | --- | --- |
| 1 | `search` | Your system | ACK. The medicine catalogue arrives separately. |
| 2 | `on_search` | PMBI HSPA via Gateway | Matching generic medicines, each with an ID, item code, price and pack size. |
| 3 | `search` | Your system | ACK. You send the medicine ID your user picked, plus a location filter. |
| 4 | `on_search` | PMBI HSPA via Gateway | Kendras that carry that medicine, each with an `items[]` entry holding the stock flag. |

Both `on_search` responses carry the `transaction_id` of the `search` that triggered them. Use two separate `transaction_id` values, one per step, so you can tell the two responses apart.

## Service identity

`domain` is the same as Kendra discovery. `fulfillment.type` is not.

| Step | `domain` | `fulfillment.type` | `item.descriptor.code` and `.name` |
| --- | --- | --- | --- |
| Medicine search | `nic2008:47721` | `JANAUSHADHI_MEDICINE` | The medicine name |
| Kendras stocking a medicine | `nic2008:47721` | `JANAUSHADHI_KENDRA` | The `medicineId` from step 1 |

NHA's v1.0 onboarding document uses `JANAUSHADHI` for a plain Kendra search. These two values, `JANAUSHADHI_MEDICINE` and `JANAUSHADHI_KENDRA`, appear only in the v0.3 medicine search document. See [Open questions](#open-questions).

## Step 1: search by medicine name

Put the medicine name in `item.descriptor`. NHA's sample gives the code as the name with spaces removed, and the name with spaces kept.

```json
{
  "context": {
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "message_id": "<FRESH_UUID_PER_CALL>",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "<FRESH_UUID_PER_SEARCH_SESSION>"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_MEDICINE",
        "start": { "time": { "timestamp": "2026-06-09T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-09T23:59:59" } }
      },
      "item": {
        "descriptor": {
          "code": "<MEDICINE_NAME_WITHOUT_SPACES>",
          "name": "<MEDICINE_NAME>"
        }
      }
    }
  }
}
```

### on_search: the medicine catalogue

Each `providers[]` entry is one generic medicine, not a store. The `items[]` array inside it carries price and pack size.

```json
{
  "context": {
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "janaushadhi-hspa",
    "provider_uri": "https://janaushadhi.gov.in:8443/api/v1/admin/kendra/",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "<HSPA_LOGO_IMAGE_URL_SET_BY_PMBI>",
        "short_desc": "<HSPA_SHORT_DESCRIPTION_SET_BY_PMBI>",
        "long_desc": "<HSPA_LONG_DESCRIPTION_SET_BY_PMBI>"
      },
      "providers": [
        {
          "id": "78299",
          "descriptor": {
            "name": "3-way stopcock with 10 cm extension line",
            "code": "8150.0",
            "symbol": "",
            "short_desc": "",
            "long_desc": ""
          },
          "items": [
            {
              "id": "0",
              "price": { "currency": "INR", "value": "20.0" },
              "quantity": { "measure": { "value": 10, "unit": "s" } }
            }
          ]
        }
      ]
    }
  }
}
```

NHA's document writes its sample values as an annotation pair, for example `"id": "medicineId - 78299"`. The samples on this page show the value only. The `catalog.descriptor` fields carry descriptive prose in NHA's document rather than real values, so they appear here as named placeholders.

| Field path | Type | Description |
| --- | --- | --- |
| `catalog.providers[].id` | string | `medicineId`. This is what you send back in step 2. |
| `catalog.providers[].descriptor.name` | string | Generic name of the medicine |
| `catalog.providers[].descriptor.code` | string | PMBI item code, for example `8150.0` |
| `catalog.providers[].items[].price.currency` | string | `INR` |
| `catalog.providers[].items[].price.value` | string | MRP |
| `catalog.providers[].items[].quantity.measure.value` | number | Unit size, for example `10` |
| `catalog.providers[].items[].quantity.measure.unit` | string | Unit of the pack. NHA lists `s`, `ml`, `sachet`, `drops`, `mg` and `tetra pack`. |

## Step 2: search for Kendras stocking that medicine

Change `fulfillment.type` to `JANAUSHADHI_KENDRA` and put the `medicineId` in `item.descriptor`. Add whichever location filter your user chose: state and district, pincode, or GPS and radius. The filter fields are the same as on [Jan Aushadhi Kendra discovery](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra).

```json
{
  "context": {
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_EUA_ID_FROM_NHA_ONBOARDING>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_URL>",
    "message_id": "<FRESH_UUID_PER_CALL>",
    "timestamp": "2026-06-19T18:24:35",
    "transaction_id": "<FRESH_UUID_PER_SEARCH_SESSION>"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "JANAUSHADHI_KENDRA",
        "start": { "time": { "timestamp": "2026-06-19T00:00:00" } },
        "end": { "time": { "timestamp": "2026-06-19T23:59:59" } }
      },
      "item": {
        "descriptor": {
          "code": "78299",
          "name": "78299"
        }
      },
      "location": {
        "district": { "code": "507", "name": "HYDERABAD" },
        "state": { "code": "36", "name": "Telangana" }
      }
    }
  }
}
```

### on_search: Kendras with stock

Kendra records, the same shape as Kendra discovery, with one addition: each Kendra carries an `items[]` entry for the medicine you asked about, and that entry has a `flag` for stock.

```json
{
  "context": {
    "domain": "nic2008:47721",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "core_version": "0.7.1",
    "consumer_id": "eua-nha",
    "consumer_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "provider_id": "janaushadhi-hspa",
    "provider_uri": "https://janaushadhi.gov.in:8443/api/v1/admin/kendra/",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-06-09T18:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "catalog": {
      "descriptor": {
        "name": "JAN AUSHADHI KENDRA HSPA",
        "images": "<HSPA_LOGO_IMAGE_URL_SET_BY_PMBI>",
        "short_desc": "<HSPA_SHORT_DESCRIPTION_SET_BY_PMBI>",
        "long_desc": "<HSPA_LONG_DESCRIPTION_SET_BY_PMBI>"
      },
      "providers": [
        {
          "id": "PMBJK01472",
          "descriptor": {
            "name": "Jan Aushadhi Kendra2",
            "code": "PP",
            "symbol": "2",
            "short_desc": "",
            "long_desc": ""
          },
          "fulfillments": [
            {
              "id": "0",
              "type": "contact",
              "agent": { "name": "GOPAL RAMBHAU KARALE" },
              "start": { "time": { "timestamp": "2018-03-22T12:00:00" } }
            }
          ],
          "items": [
            {
              "id": "78299",
              "descriptor": {
                "name": "3-way stopcock with 10 cm extension line",
                "code": "8150.0",
                "symbol": "",
                "short_desc": "",
                "flag": false
              },
              "quantity": { "measure": { "value": 10, "unit": "s" } }
            }
          ],
          "location": {
            "id": "1",
            "descriptor": { "name": "Jan Aushadhi Kendra2" },
            "city": { "name": "", "code": "" },
            "district": { "name": "Akola", "code": "467" },
            "state": { "name": "Maharashtra", "code": "27" },
            "country": { "name": "INDIA", "code": "+91" },
            "gps": "20.6838699,77.02622334",
            "address": "Shop no.1 basement, Radha Krishna complex, behind Harsh sankul, opp. S.A.college",
            "radius": { "type": "CONSTANT", "value": "0.4", "unit": "km" }
          },
          "contact": { "phone": "9881461949", "email": "" }
        }
      ]
    }
  }
}
```

The fields that are new compared with a plain Kendra record:

| Field path | Type | Description |
| --- | --- | --- |
| `catalog.providers[].items[].id` | string | `medicineId`, matching the one you sent |
| `catalog.providers[].items[].descriptor.name` | string | Generic name of the medicine |
| `catalog.providers[].items[].descriptor.code` | string | PMBI item code |
| `catalog.providers[].items[].descriptor.flag` | boolean | Stock indicator for this medicine at this Kendra |
| `catalog.providers[].items[].quantity.measure.value` | number | Unit size |
| `catalog.providers[].items[].quantity.measure.unit` | string | Unit of the pack |
| `catalog.providers[].location.radius` | object | A distance with a unit, for example `0.4 km`. NHA's field reference does not list this field. It appears in the sample response only. |

Every other field on the provider record is documented in the [Kendra discovery field reference](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra#field-reference).

NHA's document does not say which way round `flag` reads. It appears as `false` on both sample records with no accompanying legend. Confirm the meaning with your NHA contact before you render "in stock" or "out of stock" to a user.

## Open questions

None of this has been run against sandbox. These are the points where the source documents do not agree or do not say.

| Question | What the documents say |
| --- | --- |
| Whether `JANAUSHADHI_KENDRA` is still current | The v0.3 medicine document says that for a medicine filtered Kendra search only the type and the item descriptor change, and gives `JANAUSHADHI_KENDRA`. The later v1.0 onboarding document gives `JANAUSHADHI` and does not mention `JANAUSHADHI_MEDICINE` or `JANAUSHADHI_KENDRA` at all. Whether the HSPA still accepts the two step values is unconfirmed. |
| Which way `descriptor.flag` reads | The document says the field sends "flag for in stock or out of stock" and shows `false` in both samples. It does not say which value means which. |
| Whether the medicine search accepts a location filter | The step 1 sample carries no `location` or `address` block. The document does not say whether one is allowed. |
| The HSPA identity | These v0.3 documents give `provider_id` as `janaushadhi-hspa` at `https://janaushadhi.gov.in:8443/api/v1/admin/kendra/`. The v1.0 onboarding document gives `pmbi.hspa` at `https://nha-pmbi.pmbi.co.in/api/store`. |

NHA's stock `on_search` sample in the source document is not valid JSON: an `items` array is left unclosed part way through the first provider record. The sample above is transcribed from the second provider record in that document, which is complete.

## Next

- Kendra discovery without a medicine filter: [Jan Aushadhi Kendra discovery](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra)
- Shared UHI protocol, signing and onboarding: [UHI services](/docs/uhi/v1)
