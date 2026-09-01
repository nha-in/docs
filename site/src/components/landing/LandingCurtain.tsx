import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from '@docusaurus/router';
import {createStorageSlot} from '@docusaurus/theme-common';
import {Moon, Sun} from 'lucide-react';
import {isLanding, useRoutePath} from '@site/src/config/navigation';
import LandingHero from './LandingHero';

/**
 * The colour mode control, written by hand.
 *
 * The curtain is mounted by the theme Root, which sits outside Layout and so
 * outside Docusaurus' colour mode provider: its own toggle cannot be used here
 * at all, and rendering one throws during static rendering. This writes the
 * same storage slot Docusaurus reads, through its own helper, which dispatches
 * the event the provider listens for. The provider under the curtain therefore
 * changes with it, and the site is in one state rather than two.
 */
function CurtainThemeToggle(): React.ReactNode {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () =>
      (document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark'
        | null) ?? 'light';
    setMode(read());
    // The attribute is the one thing both sides agree on, so watch it rather
    // than the storage: a system theme change never touches storage.
    const watch = new MutationObserver(() => setMode(read()));
    watch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => watch.disconnect();
  }, []);

  const flip = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    // The slot is made here rather than at module scope: this module is
    // evaluated during static rendering too, where there is no storage, and a
    // slot made then is a no-op object that never writes anything.
    createStorageSlot('theme').set(next);
  };

  return (
    <button
      type="button"
      className="curtain__toggle"
      onClick={flip}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      {mode === 'dark' ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

/** What the curtain uncovers: the gateway's overview, where reading starts. */
const BEHIND = '/docs/hiecm/v3';

/** How far a touch has to travel, in pixels, before it commits the lift. */
const TOUCH_COMMIT = 24;

/**
 * The landing page as a curtain over the API references.
 *
 * There is no page change to watch. The references are mounted and painted
 * underneath from the first movement — the route is pushed while the curtain
 * still covers the screen — and the gesture then rolls the curtain up off the
 * top, uncovering what was already there. What used to happen instead was a
 * fade, a wait and a second page arriving, and no amount of easing hides the
 * wait in the middle of that.
 *
 * The lift reads the wheel rather than the scroll position, because the
 * document underneath is the references page and its scroll belongs to it. The
 * page does not scroll at all while the curtain is down; it starts scrolling
 * at the moment the curtain has gone, from its own top.
 *
 * This component lives in the theme Root, so it is mounted once for the life
 * of the tab and survives the route change it performs. Rendering it from the
 * landing route instead would unmount it at the very moment it is needed.
 */
export default function LandingCurtain(): React.ReactNode {
  const history = useHistory();
  const pathname = useRoutePath();
  const onLanding = isLanding(pathname);

  const [lifting, setLifting] = useState(false);
  const lift = useRef(0);
  const surface = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const raising = useRef(false);

  const showing = onLanding || lifting;

  const paint = useCallback(() => {
    surface.current?.style.setProperty('--lift', lift.current.toFixed(4));
  }, []);

  /** Put the references under the curtain, once, at the first movement. */
  const reveal = useCallback(() => {
    if (pushed.current) return;
    pushed.current = true;
    setLifting(true);
    history.push(BEHIND);
    // The references open at their own top: a route change does not reset the
    // scroll the way a page load does.
    window.scrollTo(0, 0);
  }, [history]);

  const done = useCallback(() => {
    lift.current = 1;
    paint();
    setLifting(false);
    pushed.current = false;
    raising.current = false;
  }, [paint]);

  /** The control does what the gesture does, at a steady rate. */
  const pullUp = useCallback(() => {
    if (raising.current) return;
    raising.current = true;
    reveal();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      done();
      return;
    }
    const started = performance.now();
    const from = lift.current;
    const step = () => {
      const t = Math.min(1, (performance.now() - started) / 520);
      // Ease out: the curtain leaves fastest at the start, the way a blind does.
      lift.current = from + (1 - from) * (1 - (1 - t) ** 3);
      paint();
      if (t < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  }, [done, paint, reveal]);

  useEffect(() => {
    if (!showing) return undefined;

    // Nothing scrolls while the curtain is down. The gesture drives the
    // curtain; the page underneath gets its scroll back when it is uncovered.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';

    lift.current = 0;
    pushed.current = false;
    paint();

    let touchFrom = 0;
    let touchTravel = 0;

    // Any downward intent commits the whole lift. The curtain used to track
    // the gesture proportionally, which read as considered until a mild
    // scroll left it stalled halfway across the screen; a curtain either
    // covers the stage or it has gone.
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) pullUp();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchFrom = event.touches[0]?.clientY ?? 0;
      touchTravel = 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      touchTravel += touchFrom - y;
      touchFrom = y;
      if (touchTravel > TOUCH_COMMIT) pullUp();
    };
    const onKey = (event: KeyboardEvent) => {
      if (['PageDown', 'ArrowDown', ' ', 'Enter'].includes(event.key)) {
        pullUp();
      }
    };

    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [showing, paint, pullUp]);

  // The references are what the curtain uncovers, so they are worth having in
  // memory before it moves. Prefetching a route a push will ask for is the
  // difference between uncovering a painted page and uncovering a blank one.
  useEffect(() => {
    if (!onLanding) return undefined;
    const idle = window.requestIdleCallback ?? window.setTimeout;
    idle(() => window.docusaurus?.prefetch(BEHIND));
    return undefined;
  }, [onLanding]);

  if (!showing) {
    return null;
  }

  return (
    <div className="curtain" ref={surface} aria-label="ABDM Developer Portal">
      {/* Plain images, and no colour mode control. The curtain is mounted by
          the theme Root, which sits outside Layout and therefore outside the
          colour mode provider, so anything that reads that context throws
          during static rendering. CSS picks the mark instead. */}
      <div className="curtain__bar">
        <img
          className="curtain__mark curtain__mark--light"
          src="/img/nha-logo.svg"
          alt="National Health Authority"
        />
        <img
          className="curtain__mark curtain__mark--dark"
          src="/img/nha-logo-dark.svg"
          alt=""
        />
        <CurtainThemeToggle />
      </div>
      <LandingHero onLift={pullUp} />
    </div>
  );
}
