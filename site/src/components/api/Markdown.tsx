import React from 'react';

/**
 * The inline markdown an OpenAPI description actually contains.
 *
 * Across this catalogue that is code spans and the occasional bold run, and
 * essentially nothing else: 267 code spans, 14 bold runs, no links, no
 * headings, no fenced blocks. Rendering the text raw put literal backticks on
 * half the endpoint pages, so this turns the two constructs that occur into
 * elements and leaves anything rarer as the plain text it already was.
 *
 * A single newline is a soft wrap, as it is in markdown. Specifications hard
 * wrap their descriptions near column 72, and honouring those breaks left
 * ragged half lines on narrow screens. A blank line still starts a paragraph.
 */
const TOKEN = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;

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
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim() !== '');

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={className}>
          {inline(paragraph.replace(/\s*\n\s*/g, ' '))}
        </p>
      ))}
    </>
  );
}
