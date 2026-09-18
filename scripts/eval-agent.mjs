// Runs the six portal eval tasks on a chosen model, using `claude -p`, and
// scores each one pass or fail against the exit condition in
// evals/agent/tasks.json. The floor model is Haiku: a skill that only works
// on Opus is a skill that only works for people who can afford Opus.
//
// Usage: node scripts/eval-agent.mjs [--model haiku] [--task n] [--record]
//
// A task whose `needs` env vars are unset is recorded as blocked, not failed.
// A PASS reported with empty evidence is scored FAIL: the agent must paste
// the tool or sandbox output that shows the exit condition.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i === -1 ? d : args[i + 1]; };
const model = opt("--model", "haiku");
const only = opt("--task", null);
const record = args.includes("--record");
const root = new URL("..", import.meta.url).pathname;
const { footer, tasks } = JSON.parse(readFileSync(join(root, "evals/agent/tasks.json"), "utf8"));
const version = readFileSync(join(root, "catalogue/VERSION"), "utf8").trim();

const rows = [];
for (const t of tasks) {
  if (only && String(t.id) !== only) continue;
  const missing = t.needs.filter((k) => !process.env[k]);
  if (missing.length) { rows.push({ id: t.id, title: t.title, result: "BLOCKED", blockers: [`unset: ${missing.join(", ")}`] }); continue; }
  const cwd = mkdtempSync(join(tmpdir(), `abdm-eval-${t.id}-`));
  const prompt = `${t.prompt}\n\nExit condition: ${t.exit}\n\n${footer}`;
  let text = "";
  try {
    text = execFileSync("claude", ["-p", prompt, "--model", model, "--output-format", "text",
      "--allowedTools", "Read,Write,Edit,Bash,Glob,Grep,mcp__abdm-docs__*"],
      { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) { text = (e.stdout || "") + (e.stderr || ""); }
  if (/Failed to authenticate/.test(text)) { rows.push({ id: t.id, title: t.title, result: "BLOCKED", blockers: ["claude CLI is not logged in: run `claude login`"] }); continue; }
  writeFileSync(join(cwd, "transcript.txt"), text);
  const m = [...text.matchAll(/```eval-result\s*([\s\S]*?)```/g)].pop();
  let r = { result: "FAIL", attempts: null, atoms_cited: [], evidence: "", blockers: ["no eval-result block"] };
  if (m) { try { r = { ...r, ...JSON.parse(m[1]) }; } catch { r.blockers = ["eval-result block is not JSON"]; } }
  if (r.result === "PASS" && !String(r.evidence || "").trim()) { r.result = "FAIL"; r.blockers = [...(r.blockers || []), "PASS claimed with no evidence"]; }
  if (r.result === "PASS" && !(r.atoms_cited || []).length) r.blockers = [...(r.blockers || []), "passed citing no atom: ambient knowledge"];
  rows.push({ id: t.id, title: t.title, cwd, ...r });
  console.error(`task ${t.id}: ${r.result}  transcript ${join(cwd, "transcript.txt")}`);
}

const date = new Date().toISOString().slice(0, 10);
const out = { date, catalogue_version: version, model, rows };
console.log(`\n${date}  catalogue ${version}  model ${model}\n`);
console.log("#  result   loops  atoms  title");
for (const r of rows) console.log(`${r.id}  ${r.result.padEnd(8)} ${String(r.attempts ?? "").padEnd(6)} ${String((r.atoms_cited || []).length).padEnd(6)} ${r.title}${r.blockers?.length ? `\n   ${r.blockers.join("; ")}` : ""}`);
if (record) {
  const file = join(root, `evals/agent/runs/${date}-${version}-${model}.json`);
  writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nrecorded ${file}`);
}
