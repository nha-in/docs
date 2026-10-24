// A module skill built per functionality: the shape a module takes once its
// NHA test cases are mapped in catalogue/hiecm/tests/<module>.yaml.
//
// The unit of work is the functionality, one thing a person does in the
// integrator's product, not the job. Each functionality file carries one
// loop from design to test with everything it needs: its NHA cases, its
// screen requirements, its calls, its integrate notes, its error codes and
// how its cases run. What every loop shares lives once, in run.md (the test
// run) and foundations.md (the rules across calls and functionalities), and
// every code the module returns lives in errors.md.
//
// Nothing here carries an ABDM fact. The cases and their markings come from
// the generated test case page, the calls from the compiled build loops, the
// codes from the specifications, the screen requirements from atoms that
// name the functionality, and the case to functionality map from the
// mapping. build-skills.mjs passes them in.

/** `## ` sections of a markdown document, in order, as [heading, text]. */
export function h2Sections(markdown) {
  const out = [];
  for (const part of markdown.split(/\n(?=## )/)) {
    const heading = part.match(/^## (.+)$/m);
    out.push([heading ? heading[1].trim() : '', part.trim()]);
  }
  return out;
}

/** Each journey of a compiled build loop, as journey id -> its `### ` section. */
export function journeySections(buildLoop) {
  const out = new Map();
  const journeys = buildLoop.split(/\n## Journeys\n/)[1]?.split(/\n## /)[0] ?? '';
  for (const part of journeys.split(/\n(?=### )/)) {
    const id = part.match(/^### .*\(`([^`]+)`\)\s*$/m)?.[1];
    if (id) out.set(id, part.trim());
  }
  return out;
}

/** The paragraphs of a build loop's "How this skill runs", without its heading. */
export function buildLoopRules(buildLoop) {
  return buildLoop.split(/\n## How this skill runs\n/)[1]?.split(/\n## /)[0]?.trim() ?? '';
}

/**
 * A hand-authored test loop split into the parts every run shares and the
 * case groups, each group assigned to the functionality its cases map to.
 * Returns {preamble, intro, closing, groups: Map(functionality id -> [group text])}.
 */
export function splitTestLoop(testLoop, functionalityOf) {
  const at = testLoop.indexOf('\n## Test cases\n');
  const end = testLoop.indexOf('\n## When the last case is recorded\n');
  if (at === -1 || end === -1) throw new Error('the test loop has no "## Test cases" or no "## When the last case is recorded" section');
  const preamble = testLoop.slice(0, at).trim();
  const body = testLoop.slice(at + '\n## Test cases\n'.length, end);
  const closing = testLoop.slice(end).trim();
  const [intro, ...parts] = body.split(/\n(?=### )/);
  const groups = new Map();
  for (const part of parts) {
    const ids = [...part.matchAll(/^#### ([A-Z0-9_]+),/gm)].map((m) => m[1]);
    const owners = new Set(ids.map((id) => functionalityOf(id)));
    if (!ids.length || owners.size !== 1 || owners.has(undefined)) {
      throw new Error(`test loop group "${part.split('\n')[0]}" maps to ${[...owners].join(', ') || 'no functionality'}; each group must hold the cases of one functionality`);
    }
    const [owner] = owners;
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(part.trim());
  }
  return {preamble, intro: intro.trim(), closing, groups};
}

/** An atom's body as a section of a skill: title dropped, headings pushed down, catalogue links flattened. */
export function atomBody(entry, depth = 1) {
  const withoutTitle = entry.body.replace(/^#\s+.+$/m, '').trim();
  const dropped = withoutTitle.replace(/^## Before you start\n[\s\S]*?(?=^## )/m, '');
  const flattened = dropped.replace(/\[([^\]]+)\]\([^)]*\.md\)/g, '$1');
  const hashes = '#'.repeat(depth);
  return flattened.replace(/^(#{2,})\s/gm, (_, h) => `${h}${hashes} `).trim();
}

const list = (ids) => ids.map((id) => `\`${id}\``).join(', ');
const escapeStep = (line) => line.replace(/^(\d+)\.(\s?)/, '$1\\.$2').replace(/\|/g, '\\|');
const cellText = (text) => String(text ?? '').replace(/\n+/g, ' ').replace(/\|/g, '\\|');

/** How one case reads for one entity type, in the router's and the file's words. */
export function markingWord(rec) {
  if (rec.na) return 'not applicable';
  if (rec.kind === 'pair') return `mandatory, either ${rec.pair.join(' or ')}`;
  return rec.kind;
}

/** The mandatory cases of one functionality for one entity type, as short strings. */
export function mandatoryFor(fcases, marks) {
  const out = [];
  const seenPairs = new Set();
  for (const c of fcases) {
    const r = marks.get(c.id);
    if (!r || r.na) continue;
    if (r.kind === 'mandatory') out.push(c.id);
    else if (r.kind === 'conditional') out.push(`${c.id} (conditional)`);
    else if (r.kind === 'pair') {
      const key = [...r.pair].sort().join('|');
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      out.push(r.pair.join(' or '));
    }
  }
  return out;
}

/**
 * One functionality file.
 *   f            the mapping entry
 *   index, total its place in build order
 *   cases        the page cases of this functionality, in mapping order
 *   gov, priv    case id -> applicability record, per entity type
 *   screens      the atoms that name this functionality
 *   journeys     [{id, title, owner, section}] in the mapping's order
 *   operations   [{id, method, path, summary, headers}] for the journeys it owns
 *   errors       [{op, code, http, message}] the owned calls' examples return
 *   groups       the test loop groups for its cases
 *   needs        the NEEDS names this functionality's cases use
 */
export function functionalityFile({f, index, total, cases, gov, priv, screens, journeys, operations, errors, groups}) {
  const ids = cases.map((c) => c.id);
  const mandatoryGov = mandatoryFor(cases, gov);
  const mandatoryPriv = mandatoryFor(cases, priv);
  const mandatoryIds = [...new Set(cases.filter((c) => [gov.get(c.id), priv.get(c.id)].some((r) => r && !r.na && r.kind !== 'optional')).map((c) => c.id))];
  const owned = journeys.filter((j) => j.owner === f.id);
  const lines = [];
  lines.push(`# ${f.title}`, '');
  lines.push(
    `Functionality ${index} of ${total} in M1's build order. ${f.applies === 'all' ? 'Its group applies to every entity type.' : `Its group applies to ${f.applies} entities only, and is not applicable to the other.`} Read [run.md](../run.md) and [foundations.md](../foundations.md) once per session before this file.`,
    '',
  );

  lines.push('## The loop', '');
  lines.push('| Phase | In this file | Exit |', '|---|---|---|');
  lines.push(`| Design | Screen requirements | ${mandatoryIds.length ? `Each of ${list(mandatoryIds)}, for your entity type, is mapped to a screen or route in \`INTEGRATION-PLAN.md\`` : `Each screen requirement below is mapped to a screen in \`INTEGRATION-PLAN.md\`; ${f.title} holds no mandatory case`} |`);
  lines.push(`| Scaffold | Calls | ${owned.length ? `Every call in ${list(owned.map((j) => j.id))} reaches its exit condition against the sandbox` : journeys.length ? `The calls are built in ${[...new Set(journeys.map((j) => j.owner))].map((o) => `[${o}](${o}.md)`).join(', ')}; they answer in your build` : `${f.title} makes no ABDM call; skip to Integrate`} |`);
  lines.push(`| Integrate | Integrate notes | ${f.title} works end to end on your own screen, for the screens the notes name |`);
  lines.push(`| Debug | Errors, then the loop in [errors.md](../errors.md) | The failing step of ${f.title} succeeds |`);
  lines.push(`| Test | Cases, How the cases run | Each of ${list(ids)} is recorded in the workbook |`);
  lines.push(`| Record | [run.md](../run.md): the workbook writer, the report | The draft report shows ${f.title} |`);
  lines.push('');
  lines.push(
    `Loop limit: 3 passes through Test for ${f.title}. On the fourth, escalate in the format [run.md](../run.md) sets out, naming the case among ${list(ids)}.`,
    `An integration that already exists enters ${f.title} at Test, and goes back to Design or Integrate only for a case that fails.`,
    '',
  );

  lines.push('## Cases', '');
  lines.push(
    `Mandatory for a government entity: ${mandatoryGov.length ? mandatoryGov.join(', ') : 'none'}. Mandatory for a private entity: ${mandatoryPriv.length ? mandatoryPriv.join(', ') : 'none'}.`,
    '',
  );
  lines.push('| Case | Government | Private | What is tested |', '|---|---|---|---|');
  for (const c of cases) lines.push(`| ${c.id} | ${markingWord(gov.get(c.id))} | ${markingWord(priv.get(c.id))} | ${cellText(c.title)} |`);
  lines.push('');
  for (const c of cases) {
    lines.push(`### ${c.id}: ${c.title}`, '');
    if (c.what) lines.push(c.what, '');
    lines.push('**Steps**', '', ...(c.steps.length ? c.steps.map((s) => `- ${escapeStep(s)}`) : ['- Not stated.']), '');
    lines.push('**Expected Result**', '', ...c.expected.split('\n').map((s) => `- ${escapeStep(s)}`), '');
    if (c.tester) lines.push('**For the tester**', '', ...c.tester.split('\n').map((s) => `- ${escapeStep(s)}`), '');
  }

  lines.push('## Screen requirements', '');
  for (const atom of screens) {
    lines.push(atomBody(atom, 1), '', `From \`${atom.fm.id}\`.`, '');
  }

  lines.push('## Calls', '');
  if (!journeys.length) {
    lines.push(`${f.title} makes no ABDM call: no operation in the specification serves its cases.`, '');
    const gaps = cases.flatMap((c) => (f.cases.find((m) => m.id === c.id)?.gaps ?? []).map((g) => `- ${c.id}, step ${g.step}: ${g.note}`));
    if (gaps.length) lines.push(...gaps, '');
  }
  for (const j of journeys) {
    if (j.owner === f.id) lines.push(j.section.replace(/^#### /gm, '#### '), '');
    else lines.push(`### ${j.title} (\`${j.id}\`)`, '', `Built in [${j.owner}](${j.owner}.md). Reuse those calls.`, '');
  }

  lines.push('## Integrate notes', '');
  lines.push('| Case | Screen | Calls |', '|---|---|---|');
  for (const m of f.cases) lines.push(`| ${m.id} | ${cellText(m.screen)} | ${m.ops.length ? list(m.ops) : `None: ${cellText(m.reason ?? 'judged on the screen')}`} |`);
  lines.push('');
  if (operations.length) {
    lines.push('| Operation | Call | What it does |', '|---|---|---|');
    for (const op of operations) lines.push(`| \`${op.id}\` | \`${op.method} ${op.path}\` | ${cellText(op.summary)} |`);
    lines.push('');
    const headers = [...new Set(operations.flatMap((op) => (op.headers ?? []).map((h) => h.name)))];
    if (headers.length) lines.push(`Headers the calls of ${f.title} take: ${headers.map((h) => `\`${h}\``).join(', ')}. What each one is: [foundations.md](../foundations.md), Headers.`, '');
  }

  lines.push('## Errors', '');
  if (errors.length) {
    lines.push('| Call | HTTP | Code | Message |', '|---|---|---|---|');
    for (const e of errors) lines.push(`| \`${e.op}\` | ${e.http} | \`${e.code}\` | ${cellText(e.message)} |`);
    lines.push('');
  } else {
    lines.push(`The specification's examples return no error code on the calls of ${f.title}.`, '');
  }
  lines.push('Other codes, and the debug loop: [errors.md](../errors.md).', '');

  lines.push('## How the cases run', '');
  lines.push('Need names are defined in [run.md](../run.md).', '');
  lines.push('| Case | Needs | Steps with no call |', '|---|---|---|');
  for (const m of f.cases) {
    const gaps = (m.gaps ?? []).map((g) => `step ${g.step}`).join(', ');
    lines.push(`| ${m.id} | ${m.needs.length ? m.needs.map((n) => `\`${n}\``).join(', ') : 'nothing'} | ${gaps || 'none'} |`);
  }
  lines.push('');
  for (const g of groups) lines.push(g, '');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}
