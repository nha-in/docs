# Retrieval eval

Measures how well the docs-mcp `/api/search` endpoint retrieves the right
catalogue atoms for scenario-phrased developer queries.

Two check types:

- **Rank cases** (28): each query has a set of atom ids that genuinely answer
  it. Scored by the rank of the first expected atom: hit@1, hit@3, hit@10,
  and MRR. Fifteen are the original scenario set; five come from a recorded
  agent session that failed on the timestamp and encryption docs; eight are
  NHCX cases phrased the way a hospital or insurer developer describes the
  problem. The summary reports all 28 together and again by gateway, under
  `by_gateway`, so a change to one gateway's atoms is visible on its own.
- **Content probes** (3): the top hit's snippet plus summary must contain
  required substrings (case-insensitive) and must not contain forbidden ones.
  These catch a refuted claim surviving in the surfaced text even when the
  right atom ranks first. Reported as pass/fail, separate from ranks.

## Running

A docs-mcp server with an embedding index must be up, and the index must have
been built with the **same embedding model** the server queries with; scores
against a mismatched index are meaningless.

```sh
python3 mcp/eval/retrieval_eval.py <name> <base_url>
# e.g.
python3 mcp/eval/retrieval_eval.py ollama-baseline http://localhost:8085
```

Per-case lines print to stdout, and the full result (summary, rows, probes)
is written to `mcp/eval/results/<name>.json` (gitignored). Python 3 stdlib
only; no dependencies.
