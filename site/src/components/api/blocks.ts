/**
 * The blocks of an OpenAPI description: paragraphs, `#` headings and lists.
 *
 * Kept apart from Markdown.tsx, which renders them, so the reading of a
 * description can be tested without a browser. See blocks.test.mjs.
 */
export type Block =
  | {kind: 'paragraph'; lines: string[]}
  | {kind: 'heading'; level: number; text: string}
  | {kind: 'list'; ordered: boolean; items: string[]};

const HEADING = /^(#{1,6})\s+(.*?)\s*#*$/;
const BULLET = /^[-*+]\s+(.*)$/;
const NUMBERED = /^\d+[.)]\s+(.*)$/;

/**
 * The blocks of a description. Read line by line rather than split on blank
 * lines, because a list often follows its opening sentence with no blank line
 * between them.
 */
export function blocks(text: string): Block[] {
  const out: Block[] = [];
  let open: Block | undefined;
  const close = () => {
    open = undefined;
  };
  for (const raw of text.trim().split('\n')) {
    const line = raw.trim();
    if (line === '') {
      close();
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      out.push({kind: 'heading', level: heading[1].length, text: heading[2]});
      close();
      continue;
    }
    const item = BULLET.exec(line) ?? NUMBERED.exec(line);
    if (item) {
      const ordered = !BULLET.test(line);
      if (open?.kind !== 'list' || open.ordered !== ordered) {
        open = {kind: 'list', ordered, items: []};
        out.push(open);
      }
      open.items.push(item[1]);
      continue;
    }
    // A line that is none of those continues what is open: the item of a list
    // that was wrapped, or the paragraph.
    if (open?.kind === 'list') {
      open.items[open.items.length - 1] += ` ${line}`;
    } else if (open?.kind === 'paragraph') {
      open.lines.push(line);
    } else {
      open = {kind: 'paragraph', lines: [line]};
      out.push(open);
    }
  }
  return out;
}
