package chat

// A shape block is the part of the prompt that changes per question. It
// travels in the user turn so the system prompt stays byte-identical and
// cached. Each block: the skeleton, the budget, one exemplar. A cheap
// model told the shape and shown one example of it stops varying.
var shapeBudget = map[string]int{
	"define": 120, "how-do-i": 200, "diagnose": 200, "compare": 200, "meta": 100, "decline": 60,
}

var shapeBlocks = map[string]string{
	"define": `<answer_shape name="define" budget="120 words">
Say what it is in one sentence, then who it matters to and the one thing people get wrong about it. No list, no headings, at most four sentences.
Example:
An ABHA address is the readable handle, such as name@abdm on production or name@sbx on sandbox, that records are linked against and that a person shares at a facility. It is not the ABHA number: a person has one number and can hold several addresses. NHA also calls it the PHR address.
</answer_shape>`,

	"how-do-i": `<answer_shape name="how-do-i" budget="200 words">
First sentence: the direct answer. Then every route that exists, one line each, naming what each produces. Expand only the route asked about, as a short numbered list of calls. End with the next step.
Example:
Yes, and there are three creation routes: Aadhaar OTP, which is mandatory; Aadhaar face authentication, for someone who cannot receive the OTP; and an identity document, which produces an account restricted until Aadhaar KYC. For Aadhaar OTP:
1. Request an OTP against the encrypted Aadhaar number.
2. Verify it with the enrolment call, which issues the ABHA number.
3. Get address suggestions and claim one.
Confirm by reading the profile back and checking the chosen address is marked preferred.
</answer_shape>`,

	"diagnose": `<answer_shape name="diagnose" budget="200 words">
First line: what the code or symptom means. Then the cause, the fix, and how the reader knows it worked, as three short lines. Name the header or field, never rewrite their code.
Example:
ABDM-1016 is NHA's code for an invalid TIMESTAMP header, though the sandbox wraps it in a misleading HTTP 404. Cause: the value carried an offset like +05:30, or no milliseconds. Fix: format TIMESTAMP as ISO 8601 UTC with milliseconds and a Z suffix, for example 2026-08-25T15:51:15.339Z. You will know it worked when the same request, resent with that timestamp, returns its normal response instead of this code.
</answer_shape>`,

	"compare": `<answer_shape name="compare" budget="200 words">
One sentence naming both things and the one distinction that matters. Then two short lines, one per thing. Say which the reader probably needs.
Example:
A HIP publishes records it created and a HIU requests records held elsewhere; the role is per interaction, and one system can be both. HIP: your facility attaching its own visits to an ABHA address. HIU: your system fetching a patient's records from other facilities, with consent. A hospital sharing its own records is a HIP first.
</answer_shape>`,

	"meta": `<answer_shape name="meta" budget="100 words">
Answer the question about this documentation itself in one or two sentences, from catalogue_info. Give the version and the build date if asked.
Example:
This documentation is catalogue version 2026.08.24, built 2026-09-07. Every answer here comes from it and names its sources.
</answer_shape>`,

	"decline": `<answer_shape name="decline" budget="60 words">
Say in one sentence that this is not covered here, then name the closest page or the support route. Never guess a value, a host or a path.
Example:
NHCX claim endpoints are not documented on this portal. The NHCX section at /docs/nhcx/v1 says what it is and where NHA documents it, and /docs/support lists the channels.
</answer_shape>`,
}

// ShapeBlock returns the user-turn text for the given answer shape. An
// unknown shape falls back to how-do-i, the shape a question defaults to
// when route.Route cannot tell what else it is.
func ShapeBlock(shape string) string {
	if b, ok := shapeBlocks[shape]; ok {
		return b
	}
	return shapeBlocks["how-do-i"]
}
