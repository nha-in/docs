// Checks endpoint atoms against the sandbox by running the curl each atom
// carries, and records the scrubbed request and response as evidence under
// catalogue/verification/. Internal to contributors: atoms carry no
// verification field and readers never see one. The evidence is what a
// contributor reads before a release, and what an issue against an atom cites.
//
//   ABDM_CLIENT_ID=... ABDM_CLIENT_SECRET=... node scripts/verify-atoms.mjs --list
//   ABDM_CLIENT_ID=... ABDM_CLIENT_SECRET=... node scripts/verify-atoms.mjs
//   ... --only hiecm.endpoint.m1-get-public-certificate
//
// Every <PLACEHOLDER> in a curl is filled from the environment variable of the
// same name (ABHA_NUMBER, MOBILE, YOUR_HIP_ID, ...). ACCESS_TOKEN, FRESH_UUID
// and the timestamp placeholders are filled by the script. An atom with a
// placeholder nobody filled is skipped and the missing names are printed:
// that is the list of what needs a human, an OTP or a flow, not a failure.
//
// A 2xx is reported as "matches". Anything else is recorded with its body so
// the atom can be corrected. Nothing is inferred and no atom is edited.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { loadAtoms, root, section } from "./lib/atoms.mjs";

const args = process.argv.slice(2);
const list = args.includes("--list");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const destructive = args.includes("--include-destructive");
const today = new Date().toISOString().slice(0, 10);
const evidenceDir = join(root, "catalogue", "verification");
mkdirSync(evidenceDir, { recursive: true });

const { atoms } = loadAtoms();
const endpoints = [...atoms.values()].filter((a) => a.fm.type === "endpoint" && (!only || a.fm.id === only));
const curlOf = (a) => (section(a.body, "What happens").match(/```bash\n([\s\S]*?)```/) || [])[1];
// Bridge writes change where the sandbox sends every callback for the client id, so they are never a verification.
const isDestructive = (c) => /-X\s+(DELETE|PATCH|PUT)/i.test(c) || (/-X\s+POST/i.test(c) && /bridges\/|bridge\/|de-?activat|re-?activat|register-professional|profile\/account\/update/i.test(c));

const fixed = () => ({
  FRESH_UUID: randomUUID(),
  ISO_8601_TIMESTAMP: new Date().toISOString(),
  UTC_ISO_8601_WITH_MILLISECONDS_AND_Z: new Date().toISOString(),
});
const fill = (curl, token) => {
  const vals = { ...fixed(), ACCESS_TOKEN: token };
  const missing = [];
  const out = curl.replace(/<([A-Z_0-9]+)>/g, (_, k) => {
    const v = vals[k] ?? process.env[k];
    if (v === undefined) { missing.push(k); return `<${k}>`; }
    return v;
  });
  return { cmd: out, missing: [...new Set(missing)] };
};

if (list) {
  for (const a of endpoints) {
    const c = curlOf(a);
    const { missing } = fill(c, "x");
    const tag = isDestructive(c) && !destructive ? "destructive, skipped" : missing.length ? `needs ${missing.join(", ")}` : "runs unattended";
    console.log(`${a.fm.id.padEnd(55)} ${tag}`);
  }
  process.exit(0);
}

const id = process.env.ABDM_CLIENT_ID, secret = process.env.ABDM_CLIENT_SECRET;
if (!id || !secret) { console.error("set ABDM_CLIENT_ID and ABDM_CLIENT_SECRET"); process.exit(2); }
const gateway = process.env.ABDM_GATEWAY ?? "https://dev.abdm.gov.in";
const session = JSON.parse(execFileSync("curl", ["-s", "-X", "POST", `${gateway}/api/hiecm/gateway/v3/sessions`,
  "-H", "Content-Type: application/json", "-H", `REQUEST-ID: ${randomUUID()}`, "-H", `TIMESTAMP: ${new Date().toISOString()}`, "-H", "X-CM-ID: sbx",
  "-d", JSON.stringify({ clientId: id, clientSecret: secret, grantType: "client_credentials" })], { encoding: "utf8" }));
if (!session.accessToken) { console.error("session failed:", JSON.stringify(session).slice(0, 300)); process.exit(1); }
const token = session.accessToken;

// Scrub every secret and every value the caller supplied before anything is written.
const secrets = [token, secret, id, ...Object.keys(process.env).filter((k) => /^[A-Z_0-9]+$/.test(k) && k !== "ABDM_GATEWAY" && endpoints.some((a) => curlOf(a).includes(`<${k}>`))).map((k) => process.env[k])].filter((s) => s && s.length > 3);
const scrub = (s) => secrets.reduce((t, v) => t.split(v).join("<scrubbed>"), s);

const rows = [];
for (const a of endpoints) {
  const c = curlOf(a);
  if (isDestructive(c) && !destructive) { rows.push([a.fm.id, "skipped", "destructive"]); continue; }
  const { cmd, missing } = fill(c, token);
  if (missing.length) { rows.push([a.fm.id, "skipped", `needs ${missing.join(", ")}`]); continue; }
  let out = "";
  try {
    out = execFileSync("bash", ["-c", `${cmd.replace(/^curl/, "curl -s --max-time 30 -w '\\n%{http_code}'")}`], { encoding: "utf8" });
  } catch (e) { out = (e.stdout || "") + "\n000"; }
  const nl = out.lastIndexOf("\n");
  const body = out.slice(0, nl).trim(), code = Number(out.slice(nl + 1).trim());
  const host = (cmd.match(/https?:\/\/[^/'" ]+/) || ["unknown"])[0];
  const rel = `catalogue/verification/${a.fm.id}.json`;
  const evidence = { atom: a.fm.id, on: today, against: host, request: scrub(cmd.replace(/^curl/, "curl")), status: code, body: scrub(body).slice(0, 4000) };
  writeFileSync(join(root, rel), JSON.stringify(evidence, null, 2) + "\n");
  const ok = code >= 200 && code < 300;
  rows.push([a.fm.id, ok ? "matches" : `HTTP ${code}`, ok ? "" : scrub(body).slice(0, 120).replace(/\s+/g, " ")]);
  // An error code coming back is evidence for its error atom too, so note it.
  for (const m of new Set(body.match(/ABDM-\d{4}/g) || [])) {
    const e = atoms.get(`hiecm.error.${m.toLowerCase()}`);
    if (e && !rows.some((r) => r[0] === e.fm.id)) rows.push([e.fm.id, "observed", `in ${a.fm.id}`]);
  }
  execFileSync("sleep", ["0.5"]);
}
for (const [i, r, note] of rows) console.log(`${r.padEnd(14)} ${i.padEnd(55)} ${note}`);
const n = (s) => rows.filter((r) => r[1] === s).length;
console.log(`\n${n("matches")} matched, ${n("observed")} error codes observed, ${rows.filter((r) => r[1].startsWith("HTTP")).length} returned non-2xx, ${n("skipped")} skipped. Evidence in catalogue/verification/.`);
