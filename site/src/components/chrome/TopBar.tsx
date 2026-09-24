import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import {Check, ChevronDown, MoreHorizontal, Sparkles} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';
import {
  activePlatform,
  activeTab,
  isApiSideTab,
  isLanding,
  platforms,
  useRoutePath,
} from '@site/src/config/navigation';
import {sandboxLinks} from '@site/src/data/sandboxLinks';
import {useHistory} from '@docusaurus/router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@site/src/components/ui/tooltip';
import BrandMark from './BrandMark';
import Omnibox from './Omnibox';

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
  const inApiTab = isApiSideTab(activeTab(pathname)?.id);

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
 * The landing page's own bar: the publisher's mark, and nothing else. The ways
 * into the documentation sit under the call to action, where a reader is
 * already looking.
 *
 * It is drawn under the curtain, which covers the viewport on exactly these
 * routes and carries its own bar. What is left here is what a reader sees if
 * the curtain has not painted yet.
 */
function LandingBar() {
  return (
    <nav className="navbar landing-bar" aria-label="Site">
      {/* One mark, the publisher's. The mission's own logo used to sit beside
          it and read as a second brand on a page that is not the mission's. */}
      <div className="landing-bar__marks">
        <ThemedImage
          className="landing-bar__mark"
          sources={{
            light: useBaseUrl('img/nha-logo.svg'),
            dark: useBaseUrl('img/nha-logo-dark.svg'),
          }}
          alt="National Health Authority"
        />
      </div>
      {/* No colour mode control here. The curtain draws its own bar over this
          one, with its own mark and its own toggle, and it renders on exactly
          the routes this bar does, so a second toggle underneath was two
          controls at the same corner of the screen with only the upper one
          reachable. It was also the one control on the site that never got a
          thumb sized box, because the rule that grew the others is written
          against `.topbar` and this bar is `.landing-bar`.

          The curtain writes the same storage slot through Docusaurus' own
          helper, so the site stays in one state (LandingCurtain explains why
          it cannot use the theme's toggle). */}
    </nav>
  );
}

/**
 * The controls that leave the bar when it gets narrow: the sandbox and the
 * assistant, gathered behind one mark.
 *
 * The Claude Code docs do the same thing with the same control, and the reason
 * is arithmetic rather than taste: below about 1000px the bar cannot hold the
 * brand, the gateway, a field and four more targets without either overlapping
 * or shrinking them under the size a thumb can hit.
 */
function OverflowMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="topbar-action topbar-action--icon topbar-overflow"
        aria-label="More">
        <MoreHorizontal className="size-5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* The assistant's own chip is not drawn at these widths: the bar has
            room for one control in the middle and search is the one a reader
            needs there, so Omnibox passes the element `launcher: none`. That
            left the assistant with no visible way in on a phone at all, since
            the quick actions only appear once the search field is focused and
            empty. It opens the same way every other caller does, through the
            event AskAiBridge listens for, rather than by reaching into the
            element. */}
        <DropdownMenuItem
          onSelect={() =>
            window.dispatchEvent(
              new CustomEvent('abdm:ask-ai', {detail: {question: '', send: false}}),
            )
          }>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={sandboxLinks.home} target="_blank" rel="noopener noreferrer">
            <SandboxMark />
            ABDM sandbox
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TopBar() {
  const pathname = useRoutePath();
  if (isLanding(pathname)) {
    return <LandingBar />;
  }

  return (
    <nav className="navbar navbar--fixed-top topbar" aria-label="Site">
      {/* The chip carrying the name is hidden at two ranges (navbar.css says
          which and why), so the name is on the link itself: without it the
          brand link is an empty decorative image wherever the chip is gone. */}
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
        <span className="brand-chip">
          <BrandMark />
          <span className="topbar-wordmark">ABDM Developer Portal</span>
        </span>
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
                href={sandboxLinks.home}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ABDM sandbox">
                <SandboxMark />
              </a>
            </TooltipTrigger>
            <TooltipContent>ABDM sandbox</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <OverflowMenu />

      <NavbarColorModeToggle className="topbar-toggle" />
    </nav>
  );
}
