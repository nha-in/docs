package server

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync/atomic"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/embed"
)

// alternating sends each request to the next server in turn, the way a load
// balancer spreads a client's requests over replicas that share no memory.
type alternating struct {
	servers []*httptest.Server
	n       atomic.Int64
}

func (a *alternating) RoundTrip(req *http.Request) (*http.Response, error) {
	target, err := url.Parse(a.servers[int(a.n.Add(1)-1)%len(a.servers)].URL)
	if err != nil {
		return nil, err
	}
	clone := req.Clone(req.Context())
	clone.URL.Scheme = target.Scheme
	clone.URL.Host = target.Host
	clone.Host = target.Host
	return http.DefaultTransport.RoundTrip(clone)
}

// Two independent handlers stand in for two ECS tasks. A real MCP client
// session must keep working while its requests alternate between them, which
// only holds when the server keeps no per-session state.
func TestMCPSessionSurvivesReplicaChange(t *testing.T) {
	var servers []*httptest.Server
	for i := 0; i < 2; i++ {
		h, err := Handler(fixtureReader(t, false), nil, "*", nil, nil, 0)
		if err != nil {
			t.Fatal(err)
		}
		srv := httptest.NewServer(h)
		defer srv.Close()
		servers = append(servers, srv)
	}
	lb := &alternating{servers: servers}

	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "0"}, nil)
	sess, err := client.Connect(context.Background(), &mcp.StreamableClientTransport{
		Endpoint:   servers[0].URL + "/mcp",
		HTTPClient: &http.Client{Transport: lb},
	}, nil)
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	defer sess.Close()

	for i := 0; i < 6; i++ {
		if _, err := sess.ListTools(context.Background(), nil); err != nil {
			t.Fatalf("tools/list #%d across replicas: %v", i+1, err)
		}
	}
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "search_docs", Arguments: map[string]any{"query": "abha"},
	})
	if err != nil {
		t.Fatalf("tools/call across replicas: %v", err)
	}
	if res.IsError {
		t.Fatalf("search_docs returned an error result: %+v", res.Content)
	}
	if lb.n.Load() < 4 {
		t.Fatalf("expected requests to spread over both replicas, saw %d requests", lb.n.Load())
	}
}

// The embeddings path takes the same handler, so a stateless server must not
// change what /healthz reports.
func TestStatelessHandlerKeepsHealthz(t *testing.T) {
	h, err := Handler(fixtureReader(t, true), embed.NewFake(64), "*", nil, nil, 0)
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
	if res.StatusCode != http.StatusOK || !strings.Contains(res.Header.Get("Content-Type"), "json") {
		t.Fatalf("healthz: status %d, content-type %q", res.StatusCode, res.Header.Get("Content-Type"))
	}
}
