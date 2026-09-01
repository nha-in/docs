import {useEffect, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import {useRoutePath} from '@site/src/config/navigation';

/** The page the landing hero hands off to, and the page it hands back from. */
const BEHIND = '/docs/hiecm/v3';

/**
 * The other half of the landing page's scroll handoff: at the very top of the
 * API references, scrolling up returns to the landing page.
 *
 * `wheel` and `touchmove` here, not `scroll`, and this is the one place that
 * is right. At scrollY 0 the page cannot scroll up any further, so no
 * `scroll` event ever fires; the gesture has to be read before the browser
 * discards it. The intent threshold is on the wheel delta rather than on
 * position for the same reason.
 *
 * Only from the reference page, and only from its very top, so an ordinary
 * scroll back up through a long page ends at the top and stops there. A
 * second, deliberate upward gesture is what leaves.
 */
export default function ScrollBackHome(): null {
  const history = useHistory();
  const pathname = useRoutePath();
  const armed = useRef(false);

  useEffect(() => {
    const onReference =
      pathname === BEHIND || pathname === `${BEHIND}/`;
    if (!onReference) return undefined;

    let leaving = false;
    const atTop = () => window.scrollY <= 2;

    const go = () => {
      if (leaving) return;
      leaving = true;
      document.documentElement.dataset.leavingBack = 'true';
      window.setTimeout(() => {
        delete document.documentElement.dataset.leavingBack;
        history.push('/');
      }, 220);
    };

    const onWheel = (event: WheelEvent) => {
      if (!atTop()) {
        armed.current = false;
        return;
      }
      // Arm on reaching the top, fire on the next upward push. Without the
      // arming step, momentum left over from scrolling up through the page
      // carries straight past the top and leaves without being asked to.
      if (event.deltaY > 0) {
        armed.current = false;
        return;
      }
      if (!armed.current) {
        armed.current = true;
        return;
      }
      if (event.deltaY < -8) go();
    };

    let touchStart = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!atTop()) return;
      const dy = (event.touches[0]?.clientY ?? 0) - touchStart;
      if (dy > 70) go();
    };

    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [history, pathname]);

  return null;
}
