import React from 'react';
import {Sun} from 'lucide-react';

/**
 * The three colour mode icons are swizzled together so the toggle matches the
 * rest of the chrome: lucide's stroked marks at the same 1.5 weight every
 * other control uses, rather than the theme's heavier filled glyphs.
 *
 * Only the icons are replaced. The toggle's own logic, its three-state cycle
 * and the `data-theme-choice` rules that decide which of the three is visible
 * before React hydrates, are all left alone.
 */
export default function IconLightMode(
  props: React.ComponentProps<'svg'>,
): React.ReactNode {
  return <Sun strokeWidth={1.5} {...props} />;
}
