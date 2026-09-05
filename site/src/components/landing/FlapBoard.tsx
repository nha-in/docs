import React from 'react';

/**
 * A split-flap board, the kind an Indian railway platform used to run.
 *
 * It replaces the pill that used to sit above the statement. The pill named
 * the site, which the lockup in the corner and the browser tab already did,
 * so it spent the best position on the page repeating something and told a
 * first time visitor nothing about what ABDM is for.
 *
 * The flap is not a decoration borrowed from a station. A departure board is
 * a list of things in transit between places, which is the claim underneath
 * ABDM, and this one sits over a drawing of the network doing it.
 *
 * Fixed cells, not fixed width. A real board has a set number of flaps and
 * pads the short words with blanks, which is also why this one cannot shift
 * the layout when the message changes length. Nothing here measures text.
 */
export default function FlapBoard({
  text,
  cells,
  still,
}: {
  /** What the board should be showing. */
  text: string;
  /** How many flaps the board has. Sized for the longest message it carries. */
  cells: number;
  /** True to set the text without turning the flaps. */
  still?: boolean;
}): React.ReactNode {
  // Centred in the row rather than left aligned, because the board is centred
  // on the page and a short message padded only on the right reads as broken
  // rather than as a short message.
  const room = Math.max(0, cells - text.length);
  const padded = `${' '.repeat(Math.floor(room / 2))}${text}`
    .padEnd(cells, ' ')
    .slice(0, cells)
    .toUpperCase();

  return (
    <span className="flap" data-still={still ? 'true' : undefined}>
      {/* The flaps are for looking at. What a screen reader gets is the one
          name that does not change, because a row of cells that turns over
          every few seconds is a live region nobody wants announced. */}
      <span className="flap__row" aria-hidden="true">
        {padded.split('').map((char, index) => (
          <span
            // The message is in the key, so a new message is a new element and
            // the CSS animation runs again from the top. Keyed on the index
            // alone, React would update the character in place and the flap
            // would never turn after the first paint.
            key={`${index}-${padded}`}
            className="flap__cell"
            style={{animationDelay: `${index * 16}ms`}}>
            {char === ' ' ? '' : char}
          </span>
        ))}
      </span>
      <span className="flap__label">ABDM Developer Portal</span>
    </span>
  );
}
