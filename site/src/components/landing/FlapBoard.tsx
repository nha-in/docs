import React, {useEffect, useState} from 'react';

/**
 * How long one flap takes to fall, and how far apart the cells start.
 *
 * Slow on purpose. A board that updates faster than it can be read is a
 * transition; one that takes its time is a mechanism, and the mechanism is
 * the point. These match the CSS, which cannot read them.
 */
export const TURN_MS = 420;
/**
 * Cell to cell. Set so the wave takes as long as the courier's crossing
 * (TRAVEL_MS in NetworkWeb): the first flap turns as it leaves and the last
 * lands as it arrives, so the board is announcing the delivery in the air
 * rather than reporting one already made. 29 x 100 + 420 is 3320ms against a
 * 3400ms crossing.
 */
export const STAGGER_MS = 100;

/**
 * A split-flap board, the kind an airport concourse and an Indian railway
 * platform used to run.
 *
 * It replaces the pill that used to sit above the statement. The pill named
 * the site, which the lockup in the corner and the browser tab already did,
 * so it spent the best position on the page repeating something and told a
 * first time visitor nothing about what ABDM is for.
 *
 * The flap is not decoration borrowed from a station. A departure board is a
 * list of things in transit between places, which is the claim underneath
 * ABDM, and this one sits over a drawing of the network doing it.
 *
 * Every cell holds two faces, because that is what a Solari cell does and
 * because of what happens when it does not. The first version dropped
 * straight to the new character from nothing, so a cell that had not turned
 * yet was blank, and a still frame taken part way through a turn read as
 * truncated text rather than as a board in motion. Here the outgoing
 * character stays put until its own flap falls: freeze the board at any
 * moment and every cell is showing a real character, some of them the
 * message that is leaving.
 */

/** One cell: the character on its way out, and the one coming in behind it. */
function Cell({
  from,
  to,
  delay,
  still,
}: {
  from: string;
  to: string;
  delay: number;
  still: boolean;
}) {
  const blank = (char: string) => (char === ' ' ? '' : char);
  if (still || from === to) {
    return (
      <span className="flap__cell">
        <span className="flap__face">{blank(to)}</span>
      </span>
    );
  }
  return (
    <span className="flap__cell" style={{animationDelay: `${delay}ms`}}>
      {/* Falls away from the top edge, carrying the old character down. */}
      <span
        className="flap__face flap__face--out"
        style={{animationDelay: `${delay}ms`}}>
        {blank(from)}
      </span>
      {/* Waits flat against the back, then swings up into its place. Half a
          turn behind the one leaving, so the two never overlap. */}
      <span
        className="flap__face flap__face--in"
        style={{animationDelay: `${delay}ms`}}>
        {blank(to)}
      </span>
    </span>
  );
}

/** Pads a message out to the board's width, centred, in capitals. */
function laid(text: string, cells: number) {
  const room = Math.max(0, cells - text.length);
  return `${' '.repeat(Math.floor(room / 2))}${text}`
    .padEnd(cells, ' ')
    .slice(0, cells)
    .toUpperCase();
}

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
  const target = laid(text, cells);
  // What the board is showing right now, and what it is turning away from.
  // Held in state rather than derived, because the outgoing face has to
  // survive the render that introduces the incoming one.
  const [{from, to}, setFaces] = useState({from: target, to: target});

  useEffect(() => {
    setFaces((prior) => (prior.to === target ? prior : {from: prior.to, to: target}));
  }, [target]);

  return (
    <span className="flap" data-still={still ? 'true' : undefined}>
      {/* The flaps are for looking at. What a screen reader gets is the one
          name that does not change, because a row of cells that turns over
          every few seconds is a live region nobody wants announced. */}
      <span className="flap__row" aria-hidden="true">
        {to.split('').map((char, index) => (
          <Cell
            // The pair being turned is in the key, so a new message is a new
            // element and the CSS animation runs again from the top. Keyed on
            // the index alone, React updates the character in place and the
            // flap never turns after the first paint, which is what it did.
            key={`${index}|${from}|${to}`}
            from={from[index] ?? ' '}
            to={char}
            delay={index * STAGGER_MS}
            still={Boolean(still)}
          />
        ))}
      </span>
      <span className="flap__label">ABDM Developer Portal</span>
    </span>
  );
}
