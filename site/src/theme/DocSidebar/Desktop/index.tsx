import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';
import SidebarPickers from '@site/src/components/chrome/SidebarPickers';
import SidebarResizer from '@site/src/components/chrome/SidebarResizer';
import {useRoleScopedSidebar} from '@site/src/config/useRoleScopedSidebar';

/**
 * The desktop sidebar, with the gateway and version pickers above the tree.
 * Everything below the pickers is the classic theme's own Content, so item
 * rendering, collapsing and the active state stay Docusaurus behaviour.
 *
 * The classic component's CSS module is replaced by `.docs-sidebar` in
 * sidebar.css rather than imported, because a hashed module class from
 * node_modules is not a stable thing to depend on. The logo branch is gone
 * with it: it only renders when the navbar hides on scroll, and this navbar
 * does not.
 */
function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  // The tree is scoped to the reader's chosen role before the classic theme
  // renders it, so item rendering, collapsing and the active state stay
  // Docusaurus behaviour on a smaller list.
  const scoped = useRoleScopedSidebar(sidebar);

  // The version and role picker only makes sense once a reader knows which
  // API they are calling. On the overview sidebar, where they are assumed
  // not to know their role yet, it is out of place. Sidebars split on the
  // api/ and reference/ folders (site/sidebars.ts), and `path` is the doc's
  // own route, so the folder segment says which sidebar this is.
  const onApiSidebar = /\/(api|reference)\//.test(path);

  return (
    <div className={clsx('docs-sidebar', isHidden && 'docs-sidebar--hidden')}>
      <div className="docs-sidebar__head">
        {onApiSidebar && <SidebarPickers />}
        {hideable && <CollapseButton onClick={onCollapse} />}
      </div>
      <Content path={path} sidebar={scoped} />
      <SidebarResizer />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
