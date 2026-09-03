package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/eval"
)

func writeCase(t *testing.T, dir string, c eval.Case) {
	t.Helper()
	raw, err := json.MarshalIndent(c, "", "  ")
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, c.ID+".json"), raw, 0o644); err != nil {
		t.Fatal(err)
	}
}

func ratchetCase() eval.Case {
	return eval.Case{
		ID: "define-hmis-01", Slice: "define", Class: "define",
		Turns:             []eval.Turn{{Role: "user", Text: "what is a HIMS"}},
		MustContain:       []string{"hospital software"},
		ExpectedSources:   []string{"shared.glossary.hmis"},
		ExpectedShape:     "define",
		ExpectedBehaviour: "answer",
		SourceRow:         "annexure#glossary",
		CatalogueVersion:  "2026.08.24",
	}
}

// buildRun writes one case (its transcript has no sources, so it always
// fails "citations: none") into a fresh temp cases dir and run dir. When
// baselineIDs is non-nil, a baseline.json listing those ids is written
// beside the run directory; when it is nil, no baseline.json is written at
// all.
func buildRun(t *testing.T, baselineIDs []string) (casesDir, runDir string) {
	t.Helper()
	root := t.TempDir()
	casesDir = filepath.Join(root, "cases")
	if err := os.MkdirAll(casesDir, 0o755); err != nil {
		t.Fatal(err)
	}
	writeCase(t, casesDir, ratchetCase())

	runsDir := filepath.Join(root, "runs")
	runDir = filepath.Join(runsDir, "2026-09-03-v1")
	tr := eval.Transcript{
		CaseID: "define-hmis-01",
		Answer: "HMIS is the software a hospital runs day to day.",
		Corpus: "HMIS, hospital management information system",
	}
	if err := eval.WriteTranscript(filepath.Join(runDir, "transcripts"), tr); err != nil {
		t.Fatal(err)
	}

	if baselineIDs != nil {
		raw, err := json.Marshal(struct {
			FailingCases []string `json:"failing_cases"`
		}{FailingCases: baselineIDs})
		if err != nil {
			t.Fatal(err)
		}
		if err := os.MkdirAll(runsDir, 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(runsDir, "baseline.json"), raw, 0o644); err != nil {
			t.Fatal(err)
		}
	}
	return casesDir, runDir
}

// TestCheckIntoNoBaselineFileWritesOneAndPasses covers C3: the very first
// run has nothing to ratchet against, so it must not fail the command that
// just produced it. checkInto writes runs/baseline.json from this run's own
// failures instead, and a later run is what ratchets against it.
func TestCheckIntoNoBaselineFileWritesOneAndPasses(t *testing.T) {
	casesDir, runDir := buildRun(t, nil)
	if err := checkInto(casesDir, runDir); err != nil {
		t.Fatalf("the first run must not fail for having no baseline yet: %v", err)
	}
	baselinePath := filepath.Join(filepath.Dir(runDir), "baseline.json")
	raw, err := os.ReadFile(baselinePath)
	if err != nil {
		t.Fatalf("checkInto did not write a baseline: %v", err)
	}
	var b struct {
		FailingCases []string `json:"failing_cases"`
	}
	if err := json.Unmarshal(raw, &b); err != nil {
		t.Fatal(err)
	}
	if len(b.FailingCases) != 1 || b.FailingCases[0] != "define-hmis-01" {
		t.Fatalf("baseline.json failing_cases = %v, want [define-hmis-01]", b.FailingCases)
	}
}

func TestCheckIntoFailureAbsentFromBaselineIsNew(t *testing.T) {
	casesDir, runDir := buildRun(t, []string{"some-other-case"})
	if err := checkInto(casesDir, runDir); err == nil {
		t.Fatal("expected an error: the failing case is not in the baseline")
	}
}

func TestCheckIntoFailureInBaselinePasses(t *testing.T) {
	casesDir, runDir := buildRun(t, []string{"define-hmis-01"})
	if err := checkInto(casesDir, runDir); err != nil {
		t.Fatalf("a baseline failure should not fail the command: %v", err)
	}
}

// TestRecordLatestAndResolveRun covers C1: a run must leave something check,
// judge, report and calibrate can find without being told -run by hand.
// Chdir'd into a scratch directory so this never touches the repository's
// own evals/askai/runs.
func TestRecordLatestAndResolveRun(t *testing.T) {
	root := t.TempDir()
	cwd := filepath.Join(root, "mcp")
	if err := os.MkdirAll(cwd, 0o755); err != nil {
		t.Fatal(err)
	}
	t.Chdir(cwd)
	runDir := "../evals/askai/runs/2026-09-03-v1"
	if err := os.MkdirAll(runDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := recordLatest(runDir); err != nil {
		t.Fatal(err)
	}
	got, err := resolveRun("")
	if err != nil {
		t.Fatalf("resolveRun after a recorded run: %v", err)
	}
	if want := filepath.Clean(runDir); got != want {
		t.Fatalf("resolveRun(\"\") = %q, want %q", got, want)
	}
}
