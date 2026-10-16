import React from 'react';
import LineArt from './LineArt';
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
 * stroke carries when it starts and how long it takes, scaled so the pen is
 * done at 5.6 seconds: slower for the line, quicker for the details.
 * LineArt.tsx draws it on every page load.
 *
 * Every value on the card is a placeholder, the QR pattern encodes nothing,
 * and there is no emblem or NHA mark: the emblem's use is restricted by law,
 * and a drawing of an ID card must not pass for one.
 */
export default function AbhaCardArt(): React.ReactNode {
  return (
    <LineArt
      drawing={drawing}
      width={1024}
      height={814}
      label="Line drawing of a hand holding an ABHA card, showing a photo, a name, an ABHA number, an ABHA address and a QR code, all placeholders."
      maskId="abha-art-pen"
    />
  );
}
