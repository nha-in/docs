package embed

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestFakeIsDeterministicAndSemantic(t *testing.T) {
	f := NewFake(64)
	v, err := f.Embed(context.Background(), []string{
		"facility not onboarded gateway",
		"facility not onboarded gateway",
		"care context linking flow",
	})
	if err != nil {
		t.Fatal(err)
	}
	if Cosine(v[0], v[1]) < 0.999 {
		t.Errorf("identical texts not identical vectors")
	}
	if Cosine(v[0], v[2]) >= Cosine(v[0], v[1]) {
		t.Errorf("unrelated text ranked as close as identical text")
	}
	if f.Model() != "fake-64" {
		t.Errorf("model = %q", f.Model())
	}
}

func TestOllamaClient(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/embed" {
			t.Errorf("path = %s", r.URL.Path)
		}
		var req struct {
			Model string   `json:"model"`
			Input []string `json:"input"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Error(err)
		}
		if req.Model != "nomic-embed-text" || len(req.Input) != 2 {
			t.Errorf("req = %+v", req)
		}
		json.NewEncoder(w).Encode(map[string]any{
			"embeddings": [][]float32{{1, 0}, {0, 1}},
		})
	}))
	defer srv.Close()
	o := NewOllama(srv.URL, "nomic-embed-text")
	v, err := o.Embed(context.Background(), []string{"a", "b"})
	if err != nil {
		t.Fatal(err)
	}
	if len(v) != 2 || v[0][0] != 1 || v[1][1] != 1 {
		t.Errorf("v = %v", v)
	}
}

func TestOllamaErrorSurfaces(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "model not found", 404)
	}))
	defer srv.Close()
	if _, err := NewOllama(srv.URL, "m").Embed(context.Background(), []string{"a"}); err == nil {
		t.Fatal("want error on non-200")
	}
}
