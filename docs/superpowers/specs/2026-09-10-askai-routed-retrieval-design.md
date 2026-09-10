# Ask AI: routed retrieval for a cheap model

Status: agreed in conversation, 2026-09-10. Plan: `docs/superpowers/plans/2026-09-10-askai-routed-retrieval.md`.

## The problem

Ask AI runs on the cheapest Bedrock model the budget allows and is asked by people who know little about ABDM. Two real sessions produced wrong answers while the right facts sat in the catalogue: one said an ABHA address needs an ABHA number, one said there was nothing on biometric enrolment. Both were retrieval and framing failures, not knowledge gaps.

What the runtime asks of that model today, per question: choose among 11 tools, chain search then open then related by itself, decide when it has enough, pick an answer shape, hold to a length, all from a 1,900 word prompt sent on every one of up to 7 model calls. Every one of those is a decision a small model gets wrong some of the time, and they compound.

## The principle

Spend intelligence at build time and in code. The runtime model gets one narrow job: write an answer of a known shape from passages already chosen. Everything the research says about small models points the same way: fewer tools (an adaptive shortlist of about 7 matched 50, and shorter lists lifted selection accuracy 87 to 93 percent on a mid-size model), no chained calls (multi-turn costs every model 5 to 10 points and compounds per call), schemas the model already knows (renaming to pretraining conventions gave plus 17 percent, training free), and retrieval that matches the way people ask because the questions were generated at index time. Sources are listed in the plan's header.

## The pipeline

Five stages per request. Only stage 3 calls the model.

0. **Normalise** (code). Lowercase, expand acronyms and misspellings from `catalogue/shared/vocabulary.yaml`, extract error codes, endpoint paths and operation ids by regex, note whether an attachment or a page is present.
1. **Route** (code). Deterministic rules map the question to one of the six answer shapes the eval already knows (`define`, `how-do-i`, `diagnose`, `compare`, `meta`, `decline`) and to the two or three tools that shape may use. No embedding router in this iteration: the rules are inferred from the eval, and the embedding router is the piece that needs real traffic.
2. **Pre-retrieve** (code, no model). One composite lookup on the normalised question: hybrid search over atoms and their index-time questions, open the top three in full, add one hop of related atoms, assemble a passage pack with citation ids and page links. The model never has to decide to open an atom.
3. **Generate** (model). A fixed core prompt, cached, identical on every call. The shape's skeleton, word budget, one exemplar and the passage pack travel in the last user turn, not the system prompt, because the Bedrock cache point sits after the system text. Tools exposed: the composite lookup for a follow-up, plus `decode_error` when a code was extracted, `get_operation` when a path or operation id was, `validate_request` when an attachment exists. Never more than four, usually two.
4. **Verify** (code). Word budget per shape. If the pack carries sibling routes and the answer names fewer, or the pack mentions both ABHA number and ABHA address and the first sentence names neither, the answer is sent back once with the failure stated. One retry, then the existing guard's abstention.
5. **Abstain well**. Unchanged: a decline names the page and the support route and never guesses.

The MCP surface is untouched. The composite lookup is `search_docs`, `get_atom` and `related_atoms` called from Go; external agents keep the granular tools.

## Index-time questions

For every atom, a strong model generates ten to twenty questions a naive reader would ask that the atom answers, once per catalogue version, committed as `catalogue/shared/atom-questions.json` keyed by atom id with the sha256 of the atom body it was generated from. The indexer adds them to the FTS index as a weighted column and as one extra chunk per atom so vector search covers them too. A lint warns when an atom's body hash no longer matches its questions.

## Evaluation before launch

The existing 150 cases have no naive phrasing. Four new slices: `naive` (three rewrites of each FAQ case, generated once), `confusable` (sibling identifiers with `must_not_contain` on the wrong one), `followup` (under-specified second turns) and `abstain` (no answer exists; a decline with a route passes). Two new per-case measures: tool calls per answer, and whether the pre-retrieval pack contained an expected source, so retrieval and generation are scored apart. Launch bar: at least 90 percent criteria on a held-out third of `naive`, mean tool calls at most 1.5, zero `confusable` misses.

## Out of scope

The embedding router, a second chat provider, and tuning budgets and exemplars on the deployed model. All three need either traffic or credentials this environment lacks.
