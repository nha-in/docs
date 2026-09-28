import React from 'react';
import LineArt from './LineArt';
import drawing from './uhi-services-art.json';

/**
 * Two hands holding a phone, for the UHI Get started page.
 *
 * One-line art: the phone's app shows "Find a service" over a list of the six
 * UHI services, each with its icon: Physical Consultation, PM-JAY HEM, Blood
 * Bank, Ambulance Booking, Jan Aushadhi and NOTTO. The drawing was supplied
 * as a raster image by the maintainers on 29 September 2026. Its rows were
 * then edited to the six live services before tracing: existing icons and
 * labels moved into their new rows along the screen's slant, the new labels
 * set in a matching sans, and NOTTO's heart drawn in the same stroke. The
 * right thumb covers the end of "Ambulance Booking", as it covered the end of
 * that row in the drawing as supplied. The edited image was cropped to the
 * drawing, scaled to 1024 high and traced with potrace into `art`
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
      label="Line drawing of two hands holding a phone whose app lists the six UHI services: Physical Consultation, PM-JAY HEM, Blood Bank, Ambulance Booking, Jan Aushadhi and NOTTO."
      storageKey="abdm:uhi-services-art-seen"
      maskId="uhi-services-art-pen"
    />
  );
}
