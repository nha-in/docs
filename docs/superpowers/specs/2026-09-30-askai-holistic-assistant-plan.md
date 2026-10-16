# Ask AI, from documentation assistant to ABDM assistant

Date: 30 September 2026. Status: in execution on `feat/askai-assistant`; section 2 says what the branch adds and section 6 what still waits on the owner. Builds on `2026-09-29-askai-prompt-v6-strategy.md`, which stays the plan for the prompt's structure; this document sets the target the prompt serves and works down through the knowledge base, retrieval, the model, reliability and evaluation.

## 1. What the feedback says

Five documents from NHA's testers: a test-case workbook (three sheets), a WhatsApp note, a QA sample of eleven answers with verdicts, a PHR question set of fourteen answers with verdicts, and a failed-cases sheet. Forty verdicts in all, grouped by what actually went wrong. A tester's expectation is recorded as stated; where it conflicts with the specification the conflict is named rather than resolved here.

| Group | Count | What the testers saw | Examples |
|---|---|---|---|
| Missing or thin knowledge | 9 | The answer had nothing to draw on, or drew on the wrong module | P4 absent from every PHR milestone answer; "can users upload records" answered without the health locker; sandbox registration and HFR onboarding steps judged "incorrect, wrong manner"; FHIR validation steps never answered; face authentication login missing headers and payload; the 24-hour block explained as rate limiting without the situation the tester meant |
| Wrong shape for the question | 11 | Right facts, wrong amount, wrong order, or a tangent the reader did not ask for | "What is PHR" ends with consent mistakes; "how to build a PHR app" dumps every P1 route; "is there a patient app" should give the milestone map then ask which one; "how are records linked" keeps returning to uploading; every definition carries "the common mistake" |
| Generic rather than situational | 7 | Correct in general, silent on the reader's case | "Unauthorized" answered with every possible cause; "not getting callback" as a checklist rather than a diagnosis; "HIP did not acknowledge" explains the message, not why it happens; encryption answered as a definition |
| Language and register | 4 | Correct, but written for an integrator when the reader is not one | ABHA address "definition not clear"; "language could be more user-friendly" twice; "response may not be clear for the user" |
| Reliability | 3 | Service, not content | "assistant is unreachable" roughly one in fifteen questions; a "start a new chat" prompt after fifteen exchanges |
| Grounding disputes | 2 | Tester and documentation disagree | The tester says `POST /api/hiecm/hip/v3/link/carecontext` is a callback and the HIP should call another API; the specification lists it as the HIP's gateway call. The tester says P4 is the upload-and-link milestone; the catalogue has no P4 atoms at all, so the assistant answered from the locker endpoint pages alone |
| Cross-role flows | 2 | An end-to-end answer covered one role | "Consent and data sharing from request to records received" gave the HIU side and omitted the HIP calls |
| Fine | 4 | Accepted as is | HIE-CM definition, security measures, subscriptions and auto approval, ABHA address (with a language note) |

Two things the numbers do not show. First, every tester question was a plain-language question, not a developer's question: "Is there a patient app", "Can users upload records", "Why does Unauthorized appear". Second, the testers judged answers against what an NHA onboarding engineer would say to an integrator on a call: the milestone map, the order of work, what NHA will test, and what usually goes wrong. That is the bar, and it is a different product from a documentation search with a chat front.

Your own summary of the NHA conversations says the same thing from the other side: intelligence beyond retrieval, users who prompt badly, contextual and situational answers, examples and workflow suggestions, a non-technical reader nine times in ten, and an assistant for all of ABDM rather than for its documentation.

## 2. Root causes, by layer

### Status against main, 3 October

Checked against main at `1c004ad595`. One workstream has moved a long way, one has taken its first step, three have not started, and nothing since 29 September has been measured.

| Workstream | Landed | Still open against the exit |
|---|---|---|
| 1. Knowledge | P1 to P4 glossary atoms and a P4 flow (#92); ABDM as the umbrella and M1 to M4 as ABDM milestones (#89); NHA's wording of 2 October for M2, M3, M4 and the M4 test cases (#101); the M1 terms and conditions (#103); the scan and register QR format (#102); HFR field descriptions (#104); test cases as a section, one page per module (#94) | No playbook, journey, situation or process atoms. One atom tagged P4, against the eight the exit asks for. No atom defines the health locker. 722 atoms carry no milestone |
| 2. Model | Reasoning effort pinned to medium for the Bedrock GPT models, in production and in the eval (#88) | No comparison against Opus 5 or Sonnet 5. The one recorded run is still 29 September on `gpt-6-luna` |
| 3. Retrieval | Nothing | No contextual chunks, reranker or query rewriting. Five hits, three opened. Vector floor off |
| 4. Shapes | `define` no longer asks for a mistake; `overview` (the milestones in order, one line each, then which one) and `walkthrough` at 420 words (#93, brought to main by #96) | `how-do-i` still asks for every route. No situational `diagnose`, no reader recognition, no persona line |
| 5. Reliability | "Unreachable" was the per-IP rate limit, mislabelled by the widget; a rate limit is now shown as one, with the wait (#91) | The limit is still 5 a minute and 100 a day per IP. No retry on a Bedrock throttle. The turn prompt and the ten second tool timeout are unchanged |
| Evaluation | 239 golden cases; about ten of NHA's forty questions are now cases | The calibration file is empty and no run has been judged, so every change since 30 September is unmeasured |

The `overview` and `walkthrough` shapes are in substance the `orient` shape and the journey budget workstream 4 asks for. Where the sections below describe the `define` shape's mandated mistake or an unexplained "unreachable", they describe the state the testers saw on 30 September; the table above is the state now.

### What `feat/askai-assistant` adds, 3 October

One branch on top of main at `1c004ad595`. Nothing on it has been through a judged run; the cases that will measure it are on the branch too.

| Workstream | On the branch | Still open |
|---|---|---|
| 1. Knowledge | Fifteen hand-written atoms: three playbooks (PHR app, HIP software, HIU software), three journeys (consent to records, HIP initiated linking, user initiated linking), six situations (no callback, HIP did not acknowledge consent notify, blocked for 24 hours, unauthorized, consent still requested after approval, linked but no record), sandbox access to HIP or HIU ID, a health locker definition, and the six ways M1 tests ABHA verification with which are mandatory | Situation causes are assembled from the pages, not from support history. Three situations overlap older generated atoms (`callback-never-arrives`, `everything-returns-401`, `consent-stuck-requested`) and want one owner each. |
| 2. Model | Nothing | The comparison needs Bedrock access this branch was written without |
| 3. Retrieval | An overview or walkthrough question opens up to three flow or concept atoms the top hit links to, on top of the three it already opens. An atom searched for by its own title comes first | Contextual chunks, reranker, query rewriting, the vector floor's value |
| 4. Shapes | `diagnose` gives the most likely cause first and ends by asking for the one thing that would settle it. Every shape but `self` carries the reader line: most readers are not developers, plain words first, then the call. Prompt version v5.2 | `how-do-i` unchanged, because the guard requires the route to be named. Reader recognition waits for the query rewriter |
| 5. Reliability | A Bedrock throttle is retried twice with backoff, never after text has streamed. Every stream that ends without an answer logs a reason, and the widget is told it. `get` and `validate` have 20 seconds. The per-IP limit is 15 a minute by default. The "start a new chat" prompt at fifteen exchanges is gone | Summarising older turns. The one-in-two-hundred exit needs a week of production logs |
| 6. Next questions | New, below | |
| 7. Voice | Built, then moved to phase 2: it is on `feat/askai-voice`, not on this branch | The transcription server (decision 6) |
| Evaluation | A `nha-review` slice of twenty-one cases, NHA's questions verbatim with the reviewer's expectation as the criteria; with the earlier cases this covers every reviewer question the catalogue can answer | The judged run, the calibration grades, the `persona` slice |

Each row names the layer, the defect the feedback exposes, and the evidence in the repository.

### Knowledge base

The catalogue is deep where NHA's specifications are and thin where an onboarding engineer's knowledge is. Counts on main today: 335 error atoms, 186 endpoint atoms, 66 callback atoms, against 57 flow atoms and 105 concept atoms, 718 of 962 atoms carrying no milestone. P4 has zero atoms; the health locker is mentioned in twenty atoms and defined in none. There is no atom of the kind "what a PHR app is, the four milestones, in what order, and what NHA tests at each", no atom for "the consent journey across HIU, HIE-CM and HIP", and no situation atoms of the kind "you received data but the HIP acknowledgement is missing: here is why and what to do". The sandbox registration and HFR pages exist (43 atoms and 41 pages mention them) and still produced an answer the tester called wrong, which says the knowledge is scattered across endpoint pages rather than told once as a procedure.

This is the largest gap and no prompt or model closes it. An assistant that must be an expert needs the expert's knowledge written down: playbooks, journeys, situations and worked examples, in plain words with the technical layer underneath.

### Retrieval

Hybrid search over section-sized chunks, five hits, three opened, reciprocal rank fusion, no reranker, no chunk context, no query rewriting. Live MRR 0.41 and 51 of the 54 failing golden cases fail on retrieval. An end-to-end flow question needs six or seven atoms across roles; the pack carries three full bodies. A vague question ("not getting callback on my server") retrieves whatever shares its words. Anthropic's contextual retrieval results are the reference point: prepending a 50 to 100 token context to each chunk before embedding cut retrieval failures by 35 percent, adding contextual BM25 by 49 percent, adding a reranker by 67 percent, and passing twenty chunks beat passing five or ten. None of the three is in place.

### Answer shapes and the system prompt

The shapes were designed to make a weak model consistent, and they now produce the tangents the testers flagged. The `define` shape mandates "the one thing people get wrong", which is why "what is PHR" ends with consent mistakes. The `how-do-i` shape mandates "every route that exists, one line each", which is why every PHR question dumps the P1 routes. There is no shape for "orient, then ask which milestone", no persona rule, and the system prompt's ban on general knowledge, correct for API literals, is read by the model as a ban on explaining, examples and analogies. The v6 strategy fixes the structure of the prompt; it does not change what the prompt asks for, and the feedback says what it asks for is wrong for these readers.

### Model

The recorded eval run answered on `global.openai.gpt-6-luna` through Bedrock, and an earlier run on Haiku 4.5. The whole answer layer, shapes, retries, guard, budgets, was built on the floor-model principle: assume a weak model and enforce in code. That principle protected against invented literals and it caps the ceiling: a model at that tier follows a shape literally and cannot reason from six atoms to a situational answer. "Intelligence beyond retrieval" is a model property first. The guard stays regardless of model, because it is what makes a stronger model's freedom safe.

### Embedding

The embedding model is a deployment setting (`EMBED_PROVIDER=bedrock` plus a model id) and no run in the repository records a comparison between models. Chunks are embedded bare, without the atom's title, type, milestone or role, which is exactly what contextual retrieval adds.

### Reliability

"Unreachable" is the widget's message for a stream that failed before an answer. The server has no retry on a Bedrock throttle, a ten second tool-call timeout, and a per-origin rate limiter; which of the three fired one time in fifteen is not recorded anywhere, so the first step is a reason code in the log line. The "start a new chat" prompt is `MaxTurns = 31`, the question plus fifteen exchanges; the fix is summarising older turns rather than ending the conversation.

### Product scope

The assistant is defined, in its prompt and its playbook, as a documentation assistant that answers "strictly from this portal's catalogue". NHA wants an ABDM assistant. Those are compatible only if the catalogue grows to hold what an ABDM expert knows; the rule "no API literal that is not in a source" must stay, and the rule "no explanation that is not in a source" must go.

## 3. The target

An ABDM assistant that an NHA onboarding engineer would accept as a stand-in on a first call. Concretely:

- **Three readers, recognised from the question.** A founder or product manager asking what to build; an integrator asking how; a tester or NHA reviewer checking what the documentation says. The first gets plain words, a map and a next step; the second gets the calls and the order; the third gets literals and citations. Nothing in the reader's words is required for this: "is there a patient app" is the first reader.
- **Orientation before detail.** A broad question gets what it is, why it matters, the map of the work, and one question back. Detail comes when asked. The testers wrote this rule themselves in verdict 6.
- **Situational answers.** A described failure is answered as a diagnosis: the two or three likely causes for that situation, ordered, with the one check that separates them, in the reader's terms.
- **Examples and workflows.** A worked example for every milestone and every common situation, written once in the knowledge base and reused.
- **Whole-ABDM scope.** Milestones, sandbox and go-live process, certification, roles, registries, the claims exchange, the health interface. Where the portal has no page, the assistant says so and names who does, rather than defining nothing.
- **The two rules that do not move.** No API literal that is not in a retrieved source. No code for the reader's codebase.

## 4. The plan

Five workstreams. Knowledge first, because every other workstream's ceiling is set by it; the model change second, because it is the cheapest large gain; retrieval third; shapes fourth, because they should be rewritten against the new model and knowledge, not before; reliability in parallel. Each has an exit condition that is a number.

### Workstream 1: the expert's knowledge, written down

Four new kinds of atom, each with a "Questions this answers" section written in the readers' words (the testers' questions go straight in).

| Kind | What it holds | First batch |
|---|---|---|
| Playbook | For one thing an integrator builds (a PHR app, a HIP, a HIU, a payer on NHCX): what it is in plain words, the milestones in order, what each produces, what NHA tests at each, what usually goes wrong | PHR app (P1 to P4), HIP (M1 to M3), HIU, NHCX provider, NHCX payer |
| Journey | One end-to-end flow across roles, with a role-by-role sequence and the callbacks each side must handle | Consent request to records received; HIP-initiated linking; user-initiated linking; ABHA creation; claim submission |
| Situation | One failure as a reader describes it: the likely causes in order, the separating check, the fix | The top fifty from sandbox support and the feedback: no callback received; HIP did not acknowledge; 24-hour block; Unauthorized; link token expired; consent stuck in Requested; FHIR bundle rejected |
| Process | One administrative step: sandbox registration, HFR facility onboarding, bridge and role linkage, go-live, certification | Each as one page with the order of steps and who approves |

Plus: P4 written properly (the health locker, what it is for, what it does and does not do about uploading and linking, and NHA's own position on whether a patient-uploaded record becomes linked); every glossary entry gets a plain-words sentence above its technical one; every playbook and journey gets one worked example with real-shaped values.

Sources: NHA's milestone and sandbox documents already under `catalogue/openapi/.raw`, the sandbox FAQ and support ticket history (owner to obtain), and the NHA testers themselves, whose verdicts are the acceptance test. The nha-voice and writing-guide rules apply unchanged.

Exit: every tester question in section 1 has a source atom whose "Questions this answers" section contains it; P4 has at least eight atoms; retrieval hit rate on the PHR and process cases at or above 0.9.

### Workstream 2: a model that can reason from the knowledge

Move the chat model from the Luna and Haiku tier to Claude Opus 5 (`claude-opus-5`) with adaptive thinking at medium effort, or Claude Sonnet 5 (`claude-sonnet-5`) where cost rules, and measure the two against each other on the golden set before choosing. The whole answer layer keeps its guard; what changes is what the model is allowed to do with grounded facts: explain, compare, give an example, ask the separating question, choose the register for the reader.

Cost, first-party rates, for a typical question of about twelve thousand input tokens (a cached 1,500 token system prompt, an eight thousand token pack, history) and four hundred output tokens: Sonnet 5 about three cents, Opus 5 about seven cents, before caching discounts on the prompt. Bedrock partner pricing differs; the owner should price on the deployment. At a thousand questions a day that is thirty to seventy dollars a day, which is the cost of the product working.

Exit: judged factuality on the golden set at or above 0.85 and the forty tester verdicts re-run with at least thirty accepted.

### Workstream 3: retrieval that finds six atoms, not three

In order of measured gain:

1. **Contextual chunks.** Prepend to each chunk, at index time, one or two sentences naming the atom, its type, gateway, milestone, role and what the section covers. Generated once by the model with the whole atom in context, cached. This is the 35 to 49 percent figure.
2. **Reranking.** Retrieve twenty candidates with the fused search, rerank with a cross-encoder or a model call, pass the top eight to twelve as passages rather than three full bodies. This is the 67 percent figure.
3. **Query rewriting.** Before retrieval, one small model call turns the reader's words and the conversation into two or three search queries and a reader type (founder, integrator, tester). "Not getting callback on my server" becomes "callback not received", "bridge URL registration", "on_carecontext". This also replaces the terse-prompt regexes with something that generalises.
4. **Journey-aware expansion.** When the top hit is a journey or playbook atom, pull the atoms it names as steps into the pack, so an end-to-end question has all roles in front of the model.
5. **The vector floor**, set from the score distribution once the above is measured.

Exit: retrieval MRR on the golden set from 0.65 to at least 0.8; the end-to-end consent case retrieves both the HIU and the HIP atoms.

### Workstream 4: shapes for readers, not for a weak model

Rewrite the shapes against the new model and the new atoms, one hypothesis per pull request as the v6 strategy prescribes:

- Drop the mandated "common mistake" from `define`; keep it available when a source states one and the question is about doing, not defining.
- Replace `how-do-i`'s "every route, one line each" with "the route the reader is on, the alternatives named, detail on request".
- Add `orient`: what it is, why it matters, the map, one question back. Selected when the query rewriter says the reader is a founder or the question is broad.
- Add `diagnose` in its situational form: causes in order, the separating check, the fix; when the reader gave no evidence, the one fact to ask for.
- Add the persona line to the prompt: plain words first, the technical layer underneath, examples allowed from example atoms, analogies allowed when marked as such.
- Budgets by intent rather than by shape: an end-to-end journey is allowed four hundred words; a definition stays at a hundred.

Exit: the eleven "wrong shape" verdicts re-run and accepted; the one-question and forbidden-phrase checks unchanged.

### Workstream 5: reliability

- Log a reason code for every stream that ends without an answer (throttle, tool timeout, rate limit, model error), then fix the top one; add retry with backoff on Bedrock throttles.
- Replace the "start a new chat" prompt with summarisation of older turns beyond the fifteenth exchange, so the conversation continues.
- Raise the tool-call timeout for `get` and `validate`, which read large specification fragments.

Exit: unanswered streams below one in two hundred over a week; no forced restart within thirty exchanges.

### Workstream 6: next questions, where, when and what

The pill row under an answer is gone. It offered a next step after every answer, including a decline, and its text came from whatever linked to the atoms retrieved, so it read as unrelated.

- Two things, kept apart. The next step is what this reader does next in the process the answer sits in. A related question is something else worth asking. Only the next step takes the box.
- The next step: when the answer's top source is a call that belongs to a journey and is not its last, the call after it, asked as a question. The order comes from the journey files under `catalogue/<gateway>/openapi/<version>/journeys/`, carried in the index. It shows as grey text in the box with a `Tab` key beside it, after open and closed questions alike, and each answer offers the one after, so Tab walks a journey call by call. Journeys that group calls rather than order them (callbacks, master data, profile and management calls) offer none; that is read from the journey's title today and wants an explicit flag in the journey file.
- Related questions: listed above the box while it is empty and has focus. The arrow keys move through up to three, and the one the reader moves to takes the box; none does unasked. Escape dismisses, typing replaces, and Shift+Tab is untouched.
- Skills: the four skill pills under the composer are gone too. A skill is assigned from the add menu ("Assign a skill") or by typing a slash, which lists the skills as it does in Claude; the one that is on shows as a chip above the box and comes off from there.
- Scrolling: once the reader scrolls up, a chevron over the end of the thread takes them back to the latest answer.
- When related questions show: only after an open-ended question. Today that is a rule over the routed shape: `overview`, `topic` and `walkthrough` always; `how-do-i` when the question names no operation and no error code. A definition, a comparison, a diagnosis, a question about the assistant, and any answer that declines or says it has nothing get none. When the query rewriter of workstream 3 exists it returns `open_ended` and the reader type with the rewritten query, and the rule becomes its fallback.
- What a related question says: the first authored question of an atom the answer's own sources link to, flows before concepts, inside the answer's gateway. The model writes neither a next step nor a related question.
- Not yet: a next step when the top source is a flow or a concept rather than a call. A model-written next step, as Claude has, would cover that; it waits until the journey-based one has been measured.

Exit: no related question on any closed-question or declined case in the golden set; a next step only where the journey has one; on open-ended cases the suggestion's atom is one the reviewers accept as the next step; fill rate (Tab or click over suggestions shown) is logged and reviewed after two weeks.

### Workstream 7: voice, phase 2

Built and held back on `feat/askai-voice` until the transcription server is decided. What follows describes that branch.

Ninety percent of readers are not developers and many will find speaking easier than typing a question in English.

- Dictation: a microphone in the composer records up to the limit, posts the audio to `POST /api/transcribe`, and puts the text in the box for the reader to check before sending. Nothing is sent as a question without the reader pressing send. The server forwards to any Whisper-compatible `/v1/audio/transcriptions` endpoint named by `TRANSCRIBE_URL`; with none configured the route answers 404 and the microphone does not appear. Audio is capped at 4 MB, shares the chat rate limit and is never logged.
- Read aloud: a speaker button on each answer uses the browser's own speech synthesis, with code, paths and tables removed from what is spoken. No audio leaves the browser for this.
- Not in scope: a spoken conversation mode. Dictation in, read aloud out, is what was asked for.

Open: which transcription server (decision 6), and accuracy on Indian-accented English and on Hindi, measured on recorded questions before the microphone is switched on in production.

Exit: twenty recorded questions from NHA's own staff transcribe to text that routes to the same shape as the typed question.

### Evaluation, throughout

The forty tester verdicts become golden cases this week, with the tester's expectation as the marking criteria, and a `persona` slice of thirty plain-language questions judged on "would a non-technical reader understand and know what to do next". The judge is calibrated against the testers' own grades, which exist and are the best calibration set the project has had. Every workstream above ships against a scorecard delta, as the strategy already requires.

## 5. What this changes about the product's definition

The playbook's first sentence says the assistant "answers integrator questions" and "never answers from the model's ambient knowledge". Both stay true in the way that matters: every API literal comes from a source and the model never invents a call. What changes is that the source set grows to hold an expert's knowledge, and the model is allowed to explain, compare, exemplify and diagnose with it. The DPG rule is untouched: nothing here depends on a vendor's infrastructure beyond the model endpoint the deployment already chooses, and the knowledge lives in the catalogue under the same licence.

## 6. Decisions the owner holds

1. The model: Opus 5, Sonnet 5, or a measured comparison first. Sets the cost line.
2. NHA's authoritative answer on the two disputed facts: what P4 is for and whether a patient-uploaded record becomes a linked record; and whether `POST /api/hiecm/hip/v3/link/carecontext` is the HIP's call, as the specification says, or a callback, as the tester wrote.
3. Access to the sandbox support ticket corpus and FAQ, which is where the situation atoms come from.
4. The embedding model to standardise on, so the contextual-chunk work is measured once.
5. Whether NHA's testers will grade a re-run of their own forty questions at the end of each workstream. That is the acceptance test, and nothing in the repository replaces it.
6. The transcription server for voice input, and whether a reader's audio may leave the deployment to reach it. A self-hosted Whisper keeps it inside; until this is decided `TRANSCRIBE_URL` stays unset and the microphone stays hidden.

## Sources

- The five feedback documents of 29 and 30 September 2026 (test-case workbook, WhatsApp note, QA sample, PHR question set, failed cases)
- Anthropic, Introducing Contextual Retrieval: https://www.anthropic.com/news/contextual-retrieval
- Anthropic model list and first-party pricing, cached 24 June 2026, via the claude-api skill
- This repository: `catalogue/`, `mcp/internal/chat/`, `mcp/internal/index/`, `mcp/internal/server/tools.go`, `evals/askai/runs/2026-09-29-2026.09.16/`, `mcp/support-agent-playbook.md`, `docs/superpowers/specs/2026-09-29-askai-prompt-v6-strategy.md`
