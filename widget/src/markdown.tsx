import {useEffect, useState} from 'preact/hooks';
import type {ComponentChildren} from 'preact';
import {Check, Copy} from './icons';

/**
 * Renders the small markdown subset the support agent emits: paragraphs,
 * bulleted and numbered lists, fenced code blocks, bold, italics, inline code
 * and links. Nothing else, deliberately. A full markdown library would be a
 * new dependency and a bigger attack surface for text that streams straight
 * from a model; this renderer produces elements only, so model output can
 * never inject markup.
 *
 * The text re-renders on every streamed delta, so a marker that is still
 * half-open ("**bo") shows literally for a moment and resolves when its
 * closing half arrives. Fences are the exception: an unclosed fence renders
 * as a code block right away, because an answer that is mid-way through a
 * curl example should look like code while it arrives, not like prose.
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

/**
 * A site-relative destination is absolute against the docs origin. The widget
 * runs on pages that are not the docs site, where "/docs/..." points at
 * whatever the host happens to publish there.
 */
export function absolute(href: string, docsOrigin: string): string | null {
  if (href.startsWith('/')) return `${docsOrigin.replace(/\/$/, '')}${href}`;
  if (href.startsWith('https://') || href.startsWith('http://')) return href;
  return null;
}

function renderInline(text: string, docsOrigin: string): ComponentChildren[] {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <b key={i}>{renderInline(part.slice(2, -2), docsOrigin)}</b>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{renderInline(part.slice(1, -1), docsOrigin)}</em>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Site-relative and http(s) destinations only; anything else renders as
      // the text it was.
      const url = absolute(href, docsOrigin);
      if (url) {
        return (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
      class={className}
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => undefined,
        );
      }}>
      {copied ? <Check /> : <Copy />}
    </button>
  );
}

type Block =
  | {kind: 'p'; text: string}
  | {kind: 'code'; text: string}
  | {kind: 'ul' | 'ol'; items: string[]};

const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

export function toBlocks(text: string): Block[] {
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

export default function ChatMarkdown({
  text,
  docsOrigin,
}: {
  text: string;
  docsOrigin: string;
}) {
  return (
    <>
      {toBlocks(text).map((block, i) => {
        if (block.kind === 'p') {
          return <p key={i}>{renderInline(block.text, docsOrigin)}</p>;
        }
        if (block.kind === 'code') {
          return (
            <div key={i} class="ask-ai__code">
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
              <li key={j}>{renderInline(item, docsOrigin)}</li>
            ))}
          </ListTag>
        );
      })}
    </>
  );
}
