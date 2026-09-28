# ABDM Integrators Assistant

Three layers, each answering one question.

| Layer | Question | Lives in |
|---|---|---|
| Agent | What am I trying to accomplish, and what should I do next? | `agents/` |
| Skill | What is the correct way to perform this task? | `skills/` |
| Tool | What concrete operation can I execute? | HTTP, crypto, the validator, the codebase, the sandbox |

Commands under `commands/` are thin entry points into a skill or an agent, never a fourth layer.

## Agents

Three, and only three.

- `abdm-integration-agent` takes a goal such as "make my application an HIU", picks the module skills it needs, orders them by their `requires` and `produces`, and holds each step to its exit condition.
- `abdm-call-debugger` takes one failing call to a fix, verified by the original call succeeding. It reads each module's `references/debug.md`, which lists codes and operations but no fix per code, and carries no codes of its own.
- `fhir-compliance-agent` finds where a codebase generates FHIR, validates representative bundles, corrects the generator, and validates again. It orchestrates `abdm-fhir` and does not replace it.

## Skills

One folder per domain: `abdm-gateway`, `abdm-m1` to `abdm-m4`, `abdm-p1` to `abdm-p4`, `abdm-scan-and-register`, `abdm-scan-and-pay`, `abdm-record-share` and `abdm-fhir`. A domain is not one task. Its `SKILL.md` is a router and its capabilities sit under `references/`: scaffold builds the journeys flow by flow, integrate holds the calls and headers, debug walks a failed call to a fix, design holds what the journey around the calls must do. The journeys inside scaffold are the granular capabilities an agent sequences, for example consent request, consent status, health information fetch inside M3.

Every skill declares its role in frontmatter: `type: skill`, its `domain`, the `agent_consumers` that may dispatch it, what it `requires` and `produces`, and `can_orchestrate: false`. A skill is a known procedure from a known input to a known output. It never plans.

The skill folders are generated. `scripts/build-skills.mjs` writes them from the specifications, the journey files and `skills-src/`. Edit those, never `skills/`.

## The decision rule

Create an agent only when the work has this shape: a goal, an unknown next action, inspect, choose, act, interpret, choose again. A known input through a known procedure to a known output is a skill.

Do not create an agent per module. No M1 agent, no M3 agent, no Scan and Pay agent. A user with a goal should face one agent and its relevant skills, not a choice between thirteen. Statefulness alone does not justify an agent; M3 is stateful and the integration agent orchestrates it.
