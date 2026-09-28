#!/usr/bin/env bash
# Builds an Ollama-embedded index of the catalogue, serves it, runs the eval,
# stops the server. Usage: mcp/eval/gate.sh <result-name>
set -euo pipefail
name="$1"; root="$(cd "$(dirname "$0")/../.." && pwd)"; tmp="${TMPDIR:-/tmp}"
export EMBED_PROVIDER=ollama OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
# A server left on the port from an earlier run would answer the eval with the
# wrong index, so refuse rather than measure it.
if curl -fsS -m 2 "http://localhost:8085/api/search?q=ping" >/dev/null 2>&1; then
  echo "something is already serving on :8085; stop it first" >&2; exit 1
fi
cd "$root/mcp"
go build -o "$tmp/abdm-indexer" ./cmd/indexer
go build -o "$tmp/abdm-docs-mcp" ./cmd/docs-mcp
"$tmp/abdm-indexer" -catalogue ../catalogue -out "$tmp/$name.db"
"$tmp/abdm-docs-mcp" -db "$tmp/$name.db" -addr :8085 & server=$!
trap 'kill $server 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do curl -fsS "http://localhost:8085/api/search?q=ping" >/dev/null 2>&1 && break; sleep 1; done
python3 eval/retrieval_eval.py "$name" http://localhost:8085
