import React from 'react';
import {createPortal} from 'react-dom';
import {PanelLeftOpen} from 'lucide-react';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/DocRoot/Layout/Sidebar/ExpandButton';

/**
 * The control that brings the tree back.
 *
 * The classic theme leaves a full height clickable rail behind, which reads as
 * a second column rather than as a control. This is the same small icon button
 * as the fold control, so the tree closes and opens from one kind of thing.
 * A real <button> rather than the theme's div with role="button": that div
 * fires the toggle on any keydown, Tab included.
 *
 * This component is rendered inside the <aside>, which the theme's own CSS
 * module clips with `clip-path: inset(0)`. `position: fixed` does not escape
 * that: a clip-path still clips its whole subtree, fixed descendants included,
 * because they remain part of the same paint tree even though their geometry
 * is computed against the viewport. With the aside collapsed to zero width
 * that clip region has zero area, so a fixed button left inside it renders
 * nowhere. A portal is the actual fix, not just a positioning scheme: it
 * makes the button a child of <body> in the DOM, outside the clipped
 * subtree entirely, so nothing about the aside's box can clip it.
 */
export default function ExpandButton({toggleSidebar}: Props): React.ReactNode {
  const label = translate({
    id: 'theme.docs.sidebar.expandButtonTitle',
    message: 'Expand sidebar',
    description:
      'The ARIA label and title attribute for expand button of doc sidebar',
  });
  if (typeof document === 'undefined') {
    return null;
  }
  return createPortal(
    <button
      type="button"
      className="sidebar-unfold"
      title={label}
      aria-label={label}
      onClick={toggleSidebar}>
      <PanelLeftOpen className="size-4" aria-hidden="true" />
    </button>,
    document.body,
  );
}
