import type {ReactNode} from 'react';
import {useCallback, useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkWeb from '@site/src/components/landing/NetworkWeb';
import BrandMark from '@site/src/components/chrome/BrandMark';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ChevronDown} from 'lucide-react';

/** Where a scroll past the statement takes the reader. */
const API_REFERENCE = '/docs/hiecm/v3/api';

/** Longest the run down the page may take before the route changes anyway. */
const RUN_LIMIT_MS = 700;

/** Shortest it may take, so a run that has not started yet is not read as one that has finished. */
const RUN_FLOOR_MS = 120;

/** How long the reference page is held at its top while the swap settles. */
const SETTLE_MS = 220;

/** The three gateways, as text separated by interpuncts (see home.css). */
const ways = [
  {label: 'HIE-CM', to: '/docs/hiecm/v3'},
  {label: 'UHI', to: '/docs/uhi/v1'},
  {label: 'NHCX', to: '/docs/nhcx/v1'},
];

/**
 * Runs the page down to the bottom of the cue and calls back when it has
 * actually stopped moving, rather than when a guessed duration has elapsed.
 *
 * The browser decides how long its own smooth scroll takes, and the number
 * varies with the distance and with the browser. Handing off on a guess means
 * handing off mid-animation, and an animation that outlives the handoff keeps
 * easing the page it lands on.
 *
 * Stillness for two frames is the end of the run: reaching the bottom and the
 * browser finishing early both look the same from here, and both are done.
 * The floor covers the frames before the animation has moved anything, and the
 * timeout covers a tab sent to the background mid-run, where frames stop
 * arriving but the reader still has to end up somewhere.
 */
function runDown(then: () => void): void {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    then();
  };

  const startedAt = performance.now();
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});

  let last = window.scrollY;
  let stillFor = 0;
  const watch = () => {
    if (finished) return;
    const y = window.scrollY;
    stillFor = Math.abs(y - last) < 1 ? stillFor + 1 : 0;
    last = y;
    const elapsed = performance.now() - startedAt;
    if (elapsed >= RUN_FLOOR_MS && stillFor >= 2) {
      finish();
      return;
    }
    if (elapsed >= RUN_LIMIT_MS) {
      finish();
      return;
    }
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
  // Frames stop in a background tab; timers do not.
  window.setTimeout(finish, RUN_LIMIT_MS);
}

/**
 * Holds the window at the top for a moment after the route changes, then lets
 * go.
 *
 * One scrollTo is not enough. React commits the new route asynchronously, so
 * the reference page is not there yet when the handoff ends; it is taller than
 * the page it replaces, so its layout settles over the next few frames; and
 * whatever momentum the reader's own flick had left arrives after the swap and
 * would otherwise carry the new page down with it.
 */
function holdAtTop(release: () => void): void {
  const until = performance.now() + SETTLE_MS;
  const hold = () => {
    if (window.scrollY !== 0) window.scrollTo(0, 0);
    if (performance.now() < until) {
      requestAnimationFrame(hold);
      return;
    }
    release();
  };
  requestAnimationFrame(hold);
  window.setTimeout(release, SETTLE_MS * 4);
}

/**
 * The landing page is one screen, and leaving it goes to the API references.
 *
 * The exit is a scroll, because that is what the reader was going to do
 * anyway: pressing Get started runs the page down to the bottom of the cue
 * below the hero, and the route changes when it gets there. The button
 * therefore does visibly the same thing the gesture does, rather than being a
 * second, different way out.
 *
 * The `scroll` listener catches the manual gesture. `wheel` fires per device
 * with wildly different deltas; `scrollY` is the one number every input
 * method agrees on, keyboard and dragged scrollbar included. Either path ends
 * in the same place, and `leaving` makes sure only the first one counts.
 *
 * Nothing may still be scrolling when the route changes, and nothing may
 * reset the scroll before it. Both of those are visible: an unfinished scroll
 * carries on into the reference page and lands it part way down, and a reset
 * issued before the swap is painted on the page being left, where it reads as
 * a jump backwards to the top.
 */
function useScrollHandoff(): () => void {
  const history = useHistory();
  const leaving = useRef(false);

  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    const go = () => {
      const html = document.documentElement;
      const behavior = html.style.scrollBehavior;
      // Stop the page where it stands, and keep every scroll from here to the
      // end of the swap instant. A smooth reset would animate against the
      // hold below, and against anything the reader's flick has left.
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, window.scrollY);

      history.push(API_REFERENCE);

      holdAtTop(() => {
        html.style.scrollBehavior = behavior;
      });
    };

    // A reader who asked for less motion gets the route change on its own.
    // There is no run to wait for, but the hold still applies: the reference
    // page has to open at its own top either way.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      go();
      return;
    }
    runDown(go);
  }, [history]);

  useEffect(() => {
    const onScroll = () => {
      // 24px: past the settle after load and past touch jitter, but reached
      // by the first real scroll of any input device.
      if (window.scrollY > 24) leave();
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [leave]);

  return leave;
}

export default function Home(): ReactNode {
  const leave = useScrollHandoff();

  return (
    <Layout
      title="ABDM Developer Portal"
      description="Developer documentation for the Ayushman Bharat Digital Mission gateways: HIE-CM, UHI and NHCX.">
      <main className="landing">
        <section className="landing-hero">
          {/* The network the page is about, drawn behind the words. */}
          <BrowserOnly>{() => <NetworkWeb />}</BrowserOnly>

          <div className="landing-hero__copy">
            <p className="brand-chip brand-chip--eyebrow">
              <BrandMark />
              <span className="landing-hero__eyebrow">ABDM Developer Portal</span>
            </p>
            {/* The three lines are set here rather than left to the measure:
                the break after "Build on" is the point of the sentence. They
                fold back into a natural wrap under 768px, where the longest
                line does not fit. */}
            <Heading as="h1" className="landing-hero__statement">
              Build on
              <br />
              India&rsquo;s Interoperable
              <br />
              Digital Health Infrastructure
            </Heading>
            <p className="landing-hero__lede">
              Ayushman Bharat Digital Mission
              <br />
              Secure. Private. Robust.
            </p>
            {/* Get started does what a scroll does, so it is a button rather
                than a link: it carries the reader down to the references
                through the same transition, instead of jumping to a different
                page than the gesture beside it. The arrow is gone with the
                link, because it pointed sideways at a destination this no
                longer goes to. */}
            <button type="button" className="landing-hero__cta" onClick={leave}>
              Get started
            </button>

            <nav className="landing-hero__ways" aria-label="The three gateways">
              {ways.map(({label, to}) => (
                <Link key={to} to={to} className="landing-hero__way">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* The scroll is the page's main gesture, so it is advertised. */}
          <button
            type="button"
            className="landing-scroll-hint"
            onClick={leave}
            aria-label="Go to the API references">
            <ChevronDown className="size-5" aria-hidden="true" />
          </button>
        </section>

        {/* Scroll room, nothing else: somewhere for a real scroll to travel
            before the handoff fires. Not meant to be seen. */}
        <div className="landing-scroll-cue" aria-hidden="true" />
      </main>
    </Layout>
  );
}
