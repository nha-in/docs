---
title: What's new
sidebar_label: What's new
sidebar_position: 0
description: Dated changes to these pages, newest first.
verification: unverified
source: repository README.md and catalogue/openapi/CONVENTIONS.md
---

# What's new

Dated changes to these pages, newest first. Each entry links to what you can now
read or do.

## 2026-09-02

### Milestones spell CARE, and each one has its own page

[Milestones](/docs/hiecm/v3/milestones) explains the four milestones in one word each,
Create, Attach, Retrieve, Enrol, and walks them through one patient's visits. Every
milestone, M1 to M4 and P1 to P3, now has a detail page with what it gives you, what you
need and the journey diagrams. The API reference links to them and stays a reference.

### Tell us who you are, and Get started fits itself to you

A "Who are you?" selector on [Get started](/docs/hiecm/v3) asks whether you are a health
facility, an IMS vendor, a patient app or still deciding, says in one line what that makes
you on ABDM, and shows the journey for that role. The patient app comes first wherever
roles are listed.

### Install tools opens in place

Install tools on any page opens a panel with agent setup, skills and the MCP server, so you
never leave the page you are reading.

### Methods are colour coded

GET, POST, PUT, PATCH and DELETE each have their own colour in the API reference sidebar
and on every endpoint page.

### Get started is now a launchpad, not an introduction

[Get started](/docs/hiecm/v3) opens with what you can do: build with AI in one command,
then cards for every step from finding your role to going live, and the common use cases
by system type. The Introduction page is gone. Every page in Get started now leads with
the action and ends with the next step.

### The landing page asks what you are building

Three intents, one per gateway: records to share, health services to offer, health
insurance to solve for. Hover any of them for the gateway's full name. Scrolling down
lands on Get started.

### Every page has Copy page, Open in ChatGPT, Open in Claude and Ask AI

The control on every doc page copies the page as Markdown, opens it as Markdown, hands
it to ChatGPT or Claude, or opens Ask AI with the page as context.

### The API reference speaks as the API

Reference pages describe what each operation accepts and returns and nothing else. What
a milestone is, and the order to build in, lives in [Your integration path](/docs/hiecm/v3/milestones).

## 2026-09-01

### Troubleshooting organised by what you see, not by error code

A new [Troubleshooting](/docs/hiecm/v3/troubleshooting/) section starts from the symptom in
front of you: the callback never arrives, everything returns 401, the OTP never arrives,
a call is accepted then nothing happens, a consent stays stuck in `Requested`. Each page
works through the checks in order and names what counts as proof the fix worked. The
[Error codes](/docs/hiecm/v3/reference/error-codes) reference now points here first for
anyone who has a symptom rather than a code.

### The M3 consent journey, drawn in three parts

[M3 user journeys](/docs/hiecm/v3/milestones/m3-journey) draws the whole
[consent](/docs/hiecm/v3/getting-started/glossary#consent-artefact) story as NHA's document
tells it: raising a consent request, the patient granting or denying it, and fetching the
records once an artefact exists. Two new flow atoms back the diagrams,
`hiecm.flow.m3-request-consent` and `hiecm.flow.m3-fetch-records`, so the sequence you read
here matches what the M3 API reference expects call by call.

### A first fifteen minutes that needs nothing but a browser

[Your first fifteen minutes](/docs/hiecm/v3/getting-started/first-fifteen-minutes) gives you
something to do while NHA reviews your sandbox registration: one gateway session call
transcribed from this repository's specification, and your own first call assembled with
the credential placeholders named for where they come from. The transcribed request is read
from the OpenAPI spec in this repository, not invented. The spec carries no captured response
body, only the field list, and the page says plainly which parts are observed and which are
not yet.

### Going live, in NHA's own order

[Going live](/docs/hiecm/v3/getting-started/going-live) states the sandbox exit process the
way NHA's FAQ and integration and exit process page describe it, including the Safe to Host
audit by a CERT-In empanelled auditor, and says plainly where NHA does not publish a detail
instead of guessing one in.

### Every doc page serves itself as markdown, for agents and people alike

Every documentation route now has a "Copy page as Markdown" and "View as Markdown" button,
and serves its own `index.md` alongside the rendered page. A repository-wide `llms.txt` and
`llms-full.txt`, plus one `llms.txt` per module, are built on every release so an agent can
retrieve exactly the page it needs without scraping HTML. See
[Build with AI](/docs/hiecm/v3/getting-started/build-with-ai) for the skills and the
[Docs MCP server](/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server) built on the same content.

### The homepage asks what you are trying to build

The homepage now opens with "What are you trying to build?" and routes by that answer, a
PHR app, a hospital or clinic system, a lab or pharmacy, an insurer, or not sure yet, before
it offers the gateway list. Each goal lands on
[What you can build](/docs/hiecm/v3/getting-started/what-you-can-build), which gives the
role and the milestones for that kind of system.

### Seven PHR operations renamed off their Postman "Copy" suffix

Seven operations in the P1 through P3 and PHR application services
references carried a " Copy" suffix inherited from NHA's Postman export.
Each was checked against the operation its name implied it duplicated. None
turned out to be a true duplicate: five have no other operation to
duplicate, and the other two point at a different host or a different API
entirely. Every one has been given a name that says what it does instead.
The corrections log records the comparison.

## 2026-08-25

### The PHR role has API references

Aarogya Setu is NHA's reference PHR, and its collection is now ingested and
split the way the provider milestones are, rather than landing as one file of
208 operations.

- [P1](/reference/hiecm-p1), identity and profile, 63 operations
- [P2](/reference/hiecm-p2), linking and records, 49 operations
- [P3](/reference/hiecm-p3), consent and notifications, 35 operations
- [PHR application services](/reference/hiecm-phr-services), 61 operations,
  which is **not** a certification milestone

The same calls and the same 422 PHR error codes apply to any PHR, not only to
Aarogya Setu. NHA has published no OpenAPI file for this role, so these are
derived from the collection rather than from a specification, and every
operation says so.

### M2 and M3 have real API references

NHA supplied an OpenAPI file for each of M1, M2 and M3, plus Postman
collections for all three. They are ingested, and the reference pages are
built from them rather than from prose.

The catalogue went from 35 documented operations to 69, and from 10 declared
callbacks to 12, five of which now carry a real payload.

- [M1 API reference](/reference/hiecm-m1), 44 operations, up from 32
- [M2 API reference](/reference/hiecm-m2), 10 operations, up from none
- [M3 API reference](/reference/hiecm-m3), 6 operations and 6 callbacks, up from none
- [Gateway reference](/reference/hiecm-gateway), 7 operations. NHA repeats
  this group in all three files, so it is described once

### What the new sources do not give you

NHA's three specifications describe **no callbacks at all**. What they model
as paths is the outbound half, the calls you make, including the `on-init`
and `on-notify` responses you send. What the gateway posts to your registered
URL is absent from every one of them.

For M3 that gap is filled from NHA's collection, which does carry the
payloads. For M2 only the data notification is available, so the remaining
M2 callbacks name a path and stop.

### Corrections against NHA's files

Five, all recorded in `catalogue/openapi/corrections/` rather than applied
silently: 52 em dashes rewritten, 8 references to components NHA never
defined, 26 UUID format assertions NHA's own examples contradict, 2 `hiType`
examples that disagreed with NHA's schema, and 1 example dropped for
violating the schema it illustrates.

Nothing in this release has been run against the ABDM sandbox. Every page and
every atom says `unverified`.

## 2026-08-24

### Read the HIE-CM modules

Three modules on the [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) gateway:

- [M1](/docs/hiecm/v3/api/m1), [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) identity
- [M2](/docs/hiecm/v3/api/m2), care context linking and
  [HIP](/docs/hiecm/v3/getting-started/glossary#hip) data sharing
- [M3](/docs/hiecm/v3/api/m3), consent and [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) data
  fetch

Start at [Overview](/docs/hiecm/v3).

These pages follow [NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s sandbox document pack.
Nothing in them has been run against the ABDM sandbox, so every page carries
`verification: unverified`. Where NHA's document pasted a request or response as
a screenshot, the text did not survive conversion, and the page says so instead
of guessing at a payload.

### Try the session token call

The session token call is the first call every module needs, and the one
operation with a working interactive reference. Send a request from
[/reference/hiecm-gateway](/reference/hiecm-gateway). The four module references
exist but carry no operations yet.

A callback appears on the module that owns it, as an OpenAPI 3.1 `webhook`,
because an [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) callback is an HTTPS POST to a URL
you registered.

| Interactive reference | Scope |
|---|---|
| [/reference/hiecm-gateway](/reference/hiecm-gateway) | Session token, used by all modules |
| [/reference/hiecm-m1](/reference/hiecm-m1) | M1, ABHA identity |
| [/reference/hiecm-m2](/reference/hiecm-m2) | M2, care context linking and HIP data sharing |
| [/reference/hiecm-m3](/reference/hiecm-m3) | M3, consent and HIU data fetch |
| [/reference/hiecm-m4](/reference/hiecm-m4) | M4, [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and [HFR](/docs/hiecm/v3/getting-started/glossary#hfr) registration |

### Find your way around M4, UHI and NHCX

No endpoint is documented yet for [M4](/docs/hiecm/v3/api/m4), for the
[UHI](/docs/hiecm/v3/getting-started/glossary#uhi) gateway at [/docs/uhi/v1](/docs/uhi/v1), or for
[NHCX](/docs/nhcx/v1). Those pages tell you what NHA publishes and where to read
it.

## How this page gets written

When NHA republishes a source a page here was written from, an entry is added
with the date, the source that changed, and the pages affected.

## 2026-08-24, the M1 agent skill

The M1 documentation is now published as an agent skill: one file carrying
every endpoint, the required headers, the two token rule and the encryption
rule. Download it, or install it with one command, from
[M1 APIs](/docs/hiecm/v3/api/m1/apis). It is generated from these pages on
every build, so a page that changes changes the skill.
