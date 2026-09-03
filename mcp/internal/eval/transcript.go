package eval

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

type ToolTrace struct {
	Name   string          `json:"name"`
	Input  json.RawMessage `json:"input"`
	Output json.RawMessage `json:"output"`
}

type ModelCall struct {
	System      string         `json:"system"`
	Messages    []chat.Message `json:"messages"`
	Reply       chat.Reply     `json:"reply"`
	ToolResults []ToolTrace    `json:"tool_results"`
}

type Transcript struct {
	CaseID           string  `json:"case_id"`
	CatalogueVersion string  `json:"catalogue_version"`
	ModelID          string  `json:"model_id"`
	Temperature      float64 `json:"temperature"`
	PromptVersion    string  `json:"prompt_version"`
	// EmbedProvider and DBPath name the retrieval stack this case was
	// answered against: which embedder chose the tool results, and which
	// index snapshot they came from. Two runs on different retrieval stacks
	// otherwise compare as if they were the same instrument.
	EmbedProvider string        `json:"embed_provider"`
	DBPath        string        `json:"db_path"`
	Calls         []ModelCall   `json:"calls"`
	Answer        string        `json:"answer"`
	Sources       []chat.Source `json:"sources"`
	Corpus        string        `json:"corpus"`
	Blocked       bool          `json:"blocked"`
	// Flags is a run error today, not the classifier's flagged rules the
	// plan describes; see the Class field's comment.
	Flags []string `json:"flags"`
	// Class is never written or read yet. It is a placeholder for the
	// classifier chunk the plan describes, which will fill in the case's
	// class (define, how-do-i, diagnose, ...) as observed from the answer
	// rather than only as declared on the case. Neither field carries live
	// data until that chunk lands.
	Class      string `json:"class"`
	RecordedAt string `json:"recorded_at"`
}

// RecordingModel sits between the loop and the provider and keeps every
// call, so a run can be replayed and re-graded without answering again.
type RecordingModel struct {
	Inner chat.Model
	Calls []ModelCall
}

func (r *RecordingModel) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	reply, err := r.Inner.Stream(ctx, system, tools, msgs, maxTokens, onText)
	// Messages are copied: the loop appends to its own slice after this
	// returns, and a shared backing array would rewrite history.
	copied := make([]chat.Message, len(msgs))
	copy(copied, msgs)
	r.Calls = append(r.Calls, ModelCall{System: system, Messages: copied, Reply: reply})
	return reply, err
}

func WriteTranscript(dir string, t Transcript) error {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	raw, err := json.MarshalIndent(t, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dir, t.CaseID+".json"), raw, 0o644)
}

func ReadTranscripts(dir string) (map[string]Transcript, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("read transcripts: %w", err)
	}
	out := make(map[string]Transcript, len(entries))
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		raw, err := os.ReadFile(filepath.Join(dir, e.Name()))
		if err != nil {
			return nil, err
		}
		var t Transcript
		if err := json.Unmarshal(raw, &t); err != nil {
			return nil, fmt.Errorf("%s: %w", e.Name(), err)
		}
		out[t.CaseID] = t
	}
	return out, nil
}
