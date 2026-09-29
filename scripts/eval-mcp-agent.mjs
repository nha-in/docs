// Runs the Ask AI golden cases through an external agent that has nothing
// but this portal's MCP server, the way an integrator's coding agent meets
// it, and writes transcripts the Ask AI eval already scores.
//
//   node scripts/eval-mcp-agent.mjs [--model haiku] [--slice naive,diagnose] [--only id,id]
//                                   [--limit n] [--concurrency 4] [--mcp-url URL] [--out DIR]
//
// Then score it with the same checks as the panel:
//
//   cd mcp && go run ./cmd/askai-eval check  -cases ../evals/askai/cases -run <out>
//   cd mcp && go run ./cmd/askai-eval report -cases ../evals/askai/cases -run <out>
//
// What it measures that the panel eval cannot: whether an agent picks the
// right tool (search, get, related, validate, decode_error), how many calls
// it spends, and whether it answers from its own memory instead of the
// catalogue. The panel pre-retrieves for its model; an agent has to decide
// to look.
//
// Isolation. The agent must have the MCP and nothing else, or the run
// measures something else: this repo's CLAUDE.md, an installed ABDM plugin's
// skills, or a web search would all let it answer without the tools. So it
// runs in an empty temp directory with no built-in tools, no skills, no
// settings sources (so no plugins) and only this MCP server. With
// ANTHROPIC_API_KEY set it also runs --bare, which drops CLAUDE.md discovery,
// hooks and memory as well.
//
// With no --mcp-url it builds a keyword-only index of the working tree's
// catalogue and serves it locally, so it needs no cloud credentials. Point
// --mcp-url at a deployed server to measure that instead.
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i === -1 ? d : args[i + 1]; };
const list = (k) => (opt(k, "") || "").split(",").map((s) => s.trim()).filter(Boolean);
const model = opt("--model", "haiku");
const concurrency = Number(opt("--concurrency", "4"));
const limit = Number(opt("--limit", "0"));
const perCaseMs = Number(opt("--timeout", "240")) * 1000;
const root = new URL("..", import.meta.url).pathname;
const casesDir = join(root, "evals/askai/cases");
const version = readFileSync(join(root, "catalogue/VERSION"), "utf8").trim();
const day = new Date().toISOString().slice(0, 10);
const out = opt("--out", join(root, "evals/mcp-agent/runs", `${day}-${version}-${model}`));
const promptVersion = "mcp-agent-v1";

// The framing an integrator's agent would plausibly carry, and no more: it
// names the tools' owner and asks for sources, but does not teach the
// catalogue, the tools or ABDM. Everything else must come from the MCP.
const systemAppend = `You are a coding agent helping a developer integrate with India's ABDM gateways (HIE-CM, UHI, NHCX). You have the abdm-docs MCP server, the official developer portal's documentation. Answer the developer's question from what its tools return; say so when they return nothing that answers it. Name the portal pages you used.`;

function loadCases() {
  const only = new Set(list("--only"));
  const slices = new Set(list("--slice"));
  let cases = [];
  for (const slice of readdirSync(casesDir)) {
    for (const f of readdirSync(join(casesDir, slice))) {
      if (!f.endsWith(".json")) continue;
      const c = JSON.parse(readFileSync(join(casesDir, slice, f), "utf8"));
      if (only.size && !only.has(c.id)) continue;
      if (slices.size && !slices.has(c.slice)) continue;
      cases.push(c);
    }
  }
  cases.sort((a, b) => a.id.localeCompare(b.id));
  return limit ? cases.slice(0, limit) : cases;
}

// One prompt carries the whole case: claude -p takes a single message, so
// earlier turns are quoted as the conversation so far.
function promptFor(c) {
  const parts = [];
  const turns = c.turns;
  if (turns.length > 1) {
    parts.push("The conversation so far:");
    for (const t of turns.slice(0, -1)) parts.push(`${t.role === "user" ? "Developer" : "You"}: ${t.text}`);
    parts.push("", "The developer's new message:");
  }
  parts.push(turns[turns.length - 1].text);
  if (c.page) parts.push("", `The developer is looking at this page: ${c.page.title} (${c.page.url})`, "", c.page.markdown || "");
  if (c.attachment) parts.push("", `The developer attached ${c.attachment.name}:`, "```", c.attachment.text, "```");
  return parts.join("\n");
}

async function startServer() {
  const url = opt("--mcp-url", "");
  if (url) return { url, embed: "remote", db: url, stop: () => {} };
  const tmp = mkdtempSync(join(tmpdir(), "abdm-mcp-agent-"));
  const db = join(tmp, "catalogue.db");
  const bin = join(tmp, "docs-mcp");
  const env = { ...process.env, EMBED_PROVIDER: "none" };
  console.error("building a keyword-only index and the server...");
  execFileSync("go", ["run", "./cmd/indexer", "-catalogue", "../catalogue", "-out", db], { cwd: join(root, "mcp"), env, stdio: "ignore" });
  execFileSync("go", ["build", "-o", bin, "./cmd/docs-mcp"], { cwd: join(root, "mcp"), env, stdio: "ignore" });
  const port = opt("--port", "8097");
  const srv = spawn(bin, ["-db", db, "-addr", `:${port}`], { env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`${base}/healthz`)).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return { url: `${base}/mcp`, embed: "none", db, stop: () => srv.kill() };
}

function runClaude(prompt, mcpConfig) {
  const cwd = mkdtempSync(join(tmpdir(), "abdm-mcp-agent-case-"));
  const argv = ["-p", prompt, "--model", model, "--output-format", "stream-json", "--verbose",
    "--mcp-config", mcpConfig, "--strict-mcp-config", "--allowedTools", "mcp__abdm-docs__*",
    "--tools", "", "--disable-slash-commands", "--setting-sources", "", "--no-session-persistence",
    "--append-system-prompt", systemAppend];
  if (process.env.ANTHROPIC_API_KEY) argv.unshift("--bare");
  return new Promise((resolve) => {
    const p = spawn("claude", argv, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    p.stdout.on("data", (d) => (stdout += d));
    p.stderr.on("data", (d) => (stderr += d));
    const timer = setTimeout(() => p.kill("SIGTERM"), perCaseMs);
    p.on("close", (code) => { clearTimeout(timer); resolve({ code, stdout, stderr }); });
  });
}

const toolName = (n) => n.replace(/^mcp__abdm-docs__/, "");
const atomIdRe = /^(hiecm|nhcx|uhi|shared)\.[a-z]+\.[a-z0-9-]+$/;

function resultText(content) {
  if (typeof content === "string") return content;
  return (content || []).map((b) => b.text || "").join("");
}

// The stream-json events become the transcript eval.Check and eval.Retrieval
// read: one model call per assistant turn, its tool calls, and the results
// that came back for them.
function transcriptFor(c, prompt, run, server) {
  const calls = [];
  const byUseID = new Map();
  let answer = "", modelID = model, cost = 0, flags = [];
  let current = null;
  for (const line of run.stdout.split("\n")) {
    if (!line.trim()) continue;
    let ev;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === "system" && ev.model) modelID = ev.model;
    if (ev.type === "assistant") {
      current = { system: "", messages: calls.length ? [] : [{ Role: "user", Text: prompt }],
        reply: { Text: "", ToolCalls: [], StopReason: "" }, tool_results: [] };
      calls.push(current);
      for (const b of ev.message?.content || []) {
        if (b.type === "text") current.reply.Text += b.text;
        if (b.type === "tool_use") {
          current.reply.ToolCalls.push({ ID: b.id, Name: toolName(b.name), Input: b.input });
          byUseID.set(b.id, { call: current, name: toolName(b.name), input: b.input });
        }
      }
      current.reply.StopReason = current.reply.ToolCalls.length ? "tool_use" : "end_turn";
    }
    if (ev.type === "user") {
      for (const b of ev.message?.content || []) {
        if (b.type !== "tool_result") continue;
        const use = byUseID.get(b.tool_use_id);
        if (!use) continue;
        const text = resultText(b.content);
        let output;
        try { output = JSON.parse(text); } catch { output = text; }
        use.call.tool_results.push({ name: use.name, input: use.input, output });
      }
    }
    if (ev.type === "result") {
      answer = ev.result || "";
      cost = ev.total_cost_usd || 0;
      if (ev.is_error) flags.push(`agent error: ${ev.subtype || "unknown"}`);
    }
  }
  if (run.code !== 0 && !answer) flags.push(`claude exited ${run.code}: ${run.stderr.slice(0, 200)}`);

  // Sources are what the agent read in full (get on an atom, the atoms
  // decode_error returned) plus any atom whose page the answer links. A
  // search hit it never opened or named is not a source: the panel is held
  // to the same bar on what it shows as used.
  const corpus = [];
  const seen = new Map();
  const pages = new Map();
  const note = (id, title, url) => { if (id && atomIdRe.test(id) && !seen.has(id)) seen.set(id, { id, title: title || "", url: url || "" }); };
  for (const call of calls) {
    for (const tr of call.tool_results) {
      const o = tr.output;
      corpus.push(typeof o === "string" ? o : JSON.stringify(o));
      if (typeof o !== "object" || !o) continue;
      for (const h of o.hits || []) if (h.doc_url) pages.set(h.doc_url.split("#")[0], h);
      if (tr.name === "get" || tr.name === "get_atom") note(o.id, o.title, o.doc_url);
      if (tr.name === "decode_error") for (const m of Object.values(o.matches || {})) for (const a of m.atoms || []) note(a.id, a.title, a.doc_url);
    }
  }
  for (const [path, h] of pages) if (path && answer.includes(path)) note(h.id, h.title, h.doc_url);

  return {
    transcript: {
      case_id: c.id, catalogue_version: version, model_id: modelID, temperature: 0,
      prompt_version: promptVersion, embed_provider: server.embed, db_path: server.db,
      calls, answer, sources: [...seen.values()], corpus: corpus.join("\n"),
      blocked: false, flags, class: "agent", surface: "mcp-agent", recorded_at: new Date().toISOString(),
    },
    cost,
  };
}

async function main() {
  const cases = loadCases();
  if (!cases.length) throw new Error("no cases matched");
  const server = await startServer();
  const tmp = mkdtempSync(join(tmpdir(), "abdm-mcp-agent-cfg-"));
  const mcpConfig = join(tmp, "mcp.json");
  writeFileSync(mcpConfig, JSON.stringify({ mcpServers: { "abdm-docs": { type: "http", url: server.url } } }));
  const dir = join(out, "transcripts");
  mkdirSync(dir, { recursive: true });
  console.error(`${cases.length} cases on ${model} against ${server.url} -> ${out}`);

  let next = 0, done = 0, totalCost = 0, failed = 0;
  const worker = async () => {
    while (next < cases.length) {
      const c = cases[next++];
      const prompt = promptFor(c);
      const run = await runClaude(prompt, mcpConfig);
      const { transcript, cost } = transcriptFor(c, prompt, run, server);
      totalCost += cost;
      if (transcript.flags.length) failed++;
      writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(transcript, null, 2) + "\n");
      const calls = transcript.calls.reduce((n, m) => n + m.reply.ToolCalls.length, 0);
      console.error(`[${++done}/${cases.length}] ${c.id}: ${calls} tool calls${transcript.flags.length ? " FLAGGED " + transcript.flags[0] : ""}`);
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  } finally {
    server.stop();
  }
  console.error(`done: ${done} answered, ${failed} flagged, $${totalCost.toFixed(2)} reported by claude`);
  console.error(`score it: cd mcp && go run ./cmd/askai-eval check -cases ../evals/askai/cases -run ${out}`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
