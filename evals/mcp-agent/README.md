# MCP agent eval

The Ask AI golden cases (`evals/askai/cases`), answered by an external agent
that has nothing but this portal's MCP server, the way an integrator's coding
agent meets it. Transcripts are written in the Ask AI eval's own format, so
the same checks score both surfaces and the two can be compared case by case.

What it measures that the panel eval cannot: whether the agent picks the right
tool (`search`, `get`, `related`, `validate`, `decode_error`), how many calls
it spends, and whether it answers from its own memory instead of the tools.
The panel retrieves before its model speaks; an agent has to decide to look.

## Running

    npm run eval:mcp-agent -- --slice diagnose,naive     # or --only id,id, --limit n
    cd mcp && go run ./cmd/askai-eval check  -cases ../evals/askai/cases -run ../evals/mcp-agent/runs/<run> -answered
    cd mcp && go run ./cmd/askai-eval report -cases ../evals/askai/cases -run ../evals/mcp-agent/runs/<run>

- Needs the `claude` CLI, logged in. The model defaults to Haiku, the floor
  the skills are written for; pass `--model sonnet` to compare.
- With no `--mcp-url` it serves a keyword-only index of the working tree on
  localhost, so it needs no cloud credentials. `--mcp-url` measures a
  deployed server instead.
- `-answered` scores only the cases the run answered. Without it, a subset run
  reports every other case as "transcript: missing".

## Isolation

The agent runs in an empty temp directory with no built-in tools, no skills,
no settings sources (so no installed plugins) and only this MCP server. With
`ANTHROPIC_API_KEY` set it also runs `--bare`, which drops CLAUDE.md
discovery, hooks and memory. Without that isolation an installed ABDM plugin
or this repo's CLAUDE.md would let it answer without the tools.

## Scoring

Transcripts carry `surface: mcp-agent`. The checks that are the panel's own
(its voice list, em dash, headings, literals in code spans, answer shapes and
word budgets) are skipped. A case's own forbidden entries, grounding of every
path, header and code against what the tools returned, expected sources and
citations all apply. Sources are the atoms the agent read in full (`get`,
`decode_error`) and any atom whose page its answer links.
