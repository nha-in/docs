import React from 'react';
import {marked} from 'marked';

/**
 * The markdown an OpenAPI description contains, rendered.
 *
 * NHA's earlier descriptions carried code spans and the occasional bold run
 * and nothing else. The M1 swagger reissued on 22 September 2026 writes each
 * description as a page: a header table, a body table, a bulleted flow
 * navigation, italics and a blockquoted note. Rendering only two constructs
 * put raw pipes and asterisks on every one of those pages, so the text goes
 * through a markdown parser with tables on.
 *
 * A single newline is a soft wrap, as it is in markdown. Specifications hard
 * wrap their descriptions near column 72, and honouring those breaks left
 * ragged half lines on narrow screens. A blank line still starts a paragraph.
 */
marked.setOptions({gfm: true, breaks: false});

const TOKEN = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;

/** Code spans and bold runs in one line of text, for places that take no block markup. */
export function inline(text: string): React.ReactNode[] {
  return text
    .split(TOKEN)
    .filter((part) => part !== '')
    .map((part, index) => {
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }
      if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}

export default function Markdown({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const html = marked.parse(text.trim(), {async: false}) as string;
  // The description is the build's own data, generated from the
  // specification, never reader input.
  return <div className={className} dangerouslySetInnerHTML={{__html: html}} />;
}
