import React from 'react';

/**
 * A hand holding an ABHA card, drawn in one line weight, for the "What is
 * ABDM?" section of Get started.
 *
 * The hand is loose and the card is exact: the person is the sketch, the
 * identity is the precise thing. Everything is `currentColor` on the page's
 * own background, so it follows light and dark mode with no second palette.
 * The background fill is what hides the card behind the thumb and the hand
 * behind the card.
 *
 * Every value on the card is a placeholder and the QR pattern encodes
 * nothing. It carries no emblem and no NHA mark: the emblem's use is
 * restricted by law, and a drawing of an ID card must not pass for one.
 */

// Filled cells of a 10 by 10 grid, outside the three finder squares. Chosen by
// hand to read as a QR code at a glance, not generated from any payload.
const QR_CELLS: [number, number][] = [
  [4, 0], [5, 1], [4, 2], [6, 2], [5, 3], [4, 4], [6, 4], [8, 4], [0, 4],
  [2, 4], [1, 5], [3, 5], [5, 5], [7, 5], [9, 5], [4, 6], [6, 6], [9, 6],
  [4, 7], [5, 8], [7, 7], [8, 8], [6, 9], [9, 9], [4, 9], [7, 9],
];

const QR = {x: 340, y: 90, cell: 5};

function Finder({col, row}: {col: number; row: number}) {
  const x = QR.x + col * QR.cell;
  const y = QR.y + row * QR.cell;
  return (
    <>
      <rect x={x + 0.9} y={y + 0.9} width={QR.cell * 3 - 1.8} height={QR.cell * 3 - 1.8} rx="1.5" />
      <rect x={x + 4.5} y={y + 4.5} width={QR.cell * 3 - 9} height={QR.cell * 3 - 9} className="abha-art__ink" />
    </>
  );
}

export default function AbhaCardArt(): React.ReactNode {
  return (
    <figure className="abha-art">
      <svg
        viewBox="0 0 420 270"
        role="img"
        aria-label="Line drawing of a hand holding an ABHA card, showing a photo, a name, an ABHA number, an ABHA address and a QR code, all placeholders."
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round">
        <defs>
          <clipPath id="abha-art-photo">
            <circle cx="180" cy="134" r="28" />
          </clipPath>
        </defs>

        {/* The ground the card floats over. */}
        <ellipse cx="262" cy="250" rx="118" ry="5" className="abha-art__faint" />

        {/* The hand behind the card: palm, the backs of the fingers, a cuff. */}
        <path
          className="abha-art__paper"
          stroke="none"
          d="M-10 150 C30 127 66 103 108 96 L152 96 L152 200 C141 223 108 238 72 290 L-10 290 Z"
        />
        <path d="M-10 150 C30 127 66 103 108 96" />
        <path d="M152 202 C140 224 108 238 72 290" />
        <path d="M58 116 C70 121 84 123 99 121" />
        <path d="M44 139 C58 145 76 148 99 147" />
        <path d="M38 164 C54 170 74 173 99 174" />
        <path d="M14 146 C27 190 40 238 55 288" />

        {/* The card: exact, and tilted a few degrees in the hand. */}
        <g transform="rotate(-4 250 122)">
          <rect x="100" y="36" width="300" height="172" rx="12" className="abha-art__paper" />
          <line x1="100" y1="72" x2="400" y2="72" />
          <path d="M232 36 L250 72 L268 36 L286 72 L304 36 L322 72 L340 36" className="abha-art__faint" />
          <text x="118" y="60" className="abha-art__brand">ABHA</text>

          <circle cx="180" cy="134" r="28" />
          <g clipPath="url(#abha-art-photo)">
            <path d="M148 168 C152 151 165 145 180 145 C195 145 208 151 212 168" />
          </g>
          <circle cx="180" cy="124" r="11" />
          <path d="M169.5 121 C168.5 110 177 106 185 109 C190 111 192 116 190.8 121" />
          <circle cx="175.8" cy="125" r="3.1" strokeWidth="1.25" />
          <circle cx="184.2" cy="125" r="3.1" strokeWidth="1.25" />
          <line x1="178.9" y1="125" x2="181.1" y2="125" strokeWidth="1.25" />

          <text x="224" y="104" className="abha-art__name">Full Name</text>
          <text x="224" y="124" className="abha-art__label">ABHA Number</text>
          <text x="224" y="137" className="abha-art__value">91-XXXX-XXXX-XXXX</text>
          <text x="224" y="156" className="abha-art__label">ABHA Address</text>
          <text x="224" y="169" className="abha-art__value">name@abdm</text>

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

        {/* The thumb, in front of the card. Filled first, then outlined, so
            the outline stays open where the thumb meets the palm. */}
        <path
          className="abha-art__paper"
          stroke="none"
          d="M70 130 C88 120 108 116 126 119 C141 122 146 134 137 141 C124 149 102 152 80 166 Z"
        />
        <path d="M70 130 C88 120 108 116 126 119 C141 122 146 134 137 141 C124 149 102 152 80 166" />
        <path d="M125 124 C132 124 136 129 135 135" />
      </svg>
    </figure>
  );
}
