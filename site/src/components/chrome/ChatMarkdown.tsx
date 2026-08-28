import React from 'react';
import Link from '@docusaurus/Link';

/**
 * Renders the small markdown subset the Ask AI assistant actually emits:
 * paragraphs, bulleted and numbered lists, bold, italics, inline code and
 * links. Nothing else, deliberately. A full markdown library would be a new
 * dependency and a bigger attack surface for text that streams straight from
 * a model; this renderer produces React elements only, so model output can
 * never inject markup.
 *
 * The text re-renders on every streamed delta, so a marker that is still
 * half-open ("**bo") shows literally for a moment and resolves when its
 * closing half arrives. That is the standard look of streaming chat and
 * costs nothing.
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
      // Only site-relative and http(s) destinations; anything else renders
      // as the text it was.
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

type Block =
  | {kind: 'p'; text: string}
  | {kind: 'ul' | 'ol'; items: string[]};

const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let list: {kind: 'ul' | 'ol'; items: string[]} | null = null;
  let para: string[] = [];

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
    // Headings arrive rarely; render them as emphasized prose rather than
    // grabbing heading levels inside a chat bubble.
    para.push(line.replace(/^#{1,4}\s+/, '').trim());
  }
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
