// Command contract checks every MCP tool promise against a built snapshot,
// through the protocol an agent's client speaks, with no model involved.
//
//	contract -db catalogue.db                  report, and fail on a failure the baseline does not record
//	contract -db catalogue.db -write-baseline  record the current failures as known
//
// The baseline holds failures already known, one "check: subject: detail"
// line each, so the gate fails only when something new breaks. Shrinking it
// is a deliberate act in a pull request, once a failure is actually fixed.
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"slices"

	"github.com/nha-in/docs/mcp/internal/index"
	"github.com/nha-in/docs/mcp/internal/server"
)

func main() {
	db := flag.String("db", "catalogue.db", "snapshot to check")
	baselinePath := flag.String("baseline", "eval/contract-baseline.json", "known failures")
	write := flag.Bool("write-baseline", false, "record the current failures as the baseline")
	flag.Parse()
	// Every tool call logs at info; thousands of them would bury the report.
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelWarn})))
	if err := run(*db, *baselinePath, *write); err != nil {
		fmt.Fprintln(os.Stderr, "contract:", err)
		os.Exit(1)
	}
}

func run(db, baselinePath string, write bool) error {
	r, err := index.Open(db)
	if err != nil {
		return err
	}
	defer r.Close()
	res, err := server.RunContract(context.Background(), r, nil)
	if err != nil {
		return err
	}

	fmt.Printf("tool contract, catalogue %s\n\n", res.CatalogueVersion)
	fmt.Println("| check | kept | promise |")
	fmt.Println("|---|---|---|")
	for _, c := range res.Checks {
		fmt.Printf("| %s | %d/%d | %s |\n", c.Name, c.Total-c.Failed, c.Total, c.Promise)
	}

	if write {
		b, _ := json.MarshalIndent(res.Failures, "", "  ")
		if err := os.WriteFile(baselinePath, append(b, '\n'), 0o644); err != nil {
			return err
		}
		fmt.Printf("\nwrote %d known failures to %s\n", len(res.Failures), baselinePath)
		return nil
	}

	var known []string
	if b, err := os.ReadFile(baselinePath); err == nil {
		if err := json.Unmarshal(b, &known); err != nil {
			return fmt.Errorf("%s: %w", baselinePath, err)
		}
	} else if !os.IsNotExist(err) {
		return err
	}
	var fresh, fixed []string
	for _, f := range res.Failures {
		if !slices.Contains(known, f) {
			fresh = append(fresh, f)
		}
	}
	for _, f := range known {
		if !slices.Contains(res.Failures, f) {
			fixed = append(fixed, f)
		}
	}
	fmt.Printf("\n%d failures, %d known, %d new, %d fixed since the baseline\n",
		len(res.Failures), len(res.Failures)-len(fresh), len(fresh), len(fixed))
	for _, f := range fixed {
		fmt.Println("  fixed:", f)
	}
	for _, f := range fresh {
		fmt.Println("  NEW:  ", f)
	}
	if len(fresh) > 0 {
		return fmt.Errorf("%d new failures; fix them, or record them with -write-baseline if they are accepted", len(fresh))
	}
	return nil
}
