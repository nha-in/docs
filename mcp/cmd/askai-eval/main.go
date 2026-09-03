// Command askai-eval is the instrument that scores the Ask AI assistant.
//
//	askai-eval run       -cases ../evals/askai/cases -out ../evals/askai/runs/<name> -db catalogue.db
//	askai-eval check     -cases ../evals/askai/cases -run ../evals/askai/runs/<name>
//	askai-eval judge     -cases ../evals/askai/cases -run ../evals/askai/runs/<name>
//	askai-eval report    -cases ../evals/askai/cases -run ../evals/askai/runs/<name>
//	askai-eval calibrate -run ../evals/askai/runs/<name>
//
// run needs Bedrock (CHAT_MODEL, AWS_REGION, EMBED_PROVIDER, all required
// with no default, as the server needs them); check, report and calibrate
// need nothing but the files; judge needs Bedrock too (EVAL_JUDGE_MODEL,
// AWS_REGION). Every command but run reads -run from evals/askai/runs/latest
// when -run is omitted, and run writes that file itself once it finishes.
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
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/eval"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
)

// runsLatestPath names the run every command but run defaults to when -run
// is not given. It is relative to the cmd/askai-eval working directory,
// matching every other relative path this command already uses.
const runsLatestPath = "../evals/askai/runs/latest"

func envOr(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: askai-eval run|check|judge|report|calibrate [flags]")
		os.Exit(2)
	}
	var err error
	switch os.Args[1] {
	case "run":
		err = runCmd(os.Args[2:])
	case "check":
		err = checkCmd(os.Args[2:])
	case "judge":
		err = judgeCmd(os.Args[2:])
	case "report":
		err = reportCmd(os.Args[2:])
	case "calibrate":
		err = calibrateCmd(os.Args[2:])
	default:
		err = fmt.Errorf("unknown command %q", os.Args[1])
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func runCmd(args []string) error {
	fs := flag.NewFlagSet("run", flag.ExitOnError)
	casesDir := fs.String("cases", "../evals/askai/cases", "cases directory")
	out := fs.String("out", "", "run directory to write (required)")
	db := fs.String("db", envOr("DB_PATH", "catalogue.db"), "catalogue.db")
	modelID := fs.String("model", envOr("CHAT_MODEL", ""), "Bedrock model id")
	region := fs.String("region", envOr("AWS_REGION", ""), "AWS region")
	provider := fs.String("embed-provider", envOr("EMBED_PROVIDER", "none"), "bedrock, ollama or none")
	temp := fs.Float64("temperature", 0.1, "sampling temperature")
	only := fs.String("only", "", "comma separated case ids to run, empty runs all")
	fs.Parse(args)
	if *out == "" || *modelID == "" {
		return fmt.Errorf("run: -out and -model (or CHAT_MODEL) are required")
	}
	cases, err := eval.LoadCases(*casesDir)
	if err != nil {
		return err
	}
	if *only != "" {
		keep := map[string]bool{}
		for _, id := range strings.Split(*only, ",") {
			keep[strings.TrimSpace(id)] = true
		}
		var sel []eval.Case
		for _, c := range cases {
			if keep[c.ID] {
				sel = append(sel, c)
			}
		}
		cases = sel
	}
	if len(cases) == 0 {
		return fmt.Errorf("run: no cases to run (check -only against %s)", *casesDir)
	}
	r, err := index.Open(*db)
	if err != nil {
		return err
	}
	defer r.Close()
	if cases[0].CatalogueVersion != r.CatalogueVersion() {
		return fmt.Errorf("run: cases are for catalogue %s, index is %s; rebuild the index or re-version the cases",
			cases[0].CatalogueVersion, r.CatalogueVersion())
	}
	emb, err := embed.New(context.Background(), embed.Config{Provider: *provider, Region: *region})
	if err != nil {
		return err
	}
	model, err := chat.NewBedrockModel(context.Background(), *region, *modelID, float32(*temp))
	if err != nil {
		return err
	}
	tools := server.ChatTools(server.NewTools(r, emb).Defs())
	n, runErr := eval.Run(context.Background(), eval.RunConfig{
		OutDir: filepath.Join(*out, "transcripts"), Model: model, ModelID: *modelID,
		Temperature: *temp, Tools: tools, MaxTokens: 1500,
		PromptVersion: chat.PromptVersion, CatalogueVersion: r.CatalogueVersion(),
	}, cases)
	fmt.Printf("answered %d of %d cases into %s\n", n, len(cases), *out)
	if runErr != nil {
		fmt.Fprintf(os.Stderr, "first error: %v\n", runErr)
	}
	// The run reached here, so check, judge, report and calibrate must be
	// able to find it without being told -run by hand. Recording it as
	// latest does not depend on every case having answered, or on the
	// deterministic gate below passing: an owner chasing a Bedrock throttle
	// still needs check and report to work on what did come back.
	if err := recordLatest(*out); err != nil {
		return err
	}
	fmt.Printf("wrote %s naming this run as the one check, judge, report and calibrate replay\n", runsLatestPath)
	// checkInto's error is the deterministic gate: genuine new failures
	// against the baseline. reportInto must still run so a scorecard always
	// comes out of a run, whether or not the gate passed.
	checkErr := checkInto(*casesDir, *out)
	if err := reportInto(*casesDir, *out); err != nil {
		return err
	}
	return checkErr
}

// recordLatest writes outDir's basename to runsLatestPath, creating the
// runs directory when this is the first run to finish. Split out from
// runCmd so the owner's path (a run always leaves something the other
// commands can find) is unit testable without Bedrock.
func recordLatest(outDir string) error {
	if err := os.MkdirAll(filepath.Dir(runsLatestPath), 0o755); err != nil {
		return err
	}
	return os.WriteFile(runsLatestPath, []byte(filepath.Base(outDir)), 0o644)
}

func checkCmd(args []string) error {
	fs := flag.NewFlagSet("check", flag.ExitOnError)
	casesDir := fs.String("cases", "../evals/askai/cases", "cases directory")
	run := fs.String("run", "", "run directory; empty reads ../evals/askai/runs/latest")
	fs.Parse(args)
	dir, err := resolveRun(*run)
	if err != nil {
		if *run == "" {
			if _, statErr := os.Stat(runsLatestPath); os.IsNotExist(statErr) {
				// run writes runsLatestPath itself once it finishes, so this
				// can only say true today: no run has ever completed.
				fmt.Println("askai-eval check: no run has been recorded yet (evals/askai/runs/latest is absent), so there is nothing to replay. This gate proves nothing until the first run lands.")
				return nil
			}
		}
		return fmt.Errorf("check: %w", err)
	}
	return checkInto(*casesDir, dir)
}

// resolveRun turns a -run flag (possibly empty) into a run directory. Empty
// reads runsLatestPath, which the run command writes once it finishes.
// Callers that should treat "no run yet" as a soft no-op (check)
// special-case the error themselves; judge and report let it fail, because
// grading or reporting on nothing is not a pass.
func resolveRun(run string) (string, error) {
	if run != "" {
		return run, nil
	}
	latest, err := os.ReadFile(runsLatestPath)
	if err != nil {
		return "", fmt.Errorf("no -run and no runs/latest: %w", err)
	}
	return filepath.Join(filepath.Dir(runsLatestPath), strings.TrimSpace(string(latest))), nil
}

func judgeCmd(args []string) error {
	fs := flag.NewFlagSet("judge", flag.ExitOnError)
	casesDir := fs.String("cases", "../evals/askai/cases", "cases directory")
	run := fs.String("run", "", "run directory; empty reads runs/latest")
	modelID := fs.String("model", envOr("EVAL_JUDGE_MODEL", ""), "Bedrock model id for the judge")
	region := fs.String("region", envOr("AWS_REGION", ""), "AWS region")
	fs.Parse(args)
	if *modelID == "" {
		return fmt.Errorf("judge: -model or EVAL_JUDGE_MODEL is required")
	}
	dir, err := resolveRun(*run)
	if err != nil {
		return fmt.Errorf("judge: %w", err)
	}
	cases, err := eval.LoadCases(*casesDir)
	if err != nil {
		return err
	}
	ts, err := eval.ReadTranscripts(filepath.Join(dir, "transcripts"))
	if err != nil {
		return err
	}
	model, err := chat.NewBedrockModel(context.Background(), *region, *modelID, 0)
	if err != nil {
		return err
	}
	grades, err := eval.GradeAll(context.Background(), eval.Judge{Model: model, Runs: 3}, cases, ts)
	if werr := writeJSON(filepath.Join(dir, "judge.json"), grades); werr != nil {
		return werr
	}
	if err != nil {
		return err
	}
	return reportInto(*casesDir, dir)
}

func reportCmd(args []string) error {
	fs := flag.NewFlagSet("report", flag.ExitOnError)
	casesDir := fs.String("cases", "../evals/askai/cases", "cases directory")
	run := fs.String("run", "", "run directory; empty reads runs/latest")
	before := fs.String("before", "", "a previous run directory to diff against")
	fs.Parse(args)
	dir, err := resolveRun(*run)
	if err != nil {
		return fmt.Errorf("report: %w", err)
	}
	if err := reportInto(*casesDir, dir); err != nil {
		return err
	}
	if *before != "" {
		var now, was eval.Scorecard
		if err := readJSON(filepath.Join(dir, "scorecard.json"), &now); err != nil {
			return err
		}
		if err := readJSON(filepath.Join(*before, "scorecard.json"), &was); err != nil {
			return err
		}
		fmt.Println(eval.Delta(now, was))
	}
	return nil
}

// calibrateCmd checks the judge's grades on a run against the owner's hand
// grades. It fails clearly rather than reporting a hollow pass when the
// owner has graded nothing yet, or when no run exists to read judge.json
// from.
func calibrateCmd(args []string) error {
	fs := flag.NewFlagSet("calibrate", flag.ExitOnError)
	run := fs.String("run", "", "run directory; empty reads runs/latest")
	grades := fs.String("owner", "../evals/askai/calibration/owner-grades.json", "the owner's grades")
	fs.Parse(args)
	dir, err := resolveRun(*run)
	if err != nil {
		return fmt.Errorf("calibrate: %w", err)
	}
	var owner []struct {
		ID    string `json:"id"`
		Grade string `json:"grade"`
	}
	if err := readJSON(*grades, &owner); err != nil {
		return err
	}
	var judge []eval.Grade
	if err := readJSON(filepath.Join(dir, "judge.json"), &judge); err != nil {
		return err
	}
	want := map[string]string{}
	for _, o := range owner {
		want[o.ID] = o.Grade
	}
	agree, total := eval.Agreement(want, judge)
	if total == 0 {
		return fmt.Errorf("calibrate: the owner has graded nothing yet")
	}
	pct := 100 * agree / total
	fmt.Printf("judge agrees with the owner on %d of %d (%d%%)\n", agree, total, pct)
	if pct < 85 {
		return fmt.Errorf("calibrate: below 85 percent; fix the rubric, not the owner")
	}
	return nil
}

func reportInto(casesDir, dir string) error {
	cases, err := eval.LoadCases(casesDir)
	if err != nil {
		return err
	}
	var checks []eval.CheckResult
	var retrieval []eval.RetrievalResult
	var grades []eval.Grade
	if err := readJSON(filepath.Join(dir, "checks.json"), &checks); err != nil {
		return err
	}
	if err := readJSON(filepath.Join(dir, "retrieval.json"), &retrieval); err != nil {
		return err
	}
	_ = readJSON(filepath.Join(dir, "judge.json"), &grades) // absent on a check-only run
	sc := eval.BuildScorecard(cases, checks, retrieval, grades)
	sc.Run = filepath.Base(dir)
	if len(cases) > 0 {
		sc.CatalogueVersion = cases[0].CatalogueVersion
	}
	if ts, err := eval.ReadTranscripts(filepath.Join(dir, "transcripts")); err == nil {
		for _, t := range ts {
			sc.ModelID, sc.PromptVersion, sc.Temperature = t.ModelID, t.PromptVersion, t.Temperature
			break
		}
	}
	if err := writeJSON(filepath.Join(dir, "scorecard.json"), sc); err != nil {
		return err
	}
	fmt.Println(eval.Table(sc))
	return nil
}

func readJSON(path string, v any) error {
	raw, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(raw, v)
}

// checkInto runs the deterministic checks and retrieval metrics for a run
// directory and writes checks.json and retrieval.json beside the transcripts.
// Exit status is failure when any case has a failure, which is what makes
// this a gate rather than a report.
func checkInto(casesDir, runDir string) error {
	cases, err := eval.LoadCases(casesDir)
	if err != nil {
		return err
	}
	ts, err := eval.ReadTranscripts(filepath.Join(runDir, "transcripts"))
	if err != nil {
		return err
	}
	results := eval.CheckAll(cases, ts)
	var retrieval []eval.RetrievalResult
	for _, c := range cases {
		retrieval = append(retrieval, eval.Retrieval(c, ts[c.ID]))
	}
	if err := writeJSON(filepath.Join(runDir, "checks.json"), results); err != nil {
		return err
	}
	if err := writeJSON(filepath.Join(runDir, "retrieval.json"), retrieval); err != nil {
		return err
	}
	baselinePath := filepath.Join(filepath.Dir(runDir), "baseline.json")
	_, baselineErr := os.Stat(baselinePath)
	hadBaseline := baselineErr == nil
	baseline := map[string]bool{}
	if hadBaseline {
		if raw, err := os.ReadFile(baselinePath); err == nil {
			var b struct {
				FailingCases []string `json:"failing_cases"`
			}
			if json.Unmarshal(raw, &b) == nil {
				for _, id := range b.FailingCases {
					baseline[id] = true
				}
			}
		}
	}
	failing := 0
	newFailures := 0
	var failingCases []string
	for _, r := range results {
		if len(r.Failures) == 0 {
			continue
		}
		failing++
		failingCases = append(failingCases, r.CaseID)
		tag := ""
		if baseline[r.CaseID] {
			tag = " (baseline)"
		} else {
			newFailures++
		}
		fmt.Printf("%s%s\n  %s\n", r.CaseID, tag, strings.Join(r.Failures, "\n  "))
	}
	fmt.Printf("checks: %d failing, %d new since baseline\n", failing, newFailures)
	// The very first run has nothing to ratchet against. Rather than failing
	// a command that just succeeded, this run's own failures become the
	// baseline, and a later run is what tightens the gate.
	if !hadBaseline {
		raw, err := json.MarshalIndent(struct {
			FailingCases []string `json:"failing_cases"`
		}{FailingCases: failingCases}, "", "  ")
		if err != nil {
			return err
		}
		if err := os.WriteFile(baselinePath, raw, 0o644); err != nil {
			return err
		}
		fmt.Printf("no baseline existed; wrote one from this run's %d failing cases to %s\n", failing, baselinePath)
		return nil
	}
	if newFailures > 0 {
		return fmt.Errorf("%d cases newly fail deterministic checks", newFailures)
	}
	return nil
}

func writeJSON(path string, v any) error {
	raw, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, raw, 0o644)
}
