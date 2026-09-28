/**
 * An endpoint description, split into the tabs it belongs in.
 *
 * NHA writes an operation's header table and body table into its description,
 * each under a bold label on a line of its own: `**Headers**`, `**Request body
 * for this use case:**`. The endpoint page shows those in the Headers and Body
 * tabs and everything else in Overview. Kept apart from ApiEndpoint.tsx so the
 * split can be tested without a browser. See sections.test.mjs.
 */
export type Tab = 'overview' | 'headers' | 'body';

// A bold run at the start of a line, before anything else on it.
const LABEL = /^\s*\*\*([^*\n]+?)\*\*/;
const RULE = /^\s*-{3,}\s*$/;

/**
 * The tab a label opens, or null for one that belongs to the section it sits
 * in: a Note under a body table is about that body.
 */
function opens(label: string): Tab | null {
  const text = label.trim().replace(/:$/, '').toLowerCase();
  if (/^headers?\b/.test(text)) return 'headers';
  if (/^request body\b/.test(text)) return 'body';
  if (/^(endpoint|flow|hosted by)\b/.test(text)) return 'overview';
  return null;
}

/**
 * The description as consecutive runs of lines, each tagged with its tab.
 * Every line keeps its own newline, so the runs join back to the exact text.
 */
export function chunks(text: string): {tab: Tab; text: string}[] {
  const out: {tab: Tab; text: string}[] = [];
  let tab: Tab = 'overview';
  for (const line of text.split(/(?<=\n)/)) {
    const label = LABEL.exec(line);
    // A rule is where the build's own Endpoint and Flow block hands back to
    // NHA's prose, which is overview.
    const next = label ? opens(label[1]) : RULE.test(line) ? 'overview' : null;
    if (next) tab = next;
    const last = out[out.length - 1];
    if (last?.tab === tab) last.text += line;
    else out.push({tab, text: line});
  }
  return out;
}

export function sections(text: string | undefined): Record<Tab, string> {
  const joined: Record<Tab, string> = {overview: '', headers: '', body: ''};
  for (const chunk of chunks(text ?? '')) joined[chunk.tab] += chunk.text;
  return {
    overview: joined.overview.trim(),
    headers: joined.headers.trim(),
    body: joined.body.trim(),
  };
}
