---
id: shared.sandbox.sandbox-to-hip-or-hiu-id
type: sandbox
gateway: shared
milestone: n/a
version: abdm-v3
title: From sandbox registration to a working HIP ID or HIU ID
summary: >
  The one procedure that takes you from no access to a facility your software
  can act for: get sandbox access, set where answers are sent, register the
  facility, and connect the facility to your software in a role.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/getting-started/sandbox.mdx
    fetched: 2026-10-03
    hash: sha256:f064694d25f7f6b75afaa5a78b1f6418459d53c09b9f77cd374b06053a1698ac
    note: >
      site/docs/hiecm/v3/getting-started/sandbox.mdx. The six stages, the
      request for access, the client id and secret, and the callback URL.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m4.mdx
    fetched: 2026-10-03
    hash: sha256:cd2d242bdd2f14137862c57fb2a04d9d88f9ab34b5df1a7c9dbde13bd212cccf
    note: >
      site/docs/hiecm/v3/milestones/m4.mdx. The two routes to a facility ID,
      journey 3 (onboarding a facility) and journey 4 (linking bridges to a
      facility), with the HIP name rules.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/registries/nhpr/hfr.md
    fetched: 2026-10-03
    hash: sha256:9e1bcd6be4a8d33e8be901327de5e22757aaeaaf62dc6eb48cb0fd7731b57e5d
    note: >
      site/docs/hiecm/v3/registries/nhpr/hfr.md. The five call onboarding
      order, the draft state, the HPR token and the facility ID format.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m2.mdx
    fetched: 2026-10-03
    hash: sha256:7547c4e326a6eb97ef5eea84731cf865839943b762c2c504232e597c96e2a84e
    note: site/docs/hiecm/v3/milestones/m2.mdx. The three prerequisites of M2.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/how-it-fits.mdx
    fetched: 2026-10-03
    hash: sha256:c603735571fe975231e42293df7a256b6f03efe6cefbebde4274b021d8697485
    note: >
      site/docs/hiecm/v3/concepts/how-it-fits.mdx. One bridge, many
      facilities, and which setting belongs to which level.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx
    fetched: 2026-10-03
    hash: sha256:c2311719e4e48a29283d5a5388aa0677b72a1a48433a1c5d2ce6cbb8867b75c6
    note: >
      site/docs/_notes/hiecm/m4_post_v1_bridges_mutiplehrpaddupdateservices.mdx.
      The bridge linkage call, its server and how to confirm it.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_service_serviceid_service_id.mdx
    fetched: 2026-10-03
    hash: sha256:11dc0526624d9e317aba6df34e518a5ccba3ec3ea6a2436d71d24b1ff7c306dd
    note: >
      site/docs/_notes/hiecm/gateway_get_gateway_v3_bridge_service_serviceid_service_id.mdx.
      The lookup that shows a service's roles.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/participants/insurer.md
    fetched: 2026-10-03
    hash: sha256:205732f02ad4fd044012b98dfbe4d590d801f530600905c5586516647caafbd5
    note: >
      site/docs/hiecm/v3/concepts/participants/insurer.md. What an HIU that
      is not a facility confirms at onboarding.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    hash: sha256:d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300
    note: The bridge URL, bridge services and bridge service by id operations.
related:
  sandbox:
    - shared.sandbox.first-fifteen-minutes
    - shared.sandbox.going-live
  flows:
    - hiecm.flow.m4-onboard-facility
    - hiecm.flow.m4-link-bridge
    - hiecm.flow.m4-create-hpid
  endpoints:
    - hiecm.endpoint.gateway-sessions
    - hiecm.endpoint.gateway-update-bridge-url
    - hiecm.endpoint.gateway-list-bridge-services
    - hiecm.endpoint.gateway-get-bridge-service-by-id
    - hiecm.endpoint.gateway-register-bridge-services
  concepts:
    - hiecm.concept.playbook-hip-software
    - hiecm.concept.playbook-hiu-software
    - hiecm.concept.playbook-phr-app
    - hiecm.concept.roles
  troubleshooting:
    - hiecm.troubleshooting.no-callback-on-my-server
  errors:
    - hiecm.error.abdm-1035
    - hiecm.error.abdm-1040
  glossary:
    - hiecm.glossary.bridge
    - shared.glossary.hfr
    - shared.glossary.sandbox
    - hiecm.glossary.hip
    - hiecm.glossary.hiu
---

# From sandbox registration to a working HIP ID or HIU ID

## In plain words

Before your software can share or read health records in ABDM, four things
have to exist, and they are set up in this order.

1. **Access.** Your organisation is approved to use the sandbox, the test
   environment, and receives its keys.
2. **An address for answers.** ABDM sends most answers to your server later,
   so it needs to know where your server is.
3. **A registered facility.** The hospital, clinic, lab or pharmacy is
   entered in the national list of health facilities and receives a facility
   ID.
4. **A connection between the two.** The facility is connected to your
   software, and the connection says what the facility does through it:
   share records, read records, or both.

The ID you then send as the HIP ID or the HIU ID is that facility's ID. HIP
means the facility shares records. HIU means it reads them. One facility can
be connected in both roles.

Integrating with ABDM as a whole has six stages. This procedure is stage 1,
stage 2 and the setup that stage 3 needs. Which APIs you then build depends
on what you are building: a [PHR app](../../hiecm/concepts/playbook-phr-app.md),
[software for a HIP](../../hiecm/concepts/playbook-hip-software.md) or
[software for a HIU](../../hiecm/concepts/playbook-hiu-software.md).

| Stage | What happens |
| --- | --- |
| 01. Send Request | Submit a request to access the ABDM Sandbox APIs |
| 02. Get Access | Receive sandbox access after approval by the Health Tech Committee |
| 03. Integrate APIs | Integrate the applicable ABDM APIs with your software |
| 04. Complete Functional Testing and Security Audit | Test the integrated solution and complete the security audit |
| 05. Complete the Health Tech Committee Demonstration | Present the solution and obtain approval for production access |
| 06. Go Live | Move the approved integration to production |

Stages 4 to 6 are told as one procedure in [going live](going-live.md).

## Before you start

You need an organisation to register, and a URL on your server that ABDM can
post to from the public internet.

To register a facility through the APIs you also need a person at the
facility who holds an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid)
with facility manager rights. The facility calls take that person's token,
not your client credentials.

## What happens

### 1. Request sandbox access

Submit the request for sandbox access with your organisation, product and
contact details, and select the integration category. Access is granted
after approval by the
[Health Tech Committee](/docs/hiecm/v3/getting-started/glossary#health-tech-committee).
See [sandbox access](/docs/hiecm/v3/getting-started/sandbox).

### 2. Collect your client id and client secret

Once approved, sign in to the sandbox application. Your `clientId` and
`clientSecret` are issued there. Exchange them for an access token with
`POST /api/hiecm/gateway/v3/sessions` on `https://dev.abdm.gov.in`, with the
header `X-CM-ID: sbx`.

### 3. Register your callback URL

Register one base URL. It belongs to your integration, which ABDM calls your
[bridge](/docs/hiecm/v3/getting-started/glossary#bridge), and never to a
facility. One URL covers every facility your software serves.

Set it with `PATCH /api/hiecm/gateway/v3/bridge/url`, sending the address in
`url`. A `202` with no body confirms it.

### 4. Get the facility into the Health Facility Registry

The facility needs a facility ID from the
[HFR](/docs/hiecm/v3/getting-started/glossary#hfr). There are two routes.

- **The NHPR portal.** The facility is registered directly on the portal.
  Many products do this and never build M4.
- **The M4 APIs.** Your software registers the facility: one search, three
  updates and a final submission. See
  [onboarding a facility](/docs/hiecm/v3/milestones/m4#m4-onboard-facility).

On the API route, the facility stays in Draft until the submit call is made.
A draft facility is not visible on ABDM and has no ID to link.

A facility ID is 12 characters and begins with `IN`.

### 5. Link the facility to your bridge, with a role

A facility ID alone does not enable record exchange. Link the facility to
your bridge, once for each role it takes. This can be done on the NHPR
portal, or with the M4 call
`POST /v1/bridges/MutipleHRPAddUpdateServices`, which goes to the registry
server `https://apihspsbx.abdm.gov.in/v4/int` and not to the gateway.

The call carries `facilityId`, `facilityName` and one `HRP` entry per role,
each with `bridgeId`, `hipName`, `type` and `active`.

- `type` is `HIP` or `HIU`. A facility that shares and reads needs one entry
  of each, not one entry that claims both.
- `bridgeId` comes from your sandbox registration.
- `hipName` is the name a patient sees when they search for the facility in
  their app. It is 15 characters or fewer, has no special characters, and is
  unique for every bridge linked to the same facility.

### 6. Use the facility ID as the HIP ID or the HIU ID

Send the facility's ID in `X-HIP-ID` on the calls it makes as a HIP, and in
`X-HIU-ID` on the calls it makes as an HIU. Callbacks to your bridge carry
the same header, and that is how your handler knows which facility a callback
is for.

An HIU that is not a health facility, such as an insurer, is a separate
case. The HFR does not list insurers, so confirm at onboarding which registry
entry your organisation holds.

## How you know it worked

- `GET /api/hiecm/gateway/v3/bridge-services` returns a `bridge` object
  holding the `url` you registered, with `active` true, and a `services` list
  that names the facility with the type you linked.
- `GET /api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` returns
  the facility with `active` true and `isHip` or `isHiu` true.
- The flow the link unblocks now runs. With an active HIP link, a generate
  link token call is no longer refused with `ABDM-1035`, "Invalid HIP ID".
  With an active HIU link, a consent request is accepted.

## When it goes wrong

- **You are waiting for approval.** Sandbox access is granted by the Health
  Tech Committee, and nothing you call speeds it up. If you hear nothing,
  raise it through [Support](/docs/support). Use the wait:
  [your first fifteen minutes](first-fifteen-minutes.md) needs no credentials.
- **`ABDM-1035`, "Invalid HIP ID".** The facility is not registered, your
  software is not linked to it, or the ID belongs to the other environment.
  Retrying does not change it.
- **`ABDM-1040`, "Invalid HIU ID".** The entity is not registered in the HIU
  role, or `X-HIU-ID` carries the HIP's ID.
- **The bridge linkage call answers 404.** Check `facilityId` and the path
  spelling `MutipleHRPAddUpdateServices`.
- **The `hipName` is refused.** It is longer than 15 characters, carries a
  special character, or is already used by another bridge on that facility.
- **Calls are accepted and no callback arrives.** See
  [no callback reaches my server](../../hiecm/troubleshooting/no-callback-on-my-server.md).
- **A callback URL or a client secret is stored per facility.** Both belong
  to your integration. Either survives the first facility and fails on the
  next.

## Questions this answers

- How can I register my facility in the sandbox environment or obtain a HIP-ID/HIU-ID?
- how can I integrate with ABDM
- What are the steps of sandbox integration?
- How do I link my facility to my bridge as a HIP or HIU?
- Do I need M4 to get a facility ID?
- Where do I set my callback URL?
