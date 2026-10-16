package chat

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/types"
)

// codedErr and statusErr stand in for the SDK's exception and HTTP response
// error types, which classifyBedrockError reads only through these methods.
type codedErr string

func (e codedErr) Error() string     { return string(e) }
func (e codedErr) ErrorCode() string { return string(e) }

type statusErr int

func (e statusErr) Error() string       { return fmt.Sprintf("http %d", int(e)) }
func (e statusErr) HTTPStatusCode() int { return int(e) }

func TestClassifyBedrockError(t *testing.T) {
	cases := []struct {
		name string
		err  error
		want string
	}{
		{"nil", nil, ""},
		{"plain error", errors.New("boom"), ""},
		{"sdk throttling exception, wrapped", fmt.Errorf("bedrock model: stream: %w", &types.ThrottlingException{}), bedrockThrottle},
		{"too many requests code", codedErr("TooManyRequestsException"), bedrockThrottle},
		{"http 429", statusErr(429), bedrockThrottle},
		{"sdk internal server exception", &types.InternalServerException{}, bedrockTransient},
		{"sdk service unavailable", &types.ServiceUnavailableException{}, bedrockTransient},
		{"sdk model stream error", &types.ModelStreamErrorException{}, bedrockTransient},
		{"sdk model timeout", &types.ModelTimeoutException{}, bedrockTransient},
		{"model not ready code", codedErr("ModelNotReadyException"), bedrockTransient},
		{"http 503, wrapped", fmt.Errorf("converse: %w", statusErr(503)), bedrockTransient},
		{"sdk validation exception", &types.ValidationException{}, ""},
		{"sdk access denied", &types.AccessDeniedException{}, ""},
		{"http 400", statusErr(400), ""},
		{"cancelled context", context.Canceled, ""},
	}
	for _, c := range cases {
		if got := classifyBedrockError(c.err); got != c.want {
			t.Errorf("%s: classifyBedrockError = %q, want %q", c.name, got, c.want)
		}
	}
}

// recordedWait is the injected backoff: it records each wait and returns at
// once, so no test here sleeps.
type recordedWait struct{ waits []time.Duration }

func (r *recordedWait) record(ctx context.Context, d time.Duration) error {
	r.waits = append(r.waits, d)
	return nil
}

func TestStreamRetriesAThrottleWithBackoff(t *testing.T) {
	var w recordedWait
	var got strings.Builder
	calls := 0
	reply, err := streamWithRetry(context.Background(), w.record, func(s string) { got.WriteString(s) },
		func(onText func(string)) (Reply, error) {
			calls++
			if calls < 3 {
				return Reply{}, &types.ThrottlingException{}
			}
			onText("ok")
			return Reply{Text: "ok", StopReason: "end_turn"}, nil
		})
	if err != nil || reply.Text != "ok" || got.String() != "ok" {
		t.Fatalf("reply = %+v, streamed %q, err = %v; want the third attempt's answer", reply, got.String(), err)
	}
	if calls != 3 || len(w.waits) != 2 {
		t.Fatalf("calls = %d, waits = %v; want 3 attempts and 2 waits", calls, w.waits)
	}
	// About 400 ms, then about 1200 ms, each within a quarter either way.
	for i, base := range []time.Duration{400 * time.Millisecond, 1200 * time.Millisecond} {
		if d := w.waits[i]; d < base*3/4 || d > base*5/4 {
			t.Errorf("wait %d = %v, want within a quarter of %v", i, d, base)
		}
	}
}

func TestStreamGivesUpAfterTwoRetries(t *testing.T) {
	var w recordedWait
	calls := 0
	_, err := streamWithRetry(context.Background(), w.record, nil,
		func(func(string)) (Reply, error) {
			calls++
			return Reply{}, &types.ServiceUnavailableException{}
		})
	if calls != 3 || len(w.waits) != 2 {
		t.Fatalf("calls = %d, waits = %d; want 3 attempts and 2 waits", calls, len(w.waits))
	}
	if classifyBedrockError(err) != bedrockTransient {
		t.Fatalf("err = %v, want the provider's own error returned", err)
	}
}

func TestStreamNeverRetriesAfterADelta(t *testing.T) {
	var w recordedWait
	calls := 0
	_, err := streamWithRetry(context.Background(), w.record, func(string) {},
		func(onText func(string)) (Reply, error) {
			calls++
			onText("The first half of")
			return Reply{}, &types.ThrottlingException{}
		})
	if err == nil || calls != 1 || len(w.waits) != 0 {
		t.Fatalf("calls = %d, waits = %d, err = %v; want one attempt, no wait and the error", calls, len(w.waits), err)
	}
}

func TestStreamDoesNotRetryAnErrorThatWillNotClear(t *testing.T) {
	var w recordedWait
	calls := 0
	_, err := streamWithRetry(context.Background(), w.record, nil,
		func(func(string)) (Reply, error) {
			calls++
			return Reply{}, &types.ValidationException{}
		})
	if err == nil || calls != 1 || len(w.waits) != 0 {
		t.Fatalf("calls = %d, waits = %d, err = %v; want one attempt and the error", calls, len(w.waits), err)
	}
}

func TestStreamStopsRetryingWhenCancelled(t *testing.T) {
	throttled := &types.ThrottlingException{}
	// Cancelled before the first failure is even classified: no wait at all.
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	var w recordedWait
	calls := 0
	_, err := streamWithRetry(ctx, w.record, nil, func(func(string)) (Reply, error) {
		calls++
		return Reply{}, throttled
	})
	if calls != 1 || len(w.waits) != 0 || !errors.Is(err, error(throttled)) {
		t.Fatalf("calls = %d, waits = %d, err = %v; want one attempt and its error", calls, len(w.waits), err)
	}
	// Cancelled during the backoff: the real wait returns at once, and the
	// attempt is not made again.
	ctx, cancel = context.WithCancel(context.Background())
	calls = 0
	start := time.Now()
	_, err = streamWithRetry(ctx, sleepCtx, nil, func(func(string)) (Reply, error) {
		calls++
		cancel()
		return Reply{}, throttled
	})
	if calls != 1 || !errors.Is(err, error(throttled)) {
		t.Fatalf("calls = %d, err = %v; want one attempt and its error", calls, err)
	}
	if time.Since(start) > 200*time.Millisecond {
		t.Fatalf("a cancelled backoff took %v, want it to return at once", time.Since(start))
	}
}

func TestToolTimeoutFor(t *testing.T) {
	for name, want := range map[string]time.Duration{
		"get":          20 * time.Second,
		"validate":     20 * time.Second,
		"search":       10 * time.Second,
		"decode_error": 10 * time.Second,
		"":             10 * time.Second,
	} {
		if got := toolTimeoutFor(name); got != want {
			t.Errorf("toolTimeoutFor(%q) = %v, want %v", name, got, want)
		}
	}
}

// runTool gives the call the tool's own timeout, not the default.
func TestRunToolUsesTheToolsOwnTimeout(t *testing.T) {
	for _, name := range []string{"get", "search"} {
		var left time.Duration
		tools := []ToolDef{{Name: name, Call: func(ctx context.Context, _ json.RawMessage) (map[string]any, error) {
			dl, _ := ctx.Deadline()
			left = time.Until(dl)
			return map[string]any{}, nil
		}}}
		runTool(context.Background(), tools, ToolCall{ID: "t1", Name: name, Input: json.RawMessage(`{}`)})
		want := toolTimeoutFor(name)
		if left > want || left < want-time.Second {
			t.Errorf("%s ran with %v left, want about %v", name, left, want)
		}
	}
}

func TestFailureReason(t *testing.T) {
	cases := []struct {
		name       string
		err        error
		clientGone bool
		want       string
	}{
		{"throttled to the end", fmt.Errorf("bedrock model: converse stream: %w", &types.ThrottlingException{}), false, ReasonThrottle},
		{"transient to the end", &types.InternalServerException{}, false, ReasonModelError},
		{"validation", &types.ValidationException{}, false, ReasonModelError},
		{"deadline with no tool timeout", context.DeadlineExceeded, false, ReasonModelError},
		{"deadline after a tool timeout", fmt.Errorf("%w: %w", errToolTimeout, context.DeadlineExceeded), false, ReasonToolTimeout},
		{"cancelled context", fmt.Errorf("stream: %w", context.Canceled), false, ReasonClientGone},
		{"write to a closed connection", errors.New("write: broken pipe"), true, ReasonClientGone},
		{"throttle seen after the reader left", &types.ThrottlingException{}, true, ReasonClientGone},
	}
	for _, c := range cases {
		if got := FailureReason(c.err, c.clientGone); got != c.want {
			t.Errorf("%s: FailureReason = %q, want %q", c.name, got, c.want)
		}
	}
}

// timeoutThenFail asks for one tool, then fails the way a model call does
// when the turn's deadline runs out.
type timeoutThenFail struct{ calls int }

func (m *timeoutThenFail) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {
	m.calls++
	if m.calls == 1 {
		return Reply{StopReason: "tool_use", ToolCalls: []ToolCall{{ID: "t1", Name: "get", Input: json.RawMessage(`{"id":"x"}`)}}}, nil
	}
	return Reply{}, fmt.Errorf("bedrock model: stream: %w", context.DeadlineExceeded)
}

// A turn that dies on its deadline after a tool call timed out is a tool
// timeout, not a model error: the tool is what spent the time.
func TestTurnThatDiesAfterAToolTimeoutSaysSo(t *testing.T) {
	slow := []ToolDef{{Name: "get", Call: func(context.Context, json.RawMessage) (map[string]any, error) {
		return nil, context.DeadlineExceeded
	}}}
	svc := &Service{Model: &timeoutThenFail{}, Tools: slow, MaxTokens: 100}
	err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "show me the link token call"}}, nil,
		func(string, any) error { return nil })
	if got := FailureReason(err, false); got != ReasonToolTimeout {
		t.Fatalf("FailureReason = %q (err %v), want %q", got, err, ReasonToolTimeout)
	}
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("err = %v, want the deadline error still in the chain", err)
	}
}

// The blocked notice is a turn without an answer, and the log says so with
// the same reason vocabulary the error event uses.
func TestBlockedAnswerLogsItsReason(t *testing.T) {
	var buf bytes.Buffer
	prior := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&buf, nil)))
	defer slog.SetDefault(prior)

	got := groundingRun(t, "Add X-Retry-After-Ms to the call and it clears.")
	if !strings.Contains(got, BlockedNotice) {
		t.Fatalf("the answer was not blocked, got %q", got)
	}
	if n := strings.Count(buf.String(), "msg=answer_missing reason=blocked"); n != 1 {
		t.Fatalf("answer_missing reason=blocked logged %d times, want 1:\n%s", n, buf.String())
	}
}
