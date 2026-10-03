# Docs MCP server

Serves the catalogue to coding agents (MCP over streamable HTTP at /mcp)
and to the docs site search box (GET /api/search). Content comes from one
read-only SQLite snapshot compiled from catalogue/ by cmd/indexer; the
server never reads the catalogue directly and never writes anything.

Search is hybrid: FTS5 keyword ranking fused (reciprocal rank fusion)
with cosine similarity over chunk embeddings. Embeddings come from one
of two providers, chosen by EMBED_PROVIDER: `bedrock` (Amazon Titan
Text Embeddings V2, credentials via the SDK default chain — task role,
OIDC role, or a local profile; never configured here) or `ollama`
(nomic-embed-text, for test deployments without AWS model access).
Both the indexer and the server run without a provider, degrading to
keyword-only; /healthz reports which mode is live.

The provider is decided once per deployment, in the pipeline, and the
indexer and server both inherit it. There is no runtime fallback from
one provider to another: the index stamps its provider-qualified model
(`bedrock/amazon.titan-embed-text-v2:0`, `ollama/nomic-embed-text`)
and the server refuses a mismatched snapshot at startup. Switching
provider therefore means rebuilding catalogue.db.

Configuration is environment-first (see .env.example); every env var
has a same-named flag that overrides it for local runs.

## Run locally

The server requires an explicit provider decision: an absent EMBED_PROVIDER
is a startup failure, so a deployment that forgot to decide fails its
rollout instead of quietly serving keyword-only. Keyword-only is spelled
`none`, on purpose:

    go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    EMBED_PROVIDER=none go run ./cmd/docs-mcp -db /tmp/catalogue.db -addr :8080

A configured provider is probed with one embedding at startup, so bad
credentials or an unreachable endpoint also fail the rollout, not the first
developer's query. A provider over a vector-less index fails too; only
`none` over a vectored index is allowed, with a warning, since that is an
operator explicitly switching semantic search off.

With embeddings via Bedrock (any AWS credentials the default chain finds):

    EMBED_PROVIDER=bedrock AWS_REGION=ap-south-1 go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    EMBED_PROVIDER=bedrock AWS_REGION=ap-south-1 go run ./cmd/docs-mcp -db /tmp/catalogue.db

With embeddings via Ollama (running locally, nomic-embed-text pulled):

    EMBED_PROVIDER=ollama OLLAMA_URL=http://localhost:11434 go run ./cmd/indexer -catalogue ../catalogue -out /tmp/catalogue.db
    EMBED_PROVIDER=ollama OLLAMA_URL=http://localhost:11434 go run ./cmd/docs-mcp -db /tmp/catalogue.db

Or docker compose up (see docker-compose.yml; the Ollama sidecar is the
`ollama` profile).

The support agent that consumes this server, its guardrails and its
answer contract, is specified in support-agent-playbook.md.

## Tools

Six read-only tools:

| Tool | Does |
|---|---|
| search | atoms (default), API operations by intent or path (`kind: operation`), or FHIR profiles (`kind: fhir_profile`); an empty query with a type or milestone lists atoms; `response_format` concise (default) or detailed |
| get | one item by id, the id's shape picking the kind: atom id, operationId, `fhir:<profile>`, `fhir-example:<hiType>` |
| related | the atom graph walk |
| decode_error | error atoms and specification rows for a code or raw response |
| validate | `kind: request` checks a request body against its operation; `kind: fhir` checks a FHIR document bundle |
| catalogue_info | version, build time and coverage |

The eleven old names (search_docs, get_atom, related_atoms, list_atoms,
list_operations, get_operation, list_fhir_profiles, get_fhir_profile,
get_fhir_example, validate_request, validate_fhir) are deprecated aliases
for one release, each returning exactly what it did.

Every response carries catalogue_version. FHIR validation never logs bundle
contents: the tool-call logging middleware records only the tool name,
duration and whether it errored. It is not part of the chat tool set. A bundle over the 2 MiB input cap gets a different
response shape: just `error` and `catalogue_version`, with no
`findings` or `limits` field.

An atom marked `audience: contributor` in its frontmatter never reaches the
snapshot, so nothing that documents how this catalogue is built can be
returned to somebody asking about ABDM. Absent means integrator, so an atom
is integrator-facing unless it says otherwise.

## Discovery

The site publishes `/.well-known/mcp.json`: this server's `/mcp` endpoint,
streamable HTTP, no authentication, and the six tool names. A test fails if
the file names a tool the server does not register.

Agents that read pages rather than call tools can fetch any page's markdown
copy by adding `.md` to its URL (`/docs/hiecm/v3/getting-started/glossary.md`),
built by `scripts/emit-page-markdown.mjs` and served as `text/markdown`. The
host does not negotiate on an `Accept: text/markdown` header; use the `.md`
URL.

## Skills

The tools answer a question an agent already knows how to ask. The compiled
integrator skills answer the question before that: what the steps are, in
what order, and how to tell when one worked. `cmd/indexer` reads them from
`-skills` (default `../plugins/abdm-integrators-assistant/skills`, or
`SKILLS_DIR`) into the snapshot, so the server still reads the database and
nothing else, and the server offers them two ways:

- **Resources**, one per section, at `skill://<skill>` for the router and
  `skill://<skill>/<section>` for each file under `references/`.
- **Prompts**, one per skill, taking an optional `section` argument. Omit it
  for the router, which says which section to read. An unrecognised section
  is refused with the list of the ones that exist.

Both read the same rows, so a skill cannot say one thing on one surface and
something else on the other, and both stamp `catalogue_version` onto the text
the way every tool response carries it.

Twelve skills and forty seven sections ship today. A snapshot built with
`-skills ""`, or against a directory that is not there, carries no skills:
the server then registers no prompts and no resources and serves its tools
alone, which is what it did before skills were indexed.

The compiled `SKILL.md` frontmatter is read line by line rather than as
YAML, because it is not valid YAML: the compiler writes descriptions
containing a colon and a space inside an unquoted scalar. Skill loaders read
that file leniently and so does this one.

## Chat

`POST /api/chat` is a server-sent-events endpoint behind the site's "Ask
AI" panel. It runs an agent loop against a Claude model on Amazon Bedrock,
using the same read tools listed above: search, get, related,
decode_error and catalogue_info, plus validate for requests when a page is
attached. So the assistant's retrieval quality
is exactly the MCP server's retrieval quality, never a separate,
duplicated path.

The endpoint is off by default. Set `CHAT_MODEL` to a Bedrock model or
inference-profile id to turn it on; leave it empty and `/api/chat` answers
404, so a deployment that only wants the MCP server needs no other change.
The assistant answers strictly from what its tools return, so it runs at a low
sampling temperature: `CHAT_TEMPERATURE` (default 0.2) keeps quoted literals and
the tool loop's choices stable, and 0 makes it as deterministic as the model
allows. With an Anthropic or Amazon Nova model the system prompt is sent behind a
cache point, so Bedrock charges that prefix at the read rate on every turn
after the first; other model families reject cache points, so for them the
prompt goes without one at the full input rate. OpenAI GPT-5 and GPT-6 models refuse
a temperature, so for them it is not sent and `CHAT_TEMPERATURE` has no effect.
For those same models `CHAT_REASONING_EFFORT` (default `medium`; `none`, `low`,
`medium`, `high`, `xhigh` or `max`) is sent as
`additionalModelRequestFields.reasoning.effort`. Higher effort costs latency
and output tokens against the 90 second deadline per question. Set it empty
(`CHAT_REASONING_EFFORT=`) to send nothing and take the provider's default;
other model families never receive it.

Guardrails are environment-tunable: `CHAT_MAX_TOKENS` (default 1500),
`CHAT_RATE_PER_MIN` (default 15) and `CHAT_RATE_PER_DAY` (default 100) cap
one IP's spend (behind a reverse proxy set `TRUST_PROXY=true`, and
`TRUST_PROXY_HOPS` to the number of proxies that each append an
`X-Forwarded-For` entry, 2 for a CDN in front of a load balancer, so the
limit keys on the reader and not on the proxy), and `ALLOW_ORIGIN` scopes CORS exactly as `/api/search`
does. The system prompt keeps the assistant strictly inside the catalogue:
answers only from tool results, honest about what's verified against a
sandbox versus taken from the specification, and a plain "I don't have
that" instead of a guess when nothing matches.

A model call that Bedrock throttles, or that fails with a transient
server-side error, is tried up to two more times after about 400 ms and then
about 1200 ms, as long as no text has reached the reader yet. One tool call
may run for 10 seconds, and `get` and `validate` for 20, since they read
large specification fragments.

Every turn that ends without an answer logs one `answer_missing` line with a
`reason`: `throttle`, `model_error`, `tool_timeout`, `rate_limit`, `blocked`
or `client_gone`. The SSE `error` event carries the same `reason` beside its
`message`. A rate-limited request is refused with a 429 before any stream
opens, and an answer the guard blocked reaches the reader as its notice in a
`text` event, so those two reasons appear in the log only.

Credentials for Bedrock come from the environment's default AWS
credential chain — an EKS pod's IRSA role in production, never a stored
key. The IAM policy and Kubernetes manifests are in
[deploy/nha/](../deploy/nha/).

## Tests

    go test ./...

No test needs Ollama or AWS; embeddings are covered by a deterministic
fake, and the Bedrock client is tested against a stand-in invoker.
Golden contract files live in internal/server/testdata/golden; regenerate
with go test ./internal/server/ -run TestGolden -update and review the
diff like any other contract change.
