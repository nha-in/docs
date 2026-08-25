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
# Configuration is environment-first: the same image runs in every environment
# by env alone, and the deploy pipeline decides EMBED_PROVIDER (bedrock in the
# NHA account, ollama for a test box, none for keyword-only). These two are the
# only defaults the image itself carries.
ENV DB_PATH=/catalogue.db \
    ADDR=:8080
ENTRYPOINT ["/docs-mcp"]
