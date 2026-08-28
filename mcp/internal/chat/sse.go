package chat

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

type SSEWriter struct {
	w http.ResponseWriter
	f http.Flusher
}

func NewSSEWriter(w http.ResponseWriter) (*SSEWriter, error) {
	f, ok := w.(http.Flusher)
	if !ok {
		return nil, errors.New("response writer cannot stream")
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-store")
	// Nginx-family reverse proxies buffer a response by default, which would
	// hold every event until the stream closes instead of flushing deltas as
	// they arrive; this header (a de facto standard nginx honors, harmless
	// elsewhere) turns that buffering off.
	w.Header().Set("X-Accel-Buffering", "no")
	return &SSEWriter{w: w, f: f}, nil
}

func (s *SSEWriter) Event(name string, data any) error {
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	if _, err := fmt.Fprintf(s.w, "event: %s\ndata: %s\n\n", name, b); err != nil {
		return err
	}
	s.f.Flush()
	return nil
}
