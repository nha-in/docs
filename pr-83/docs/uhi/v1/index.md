# Get started

Connect your app to the Unified Health Interface ([UHI](/docs/pr-83/docs/uhi/v1/getting-started/glossary#uhi)) network.

## What is UHI?

UHI stands for Unified Health Interface. It is an open network under the Ayushman Bharat Digital Mission ([ABDM](/docs/pr-83/docs/uhi/v1/getting-started/glossary#abdm)) that connects patient apps to health service providers.

A patient opens one app and finds a doctor, a PM-JAY hospital, blood, an ambulance, a Jan Aushadhi Kendra or an organ transplant hospital. The app does not need a separate deal with each provider. It joins the network once, and every provider on the network can answer it.

### Where UHI sits in ABDM

ABDM has two layers. The identity layer says who is who. The service layer moves health information, claims and services between systems through three gateways, and UHI is the one for services.

| Layer          | Parts                                                                                                                            | What they do                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Service layer  | [HIE-CM](/docs/pr-83/docs/hiecm/v3), [NHCX](/docs/pr-83/docs/nhcx/v1) and UHI                                                    | HIE-CM exchanges health records with consent, NHCX exchanges insurance claims, and UHI lets patients find and use health services |
| Identity layer | [ABHA](/docs/pr-83/docs/uhi/v1/getting-started/glossary#abha) and the national registries of health professionals and facilities | Identify patients, doctors and facilities                                                                                         |

### Why an open network

Today patients and providers are spread across separate apps and portals. Finding a service depends on which app a patient happens to use, and many services can only be found offline.

- **For a provider,** joining UHI once makes its services findable in every app on the network.
- **For an app,** joining once reaches every provider on the network, so it offers more services without a deal with each one.
- **For a patient,** the app they already use can find and book services from many providers.

### Who takes part

- **The patient app**, called an End User Application ([EUA](/docs/pr-83/docs/uhi/v1/getting-started/glossary#eua)). It is the app a patient or caregiver uses, such as Aarogya Setu or the [ABHA](/docs/pr-83/docs/uhi/v1/getting-started/glossary#abha) app.
- **The provider platform**, called a Health Service Provider Application ([HSPA](/docs/pr-83/docs/uhi/v1/getting-started/glossary#hspa)). It is the system behind a hospital network, a blood bank, a Jan Aushadhi Kendra or an ambulance fleet.
- **The [UHI Gateway](/docs/pr-83/docs/uhi/v1/getting-started/glossary#uhi-gateway)**, run by the National Health Authority ([NHA](/docs/pr-83/docs/uhi/v1/getting-started/glossary#nha)).

### What the UHI Gateway does

The Gateway works like a switchboard for searches. When a patient searches, the app sends one request to the Gateway. The Gateway checks who sent it, passes it to every provider that offers that service, and passes each answer back. The patient sees results from many providers at once.

The Gateway only helps the patient find. Once the patient picks a provider, the app and that provider talk to each other directly to book, track and cancel.

### The four stages: DOFP

A service can take a patient through up to four stages: Discovery, Order, Fulfilment and Post-fulfilment, or DOFP.

| Stage           | What happens                     | In Physical Consultation                                            |
| --------------- | -------------------------------- | ------------------------------------------------------------------- |
| Discovery       | The patient finds what they need | Doctors near home, with fees and free slots                         |
| Order           | The patient chooses and books    | A slot is held, the terms are agreed and a PIN is issued            |
| Fulfilment      | The service is delivered         | The patient checks in with the PIN and the visit is marked complete |
| Post-fulfilment | What comes after                 | Cancelling the appointment, or messaging the clinic                 |

### How far each service goes

Some services stop at discovery: the patient finds what they need, then calls ahead or visits. Physical Consultation goes all the way.

| Service                                                                | Discovery | Order               | Fulfilment | Post-fulfilment | Who answers the search                         |
| ---------------------------------------------------------------------- | --------- | ------------------- | ---------- | --------------- | ---------------------------------------------- |
| [Physical Consultation](/docs/pr-83/docs/uhi/v1/services/consultation) | Yes       | Yes                 | Yes        | Yes             | Any registered provider platform               |
| [Ambulance Booking](/docs/pr-83/docs/uhi/v1/services/ambulance)        | Yes       | A quote, in Phase 1 | Phase 2    | Phase 2         | Any registered ambulance platform              |
| [PM-JAY HEM](/docs/pr-83/docs/uhi/v1/services/pmjay-hem)               | Yes       | No                  | No         | No              | NHA                                            |
| [Blood Bank](/docs/pr-83/docs/uhi/v1/services/blood-bank)              | Yes       | No                  | No         | No              | e-RaktKosh, and any approved blood bank system |
| [Jan Aushadhi](/docs/pr-83/docs/uhi/v1/services/jan-aushadhi)          | Yes       | No                  | No         | No              | PMBI                                           |
| [NOTTO](/docs/pr-83/docs/uhi/v1/services/notto)                        | Yes       | No                  | No         | No              | NOTTO                                          |

A discovery-only service still does real work. PM-JAY HEM, for example, shows which hospitals are empanelled today and the PM-JAY contact at each one, so the patient knows where to go and whom to call.

The technical identity of each service is on its [service page](/docs/pr-83/docs/uhi/v1/services).

## Choose your role

| If you                                      | You are | You build                                                                                            |
| ------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Build a patient-facing app                  | An EUA  | The search, your callback endpoints, and the screens that render results                             |
| Run a provider system that answers searches | An HSPA | A `search` endpoint that answers from your own registry, and the booking calls your service supports |

You can be an HSPA only for Physical Consultation, Blood Bank Discovery and Ambulance Booking. For the other three, the HSPA already exists and you build only the EUA.

An EUA must complete [Milestone 2](/docs/pr-83/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/pr-83/docs/uhi/v1/getting-started/glossary#hie-cm) before it can be onboarded onto any UHI service.

## Start building

[Get your sandbox credentials](/docs/pr-83/docs/uhi/v1/getting-started/sandbox)

[Generate your key pair and register for a subscriber ID.](/docs/pr-83/docs/uhi/v1/getting-started/sandbox)

[Quickstart](/docs/pr-83/docs/uhi/v1/getting-started/first-fifteen-minutes)

[Send your first PM-JAY hospital search in four steps.](/docs/pr-83/docs/uhi/v1/getting-started/first-fifteen-minutes)

[Services](/docs/pr-83/docs/uhi/v1/services)

[What each service does and which one to build first.](/docs/pr-83/docs/uhi/v1/services)

[Build with AI](/docs/pr-83/docs/uhi/v1/getting-started/build-with-ai)

[The Docs MCP server and Ask AI for your coding agent.](/docs/pr-83/docs/uhi/v1/getting-started/build-with-ai)

[Build it well](/docs/pr-83/docs/uhi/v1/getting-started/build-it-well)

[Matching callbacks, fresh signatures, timeouts and screens.](/docs/pr-83/docs/uhi/v1/getting-started/build-it-well)

[Go live](/docs/pr-83/docs/uhi/v1/getting-started/going-live)

[Test cases, the sign-off demo and the switch to production.](/docs/pr-83/docs/uhi/v1/getting-started/going-live)

## More resources

[Explore every API](/docs/pr-83/docs/uhi/v1/api)

[The UHI Gateway and service calls, one page each.](/docs/pr-83/docs/uhi/v1/api)

[How messages and callbacks work](/docs/pr-83/docs/uhi/v1/concepts/messages)

[The `context` block, the `ACK`, and matching the answer.](/docs/pr-83/docs/uhi/v1/concepts/messages)

[Which calls go through the Gateway](/docs/pr-83/docs/uhi/v1/concepts/routes)

[Gateway routes, and the direct calls between EUA and HSPA.](/docs/pr-83/docs/uhi/v1/concepts/routes)

## Next

[Get your sandbox credentials](/docs/pr-83/docs/uhi/v1/getting-started/sandbox).
