import React from 'react';
import drawing from './abha-card-art.json';

/**
 * A hand holding an ABHA card, for the "What is ABDM?" section of Get started.
 *
 * One-line art: a hand coming in from the right holds the card by its corner,
 * with the card's placeholder details drawn inside it. The drawing was
 * generated as an original raster image by the maintainers on 25 September
 * 2026 and traced with potrace into `art` (abha-card-art.json), one even-odd
 * path as potrace drew it.
 *
 * `pen` is the line's centre, found by thinning the same image to a skeleton
 * and walking it as a pen would: in from the right-hand baseline, up the back
 * of the hand, through the fingers and thumb, round the card and down the
 * wrist, then the left baseline, then the card's details nearest first. Each
 * stroke carries when it starts and how long it takes. The strokes are a mask
 * over `art`, so the drawing appears exactly where and when the pen passes
 * (mdx.css): slowly for the line, quicker for the details. Reduced motion
 * gets it finished.
 *
 * `currentColor`, so it follows light and dark mode. Every value on the card
 * is a placeholder, the QR pattern encodes nothing, and there is no emblem or
 * NHA mark: the emblem's use is restricted by law, and a drawing of an ID card
 * must not pass for one.
 */
// When the pen lifts for the last time. Marks too small to leave a stroke of
// their own, the dot of an i, are shown by a whole-frame reveal at this point.
const PEN_DONE = Math.max(...drawing.pen.map((stroke) => stroke.delay + stroke.dur));

export default function AbhaCardArt(): React.ReactNode {
  return (
    <figure className="abha-art">
      <svg
        viewBox="0 0 1024 814"
        role="img"
        aria-label="Line drawing of a hand holding an ABHA card, showing a photo, a name, an ABHA number, an ABHA address and a QR code, all placeholders.">
        <defs>
          <mask id="abha-art-pen" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="814">
            <g className="abha-art__pen">
              {drawing.pen.map((stroke, index) => (
                <path
                  key={index}
                  d={stroke.d}
                  pathLength={1}
                  style={
                    {
                      '--delay': `${stroke.delay}s`,
                      '--dur': `${stroke.dur}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </g>
            <rect
              className="abha-art__pen-done"
              width="1024"
              height="814"
              style={{'--delay': `${PEN_DONE}s`} as React.CSSProperties}
            />
          </mask>
        </defs>
        <path
          className="abha-art__ink"
          fillRule="evenodd"
          mask="url(#abha-art-pen)"
          d={drawing.art}
        />
      </svg>
    </figure>
  );
}
