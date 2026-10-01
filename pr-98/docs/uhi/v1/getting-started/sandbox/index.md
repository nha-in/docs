# Get your sandbox credentials

Every [UHI](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi) call is signed with your own key, and every participant is known by a subscriber ID. Here is how you get both.

## In short

- An [EUA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#eua) must complete [Milestone 2](/docs/pr-98/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hie-cm) first.
- Generate an Ed25519 key pair before you register. The registration form asks for the public key.
- Registration gives you a subscriber ID and sandbox access.
- Every answer arrives later on your own public HTTPS callback URL.

## From sandbox to production

Onboarding runs in six steps. This page covers the first three. The last three are on [Go live](/docs/pr-98/docs/uhi/v1/getting-started/going-live).

| Step | What you do                                                                               | What you get                     | Where                                                                                                  |
| ---- | ----------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1    | Express intent to your NHA point of contact                                               | Onboarding kick-off              | [Step 1](#1-express-intent)                                                                            |
| 2    | Generate your key pair with the header generator utility                                  | Public and private key           | [Step 2](#2-generate-your-key-pair)                                                                    |
| 3    | Submit the sandbox registration form with your role, callback URL and public key          | Subscriber ID and sandbox access | [Step 3](#3-submit-the-sandbox-registration-form)                                                      |
| 4    | Build against the sample payloads and the Gateway spec, then run the service's test cases | Passing sandbox integration      | [Go live](/docs/pr-98/docs/uhi/v1/getting-started/going-live#1-build-and-run-your-services-test-cases) |
| 5    | Record a demo and request sign-off                                                        | Written sign-off                 | [Go live](/docs/pr-98/docs/uhi/v1/getting-started/going-live#2-record-a-demo-and-request-sign-off)     |
| 6    | Switch your IDs and callback URL to production values                                     | Live on the production network   | [Go live](/docs/pr-98/docs/uhi/v1/getting-started/going-live#3-switch-to-production)                   |

## Before you start

- **Milestone 2 on HIE-CM, for an EUA.** This is a hard prerequisite. An app that has not completed [M2](/docs/pr-98/docs/hiecm/v3/milestones/m2) cannot be onboarded onto any UHI service.
- **A public HTTPS callback URL.** Results never come back on the request. They arrive later on this URL: [`consumer_uri`](/docs/pr-98/docs/uhi/v1/getting-started/glossary#consumer-uri) for an EUA, [`provider_uri`](/docs/pr-98/docs/uhi/v1/getting-started/glossary#provider-uri) for an [HSPA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hspa).
- **An Ed25519 key pair.** You generate it in step 2 and share only the public key.
- **Async handling.** Your code must accept an `ACK` now and the real answer later, matched by `transaction_id`. See [Messages and callbacks](/docs/pr-98/docs/uhi/v1/concepts/messages).

## 1. Express intent

Tell your [NHA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#nha) point of contact which service you want to integrate, and in which role. [Services](/docs/pr-98/docs/uhi/v1/services) lists the six, and which roles each one is open to.

**You get:** the onboarding kick-off.

## 2. Generate your key pair

Clone the [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) and run it. It generates your Ed25519 key pair, and later signs each payload for you, so you do not implement Ed25519 and BLAKE-512 from scratch.

Keep the private key on your server. You share only the public key.

**You get:** a public key and a private key. See [Signing](/docs/pr-98/docs/uhi/v1/concepts/signing).

## 3. Submit the sandbox registration form

Submit the sandbox registration form with three things:

| Field        | What to give                                                    |
| ------------ | --------------------------------------------------------------- |
| Role         | EUA or HSPA                                                     |
| Callback URL | Your public HTTPS `consumer_uri`, or `provider_uri` for an HSPA |
| Public key   | The public half of the key pair from step 2                     |

**You get:** a subscriber ID, a public key ID and sandbox access. The utility signs with both IDs, so keep them.

### Open the form

[Open the sandbox registration form](https://sbxai.abdm.gov.in)

## 4. Note the base URLs

| Environment | [UHI Gateway](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi-gateway) base URL | Reference apps                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Sandbox     | `https://uhigatewaysandbox.abdm.gov.in`                                              | Reference EUA `http://uhieuasandbox.abdm.gov.in/api/v1/euaService`; reference HSPA `https://hspasbx.abdm.gov.in/api/v1/hspa` |
| Production  | `https://uhigateway.abdm.gov.in`                                                     | Your own production endpoints                                                                                                |

A third host, `https://uhigatewaybeta.abdm.gov.in`, is for use only when asked at onboarding. [Routes](/docs/pr-98/docs/uhi/v1/concepts/routes#gateway-endpoints) lists every Gateway endpoint under these hosts.

## What you see when it works

You hold three things: a subscriber ID, a public key ID, and a private key that never leaves your server. Your callback URL is registered against them. Nothing has been called yet.

## Next

[Send your first search](/docs/pr-98/docs/uhi/v1/getting-started/first-fifteen-minutes).
