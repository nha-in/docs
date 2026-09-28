---
name: ooda-skill-authoring
description: How to author compiled ABDM skills as OODA loops rather than recipes, covering the four phases, exit conditions drawn from atoms, explicit loop limits, escalation format, deterministic fixes that skip the decide phase, when parallel loops are allowed, and the floor-model rules that make a skill work on Haiku rather than only on Opus. Use whenever writing or fixing a skill template or a skills-src loop, when a compiled skill loops forever or stops too early, when an agent using a skill escalates badly, when a skill passes on a strong model and fails on a weak one, when writing a skill's opening block, interview or nudges, or when deciding how a build, test or debug skill should behave against an asynchronous flaky gateway.
---

# OODA Skill Authoring

## Why loops and not recipes

Integration against NHA is asynchronous, the sandbox is unreliable, and the counterparty you need is often absent. A skill written as a recipe fails the first time the sandbox returns something the recipe did not anticipate, and then the agent either invents a next step or stops with nothing useful to say.

So every build, test and debug skill is a loop. Observe, orient, decide, act, back to observe. Speed through the loop matters more than perfection in any single pass.

## The four phases

### Observe

Reads nothing from the Catalogue. Only live facts: the last response, the last callback, the state table, logs, sandbox status, the error code in front of it.

**The skill is forbidden from assuming the previous step worked.** This is the single most important rule. An agent that assumes success and proceeds produces failures three steps later that are almost impossible to diagnose.

Writes an observation record: timestamp, request id, what came back verbatim.

Time box: the wait stated in the relevant atom's section 4. Sixty seconds for a callback, for example. Not indefinite.

### Orient

Reads the atom graph. Matches the observation to a flow step, an error atom, or a test case.

**When the match is not exact, list at least two hypotheses.** A skill that commits to one interpretation of an ambiguous error will confidently apply the wrong fix. Two hypotheses force the decide phase to pick the action that distinguishes them.

Writes a short orientation note naming the matched atom and the alternative.

Time box: one pass. Do not re-read the whole Catalogue.

### Decide

Reads the matched atom's sections 2 and 5.

Picks the cheapest action that produces a new observation. States the hypothesis, the observation that would confirm it, and a fallback. Reversible actions before irreversible ones.

Seventy percent confidence now beats certainty after the sandbox session expires.

### Act

Runs the atom's curl, script or fix. Appends the action and its raw result to the loop log. Returns immediately to observe.

## Exit conditions come from the atom

A skill is done when the matched atom's section 4 is observed. It is never done because the agent feels finished, and it is never done because the loop limit was reached.

This is why section 4 must be observable. A skill whose exit condition is "it works" cannot terminate correctly. When you find a skill that loops forever, the bug is almost always an unobservable section 4 in the atom, not the template.

## Loop limits are explicit

| Skill kind | Limit |
|---|---|
| build | eight loops per flow step |
| test | three loops per test case |
| debug | five loops per error |

Hitting the limit is an escalation, not a failure and not a silent stop.

## Escalation format

An escalation must name three things and ask exactly one question:

1. **What was observed.** The actual responses and callbacks, verbatim, with request ids.
2. **What was tried.** Each hypothesis, the action taken, and why it was ruled out.
3. **Which one atom the human should read.**

Then one question. Not a list of questions. The human is being interrupted; make the interruption cheap.

Bad escalation: "I could not complete the linking step. There may be an issue with the configuration."

Good escalation: "Three link attempts returned ABDM-1035. Facility onboarding is the documented cause and I confirmed `X-HIP-ID` matches your console value, so the alternative hypothesis of a wrong header is ruled out. Read `hiecm.error.abdm-1035`. Has this facility completed HFR onboarding, or is it still pending NHA review?"

## Deterministic fixes skip decide

Some error atoms have exactly one fix and no judgement: a reused REQUEST-ID, a missing X-CM-ID, clock skew outside the accepted window. For these, write section 5 as a direct instruction with no branching, and the skill can go observe, orient, act, with nothing to decide.

No `fix.deterministic` field exists: `scripts/compile-skills.mjs` does not read one, and nothing marks an atom this way today. The distinction lives in how you write the prose, not in frontmatter.

Use this sparingly. A fix is deterministic only when there is genuinely one cause and one remedy. If the fix depends on how the integrator's system is configured, it is not deterministic.

## Where each skill kind starts and stops

| Kind | Starts by observing | Exit condition | Typical loop count |
|---|---|---|---|
| build | The repo: what exists, which credentials are configured, which steps are already done | Every flow step's section 4 observed once against sandbox | One per flow step |
| test | The test atom's preconditions | Every test case in the milestone passed, or marked needs-human with the reason | One per test case |
| debug | The error, the last request id, the state table | The error atom's fix applied and the original step's exit condition observed | One per hypothesis |

Note that debug does not exit when the fix is applied. It exits when the original thing that failed succeeds. Applying a fix and declaring victory is the most common way a debug skill lies.

## Parallel loops

Allowed only where the index skill declares steps independent. In practice that is FHIR bundle construction per record type, and test cases with no shared state.

Everything else runs one loop at a time, because the state it depends on is shared: the access token, the facility id, the patient id, the consent id. Two loops racing on a shared transaction identifier produce failures that look like gateway bugs.

## Human-required steps

Some steps cannot be automated: entering an OTP, approving a consent in a patient app, waiting for NHA to review a facility. These are marked in the atom with a precondition block carrying `human: true`.

A test skill hitting one of these must stop and ask, then record the case as needs-human with the reason. It must never mark it passed, and it must never mark it failed.

## The opening block

Every module skill opens `SKILL.md` with the same four parts, in this order, before any loop. The model reads `SKILL.md` first once loaded, and a person who copies the folder reads the same file first, so this is the only place a prompt or a nudge is read. Do not put them in a separate file.

```markdown
## What this skill does
- Create an ABHA with zero OTPs at a registered facility (Scan and Register)
- Log a person in by the mobile number the record already holds
- Open the registration form filled from the ABHA profile

## What it needs from you
| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| A callback URL ABDM can reach | Your deployment, or a tunnel while developing |

## Say one of these
- "Integrate M1 into my Django check-in with the fewest OTPs."
- "My link call returns ABDM-1035."
- "Walk the M1 test cases against my sandbox and log each one."

## What happens first
Five yes or no questions about your deployment. Each yes adds a route. The build starts after the fifth answer.
```

Rules for each part:

- **What this skill does** is one line per capability, in the integrator's words. "Create an ABHA with zero OTPs" rather than the operation id. Every NHA capability for the module appears here, and nothing a vendor adds. This list is the honest scope: a capability not on it is not in the skill.
- **What it needs from you** is a table of every credential, identifier and URL the loops will use, each with where it comes from. A weak model stalls without this and a strong one invents a value. `human: true` steps that will interrupt, an OTP or a consent approval, are named here too.
- **Say one of these** is three or four prompts the integrator pastes, one per common job: build, debug, test. They are the nudge. They also fix the entry point, so the loop starts at observe with a known job rather than in the middle of a flow. Each prompt names the milestone and the outcome, never an endpoint.
- **What happens first** states that an interview is coming, how many questions, and what an answer changes. Nobody should be surprised by being asked before being built for.

The plugin's own install and MCP connection block lives once in `site/static/agent-setup/prompt.md`. A skill never repeats it, and never points anywhere else for what its own loops need.

## The interview

A build skill asks before it builds. The M1 build loop's five questions are the model, and every build skill carries its own set, written against these rules:

- **Yes or no only.** A question that needs a paragraph is two questions, or is not an intake question at all.
- **Each yes adds a route.** State what the yes adds and cite the flow atom that carries it. A question whose answer changes nothing built is deleted.
- **The same answers give the screen set.** After the questions, a table of what to build on the integrator's side and which answer switches each item on or off. The skill solves the integrator's user experience, not only the API.
- **Never assume a no.** Loop limit one pass per question. An unanswered question is an escalation with one question, because a wrong assumption is a route built or missing for the life of the integration.
- **What holds regardless.** Close the interview with the three or four rules that apply under every combination of answers, so the model does not drop them when a route is skipped.
- **Ask once per transaction.** If the intake already holds a value, no later step asks for it again. This is the same rule the loops follow for identifiers.

A debug skill has no interview. It opens by observing the error, the last request id and the state table, and the lookup table takes over. A test skill asks one thing, which cases to run, and then reads the preconditions from the test atoms.

## Nudges inside the loop

A nudge is one line, placed where the model is about to make the common mistake. Write it as the rule and the reason, no more:

- Before the first profile call: "The token from login is a transfer token. Exchange it at account selection first, whatever the length of the accounts array."
- Before a lookup: "Search for the ABHA number first. It costs no OTP and answers whether an account exists."
- Before declaring a step done: "Paste the response. A step with no pasted output is not done."
- Before an escalation: "One question. The person is being interrupted."

Nudges repeat across skills where the mistake repeats. They never introduce a fact the atoms do not carry, so the validator's identifier diff still passes.

## Author for the floor model

The floor model is Haiku. A skill is finished when Haiku passes the eval in `evals/agent/tasks.json`, not when Opus does. A weak model does not reason from a paragraph. It copies a block, compares a response to a literal, and follows a numbered order. Every rule below exists because a skill written for a strong reader fails a weak one in a way the strong one hides.

### Exit conditions are literals

Section 4 of the atom becomes the loop's exit, so write it as something a model can diff, not something it has to judge. A status code, a JSON path and the value at it, or the exact tool result. "Responses at 200, 400, 401 and 500" is unfalsifiable. "A 200 whose body carries `ABHANumber`" is an exit. The only eval task Haiku passed on 2026-09-16 was the one whose exit was a tool returning `findings: null`. That is the pattern every other task lacks.

### Evidence or it did not happen

A loop step is done when its exit condition is observed and the observation is pasted verbatim into the loop log. Write that into the skill as an instruction: never report a step passed without the tool or sandbox output that shows it. On 2026-09-16 a Haiku helper reported a bundle as structurally sound without running the validator, because the bundle would not fit through the tool call. Nothing in the skill told it that a claim without output is a fail. The harness now scores it that way, and the skill should say so before the harness has to.

### Facts live in blocks, prose explains them

Headers, placeholders, error codes, preconditions and the fix go in a fenced block or a table. Prose says why. A weak model will not extract a rule from the middle of a sentence, and the compiler's identifier diff misses it for the same reason.

### Lookup first, narrative second

A debug reference opens with a table from observed error code to the section that handles it, one row per code. The model reads forty words and jumps. A 7,000 word narrative forces it to read everything before deciding, and it decides wrong. Budget a reference at the size of one problem, not one milestone.

### The check order is fixed

Before any hypothesis: clock, `REQUEST-ID`, token, then body, in that order, every time. A weak model is reliable at a checklist and unreliable at choosing. Deterministic fixes skip decide entirely, and the fixed order makes most first passes deterministic.

### Ask before building

A build skill opens by asking the integrator what their deployment needs, and builds only the routes the answers light up. The M1 build loop's five questions are the model. The questions are yes or no, each yes adds a route, and an unanswered question is an escalation rather than an assumed no, because a wrong assumption is a route built or missing for the life of the integration.

### Fewest calls, fewest interactions

A skill solves the integrator's user experience as well as the API. Prefer the route with the fewest OTPs and the fewest calls that reaches the same profile. Never ask the person for an identifier the transaction already holds: a failed Aadhaar login does not ask for the Aadhaar number again. Fetch the profile before the form opens, so the receptionist reads back rather than types. A lookup that costs nothing runs first.

### Everything ABDM offers, no vendor's shape

The skill represents every capability NHA publishes for the module, and none of any vendor's SDK. Learn the interaction patterns a good SDK has found, then write them against NHA's operations. The reader is NHA's integrator, not a vendor's client. `dpg-governance` holds the rule; this is what it means inside a loop.

### One folder is the whole story

Readers copy or download a skill folder and read it top to bottom. Put everything the module can do in that folder: the router in `SKILL.md`, the scaffold, integrate, debug and test sections under `references/`. Do not split a module across skills, and do not point out of the folder for something the loop needs.

### Best practices repeat in every skill

The rules that hold across milestones, the padding scheme for encryption, the two token rule, the fresh `REQUEST-ID`, the fixed check order, are repeated in each skill that needs them rather than referenced. Every skill installs alone. When a rule is corrected in one skill, grep the others the same day: the padding scheme was right in M4 and absent in M1 for a fortnight because nobody looked sideways.

### Findings go back to the atom

When an integration run finds the skill wrong, the fix is an atom change, a recompile, and a line in the run log. Write the finding as a root cause with the atom id, the observed behaviour, the expected behaviour and the source, so the contributor's assistant can apply it without the session that found it. A skill hand-edited to match the sandbox drifts back on the next build.

## Authoring checklist

- [ ] Every loop declares a limit
- [ ] Every exit condition traces to an atom's section 4
- [ ] Observe reads live state only, never assumes the previous step
- [ ] Orient produces two hypotheses when the match is inexact
- [ ] Escalation names observation, hypotheses tried, one atom, one question
- [ ] Deterministic fixes are genuinely judgement-free
- [ ] Parallelism only where the index says independent
- [ ] Human-required steps stop and ask
- [ ] Every exit condition is a literal a model can diff, not a judgement
- [ ] The skill says a pass without pasted output is a fail
- [ ] Facts sit in blocks or tables, and a debug reference opens with a code to section lookup
- [ ] The fixed check order comes before any hypothesis
- [ ] A build skill asks before it builds, and never asks for an identifier the transaction holds
- [ ] Every NHA capability for the module is present, and no vendor's is
- [ ] Cross-milestone best practices are repeated in this skill, not referenced
- [ ] Haiku passes the eval for this skill
- [ ] `SKILL.md` opens with the four part block: does, needs, say one of these, happens first
- [ ] A build skill's interview is yes or no, each yes cites a flow atom, and it ends with what holds regardless
- [ ] Nudges sit at the point of the mistake, one line each, and add no fact the atoms lack

## Related

- How templates become skills: `skill-compiler`
- Where exit conditions come from: `atom-authoring`
- The support agent runs the same loop: `support-agent`
- The evals that decide whether a skill is finished: `portal-proof`, `npm run eval:agent`
