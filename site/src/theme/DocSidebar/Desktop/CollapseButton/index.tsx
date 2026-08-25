import React from 'react';
import {PanelLeftClose} from 'lucide-react';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/DocSidebar/Desktop/CollapseButton';

/**
 * The control that folds the tree away.
 *
 * The classic theme renders this as a full width strip across the foot of the
 * sidebar, and leaves a full height rail behind when the tree is hidden. Both
 * read as furniture rather than as a control. This is a small icon button that
 * sits with the pickers at the top, where the reader's eye already is, and it
 * stays quiet until hovered.
 */
export default function CollapseButton({onClick}: Props): React.ReactNode {
  const label = translate({
    id: 'theme.docs.sidebar.collapseButtonTitle',
    message: 'Collapse sidebar',
    description: 'The title attribute for collapse button of doc sidebar',
  });
  return (
    <button
      type="button"
      className="sidebar-fold"
      title={label}
      aria-label={label}
      onClick={onClick}>
      <PanelLeftClose className="size-4" aria-hidden="true" />
    </button>
  );
}
