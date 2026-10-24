package chat

import (
	"context"
	"strings"
	"testing"
)

const perFunctionalityRouter = "# ABDM M1\n\n| # | Functionality | Gov | Private |\n|---|---|---|---|\n" +
	"| 1 | [Create ABHA by Aadhaar OTP](references/functionalities/create-abha-aadhaar-otp.md) | x | x |\n" +
	"| 2 | [Log in with ABHA number](references/functionalities/login-abha-number.md) | x | x |\n" +
	"| 3 | [Find ABHA by mobile](references/functionalities/find-abha-mobile.md) | x | x |\n" +
	"| 4 | [Find ABHA by mobile with face authentication](references/functionalities/find-abha-face-auth.md) | none | none |\n"

// perFunctionalityService carries M1 built per functionality and M2 with its job files.
func perFunctionalityService(fm *fakeModel) *Service {
	sections := map[string]string{
		"abdm-m1/":            perFunctionalityRouter,
		"abdm-m1/foundations": "# Foundations M1\n\nSearch before create.",
		"abdm-m1/errors":      "# Errors M1\n\nABDM-1204 is a wrong OTP.",
		"abdm-m1/functionalities/find-abha-mobile":        "# Find ABHA by mobile\n\nList before any OTP.",
		"abdm-m1/functionalities/create-abha-aadhaar-otp": "# Create ABHA by Aadhaar OTP\n\nThe consent screen.",
		"abdm-m1/functionalities/login-abha-number":       "# Log in with ABHA number\n\nBoth routes.",
		"abdm-m1/functionalities/find-abha-face-auth":     "# Find with face\n\nQR after the choice.",
		"abdm-m2/":      "# ABDM M2\n\nRouter.",
		"abdm-m2/debug": "# Debug M2\n\nABDM-1017 means already linked.",
	}
	return &Service{
		Model:     fm,
		MaxTokens: 100,
		Skill: func(name, section string) (string, bool) {
			body, ok := sections[name+"/"+section]
			return body, ok
		},
		SkillModules: func() []string { return []string{"abdm-m1", "abdm-m2"} },
	}
}

func TestRouterFunctionalitiesAndMatch(t *testing.T) {
	fs := RouterFunctionalities(perFunctionalityRouter)
	if len(fs) != 4 || fs[0].ID != "create-abha-aadhaar-otp" || fs[2].Title != "Find ABHA by mobile" {
		t.Fatalf("functionalities = %+v", fs)
	}
	if got := RouterFunctionalities("# M2\n\n[scaffold](references/scaffold.md)"); len(got) != 0 {
		t.Fatalf("a job file router listed %+v", got)
	}
	cases := map[string]string{
		"How should the find ABHA by mobile list look?":  "find-abha-mobile",
		"Why does find-abha-face-auth show no QR?":       "find-abha-face-auth",
		"The consent before I create an ABHA by Aadhaar": "create-abha-aadhaar-otp",
		"Logging in with an ABHA number fails":           "login-abha-number",
		"What is ABHA?":                                  "",
		"Find my ABHA":                                   "find-abha-mobile",
	}
	for q, want := range cases {
		if got := MatchFunctionality(q, fs); got != want {
			t.Errorf("MatchFunctionality(%q) = %q, want %q", q, got, want)
		}
	}
}

func TestRespondCommandOnAPerFunctionalityModule(t *testing.T) {
	for _, tc := range []struct {
		command, question, uri string
		want, not              []string
	}{
		{"design", "Design the M1 find ABHA by mobile list", "skill://abdm-m1/functionalities/find-abha-mobile",
			[]string{`section="router"`, `section="foundations"`, `section="functionalities/find-abha-mobile"`, "List before any OTP"}, []string{`section="errors"`}},
		{"debug", "M1 returned ABDM-1204", "skill://abdm-m1/errors",
			[]string{`section="router"`, `section="errors"`, "wrong OTP"}, []string{`section="functionalities/`}},
		{"scaffold", "Scaffold M1", "skill://abdm-m1",
			[]string{`section="router"`, "Find ABHA by mobile"}, []string{`section="foundations"`, `section="errors"`}},
		{"integrate", "Integrate M1 login with ABHA number", "skill://abdm-m1/functionalities/login-abha-number",
			[]string{`section="router"`, "Both routes."}, []string{`section="foundations"`}},
	} {
		fm := &fakeModel{replies: []Reply{{Text: "ok", StopReason: "end_turn"}}, texts: []string{"ok"}}
		emit, evs := collectEvents()
		turns := []Turn{{Role: "user", Text: tc.question}}
		if err := perFunctionalityService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: tc.command}, emit); err != nil {
			t.Fatal(err)
		}
		use := skillEvent(t, *evs)
		if use.Status != "used" || use.Module != "abdm-m1" || use.URI != tc.uri {
			t.Errorf("%s: skill event = %+v", tc.command, use)
		}
		last := fm.gotMsgs[0][len(fm.gotMsgs[0])-1].Text
		for _, w := range tc.want {
			if !strings.Contains(last, w) {
				t.Errorf("%s: the model was not shown %q", tc.command, w)
			}
		}
		for _, n := range tc.not {
			if strings.Contains(last, n) {
				t.Errorf("%s: the model was shown %q", tc.command, n)
			}
		}
	}
}

func TestRespondCommandKeepsJobFilesForOtherModules(t *testing.T) {
	fm := &fakeModel{replies: []Reply{{Text: "ok", StopReason: "end_turn"}}, texts: []string{"ok"}}
	emit, evs := collectEvents()
	turns := []Turn{{Role: "user", Text: "Why ABDM-1017 on M2 linking?"}}
	if err := perFunctionalityService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: "debug"}, emit); err != nil {
		t.Fatal(err)
	}
	use := skillEvent(t, *evs)
	if use.Status != "used" || use.URI != "skill://abdm-m2/debug" || use.Href != "/skills/abdm-m2/references/debug.md" {
		t.Fatalf("skill event = %+v", use)
	}
	if last := fm.gotMsgs[0][len(fm.gotMsgs[0])-1].Text; strings.Contains(last, `section="router"`) {
		t.Fatal("a job file module was given the router")
	}
}

func TestUnresolvedCommandOffersPerFunctionalityModules(t *testing.T) {
	fm := &fakeModel{}
	emit, evs := collectEvents()
	turns := []Turn{{Role: "user", Text: "How should I design this?"}}
	if err := perFunctionalityService(fm).RespondCommand(context.Background(), turns, nil, Command{Name: "design"}, emit); err != nil {
		t.Fatal(err)
	}
	use := skillEvent(t, *evs)
	if use.Status != "unresolved" || len(use.Candidates) != 1 || use.Candidates[0] != "abdm-m1" {
		t.Fatalf("skill event = %+v", use)
	}
}
