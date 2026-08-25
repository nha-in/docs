import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import {Check, ChevronDown, Languages} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';
import {
  activePlatform,
  activeTab,
  isLanding,
  platforms,
  useRoutePath,
} from '@site/src/config/navigation';
import {useHistory} from '@docusaurus/router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@site/src/components/ui/tooltip';
import MobileNav from './MobileNav';
import Omnibox from './Omnibox';

/** External destinations shown in the bar. Not routes, so not in navigation.ts. */
const SANDBOX_URL = 'https://sandbox.abdm.gov.in';
const GITHUB_URL = 'https://github.com/nha-in';

/**
 * The sandbox: an open isometric tray with a code caret sitting in it, drawn
 * here rather than taken from an icon set because no set carries this shape.
 * The rim is deliberately wide and the caret oversized: at this size the tray
 * is barely a dozen device pixels tall, and thinner proportions close up into
 * a blob.
 *
 * The viewBox is cropped to the artwork rather than left square, so the tray
 * carries the same visual weight as the repository mark beside it. A square
 * box would have padded a wide flat shape with empty space and drawn it small.
 */
function SandboxMark() {
  return (
    <svg
      viewBox="1 1.8 22 16"
      width="26"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      {/* the open top, the two walls, then the caret on the floor */}
      <path d="M12 2.2 22.4 8.2 12 14.2 1.6 8.2Z" />
      <path d="M1.6 8.2v3.1L12 17.3l10.4-6V8.2" />
      <path d="M9.2 6.4 6.4 8.2l2.8 1.8M14.8 6.4l2.8 1.8-2.8 1.8M13.4 5.3l-2.8 6" />
    </svg>
  );
}

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
        <Languages className="size-4" aria-hidden="true" />
        English
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
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

/**
 * The gateway a reader is working in, at the head of the bar. It used to sit
 * at the top of the sidebar, where it only appeared inside the API references
 * tab; the gateway is the first choice a reader makes and it governs every
 * tab, so it belongs in the chrome, in the slot the locale control was
 * occupying.
 */
function GatewayMenu() {
  const pathname = useRoutePath();
  const history = useHistory();
  const current = activePlatform(pathname) ?? platforms[0];
  // Send an API reader to the next gateway's contract, everyone else to its
  // overview, so switching keeps the reader where they already were.
  const inApiTab = activeTab(pathname)?.id === 'api';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="topbar-action topbar-gateway"
        aria-label={`Gateway: ${current.label}`}>
        {current.label}
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Gateway</DropdownMenuLabel>
        {platforms.map((entry) => (
          <DropdownMenuItem
            key={entry.id}
            className="sidebar-picker__option"
            onSelect={() => history.push(inApiTab ? entry.apiTo : entry.to)}>
            <span className="sidebar-picker__option-main">
              <span className="sidebar-picker__option-label">{entry.label}</span>
              <span className="sidebar-picker__option-note">
                {entry.description}
              </span>
            </span>
            {entry.id === current.id ? (
              <Check className="size-4 shrink-0" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * The landing page's own bar: the two official marks on the left, the colour
 * mode control on the right, and nothing else. The ways into the documentation
 * sit under the call to action, where a reader is already looking.
 */
function LandingBar() {
  return (
    <nav className="navbar landing-bar" aria-label="Site">
      <div className="landing-bar__marks">
        <ThemedImage
          className="landing-bar__mark"
          sources={{
            light: useBaseUrl('img/nha-logo.svg'),
            dark: useBaseUrl('img/nha-logo-dark.svg'),
          }}
          alt="National Health Authority"
        />
        <ThemedImage
          className="landing-bar__mark"
          sources={{
            light: useBaseUrl('img/logo.svg'),
            dark: useBaseUrl('img/logo-dark.svg'),
          }}
          alt="Ayushman Bharat Digital Mission"
        />
      </div>
      <NavbarColorModeToggle className="topbar-toggle" />
    </nav>
  );
}

export default function TopBar() {
  const pathname = useRoutePath();
  if (isLanding(pathname)) {
    return <LandingBar />;
  }

  return (
    <nav className="navbar navbar--fixed-top topbar" aria-label="Site">
      {/* The wordmark is hidden under 576px, so the name is on the link itself:
          without it the brand link is an empty decorative image on a phone. */}
      <Link to="/" className="topbar-brand" aria-label="ABDM Developer Portal">
        {/* The authority that runs the network, not the mission's mark: the
            bar names the publisher, the landing page shows both. */}
        <ThemedImage
          className="topbar-logo"
          sources={{
            light: useBaseUrl('img/nha-logo.svg'),
            dark: useBaseUrl('img/nha-logo-dark.svg'),
          }}
          alt=""
        />
        <span className="topbar-wordmark">ABDM Developer Portal</span>
      </Link>

      <GatewayMenu />

      {/* Search and the assistant, as one control, in the middle of the bar. */}
      <div className="topbar-center">
        <Omnibox />
      </div>

      <div className="topbar-actions">
        {/* The sandbox is a place you go to try calls, so it is a mark rather
            than two words of prose. */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className="topbar-action topbar-action--icon"
                href={SANDBOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ABDM sandbox">
                <SandboxMark />
              </a>
            </TooltipTrigger>
            <TooltipContent>ABDM sandbox</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <a
          className="topbar-action topbar-action--icon"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository">
          <GitHubMark />
        </a>
        <LocaleMenu />
      </div>

      <MobileNav />

      <NavbarColorModeToggle className="topbar-toggle" />
    </nav>
  );
}
