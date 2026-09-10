# Ask AI Routed Retrieval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Ask AI assistant answer naive questions well on a cheap Bedrock model by moving retrieval, routing and verification out of the model and into code and build time.

**Architecture:** A five stage pipeline per request: normalise and route in code, pre-retrieve a passage pack with one composite lookup, generate with a cached core prompt plus a per-shape block in the user turn and at most four tools, verify deterministically with one retry. Index-time question generation makes retrieval match how people ask. Four new eval slices measure it before launch.

**Tech Stack:** Go 1.2x (`mcp/`), SQLite FTS5 via the existing `index` package, Bedrock Converse via the existing `chat/bedrock.go`, Node ESM scripts under `scripts/`, JSON eval cases under `evals/askai/cases/`.

**Spec:** `docs/superpowers/specs/2026-09-10-askai-routed-retrieval-design.md`

**Research the spec argues from:** [How many tools should an agent see](https://arxiv.org/html/2605.24660v1) · [PA-Tool: adapt schemas to small models](https://arxiv.org/pdf/2510.07248) · [BFCL v4](https://gorilla.cs.berkeley.edu/leaderboard.html) · [Anthropic: writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Anthropic: context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [HyPE](https://arxiv.org/html/2607.29402) · [Tool selection at scale](https://tianpan.co/blog/2026-04-09-tool-selection-problem-agent-tool-routing-at-scale)

## Global Constraints

- One phase per branch off `main`, one PR per phase. Phases A to E are independently mergeable in order; do not stack them.
- Commit messages: `<type>: <lowercase sentence>`, body says why, ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. No em dashes anywhere in the repository, including commits.
- Tool names the model sees stay exactly `search_docs`, `decode_error`, `get_operation`, `validate_request`. Never introduce a new tool name to the chat loop.
- The MCP surface in `mcp/internal/server/mcp.go` does not change.
- The Bedrock cache point sits after the system text (`mcp/internal/chat/bedrock.go:150-160`). Nothing per-request may be appended to the system string.
- `catalogue/atom-routes.json`, `site/static/skills/`, `plugins/abdm-integrators-assistant/skills/` are build outputs; never hand-edit.
- Every eval case must cite an annexure row (`source_row: "annexure#<id>"`); `npm run lint:annexure` fails otherwise.
- Phase E assumes PR `fix/m1-biometric-honesty` (word budgets in `mcp/internal/eval/checks.go`) is merged. If it is not, merge it first.
- Go checks before every commit: `cd mcp && gofmt -l ./... && go vet ./... && go test ./...`.
- Tasks that call Bedrock (A6, B2) need `CHAT_MODEL`, `AWS_REGION` and AWS credentials. They are marked. Everything else runs offline.

---

## Phase A: the instrument

Nothing later can be judged without this. Four new slices, two new measures.

### Task A1: Accept the four new slices

**Files:**
- Modify: `mcp/internal/eval/case.go:52`
- Test: `mcp/internal/eval/case_test.go`

**Interfaces:**
- Produces: slice names `naive`, `confusable`, `followup`, `abstain` accepted by `LoadCases`.

- [ ] **Step 1: Write the failing test**

Append to `mcp/internal/eval/case_test.go`:

```go
func TestNewSlicesAreAccepted(t *testing.T) {
	for _, slice := range []string{"naive", "confusable", "followup", "abstain"} {
		c := Case{
			ID: "x", Slice: slice, Class: "how-do-i",
			Turns:             []Turn{{Role: "user", Text: "q"}},
			MustContain:       []string{"a fact"},
			ExpectedShape:     "how-do-i",
			ExpectedBehaviour: "answer",
			SourceRow:         "annexure#glossary",
			CatalogueVersion:  "2026.08.24",
		}
		if err := c.validate("x.json"); err != nil {
			t.Errorf("slice %q rejected: %v", slice, err)
		}
	}
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd mcp && go test ./internal/eval/ -run TestNewSlicesAreAccepted -v`
Expected: FAIL with `slice "naive" rejected: ... not one of the six slices`

- [ ] **Step 3: Add the slices**

In `mcp/internal/eval/case.go` replace line 52:

```go
	slices     = set("faq-verbatim", "faq-rephrased", "define", "diagnose", "decline", "conversation",
		"naive", "confusable", "followup", "abstain")
```

and change the message on the `slices` check in `validate` from `"not one of the six slices"` to `"not a known slice"`.

- [ ] **Step 4: Run to verify it passes**

Run: `cd mcp && go test ./internal/eval/ -v`
Expected: PASS, including every existing test.

- [ ] **Step 5: Commit**

```bash
git add mcp/internal/eval/case.go mcp/internal/eval/case_test.go
git commit -m "test: the eval accepts naive, confusable, followup and abstain slices"
```

### Task A2: Count tool calls and score retrieval apart from generation

**Files:**
- Modify: `mcp/internal/eval/checks.go` (CheckResult and Check)
- Modify: `mcp/internal/eval/scorecard.go` (wherever CheckResult is summarised; add the two columns)
- Test: `mcp/internal/eval/checks_test.go`

**Interfaces:**
- Produces: `CheckResult.ToolCalls int` and `CheckResult.RetrievalHit bool`.

- [ ] **Step 1: Write the failing test**

Append to `mcp/internal/eval/checks_test.go`:

```go
func TestToolCallsAndRetrievalHit(t *testing.T) {
	c := Case{ID: "x", ExpectedBehaviour: "answer", ExpectedShape: "how-do-i",
		ExpectedSources: []string{"hiecm.flow.p1-create-abha-address"}}
	tr := Transcript{
		Answer: "Use the mobile route.",
		Sources: []chat.Source{{ID: "hiecm.flow.p1-create-abha-address"}},
		Calls: []ModelCall{
			{Reply: chat.Reply{ToolCalls: []chat.ToolCall{{Name: "search_docs"}, {Name: "get_atom"}}}},
			{Reply: chat.Reply{ToolCalls: []chat.ToolCall{{Name: "related_atoms"}}}},
			{Reply: chat.Reply{}},
		},
	}
	got := Check(c, tr)
	if got.ToolCalls != 3 {
		t.Errorf("ToolCalls = %d, want 3", got.ToolCalls)
	}
	if !got.RetrievalHit {
		t.Errorf("RetrievalHit should be true when an expected source was retrieved")
	}
	tr.Sources = nil
	if Check(c, tr).RetrievalHit {
		t.Errorf("RetrievalHit should be false when no expected source was retrieved")
	}
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd mcp && go test ./internal/eval/ -run TestToolCallsAndRetrievalHit -v`
Expected: FAIL, `got.ToolCalls undefined`

- [ ] **Step 3: Add the two fields**

In `mcp/internal/eval/checks.go`, find `type CheckResult struct` and add two fields:

```go
	// ToolCalls is how many tool calls the model made to produce the
	// answer. Cheap models compound error per sequential call, so the
	// mean over a run is a quality number, not a cost number.
	ToolCalls int `json:"tool_calls"`
	// RetrievalHit is whether any expected source was retrieved at all.
	// Scored apart from the criteria because retrieval and generation fail
	// differently: a wrong answer with the right atom in hand is a prompt
	// problem, a wrong answer with the wrong atom is an index problem.
	RetrievalHit bool `json:"retrieval_hit"`
```

At the end of `Check`, before `return CheckResult{CaseID: c.ID, Failures: f}`, compute them and return:

```go
	calls := 0
	for _, mc := range t.Calls {
		calls += len(mc.Reply.ToolCalls)
	}
	hit := len(c.ExpectedSources) == 0
	for _, want := range c.ExpectedSources {
		for _, s := range t.Sources {
			if s.ID == want {
				hit = true
			}
		}
	}
	return CheckResult{CaseID: c.ID, Failures: f, ToolCalls: calls, RetrievalHit: hit}
```

- [ ] **Step 4: Surface them in the scorecard**

Open `mcp/internal/eval/scorecard.go`. Where per-slice pass rates are computed from `[]CheckResult`, add two aggregates per slice and print them in the same table: `mean tool calls` (`float64(sumToolCalls)/float64(n)`, one decimal) and `retrieval hit rate` (`hits/n` as a percentage). Follow the exact formatting the file already uses for the pass rate column.

- [ ] **Step 5: Run the suite**

Run: `cd mcp && gofmt -l ./internal/eval/ && go vet ./internal/eval/ && go test ./internal/eval/`
Expected: no gofmt output, PASS.

- [ ] **Step 6: Commit**

```bash
git add mcp/internal/eval/checks.go mcp/internal/eval/checks_test.go mcp/internal/eval/scorecard.go
git commit -m "feat: the eval scores tool calls and retrieval apart from the answer"
```

### Task A3: Confusable cases

Twelve sibling pairs the catalogue distinguishes and readers do not. Each case asserts the right sibling and forbids the wrong claim.

**Files:**
- Create: `evals/askai/cases/confusable/confusable-<slug>-01.json`, twelve files

**Interfaces:**
- Consumes: slice `confusable` from A1.

- [ ] **Step 1: Verify every fact against the catalogue before writing it**

For each row below, grep the catalogue for the `must_contain` wording's source and paste the matching line into the case's `notes`. A criterion with no source line is not written.

```bash
grep -rn "self declared\|Self-Declared" catalogue/hiecm/flows/p1-create-abha-address.md
grep -rn "X-token\|Authorization" catalogue/hiecm/endpoints/m1-login-verify.md site/docs/hiecm/v3/milestones/m1.mdx
```

- [ ] **Step 2: Write the twelve cases from this table**

| slug | question | must_contain (one fact each) | must_not_contain | expected_sources | source_row |
|---|---|---|---|---|---|
| number-vs-address | "is abha number and abha address the same?" | "the ABHA number is the 14 digit identifier and the ABHA address is the readable handle such as name@abdm" ; "a person can hold several addresses but one number" | "they are the same" | shared.glossary.abha-number, shared.glossary.abha-address | annexure#glossary |
| hip-vs-hiu | "am I a HIP or a HIU?" | "a HIP publishes records it created and a HIU requests records held elsewhere" ; "one system can be both, and the role is per interaction" | "HIP and HIU are the same" | shared.glossary.hip, shared.glossary.hiu | annexure#glossary |
| m1-vs-p1 | "whats the difference between M1 and P1" | "M1 is the provider side, a hospital system creating and reading an ABHA" ; "P1 is the patient side, a PHR application the person holds" | "P1 is part of M1" | hiecm.flow.p1-create-abha-address, hiecm.flow.m1-create-abha-aadhaar-otp | annexure#phr-v3-documents |
| session-vs-user-token | "which token goes in the header?" | "the gateway session token goes in Authorization and the user token from login goes in X-token" ; "they are two tokens with two lifetimes" | "the same token" | hiecm.endpoint.gateway-sessions, hiecm.endpoint.m1-login-verify | annexure#m1-abha-collection |
| txnid-vs-requestid | "is txnId the same as REQUEST-ID?" | "REQUEST-ID is a fresh UUID you send on every call" ; "txnId is returned by the service and carried through one flow" | "the same value" | shared.glossary.request-id, shared.glossary.txn-id | annexure#glossary |
| abha-vs-abdm | "is ABHA the same as ABDM?" | "ABDM is the mission and the network" ; "ABHA is the person's health account on it" | "ABHA is another name for ABDM" | shared.glossary.abdm, shared.glossary.abha | annexure#glossary |
| hpr-vs-hfr | "do I register on HPR or HFR?" | "the HPR registers a healthcare professional and issues an HPID" ; "the HFR registers a facility and issues a facility ID" | "HPR and HFR are the same registry" | shared.glossary.hpr, shared.glossary.hfr | annexure#glossary |
| sandbox-vs-prod-host | "which host do I call?" | "the sandbox host is dev.abdm.gov.in for the gateway" ; "several published samples show the production host while describing sandbox behaviour" | "use the production host in the sandbox" | hiecm.concept.gateway-session | annexure#sandbox-faq-general |
| link-vs-access-token | "is the link token the access token?" | "the link token is per patient and valid for six months" ; "the access token is the gateway session token" | "the same token" | shared.glossary.link-token | annexure#glossary |
| otp-validity-vs-resend | "why cant I resend the otp" | "resend is locked for 60 seconds by design" | "resend is not supported" | hiecm.flow.p1-create-abha-address | annexure#phr-v3-documents |
| care-context-vs-consent | "do I need consent to link a care context?" | "linking a care context is the HIP attaching a record to an ABHA" ; "consent is what a HIU needs to fetch it later" | "consent is required to link" | shared.glossary.care-context, shared.glossary.consent-artefact | annexure#glossary |
| m2-vs-p2 | "is P2 the same as M2?" | "M2 is the provider linking records" ; "P2 is the patient side discovering and linking from their own app" | "P2 is part of M2" | hiecm.flow.p2-discover-and-link | annexure#phr-v3-documents |

Each file follows this exact shape (this is `confusable-number-vs-address-01.json`; repeat for every row with the row's values):

```json
{
  "id": "confusable-number-vs-address-01",
  "slice": "confusable",
  "class": "compare",
  "turns": [{"role": "user", "text": "is abha number and abha address the same?"}],
  "attachment": null,
  "page": null,
  "must_contain": [
    "the ABHA number is the 14 digit identifier and the ABHA address is the readable handle such as name@abdm",
    "a person can hold several addresses but one number"
  ],
  "must_not_contain": ["<MASKED", "i apologize", "i apologise", "let me ", "great question", "the catalogue", "atom", "they are the same"],
  "expected_sources": ["shared.glossary.abha-number", "shared.glossary.abha-address"],
  "expected_shape": "compare",
  "expected_behaviour": "answer",
  "derived_from": null,
  "source_row": "annexure#glossary",
  "catalogue_version": "2026.08.24",
  "notes": "Source line: <paste the grep line from step 1>. Fails on the wrong claim, not on a missing phrase."
}
```

If a glossary id in the table does not exist (check with `grep -rl "^id: shared.glossary.txn-id" catalogue`), use the id that does and note the substitution.

- [ ] **Step 3: Validate**

Run: `npm run lint:annexure -- --write && npm run lint:annexure && cd mcp && go test ./internal/eval/ -run TestLoadCases`
Expected: `lint-annexure: 15 rows, all citations resolve`; PASS.

- [ ] **Step 4: Commit**

```bash
git add evals/askai/cases/confusable/ catalogue/annexure/askai-sources.md
git commit -m "test: twelve confusable pairs the assistant must keep apart"
```

### Task A4: Abstain cases

Ten questions the catalogue cannot answer. Pass is a decline with a route.

**Files:**
- Create: `evals/askai/cases/abstain/abstain-<slug>-01.json`, ten files

- [ ] **Step 1: Write the ten cases**

Questions, each as a single user turn: `"what is the NHCX claim API endpoint"`, `"how do I integrate with UHI booking"`, `"what is the pricing of ABDM"`, `"give me the postman collection for M3 callbacks"`, `"which hospitals use ABDM in Pune"`, `"how do I get HPR data in bulk"`, `"is there a python sdk"`, `"what is the SLA of the sandbox"`, `"how do I contact NHA support by phone"`, `"can you write my M2 code for me"`.

Every file has this shape (example is `abstain-nhcx-endpoint-01.json`):

```json
{
  "id": "abstain-nhcx-endpoint-01",
  "slice": "abstain",
  "class": "out-of-scope",
  "turns": [{"role": "user", "text": "what is the NHCX claim API endpoint"}],
  "attachment": null,
  "page": null,
  "must_contain": ["/docs/"],
  "must_not_contain": ["<MASKED", "i apologize", "i apologise", "let me ", "great question", "the catalogue", "atom", "/api/nhcx"],
  "expected_sources": [],
  "expected_shape": "decline",
  "expected_behaviour": "decline",
  "derived_from": null,
  "source_row": "annexure#abdm-faq-general",
  "catalogue_version": "2026.08.24",
  "notes": "No NHCX endpoint is documented; the pass is a decline that names a page, and the fail is an invented path."
}
```

For each of the other nine, `must_not_contain` carries the specific invention that question invites (a price, a phone number, a package name, an SLA figure, a hospital name, a code block) as a short literal.

- [ ] **Step 2: Validate and commit**

Run: `npm run lint:annexure -- --write && cd mcp && go test ./internal/eval/`
Expected: PASS.

```bash
git add evals/askai/cases/abstain/ catalogue/annexure/askai-sources.md
git commit -m "test: ten questions with no answer, where the pass is a decline with a route"
```

### Task A5: Follow-up drift cases

Six two-turn conversations whose second turn is under-specified. The first turn's answer is fixed text so the case tests the second turn only.

**Files:**
- Create: `evals/askai/cases/followup/followup-<slug>-01.json`, six files

- [ ] **Step 1: Write the six cases**

Pairs (first user turn, fixed assistant turn, second user turn, what the second answer must contain):

1. `"how do I create an ABHA"` / `"Three routes: Aadhaar OTP, face authentication, identity document."` / `"and the address?"` → `"a mobile number and its OTP are enough for an ABHA address, with no Aadhaar and no ABHA number"`
2. `"what is M2"` / `"M2 is linking care contexts and sharing records as a HIP."` / `"what do I need first"` → `"a facility ID and registration in the HIP role, from the NHPR portal or from M4"`
3. `"what is a consent artefact"` / `"The signed record of what a patient allowed a HIU to fetch."` / `"how long is it valid"` → `"the artefact carries its own expiry, read it from the artefact"`
4. `"how do I get a session token"` / `"POST to the gateway sessions endpoint with your client id and secret."` / `"how long does it last"` → `"read expiresIn from the response rather than assuming a lifetime"`
5. `"what is a care context"` / `"One episode of care, linked to an ABHA address."` / `"can the patient see it"` → `"the patient sees linked care contexts in their PHR application"`
6. `"what is an HPID"` / `"The identifier a healthcare professional gets from the HPR."` / `"do I need it for M2"` → `"M2 needs a facility ID, not an HPID; the HPID is the professional's identity"`

Verify each `must_contain` fact against the catalogue with grep before writing it, as in A3 step 1, and paste the source line into `notes`. Use `expected_shape: "how-do-i"`, `class: "how-do-i"`, `source_row` as the fact's source row (`annexure#glossary` for glossary facts, `annexure#m1-abha-collection` for M1 endpoint facts, `annexure#phr-v3-documents` for P series facts).

- [ ] **Step 2: Validate and commit**

Run: `npm run lint:annexure -- --write && cd mcp && go test ./internal/eval/`

```bash
git add evals/askai/cases/followup/ catalogue/annexure/askai-sources.md
git commit -m "test: six follow-ups whose second turn is under specified"
```

### Task A6: Generate the naive slice (needs Bedrock)

Three rewrites of each of the 45 `faq-verbatim` cases, written the way a first-day reader types. Generated once, committed, reviewed like any other case.

**Files:**
- Create: `mcp/cmd/askai-eval/paraphrase.go`
- Modify: `mcp/cmd/askai-eval/main.go` (register the subcommand)
- Test: `mcp/cmd/askai-eval/paraphrase_test.go`

**Interfaces:**
- Consumes: `chat.Model` (the Bedrock model constructed the way `run` already constructs it in `main.go`), `eval.LoadCases`.
- Produces: `evals/askai/cases/naive/naive-<faq id>-0N.json` files with `derived_from` set to the FAQ case id.

- [ ] **Step 1: Write the failing test for the pure part**

```go
package main

import "testing"

func TestNaiveCaseFromParent(t *testing.T) {
	parent := loadOne(t, "../../../evals/askai/cases/faq-verbatim")
	got := naiveCase(parent, 2, "how do i make abha for patient no aadhar card")
	if got.ID != "naive-"+parent.ID+"-02" {
		t.Errorf("id = %q", got.ID)
	}
	if got.Slice != "naive" || got.DerivedFrom == nil || *got.DerivedFrom != parent.ID {
		t.Errorf("slice/derived_from wrong: %+v", got)
	}
	if got.Turns[0].Text != "how do i make abha for patient no aadhar card" {
		t.Errorf("turn text not replaced")
	}
	if len(got.MustContain) != len(parent.MustContain) || got.SourceRow != parent.SourceRow {
		t.Errorf("criteria and source must be inherited")
	}
}
```

with a helper in the test file:

```go
func loadOne(t *testing.T, dir string) eval.Case {
	t.Helper()
	cases, err := eval.LoadCases(dir)
	if err != nil || len(cases) == 0 {
		t.Fatalf("load %s: %v", dir, err)
	}
	return cases[0]
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./cmd/askai-eval/ -run TestNaiveCaseFromParent -v`
Expected: FAIL, `naiveCase undefined`

- [ ] **Step 3: Implement**

`mcp/cmd/askai-eval/paraphrase.go`:

```go
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/eval"
)

// naiveCase copies a parent case with its question replaced by a naive
// rewrite. Criteria, sources and the annexure row are inherited: the facts
// the answer must carry do not change with the phrasing.
func naiveCase(parent eval.Case, n int, text string) eval.Case {
	c := parent
	c.ID = fmt.Sprintf("naive-%s-%02d", parent.ID, n)
	c.Slice = "naive"
	id := parent.ID
	c.DerivedFrom = &id
	c.Turns = []eval.Turn{{Role: "user", Text: text}}
	c.Notes = "Naive rewrite of " + parent.ID + ", generated once and reviewed. " + parent.Notes
	return c
}

const paraphrasePrompt = `Rewrite the question below three times, each as a different person who knows almost nothing about ABDM would type it into a chat box. Use plain words, common misspellings (aadhar, abdm/abha confusion, health id), no acronyms they would not know, and no more than 15 words each. Keep the meaning. Return exactly three lines, one rewrite per line, nothing else.

Question: %s`

func paraphrases(ctx context.Context, m chat.Model, question string) ([]string, error) {
	var out strings.Builder
	_, err := m.Stream(ctx, "", nil,
		[]chat.Message{{Role: "user", Text: fmt.Sprintf(paraphrasePrompt, question)}},
		300, func(s string) { out.WriteString(s) })
	if err != nil {
		return nil, err
	}
	var lines []string
	for _, l := range strings.Split(out.String(), "\n") {
		l = strings.TrimSpace(strings.TrimLeft(l, "-0123456789. "))
		if l != "" {
			lines = append(lines, l)
		}
	}
	if len(lines) < 3 {
		return nil, fmt.Errorf("expected 3 rewrites, got %d: %q", len(lines), out.String())
	}
	return lines[:3], nil
}

func runParaphrase(args []string, model chat.Model) error {
	fs := flag.NewFlagSet("paraphrase", flag.ExitOnError)
	from := fs.String("from", "../evals/askai/cases/faq-verbatim", "parent cases")
	to := fs.String("to", "../evals/askai/cases/naive", "where naive cases are written")
	if err := fs.Parse(args); err != nil {
		return err
	}
	parents, err := eval.LoadCases(*from)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(*to, 0o755); err != nil {
		return err
	}
	for _, p := range parents {
		q := p.Turns[len(p.Turns)-1].Text
		rewrites, err := paraphrases(context.Background(), model, q)
		if err != nil {
			return fmt.Errorf("%s: %w", p.ID, err)
		}
		for i, r := range rewrites {
			c := naiveCase(p, i+1, r)
			b, _ := json.MarshalIndent(c, "", "  ")
			if err := os.WriteFile(filepath.Join(*to, c.ID+".json"), append(b, '\n'), 0o644); err != nil {
				return err
			}
		}
		fmt.Printf("%s: 3 rewrites\n", p.ID)
	}
	return nil
}
```

Register it in `main.go` beside `run`: a `case "paraphrase":` branch that builds the Bedrock model exactly as `run` does (same flags `-model`/`CHAT_MODEL`, `-region`/`AWS_REGION`) and calls `runParaphrase(os.Args[2:], model)`. Update the doc comment at the top of `main.go` to list `paraphrase` and say it needs Bedrock. `eval.Case` needs a `Notes string \`json:"notes"\`` field and `DerivedFrom *string` if they are not already there; check `case.go` and add `Notes` if missing.

- [ ] **Step 4: Run the tests**

Run: `cd mcp && gofmt -l ./cmd/askai-eval/ && go vet ./cmd/askai-eval/ && go test ./cmd/askai-eval/`
Expected: PASS.

- [ ] **Step 5: Generate (needs credentials), review, validate**

Run: `cd mcp && CHAT_MODEL=<bedrock model id> AWS_REGION=<region> go run ./cmd/askai-eval paraphrase`
Expected: 45 lines of `<id>: 3 rewrites`, 135 files under `evals/askai/cases/naive/`.

Read every generated question. Delete any that changed the meaning. Then: `npm run lint:annexure -- --write && cd mcp && go test ./internal/eval/`.

- [ ] **Step 6: Commit**

```bash
git add mcp/cmd/askai-eval/ evals/askai/cases/naive/ catalogue/annexure/askai-sources.md
git commit -m "test: a naive slice, three rewrites of every FAQ case as a first day reader types"
```

---

## Phase B: questions at index time

### Task B1: One atom loader for the indexer and the generator

**Files:**
- Create: `mcp/internal/catalogue/load.go`
- Modify: `mcp/cmd/indexer/main.go:63-104` (replace the inline walk with the call)
- Test: `mcp/internal/catalogue/load_test.go`

**Interfaces:**
- Produces: `func LoadAtoms(catDir string) ([]Atom, error)`.

- [ ] **Step 1: Write the failing test**

```go
package catalogue

import "testing"

func TestLoadAtomsSkipsNotesAndAnnexure(t *testing.T) {
	atoms, err := LoadAtoms("testdata/catalogue")
	if err != nil {
		t.Fatal(err)
	}
	if len(atoms) == 0 {
		t.Fatal("no atoms loaded from testdata")
	}
	for _, a := range atoms {
		if a.ID == "" {
			t.Errorf("atom from %s has no id", a.SourcePath)
		}
	}
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/catalogue/ -run TestLoadAtomsSkipsNotesAndAnnexure -v`
Expected: FAIL, `LoadAtoms undefined`

- [ ] **Step 3: Move the walk**

Cut the directory walk from `mcp/cmd/indexer/main.go` lines 63 to 104 (the loop that reads every `.md`, skips `README.md`, the `annexure/` directory and any non-atom file, and appends `catalogue.ParseAtom` results) into `mcp/internal/catalogue/load.go` as `LoadAtoms`, changing nothing about which files it skips. In `main.go` replace the block with:

```go
	atoms, err := catalogue.LoadAtoms(catDir)
	if err != nil {
		return err
	}
```

If `testdata/catalogue` has no annexure directory, add `testdata/catalogue/annexure/README.md` with one line so the skip rule is exercised.

- [ ] **Step 4: Verify nothing changed**

Run: `cd mcp && go test ./... && go run ./cmd/indexer -catalogue ../catalogue -out /tmp/before.db 2>&1 | tail -1`
Expected: the `indexed N atoms` line reports the same N as `git stash; go run ...; git stash pop` did before the change (320 at the time of writing).

- [ ] **Step 5: Commit**

```bash
git add mcp/internal/catalogue/load.go mcp/internal/catalogue/load_test.go mcp/cmd/indexer/main.go mcp/internal/catalogue/testdata/
git commit -m "refactor: one atom loader, shared by the indexer and the question generator"
```

### Task B2: Generate questions per atom (needs Bedrock)

**Files:**
- Create: `mcp/cmd/questiongen/main.go`
- Create: `mcp/internal/catalogue/questions.go`
- Test: `mcp/internal/catalogue/questions_test.go`
- Output: `catalogue/shared/atom-questions.json` (committed)

**Interfaces:**
- Produces: `type AtomQuestions struct { BodyHash string; Questions []string }`, `func ReadQuestions(path string) (map[string]AtomQuestions, error)`, `func BodyHash(a Atom) string`, `func CleanQuestions(raw []string, atomID string) []string`.

- [ ] **Step 1: Write the failing tests for the pure parts**

```go
package catalogue

import "testing"

func TestCleanQuestionsFiltersNoise(t *testing.T) {
	got := CleanQuestions([]string{
		"How do I create an ABHA without Aadhaar?",
		"how do i create an abha without aadhaar",   // duplicate after normalising
		"ABHA?",                                       // too short
		"Explain hiecm.flow.p1-create-abha-address",   // leaks the id
		"can a phr app register someone with just a phone number",
	}, "hiecm.flow.p1-create-abha-address")
	want := 2
	if len(got) != want {
		t.Fatalf("got %d questions %q, want %d", len(got), got, want)
	}
}

func TestBodyHashChangesWithBody(t *testing.T) {
	a := Atom{ID: "x", Body: "one"}
	b := Atom{ID: "x", Body: "two"}
	if BodyHash(a) == BodyHash(b) {
		t.Error("hash must change when the body changes")
	}
	if BodyHash(a) != BodyHash(a) {
		t.Error("hash must be stable")
	}
}
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd mcp && go test ./internal/catalogue/ -run 'TestCleanQuestions|TestBodyHash' -v`
Expected: FAIL, undefined.

- [ ] **Step 3: Implement the pure parts**

`mcp/internal/catalogue/questions.go`:

```go
package catalogue

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"strings"
)

// AtomQuestions is what a reader might type that this atom answers,
// generated once per catalogue version by a strong model and committed.
// BodyHash is the atom body the questions were written against, so a
// stale set can be detected without regenerating.
type AtomQuestions struct {
	BodyHash  string   `json:"body_hash"`
	Questions []string `json:"questions"`
}

func BodyHash(a Atom) string {
	sum := sha256.Sum256([]byte(a.Body))
	return "sha256:" + hex.EncodeToString(sum[:8])
}

// ReadQuestions loads catalogue/shared/atom-questions.json. A missing
// file is an empty map, not an error: the index builds without questions,
// it is just worse at matching naive phrasings.
func ReadQuestions(path string) (map[string]AtomQuestions, error) {
	b, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return map[string]AtomQuestions{}, nil
	}
	if err != nil {
		return nil, err
	}
	var out map[string]AtomQuestions
	return out, json.Unmarshal(b, &out)
}

// CleanQuestions drops what a generator produces that a reader never
// would: duplicates, fragments, and questions that leak the atom id.
func CleanQuestions(raw []string, atomID string) []string {
	seen := map[string]bool{}
	var out []string
	for _, q := range raw {
		q = strings.TrimSpace(q)
		key := strings.ToLower(strings.TrimRight(q, "?.! "))
		if len(strings.Fields(key)) < 4 || seen[key] || strings.Contains(key, strings.ToLower(atomID)) {
			continue
		}
		seen[key] = true
		out = append(out, q)
	}
	return out
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `cd mcp && go test ./internal/catalogue/ -run 'TestCleanQuestions|TestBodyHash' -v`
Expected: PASS.

- [ ] **Step 5: Write the generator**

`mcp/cmd/questiongen/main.go`. It builds the Bedrock model the way `cmd/askai-eval/main.go` does for `run` (copy that construction; same `CHAT_MODEL` and `AWS_REGION` handling), loads atoms with `catalogue.LoadAtoms`, reads the existing file, and only regenerates atoms whose `BodyHash` changed:

```go
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"sort"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

const prompt = `You write the questions a first day developer would type into a chat box that this document answers. They know almost nothing about ABDM. Use plain words, common misspellings (aadhar, health id), and the confusions people have (ABHA number versus ABHA address, HIP versus HIU). Write 15 questions, one per line, no numbering, no more than 16 words each. Only questions this document actually answers.

Title: %s
Summary: %s

%s`

func generate(ctx context.Context, m chat.Model, a catalogue.Atom) ([]string, error) {
	body := a.Body
	if len(body) > 6000 {
		body = body[:6000]
	}
	var out strings.Builder
	_, err := m.Stream(ctx, "", nil,
		[]chat.Message{{Role: "user", Text: fmt.Sprintf(prompt, a.Title, a.Summary, body)}},
		800, func(s string) { out.WriteString(s) })
	if err != nil {
		return nil, err
	}
	return catalogue.CleanQuestions(strings.Split(out.String(), "\n"), a.ID), nil
}

func main() {
	catDir := flag.String("catalogue", "../catalogue", "catalogue directory")
	out := flag.String("out", "../catalogue/shared/atom-questions.json", "questions file")
	flag.Parse()
	model := newBedrockModel() // copied from cmd/askai-eval/main.go's run
	atoms, err := catalogue.LoadAtoms(*catDir)
	if err != nil {
		fail(err)
	}
	existing, err := catalogue.ReadQuestions(*out)
	if err != nil {
		fail(err)
	}
	fresh, stale := 0, 0
	for _, a := range atoms {
		h := catalogue.BodyHash(a)
		if cur, ok := existing[a.ID]; ok && cur.BodyHash == h {
			fresh++
			continue
		}
		qs, err := generate(context.Background(), model, a)
		if err != nil {
			fail(fmt.Errorf("%s: %w", a.ID, err))
		}
		existing[a.ID] = catalogue.AtomQuestions{BodyHash: h, Questions: qs}
		stale++
		fmt.Printf("%s: %d questions\n", a.ID, len(qs))
	}
	// Drop atoms that no longer exist so the file never carries ghosts.
	live := map[string]bool{}
	for _, a := range atoms {
		live[a.ID] = true
	}
	for id := range existing {
		if !live[id] {
			delete(existing, id)
		}
	}
	ids := make([]string, 0, len(existing))
	for id := range existing {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	ordered := make(map[string]catalogue.AtomQuestions, len(ids))
	for _, id := range ids {
		ordered[id] = existing[id]
	}
	b, _ := json.MarshalIndent(ordered, "", "  ")
	if err := os.WriteFile(*out, append(b, '\n'), 0o644); err != nil {
		fail(err)
	}
	fmt.Printf("questions: %d atoms unchanged, %d regenerated -> %s\n", fresh, stale, *out)
}

func fail(err error) { fmt.Fprintln(os.Stderr, err); os.Exit(1) }
```

Go's `json.MarshalIndent` on a map already sorts keys, so the `ordered` copy is belt and braces; keep it, it documents the intent.

- [ ] **Step 6: Generate (needs credentials) and review**

Run: `cd mcp && CHAT_MODEL=<id> AWS_REGION=<region> go run ./cmd/questiongen`
Expected: one line per atom, then `questions: 0 atoms unchanged, 320 regenerated`. Open the file and read twenty atoms' questions at random; remove any that the atom does not answer.

- [ ] **Step 7: Commit**

```bash
git add mcp/cmd/questiongen/ mcp/internal/catalogue/questions.go mcp/internal/catalogue/questions_test.go catalogue/shared/atom-questions.json
git commit -m "feat: every atom carries the naive questions it answers, generated once and committed"
```

### Task B3: Index the questions for keyword and vector search

**Files:**
- Modify: `mcp/internal/index/schema.go` (`atoms_fts` gains `questions`)
- Modify: `mcp/internal/index/writer.go:34,58` (`Build` takes questions; insert them)
- Modify: `mcp/internal/index/search.go:54` (bm25 weights)
- Modify: `mcp/cmd/indexer/main.go` (read the file; add a questions chunk per atom)
- Test: `mcp/internal/index/search_test.go`

**Interfaces:**
- Consumes: `catalogue.ReadQuestions`.
- Produces: `index.Build(..., questions map[string]catalogue.AtomQuestions, ...)`.

- [ ] **Step 1: Write the failing test**

In `mcp/internal/index/search_test.go`, next to the existing search tests that build a temp index from `testdata`:

```go
func TestNaivePhrasingFindsAtomThroughQuestions(t *testing.T) {
	// Build the index the way the existing tests do, but pass a questions
	// map for one atom that carries a phrasing its body never uses.
	qs := map[string]catalogue.AtomQuestions{
		"hiecm.flow.m2-link-care-context": {
			BodyHash:  "sha256:test",
			Questions: []string{"how do i attach a hospital visit to a patient health id"},
		},
	}
	r := buildTestIndexWithQuestions(t, qs) // helper mirroring the existing builder, with the extra arg
	hits, err := r.Search(context.Background(), "attach hospital visit to health id", "", "", 5, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.flow.m2-link-care-context" {
		t.Fatalf("top hit = %+v, want the linking flow", hits)
	}
}
```

Write `buildTestIndexWithQuestions` in the test file by copying whatever helper the existing tests use to call `Build`, adding the questions argument.

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/index/ -run TestNaivePhrasingFindsAtomThroughQuestions -v`
Expected: FAIL to compile (Build has no questions parameter).

- [ ] **Step 3: Schema and writer**

In `schema.go` change the FTS table to:

```sql
CREATE VIRTUAL TABLE atoms_fts USING fts5(
    id UNINDEXED, title, summary, body, error_codes, questions
);
```

In `writer.go`, add `questions map[string]catalogue.AtomQuestions` to `Build`'s parameters (after `atoms`), and change the FTS insert at line 58 to:

```go
		qs := strings.Join(questions[a.ID].Questions, "\n")
		if _, err := tx.Exec(
			`INSERT INTO atoms_fts (id, title, summary, body, error_codes, questions) VALUES (?,?,?,?,?,?)`,
			a.ID, a.Title, a.Summary, a.Body, strings.Join(a.ErrorCodes, " "), qs); err != nil {
```

Update every caller of `Build` (the indexer and the test helpers) to pass the map; `map[string]catalogue.AtomQuestions{}` where there are none.

- [ ] **Step 4: Rank the questions column**

In `search.go:54` the bm25 weights are positional over the FTS columns `(id, title, summary, body, error_codes)`. Add the sixth:

```go
        ORDER BY bm25(atoms_fts, 0.0, 5.0, 3.0, 1.0, 8.0, 6.0)
```

A question match ranks just under an error code match and above title.

- [ ] **Step 5: Add a questions chunk per atom in the indexer**

In `mcp/cmd/indexer/main.go`, after atoms are loaded and before chunking:

```go
	questions, err := catalogue.ReadQuestions(filepath.Join(catDir, "shared", "atom-questions.json"))
	if err != nil {
		return fmt.Errorf("read atom questions: %w", err)
	}
	if len(questions) == 0 {
		fmt.Fprintln(os.Stderr, "no atom-questions.json, naive phrasings will match on prose only")
	}
```

and where `all = append(all, catalogue.ChunkAtom(a)...)` runs, append one more chunk when the atom has questions:

```go
			if q, ok := questions[a.ID]; ok && len(q.Questions) > 0 {
				all = append(all, catalogue.Chunk{
					AtomID:  a.ID,
					Heading: "Questions this answers",
					Text:    a.Title + "\nQuestions this answers:\n" + strings.Join(q.Questions, "\n"),
				})
			}
```

Pass `questions` to `index.Build`.

- [ ] **Step 6: Run everything**

Run: `cd mcp && gofmt -l ./... && go vet ./... && go test ./... && go run ./cmd/indexer -catalogue ../catalogue -out /tmp/q.db | tail -1`
Expected: PASS; the indexer line reports chunks greater than before by roughly the number of atoms with questions.

- [ ] **Step 7: Commit**

```bash
git add mcp/internal/index/ mcp/cmd/indexer/main.go
git commit -m "feat: the index matches the questions readers ask, not only the prose that answers them"
```

### Task B4: Lint stale questions

**Files:**
- Create: `scripts/lint-atom-questions.mjs`
- Modify: `package.json` (add `"lint:questions": "node scripts/lint-atom-questions.mjs"`)
- Modify: `.github/workflows/ci.yml` (run it beside `lint:atoms`)

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// Warns when an atom's body has changed since its questions were
// generated, and fails when an atom has no questions at all. The hash is
// the same sha256 prefix mcp/internal/catalogue/questions.go computes, so
// the two never disagree about what "stale" means.
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {loadAtoms, root} from './lib/atoms.mjs';

const path = join(root, 'catalogue', 'shared', 'atom-questions.json');
if (!existsSync(path)) {
  console.error('lint-atom-questions: catalogue/shared/atom-questions.json is missing. Run: cd mcp && go run ./cmd/questiongen');
  process.exit(1);
}
const questions = JSON.parse(readFileSync(path, 'utf8'));
const hash = (body) => 'sha256:' + createHash('sha256').update(body).digest('hex').slice(0, 16);

let missing = 0, stale = 0;
for (const atom of loadAtoms()) {
  const q = questions[atom.id];
  if (!q || !q.questions?.length) { console.error(`  no questions: ${atom.id}`); missing++; continue; }
  if (q.body_hash !== hash(atom.body)) { console.warn(`  stale: ${atom.id}`); stale++; }
}
console.log(`lint-atom-questions: ${Object.keys(questions).length} atoms with questions, ${stale} stale, ${missing} missing`);
if (missing) process.exit(1);
```

Check `scripts/lib/atoms.mjs` exports `loadAtoms` returning objects with `id` and `body` (the body being the markdown after frontmatter). If its field is named differently, use that name. The Go side hashes `a.Body`; confirm `catalogue.ParseAtom` sets `Body` to the same post-frontmatter text the JS loader exposes, or make the JS compute it the same way, so the two hashes agree. Add a test in `mcp/internal/catalogue/questions_test.go` that hashes a fixed body and asserts the known hex, and assert the same hex from Node in a one-line check in the script's own test if the repo has one; otherwise verify by hand once and record the pair in the script's comment.

- [ ] **Step 2: Wire and run**

Run: `npm run lint:questions`
Expected: `lint-atom-questions: 320 atoms with questions, 0 stale, 0 missing` (after B2 has run).

- [ ] **Step 3: Commit**

```bash
git add scripts/lint-atom-questions.mjs package.json .github/workflows/ci.yml
git commit -m "feat: a lint says when an atom outgrows the questions written for it"
```

---

## Phase C: route, then look up once

### Task C1: The deterministic router

**Files:**
- Create: `mcp/internal/route/route.go`
- Test: `mcp/internal/route/route_test.go`

**Interfaces:**
- Produces:

```go
package route

type Shape string

const (
	Define  Shape = "define"
	HowDoI  Shape = "how-do-i"
	Diagnose Shape = "diagnose"
	Compare Shape = "compare"
	Meta    Shape = "meta"
)

type Input struct {
	Question      string
	HasAttachment bool
}

type Result struct {
	Shape        Shape
	ErrorCodes   []string // from catalogue.ExtractErrorCodes
	OperationRef string   // a path like /api/hiecm/gateway/v3/sessions or an id like gateway_sessions_create, else ""
	Tools        []string // tool names to expose, in this order
}

func Route(in Input) Result
```

- [ ] **Step 1: Write the failing table test**

```go
package route

import (
	"reflect"
	"testing"
)

func TestRoute(t *testing.T) {
	cases := []struct {
		q     string
		att   bool
		shape Shape
		tools []string
	}{
		{"ABHA", false, Define, []string{"search_docs"}},
		{"what is a care context", false, Define, []string{"search_docs"}},
		{"how do i create abha without aadhar", false, HowDoI, []string{"search_docs"}},
		{"can a phr app register with just a phone number", false, HowDoI, []string{"search_docs"}},
		{"is abha number the same as abha address", false, Compare, []string{"search_docs"}},
		{"difference between HIP and HIU", false, Compare, []string{"search_docs"}},
		{"getting ABDM-1016 on sessions", false, Diagnose, []string{"search_docs", "decode_error"}},
		{"what headers does POST /api/hiecm/gateway/v3/sessions need", false, HowDoI, []string{"search_docs", "get_operation"}},
		{"gateway_sessions_create returns 401", false, Diagnose, []string{"search_docs", "get_operation"}},
		{"why is this failing", true, Diagnose, []string{"search_docs", "decode_error", "validate_request"}},
		{"which version of the catalogue is this", false, Meta, []string{"search_docs"}},
	}
	for _, c := range cases {
		got := Route(Input{Question: c.q, HasAttachment: c.att})
		if got.Shape != c.shape {
			t.Errorf("%q: shape %s, want %s", c.q, got.Shape, c.shape)
		}
		if !reflect.DeepEqual(got.Tools, c.tools) {
			t.Errorf("%q: tools %v, want %v", c.q, got.Tools, c.tools)
		}
	}
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/route/ -v`
Expected: FAIL, package does not exist.

- [ ] **Step 3: Implement**

```go
// Package route decides, before any model call, what shape of answer a
// question wants and which tools that shape may use. It is rules, not a
// model: the rules are cheap, testable, and wrong in ways that can be read.
package route

import (
	"regexp"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
)

type Shape string

const (
	Define   Shape = "define"
	HowDoI   Shape = "how-do-i"
	Diagnose Shape = "diagnose"
	Compare  Shape = "compare"
	Meta     Shape = "meta"
)

type Input struct {
	Question      string
	HasAttachment bool
}

type Result struct {
	Shape        Shape
	ErrorCodes   []string
	OperationRef string
	Tools        []string
}

var (
	pathRe   = regexp.MustCompile(`(?i)\b(?:GET|POST|PUT|PATCH|DELETE)?\s*(/(?:api|v3|v3\.1|hiecm|abha|phr)[A-Za-z0-9/_{}.\-]*)`)
	opIDRe   = regexp.MustCompile(`\b([a-z][a-z0-9]*(?:_[a-z0-9]+){2,})\b`)
	failRe   = regexp.MustCompile(`(?i)\b(fail|failing|error|returns? \d{3}|got \d{3}|\b4\d\d\b|\b5\d\d\b|not working|stuck|rejected|invalid)\b`)
	compRe   = regexp.MustCompile(`(?i)\b(difference|differ|vs\.?|versus|same as|the same|or a|compare|which one)\b`)
	metaRe   = regexp.MustCompile(`(?i)\b(catalogue version|which version|how (?:old|current)|last updated|built)\b`)
	whRe     = regexp.MustCompile(`(?i)^(what is|what's|whats|what are|define|meaning of|explain)\b`)
)

func Route(in Input) Result {
	q := strings.TrimSpace(in.Question)
	r := Result{ErrorCodes: catalogue.ExtractErrorCodes(q)}
	if m := pathRe.FindStringSubmatch(q); m != nil {
		r.OperationRef = m[1]
	} else if m := opIDRe.FindStringSubmatch(q); m != nil {
		r.OperationRef = m[1]
	}
	words := strings.Fields(q)

	switch {
	case in.HasAttachment, len(r.ErrorCodes) > 0, failRe.MatchString(q):
		r.Shape = Diagnose
	case compRe.MatchString(q):
		r.Shape = Compare
	case metaRe.MatchString(q):
		r.Shape = Meta
	case whRe.MatchString(q), len(words) <= 3 && !strings.Contains(q, "?") && !strings.HasPrefix(strings.ToLower(q), "how"):
		r.Shape = Define
	default:
		r.Shape = HowDoI
	}

	r.Tools = []string{"search_docs"}
	if len(r.ErrorCodes) > 0 || (r.Shape == Diagnose && r.OperationRef == "") {
		r.Tools = append(r.Tools, "decode_error")
	}
	if r.OperationRef != "" {
		r.Tools = append(r.Tools, "get_operation")
	}
	if in.HasAttachment {
		r.Tools = append(r.Tools, "validate_request")
	}
	return r
}
```

- [ ] **Step 4: Run to verify it passes; adjust regexes until every row passes without weakening a rule**

Run: `cd mcp && gofmt -l ./internal/route/ && go test ./internal/route/ -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add mcp/internal/route/
git commit -m "feat: a router decides the answer shape and its tools before the model is asked"
```

### Task C2: The composite lookup

**Files:**
- Modify: `mcp/internal/server/tools.go` (add `lookupIn`, `PassagePack`, `Lookup`)
- Test: `mcp/internal/server/tools_test.go`

**Interfaces:**
- Consumes: `t.r.Search`, `t.r.GetAtom`, `t.r.RelatedAtoms`, `index.DocLink`.
- Produces:

```go
type lookupIn struct {
	Query     string `json:"query" jsonschema:"what the reader asked, in their words"`
	Milestone string `json:"milestone,omitempty"`
}

type Passage struct {
	ID, Type, Milestone, Title, VerificationStatus, DocURL string
	Body string // full body for the top hits, summary for the rest
}

type PassagePack struct {
	Passages []Passage `json:"passages"`
	// Related are one hop out from the top hits: id and title only, so
	// the model knows a sibling exists without paying to read it.
	Related []map[string]string `json:"related"`
}

func (t *Tools) Lookup(ctx context.Context, in lookupIn) (PassagePack, error)
```

- [ ] **Step 1: Write the failing test**

In `mcp/internal/server/tools_test.go`, using the same test reader the file already builds:

```go
func TestLookupOpensTopHitsAndWalksOneHop(t *testing.T) {
	tools := newTestTools(t) // the helper the existing tool tests use
	pack, err := tools.Lookup(context.Background(), lookupIn{Query: "link care contexts"})
	if err != nil {
		t.Fatal(err)
	}
	if len(pack.Passages) == 0 || len(pack.Passages) > 5 {
		t.Fatalf("passages = %d, want 1..5", len(pack.Passages))
	}
	if pack.Passages[0].Body == "" {
		t.Error("top passage must carry the full body, not a snippet")
	}
	for i, p := range pack.Passages {
		if i >= 3 && len(p.Body) > 600 {
			t.Errorf("passage %d past the top three should be a summary, got %d chars", i, len(p.Body))
		}
	}
	if len(pack.Related) == 0 {
		t.Error("expected at least one related atom one hop out")
	}
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/server/ -run TestLookupOpensTopHitsAndWalksOneHop -v`
Expected: FAIL, undefined.

- [ ] **Step 3: Implement**

In `tools.go`:

```go
type lookupIn struct {
	Query     string `json:"query" jsonschema:"what the reader asked, in their words"`
	Milestone string `json:"milestone,omitempty" jsonschema:"M1..M4, P1..P3 to narrow, else empty"`
}

type Passage struct {
	ID                 string `json:"id"`
	Type               string `json:"type"`
	Milestone          string `json:"milestone"`
	Title              string `json:"title"`
	VerificationStatus string `json:"verification_status"`
	DocURL             string `json:"doc_url"`
	Body               string `json:"body"`
}

type PassagePack struct {
	Passages []Passage           `json:"passages"`
	Related  []map[string]string `json:"related"`
}

const (
	lookupHits   = 5
	lookupOpened = 3
)

// Lookup is search, open and walk in one call. The chat model used to
// chain search_docs, get_atom and related_atoms itself and often stopped
// at a 200 character snippet; a cheap model stops there more often. Doing
// the chain in code costs nothing the model can get wrong.
func (t *Tools) Lookup(ctx context.Context, in lookupIn) (PassagePack, error) {
	hits, err := t.r.Search(ctx, in.Query, "", in.Milestone, lookupHits, t.emb)
	if err != nil {
		return PassagePack{}, err
	}
	var pack PassagePack
	seenRelated := map[string]bool{}
	for i, h := range hits {
		p := Passage{ID: h.ID, Type: h.Type, Milestone: h.Milestone, Title: h.Title,
			VerificationStatus: h.VerificationStatus, DocURL: index.DocLink(h.DocURL, h.DocAnchor),
			Body: h.Summary}
		if i < lookupOpened {
			a, err := t.r.GetAtom(h.ID)
			if err == nil {
				p.Body = a.Body
				groups, err := t.r.RelatedAtoms(h.ID)
				if err == nil {
					for _, g := range groups {
						for _, ref := range g.Atoms {
							if seenRelated[ref.ID] {
								continue
							}
							seenRelated[ref.ID] = true
							pack.Related = append(pack.Related, map[string]string{
								"id": ref.ID, "type": g.Type, "title": ref.Title})
						}
					}
				}
			}
		}
		pack.Passages = append(pack.Passages, p)
	}
	return pack, nil
}
```

Check the field names on `RelatedAtoms`' groups (`g.Type`, `g.Atoms[i].ID`, `.Title`) against `atomRefsJSON` in the same file and use whatever it uses.

- [ ] **Step 4: Run; then the whole server package**

Run: `cd mcp && gofmt -l ./internal/server/ && go test ./internal/server/`
Expected: PASS, goldens untouched (Lookup is not on the MCP surface).

- [ ] **Step 5: Commit**

```bash
git add mcp/internal/server/tools.go mcp/internal/server/tools_test.go
git commit -m "feat: one lookup does search, open and walk, so the model never has to chain them"
```

### Task C3: Chat tools per route

**Files:**
- Modify: `mcp/internal/server/tools.go` (add `ChatToolsFor`)
- Test: `mcp/internal/server/tools_test.go`

**Interfaces:**
- Consumes: `route.Result.Tools`, the existing `Defs()`.
- Produces: `func (t *Tools) ChatToolsFor(names []string) []chat.ToolDef` where the name `search_docs` binds to `Lookup` with `lookupIn`'s schema and a description written as a trigger condition, and every other name binds to the matching entry from `Defs()`.

- [ ] **Step 1: Write the failing test**

```go
func TestChatToolsForBindsSearchDocsToLookup(t *testing.T) {
	tools := newTestTools(t)
	defs := tools.ChatToolsFor([]string{"search_docs", "decode_error"})
	if len(defs) != 2 || defs[0].Name != "search_docs" || defs[1].Name != "decode_error" {
		t.Fatalf("got %+v", defs)
	}
	out, err := defs[0].Call(context.Background(), json.RawMessage(`{"query":"link care contexts"}`))
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := out["passages"]; !ok {
		t.Errorf("chat search_docs must return a passage pack, got keys %v", keys(out))
	}
	if !strings.Contains(defs[0].Description, "Call this when") {
		t.Errorf("description must state when to call it, got %q", defs[0].Description)
	}
}
```

Add `func keys(m map[string]any) []string` to the test file if it is not there.

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/server/ -run TestChatToolsForBindsSearchDocsToLookup -v`
Expected: FAIL, undefined.

- [ ] **Step 3: Implement**

```go
const chatSearchDescription = "Call this when the answer is not already in the passages you were given, or the reader asks a follow-up that needs something new. It searches this portal's documentation and returns the matching pages in full, with their related pages named. Send the reader's own words as the query."

// ChatToolsFor is the chat loop's view of the tools: only the names the
// router chose, and search_docs bound to Lookup rather than to the
// snippet search the MCP serves. The MCP keeps the granular tools; the
// chat model gets the composite under a name it already knows.
func (t *Tools) ChatToolsFor(names []string) []chat.ToolDef {
	byName := map[string]ToolDef{}
	for _, d := range t.Defs() {
		byName[d.Name] = d
	}
	var out []chat.ToolDef
	for _, n := range names {
		if n == "search_docs" {
			out = append(out, chat.ToolDef{
				Name: "search_docs", Description: chatSearchDescription,
				InputSchema: mustSchemaFor[lookupIn](),
				Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
					var in lookupIn
					if err := json.Unmarshal(raw, &in); err != nil {
						return nil, err
					}
					pack, err := t.Lookup(ctx, in)
					if err != nil {
						return nil, err
					}
					return t.versioned(map[string]any{"passages": pack.Passages, "related": pack.Related}), nil
				},
			})
			continue
		}
		if d, ok := byName[n]; ok {
			out = append(out, chat.ToolDef{Name: d.Name, Description: d.Description, InputSchema: d.InputSchema, Call: d.Call})
		}
	}
	return out
}
```

`collectSources` in `loop.go:466` reads sources out of tool results by name; extend it so a `search_docs` result carrying `passages` yields one source per passage (id, title, doc_url, verification_status), the same fields `sourceFromFields` reads today. Add a test in `loop_test.go` that a passages payload produces N sources.

- [ ] **Step 4: Run; commit**

Run: `cd mcp && go test ./internal/server/ ./internal/chat/`

```bash
git add mcp/internal/server/tools.go mcp/internal/server/tools_test.go mcp/internal/chat/loop.go mcp/internal/chat/loop_test.go
git commit -m "feat: the chat loop sees only the tools its route needs, with search bound to the composite lookup"
```

### Task C4: Pre-retrieve, then generate with routed tools

**Files:**
- Modify: `mcp/internal/chat/loop.go` (Service gains `Route` and `Lookup` hooks; Respond uses them)
- Modify: `mcp/internal/server/http.go:81` and `mcp/internal/eval/runner.go:59` (wire the hooks)
- Test: `mcp/internal/chat/loop_test.go`

**Interfaces:**
- Consumes: `route.Route`, `Tools.Lookup`, `Tools.ChatToolsFor`.
- Produces `guard.PackFacts` (create `mcp/internal/guard/shape.go` with only the type below now; Task E2 adds `CheckShape` to the same file):

```go
// PackFacts is what a verifier needs from the passage pack: the flow
// titles it carried, and whether both ABHA identifiers were in play.
type PackFacts struct {
	FlowTitles          []string
	MentionsABHANumber  bool
	MentionsABHAAddress bool
}
```

- Produces on `chat.Service`:

```go
	// Lookup pre-retrieves a passage pack for the question before the
	// first model call. nil means no pre-retrieval (tests, or a caller
	// that wants the old behaviour).
	Lookup func(ctx context.Context, question string) (json.RawMessage, []Source, guard.PackFacts, error)
	// ToolsFor returns the tools to expose for this question. nil means
	// s.Tools unchanged.
	ToolsFor func(question string, hasAttachment bool) []ToolDef
```

- [ ] **Step 1: Write the failing test**

```go
func TestRespondPreRetrievesAndExposesRoutedTools(t *testing.T) {
	var sawTools []string
	var sawFirstUser string
	m := &fakeModel{reply: Reply{Text: "An ABHA address is the handle.", StopReason: "end_turn"},
		onStream: func(system string, tools []ToolDef, msgs []Message) {
			for _, td := range tools {
				sawTools = append(sawTools, td.Name)
			}
			sawFirstUser = msgs[len(msgs)-1].Text
		}}
	svc := &Service{Model: m, MaxTokens: 100,
		Lookup: func(ctx context.Context, q string) (json.RawMessage, []Source, guard.PackFacts, error) {
			return json.RawMessage(`{"passages":[{"id":"shared.glossary.abha-address","title":"ABHA address"}]}`),
				[]Source{{ID: "shared.glossary.abha-address", Title: "ABHA address"}}, guard.PackFacts{}, nil
		},
		ToolsFor: func(q string, att bool) []ToolDef {
			return []ToolDef{{Name: "search_docs"}, {Name: "decode_error"}}
		},
	}
	var sources []Source
	emit := func(event string, data any) error {
		if event == "sources" {
			sources = data.([]Source)
		}
		return nil
	}
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "what is an abha address"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	if len(sawTools) != 2 {
		t.Errorf("tools exposed = %v, want the two routed ones", sawTools)
	}
	if !strings.Contains(sawFirstUser, "shared.glossary.abha-address") {
		t.Errorf("passage pack was not placed in the user turn: %q", sawFirstUser)
	}
	if len(sources) != 1 {
		t.Errorf("pre-retrieved passages must count as sources, got %v", sources)
	}
}
```

Use the fake model the existing `loop_test.go` already defines; if it lacks an `onStream` hook, add one field to it.

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/chat/ -run TestRespondPreRetrievesAndExposesRoutedTools -v`
Expected: FAIL, unknown fields `Lookup`, `ToolsFor`.

- [ ] **Step 3: Implement in Respond**

Add the two fields to `Service`. In `Respond`, after `question := lastUserText(turns)` and before the `runRound` closure:

```go
	tools := s.Tools
	if s.ToolsFor != nil {
		tools = s.ToolsFor(question, lastUserAttachment(turns) != nil)
	}
	if s.Lookup != nil {
		pack, packSources, facts, err := s.Lookup(ctx, question)
		if err != nil {
			slog.Warn("pre-retrieval failed, continuing without it", "error", err)
		} else if len(pack) > 0 {
			for _, src := range packSources {
				addSource(&sources, src)
			}
			g.corpus.Write(pack)
			// The pack rides in the last user turn, never the system prompt:
			// the Bedrock cache point sits after the system text, and a
			// per-question system suffix would defeat it on every call.
			last := &msgs[len(msgs)-1]
			last.Text = "<passages>\n" + string(pack) + "\n</passages>\n\n" + last.Text
			looked = true // pre-retrieval is a lookup; do not send lookFirst
		}
	}
	_ = facts // used by the shape check in Task E3
```

`looked` is declared later today (`looked := false` just before the loop); move that declaration above this block. Replace the two uses of `s.Tools` inside `Respond` (`runRound` and `runTool`) with `tools`.

- [ ] **Step 4: Wire the hooks where a Service is built**

In `mcp/internal/server/http.go`, where `chat.Service` is constructed for `/api/chat`, and in `mcp/internal/eval/runner.go:59`, set:

```go
		Lookup: func(ctx context.Context, q string) (json.RawMessage, []chat.Source, guard.PackFacts, error) {
			pack, err := tools.Lookup(ctx, lookupIn{Query: q})
			if err != nil {
				return nil, nil, guard.PackFacts{}, err
			}
			b, err := json.Marshal(pack)
			if err != nil {
				return nil, nil, guard.PackFacts{}, err
			}
			var srcs []chat.Source
			var facts guard.PackFacts
			for _, p := range pack.Passages {
				srcs = append(srcs, chat.Source{ID: p.ID, Title: p.Title, DocURL: p.DocURL, VerificationStatus: p.VerificationStatus})
				if p.Type == "flow" {
					facts.FlowTitles = append(facts.FlowTitles, p.Title)
				}
			}
			lower := strings.ToLower(string(b))
			facts.MentionsABHANumber = strings.Contains(lower, "abha number")
			facts.MentionsABHAAddress = strings.Contains(lower, "abha address")
			return b, srcs, facts, nil
		},
		ToolsFor: func(q string, att bool) []chat.ToolDef {
			return tools.ChatToolsFor(route.Route(route.Input{Question: q, HasAttachment: att}).Tools)
		},
```

Match `chat.Source`'s real field names (read `loop.go:70`). `runner.go` builds its `Service` from `cfg.Tools`; give `RunConfig` a `Tools *server.Tools` field (the struct, not the defs) so it can wire the same two hooks, and update `cmd/askai-eval/main.go` to pass it. If `eval` importing `server` creates an import cycle, move the two closures into a small `server.ChatHooks(tools *Tools) (lookup, toolsFor)` helper and have both callers use it.

- [ ] **Step 5: Run everything, then a golden check**

Run: `cd mcp && gofmt -l ./... && go vet ./... && go test ./...`
Expected: PASS. If `TestGoldenChatEndpoint` or similar fails because a transcript now starts with `<passages>`, regenerate that golden with `-update` and read the diff to confirm the only change is the pack.

- [ ] **Step 6: Commit**

```bash
git add mcp/internal/chat/ mcp/internal/server/ mcp/internal/eval/runner.go mcp/cmd/askai-eval/main.go
git commit -m "feat: the passages are retrieved before the model is asked, and it sees only the tools its route allows"
```

---

## Phase D: a cached core and a per-shape block

### Task D1: Per-shape blocks

**Files:**
- Create: `mcp/internal/chat/shapes.go`
- Test: `mcp/internal/chat/shapes_test.go`

**Interfaces:**
- Produces: `func ShapeBlock(shape string) string` returning the text placed in the user turn for that shape, and `var shapeBudget = map[string]int{...}` matching the eval's ceilings minus the margin (define 120, how-do-i 200, diagnose 200, compare 200, meta 100, decline 60).

- [ ] **Step 1: Write the failing test**

```go
func TestEveryShapeHasABlockWithBudgetAndExemplar(t *testing.T) {
	for _, s := range []string{"define", "how-do-i", "diagnose", "compare", "meta", "decline"} {
		b := ShapeBlock(s)
		if !strings.Contains(b, "words") || !strings.Contains(b, "Example") {
			t.Errorf("%s: block must state a word budget and carry an example, got %q", s, b)
		}
	}
	if ShapeBlock("nonsense") != ShapeBlock("how-do-i") {
		t.Error("an unknown shape falls back to how-do-i")
	}
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/chat/ -run TestEveryShapeHasABlock -v`

- [ ] **Step 3: Write the blocks**

`mcp/internal/chat/shapes.go`, all six, in full. The exemplars are short and true to the catalogue; the executor must check each exemplar's facts with grep before committing.

```go
package chat

// A shape block is the part of the prompt that changes per question. It
// travels in the user turn so the system prompt stays byte-identical and
// cached. Each block: the skeleton, the budget, one exemplar. A cheap
// model told the shape and shown one example of it stops varying.
var shapeBudget = map[string]int{
	"define": 120, "how-do-i": 200, "diagnose": 200, "compare": 200, "meta": 100, "decline": 60,
}

var shapeBlocks = map[string]string{
	"define": `<answer_shape name="define" budget="120 words">
Say what it is in one sentence, then who it matters to and the one thing people get wrong about it. No list, no headings, at most four sentences.
Example:
An ABHA address is the readable handle, such as name@abdm on production or name@sbx on sandbox, that records are linked against and that a person shares at a facility. It is not the ABHA number: a person has one number and can hold several addresses. NHA also calls it the PHR address.
</answer_shape>`,

	"how-do-i": `<answer_shape name="how-do-i" budget="200 words">
First sentence: the direct answer. Then every route that exists, one line each, naming what each produces. Expand only the route asked about, as a short numbered list of calls. End with the next step.
Example:
Yes, and there are three creation routes: Aadhaar OTP, which is mandatory; Aadhaar face authentication, for someone who cannot receive the OTP; and an identity document, which produces an account restricted until Aadhaar KYC. For Aadhaar OTP:
1. Request an OTP against the encrypted Aadhaar number.
2. Verify it with the enrolment call, which issues the ABHA number.
3. Get address suggestions and claim one.
Confirm by reading the profile back and checking the chosen address is marked preferred.
</answer_shape>`,

	"diagnose": `<answer_shape name="diagnose" budget="200 words">
First line: what the code or symptom means. Then the cause, the fix, and how the reader knows it worked, as three short lines. Name the header or field, never rewrite their code.
Example:
ABDM-1016 is a header validation failure on the gateway. Cause: TIMESTAMP is not ISO 8601 in UTC, or REQUEST-ID is reused. Fix: send TIMESTAMP as 2026-09-10T10:15:30.000Z and a fresh UUID in REQUEST-ID on every call. You will know it worked when the sessions call returns 200 with an accessToken.
</answer_shape>`,

	"compare": `<answer_shape name="compare" budget="200 words">
One sentence naming both things and the one distinction that matters. Then two short lines, one per thing. Say which the reader probably needs.
Example:
A HIP publishes records it created and a HIU requests records held elsewhere; the role is per interaction, and one system can be both. HIP: your facility attaching its own visits to an ABHA address. HIU: your system fetching a patient's records from other facilities, with consent. A hospital sharing its own records is a HIP first.
</answer_shape>`,

	"meta": `<answer_shape name="meta" budget="100 words">
Answer the question about this documentation itself in one or two sentences, from catalogue_info. Give the version and the build date if asked.
Example:
This documentation is catalogue version 2026.08.24, built 2026-09-07. Every answer here comes from it and names its sources.
</answer_shape>`,

	"decline": `<answer_shape name="decline" budget="60 words">
Say in one sentence that this is not covered here, then name the closest page or the support route. Never guess a value, a host or a path.
Example:
NHCX claim endpoints are not documented on this portal. The NHCX section at /docs/nhcx/v1 says what it is and where NHA documents it, and /docs/support lists the channels.
</answer_shape>`,
}

func ShapeBlock(shape string) string {
	if b, ok := shapeBlocks[shape]; ok {
		return b
	}
	return shapeBlocks["how-do-i"]
}
```

- [ ] **Step 4: Verify the exemplar facts, run, commit**

Run: `grep -rn "ABDM-1016" catalogue/hiecm/errors/abdm-1016.md | head -3` and adjust the diagnose exemplar to what the atom says. Then `cd mcp && go test ./internal/chat/`.

```bash
git add mcp/internal/chat/shapes.go mcp/internal/chat/shapes_test.go
git commit -m "feat: one block per answer shape, with its budget and one example"
```

### Task D2: A cached core, shape block in the user turn, page out of the system prompt

**Files:**
- Modify: `mcp/internal/chat/loop.go` (`systemPromptTemplate`, `PromptVersion`, `Respond`)
- Test: `mcp/internal/chat/loop_test.go`

- [ ] **Step 1: Write the failing test**

```go
func TestSystemPromptIsStableAndShapeAndPageRideInTheUserTurn(t *testing.T) {
	var systems []string
	var lastUser string
	m := &fakeModel{reply: Reply{Text: "ok", StopReason: "end_turn"},
		onStream: func(system string, tools []ToolDef, msgs []Message) {
			systems = append(systems, system)
			lastUser = msgs[len(msgs)-1].Text
		}}
	svc := &Service{Model: m, MaxTokens: 100}
	page := &Page{Title: "M1", URL: "/docs/hiecm/v3/milestones/m1", Markdown: "# M1\nSeven journeys."}
	_ = svc.Respond(context.Background(), []Turn{{Role: "user", Text: "what is an abha"}}, page, func(string, any) error { return nil })
	_ = svc.Respond(context.Background(), []Turn{{Role: "user", Text: "how do i link a record"}}, nil, func(string, any) error { return nil })
	if systems[0] != systems[1] {
		t.Error("system prompt must be byte identical across questions and with or without a page")
	}
	if !strings.Contains(lastUser, "<answer_shape") {
		t.Errorf("shape block missing from the user turn: %q", lastUser)
	}
	if len(strings.Fields(systems[0])) > 650 {
		t.Errorf("core prompt is %d words, want at most 650", len(strings.Fields(systems[0])))
	}
}
```

Extend the first `Respond` assertion to check that `"Seven journeys."` appeared in that call's last user text (capture per call), so the page moved rather than vanished.

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/chat/ -run TestSystemPromptIsStable -v`
Expected: FAIL on the system-identity check (page text is appended to system today) and the word count.

- [ ] **Step 3: Rewrite the core prompt**

Replace `systemPromptTemplate` with a core of at most 650 words. Keep, verbatim from the current prompt: the opening paragraph, WHERE THINGS LIVE (the atoms versus operations split, `loop.go:173-180`), the honesty rules about verified and unverified content (`loop.go:196`), the rule that API literals come only from tools (`loop.go:209`), the OFFERING THE TOOLS section, and the four literal-handling lines under WRITING THE ANSWER (lead with the answer, no preamble, quote literals exactly, inline code and no headings). Remove everything that is per-shape (budgets, list versus prose, the completeness and identifier rules added in `fix/m1-biometric-honesty`), since those now live in `shapes.go`. Add one paragraph:

```
HOW A QUESTION ARRIVES

The user turn may open with a <passages> block: the documentation already retrieved for this question, with ids and page links. Answer from it first. It is followed by an <answer_shape> block naming the shape and word budget your answer must take. Call search_docs only when the passages do not carry the answer.
```

Bump `PromptVersion` to `"v2"` and note the change in the PR body as `loop.go:141` asks.

- [ ] **Step 4: Move the page and add the shape block in Respond**

In `Respond`, delete `if page.attached() { system += page.prompt() }`. After the pre-retrieval block from C4, and always (even when `Lookup` is nil):

```go
	shape := string(route.Route(route.Input{Question: question, HasAttachment: lastUserAttachment(turns) != nil}).Shape)
	last := &msgs[len(msgs)-1]
	prefix := ""
	if page.attached() {
		prefix += page.prompt() + "\n\n"
	}
	prefix += ShapeBlock(shape) + "\n\n"
	last.Text = prefix + last.Text
```

Order in the final user text: passages, page, shape block, then the reader's words. If C4's block already prepended passages, prepend page and shape before it by building the prefix once; adjust C4's code so both prefixes are assembled in one place.

`page.prompt()` currently returns text written for the system position; reread it (`loop.go:61`) and reword it in the second person if it says "the system prompt".

- [ ] **Step 5: Run, update goldens knowingly, commit**

Run: `cd mcp && gofmt -l ./... && go vet ./... && go test ./...`
Expected: PASS after regenerating any eval golden whose transcript changed; read each diff.

```bash
git add mcp/internal/chat/
git commit -m "feat: the system prompt is a cached core, and everything per question rides in the user turn"
```

### Task D3: Confirm the cache is hit

Not code. In the deployed environment, after D2 ships:

- [ ] Send the same question twice through `/api/chat` and read the Bedrock invocation metrics for the model (CloudWatch `CacheReadInputTokenCount` on the Bedrock namespace, or the `usage` block if `bedrock.go` is later made to log it). The second call must show cache reads greater than zero. If it does not, something per-request is still reaching the system string; `git grep "system +="` in `mcp/internal/chat/` is where to look.

---

## Phase E: verify, and retry once

### Task E1: Word budgets live in guard, shared by loop and eval

**Files:**
- Create: `mcp/internal/guard/budget.go`
- Modify: `mcp/internal/eval/checks.go` (delete `wordBudget` and `words`, import guard)
- Test: `mcp/internal/guard/guard_test.go` (move `TestWordBudget`'s pure assertions)

- [ ] **Step 1: Move**

`mcp/internal/guard/budget.go`:

```go
package guard

import (
	"regexp"
	"strings"
)

var fencedBlockRe = regexp.MustCompile("(?s)```.*?```")

// WordBudget is the ceiling per answer shape. The prompt sets the target
// (chat.shapeBudget); this sits above it on purpose. The prompt shapes a
// good answer, this catches one that has stopped being an answer.
var WordBudget = map[string]int{
	"define": 150, "how-do-i": 260, "diagnose": 260, "compare": 260, "meta": 150, "decline": 80,
}

// Words counts prose words with fenced blocks removed: a worked example is
// not verbose because its curl is long.
func Words(s string) int {
	return len(strings.Fields(fencedBlockRe.ReplaceAllString(s, " ")))
}

// OverBudget returns the count and ceiling when an answer of this shape is
// too long, else ok is false.
func OverBudget(shape, answer string) (n, max int, over bool) {
	max, ok := WordBudget[shape]
	if !ok {
		return 0, 0, false
	}
	n = Words(answer)
	return n, max, n > max
}
```

In `eval/checks.go` replace the budget block with:

```go
	if n, max, over := guard.OverBudget(c.ExpectedShape, answer); over {
		add("budget: %s answer is %d words, over %d", c.ExpectedShape, n, max)
	}
```

and delete `wordBudget` and `words` from `checks.go`. Keep `fencedBlockRe` in `checks.go` if other checks use it.

- [ ] **Step 2: Run both packages, commit**

Run: `cd mcp && go test ./internal/guard/ ./internal/eval/`

```bash
git add mcp/internal/guard/ mcp/internal/eval/checks.go mcp/internal/eval/checks_test.go
git commit -m "refactor: the word budget lives in guard so the loop and the eval read one number"
```

### Task E2: Shape checks the loop can run

**Files:**
- Create: `mcp/internal/guard/shape.go`
- Test: `mcp/internal/guard/shape_test.go`

**Interfaces:**
- Produces: `func CheckShape(shape, answer string, pack PackFacts) []string` and

```go
// PackFacts is what the verifier needs from the passage pack: the flow
// titles it carried, and whether both identifiers were in play.
type PackFacts struct {
	FlowTitles          []string
	MentionsABHANumber  bool
	MentionsABHAAddress bool
}
```

- [ ] **Step 1: Write the failing tests**

```go
package guard

import "testing"

func TestCheckShapeNamesEveryRoute(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{
		"Create an ABHA using an Aadhaar OTP",
		"Create an ABHA using Aadhaar face authentication",
		"Create an ABHA from an identity document",
	}}
	two := "There are two routes: Aadhaar OTP and face authentication. Call the OTP endpoint first."
	if f := CheckShape("how-do-i", two, pack); len(f) == 0 {
		t.Error("an answer naming two of three routes must fail")
	}
	three := "Three routes: Aadhaar OTP, face authentication, and an identity document such as a driving licence."
	if f := CheckShape("how-do-i", three, pack); len(f) != 0 {
		t.Errorf("all three named, got %v", f)
	}
}

func TestCheckShapeDisambiguatesIdentifiers(t *testing.T) {
	pack := PackFacts{MentionsABHANumber: true, MentionsABHAAddress: true}
	vague := "You need Aadhaar to create it. Then choose a username."
	if f := CheckShape("how-do-i", vague, pack); len(f) == 0 {
		t.Error("first sentence names neither identifier; must fail")
	}
	clear := "An ABHA address needs no ABHA number: a mobile OTP is enough."
	if f := CheckShape("how-do-i", clear, pack); len(f) != 0 {
		t.Errorf("first sentence names the identifier, got %v", f)
	}
}

func TestCheckShapeSkipsDefineAndDecline(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{"A", "B"}, MentionsABHANumber: true, MentionsABHAAddress: true}
	for _, s := range []string{"define", "decline", "meta"} {
		if f := CheckShape(s, "Short.", pack); len(f) != 0 {
			t.Errorf("%s should not be route or identifier checked, got %v", s, f)
		}
	}
}
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd mcp && go test ./internal/guard/ -run TestCheckShape -v`

- [ ] **Step 3: Implement**

```go
package guard

import (
	"fmt"
	"regexp"
	"strings"
)

type PackFacts struct {
	FlowTitles          []string
	MentionsABHANumber  bool
	MentionsABHAAddress bool
}

var (
	firstSentenceRe = regexp.MustCompile(`^[^.!?\n]*[.!?]`)
	stopWords       = map[string]bool{"a": true, "an": true, "the": true, "using": true, "from": true, "create": true, "with": true, "to": true, "of": true, "and": true, "for": true, "in": true}
)

// routeKey is the two most specific words of a flow title, lowercased:
// "Create an ABHA using Aadhaar face authentication" -> "face authentication".
// An answer names the route when both words appear within four words of
// each other, in either order.
func routeKey(title string) []string {
	var words []string
	for _, w := range strings.Fields(strings.ToLower(title)) {
		w = strings.Trim(w, ",.:;()")
		if !stopWords[w] && w != "abha" && w != "aadhaar" {
			words = append(words, w)
		}
	}
	if len(words) > 2 {
		words = words[len(words)-2:]
	}
	return words
}

func namesRoute(answer string, key []string) bool {
	if len(key) == 0 {
		return true
	}
	lower := strings.ToLower(answer)
	if len(key) == 1 {
		return strings.Contains(lower, key[0])
	}
	pat := regexp.MustCompile(regexp.QuoteMeta(key[0]) + `(?:\W+\w+){0,3}\W+` + regexp.QuoteMeta(key[1]) +
		`|` + regexp.QuoteMeta(key[1]) + `(?:\W+\w+){0,3}\W+` + regexp.QuoteMeta(key[0]))
	return pat.MatchString(lower)
}

// CheckShape runs the two rules that turned real answers wrong: naming
// fewer routes than the passages carried, and talking about "it" when both
// ABHA identifiers were in play. Only shapes that explain a procedure or a
// comparison are checked; a definition or a decline has no routes to omit.
func CheckShape(shape, answer string, pack PackFacts) []string {
	if shape != "how-do-i" && shape != "compare" && shape != "diagnose" {
		return nil
	}
	var f []string
	if len(pack.FlowTitles) >= 2 {
		for _, t := range pack.FlowTitles {
			if !namesRoute(answer, routeKey(t)) {
				f = append(f, fmt.Sprintf("route not named: %s", t))
			}
		}
	}
	if pack.MentionsABHANumber && pack.MentionsABHAAddress {
		first := strings.ToLower(firstSentenceRe.FindString(answer))
		if !strings.Contains(first, "abha number") && !strings.Contains(first, "abha address") {
			f = append(f, "first sentence names neither ABHA number nor ABHA address")
		}
	}
	return f
}
```

Tune `routeKey`'s stop list until the three test titles yield `otp`, `face authentication` and `identity document` as keys. The test's "two routes" answer must fail on the document key only.

- [ ] **Step 4: Run, commit**

Run: `cd mcp && gofmt -l ./internal/guard/ && go test ./internal/guard/`

```bash
git add mcp/internal/guard/shape.go mcp/internal/guard/shape_test.go
git commit -m "feat: two checks for the two ways real answers went wrong"
```

### Task E3: Hold the answer, verify, retry once

The answer is no longer streamed as it is generated; it is released once it passes or once the single retry is spent. Latency to first token rises to the whole answer; correctness on a cheap model is worth it, and the panel already shows the tool progress cue.

**Files:**
- Modify: `mcp/internal/chat/loop.go` (Respond)
- Test: `mcp/internal/chat/loop_test.go`

**Interfaces:**
- Consumes: `guard.CheckShape`, `guard.OverBudget`, and the `guard.PackFacts` that `Service.Lookup` already returns from Task C4 (flow titles, and whether both ABHA identifiers appear in the pack). Task C4 must be merged before this one; E1 and E2 do not depend on it.

- [ ] **Step 1: Write the failing test**

```go
func TestRespondRetriesOnceWhenTheShapeCheckFails(t *testing.T) {
	replies := []Reply{
		{Text: "There are two routes: Aadhaar OTP and face authentication.", StopReason: "end_turn"},
		{Text: "Three routes: Aadhaar OTP, face authentication, and an identity document.", StopReason: "end_turn"},
	}
	calls := 0
	var lastUser string
	m := &fakeModel{next: func(msgs []Message) Reply {
		calls++
		lastUser = msgs[len(msgs)-1].Text
		return replies[calls-1]
	}}
	svc := &Service{Model: m, MaxTokens: 100,
		Lookup: func(ctx context.Context, q string) (json.RawMessage, []Source, guard.PackFacts, error) {
			return json.RawMessage(`{"passages":[]}`), nil, guard.PackFacts{FlowTitles: []string{
				"Create an ABHA using an Aadhaar OTP", "Create an ABHA using Aadhaar face authentication", "Create an ABHA from an identity document"}}, nil
		}}
	var out strings.Builder
	emit := func(event string, data any) error {
		if event == "text" {
			out.WriteString(data.(map[string]string)["delta"])
		}
		return nil
	}
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "how do i create abha"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	if calls != 2 {
		t.Fatalf("model called %d times, want 2 (one retry)", calls)
	}
	if !strings.Contains(lastUser, "route not named") {
		t.Errorf("retry must tell the model what failed, got %q", lastUser)
	}
	if strings.Contains(out.String(), "two routes") || !strings.Contains(out.String(), "Three routes") {
		t.Errorf("reader must see only the corrected answer, got %q", out.String())
	}
}
```

Give the fake model a `next func([]Message) Reply` hook if it lacks one.

- [ ] **Step 2: Run to verify it fails**

Run: `cd mcp && go test ./internal/chat/ -run TestRespondRetriesOnce -v`

- [ ] **Step 3: Implement**

In `Respond`: keep `PackFacts` from the lookup as `facts`. Change the text path so every round's text is buffered (extend the existing `holding` mechanism: `holding` stays true for all rounds, and `firstRound` becomes `held`). At the `len(reply.ToolCalls) == 0` branch, before flushing:

```go
			answer := held.String()
			failures := guard.CheckShape(shape, answer, facts)
			if n, max, over := guard.OverBudget(shape, answer); over {
				failures = append(failures, fmt.Sprintf("over budget: %d words, limit %d", n, max))
			}
			if len(failures) > 0 && !retried && round < MaxToolCalls {
				retried = true
				slog.Info("answer_failed_shape_check", "shape", shape, "failures", failures)
				msgs = append(msgs,
					Message{Role: "assistant", Text: answer},
					Message{Role: "user", Text: "Your answer failed these checks: " + strings.Join(failures, "; ") +
						". Rewrite it once, inside the word budget, naming every route the passages carry. Do not apologise or mention the checks."})
				held.Reset()
				continue
			}
			onText(answer)
			held.Reset()
```

Declare `retried := false` beside `looked`. The existing `lookFirst` retry and this one share the `held` buffer; keep both, and make sure a `lookFirst` retry does not also consume the shape retry (they are separate booleans).

- [ ] **Step 4: Run everything, commit**

Run: `cd mcp && gofmt -l ./... && go vet ./... && go test ./...`

```bash
git add mcp/internal/chat/ mcp/internal/server/ mcp/internal/eval/
git commit -m "feat: an answer is checked before a reader sees it, and rewritten once when it fails"
```

---

## Phase F: run it, read it, tune it (needs Bedrock)

- [ ] Build the index with questions: `cd mcp && go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db`.
- [ ] Run: `npm run eval:askai:run` then `npm run eval:askai:check` and `npm run eval:askai:report`.
- [ ] Read the scorecard per slice. The launch bar from the spec: at least 90 percent criteria on a held-out third of `naive` (choose the third by sorting case ids and taking every third), mean tool calls at most 1.5, zero `confusable` misses.
- [ ] For every failure, classify it: retrieval miss (`retrieval_hit` false, fix questions or vocabulary), over budget (raise the ceiling only if the answer was right and necessary), shape check (read the retry transcript), or a wrong fact (fix the atom).
- [ ] Add every misspelling and synonym the failures reveal to `catalogue/shared/vocabulary.yaml`, one line each, and rebuild.

## Self-review against the spec

- Stage 0 normalise: vocabulary expansion already runs inside `ftsSearch`; the router extracts codes and refs (C1). Covered.
- Stage 1 route: C1, C3, C4. The embedding router is out of scope by the spec's own words.
- Stage 2 pre-retrieve: C2, C4.
- Stage 3 generate: D1, D2; tools per route via C3.
- Stage 4 verify and retry: E1, E2, E3.
- Stage 5 abstain: unchanged, exercised by A4.
- Index-time questions: B1 to B4.
- Eval slices and measures: A1 to A6.
- Cache stability: D2's test asserts a byte-identical system prompt; D3 confirms in deployment.
- Type consistency: `Service.Lookup` returns `guard.PackFacts` from Task C4 onward; `PackFacts` is defined in C4 and `CheckShape` is added beside it in E2, so no signature changes between phases.
