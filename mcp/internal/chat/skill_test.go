package chat

import (
	"context"
	"strings"
	"testing"
	"unicode/utf8"
)

func TestValidateCommand(t *testing.T) {
	good := []Command{{}, {Name: "debug"}, {Name: "scaffold", Module: "abdm-m2"}, {Name: "design", Module: "abdm-scan-and-pay"}}
	for _, c := range good {
		if err := ValidateCommand(c); err != nil {
			t.Errorf("%+v: %v", c, err)
		}
	}
	bad := []Command{{Name: "deploy"}, {Module: "abdm-m2"}, {Name: "debug", Module: "../etc"}, {Name: "debug", Module: "m2"}}
	for _, c := range bad {
		if ValidateCommand(c) == nil {
			t.Errorf("%+v: want an error", c)
		}
	}
}

func TestResolveModule(t *testing.T) {
	known := []string{"abdm-gateway", "abdm-m1", "abdm-m2", "abdm-m3", "abdm-p1", "abdm-scan-and-pay"}
	page := func(url string) *Page { return &Page{Title: "t", URL: url, Markdown: "x"} }
	cases := []struct {
		name     string
		cmd      Command
		page     *Page
		question string
		want, by string
	}{
		{"pick wins over everything", Command{Name: "debug", Module: "abdm-m3"}, page("/docs/hiecm/v3/milestones/m2/index.md"), "about P1", "abdm-m3", "pick"},
		{"a pick this deployment lacks does not count", Command{Name: "debug", Module: "abdm-m9"}, nil, "an M1 question", "abdm-m1", "question"},
		{"milestone page", Command{Name: "debug"}, page("https://docs.example.org/docs/hiecm/v3/milestones/m2/index.md"), "why does this fail", "abdm-m2", "page"},
		{"api reference page", Command{Name: "debug"}, page("/docs/hiecm/v3/api/gateway"), "token expired", "abdm-gateway", "page"},
		{"a concept page names no module", Command{Name: "debug"}, page("/docs/hiecm/v3/concepts/care-context.md"), "linking fails", "", ""},
		{"M named in the question", Command{Name: "design"}, nil, "design my M3 consent flow", "abdm-m3", "question"},
		{"milestone spelled out", Command{Name: "design"}, nil, "Milestone 1 ABHA creation", "abdm-m1", "question"},
		{"named module", Command{Name: "integrate"}, nil, "wiring up scan and pay", "abdm-scan-and-pay", "question"},
		{"not a module mention", Command{Name: "debug"}, nil, "my hmp1 field is wrong", "", ""},
		{"a module this deployment lacks", Command{Name: "debug"}, nil, "M4 registry", "", ""},
		{"nothing to go on", Command{Name: "debug"}, nil, "it fails with 400", "", ""},
	}
	for _, c := range cases {
		got, by := ResolveModule(c.cmd, c.page, c.question, known)
		if got != c.want || by != c.by {
			t.Errorf("%s: got (%q, %q), want (%q, %q)", c.name, got, by, c.want, c.by)
		}
	}
}

func TestCutSectionLeavesShortSectionsWhole(t *testing.T) {
	body := "# Debug\n\nShort.\n"
	got, cut := CutSection(body, "anything", 1000)
	if cut || got != body {
		t.Fatalf("a short section came back changed: cut=%v %q", cut, got)
	}
}

func TestCutSectionKeepsWhatTheQuestionNeeds(t *testing.T) {
	filler := strings.Repeat("Unrelated detail about retries and timeouts. ", 40)
	body := "# Debug M2\n\nRead this first.\n\n" +
		"## Timeouts\n\n" + filler + "\n\n" +
		"### ABDM-1017\n\nThe care context was already linked. Fix: unlink it first.\n\n" +
		"## Consent\n\n" + filler + "\n\n" +
		"```md\n## not a heading, inside a fence\n```\n\n" +
		"## Linking\n\nHow linking works with care contexts.\n"
	budget := 900
	got, cut := CutSection(body, "Why do I get ABDM-1017 when linking a care context?", budget)
	if !cut {
		t.Fatal("a section over budget was not cut")
	}
	if n := utf8.RuneCountInString(got); n > budget {
		t.Fatalf("cut is %d characters, over the %d budget", n, budget)
	}
	for _, want := range []string{"Read this first.", "Sections in this guide:", "- ABDM-1017", "- Consent", "unlink it first", "This guide was cut to fit"} {
		if !strings.Contains(got, want) {
			t.Errorf("cut is missing %q:\n%s", want, got)
		}
	}
	if strings.Contains(got, "- not a heading") {
		t.Error("a heading inside a fence was treated as a section")
	}
	// The error code's block sorts ahead of everything, but goes back in the
	// section's own order: after the preamble and outline, before Linking.
	if i, j := strings.Index(got, "unlink it first"), strings.Index(got, "How linking works"); j >= 0 && i > j {
		t.Error("kept blocks were not put back in document order")
	}
}

func TestCutSectionWithAnOutlineLongerThanTheBudget(t *testing.T) {
	var b strings.Builder
	b.WriteString("# Huge\n")
	for i := 0; i < 400; i++ {
		b.WriteString("## A very long section heading that goes on for a while\n\nbody\n")
	}
	got, cut := CutSection(b.String(), "q", 500)
	if !cut || utf8.RuneCountInString(got) > 500 {
		t.Fatalf("cut=%v, %d characters for a 500 budget", cut, utf8.RuneCountInString(got))
	}
}

func TestSkillBlockCarriesTheScaffoldRule(t *testing.T) {
	if got := skillBlock("abdm-m2", "scaffold", "steps"); !strings.Contains(got, scaffoldRule) || !strings.Contains(got, `section="scaffold"`) {
		t.Fatalf("scaffold block: %q", got)
	}
	if got := skillBlock("abdm-m2", "debug", "steps"); strings.Contains(got, scaffoldRule) {
		t.Fatal("the scaffold rule went on a debug section")
	}
}

// skillService answers with a fixed reply and carries three module skills:
// M1 with a design section, M2 without one, and the gateway.
func skillService(fm *fakeModel) *Service {
	sections := map[string]string{
		"abdm-m1/design":     "# Design M1\n\nChoose the Aadhaar OTP path first.",
		"abdm-m1/debug":      "# Debug M1\n\nABDM-1016 means a bad token.",
		"abdm-m2/debug":      "# Debug M2\n\nABDM-1017 means already linked.",
		"abdm-gateway/debug": "# Debug gateway\n\nRefresh the session.",
		"abdm-m2/scaffold":   "# Scaffold M2\n\nWrite the discover handler.",
	}
	return &Service{
		Model:     fm,
		MaxTokens: 100,
		Skill: func(name, section string) (string, bool) {
			body, ok := sections[name+"/"+section]
			return body, ok
		},
		SkillModules: func() []string { return []string{"abdm-gateway", "abdm-m1", "abdm-m2"} },
	}
}

func skillEvent(t *testing.T, evs []event) SkillUse {
	t.Helper()
	for _, e := range evs {
		if e.name == "skill" {
			return e.data.(SkillUse)
		}
	}
	t.Fatal("no skill event")
	return SkillUse{}
}

func TestRespondCommandPutsTheSectionInFrontOfTheModel(t *testing.T) {
	fm := &fakeModel{replies: []Reply{{Text: "Unlink it first.", StopReason: "end_turn"}}, texts: []string{"Unlink it first."}}
	emit, evs := collectEvents()
	turns := []Turn{{Role: "user", Text: "Why ABDM-1017 on M2 linking?"}}
	if err := skillService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: "debug"}, emit); err != nil {
		t.Fatal(err)
	}
	use := skillEvent(t, *evs)
	if use.Status != "used" || use.Module != "abdm-m2" || use.ResolvedBy != "question" || use.URI != "skill://abdm-m2/debug" {
		t.Fatalf("skill event = %+v", use)
	}
	if (*evs)[0].name != "skill" {
		t.Fatalf("first event is %q, want the skill event before any text", (*evs)[0].name)
	}
	last := fm.gotMsgs[0][len(fm.gotMsgs[0])-1].Text
	if !strings.Contains(last, `<skill module="abdm-m2" section="debug">`) || !strings.Contains(last, "already linked") {
		t.Fatalf("the model was not shown the section:\n%s", last)
	}
}

func TestRespondCommandAsksWhenItCannotTellTheModule(t *testing.T) {
	fm := &fakeModel{}
	emit, evs := collectEvents()
	turns := []Turn{{Role: "user", Text: "How should I design this?"}}
	if err := skillService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: "design"}, emit); err != nil {
		t.Fatal(err)
	}
	if fm.calls != 0 {
		t.Fatalf("the model was called %d times; an unresolved command must ask, not answer", fm.calls)
	}
	use := skillEvent(t, *evs)
	if use.Status != "unresolved" || len(use.Candidates) != 1 || use.Candidates[0] != "abdm-m1" {
		t.Fatalf("skill event = %+v, want unresolved with only the modules that have a design section", use)
	}
	if (*evs)[len(*evs)-1].name != "done" {
		t.Fatal("the stream did not end with done")
	}
}

func TestRespondCommandAnswersFromTheDocsWhenTheSectionIsMissing(t *testing.T) {
	fm := &fakeModel{replies: []Reply{{Text: "From the docs.", StopReason: "end_turn"}}, texts: []string{"From the docs."}}
	emit, evs := collectEvents()
	turns := []Turn{{Role: "user", Text: "Design the M2 flow"}}
	if err := skillService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: "design"}, emit); err != nil {
		t.Fatal(err)
	}
	if use := skillEvent(t, *evs); use.Status != "missing" || use.Module != "abdm-m2" {
		t.Fatalf("skill event = %+v", use)
	}
	if last := fm.gotMsgs[0][len(fm.gotMsgs[0])-1].Text; strings.Contains(last, "<skill") {
		t.Fatal("a skill block went to the model for a section that does not exist")
	}
}

func TestRespondCommandScaffoldCarriesTheNoCodeRule(t *testing.T) {
	fm := &fakeModel{replies: []Reply{{Text: "Build these in order.", StopReason: "end_turn"}}, texts: []string{"Build these in order."}}
	emit, _ := collectEvents()
	turns := []Turn{{Role: "user", Text: "Scaffold my HIP"}}
	page := &Page{Title: "M2", URL: "/docs/hiecm/v3/milestones/m2/index.md", Markdown: "# M2"}
	if err := skillService(fm).RespondCommand(context.Background(), turns, page, Command{Name: "scaffold"}, emit); err != nil {
		t.Fatal(err)
	}
	if last := fm.gotMsgs[0][len(fm.gotMsgs[0])-1].Text; !strings.Contains(last, scaffoldRule) {
		t.Fatal("a scaffold section went to the model without the no-code rule")
	}
}

func TestRespondWithoutACommandIsUnchanged(t *testing.T) {
	fm := &fakeModel{replies: []Reply{{Text: "An answer.", StopReason: "end_turn"}}, texts: []string{"An answer."}}
	emit, evs := collectEvents()
	if err := skillService(fm).Respond(context.Background(), []Turn{{Role: "user", Text: "M2 linking"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	for _, e := range *evs {
		if e.name == "skill" {
			t.Fatal("a skill event went out with no command picked")
		}
	}
}
