/**
 * The opening line of a description, and everything after it.
 *
 * NHA writes a description as one long paragraph that restates the endpoint
 * four ways, and often follows it with raw HTML lists. Showing all of it above
 * the method and path buries the call the reader came for. This keeps whole
 * sentences up to a budget and moves the remainder below, so nothing is lost
 * and nothing is cut mid sentence.
 *
 * The cut is an index into the text, never a rejoin of matched pieces, so the
 * lede is always a true prefix of the description.
 */
const LEDE_BUDGET = 180;

// Where NHA's prose stops and its detail begins: an HTML block, a markdown
// list, or a paragraph break.
const DETAIL_START = /<(?:ol|ul|li|table|br|p|div|h[1-6])\b|\n\s*[-*+]\s|\n\n/i;

export function splitLede(description: string): [string, string] {
  const text = (description ?? '').trim();
  if (!text) return ['', ''];

  const block = text.search(DETAIL_START);
  const head = (block > 0 ? text.slice(0, block) : text).trim();
  const tail = (block > 0 ? text.slice(block) : '').trim();
  if (head.length <= LEDE_BUDGET) return [head, tail];

  const endsSentence = (i: number) =>
    '.!?'.includes(head[i]) && (i + 1 >= head.length || /\s/.test(head[i + 1]));

  // The last sentence end that fits the budget.
  let cut = -1;
  for (let i = 0; i < head.length && i <= LEDE_BUDGET; i += 1) {
    if (endsSentence(i)) cut = i + 1;
  }
  // A first sentence longer than the budget is kept whole rather than cut.
  if (cut === -1) {
    for (let i = 0; i < head.length; i += 1) {
      if (endsSentence(i)) { cut = i + 1; break; }
    }
    if (cut === -1) cut = head.length;
  }

  const overflow = head.slice(cut).trim();
  return [head.slice(0, cut).trim(), [overflow, tail].filter(Boolean).join('\n\n')];
}

// Words that carry no meaning for the comparison below.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'to', 'for', 'from', 'by', 'in', 'on', 'at', 'with',
  'and', 'or', 'this', 'that', 'is', 'are', 'be', 'will', 'used', 'api',
  'endpoint', 'its', 'their', 'your',
]);

const contentWords = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOPWORDS.has(word));

/**
 * Whether the lede only says again what the title already said.
 *
 * Once the boilerplate opener is stripped, many NHA descriptions open with a
 * restatement of the operation name: a title of "Get the certificate
 * information" above a lede of "Retrieve certificate information" gives the
 * reader the same sentence twice. The verbs differ, so this compares the
 * content words rather than the strings.
 */
export function isRestatement(lede: string, title: string): boolean {
  // The leading verb is dropped on both sides. "Get the certificate
  // information" and "Retrieve certificate information" name one thing, and
  // only the verb NHA happened to choose differs.
  const words = contentWords(lede).slice(1);
  if (!words.length || words.length > 8) return false;
  const inTitle = new Set(contentWords(title).slice(1));
  if (!inTitle.size) return false;
  const shared = words.filter((word) => inTitle.has(word)).length;
  return shared / words.length >= 0.75;
}
