import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import {Menu} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@site/src/components/ui/sheet';
import {
  activeTab,
  tabHref,
  tabs,
  useRoutePath,
} from '@site/src/config/navigation';
import SidebarPickers from './SidebarPickers';

/**
 * The under-996px menu: the four tabs, then the current tab's doc sidebar.
 *
 * The sidebar cannot be read here with `useDocsSidebar()`. `DocsSidebarProvider`
 * is mounted by `@theme/DocRoot`, which sits *inside* `@theme/Layout`, so the
 * navbar renders above it and the hook would throw `ReactContextError`. The
 * secondary-menu channel is how Docusaurus itself moves the sidebar up into the
 * navbar: `@theme/DocSidebar/Mobile` fills it from inside the provider whenever
 * the window is mobile-sized, and `content` is undefined on every non-doc page,
 * which is the "tabs only" case.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRoutePath();
  const current = activeTab(pathname);
  const sidebar = useNavbarSecondaryMenu().content;
  const mobileSidebar = useNavbarMobileSidebar();

  // `DocSidebarItems` closes the menu by calling `mobileSidebar.toggle()`, and
  // it does so only for the items that navigate, not for a category the reader
  // merely expanded. Nothing else here reads that flag, and left set it mounts
  // a history-pop blocker that swallows the next Back press, so mirror it into
  // this sheet and put it back.
  useEffect(() => {
    if (mobileSidebar.shown) {
      mobileSidebar.toggle();
      setOpen(false);
    }
  }, [mobileSidebar.shown, mobileSidebar.toggle]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="topbar-action topbar-action--icon topbar-menu"
        aria-label="Open navigation">
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent side="left" aria-describedby={undefined}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>

        <div className="mobile-nav-body">
          <nav aria-label="Sections">
            <p className="mobile-nav-section">Sections</p>
            <ul className="mobile-nav-tabs">
              {tabs.map((tab) => {
                const isActive = tab === current;
                return (
                  <li key={tab.to}>
                    <SheetClose asChild>
                      <Link
                        to={tabHref(tab, pathname)}
                        className={cn('mobile-nav-tab', isActive && 'mobile-nav-tab--active')}
                        aria-current={isActive ? 'page' : undefined}>
                        {tab.label}
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </nav>

          {sidebar ? (
            <nav aria-label={current ? `${current.label} pages` : 'Pages'}>
              <p className="mobile-nav-section">Gateway</p>
              <SidebarPickers />
              <div className="mobile-nav-sidebar">{sidebar}</div>
            </nav>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
