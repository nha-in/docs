# UHI Integrators Assistant

Three layers, each answering one question.

| Layer | Question | Lives in |
|---|---|---|
| Agent | What am I trying to accomplish, and what should I do next? | `agents/` |
| Skill | What is the correct way to perform this task? | `skills/` |
| Tool | What concrete operation can I execute? | HTTP, signing, the network registry, the codebase, the sandbox |

Commands under `commands/` are thin entry points into a skill or an agent, never a fourth layer.

## Agents

Two, and only two.

- `uhi-integration-agent` takes a goal such as "make our clinic's doctors bookable", picks the role and the service skills it needs, orders them by their `requires` and `produces`, and holds each step to its exit condition.
- `uhi-call-debugger` takes one failing call or one missing callback to a fix, verified by the original step succeeding. It reads each service's `references/debug.md` and carries no causes of its own.

## Commands

- `/uhi-preflight [service]` checks what must be true before the first call: subscriber ID, key pair, a reachable callback URL, fresh IDs, and for an EUA, Milestone 2 on HIE-CM.
- `/uhi-prove-signing` signs one PM-JAY HEM search and proves the header against the sandbox Gateway before a flow is built on it.
- `/uhi-decode-response` turns an HTTP status, an ACK or NACK, an error object or a silence into its most likely cause and the next check.

## Skills

One folder per service: `uhi-consultation`, `uhi-ambulance`, `uhi-pmjay-hem`, `uhi-blood-bank`, `uhi-jan-aushadhi` and `uhi-notto`. A service is not one task. Its `SKILL.md` is a router and its capabilities sit under `references/`: scaffold builds the journeys one at a time, design holds what the screens must do, integrate holds the hosts, headers, signing and the context block, debug walks a failed call or a missing callback to a fix, and test runs the service's test cases and the go-live steps.

Each skill installs and runs alone. It repeats what it needs of signing, the registry lookup and the context block rather than depending on another skill.

Every skill declares its role in frontmatter: `type: skill`, its `domain`, the `agent_consumers` that may dispatch it, what it `requires` and `produces`, and `can_orchestrate: false`. A skill is a known procedure from a known input to a known output. It never plans.

The skill folders are generated from the UHI specification, the journey files and `skills-src/`. Edit those, never `skills/`.

## Before any UHI service

An EUA completes Milestone 2 on HIE-CM before it can be onboarded onto any UHI service. The `abdm-integrators-assistant` plugin carries that work, in its `abdm-m2` skill.

## The decision rule

Create an agent only when the work has this shape: a goal, an unknown next action, inspect, choose, act, interpret, choose again. A known input through a known procedure to a known output is a skill.

Do not create an agent per service. No consultation agent, no blood bank agent. A user with a goal should face one agent and its relevant skills, not a choice between six.
