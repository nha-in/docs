---
name: dpg-governance
description: 'The digital public good constraint on the ABDM Developer Portal: FOSS licensing, no dependency on Eka infrastructure or APIs, the overlay repo boundary for vendor-specific content, governance files, and the acceptance test that proves decoupling. Use whenever anything touches licensing, vendor-specific content, hosting dependencies, contribution process, or when someone proposes adding an Eka endpoint, credential format or URL to the core Catalogue. Also use before any public release.'
plan_version: 2026.08.31
plan_source: abdm-v1-phase1-architecture-and-plan.md
plan_hash: sha256:4be567f1afffd4389e5a8e8d4444b9f90a2ca17bb1393f28afb15405fe97e4fa
compiled_from_plan: true
---

# DPG Governance

The framework is a digital public good. Anyone must be able to run it end to end against NHA's sandbox with zero involvement from any single vendor. We build it for everyone and are the first adopter, not the owner of a dependency.

This is a constraint, not an aspiration, and it is the one most likely to erode quietly.

## The acceptance test

Decoupling is proven operationally, not asserted.

> A team with only NHA sandbox credentials, a laptop and a container runtime can clone the repo, build the docs, install the skills, and follow M1 to a successful sandbox call, having never contacted Eka.

Nothing runs this. No job in any of the five workflows performs it, and no script in `scripts/` does either. It is a test someone has to sit down and do by hand, and the release is blocked by whoever decides to block it. It is the difference between open source and Eka-shaped software with a licence file, which is exactly why it should not be described as automatic. Do not tell anyone CI proves the decoupling for them.

## What lives where

| Content | Core Catalogue | Overlay repo |
|---|---|---|
| NHA endpoints, callbacks, error codes | Yes | No |
| NHA functional test cases | Yes | No |
| FHIR profiles per record type | Yes | No |
| Gateway concepts and glossary | Yes | No |
| Sandbox registration with NHA | Yes | No |
| A vendor's wrapper endpoints | No | Yes |
| Vendor credential formats | No | Yes |
| Vendor-specific headers | No | Yes |
| Vendor console screenshots or flows | No | Yes |
| A vendor's bridge identifier | No | Yes |

The overlay repo depends on the Catalogue. The Catalogue never depends on the overlay. This direction is the whole architecture of the constraint.

## The lint rule

There is no lint rule for this yet. `prose.no-vendor-url` is the intended rule, blunt by design: fail the build on any vendor hostname in the core Catalogue, no exemptions, and when it fires the content moves to the overlay. Nothing in `scripts/` implements it today, so the boundary is held by review. Do not tell anyone the build will catch a vendor URL for them.

## Governance files, required at first public tag

| File | Must say |
|---|---|
| `LICENSE` | A neutral OSI licence. MIT or Apache 2.0. |
| `CONTRIBUTING.md` | How to propose an atom, the review standard, the writing guide, the verification requirement |
| `SECURITY.md` | How to report a vulnerability, and the rule that no credential or patient data ever enters the repo |
| `GOVERNANCE.md` | Who decides, how a decision is recorded, how a new maintainer is added, how another organisation adds content |
| `CODE_OF_CONDUCT.md` | Standard adoption |

`GOVERNANCE.md` is the one people skip and the one that matters for DPG registry listing. It must answer: what happens when Eka and another contributor disagree?

## Contribution path for other organisations

The framework is credible only if someone else can contribute meaningfully. In practice:

- Anyone can open a pull request with an atom
- The verification requirement applies equally: their claim of `verified` needs a recorded response like anyone else's
- Another organisation can add its own overlay without asking permission
- Nobody needs Eka's infrastructure to test their contribution

## Hosting dependencies

Everything is self-hosted from day one: no hosted-Scalar phase, no vendor cloud dependency. Docusaurus with the MIT Scalar packages vendored at build time, nothing loading from a CDN, every Scalar cloud touchpoint off (request proxy, Ask AI, hosted API client link, telemetry, platform toolbar). The exit is already taken, and kept open by the content rules in `scalar-docs`: plain markdown, MDX only for callouts and steps, every page readable as raw `.md`. The handover unit is one compose file: the docs-mcp distroless image plus stock Ollama with the model volume.

The test: could this Catalogue be rendered by a different static site generator in a week, losing only visual polish? If the answer becomes no, the constraint has eroded.

## Review questions before any public release

- [ ] Has someone run the decoupling acceptance test by hand and said it passed? CI does not run it
- [ ] Has someone read the core Catalogue for vendor hostnames? `prose.no-vendor-url` is not implemented, so there is nothing to pass
- [ ] Are all five governance files present and current?
- [ ] Is the licence neutral and applied to every file?
- [ ] Can a page be read as raw markdown with nothing lost but styling?
- [ ] Does any documented workflow require an account with a specific vendor?
- [ ] Does `GOVERNANCE.md` answer the disagreement question?

## When someone proposes vendor content in the core

The answer is not no. The answer is: that belongs in the overlay, here is how to add it there, and here is what the core needs instead if the underlying need is real.

Usually the underlying need is real and generic. "We need to document how to register a webhook" is a core need. "We need to document how to register a webhook in our console" is overlay.

## Related

- Where new things belong: `portal-architecture`
- Content portability rules: `scalar-docs`
- The lint rules: `catalogue-linting`
