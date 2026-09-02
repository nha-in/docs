import Link from '@docusaurus/Link';
import React, {useEffect, useRef} from 'react';
import {
  Building2,
  FlaskConical,
  Landmark,
  Pill,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  User,
} from 'lucide-react';

/**
 * The ABDM network behind the landing copy: the participants, every link
 * between them, and the reader carrying a record across it.
 *
 * The mesh used to be anonymous dots under a veil with a hole cut at the
 * pointer. Two things changed. The dots are the actual cast of the network, so
 * the shape on screen is the argument the page is making rather than
 * decoration; and the reveal is a falloff rather than a hole, because the
 * visible circle edge is what reads as the flashlight trope. Light still
 * follows the pointer, in sage, the way beckn.io does it.
 *
 * The icons are DOM, the links and the courier are canvas. Canvas cannot draw
 * an icon without shipping its path data, and the DOM cannot draw 28 live
 * links without 28 elements; each layer does the half it is good at, and both
 * read the same participant table.
 */

/** The cast. Positions are percentages of the hero, kept out of the copy. */
const PARTICIPANTS = [
  {id: 'citizen', label: 'Citizen', Icon: User, x: 50, y: 7, small: true},
  {id: 'phr', label: 'PHR app', Icon: Smartphone, x: 79, y: 17},
  {id: 'insurer', label: 'Insurer', Icon: ShieldCheck, x: 92, y: 45, small: true},
  {id: 'pharmacy', label: 'Pharmacy', Icon: Pill, x: 82, y: 74},
  // Bottom centre is left clear: the scroll cue lives there.
  {id: 'lab', label: 'Diagnostics', Icon: FlaskConical, x: 64, y: 88, small: true},
  {id: 'hospital', label: 'Hospital', Icon: Building2, x: 36, y: 88, small: true},
  {id: 'nha', label: 'NHA', Icon: Landmark, x: 8, y: 45},
  {id: 'doctor', label: 'Doctor', Icon: Stethoscope, x: 21, y: 17, small: true},
];

/** Every pair, once. The claim ABDM makes is that any of these can exchange. */
const LINKS = PARTICIPANTS.flatMap((from, i) =>
  PARTICIPANTS.slice(i + 1).map((to) => [i, PARTICIPANTS.indexOf(to)] as const),
);

const REACH = 260; // px: how far the courier's light carries
const ARRIVE = 76; // px: close enough to a participant to hand the record over
const IDLE_AFTER = 10_000; // ms of stillness before the network demonstrates itself
const PACKET_MS = 900; // how long a record takes to travel one link

type Point = {x: number; y: number};

/** 0 at `far` and beyond, 1 at zero distance, eased so there is no visible rim. */
function falloff(distance: number, far: number) {
  const t = Math.max(0, 1 - distance / far);
  return t * t;
}

export default function NetworkWeb(): React.ReactNode {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!wrap || !canvas || !context) {
      return undefined;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const icons = Array.from(
      wrap.querySelectorAll<HTMLElement>('[data-participant]'),
    );

    let width = 0;
    let height = 0;
    let places: Point[] = [];
    let frame = 0;

    /** Where the courier is drawn, and where it last handed a record over. */
    let courier: Point = {x: -9999, y: -9999};
    /** Where the pointer, or the idle walk, is asking the courier to be. */
    let aim: Point = {x: -9999, y: -9999};
    /** The participant the light is settling onto, and how far it has settled. */
    let onto = -1;
    let settled = 0;
    let lastFrame = 0;
    let holding = -1;
    /** A record in flight: from, to, and when it left. */
    let packet: {from: number; to: number; at: number} | null = null;
    let lastMove = 0;
    let idleFrom = 0;
    let idleTo = 1;
    let idleSince = 0;

    const measure = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      places = PARTICIPANTS.map((p) => ({
        x: (p.x / 100) * width,
        y: (p.y / 100) * height,
      }));
    };

    const accent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#3d714e';

    /**
     * The accent as `r, g, b`, so a gradient can fade to that same colour at
     * zero alpha.
     *
     * A canvas gradient interpolates its stops without premultiplying alpha,
     * so a stop of `transparent` is transparent *black*: the fade runs through
     * grey and stops dead at the arc's edge, which is the hard rim. CSS
     * gradients premultiply and have no such problem, which is why only the
     * canvas half needed this.
     */
    const rgbOf = (colour: string) => {
      context.fillStyle = colour;
      const normalised = context.fillStyle as string;
      if (normalised.startsWith('#')) {
        const hex = normalised.slice(1);
        const full =
          hex.length === 3
            ? hex.split('').map((c) => c + c).join('')
            : hex;
        const value = parseInt(full, 16);
        return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
      }
      return normalised.replace(/^rgba?\(|\)$/g, '').split(',').slice(0, 3).join(',');
    };

    /**
     * The same sage, at the chroma a pale page needs.
     *
     * Dark mode has headroom: a low alpha wash over near black is read as
     * light, and that version stays as it is. Cream has none, so the identical
     * wash is read as a film of grey green laid on the paper. A canvas
     * composite does not rescue it either: over a near white ground multiply
     * and source-over resolve to the same pixels. What separates a lamp from a
     * stain here is colour, so the light torch keeps the accent's hue and
     * takes its saturation up, and gets its shape from a hot core below.
     */
    const neon = (channels: string) => {
      const [r, g, b] = channels.split(',').map((n) => Number(n) / 255);
      const high = Math.max(r, g, b);
      const low = Math.min(r, g, b);
      const level = (high + low) / 2;
      const spread = high - low;
      const saturation = spread === 0 ? 0 : spread / (1 - Math.abs(2 * level - 1));
      let hue = 0;
      if (spread > 0) {
        hue =
          high === r
            ? (g - b) / spread
            : high === g
              ? (b - r) / spread + 2
              : (r - g) / spread + 4;
        hue = (hue * 60 + 360) % 360;
      }
      const lifted = Math.min(0.52, saturation * 1.6) * 100;
      return rgbOf(`hsl(${hue.toFixed(0)}, ${lifted.toFixed(0)}%, 43%)`);
    };

    const nearest = (from: Point) => {
      let best = -1;
      let bestDistance = Infinity;
      places.forEach((place, index) => {
        const distance = Math.hypot(place.x - from.x, place.y - from.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      return {index: best, distance: bestDistance};
    };

    /** Hand the record on when the courier reaches someone new. */
    const deliver = (now: number) => {
      const {index, distance} = nearest(courier);
      if (index < 0 || distance > ARRIVE || index === holding) {
        return;
      }
      if (holding >= 0) {
        packet = {from: holding, to: index, at: now};
      }
      holding = index;
    };

    /** With no pointer, the courier walks its own route so the page moves. */
    const walkIdle = (now: number) => {
      const from = places[idleFrom];
      const to = places[idleTo];
      const t = Math.min(1, (now - idleSince) / 2200);
      // Ease in and out, so the courier slows into each participant.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      aim = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };
      if (t >= 1) {
        idleFrom = idleTo;
        do {
          idleTo = Math.floor(Math.random() * PARTICIPANTS.length);
        } while (idleTo === idleFrom);
        idleSince = now;
      }
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const colour = accent();
      const channels = rgbOf(colour);
      // Read per frame rather than at mount: the bar has a theme toggle, and a
      // torch built once would keep the old theme's recipe until a reload.
      const dark = document.documentElement.dataset.theme === 'dark';
      const torch = dark ? channels : neon(channels);
      const idle = now - lastMove > IDLE_AFTER;

      if (idle && !reduced.matches) {
        if (!idleSince) idleSince = now;
        walkIdle(now);
      }

      // A torch held over a participant should be concentric with it, not
      // hanging off its edge, so within a participant's reach the light settles
      // onto the exact centre. It is eased rather than snapped because the
      // pointer crosses that reach on the way to somewhere else more often than
      // it stops in it, and a jump on every near miss would read as a fault.
      const near = nearest(aim);
      const over = near.index >= 0 && near.distance <= ARRIVE;
      if (over) onto = near.index;
      const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
      lastFrame = now;
      // Reduced motion gets the centring and none of the travel to it.
      settled = reduced.matches
        ? Number(over)
        : settled + ((over ? 1 : 0) - settled) * (1 - Math.exp(-elapsed / 90));
      const anchor = places[onto];
      // Released, `settled` runs back down to zero and the courier is the
      // pointer again, wherever the pointer has got to by then.
      courier =
        anchor && settled > 0.001
          ? {
              x: aim.x + (anchor.x - aim.x) * settled,
              y: aim.y + (anchor.y - aim.y) * settled,
            }
          : aim;

      deliver(now);

      context.clearRect(0, 0, width, height);
      context.lineCap = 'round';
      context.strokeStyle = colour;

      // Every link, lit by how close the courier passes to it.
      for (const [a, b] of LINKS) {
        const from = places[a];
        const to = places[b];
        const middle = {x: (from.x + to.x) / 2, y: (from.y + to.y) / 2};
        const lit = falloff(
          Math.hypot(middle.x - courier.x, middle.y - courier.y),
          REACH * 1.6,
        );
        context.globalAlpha = 0.05 + lit * 0.3;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }

      // The two links the courier is currently standing between.
      const ranked = places
        .map((place, index) => ({
          index,
          distance: Math.hypot(place.x - courier.x, place.y - courier.y),
        }))
        .sort((one, two) => one.distance - two.distance)
        .slice(0, 2);

      for (const {index, distance} of ranked) {
        if (distance > REACH) continue;
        context.globalAlpha = 0.15 + falloff(distance, REACH) * 0.5;
        context.lineWidth = 1.25;
        context.beginPath();
        context.moveTo(courier.x, courier.y);
        context.lineTo(places[index].x, places[index].y);
        context.stroke();
      }

      // A record in flight along the link it was handed across.
      if (packet) {
        const t = (now - packet.at) / PACKET_MS;
        if (t >= 1) {
          packet = null;
        } else {
          const from = places[packet.from];
          const to = places[packet.to];
          const at = {
            x: from.x + (to.x - from.x) * t,
            y: from.y + (to.y - from.y) * t,
          };
          context.globalAlpha = 0.5 * (1 - t);
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(at.x, at.y);
          context.stroke();

          context.globalAlpha = 1 - t * 0.4;
          context.fillStyle = colour;
          context.beginPath();
          context.arc(at.x, at.y, 3, 0, Math.PI * 2);
          context.fill();
        }
      }

      // The courier itself: the record the reader is carrying, and its light.
      if (courier.x > -9000) {
        const glow = context.createRadialGradient(
          courier.x,
          courier.y,
          0,
          courier.x,
          courier.y,
          REACH * 1.5,
        );
        // Stops on a curve rather than two on a line: a linear ramp still shows
        // where it ends. The last stop is the same colour at zero alpha.
        //
        // Dark mode carries an even haze across the whole reach, which is what
        // makes it read as ambient light. Light mode front loads the same reach
        // into a small bright centre that has fallen to almost nothing by a
        // third of the way out, because on a pale page a torch is read from its
        // core and an even wash of that size is exactly the stain.
        const stops = dark
          ? [
              [0, 0.16],
              [0.35, 0.07],
              [0.7, 0.02],
              [1, 0],
            ]
          : [
              [0, 0.34],
              [0.13, 0.15],
              [0.36, 0.05],
              [0.7, 0.012],
              [1, 0],
            ];
        for (const [at, alpha] of stops) {
          glow.addColorStop(at, `rgba(${torch}, ${alpha})`);
        }
        context.globalAlpha = 1;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(courier.x, courier.y, REACH * 1.5, 0, Math.PI * 2);
        context.fill();

        // The filament. It takes the torch colour rather than the accent, so
        // in light mode the very centre is the brightest, most saturated point
        // on the page and the glow has something to be the glow of.
        context.globalAlpha = 0.9;
        context.fillStyle = `rgb(${torch})`;
        context.beginPath();
        context.arc(courier.x, courier.y, 3.5, 0, Math.PI * 2);
        context.fill();
      }

      // The icons take their light from the same distance, as a custom
      // property, so a pointer move costs a style recalculation and no render.
      icons.forEach((icon, index) => {
        const place = places[index];
        if (!place) return;
        const lit = falloff(
          Math.hypot(place.x - courier.x, place.y - courier.y),
          REACH,
        );
        // The participant holding the record keeps a floor of light, so it is
        // clear where the record came from, without pinning it at full
        // brightness long after the courier has gone.
        const held = index === holding ? 0.5 : 0;
        icon.style.setProperty('--lit', Math.max(lit, held).toFixed(3));
      });

      context.globalAlpha = 1;
    };

    const onPointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      aim = {x: event.clientX - box.left, y: event.clientY - box.top};
      lastMove = performance.now();
      idleSince = 0;
    };

    measure();
    // Start on the idle walk, so the network is already moving on arrival.
    idleSince = 0;
    frame = requestAnimationFrame(draw);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div className="network-web" ref={wrapRef}>
      {/* The web itself is decoration. The nodes on top of it are not: each
          one is the participant's page, so the picture is a way into the
          documentation rather than an illustration of it. */}
      <canvas className="network-web__canvas" ref={canvasRef} aria-hidden="true" />
      <nav className="network-web__nodes" aria-label="Who takes part in ABDM">
        {PARTICIPANTS.map(({id, label, Icon, x, y, small}) => (
          <Link
            key={id}
            to={`/docs/hiecm/v3/concepts/participants/${id}`}
            data-participant={id}
            className={`network-node${small ? '' : ' network-node--wide'}`}
            style={{left: `${x}%`, top: `${y}%`}}>
            <Icon className="network-node__icon" strokeWidth={1.5} aria-hidden="true" />
            <span className="network-node__label">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
