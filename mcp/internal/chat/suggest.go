package chat

import (
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"log/slog"
	"regexp"
	"strings"
	"time"

	"github.com/nha-in/docs/mcp/internal/guard"
)

// Candidate is something the catalogue can answer that a suggestion may
// point at: the next call in the answer's journey, or an atom the answer's
// sources link to. Code chooses the candidates; the suggestion model only
// picks among them and words the question.
type Candidate struct {
	ID      string `json:"id"`
	Kind    string `json:"kind"` // "step" or "related"
	Title   string `json:"title"`
	Summary string `json:"summary"`
}

const maxCandidates = 8

// candidatesFromPack reads the pack's next step and the related atoms that
// carry a summary, in the answer's gateway or shared, as suggestionsFromPack
// does for the rule-made list.
func candidatesFromPack(pack []byte, scope string) []Candidate {
	var pp struct {
		Passages []struct {
			ID string `json:"id"`
		} `json:"passages"`
		Step *Candidate  `json:"step"`
		Next []Candidate `json:"next"`
	}
	if json.Unmarshal(pack, &pp) != nil {
		return nil
	}
	gateway := scope
	if gateway == "" && len(pp.Passages) > 0 {
		gateway = atomGateway(pp.Passages[0].ID)
	}
	if gateway == "" || gateway == "shared" {
		gateway = "hiecm"
	}
	var out []Candidate
	if pp.Step != nil && pp.Step.ID != "" {
		pp.Step.Kind = "step"
		out = append(out, *pp.Step)
	}
	for _, c := range pp.Next {
		if len(out) == maxCandidates {
			break
		}
		if c.ID == "" || c.Summary == "" {
			continue
		}
		if g := atomGateway(c.ID); g != gateway && g != "shared" {
			continue
		}
		c.Kind = "related"
		out = append(out, c)
	}
	return out
}

//go:embed prompt/suggest-v1.md
var suggestPrompt string

// suggestTimeout bounds the suggestion call. The answer has already
// streamed; this is how long its end may wait for what to ask next.
const suggestTimeout = 8 * time.Second

// pathLikeRe finds an API path or a code span in a suggestion's text.
var pathLikeRe = regexp.MustCompile("`|/[A-Za-z0-9_.-]+/[A-Za-z0-9_./{}-]+")

// nextFor is what the composer offers after an answer. An answer that
// declined or had nothing gets nothing. With a suggestion model it is the
// model's pick among the candidates, checked; without one, or when the call
// fails, it is the rule-made list.
func (s *Service) nextFor(ctx context.Context, turns []Turn, answer string, cands []Candidate, fallback []Suggestion) []Suggestion {
	fallback = nextAfter(answer, fallback)
	if saysItHasNothing(answer) || declinedRe.MatchString(answer) {
		return nil
	}
	if s.SuggestModel == nil || len(cands) == 0 {
		return fallback
	}
	got, err := s.modelSuggestions(ctx, turns, answer, cands)
	if err != nil {
		slog.Warn("suggestions: model call failed, using the rule-made list", "error", err)
		return fallback
	}
	return got
}

func (s *Service) modelSuggestions(ctx context.Context, turns []Turn, answer string, cands []Candidate) ([]Suggestion, error) {
	question, _ := guard.MaskPII(lastUserText(turns))
	earlier, _ := guard.MaskPII(previousUserText(turns))
	if len(answer) > 2000 {
		answer = answer[:2000]
	}
	payload, err := json.Marshal(map[string]any{
		"question": question, "earlier_question": earlier, "answer": answer, "candidates": cands,
	})
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(ctx, suggestTimeout)
	defer cancel()
	reply, err := s.SuggestModel.Stream(ctx, suggestPrompt, nil,
		[]Message{{Role: "user", Text: string(payload)}}, 400, func(string) {})
	if err != nil {
		return nil, err
	}
	start, end := strings.Index(reply.Text, "{"), strings.LastIndex(reply.Text, "}")
	if start < 0 || end <= start {
		return nil, errors.New("no JSON object in the reply")
	}
	type pick struct {
		ID   string `json:"id"`
		Text string `json:"text"`
	}
	var out struct {
		OpenEnded bool   `json:"open_ended"`
		NextStep  *pick  `json:"next_step"`
		AlsoAsk   []pick `json:"also_ask"`
	}
	if err := json.Unmarshal([]byte(reply.Text[start:end+1]), &out); err != nil {
		return nil, err
	}
	byID := map[string]Candidate{}
	for _, c := range cands {
		byID[c.ID] = c
	}
	offered, used := 0, map[string]bool{}
	// keep applies both safeguards: the pick names a candidate of the right
	// kind and says nothing the candidate does not, and the portal's own
	// search finds that candidate for the question as worded.
	keep := func(p pick, kind string) (Suggestion, bool) {
		offered++
		c, ok := byID[p.ID]
		text := strings.TrimSpace(p.Text)
		if !ok || c.Kind != kind || used[p.ID] || len(text) < 8 || len(text) > 160 || strings.ContainsAny(text, "\n\r") {
			return Suggestion{}, false
		}
		for _, lit := range pathLikeRe.FindAllString(text, -1) {
			if lit == "`" || !strings.Contains(c.Title+" "+c.Summary, lit) {
				return Suggestion{}, false
			}
		}
		if s.Finds != nil && !s.Finds(ctx, text, c.ID) {
			return Suggestion{}, false
		}
		used[p.ID] = true
		sg := Suggestion{ID: c.ID, Title: c.Title, Prompt: text}
		if kind == "step" {
			sg.Kind = "step"
		}
		return sg, true
	}
	var kept []Suggestion
	if out.NextStep != nil {
		if sg, ok := keep(*out.NextStep, "step"); ok {
			kept = append(kept, sg)
		}
	}
	if out.OpenEnded {
		related := 0
		for _, p := range out.AlsoAsk {
			if related == maxSuggestions {
				break
			}
			if sg, ok := keep(p, "related"); ok {
				kept = append(kept, sg)
				related++
			}
		}
	}
	slog.Info("suggestions", "candidates", len(cands), "offered", offered, "kept", len(kept), "open_ended", out.OpenEnded)
	return kept, nil
}
