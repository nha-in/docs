import React from 'react';
import LineArt from './LineArt';
import drawing from './uhi-services-art.json';

/**
 * Two hands holding a phone, for the UHI Get started page.
 *
 * One-line art: the phone's app shows "Find a service" over a list of the six
 * UHI services, each with its icon: Physical Consultation, PM-JAY HEM,
 * NOTTO, Blood Bank, Ambulance Booking and Jan Aushadhi. The drawing was
 * supplied as a raster image by the maintainers on 29 September 2026. Its
 * rows were edited to the six live services before tracing. Rows that
 * already held a live service stay where the artist drew them. PM-JAY HEM
 * takes the Diagnostics row with the building icon from Jan Aushadhi, NOTTO
 * takes the Pharmacy row with a heart drawn in the same stroke, and both
 * labels are set in a matching sans on the screen's slant. Jan Aushadhi
 * takes the pill from Pharmacy, and "More services" is gone with its
 * divider. The edited image was cropped to the drawing, scaled to 1024 high
 * and traced with potrace into `art`
 * (uhi-services-art.json), one even-odd path as potrace drew it. The row
 * dividers, too faint to survive the threshold, were redrawn along their own
 * lines as thin rules.
 *
 * `pen` is the line's centre, found by thinning the same image to a skeleton
 * and walking it as a pen would: the phone's outline first, then the left
 * hand from the wrist, then the right hand, then the screen top to bottom:
 * the search bar, and each row's icon, label and divider. Each stroke carries
 * when it starts and how long it takes, scaled so the pen is done at 5.6
 * seconds: slower for the line, quicker for the details. LineArt.tsx draws it
 * once per visitor.
 *
 * The screen is illustrative: the list shows what a UHI app can offer, not
 * any real app, and the drawing carries no NHA mark or app branding.
 */
export default function UhiServicesArt(): React.ReactNode {
  return (
    <LineArt
      drawing={drawing}
      width={975}
      height={1024}
      label="Line drawing of two hands holding a phone whose app lists the six UHI services: Physical Consultation, PM-JAY HEM, NOTTO, Blood Bank, Ambulance Booking and Jan Aushadhi."
      storageKey="abdm:uhi-services-art-seen"
      maskId="uhi-services-art-pen"
    />
  );
}
