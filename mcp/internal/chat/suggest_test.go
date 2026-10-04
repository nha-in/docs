package chat

import (
	"context"
	"errors"
	"strings"
	"testing"
)

type failingModel struct{}

func (failingModel) Stream(context.Context, string, []ToolDef, []Message, int, func(string)) (Reply, error) {
	return Reply{}, errors.New("throttled")
}

var suggestCands = []Candidate{
	{ID: "m2_post_link_carecontext", Kind: "step", Title: "HIP initiated linking", Summary: "The call after this one in HIP initiated linking: POST /api/hiecm/hip/v3/link/carecontext"},
	{ID: "hiecm.concept.consent", Kind: "related", Title: "Consent, what it authorises and how it ends", Summary: "What a consent lets a facility read, for how long, and how a patient ends it."},
	{ID: "hiecm.glossary.hip", Kind: "related", Title: "HIP, health information provider", Summary: "A facility that holds a patient's records."},
}

func suggestWith(reply string, finds func(context.Context, string, string) bool) []Suggestion {
	s := &Service{SuggestModel: &fakeModel{replies: []Reply{{Text: reply}}}, Finds: finds}
	turns := []Turn{{Role: "user", Text: "how do I generate the link token as a hospital?"}}
	return s.nextFor(context.Background(), turns, "Call the link token API.", suggestCands,
		[]Suggestion{{ID: "rule", Prompt: "rule-made"}})
}

// The model's picks are kept when they name a candidate of the right kind,
// and each carries the model's wording.
func TestModelSuggestionsKeepGroundedPicks(t *testing.T) {
	got := suggestWith("```json\n"+`{"open_ended": true,
	  "next_step": {"id": "m2_post_link_carecontext", "text": "What do I call after I have the link token?"},
	  "also_ask": [{"id": "hiecm.concept.consent", "text": "How long can my hospital read a patient's records?"}]}`+"\n```", nil)
	if len(got) != 2 || got[0].Kind != "step" || got[0].Prompt != "What do I call after I have the link token?" ||
		got[1].Kind != "" || got[1].ID != "hiecm.concept.consent" {
		t.Errorf("kept: %+v", got)
	}
}

// Safeguard one: an id that is not a candidate, a candidate of the wrong
// kind, and a path the candidate does not carry are all dropped.
func TestModelSuggestionsDropWhatIsNotGrounded(t *testing.T) {
	got := suggestWith(`{"open_ended": true,
	  "next_step": {"id": "hiecm.glossary.hip", "text": "What is a HIP in simple words?"},
	  "also_ask": [
	    {"id": "hiecm.flow.invented", "text": "How long does approval take?"},
	    {"id": "hiecm.concept.consent", "text": "How do I call /api/hiecm/consent/v3/request/init?"},
	    {"id": "hiecm.glossary.hip", "text": "What does my hospital become when it holds records?"}]}`, nil)
	if len(got) != 1 || got[0].ID != "hiecm.glossary.hip" || got[0].Kind != "" {
		t.Errorf("kept: %+v", got)
	}
}

// Safeguard two: a suggestion the portal's own search does not find its
// candidate for is dropped.
func TestModelSuggestionsDropWhatSearchDoesNotFind(t *testing.T) {
	finds := func(_ context.Context, q, id string) bool {
		return strings.Contains(q, "records") && id == "hiecm.concept.consent"
	}
	got := suggestWith(`{"open_ended": true, "next_step": null, "also_ask": [
	    {"id": "hiecm.concept.consent", "text": "How long can my hospital read a patient's records?"},
	    {"id": "hiecm.glossary.hip", "text": "What is my hospital called on ABDM?"}]}`, finds)
	if len(got) != 1 || got[0].ID != "hiecm.concept.consent" {
		t.Errorf("kept: %+v", got)
	}
}

// A closed answer keeps its next step and offers nothing beside it.
func TestModelSuggestionsClosedAnswerOffersNoRelated(t *testing.T) {
	got := suggestWith(`{"open_ended": false,
	  "next_step": {"id": "m2_post_link_carecontext", "text": "What do I call after the link token?"},
	  "also_ask": [{"id": "hiecm.concept.consent", "text": "How long can my hospital read records?"}]}`, nil)
	if len(got) != 1 || got[0].Kind != "step" {
		t.Errorf("kept: %+v", got)
	}
}

// Without a model, with a failed call or an unreadable reply, the rule-made
// list stands; a declined answer gets nothing either way.
func TestNextForFallsBackAndStaysQuietOnADecline(t *testing.T) {
	fallback := []Suggestion{{ID: "rule", Prompt: "rule-made"}}
	turns := []Turn{{Role: "user", Text: "how do I link records?"}}
	for name, s := range map[string]*Service{
		"no model":    {},
		"failed call": {SuggestModel: failingModel{}},
		"not JSON":    {SuggestModel: &fakeModel{replies: []Reply{{Text: "Sure, here are some ideas."}}}},
	} {
		if got := s.nextFor(context.Background(), turns, "An answer.", suggestCands, fallback); len(got) != 1 || got[0].ID != "rule" {
			t.Errorf("%s: %+v", name, got)
		}
	}
	s := &Service{SuggestModel: &fakeModel{replies: []Reply{{Text: `{"open_ended": true}`}}}}
	if got := s.nextFor(context.Background(), turns, "I don't have that in the ABDM documentation.", suggestCands, fallback); got != nil {
		t.Errorf("a decline offers nothing, got %+v", got)
	}
}

func TestCandidatesFromPackKeepsTheStepAndSummarisedAtomsInScope(t *testing.T) {
	pack := []byte(`{"passages":[{"id":"hiecm.endpoint.a"}],
	  "step":{"id":"op_next","title":"HIP initiated linking","summary":"The call after this one"},
	  "next":[{"id":"hiecm.flow.x","title":"X","summary":"Does x."},
	          {"id":"hiecm.flow.y","title":"Y"},
	          {"id":"nhcx.flow.z","title":"Z","summary":"Does z."},
	          {"id":"shared.glossary.abha","title":"ABHA","summary":"A health account."}]}`)
	got := candidatesFromPack(pack, "")
	var ids []string
	for _, c := range got {
		ids = append(ids, c.Kind+":"+c.ID)
	}
	if strings.Join(ids, " ") != "step:op_next related:hiecm.flow.x related:shared.glossary.abha" {
		t.Errorf("candidates: %v", ids)
	}
}
