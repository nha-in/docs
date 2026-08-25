import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import SearchBar from '@theme/SearchBar';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import {ChevronDown, Sparkles} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@site/src/components/ui/dialog';
import {Button} from '@site/src/components/ui/button';
import MobileNav from './MobileNav';

/** External destinations shown in the bar. Not routes, so not in navigation.ts. */
const SANDBOX_URL = 'https://sandbox.abdm.gov.in';
const GITHUB_URL = 'https://github.com/eka-care/abdm-docs';

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * Locale control. The site publishes English only, so the menu records the
 * current locale and says plainly that nothing else is available yet.
 */
function LocaleMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="topbar-action topbar-locale">
        English
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuCheckboxItem checked disabled>
          English
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Other locales are not published yet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** No assistant is wired up, so the button says so and points at Support. */
function AskAiDialog() {
  return (
    <Dialog>
      <DialogTrigger className="topbar-action">
        <Sparkles className="size-4" aria-hidden="true" />
        Ask AI
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal text-heading">
            The assistant is not connected yet
          </DialogTitle>
          <DialogDescription>
            This portal has no question answering assistant behind it today. Nothing
            here can answer a question about ABDM, so the button does not pretend to.
            Until one is connected, the support page lists the channels that a human
            reads.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button asChild variant="outline">
            <Link to="/docs/support">Go to support</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


/**
 * The landing page's own bar: only the colour mode control. The official
 * marks sit in the hero itself, and the ways into the documentation sit
 * under the call to action, where a reader is already looking.
 */
function LandingBar() {
  return (
    <nav className="navbar landing-bar" aria-label="Site">
      <NavbarColorModeToggle className="topbar-toggle" />
    </nav>
  );
}

export default function TopBar() {
  const {pathname} = useLocation();
  if (pathname === '/' || pathname === '/index.html') {
    return <LandingBar />;
  }

  return (
    <nav className="navbar navbar--fixed-top topbar" aria-label="Site">
      {/* The wordmark is hidden under 576px, so the name is on the link itself:
          without it the brand link is an empty decorative image on a phone. */}
      <Link to="/" className="topbar-brand" aria-label="ABDM Developer Portal">
        <ThemedImage
          className="topbar-logo"
          sources={{
            light: useBaseUrl('img/logo.svg'),
            dark: useBaseUrl('img/logo-dark.svg'),
          }}
          alt=""
          width={26}
          height={24}
        />
        <span className="topbar-wordmark">ABDM Developer Portal</span>
      </Link>

      <LocaleMenu />

      {/* Search and the assistant sit together in the middle of the bar, the
          way the reference site pairs them. */}
      <div className="topbar-center">
        <div className="topbar-search">
          <SearchBar />
        </div>
        <AskAiDialog />
      </div>

      <div className="topbar-actions">
        <a className="topbar-action" href={SANDBOX_URL} target="_blank" rel="noopener noreferrer">
          ABDM sandbox
        </a>
        <a
          className="topbar-action topbar-action--icon"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository">
          <GitHubMark />
        </a>
      </div>

      <MobileNav />

      <NavbarColorModeToggle className="topbar-toggle" />
    </nav>
  );
}
