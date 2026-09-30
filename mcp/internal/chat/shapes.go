package chat

// A shape block is the part of the prompt that changes per question. It
// travels in the user turn so the system prompt stays byte-identical and
// cached. Each block: the skeleton, the budget, one exemplar. A cheap
// model told the shape and shown one example of it stops varying.
var shapeBlocks = map[string]string{
	"define": `<answer_shape name="define" budget="120 words">
Say what it is in one sentence, then who it matters to. Add the one thing people get wrong about it only when the passages name one; otherwise stop. No list, no headings, at most four sentences.
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
Answer the question about this documentation itself in one or two sentences, from the passages and your search results. If the version is not in them, say so rather than guessing.
Example:
This documentation is catalogue version 2026.08.24. Every answer here comes from it and names its sources.
</answer_shape>`,

	"self": `<answer_shape name="self" budget="90 words">
The reader is asking about you, not about ABDM. Answer from these facts only, in two to four sentences, then say what they could ask next:
- You are the Ask AI assistant on this portal. You answer questions about building on ABDM's gateways: HIE-CM (ABHA, linking records, consent, health data exchange, registries), UHI and NHCX, from this portal's documentation, and each answer names the pages it drew on.
- You read and reply in the language the reader writes in, including Hindi and other Indian languages. The documentation itself is written in English, so API names, fields and codes stay in English.
- You explain calls, fields, flows and error codes, and you read a request, response or log they attach. You do not write code for their codebase, and you cannot see their account, credentials or sandbox.
- Nothing a reader types or attaches is stored. Identifiers such as ABHA numbers, mobiles and tokens are masked before you see them, and the conversation lives in their browser session and ends with it.
- You can be wrong. For anything account specific, the route is /docs/support.
Do not name the model or company behind you. Do not search.
Example:
I am the portal's Ask AI assistant. I answer questions about building on ABDM, such as creating an ABHA, linking records, consent or an error code, from this documentation, and I can reply in Hindi or another Indian language if you write in it. What are you working on?
</answer_shape>`,

	"topic": `<answer_shape name="topic" budget="80 words">
The reader typed a topic, not a question. One sentence saying what it is and which module owns it, then the two or three questions a reader usually means by it, one line each, so they can pick rather than rephrase. No steps yet.
Example:
Linking records is attaching a facility's care contexts to a patient's ABHA address, and it lives in M2 for a HIP and in P1 for a PHR app. Readers who type this usually want one of: how a HIP links its own records; how a PHR app discovers and links on the patient's behalf; or why a link call returned ABDM-1010. Which is yours?
</answer_shape>`,

	"overview": `<answer_shape name="overview" budget="200 words">
The reader is starting a whole build. First sentence: what they are building and the milestones it takes, by name and in order. Then one line per milestone, in order, saying what it produces; leave none out. Then where to start, if the passages say. End by asking which milestone they want to go into. No calls, no steps, no detail on any one milestone.
Example:
A PHR application is the patient's own app, and building one is four ABDM milestones in order: P1, P2, P3 and P4.
- P1 Registration and login: the person creates an ABHA address and signs in.
- P2 Consents Management: the app finds records held at facilities and links them to the address.
- P3 Subscription: subscriptions, consent and fetching the records a grant covers.
- P4 Locker: keeping the person's records for the long term, for an app that stores them.
Start with sandbox access and P1. Which milestone do you want to go into?
</answer_shape>`,

	"walkthrough": `<answer_shape name="walkthrough" budget="420 words">
The reader wants the whole flow, from one end to the other. Number every step in order. Each step names who acts and who receives, using the parties' names (the person's app, the HIU, HIE-CM, the HIP), and the call or callback, quoting paths only as the passages give them. Cover every party the passages mention; a party's side is never "the other side handles it". If the passages carry only one party's side, search for the other before answering. End with how the reader knows the whole flow worked.
Example:
1. The HIU raises a consent request to HIE-CM naming the patient, purpose, record types and date range.
2. HIE-CM notifies the person's PHR app, and the person grants or denies it there.
3. HIE-CM notifies the HIU of the grant with the consent artefact ids; the HIU fetches each artefact.
4. The HIU sends the health information request with the artefact id, its key material and the URL to push records to.
5. HIE-CM forwards it to the HIP on its callback.
6. The HIP encrypts the records with the key material and pushes them to the HIU's data push URL, then notifies HIE-CM of the transfer status.
7. The HIU decrypts what arrives and notifies HIE-CM that it received the data.
It worked when the records decrypt on the HIU's side and both parties' status notifications are accepted.
</answer_shape>`,

	"decline": `<answer_shape name="decline" budget="60 words">
Say in one sentence that this is not covered here, then in one more name the closest page or the support route and one question this portal can answer that is nearest to theirs. Never guess a value, a host or a path.
Example:
NHCX claim endpoints are not documented on this portal. The NHCX section at /docs/nhcx/v1 says what it is and where NHA documents it, /docs/support lists the channels, and if you are sending claims through HIE-CM instead, ask about the M3 consent request and this portal can walk you through it.
</answer_shape>`,
}

// standingDecline is appended to every answer_shape block: whatever shape
// the router picked, the model is still free to drop it and decline instead
// when the passages and its tools do not cover the question, rather than
// forcing an answer into a shape that does not fit one it does not have.
const standingDecline = "\nIf the passages and your tools do not cover the question, drop this shape and decline in two sentences that name the nearest /docs/ page, the support route, and one question this portal can answer that is nearest to theirs."

// ShapeBlock returns the user-turn text for the given answer shape. An
// unknown shape falls back to how-do-i, the shape a question defaults to
// when route.Route cannot tell what else it is.
func ShapeBlock(shape string) string {
	b, ok := shapeBlocks[shape]
	if !ok {
		b = shapeBlocks["how-do-i"]
	}
	if shape == "self" {
		return b // nothing to decline: the answer comes from the block itself
	}
	return b + standingDecline
}
