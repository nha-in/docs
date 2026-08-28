package server

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
)

func TestClientIP(t *testing.T) {
	cases := []struct {
		name       string
		forwarded  string
		remoteAddr string
		trustProxy bool
		want       string
	}{
		{"no forwarded header uses remote addr host", "", "1.2.3.4:5678", false, "1.2.3.4"},
		{"single forwarded entry, trusted", "5.6.7.8", "1.2.3.4:5678", true, "5.6.7.8"},
		{"last of multiple forwarded entries wins, trusted", "5.6.7.8, 9.9.9.9", "1.2.3.4:5678", true, "9.9.9.9"},
		{"remote addr without port falls back verbatim", "", "not-a-host-port", false, "not-a-host-port"},
		// Untrusted: a direct caller can set X-Forwarded-For to anything it
		// likes, so the header must be ignored entirely and RemoteAddr's
		// host used instead -- the whole point of the trustProxy gate.
		{"forwarded header ignored when not trusted", "5.6.7.8", "1.2.3.4:5678", false, "1.2.3.4"},
		{"forged forwarded header ignored when not trusted", "6.6.6.6, 9.9.9.9", "1.2.3.4:5678", false, "1.2.3.4"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/chat", nil)
			req.RemoteAddr = c.remoteAddr
			if c.forwarded != "" {
				req.Header.Set("X-Forwarded-For", c.forwarded)
			}
			if got := clientIP(req, c.trustProxy); got != c.want {
				t.Errorf("clientIP = %q, want %q", got, c.want)
			}
		})
	}
}

func TestHealthzReportsEmbeddings(t *testing.T) {
	h, err := Handler(fixtureReader(t, true), embed.NewFake(64), "https://docs.example.com", nil, nil, false)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(h)
	defer srv.Close()
	res, err := srv.Client().Get(srv.URL + "/healthz")
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	var body struct {
		CatalogueVersion string `json:"catalogue_version"`
		Embeddings       bool   `json:"embeddings"`
	}
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if body.CatalogueVersion != "2026.08.24" || !body.Embeddings {
		t.Errorf("healthz = %+v", body)
	}
}

func TestHandlerRejectsModelMismatch(t *testing.T) {
	if _, err := Handler(fixtureReader(t, true), embed.NewFake(32), "*", nil, nil, false); err == nil {
		t.Fatal("want error for model mismatch at startup")
	}
}

func TestHandlerRejectsChatSvcWithoutLimiter(t *testing.T) {
	if _, err := Handler(fixtureReader(t, false), nil, "*", &chat.Service{}, nil, false); err == nil {
		t.Fatal("want error when chatSvc is set but limiter is nil")
	}
}

func TestAPISearchAndCORS(t *testing.T) {
	h, err := Handler(fixtureReader(t, false), nil, "https://docs.example.com", nil, nil, false)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(h)
	defer srv.Close()
	res, err := srv.Client().Get(srv.URL + "/api/search?q=ABDM-1035")
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	if got := res.Header.Get("Access-Control-Allow-Origin"); got != "https://docs.example.com" {
		t.Errorf("CORS header = %q", got)
	}
	var body struct {
		Hits []struct {
			ID string `json:"id"`
		} `json:"hits"`
	}
	if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
		t.Fatal(err)
	}
	if len(body.Hits) == 0 || body.Hits[0].ID != "hiecm.error.abdm-1035" {
		t.Errorf("hits = %+v", body.Hits)
	}
}

func TestAPISearchMissingQuery(t *testing.T) {
	h, err := Handler(fixtureReader(t, false), nil, "*", nil, nil, false)
	if err != nil {
		t.Fatal(err)
	}
	srv := httptest.NewServer(h)
	defer srv.Close()
	res, err := srv.Client().Get(srv.URL + "/api/search")
	if err != nil {
		t.Fatal(err)
	}
	res.Body.Close()
	if res.StatusCode != 400 {
		t.Errorf("status = %d, want 400", res.StatusCode)
	}
}
