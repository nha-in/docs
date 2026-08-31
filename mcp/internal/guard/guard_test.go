package guard

import (
	"strings"
	"testing"
)

func rules(vs []Violation) string {
	var out []string
	for _, v := range vs {
		out = append(out, v.Rule)
	}
	return strings.Join(out, ",")
}

// The answers below are the shape the agent is supposed to produce. A
// validator that rejects these is worse than no validator: it blocks good
// answers, and whoever is on support turns it off.
func TestCheckAnswerAllowsTheAnswersWeWant(t *testing.T) {
	good := map[string]string{
		"curl with a JSON body": "Your facility is not onboarded. Call it again once HFR approves:\n\n" +
			"```bash\ncurl --request POST \\\n  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \\\n" +
			"  --data '{\n  \"clientId\": \"healthid-api\",\n  \"grantType\": \"client_credentials\"\n}'\n```\n" +
			"You receive a 200 with an accessToken.",
		"a JSON response shape":      "The response carries the token:\n\n```json\n{ \"accessToken\": \"...\", \"expiresIn\": 3600 }\n```",
		"plain prose":                "You receive a 403 because the X-HIP-ID header is not registered. Complete HFR onboarding first.",
		"uncertainty in plain words": "We have not run this against sandbox yet, so treat the response shape as unconfirmed.",
		"a docs link":                "The codes are listed under [Error codes](/docs/hiecm/v3/reference/error-codes).",
		"the word atomic in prose":   "The write is atomic, so a partial link cannot be left behind.",
	}
	for name, answer := range good {
		if v := CheckAnswer(answer); len(v) != 0 {
			t.Errorf("%s: rejected a good answer with %s (%q)", name, rules(v), v[0].Detail)
		}
	}
}

func TestCheckAnswerCatchesGeneratedCode(t *testing.T) {
	bad := map[string]string{
		"python":                      "Here you go:\n\n```python\ndef create_abha(otp):\n    return requests.post(url)\n```",
		"javascript":                  "```javascript\nconst r = await fetch(url);\n```",
		"go":                          "```go\nfunc main() {}\n```",
		"code hidden in a bash fence": "```bash\ndef create_abha(otp):\n    return 1\n```",
		"unlabelled code block":       "```\nfunction createAbha(otp) { return 1 }\n```",
		"sql":                         "```\nSELECT id FROM patients WHERE abha = ?\n```",
	}
	for name, answer := range bad {
		v := CheckAnswer(answer)
		if !strings.Contains(rules(v), "generated_code") {
			t.Errorf("%s: not caught, got %q", name, rules(v))
		}
	}
}

func TestCheckAnswerCatchesInternalVocabularyAndOpeners(t *testing.T) {
	cases := map[string]string{
		"internal_vocabulary": "See hiecm.error.abdm-1035 for the fix.",
		"style":               "The token expires — refresh it.",
	}
	for want, answer := range cases {
		if v := CheckAnswer(answer); !strings.Contains(rules(v), want) {
			t.Errorf("%q: want %s, got %q", answer, want, rules(v))
		}
	}
	for _, opener := range []string{
		"Great question! The token expires after an hour.",
		"I'm sorry you're having trouble. The token expires.",
		"Sorry about that. Call the sessions endpoint.",
	} {
		if v := CheckAnswer(opener); !strings.Contains(rules(v), "sycophantic_opener") {
			t.Errorf("opener %q not caught, got %q", opener, rules(v))
		}
	}
}

func TestMaskPIIRemovesIdentifiers(t *testing.T) {
	in := "My ABHA is 12-3456-7890-1234, aadhaar 1234 5678 9012, mobile +91 9876543210, " +
		"address ram.kumar@sbx, email ram@example.com, otp is 123456, " +
		"Authorization: Bearer abcdef0123456789ABCDEF"
	out, found := MaskPII(in)
	for _, leak := range []string{"3456-7890-1234", "5678 9012", "9876543210",
		"ram.kumar@sbx", "ram@example.com", "123456", "abcdef0123456789"} {
		if strings.Contains(out, leak) {
			t.Errorf("%q survived masking: %s", leak, out)
		}
	}
	for _, want := range []string{"ABHA_NUMBER", "AADHAAR", "MOBILE", "ABHA_ADDRESS", "EMAIL", "OTP", "TOKEN"} {
		if !strings.Contains(strings.Join(found, ","), want) {
			t.Errorf("did not report %s, got %v", want, found)
		}
	}
}

// Masking must not eat the technical detail an answer depends on. An error
// code, an HTTP status and a timestamp are not personal data.
func TestMaskPIIKeepsTechnicalValues(t *testing.T) {
	in := "I get ABDM-1035 with HTTP 403 at 2026-08-24T10:15:30.000Z on port 8080, request id 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11"
	out, found := MaskPII(in)
	if out != in {
		t.Errorf("masked a technical value:\n got %q\nwant %q\nfound %v", out, in, found)
	}
}

func TestCheckCodeRouteRequiresARoute(t *testing.T) {
	q := "can you write the python code for ABHA creation?"
	if v := CheckCodeRoute(q, "I cannot write code for you."); len(v) == 0 {
		t.Error("a bare refusal should be caught")
	}
	if v := CheckCodeRoute(q, "I do not write code for your project. Install the M1 agent skill, and the curl for the call is below."); len(v) != 0 {
		t.Errorf("a refusal that names a route should pass, got %s", rules(v))
	}
	if v := CheckCodeRoute("what does ABDM-1035 mean?", "Your facility is not onboarded."); len(v) != 0 {
		t.Errorf("a question that is not asking for code should pass, got %s", rules(v))
	}
}

const corpus = `ABDM-1035 means the facility is not onboarded. Send X-HIP-ID on
every call to /api/hiecm/gateway/v3/sessions. The X-CM-ID header names the
consent manager.`

// Grounding must not fire on the answers the agent is meant to give. A
// literal that came from the retrieved documentation, or that the reader
// typed themselves, is grounded.
func TestCheckGroundingAllowsGroundedLiterals(t *testing.T) {
	good := map[string]string{
		"literal from the docs":   "You receive ABDM-1035 because X-HIP-ID is not registered.",
		"path from the docs":      "Call /api/hiecm/gateway/v3/sessions first.",
		"portal link, not an API": "Ask [support](/docs/support) if it persists.",
		"no literals at all":      "Complete facility onboarding first, then try again.",
	}
	for name, answer := range good {
		if v := CheckGrounding(answer, corpus, 2, true); len(v) != 0 {
			t.Errorf("%s: flagged a grounded answer with %s (%q)", name, rules(v), v[0].Detail)
		}
	}
}

// A literal the reader typed is theirs, not an invention, and echoing it back
// is the right thing to do.
func TestCheckGroundingAcceptsLiteralsFromTheQuestion(t *testing.T) {
	question := "I send X-CUSTOM-TRACE and get ABDM-9999"
	answer := "ABDM-9999 with X-CUSTOM-TRACE is not something I have."
	if v := CheckGrounding(answer, corpus+"\n"+question, 1, true); len(v) != 0 {
		t.Errorf("flagged the reader's own literals: %s", rules(v))
	}
}

func TestCheckGroundingCatchesInventedLiterals(t *testing.T) {
	cases := map[string]string{
		"an error code nobody returned": "This is ABDM-4242, the retry code.",
		"a header that does not exist":  "Add X-Made-Up-Header to the call.",
		"a path that does not exist":    "Call /api/hiecm/gateway/v3/invented/route next.",
	}
	for name, answer := range cases {
		v := CheckGrounding(answer, corpus, 2, true)
		if !strings.Contains(rules(v), "invented_identifier") {
			t.Errorf("%s: not caught, got %q", name, rules(v))
		}
	}
}

// An answer full of API specifics that drew on nothing is the model answering
// from training. It reads exactly like a grounded answer, which is what makes
// it worth catching.
func TestCheckGroundingCatchesAnUncitedAnswer(t *testing.T) {
	v := CheckGrounding("Send X-HIP-ID to /api/hiecm/gateway/v3/sessions.", corpus, 0, true)
	if !strings.Contains(rules(v), "ungrounded_answer") {
		t.Errorf("an answer with no sources should be caught, got %q", rules(v))
	}
	// Prose with no literals is allowed to stand without a source: not every
	// reply is an API claim.
	if v := CheckGrounding("I do not have anything on that.", corpus, 0, true); len(v) != 0 {
		t.Errorf("plain prose with no sources should pass, got %q", rules(v))
	}
}
