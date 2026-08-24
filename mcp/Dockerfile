FROM golang:1.25 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /docs-mcp ./cmd/docs-mcp

FROM gcr.io/distroless/static-debian12
COPY --from=build /docs-mcp /docs-mcp
# catalogue.db is produced by cmd/indexer in CI and copied in at image build.
COPY catalogue.db /catalogue.db
ENTRYPOINT ["/docs-mcp"]
# Defaults live in CMD, not ENTRYPOINT, so a caller can replace the whole flag set
# without also having to restate the binary path: docker-compose `command:` and
# Kubernetes `args:` both override CMD alone.
# -ollama targets localhost because the Ollama sidecar shares the pod network
# namespace on EKS; docker-compose.yml overrides it with the compose service name.
CMD ["-db", "/catalogue.db", "-addr", ":8080", "-ollama", "http://localhost:11434", "-embed-model", "nomic-embed-text"]
