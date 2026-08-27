import React, {useEffect, useRef} from 'react';
import {useHistory} from '@docusaurus/router';
import {useRoutePath} from '@site/src/config/navigation';

/** The page the landing hero hands off to, and the only page that hands back. */
const API_REFERENCE = '/docs/hiecm/v3/api';

/**
 * How much accumulated upward pull it takes to leave. A hard flick of a wheel
 * is 300-500 units and a trackpad flick less, so one gesture cannot do it: the
 * reader has to keep pulling, which is the point. Leaving a page by accident
 * is the failure this guards against.
 */
const COMMIT = 1400;

/** Pull decays this fast when the reader stops, in units per second. */
const DECAY = 2600;

/** The page never follows the pull further than this, however hard it is. */
const GIVE = 72;

/**
 * Scrolling up at the very top of the API references returns to the landing
 * page, against resistance.
 *
 * `wheel` and `touchmove` rather than `scroll`, and this is the one place that
 * is right: at scrollY 0 the page cannot scroll up any further, so no scroll
 * event ever fires and the gesture has to be read before the browser discards
 * it.
 *
 * The resistance is a rubber band with a commit threshold, not a delta test.
 * The page follows the pull on a curve that flattens as it goes, so the reader
 * can see both that the gesture exists and that it has not finished; the pull
 * bleeds away as soon as they stop. A single hard scroll cannot reach the
 * threshold, which is what was wrong with the first version of this.
 */
export default function PullHome(): null {
  const history = useHistory();
  const pathname = useRoutePath();
  const pull = useRef(0);
  const wrap = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onReference =
      pathname === API_REFERENCE || pathname === `${API_REFERENCE}/`;
    if (!onReference) {
      return undefined;
    }

    // The body, not the route's own wrapper: a route change replaces the
    // wrapper, and the class would then be sitting on a detached node while
    // the page the reader is looking at has none.
    const page = document.body;
    wrap.current = page;
    page.classList.add('pull-home');

    let leaving = false;
    let last = performance.now();
    let frame = 0;
    let touchFrom = 0;

    /** Rubber band: the further it is pulled, the less each unit gives. */
    const give = (amount: number) => (amount * GIVE) / (amount + COMMIT * 0.55);

    const paint = () => {
      page.dataset.pulling = pull.current > 0 ? 'true' : 'false';
      page.style.setProperty('--pull', give(pull.current).toFixed(2));
    };

    const settle = () => {
      frame = requestAnimationFrame(settle);
      const now = performance.now();
      const elapsed = (now - last) / 1000;
      last = now;
      if (pull.current > 0 && !leaving) {
        pull.current = Math.max(0, pull.current - DECAY * elapsed);
        paint();
      }
    };

    const leave = () => {
      if (leaving) return;
      leaving = true;
      pull.current = 0;
      paint();
      const swap = () => history.push('/');
      // @ts-expect-error -- not in every lib.dom yet
      if (typeof document.startViewTransition === 'function') {
        // @ts-expect-error -- see above
        document.startViewTransition(swap);
      } else {
        swap();
      }
    };

    const add = (amount: number) => {
      if (leaving || window.scrollY > 2 || amount <= 0) return;
      pull.current += amount;
      last = performance.now();
      if (pull.current >= COMMIT) {
        leave();
        return;
      }
      paint();
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) add(-event.deltaY);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchFrom = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      add((y - touchFrom) * 2.5);
      touchFrom = y;
    };

    frame = requestAnimationFrame(settle);
    window.addEventListener('wheel', onWheel, {passive: true});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchmove', onTouchMove, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      page.classList.remove('pull-home');
      page.removeAttribute('data-pulling');
      page.style.removeProperty('--pull');
    };
  }, [history, pathname]);

  return null;
}
