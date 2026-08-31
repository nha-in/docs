import React from 'react';
import Link from '@docusaurus/Link';
import {Check, Copy} from 'lucide-react';

/**
 * Renders the small markdown subset the Ask AI assistant emits: paragraphs,
 * bulleted and numbered lists, fenced code blocks, bold, italics, inline code
 * and links. Nothing else, deliberately. A full markdown library would be a
 * new dependency and a bigger attack surface for text that streams straight
 * from a model; this renderer produces React elements only, so model output
 * can never inject markup.
 *
 * The text re-renders on every streamed delta, so a marker that is still
 * half-open ("**bo") shows literally for a moment and resolves when its
 * closing half arrives. Fences are the exception: an unclosed fence renders
 * as a code block right away, because an answer that is mid-way through a
 * curl example should look like code while it arrives, not like prose.
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <b key={i}>{renderInline(part.slice(2, -2))}</b>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{renderInline(part.slice(1, -1))}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Site-relative and http(s) destinations only; anything else renders as
      // the text it was.
      if (href.startsWith('/')) {
        return (
          <Link key={i} to={href}>
            {label}
          </Link>
        );
      }
      if (href.startsWith('https://') || href.startsWith('http://')) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return part;
    }
    return part;
  });
}

/** Copies text to the clipboard and says so for a moment. */
export function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className: string;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  // The clipboard API needs a secure context. Where it is missing the button
  // would silently do nothing, so it does not render at all.
  if (typeof navigator === 'undefined' || !navigator.clipboard) return null;

  return (
    <button
      type="button"
      className={className}
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => undefined,
        );
      }}>
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

type Block =
  | {kind: 'p'; text: string}
  | {kind: 'code'; text: string}
  | {kind: 'ul' | 'ol'; items: string[]};

const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let list: {kind: 'ul' | 'ol'; items: string[]} | null = null;
  let para: string[] = [];
  let code: string[] | null = null;

  const flushPara = () => {
    if (para.length > 0) {
      blocks.push({kind: 'p', text: para.join(' ')});
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const line of text.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      if (code) {
        blocks.push({kind: 'code', text: code.join('\n')});
        code = null;
      } else {
        flushPara();
        flushList();
        // The info string (```json) is dropped: nothing here highlights, and
        // showing it would put a stray word above the sample.
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }

    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    if (bullet || numbered) {
      flushPara();
      const kind = bullet ? 'ul' : 'ol';
      if (!list || list.kind !== kind) {
        flushList();
        list = {kind, items: []};
      }
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    if (line.trim() === '') {
      flushPara();
      flushList();
      continue;
    }
    // A wrapped continuation of the previous list item, or plain prose.
    if (list && /^\s{2,}/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    flushList();
    // Headings arrive rarely; they render as emphasized prose rather than
    // taking heading levels inside a chat bubble.
    para.push(line.replace(/^#{1,4}\s+/, '').trim());
  }
  // A fence still open at the end of the text is a code block mid-stream.
  if (code) blocks.push({kind: 'code', text: code.join('\n')});
  flushPara();
  flushList();
  return blocks;
}

export default function ChatMarkdown({text}: {text: string}) {
  return (
    <>
      {toBlocks(text).map((block, i) => {
        if (block.kind === 'p') {
          return <p key={i}>{renderInline(block.text)}</p>;
        }
        if (block.kind === 'code') {
          return (
            <div key={i} className="ask-ai__code">
              <pre>
                <code>{block.text}</code>
              </pre>
              <CopyButton
                text={block.text}
                label="Copy code"
                className="ask-ai__code-copy"
              />
            </div>
          );
        }
        const ListTag = block.kind;
        return (
          <ListTag key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </ListTag>
        );
      })}
    </>
  );
}
