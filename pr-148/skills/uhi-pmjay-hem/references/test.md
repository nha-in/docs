# Test UHI PM-JAY HEM hospital discovery

The checks this service is held to before go-live, then the steps to production. The full test case list is at /docs/uhi/v1/resources/pmjay-hem.

## PM-JAY HEM test cases for the context block

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-A01 | Your search is well formed and the Gateway accepts it. | You send a `search` with every `context` field populated. The Gateway returns HTTP 200 with an ACK and no error. |
| TC-A02 | The results you receive belong to the search you sent. | `context.transaction_id` in the `on_search` at your `consumer_uri` equals the `transaction_id` of the originating `search` exactly. |
| TC-A03 | The response is for PM-JAY HEM. | `context.domain` in the `on_search` is present and equals `nic2004:85112`. |

From `uhi.test.pmjay-hem-context`.

## PM-JAY HEM test cases for search filters

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-B01 | Searching a state returns hospitals in that state. | A `search` with `location.state.name` and `location.state.code` returns provider records, all in the specified state. |
| TC-B02 | Adding a district narrows the results to that district. | A state `search` with `location.district.name` and `location.district.code` returns only hospitals in the specified district. |
| TC-B03 | Adding a speciality returns hospitals that offer it. | A state `search` with `category.descriptor.name` and `category.descriptor.code` returns providers whose `categories[]` each contain the matching speciality. |
| TC-B04 | Searching by hospital name finds that hospital. | A state `search` with `provider.descriptor.name` set to a known hospital returns hospitals whose name matches the input. |
| TC-B05 | Adding a pincode returns hospitals in that area. | A state `search` with a valid 6 digit `address.area_code` returns results geographically consistent with the pincode. |
| TC-B06 | Searching near a location returns hospitals within the chosen distance. | A `search` with `location.gps`, `radius.type: CONSTANT`, `radius.value` and `radius.unit: km`, and no state, returns hospitals whose GPS coordinates fall within the declared radius. |

From `uhi.test.pmjay-hem-search-filters`.

## PM-JAY HEM test cases for on_search

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-C01 | The results reach your app. | After a valid `search`, the `on_search` payload arrives at your `consumer_uri` within your timeout window. |
| TC-C02 | Every hospital has an ID. | Each `catalog.providers[].id` is a non-null string, for example `HOSP27G13867`. |
| TC-C03 | Every hospital has its core details. | `id`, `descriptor.name`, `location.gps` and `contact.phone` are present on each provider, and none is null or empty. |
| TC-C04 | Every hospital has its empanelment date. | Each provider has a `fulfillments[]` entry with `type: Empaneled Date` whose `start.time.timestamp` is a non-null string. |
| TC-C05 | Every hospital has its establishment date. | Each provider has a `fulfillments[]` entry with `type: Establishment Date` whose `start.time.timestamp` is a non-null string. |
| TC-C06 | Every hospital's location can be placed on a map. | Each `location.gps` is a comma separated `lat,long` string that parses as two valid decimal numbers. |
| TC-C07 | Every hospital has a PM-JAY nodal officer to call. | `contact.tags.nodalOfficerNumber` is a non-null numeric string on each provider. |
| TC-C08 | Every hospital lists its specialities. | Each provider has at least one `categories[]` entry with both `descriptor.name` and `descriptor.code`, and the code is a valid integer. |
| TC-C09 | Every hospital says whether it is government or private. | `descriptor.code` on each provider is a non-null, single character string, for example `G` or `P`. |

From `uhi.test.pmjay-hem-on-search`.

## PM-JAY HEM test cases for your app's screens

Check these by walking through your app on a test device and inspecting the
screens.

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-D01 | A beneficiary finds the feature quickly. | PM-JAY hospital search is reachable from the home screen in 3 taps or fewer. |
| TC-D02 | The feature's name says what it does. | The entry point label clearly communicates PM-JAY empanelment, for example "PMJAY Hospital Search" or "Find PMJAY Hospitals". |
| TC-D03 | The search screen shows where the data comes from. | UHI, PM-JAY and [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) branding all appear in the footer of the search screen, unobtrusively. |
| TC-D04 | Searching by the phone's location works. | A search using the device GPS returns results geographically consistent with the device location. |
| TC-D05 | Typing in a location works. | A search with a manually entered state, district or pincode returns results matching the entered location. |
| TC-D06 | An empty result is explained. | A valid search that yields no hospitals shows a message suggesting next steps, such as a wider radius or a nearby district. The screen is never blank. |
| TC-D07 | The results carry the disclaimer. | The results screen shows "Please confirm the hospital location by calling ahead, as details may change." |
| TC-D08 | The feature sits with health features. | PM-JAY hospital search appears under a health, hospital or insurance module, not under wellness, offers or lifestyle. |

From `uhi.test.pmjay-hem-user-experience`.

## PM-JAY HEM test cases for edge cases

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-E01 | A very long list still works. | A state only search for a high density state, such as Andhra Pradesh or Maharashtra, renders the full list without a crash or timeout. Scroll and filter work across all records. |
| TC-E02 | No matching hospitals is handled. | A state and district search that matches nothing returns an `on_search` with an empty `providers[]`. Your app shows a fallback message, with no crash and no unhandled state. |
| TC-E03 | A missing response does not leave the user waiting. | When no `on_search` arrives, your app shows a timeout message after its configured window and lets the user retry. It never stays loading indefinitely. |

From `uhi.test.pmjay-hem-edge-cases`.

## Go-live checks every UHI service carries

Each service's go-live checklist carries these items. Work through them before
you request sign-off.

| # | Item |
| --- | --- |
| 1 | For an [EUA](/docs/uhi/v1/getting-started/glossary#eua), [Milestone 2](/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) completed |
| 2 | Ed25519 key pair generated with the Header Generation Utility; public key submitted |
| 3 | Sandbox registration form completed and sandbox access received |
| 4 | HTTPS callback URL live and reachable from the public internet |
| 5 | Request signing implemented: Ed25519 and BLAKE-512 |
| 6 | Asynchronous answers handled. Nothing blocks on a synchronous reply to `search` |
| 7 | Every test case for your service passed in sandbox |
| 8 | Sign-off requested with sandbox test evidence |

[Physical Consultation](/docs/uhi/v1/services/consultation#go-live-checklist)
carries its full twenty item checklist.

### Before you start

Your service page, with its own test cases and go-live checklist, and your role for that service.

### What happens

Treat each row as a pass or fail item that needs evidence. Items 1 to 4 are set up before you build. Items 5 and 6 live in your code. Items 7 and 8 close the list.

### How you know it worked

Each row has evidence: the Milestone 2 completion, the submitted public key, the sandbox access, a callback received on your public HTTPS URL, a signed call that is not refused, and every test case passed.

### When it goes wrong

An EUA without Milestone 2 cannot be onboarded onto any service, so item 1 blocks the rest. A callback URL reachable only inside your network fails item 4. A handler that waits on the reply to `search` for results fails item 6. For Physical Consultation, pass its twenty item list as well.

From `uhi.test.every-service-checks`.

## Run your UHI service's test cases

Build against the sample payloads on your service's page and the
[UHI API reference](/docs/uhi/v1/api). Then run every test case for that
service in the sandbox.

| Service | Test cases |
| --- | --- |
| [Physical Consultation](/docs/uhi/v1/services/consultation) | [Physical Consultation test cases](/docs/uhi/v1/resources/consultation) |
| [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem) | [PM-JAY HEM test cases](/docs/uhi/v1/resources/pmjay-hem) |
| [Blood Bank](/docs/uhi/v1/services/blood-bank) | [Blood Bank test cases](/docs/uhi/v1/resources/blood-bank) |
| [Ambulance Booking](/docs/uhi/v1/services/ambulance) | [Ambulance Booking test cases](/docs/uhi/v1/resources/ambulance) |
| [Jan Aushadhi](/docs/uhi/v1/services/jan-aushadhi) | [Jan Aushadhi test cases](/docs/uhi/v1/resources/jan-aushadhi) |
| [NOTTO](/docs/uhi/v1/services/notto) | [NOTTO test cases](/docs/uhi/v1/resources/notto) |

[Build it well](/docs/uhi/v1/getting-started/build-it-well#checked-for-every-service)
lists what every service is checked against.

**You get:** a passing sandbox integration.

### How you know it worked

Every test case on your service's test case page passes in the sandbox, along with the checks every service shares. Request sign-off only after that.

From `uhi.test.run-test-cases`.

## Record a demo and request UHI sign-off

Record your app running the service's flow, and send it to your
[NHA](/docs/uhi/v1/getting-started/glossary#nha) point of contact with a
request for sign-off.

The [recorded walkthroughs of UHI services in Aarogya Setu](https://drive.google.com/drive/folders/1JvlWPouPNlyfLT3RmsjuUzeAVkdhlKrD?usp=drive_link)
show each service running end to end. Watch the one for your service before
you build your [EUA](/docs/uhi/v1/getting-started/glossary#eua) screens. Your
sign-off demo follows the same flow.

**You get:** written sign-off.

### Before you start

Every test case for your service passes in the sandbox, and you have watched the recorded walkthrough for your service.

### How you know it worked

You hold written sign-off from your NHA point of contact. Do not switch to production values without it.

From `uhi.sandbox.demo-sign-off`.

## Switch your UHI integration to production

Change the IDs and callback URL your calls carry.

| Your role | Switch to production values |
| --- | --- |
| EUA | `consumer_id` and [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | `provider_id` and [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri) |

Then point your calls at the production
[UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway).

| Environment | UHI Gateway base URL |
| --- | --- |
| Sandbox | `https://uhigatewaysandbox.abdm.gov.in` |
| Production | `https://uhigateway.abdm.gov.in` |

In production you use your own endpoints, not the sandbox reference apps.

**You get:** a live integration on the production network.

### Before you start

You hold written sign-off from step 2.

### How you know it worked

A search sent to `https://uhigateway.abdm.gov.in` returns `200` with an `ACK`, and the answer arrives on your production callback URL, matched by `transaction_id`.

From `uhi.sandbox.production-switch`.

## When a UHI search fails after the switch to production

If a search that worked in the sandbox fails in production, check the Gateway
host first, then `consumer_id` and `consumer_uri` or their HSPA equivalents. A
`401` or `403` comes before any body: see
[Errors on UHI](/docs/uhi/v1/concepts/errors#http-statuses-before-the-body).

### What happens

A search that worked in the sandbox fails after the switch to production. Either a value still points at the sandbox, or the Gateway rejects the signature or the registration before it reads the body.

### When it goes wrong

Check in this order and stop at the first that fails. The host is `https://uhigateway.abdm.gov.in`, not `https://uhigatewaysandbox.abdm.gov.in`. An EUA sends production values in `consumer_id` and `consumer_uri`; an HSPA in `provider_id` and `provider_uri`. A `401` means the signature does not match the body sent, is reused or expired, or names the wrong key. A `403` means the public key is not registered or the registration is not yet active.

From `uhi.troubleshooting.go-live`.
