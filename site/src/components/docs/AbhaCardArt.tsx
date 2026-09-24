import React from 'react';

/**
 * A hand holding an ABHA card, drawn as one continuous line, for the "What is
 * ABDM?" section of Get started.
 *
 * The pen starts at the wrist, rounds the card and its header, runs through a
 * code block, a signature and two lines of detail, circles the photo, draws
 * the thumb over the card and leaves by the palm. It draws itself once when
 * the page loads (mdx.css); a reader who asks for reduced motion gets it
 * finished. `currentColor` and no fill, so it follows light and dark mode.
 *
 * Every mark on the card is a placeholder. It carries no emblem and no NHA
 * mark: the emblem's use is restricted by law, and a drawing of an ID card
 * must not pass for one.
 */
const LINE = [
  // Up the back of the hand, and the index finger in behind the card.
  'M 6 296 C 24 244 52 190 84 150 C 96 134 110 112 126 100 C 136 94 146 92 156 92',
  // The card, all the way round, back to just under the finger.
  'L 153 52 Q 152 38 166 37 L 388 25 Q 402 24 403 38 L 411 158 Q 412 172 398 173',
  'L 176 187 Q 162 188 161 176 L 157 104',
  // Out under the finger, down the knuckles, to the thumb's root.
  'C 146 106 134 108 128 114 C 116 118 114 130 126 134 C 118 138 116 150 128 154',
  'C 122 160 120 170 128 176',
  // The thumb over the card, and from its tip out into the photo.
  'C 150 168 176 160 200 156 C 212 150 226 136 240 128',
  'A 22 22 0 0 0 240 84 A 22 22 0 0 0 221 117',
  'C 225 112 230 110 234 112 C 235 110 236 108 236 106 A 7 7 0 1 1 244 106',
  'C 244 108 245 110 246 112 C 250 110 256 112 259 117',
  // A signature for the name, then the code block.
  'C 266 112 270 96 276 90',
  'c 6 0 8 -10 4 -10 c -4 0 -2 10 6 10 c 6 0 8 -10 4 -10 c -4 0 -2 10 6 10',
  'c 6 0 8 -10 4 -10 c -4 0 -2 10 6 10 c 6 0 8 -10 4 -10 c -4 0 -2 10 6 10',
  'C 324 90 326 78 330 78 L 330 118 L 338 118 L 338 86 L 346 86 L 346 110',
  'L 354 110 L 354 78 L 362 78 L 362 122 L 370 122 L 370 94',
  // Back along a line of detail, under the photo, to the thumb's tip.
  'C 372 136 364 140 352 140 c -8 3 -16 -3 -24 0 c -8 3 -16 -3 -24 0 c -8 3 -16 -3 -24 0',
  'C 266 142 252 150 236 150 C 224 150 214 148 208 150 C 214 152 214 162 206 164',
  // Back along the thumb, down the palm and away by the wrist.
  'C 186 170 160 180 140 188 C 124 196 110 226 100 260 C 96 274 94 286 92 296',
].join(' ');

export default function AbhaCardArt(): React.ReactNode {
  return (
    <figure className="abha-art">
      <svg
        viewBox="0 14 420 272"
        role="img"
        aria-label="A single line drawing of a hand holding an ABHA card, with a photo, a signature, two lines of detail and a code block."
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path className="abha-art__line" pathLength={1} d={LINE} />
        <text x="176" y="62" className="abha-art__brand">
          ABHA
        </text>
      </svg>
    </figure>
  );
}
