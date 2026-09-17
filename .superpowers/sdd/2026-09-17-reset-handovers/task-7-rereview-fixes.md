# Task 7 re-review fixes

Branch `feat/final-nha-swagger`. Findings from task-7-rereview.md.

| Id | Status | What changed |
|---|---|---|
| N1 | FIXED | Atoms sandbox/first-fifteen-minutes.md, sandbox/going-live.md, glossary/sandbox.md drop `abdm` X-CM-ID and abha.abdm.gov.in. Eval note confusable-sandbox-vs-prod-host-01 quotes the new line. atom-routes.json rebuilt (x-cm-id now routes to going-live). |
| N2 | FIXED | abha.md and phr.md say `!@#$^*_-`; handoff rows quote the raw regex exactly. |
| N3 / B7 | FIXED | gateway.md row deleted, "Two hosts"; glossary/gateway.md names dev.abdm.gov.in only. |
| N4 | FIXED | phr.md name@abdm row matches p1.mdx:87. |
| N5 | FIXED | registries/index.md, participants/doctor.md, nhpr/hfr.md ("them", "They come from"); handoff row 94 moved to Applied. |
| N6 | FIXED | All Borderline API rows resolved. Applied to pages and moved to Applied: data-flow curve, linking (subscribed HIU, two routes, unverified enum, generate link token, ABDM-9999), callback-never-arrives Set, consent-stuck error line, encryption utilities, hip-hiu link token and repeated-code sentence, m4 hprType, masked mobile, Submit result, p1 family/DigiLocker, ABHA OTP, required fields, default login row, p3 events and auto approval id, m1 ABHA app face capture, integrated programmes, required-ness, abha.md RD service and all numeric bullets, phr.md required fields, default login, events, edit fields, programme field, consent.md GRANTED/DENIED/EXPIRED (W6), hfr photographs and abdmSoftware, callback-authenticity wording, citizen year of birth, participants/phr linked, build-it-well kycVerified (3 rows), build-with-ai:57, first-fifteen-minutes 401, milestones/index family, whats-new:23 and :29 (W5). Kept as static with a reason: data-flow:79, linking:23, consent-stuck:32-35, :38-40, :45-47, 401:44-45, gateway:108, hip-hiu:83-84, m4:39-40, p2:42-43, m1:394, phr deep links, phr programme list, hfr ordering. |
| N7 | FIXED | p1.mdx:31 says eight; "mandatory" stays in the handoff. |
| N8 | FIXED | Every handoff row carries a bracketed reason; bare CORRECT rows carry target wording or became a QUESTION for the content session; row 392 is a KEEP with its ruling. Line numbers were not re-stamped row by row; the header says rows added today use today's lines. |
| N9 | FIXED | gateway.md:48, nhpr/index.md:31 and TOKEN_SOURCE.m4 in ingest-nha.mjs: "M4 declares bearer authentication. The HPID calls publish POST /getManagementToken." Specs regenerated, check:specs passes. |
| N10 | FIXED | `git rm --cached site/docs/hiecm/v3/reference/authentication.md`; build-api-reference.mjs:1029 writes it on every build. |
| N11 | FIXED | Journey titles: scan and pay HIP side, PHR side, details and version update; subscription HIU side; P3 PHR side; p2 profile. Id `p2-p2-switch-profile` is `p2-switch-profile`; no hand-written page or source linked it. Skills, skills-src and api-routes.json regenerated. |
| N12 | FIXED | going-live.mdx:82 production cell empty, as hip-hiu.md:32. |
| S7 | FIXED | build-with-ai.mdx:57 and whats-new:23 applied. |
| W9 | FIXED | uhi registries/hpr.md:28-29 and physical-consultation.md:122, 242 use `<HPR_ADDRESS>` and `<HPR_ID>`; git grep for the three values returns 0. |

Checks: lint:content, lint:atoms, lint:sources, validate:skills, check:plugins, check:routes, check:specs, lint:journeys, lint:tables, plan-check.sh, `go test ./...` all pass. `npm run build` exit 0, no tracked change after.

Grep proofs (catalogue/shared, site/docs, plugins, skills-src): `X-CM-ID: abdm` / abha.abdm.gov.in 0; apissbx 0; `!@#$%^&*-` 0 outside the handoff's Before column; "Aadhaar OTP, by auth mode" 0; "professional token in its header" / "Obtain both" 0.
