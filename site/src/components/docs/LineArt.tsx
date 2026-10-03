import React from 'react';

/**
 * A one-line drawing that a pen draws in, for a Get started page.
 *
 * `drawing.art` is the drawing itself: a raster traced with potrace into one
 * even-odd path, as potrace drew it. `drawing.pen` is the line's centre,
 * found by thinning the same image to a skeleton and walking it as a pen
 * would. Each stroke carries when it starts and how long it takes. The
 * strokes are a mask over `art`, so the drawing appears exactly where and
 * when the pen passes (mdx.css).
 *
 * It plays on every page load. Reduced motion gets it finished (mdx.css).
 *
 * `maskId` must be unique on the page. `currentColor`, so it follows light
 * and dark mode.
 */
export type Drawing = {
  art: string;
  pen: {d: string; delay: number; dur: number}[];
};

type Props = {
  drawing: Drawing;
  width: number;
  height: number;
  label: string;
  maskId: string;
};

export default function LineArt({
  drawing,
  width,
  height,
  label,
  maskId,
}: Props): React.ReactNode {
  // When the pen lifts for the last time. Marks too small to leave a stroke
  // of their own, the dot of an i, are shown by a whole-frame reveal here.
  const penDone = Math.max(...drawing.pen.map((stroke) => stroke.delay + stroke.dur));

  return (
    <figure className="abha-art abha-art--play">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
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
              width={width}
              height={height}
              style={{'--delay': `${penDone}s`} as React.CSSProperties}
            />
          </mask>
        </defs>
        <path
          className="abha-art__ink"
          fillRule="evenodd"
          mask={`url(#${maskId})`}
          d={drawing.art}
        />
      </svg>
    </figure>
  );
}
