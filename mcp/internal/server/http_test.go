package server

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/nha-in/docs/mcp/internal/embed"
)

func TestHealthzReportsEmbeddings(t *testing.T) {
	h, err := Handler(fixtureReader(t, true), embed.NewFake(64), "https://docs.example.com")
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
	if _, err := Handler(fixtureReader(t, true), embed.NewFake(32), "*"); err == nil {
		t.Fatal("want error for model mismatch at startup")
	}
}

func TestAPISearchAndCORS(t *testing.T) {
	h, err := Handler(fixtureReader(t, false), nil, "https://docs.example.com")
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
	h, err := Handler(fixtureReader(t, false), nil, "*")
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
