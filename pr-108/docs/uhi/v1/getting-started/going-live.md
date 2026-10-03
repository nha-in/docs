# Go live

Working in the sandbox is not the same as being live. Steps 4 to 6 of [onboarding](/docs/pr-108/docs/uhi/v1/getting-started/sandbox#from-sandbox-to-production) sit between the two: test, sign-off, then the switch to production.

## In short

- Build against the sample payloads and the Gateway spec, then run your service's test cases.
- Record a demo of your app running the service's flow, and request sign-off.
- Sign-off arrives in writing.
- Go live by switching your IDs and callback URL to production values.

## Prerequisites

You hold a subscriber ID and sandbox access from [Get your sandbox credentials](/docs/pr-108/docs/uhi/v1/getting-started/sandbox), and your first search works end to end in the [Quickstart](/docs/pr-108/docs/uhi/v1/getting-started/first-fifteen-minutes).

## 1. Build and run your service's test cases

Build against the sample payloads on your service's page and the [UHI API reference](/docs/pr-108/docs/uhi/v1/api). Then run every test case for that service in the sandbox.

| Service                                                                 | Test cases                                                                          |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Physical Consultation](/docs/pr-108/docs/uhi/v1/services/consultation) | [Physical Consultation test cases](/docs/pr-108/docs/uhi/v1/resources/consultation) |
| [PM-JAY HEM](/docs/pr-108/docs/uhi/v1/services/pmjay-hem)               | [PM-JAY HEM test cases](/docs/pr-108/docs/uhi/v1/resources/pmjay-hem)               |
| [Blood Bank](/docs/pr-108/docs/uhi/v1/services/blood-bank)              | [Blood Bank test cases](/docs/pr-108/docs/uhi/v1/resources/blood-bank)              |
| [Ambulance Booking](/docs/pr-108/docs/uhi/v1/services/ambulance)        | [Ambulance Booking test cases](/docs/pr-108/docs/uhi/v1/resources/ambulance)        |
| [Jan Aushadhi](/docs/pr-108/docs/uhi/v1/services/jan-aushadhi)          | [Jan Aushadhi test cases](/docs/pr-108/docs/uhi/v1/resources/jan-aushadhi)          |
| [NOTTO](/docs/pr-108/docs/uhi/v1/services/notto)                        | [NOTTO test cases](/docs/pr-108/docs/uhi/v1/resources/notto)                        |

[Build it well](/docs/pr-108/docs/uhi/v1/getting-started/build-it-well#checked-for-every-service) lists what every service is checked against.

**You get:** a passing sandbox integration.

Notes for AI agents

**How you know it worked.** Every test case on your service's test case page passes in the sandbox, along with the checks every service shares. Request sign-off only after that.

## 2. Record a demo and request sign-off

Record your app running the service's flow, and send it to your [NHA](/docs/pr-108/docs/uhi/v1/getting-started/glossary#nha) point of contact with a request for sign-off.

The [recorded walkthroughs of UHI services in Aarogya Setu](https://drive.google.com/drive/folders/1JvlWPouPNlyfLT3RmsjuUzeAVkdhlKrD?usp=drive_link) show each service running end to end. Watch the one for your service before you build your [EUA](/docs/pr-108/docs/uhi/v1/getting-started/glossary#eua) screens. Your sign-off demo follows the same flow.

**You get:** written sign-off.

Notes for AI agents

**Before you start.** Every test case for your service passes in the sandbox, and you have watched the recorded walkthrough for your service.

**How you know it worked.** You hold written sign-off from your NHA point of contact. Do not switch to production values without it.

## 3. Switch to production

Change the IDs and callback URL your calls carry.

| Your role                                                      | Switch to production values                                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| EUA                                                            | `consumer_id` and [`consumer_uri`](/docs/pr-108/docs/uhi/v1/getting-started/glossary#consumer-uri) |
| [HSPA](/docs/pr-108/docs/uhi/v1/getting-started/glossary#hspa) | `provider_id` and [`provider_uri`](/docs/pr-108/docs/uhi/v1/getting-started/glossary#provider-uri) |

Then point your calls at the production [UHI Gateway](/docs/pr-108/docs/uhi/v1/getting-started/glossary#uhi-gateway).

| Environment | UHI Gateway base URL                    |
| ----------- | --------------------------------------- |
| Sandbox     | `https://uhigatewaysandbox.abdm.gov.in` |
| Production  | `https://uhigateway.abdm.gov.in`        |

In production you use your own endpoints, not the sandbox reference apps.

**You get:** a live integration on the production network.

Notes for AI agents

**Before you start.** You hold written sign-off from step 2.

**How you know it worked.** A search sent to `https://uhigateway.abdm.gov.in` returns `200` with an `ACK`, and the answer arrives on your production callback URL, matched by `transaction_id`.

## What you see when it works

A search your app sends to `https://uhigateway.abdm.gov.in` returns `200` with an `ACK`, and the answer arrives on your production callback URL, matched by `transaction_id`.

## When it goes wrong

If a search that worked in the sandbox fails in production, check the Gateway host first, then `consumer_id` and `consumer_uri` or their HSPA equivalents. A `401` or `403` comes before any body: see [Errors on UHI](/docs/pr-108/docs/uhi/v1/concepts/errors#http-statuses-before-the-body).

Notes for AI agents

**What happens.** A search that worked in the sandbox fails after the switch to production. Either a value still points at the sandbox, or the Gateway rejects the signature or the registration before it reads the body.

**When it goes wrong.** Check in this order and stop at the first that fails. The host is `https://uhigateway.abdm.gov.in`, not `https://uhigatewaysandbox.abdm.gov.in`. An EUA sends production values in `consumer_id` and `consumer_uri`; an HSPA in `provider_id` and `provider_uri`. A `401` means the signature does not match the body sent, is reused or expired, or names the wrong key. A `403` means the public key is not registered or the registration is not yet active.

## Next steps

- Add the next service to your app: [Services](/docs/pr-108/docs/uhi/v1/services).
- Ask about sign-off or production access: [Support](/docs/pr-108/docs/support).
