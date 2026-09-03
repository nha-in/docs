// Command askai-eval is the instrument that scores the Ask AI assistant.
//
//	askai-eval run   -cases ../evals/askai/cases -out ../evals/askai/runs/<name> -db catalogue.db
//	askai-eval check -cases ../evals/askai/cases -run ../evals/askai/runs/<name>
//
// run needs Bedrock (CHAT_MODEL, AWS_REGION, EMBED_PROVIDER as the server
// does); check needs nothing but the files.
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

func envOr(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: askai-eval run|check [flags]")
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
	return checkInto(*casesDir, *out)
}

func checkCmd(args []string) error {
	fs := flag.NewFlagSet("check", flag.ExitOnError)
	casesDir := fs.String("cases", "../evals/askai/cases", "cases directory")
	run := fs.String("run", "", "run directory; empty reads ../evals/askai/runs/latest")
	fs.Parse(args)
	dir, err := resolveRun(*run)
	if err != nil {
		if *run == "" {
			if _, statErr := os.Stat("../evals/askai/runs/latest"); os.IsNotExist(statErr) {
				fmt.Println("askai-eval check: no run has been recorded yet (evals/askai/runs/latest is absent), so there is nothing to replay. This gate proves nothing until the first run lands.")
				return nil
			}
		}
		return fmt.Errorf("check: %w", err)
	}
	return checkInto(*casesDir, dir)
}

// resolveRun turns a -run flag (possibly empty) into a run directory. Empty
// reads ../evals/askai/runs/latest. Callers that should treat "no run yet"
// as a soft no-op (check) special-case the error themselves; judge and
// report let it fail, because grading or reporting on nothing is not a pass.
func resolveRun(run string) (string, error) {
	if run != "" {
		return run, nil
	}
	latest, err := os.ReadFile("../evals/askai/runs/latest")
	if err != nil {
		return "", fmt.Errorf("no -run and no runs/latest: %w", err)
	}
	return filepath.Join("../evals/askai/runs", strings.TrimSpace(string(latest))), nil
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
	fmt.Println(eval.Delta(sc, eval.Scorecard{}))
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
	baseline := map[string]bool{}
	if raw, err := os.ReadFile(filepath.Join(filepath.Dir(runDir), "baseline.json")); err == nil {
		var b struct {
			FailingCases []string `json:"failing_cases"`
		}
		if json.Unmarshal(raw, &b) == nil {
			for _, id := range b.FailingCases {
				baseline[id] = true
			}
		}
	}
	failing := 0
	newFailures := 0
	for _, r := range results {
		if len(r.Failures) == 0 {
			continue
		}
		failing++
		tag := ""
		if baseline[r.CaseID] {
			tag = " (baseline)"
		} else {
			newFailures++
		}
		fmt.Printf("%s%s\n  %s\n", r.CaseID, tag, strings.Join(r.Failures, "\n  "))
	}
	fmt.Printf("checks: %d failing, %d new since baseline\n", failing, newFailures)
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
