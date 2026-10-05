package chat

import (
	"context"
	"errors"
)

// The reasons a turn can end without an answer. Each such turn logs one
// answer_missing line carrying one of these, and the SSE error event carries
// the same string, so the panel and the log name a failure the same way.
const (
	ReasonThrottle    = "throttle"     // the model provider throttled every attempt
	ReasonModelError  = "model_error"  // any other failure of the model call
	ReasonToolTimeout = "tool_timeout" // the deadline ran out after a tool call timed out
	ReasonRateLimit   = "rate_limit"   // this server's own per-IP limiter refused
	ReasonBlocked     = "blocked"      // the guard replaced the answer with BlockedNotice
	ReasonClientGone  = "client_gone"  // the reader disconnected before the answer
)

// errToolTimeout marks a turn that failed on its deadline after at least one
// tool call had timed out, so FailureReason can tell it from a slow model.
var errToolTimeout = errors.New("chat: a tool call timed out")

// FailureReason names why RespondCommand returned err. clientGone is the
// HTTP layer's knowledge that the reader's connection closed, which outranks
// everything else: whatever error the loop saw next was a consequence of it.
// A cancelled context is read the same way, because the only deadline on a
// turn reports DeadlineExceeded and never Canceled. Anything not recognised
// is a model error, since the model call is the only other thing in a turn
// that can fail it.
func FailureReason(err error, clientGone bool) string {
	switch {
	case clientGone, errors.Is(err, context.Canceled):
		return ReasonClientGone
	case errors.Is(err, errToolTimeout):
		return ReasonToolTimeout
	case classifyBedrockError(err) == bedrockThrottle:
		return ReasonThrottle
	}
	return ReasonModelError
}
