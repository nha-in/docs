import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';
import SidebarPickers from '@site/src/components/chrome/SidebarPickers';
import SidebarResizer from '@site/src/components/chrome/SidebarResizer';
import {useRoleScopedSidebar} from '@site/src/config/useRoleScopedSidebar';
import {isApiRoute} from '@site/src/config/navigation';

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

  // The role picker belongs on both sidebars: it is a property of the
  // reader, and the docs tree is scoped by it too. The version belongs to
  // the API reference alone, the way it does on the reference sites this
  // follows, because a version is a property of the contract you are
  // calling rather than of the guides that explain it. Sidebars split on
  // the api/ and reference/ folders (site/sidebars.ts), and `path` is the
  // doc's own route, so the folder segment says which sidebar this is.
  // Shared with the tab strip, so a page cannot light one tab while its
  // sidebar behaves like the other. See isApiRoute in config/navigation.
  const onApiSidebar = isApiRoute(path);

  return (
    <div className={clsx('docs-sidebar', isHidden && 'docs-sidebar--hidden')}>
      <div className="docs-sidebar__head">
        <SidebarPickers showVersion={onApiSidebar} />
        {hideable && <CollapseButton onClick={onCollapse} />}
      </div>
      <Content path={path} sidebar={scoped} />
      <SidebarResizer />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
