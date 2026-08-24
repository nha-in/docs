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
ENTRYPOINT ["/docs-mcp", "-db", "/catalogue.db"]
