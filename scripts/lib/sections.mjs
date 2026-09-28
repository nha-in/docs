// scripts/lib/sections.mjs
// A page section is addressed by its explicit heading id, `## Heading {#id}`.
// The id survives any rewording of the heading, so an atom that points at it
// never breaks when the words change. Text inside <AgentOnly> is kept apart:
// labelled paragraphs fill an atom's agent sections.
const HEADING_RE = /^(#{2,4})\s+(.+?)\s*(?:\{#([a-z0-9][a-z0-9-]*)\})?\s*$/;
const FENCE_RE = /^\s*(```|~~~)/;
const LABELS = {
  'Before you start': 'before',
  'What happens': 'happens',
  'How you know it worked': 'worked',
  'When it goes wrong': 'wrong',
};

export const literals = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);

function agentParts(body) {
  const parts = {before: '', happens: '', worked: '', wrong: ''};
  const unlabelled = [];
  for (const block of body.matchAll(/<AgentOnly>([\s\S]*?)<\/AgentOnly>/g)) {
    for (const para of block[1].trim().split(/\n\s*\n/)) {
      const m = para.match(/^\*\*(Before you start|What happens|How you know it worked|When it goes wrong)\.\*\*\s*([\s\S]*)$/);
      if (!m) { unlabelled.push(para.trim()); continue; }
      const key = LABELS[m[1]];
      parts[key] = parts[key] ? `${parts[key]}\n\n${m[2].trim()}` : m[2].trim();
    }
  }
  return {parts, unlabelled};
}

export function sectionsById(raw) {
  const lines = raw.split('\n');
  const heads = [];
  let fenced = false;
  let start = 0;
  if (lines[0] === '---') start = lines.indexOf('---', 1) + 1;
  for (let i = start; i < lines.length; i++) {
    if (FENCE_RE.test(lines[i])) { fenced = !fenced; continue; }
    if (fenced) continue;
    const h = lines[i].match(HEADING_RE);
    if (h) heads.push({line: i, level: h[1].length, heading: h[2], id: h[3] ?? null});
  }
  const out = new Map();
  heads.forEach((h, k) => {
    if (!h.id) return;
    // Stop at the next heading of the same or higher level, or at the first
    // sub-heading that is an addressable section of its own.
    const next = heads.slice(k + 1).find((n) => n.level <= h.level || n.id);
    const body = lines.slice(h.line + 1, next ? next.line : lines.length).join('\n');
    const {parts, unlabelled} = agentParts(body);
    out.set(h.id, {
      id: h.id, heading: h.heading, level: h.level, line: h.line + 1,
      text: body.replace(/<AgentOnly>[\s\S]*?<\/AgentOnly>/g, '').trim(),
      agent: parts, unlabelled,
    });
  });
  return out;
}
