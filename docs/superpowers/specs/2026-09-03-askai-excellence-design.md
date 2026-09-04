# Ask AI excellence: design

Date: 2026-09-03. Status: approved for planning. Owner: Sam Dennis. Author: Claude (orchestrator).

## The problem

The Ask AI panel on the ABDM Developer Portal answers from the catalogue over the Docs MCP, but it does not yet recognise the nature of a request before answering it. Reviewed by hand over two days it: denied a definition the glossary holds (HIMS), asked the reader to disambiguate before searching, apologised to the operator inside a reader's conversation, withheld correct answers over house style, and gave a different answer to the same question in different sessions. Each fix was judged by a screenshot, because there is no instrument that scores the assistant's answers. The six existing eval tasks score whether an agent with the skills can complete integration work; none of them score a chat answer.

This design builds the instrument first, then changes the assistant only in ways the instrument can measure.

## Goals

1. A reader with a question about ABDM gets an accurate, grounded, relevant answer in the shape that question deserves, every time, from every browser.
2. Every change to the assistant, whether prompt, retrieval, guard or model setting, is measured before it merges.
3. Every fact the assistant can state traces to an NHA source through the catalogue, and the sources are listed in one annexure.
4. The assistant is honest about what the catalogue does not hold and declines in one line with a route.

## Non-goals

- Replacing the local site search or the agent skills. Those have their own instruments.
- A verbatim-identical answer cache. Same facts and same shape are the target; wording may vary.
- Image or PDF understanding beyond the text extraction already shipped.
- Anything that depends on an Anthropic API key. Answering and judging both run on Bedrock, so another operator can reproduce every result.

## 1. Principles

These are the contract the assistant is held to. Each one becomes at least one eval check.

1. **Grounded or silent.** Every factual claim about ABDM traces to a retrieved atom, a spec operation, the attached page, or the reader's own attachment. No API literal (path, header, error code, field name) appears in an answer unless it appears in a source. The guard enforces this today; the eval scores it.
2. **Understand before retrieving.** Every question is classified before any search: `define`, `how-do-i`, `diagnose`, `compare`, `meta`, `out-of-scope`, `unclear`. The class picks the retrieval strategy and the response shape.
3. **Same question, same substance.** Low temperature, a fixed response shape per class, literals quoted verbatim, sources cited the same way every time. The eval set enforces substance and shape on every change.
4. **Honest about depth.** Content the sandbox has not confirmed is said to come from the specification, once, in plain words. What NHA has not published is named as not published.
5. **Never argue with the reader, never apologise to the operator.** No clarifying question in place of a lookup. A refusal is one line and a route: the support page, the specific call, or the page that covers it.
6. **Talk like a colleague who has read the specification.** Lead with the answer. Short. Plain words before terms. No narration of tools, no praise of the question, no restating it, no apology.

## 2. The eval instrument

Built first. Lives in `evals/askai/`. Nothing in sections 3 to 5 lands before the instrument in section 2 is running against the current assistant.

### 2.1 The golden set

150 cases at v1, versioned in git, each frozen against a named `catalogue_version` so a result is reproducible.

| Slice | Count | Source | Purpose |
|---|---|---|---|
| NHA FAQ, verbatim | 45 | The NHA FAQ file supplied by the owner; fallback is a browser harvest of `sandbox.abdm.gov.in/sandbox/v3/faq` (General, Milestone 1, 2, 3 tabs) and `abdm.gov.in/FAQ` (ten categories, Sandbox, HPR, HFR and ABHA Number first) | Factuality on the questions NHA already answers |
| NHA FAQ, rephrased | 45 | Three variants per FAQ question: a developer in a hurry, a non-native phrasing, a one-word form | Robustness to phrasing |
| Definitions and acronyms | 20 | Every glossary atom, asked plainly and misspelt (HIMS for HMIS, LIS for LIMS, HRP) | The failure that started this |
| Errors and diagnosis | 15 | Real error bodies from the spec error tables; some pasted, some attached as JSON | The diagnose class, including attachments |
| Unanswerable | 15 | Out of scope (NHCX rules that do not exist yet), unpublished (production timelines), nonsense (`jhhjjk`), an instruction hidden in an attachment | Declining well |
| Conversation | 10 | Two-turn follow-ups: "and for M2?", "the bundle I sent" | History handling |

Case schema, one JSON file per case under `evals/askai/cases/<slice>/<id>.json`:

```json
{
  "id": "faq-sandbox-general-03",
  "slice": "faq-verbatim",
  "class": "how-do-i",
  "turns": [{"role": "user", "text": "How do I participate?"}],
  "attachment": null,
  "page": null,
  "must_contain": ["register on the sandbox", "client id and client secret", "milestone"],
  "must_not_contain": ["<MASKED", "I apologize", "let me", "great question"],
  "expected_sources": ["shared.sandbox.first-fifteen-minutes"],
  "expected_shape": "how-do-i",
  "expected_behaviour": "answer",
  "source_row": "annexure#sandbox-faq-general",
  "catalogue_version": "2026.08.24",
  "notes": "NHA's answer names the four milestones; ours may name CARE."
}
```

`expected_behaviour` is `answer` or `decline`. For `decline`, `must_contain` holds the route (`/docs/support` or a page) and the shape check requires at most two sentences.

`must_contain` entries are facts in plain words, not exact strings; the judge decides whether a fact is present. `must_not_contain` entries are exact, case-insensitive substrings and are checked deterministically.

### 2.2 Deterministic checks, no model needed

Run on every case, in CI, against a recorded transcript (section 2.5):

- **Grounding:** every API literal in the answer appears in the recorded tool results, the attachment, the page, or the question. Same regexes as `guard.CheckGrounding`.
- **Citations:** at least one source for an `answer`; sources ordered by retrieval rank then id; the expected sources appear when the case names them.
- **Shape:** the answer matches the class's shape rules (section 3.3): sentence and paragraph counts, list presence, no headings, literals in code spans.
- **Forbidden phrases:** `must_not_contain` plus a global list: openers, apologies, tool narration, "the catalogue", "atom", an em dash.
- **Decline shape:** for `decline` cases, at most two sentences and a route.
- **Classification:** the class the pipeline logged equals `class`.

### 2.3 Retrieval metrics, scored separately

For every case with `expected_sources`: recall at 3 (was the expected atom among the first three results of the first search) and mean reciprocal rank. Reported per slice. A failure with good retrieval is a synthesis defect; a failure with bad retrieval is a search or vocabulary defect. The two are fixed in different places.

### 2.4 The judge

A Claude model on Bedrock stronger than the answerer, in the same region. Grades each `answer` case A, B or C:

- **A:** every `must_contain` fact present, nothing false, nothing invented.
- **B:** the core fact present, a detail missing or an unnecessary hedge.
- **C:** a key fact missing or wrong, or an invented claim.

The judge receives the question, the answer, the recorded sources, and the marking criteria, and writes a one-paragraph rationale before the grade. Each case is graded three times and the majority grade stands; a three-way split is reported as unstable and graded by a human.

**Calibration gate:** the owner grades 30 cases by hand before the judge grades anything. The judge ships when it agrees with the owner on 85 percent of those 30 or better. Re-calibrate when the rubric or judge model changes.

Scores reported per slice as the share of A, of A or B, and of C. The headline number is factuality, the share of A or B on `answer` cases, and uncertainty, the share of correct declines on `decline` cases. kapa's method, adopted because it separates the two failures that matter.

### 2.5 Recording and reproducibility

An eval run records every model call: system prompt version, messages, tool calls and results, answer, sources, temperature, model id. The record is the transcript CI replays for the deterministic checks, so CI needs no Bedrock access and a judged run can be re-graded without re-answering. Transcripts live under `evals/askai/runs/<date>-<catalogue_version>/`.

The index is frozen for a run: the run names the `catalogue.db` it used and the run fails if the catalogue version differs from the set's.

### 2.6 Gates

- `npm run eval:askai:check` runs the deterministic checks against the last recorded transcript on every pull request that touches `mcp/`. It fails on any new grounding, forbidden-phrase or decline-shape failure.
- `npm run eval:askai:run` answers all cases against a running server and records a transcript. `npm run eval:askai:judge` grades a transcript. Both need Bedrock and run on a pull request labelled `eval` and nightly.
- A scorecard is written to `evals/askai/runs/<date>/scorecard.json` and posted as a pull request comment with the delta from the last run on `main`. A drop in factuality, a drop in uncertainty, or any new ungrounded literal blocks merge.

### 2.7 The production loop

The chat server logs each question masked. Weekly, a sample of 50 is drawn, answered by the current assistant, graded by the judge, and every C is filed as one of: a missing atom (goes to `atom-author`), a retrieval miss (vocabulary or ranking), or a prompt defect. Questions that recur enter the golden set. This is how 150 becomes the real distribution.

## 3. The answer pipeline

Inside `mcp/internal/chat`, one loop, four stages. Each stage lands in its own chunk and only when the eval shows it wins.

### 3.1 Classify

One model call with structured output before any search:

```json
{"class": "define", "entities": {"terms": ["HIMS"], "codes": [], "paths": [], "headers": []},
 "language": "en", "has_attachment": false, "has_page": false, "confidence": 0.94}
```

Rules: nonsense and injection are caught here and answered with the `unclear` or `meta` shape, never searched. Low confidence between two classes retrieves for both. The class and entities are logged and recorded, so the eval scores classification directly.

### 3.2 Retrieve by class, mandatory

| Class | Retrieval |
|---|---|
| `define` | `search_docs` with vocabulary expansion, glossary atoms first; a second search with the obvious variant when the term is an acronym |
| `how-do-i` | The flow atom, then its endpoints and tests via `related_atoms` |
| `diagnose` | `decode_error` for any code present, then the flow that produces it; the attachment is the corpus |
| `compare` | Both concepts, then the decision atoms that mention both |
| `meta` | No retrieval; answered from a fixed table about the portal |
| `out-of-scope` | One search to confirm, then decline |
| `unclear` | No retrieval; one line asking for the call or error, with the starters |

Retrieval is mandatory in code for every class but `meta` and `unclear`. This retires the "answered without looking" retry, which exists only because retrieval was optional.

### 3.3 Answer, in the shape for the class

Temperature 0.1 to 0.2 (deployment setting, default 0.1; 0 is rejected as too brittle for prose while still not deterministic). Sources fixed to what stage 2 returned, ordered by rank then id.

Shapes, enforced by the deterministic shape check:

- **define:** one sentence that defines; one sentence on where it sits in ABDM; the spelling NHA uses if the reader used another; at most one related term. No list.
- **how-do-i:** prerequisites in one line; numbered steps, each naming the endpoint it calls in a code span; one line on how you know it worked; the milestone page as the route.
- **diagnose:** what the error means; the first thing to check; the fix; the curl from the atom if it carries one; the error atom's page as the route.
- **compare:** two short paragraphs, one per thing, then one sentence on when to use which.
- **meta:** one or two sentences from the fixed table.
- **decline** (`out-of-scope`, `unclear`, and any class where retrieval found nothing): at most two sentences, one route. Never a list of guesses.

Naturality rules, checked as forbidden phrases: no opener, no "let me", no "I will search", no apology, no meta-commentary about the assistant, no heading inside a bubble, literals in code spans, the reader's language.

### 3.4 Verify

The existing guard, extended: grounding against the recorded corpus, shape for the class, forbidden phrases, and for `diagnose` that the cited error atom matches the code in the question. Blocking rules stay as they are: generated code and invented literals. Everything else is logged as `answer_flagged` and counted by the eval.

### 3.5 What is removed

- The retry that re-asks after an unresearched refusal. Mandatory retrieval makes it unnecessary; the eval's unanswerable slice proves it.
- The paragraph-level holdback stays; it is what makes narration droppable.

## 4. Consistency across sessions

- `CHAT_TEMPERATURE` default becomes 0.1, documented range 0.1 to 0.2. Rationale recorded in `deploy/nha/deployment.yaml` and `mcp/cmd/docs-mcp/main.go`.
- The system prompt moves to `mcp/internal/chat/prompt/v<N>.md`, one file per class section, embedded at build. A changelog at the top of each version says what changed and which eval run justified it. A prompt change without a scorecard delta in the pull request does not merge.
- Sources under an answer are ordered deterministically.
- No answer cache. Revisit only if the weekly sample shows substance drift on identical questions; the eval's same-substance check is the instrument that would show it.

## 5. The annexure

`catalogue/annexure/askai-sources.md`. One row per NHA document the assistant's knowledge depends on: URL, what it is, fetch date, hash where the source is a file, which atoms derive from it, which eval cases derive from it. The FAQ harvest lands here first. Any new atom written to close an eval gap cites its row in `sources:`. Lint: an eval case's `source_row` must resolve to a row; an atom citing the annexure must cite a row that exists.

## 6. Agents and models

The orchestrator (Claude, this session's model) writes the spec and the plan, cuts tasks, reviews every subagent's output against the task's acceptance command, runs the gates, and is the only one who commits. A subagent gets one task, a file list, an acceptance command, and no discretion to widen scope.

| Work | Agent | Model | Why |
|---|---|---|---|
| Eval case authoring: questions, must-contain facts, expected sources | `atom-author` | Sonnet | Volume work against a fixed template that needs the catalogue read carefully, not design judgement |
| FAQ harvest and annexure rows | `general-purpose` | Sonnet | Browser-driven, mechanical, must record verbatim |
| Judge prompt and rubric, calibration | orchestrator, then `adversarial-reviewer` | orchestrator / Opus | The rubric is the whole game; it is attacked before it grades anything |
| Classifier and pipeline code in Go | `general-purpose` | Sonnet | Well-specified interfaces and existing test patterns to copy |
| Prompt rewrite per class | orchestrator | orchestrator | Voice and structure decisions, measured immediately |
| Pre-merge review of each chunk | `adversarial-reviewer` | Opus | Looks for fabricated verification and overclaimed results |
| Missing atoms found by evals | `atom-author`, then `atom-verifier` | Sonnet / Sonnet | Draft unverified; verify only against sandbox |
| Hand-grading 30 cases, approving rephrasings, approving voice | the owner | | The judge is calibrated to the owner; nothing else defines good |

## 7. Chunks

Each chunk is one pull request with one gate. No chunk starts before the previous one merges. Chunks 1 to 4 change nothing a reader sees.

1. **Corpus and annexure.** The FAQ file in, harvest as fallback, annexure with citations. Gate: every eval question to be written has a source row.
2. **Golden set v1.** 150 cases in the schema. Gate: the owner has approved the rephrasings and graded 30 by hand.
3. **Harness and deterministic checks.** Runner, transcripts, retrieval metrics, CI job. Gate: runs green on the current assistant and prints a scorecard.
4. **Judge.** Rubric, calibration, nightly run, scorecard comment. Gate: 85 percent agreement with the owner's 30.
5. **Classifier and mandatory retrieval.** Stage 1, retrieval by class, retry removed. Gate: classification accuracy 95 percent or better; factuality does not drop.
6. **Shapes and prompt v2.** Per-class structures, naturality checks, temperature 0.1. Gate: factuality up, uncertainty 95 percent or better, zero forbidden phrases.
7. **Gap closure.** Atoms the evals found missing, drafted and cited. Gate: recall at 3 of 90 percent or better on the define and diagnose slices.
8. **Production loop.** Weekly sample from the masked log, graded, filed. Gate: the first weekly report exists.

## Open questions, decided

- Temperature: 0.1 default, 0.1 to 0.2 allowed. Decided by the owner on 2026-09-03.
- Question source: NHA's FAQ, verbatim and rephrased, is the seed. Decided by the owner.
- Consistency: same facts and shape, not verbatim. Decided by the owner.
- Models: Bedrock everywhere. Decided by the owner.

## Sources consulted for this design

- Stripe, the AI assistant in VS Code: hybrid BM25 and embedding retrieval, golden set of question and source pairs augmented synthetically and human-filtered, MRR for retrieval, LLM judge calibrated against human review. https://stripe.dev/blog/stripes-ai-assistant-vs-code
- Stripe, the integration benchmark: deterministic graders, eval runs surfacing documentation bugs, the benchmark as a test bed for prompt and tool changes. https://stripe.com/blog/can-ai-agents-build-real-stripe-integrations
- kapa.ai, evaluating assistants for technical documentation: about 100 cases, 15 to 20 unanswerable, marking criteria with A, B, C grades, judge run several times, index frozen per run, human calibration of the rubric. https://www.kapa.ai/blog/how-to-properly-evaluate-ai-assistants-for-technical-documentation
- Why temperature 0 is not deterministic and what to do instead: fixed harness, versioned prompts, semantic rather than exact comparison. https://www.zansara.dev/posts/2026-03-24-temp-0-llm/ and https://tianpan.co/blog/2026-05-07-cross-user-consistency-problem-ai-enterprise
- Ragas, aligning a judge with human labels: https://docs.ragas.io/en/stable/howtos/applications/align-llm-as-judge/
