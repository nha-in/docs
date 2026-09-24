import React from 'react';

/**
 * A hand holding an ABHA card, for the "What is ABDM?" section of Get started.
 *
 * The hand and the card's outline are one continuous line, in the manner of a
 * one-line drawing: in along a baseline, up the palm, the curled fingers,
 * round the card from the corner the hand pinches, the thumb over that
 * corner, down the back of the hand and out along a second baseline. The
 * card's contents, the photo, the name and numbers and the QR pattern, are
 * drawn precisely inside it. The line draws itself once when the page loads
 * and the contents settle in after (mdx.css); reduced motion gets it finished.
 *
 * The card is turned 12 degrees about (175, 110); its corners in LINE are
 * that rotation worked out, and its contents sit in a group with the same
 * rotation. `currentColor` and no fill colour, so it follows light and dark
 * mode. Every value is a placeholder, the QR pattern encodes nothing, and
 * there is no emblem or NHA mark: the emblem's use is restricted by law, and
 * a drawing of an ID card must not pass for one.
 */
const LINE = [
  // In along the baseline and up the heel of the palm.
  'M -4 316 L 318 316 C 326 316 330 308 326 300',
  // Four curled fingers, little finger first, each out to its tip and back.
  'C 308 306 286 310 272 310 C 260 310 258 298 270 297 C 290 295 306 292 320 287',
  'C 300 287 274 290 252 292 C 238 293 237 280 250 278 C 276 275 300 270 320 265',
  'C 298 265 264 268 244 270 C 230 271 229 258 242 256 C 270 252 300 248 318 243',
  // The index finger, its tip at the card's corner.
  'C 302 240 282 238 268 234 C 254 230 256 214 270.5 209',
  // Round the card from that corner and back to it.
  'L 47.5 161.6 Q 36.7 159.3 39 148.5 L 66.4 19.5 Q 68.7 8.7 79.5 11',
  'L 302.5 58.4 Q 313.3 60.7 311 71.5 L 283.6 200.5',
  // The thumb over the corner, the back of the hand, out along the baseline.
  'C 280 192 266 186 258 192 C 250 199 258 212 272 211',
  'C 292 210 318 216 342 230 C 370 246 404 272 430 290 C 438 295 446 298 458 298 L 494 298',
].join(' ');

// Filled cells of a 10 by 10 grid, outside the three finder squares. Chosen by
// hand to read as a QR code at a glance, not generated from any payload.
const QR_CELLS: [number, number][] = [
  [4, 0], [5, 1], [4, 2], [6, 2], [5, 3], [4, 4], [6, 4], [8, 4], [0, 4],
  [2, 4], [1, 5], [3, 5], [5, 5], [7, 5], [9, 5], [4, 6], [6, 6], [9, 6],
  [4, 7], [5, 8], [7, 7], [8, 8], [6, 9], [9, 9], [4, 9], [7, 9],
];

const QR = {x: 250, y: 84, cell: 5};

function Finder({col, row}: {col: number; row: number}) {
  const x = QR.x + col * QR.cell;
  const y = QR.y + row * QR.cell;
  return (
    <>
      <rect x={x + 0.75} y={y + 0.75} width={13.5} height={13.5} rx="1.5" />
      <rect x={x + 4.5} y={y + 4.5} width={6} height={6} className="abha-art__ink" stroke="none" />
    </>
  );
}

export default function AbhaCardArt(): React.ReactNode {
  return (
    <figure className="abha-art">
      <svg
        viewBox="-2 2 494 320"
        role="img"
        aria-label="Line drawing of a hand holding an ABHA card, showing a photo, a name, an ABHA number, an ABHA address and a QR code, all placeholders."
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round">
        <defs>
          <clipPath id="abha-art-photo">
            <circle cx="104" cy="112" r="22" />
          </clipPath>
        </defs>

        <path className="abha-art__line" pathLength={1} strokeWidth="1.75" d={LINE} />

        {/* The card's contents, laid out in a frame of x 65 to 315, y 35 to
            189, moved onto the card (x 50 to 300, y 33 to 187) and turned
            with it. */}
        <g
          className="abha-art__details"
          strokeWidth="1.25"
          transform="rotate(12 175 110) translate(-15 -2)">
          <line x1="65" y1="64" x2="315" y2="64" />
          <path className="abha-art__faint" d="M 172 35 L 188 64 L 204 35 L 220 64 L 236 35 L 252 64 L 268 35" />
          <text x="80" y="55" className="abha-art__brand">ABHA</text>

          <circle cx="104" cy="112" r="22" />
          <g clipPath="url(#abha-art-photo)">
            <path d="M 76 138 C 80 124 91 119 104 119 C 117 119 128 124 132 138" />
          </g>
          <circle cx="104" cy="104" r="8" />
          <circle cx="100.4" cy="105" r="2.6" strokeWidth="1" />
          <circle cx="107.6" cy="105" r="2.6" strokeWidth="1" />
          <line x1="103" y1="105" x2="105" y2="105" strokeWidth="1" />

          <text x="140" y="104" className="abha-art__name">Full Name</text>
          <text x="140" y="120" className="abha-art__label">ABHA Number</text>
          <text x="140" y="131" className="abha-art__value">91-XXXX-XXXX-XXXX</text>
          <text x="140" y="146" className="abha-art__label">ABHA Address</text>
          <text x="140" y="157" className="abha-art__value">name@abdm</text>

          <Finder col={0} row={0} />
          <Finder col={7} row={0} />
          <Finder col={0} row={7} />
          {QR_CELLS.map(([col, row]) => (
            <rect
              key={`${col}-${row}`}
              x={QR.x + col * QR.cell + 0.6}
              y={QR.y + row * QR.cell + 0.6}
              width={QR.cell - 1.2}
              height={QR.cell - 1.2}
              stroke="none"
              className="abha-art__ink"
            />
          ))}
        </g>
      </svg>
    </figure>
  );
}
