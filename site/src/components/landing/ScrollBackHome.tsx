import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useRoutePath} from '@site/src/config/navigation';

/** The page the landing hero hands off to, and the page it hands back from. */
const API_REFERENCE = '/docs/hiecm/v3/api';

/**
 * A new gesture is one that starts after a pause. Momentum from a flick keeps
 * delivering `wheel` events at frame rate, so a gap this long never appears
 * inside one gesture, and always appears before the next one.
 */
const NEW_GESTURE_MS = 350;

/** How far a finger has to travel down, measured from the top, to leave. */
const TOUCH_TRAVEL = 70;

/**
 * The other half of the landing page's scroll handoff: at the very top of the
 * API references, scrolling up returns to the landing page.
 *
 * `wheel` and `touchmove` here, not `scroll`, and this is the one place that
 * is right. At scrollY 0 the page cannot scroll up any further, so no
 * `scroll` event ever fires; the gesture has to be read before the browser
 * discards it.
 *
 * Only from the reference page, and only from its very top, so an ordinary
 * scroll back up through a long page ends at the top and stops there. A
 * second, deliberate upward gesture is what leaves. What separates the two is
 * the pause between them: an upward flick that runs to the top keeps sending
 * momentum events after it arrives, and those events are indistinguishable
 * from a deliberate push except by their timing.
 */
export default function ScrollBackHome(): null {
  const history = useHistory();
  const pathname = useRoutePath();
  // The landing page sits at the site root, which is the base URL and not
  // necessarily '/'. `history.push` is given a browser path and applies no
  // base of its own, so the base has to be on the path already.
  const home = useBaseUrl('/');

  useEffect(() => {
    const onReference =
      pathname === API_REFERENCE || pathname === `${API_REFERENCE}/`;
    if (!onReference) return undefined;

    let leaving = false;
    const atTop = () => window.scrollY <= 2;

    const go = () => {
      if (leaving) return;
      leaving = true;
      document.documentElement.dataset.leavingBack = 'true';
      window.setTimeout(() => {
        delete document.documentElement.dataset.leavingBack;
        history.push(home);
      }, 220);
    };

    let lastWheel = 0;
    const onWheel = (event: WheelEvent) => {
      const now = event.timeStamp;
      const sinceLast = now - lastWheel;
      lastWheel = now;

      if (!atTop()) return;
      if (event.deltaY > 0) return;
      // Still the flick that brought the page up here, or its momentum. The
      // reader asked to reach the top, not to go past it.
      if (sinceLast < NEW_GESTURE_MS) return;
      if (event.deltaY < -8) go();
    };

    // Measured from where the finger was when the page reached the top, not
    // from where the touch began: a long swipe up through the page would
    // otherwise arrive at the top with the full distance already travelled.
    let travelFrom: number | null = null;
    const onTouchStart = () => {
      travelFrom = null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      if (!atTop()) {
        travelFrom = null;
        return;
      }
      if (travelFrom === null) {
        travelFrom = y;
        return;
      }
      if (y - travelFrom > TOUCH_TRAVEL) go();
    };
    const onTouchEnd = () => {
      travelFrom = null;
    };

    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    window.addEventListener('touchend', onTouchEnd, {passive: true});
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [history, home, pathname]);

  return null;
}
