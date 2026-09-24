import React from 'react';
import Link from '@docusaurus/Link';
import {marked} from 'marked';
import {blocks} from './blocks';

/**
 * The markdown an OpenAPI description actually contains.
 *
 * The HIE-CM specifications carry code spans and the occasional bold run, and
 * nothing else, so that was once all this rendered. The NHCX specifications
 * write an operation's description as a short document: `###` sections
 * (Business purpose, When to use, Preconditions), `- ` lists under them, and
 * links into the guides. Rendered as inline text those came out as literal
 * `###` and as lists run together into one paragraph, so headings, lists and
 * links are blocks and elements here too. Across the catalogue that is 657
 * headings, all `###`, 1,366 list items, none nested, and 102 links, all to
 * this site's own pages.
 *
 * The M1 swagger reissued on 22 September 2026 also writes header and body
 * tables and blockquoted notes. A description carrying either goes through a
 * markdown parser with tables on instead, since these blocks cannot draw them.
 *
 * A single newline is a soft wrap, as it is in markdown. Specifications hard
 * wrap their descriptions near column 72, and honouring those breaks left
 * ragged half lines on narrow screens. A blank line still starts a paragraph.
 */
// Italic needs a word character at both inner edges, so a spaced `2 * 3 * 4`
// stays arithmetic. The build's own Flow block names the next call in italics.
const TOKEN = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*(?![\s*])[^*\n]*?[^\s*]\*|\*[^\s*]\*|\[[^\]\n]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/;

const TABLE_OR_QUOTE = /^\s*(\|.*\||>)/m;

marked.setOptions({gfm: true, breaks: false});

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
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      const link = LINK.exec(part);
      // Only an address a specification could mean: a page of this site, an
      // anchor, or a web page. Anything else stays the text it was written as.
      if (link && /^(\/|#|https?:\/\/)/.test(link[2])) {
        return (
          <Link key={index} to={link[2]}>
            {inline(link[1])}
          </Link>
        );
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
  if (TABLE_OR_QUOTE.test(text)) {
    // Each table goes in the same scroll wrapper prose pages give theirs
    // (MDXComponents.tsx, typography.css). Without it a code chip that will
    // not wrap, such as `authData.child.profilePhoto`, pushed the table out
    // of its column and over the request panel beside it.
    const html = (marked.parse(text.trim(), {async: false}) as string)
      .replaceAll('<table>', '<div class="table-scroll"><table>')
      .replaceAll('</table>', '</table></div>');
    // The description is the build's own data, generated from the
    // specification, never reader input.
    return <div className={className} dangerouslySetInnerHTML={{__html: html}} />;
  }
  return (
    <>
      {blocks(text).map((block, index) => {
        if (block.kind === 'heading') {
          // The page's title is its h1 and its sections are h2, so a
          // description's own sections never rank above h3.
          const Tag = `h${Math.min(6, Math.max(3, block.level))}` as 'h3';
          return (
            <Tag key={index} className="api-md__heading">
              {inline(block.text)}
            </Tag>
          );
        }
        if (block.kind === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag key={index} className={['api-md__list', className].filter(Boolean).join(' ')}>
              {block.items.map((item, i) => (
                <li key={i}>{inline(item)}</li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={index} className={className}>
            {inline(block.lines.join(' '))}
          </p>
        );
      })}
    </>
  );
}
