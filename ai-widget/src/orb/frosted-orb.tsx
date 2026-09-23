/**
 * The panel's orb, after "Motion - AI Orb" by Siddhant on Dribbble: a core of
 * moving colour held inside a thick shell of frosted glass.
 *
 * The colour is one Plasma Orb mesh gradient the full width of the sphere, in
 * the reference's pastels. Where the thick glass ends and the clear core
 * begins is not a line: it is a feathered band whose shape lives, breathing in
 * and out and drifting a little off round, so the core swells and settles
 * rather than sitting in a fixed window. Outside that band the colour is seen
 * through thick frost, blurred hard and milked over, so the shell carries a
 * wash of whatever passes beneath it. Inside it the colour is seen through
 * thin glass, with two creases turning where the sheets fold. A blue violet
 * haze falls below. One WebGL context per orb, however many layers.
 */
import type {JSX} from 'preact';
import {useEffect, useRef} from 'preact/hooks';
import {PlasmaOrb} from './plasma-orb';
import type {OrbState} from './orb-state';
import {observeActivity} from './env';

/** Pastels, as the reference has them: violet, periwinkle, blue, cyan, and
 *  the milky white most of the core is. */
export const CORE = ['#9483ec', '#bcc0f7', '#6a8bf1', '#7fd6fb', '#f2f4ff'];

/** The core's pace, a little quicker than the component's own. */
const CURRENT = 1.6;

/** Folding and turning at rest, closer to the reference than the default. */
const FOLD = {distortion: 1, swirl: 0.85};

/**
 * The core's radius as a share of the sphere's, at its smallest and largest
 * breath, and how wide the feathered band at its edge is, as a share of the
 * core's own radius.
 */
const CORE_MIN = 0.76;
const CORE_MAX = 0.86;
const FEATHER = 10;

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The core's shape at time t, in seconds: a radius that breathes in and out
 * on a slow cycle, two axes that wander a few percent apart, and a centre
 * that drifts a hair. Incommensurate periods, so the shape never quite
 * repeats and never reads as a loop.
 */
function coreShape(size: number, t: number) {
  const breath = 0.5 + 0.5 * Math.sin(t * 0.85);
  const r = (size / 2) * (CORE_MIN + (CORE_MAX - CORE_MIN) * breath);
  return {
    rx: r * (1 + 0.035 * Math.sin(t * 1.3)),
    ry: r * (1 + 0.035 * Math.sin(t * 1.7 + 1.2)),
    cx: size / 2 + size * 0.012 * Math.sin(t * 0.7),
    cy: size / 2 + size * 0.012 * Math.cos(t * 0.8 + 0.5),
  };
}

type Shape = ReturnType<typeof coreShape>;
const at = ({rx, ry, cx, cy}: Shape) =>
  `${rx.toFixed(1)}px ${ry.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
/** Shows only the core, fading out across the feathered band. */
const insideMask = (s: Shape) =>
  `radial-gradient(${at(s)}, #000 0%, #000 ${100 - FEATHER}%, transparent 100%)`;
/** Shows everything but the core, fading in across the same band. */
const outsideMask = (s: Shape) =>
  `radial-gradient(${at(s)}, transparent 0%, transparent ${100 - FEATHER}%, #000 100%)`;

function setMask(el: HTMLElement | null, mask: string) {
  if (!el) return;
  el.style.maskImage = mask;
  el.style.setProperty('-webkit-mask-image', mask);
}

type Props = {size: number; state?: OrbState; label?: string};

export function FrostedOrb({size, state = 'idle', label = 'Assistant'}: Props) {
  const round: JSX.CSSProperties = {position: 'absolute', inset: 0, borderRadius: '50%'};
  const px = (share: number) => `${Math.max(1, size * share)}px`;
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const thin = useRef<HTMLDivElement>(null);
  const thick = useRef<HTMLDivElement>(null);
  const creaseA = useRef<HTMLDivElement>(null);
  const creaseB = useRef<HTMLDivElement>(null);
  const still = coreShape(size, 0);

  // The core's edge lives: every frame the three masked layers are given
  // the core's shape at that moment. Cheap, since it is three style writes,
  // and paused whenever the orb is off screen or its tab is hidden.
  useEffect(() => {
    const paint = (shape: Shape) => {
      setMask(inner.current, insideMask(shape));
      setMask(thin.current, insideMask(shape));
      setMask(thick.current, outsideMask(shape));
    };
    paint(coreShape(size, 0));
    if (reducedMotion() || !root.current) return;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      paint(coreShape(size, (now - start) / 1000));
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const unobserve = observeActivity(root.current, (active) => (active ? wake() : halt()));
    wake();
    return () => {
      halt();
      unobserve();
    };
  }, [size]);

  // The creases turn at their own paces, in opposite directions, and narrow
  // as they turn, which is what reads as a sheet folding over rather than a
  // line sweeping round.
  useEffect(() => {
    if (reducedMotion()) return;
    const turns = [
      creaseA.current?.animate(
        [
          {transform: 'rotate(-20deg) scaleX(1)'},
          {transform: 'rotate(160deg) scaleX(0.55)'},
          {transform: 'rotate(340deg) scaleX(1)'},
        ],
        {duration: 9000, iterations: Infinity, easing: 'ease-in-out'},
      ),
      creaseB.current?.animate(
        [
          {transform: 'rotate(70deg) scaleX(0.7)'},
          {transform: 'rotate(-120deg) scaleX(1.1)'},
          {transform: 'rotate(-290deg) scaleX(0.7)'},
        ],
        {duration: 13000, iterations: Infinity, easing: 'ease-in-out'},
      ),
    ];
    return () => turns.forEach((turn) => turn?.cancel());
  }, []);

  // A crease is the edge of a tall ellipse: a curved line, bright on the side
  // the light meets and shaded just past it, the way a fold in a sheet reads.
  const crease = (
    ref: typeof creaseA,
    light: number,
    shadow: number,
    where: string,
  ): JSX.Element => (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-2%',
        background: `radial-gradient(ellipse 32% 58% at ${where}, transparent 95%, rgba(255,255,255,${light}) 97.5%, rgba(72,80,196,${shadow}) 99%, transparent 100%)`,
        filter: `blur(${px(0.006)})`,
      }}
    />
  );

  const inMask = insideMask(still);
  const outMask = outsideMask(still);

  return (
    <div
      ref={root}
      class="ask-ai__orb"
      style={{position: 'relative', width: size, height: size, flex: '0 0 auto'}}>
      {/* The haze the core throws through the glass, falling below it. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          left: '4%',
          right: '4%',
          top: '34%',
          height: '100%',
          background:
            'radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))',
          filter: `blur(${px(0.1)})`,
        }}
      />

      {/* The colour, the full width of the sphere. */}
      <PlasmaOrb
        state={state}
        size={size}
        speed={CURRENT}
        colors={CORE}
        idleMotion={FOLD}
        meshScale={0.55}
        gloss={false}
        label={label}
      />

      {/* The creases, inside the living core only. */}
      <div
        ref={inner}
        aria-hidden="true"
        style={
          {
            ...round,
            overflow: 'hidden',
            mixBlendMode: 'soft-light',
            opacity: 0.8,
            maskImage: inMask,
            WebkitMaskImage: inMask,
          } as JSX.CSSProperties
        }>
        {crease(creaseA, 0.75, 0.3, '22% 50%')}
        {crease(creaseB, 0.4, 0.18, '78% 44%')}
      </div>

      {/* Thin glass over the core: clear enough to read the folds. */}
      <div
        ref={thin}
        aria-hidden="true"
        style={
          {
            ...round,
            backdropFilter: `blur(${px(0.006)})`,
            WebkitBackdropFilter: `blur(${px(0.006)})`,
            background:
              'radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)',
            maskImage: inMask,
            WebkitMaskImage: inMask,
          } as JSX.CSSProperties
        }
      />

      {/* Thick glass round it: the same colour, blurred hard and milked
          over, so the shell takes on whatever is passing beneath it. It
          fades in across the core's feathered edge, so there is no line
          where the two glasses meet. */}
      <div
        ref={thick}
        aria-hidden="true"
        style={
          {
            ...round,
            backdropFilter: `blur(${px(0.07)}) saturate(1.1)`,
            WebkitBackdropFilter: `blur(${px(0.07)}) saturate(1.1)`,
            background:
              'radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)',
            maskImage: outMask,
            WebkitMaskImage: outMask,
          } as JSX.CSSProperties
        }
      />

      {/* The sphere's own surface. This edge stays: it is the glass. */}
      <div
        aria-hidden="true"
        style={{
          ...round,
          pointerEvents: 'none',
          boxShadow: `inset 0 0 ${px(0.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`,
        }}
      />
    </div>
  );
}

/** The thinking dot: the same colour, without the glass, which at this size
 *  would only muddy it. */
export function ThinkingOrb({size = 18}: {size?: number}) {
  return (
    <PlasmaOrb
      state="thinking"
      size={size}
      speed={CURRENT}
      colors={CORE}
      idleMotion={FOLD}
      meshScale={0.55}
      gloss={false}
      label="Thinking"
    />
  );
}
