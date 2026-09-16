# 24 August 2026

4 changes

### Read the HIE-CM modules

Three modules on the [HIE-CM](/docs/main/docs/hiecm/v3/getting-started/glossary#hie-cm) gateway:

- [M1](/docs/main/docs/hiecm/v3/api/m1), [ABHA](/docs/main/docs/hiecm/v3/getting-started/glossary#abha) identity
- [M2](/docs/main/docs/hiecm/v3/api/m2), care context linking and [HIP](/docs/main/docs/hiecm/v3/getting-started/glossary#hip) data sharing
- [M3](/docs/main/docs/hiecm/v3/api/m3), consent and [HIU](/docs/main/docs/hiecm/v3/getting-started/glossary#hiu) data fetch

Start at [Overview](/docs/main/docs/hiecm/v3).

These pages follow the sandbox document pack. Nothing in them has been run against the ABDM sandbox, so every page carries `verification: unverified`. Where a request or response shape is not yet published, the page says so instead of guessing at a payload.

### Try the session token call

The session token call is the first call every module needs, and the one operation with a working interactive reference. Send a request from [/reference/hiecm-gateway](/docs/main/reference/hiecm-gateway). The four module references exist but carry no operations yet.

A callback appears on the module that owns it, as an OpenAPI 3.1 `webhook`, because an [ABDM](/docs/main/docs/hiecm/v3/getting-started/glossary#abdm) callback is an HTTPS POST to a URL you registered.

| Interactive reference                                          | Scope                                                                                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [/reference/hiecm-gateway](/docs/main/reference/hiecm-gateway) | Session token, used by all modules                                                                                                             |
| [/reference/hiecm-m1](/docs/main/reference/hiecm-m1)           | M1, ABHA identity                                                                                                                              |
| [/reference/hiecm-m2](/docs/main/reference/hiecm-m2)           | M2, care context linking and HIP data sharing                                                                                                  |
| [/reference/hiecm-m3](/docs/main/reference/hiecm-m3)           | M3, consent and HIU data fetch                                                                                                                 |
| [/reference/hiecm-m4](/docs/main/reference/hiecm-m4)           | M4, [HPR](/docs/main/docs/hiecm/v3/getting-started/glossary#hpr) and [HFR](/docs/main/docs/hiecm/v3/getting-started/glossary#hfr) registration |

### Find your way around M4, UHI and NHCX

No endpoint is documented yet for [M4](/docs/main/docs/hiecm/v3/api/m4), for the [UHI](/docs/main/docs/hiecm/v3/getting-started/glossary#uhi) gateway at [/docs/uhi/v1](/docs/main/docs/uhi/v1), or for [NHCX](/docs/main/docs/nhcx/v1). Those pages tell you what is published and where to read it.

### The M1 agent skill

The M1 documentation is now published as an agent skill: one file carrying every endpoint, the required headers, the two token rule and the encryption rule. Download it, or install it with one command, from [M1 APIs](/docs/main/docs/hiecm/v3/api/m1/apis). It is generated from these pages on every build, so a page that changes changes the skill.
