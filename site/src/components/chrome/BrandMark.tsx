import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * The Lion Capital of Ashoka, as a themeable mark rather than an image.
 *
 * Traced from the same 62 paths as the tab favicon, sourced from the National
 * Health Authority lockup already in this repository
 * (site/static/img/nha-logo.svg), not from an external file of unknown
 * provenance.
 *
 * It is applied as a CSS mask, not rendered as an `<img>`, because an `<img>`
 * cannot take `currentColor`: the file has no fill logic of its own, so it
 * follows whatever colour the chip around it is set to, in both themes,
 * without a light and a dark asset to keep in step. The two are deliberately
 * separate files: the favicon carries its own `prefers-color-scheme` rule,
 * because a browser tab has no page to inherit a theme from; this mark has a
 * page, so it inherits.
 */
export default function BrandMark({
  className,
}: {
  className?: string;
}): React.ReactNode {
  const emblem = useBaseUrl('img/ashoka-emblem-mark.svg');
  return (
    <span
      aria-hidden="true"
      className={className ? `brand-chip__mark ${className}` : 'brand-chip__mark'}
      style={{
        WebkitMaskImage: `url("${emblem}")`,
        maskImage: `url("${emblem}")`,
      }}
    />
  );
}
