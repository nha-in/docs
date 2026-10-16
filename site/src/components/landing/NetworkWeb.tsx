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
import {PATHWAYS, type Pathway} from '@site/src/components/landing/pathways';

/**
 * The ABDM network behind the landing copy: the participants, every link
 * between them, and the reader carrying a record across it.
 *
 * The mesh used to be anonymous dots under a veil with a hole cut at the
 * pointer. Two things changed. The dots are the actual cast of the network, so
 * the shape on screen is the argument the page is making rather than
 * decoration; and the reveal is a falloff rather than a hole, because the
 * visible circle edge is what reads as the flashlight trope. Light still
 * follows the pointer, in the accent, the way beckn.io does it.
 *
 * The icons are DOM, the links and the courier are canvas. Canvas cannot draw
 * an icon without shipping its path data, and the DOM cannot draw 28 live
 * links without 28 elements; each layer does the half it is good at, and both
 * read the same participant table.
 */

/**
 * The cast, standing on the vertices of a regular octagon around the copy.
 *
 * `at` is the vertex's angle in degrees, anticlockwise from the right of the
 * ring, so the eight sit exactly 45 degrees apart and the shape is the
 * argument rather than eight positions that happened to look right. The ring
 * is turned 22.5 degrees off the axes, which leaves its top and its bottom
 * empty and puts a pair either side of each instead. That is what the copy
 * needs: the emblem and the board sit at the top of it, and a vertex landing
 * on the vertical centre line would land on them.
 *
 * The order round the ring is the order the cast was already in, so nothing
 * moves further than the nearest vertex. Reading clockwise from the top left:
 * the Citizen, the app they hold, who pays, who dispenses, who tests, who
 * treats, who governs, and who prescribes.
 *
 * Where the ring is and how big it is belongs to the stylesheet, because the
 * radius has to answer to the copy's width and the window's height at the
 * same time. See `--ring-x` and `--ring-y` in home.css.
 */
const PARTICIPANTS = [
  {id: 'citizen', label: 'Citizen', Icon: User, at: 112.5, small: true},
  {id: 'phr', label: 'PHR app', Icon: Smartphone, at: 67.5},
  {id: 'insurer', label: 'Insurer', Icon: ShieldCheck, at: 22.5, small: true},
  {id: 'pharmacy', label: 'Pharmacy', Icon: Pill, at: -22.5},
  {id: 'lab', label: 'Diagnostics', Icon: FlaskConical, at: -67.5, small: true},
  {id: 'hospital', label: 'Hospital', Icon: Building2, at: -112.5, small: true},
  {id: 'nha', label: 'NHA', Icon: Landmark, at: -157.5},
  {id: 'doctor', label: 'Doctor', Icon: Stethoscope, at: 157.5, small: true},
];

/**
 * The octagon's long unit, cos 22.5 degrees.
 *
 * Every vertex is (+-LONG, +-SHORT) or (+-SHORT, +-LONG) of the two radii, so
 * a vertex clears the copy as soon as its long axis does: the four at the
 * sides clear it across, the four at the ends clear it above and below. That
 * is the whole of the sizing rule below.
 */
const LONG = Math.cos((22.5 * Math.PI) / 180);

/**
 * A point on the ring at `deg`, as a unit vector the stylesheet multiplies
 * the ring's radii by. `y` is negated because the screen's runs downwards.
 *
 * The ring is the octagon's bounding rectangle rather than an ellipse. At the
 * eight vertices the two agree exactly, but a pathway slides participants
 * round the ring to angles between them, and on an ellipse a node half way
 * between two vertices stands inside the corner of the copy. On the
 * rectangle one axis is always LONG, so the sizing rule below holds at any
 * angle, not only at the eight.
 */
function unit(deg: number) {
  const c = Math.cos((deg * Math.PI) / 180);
  const s = -Math.sin((deg * Math.PI) / 180);
  const k = LONG / Math.max(Math.abs(c), Math.abs(s));
  return {ux: c * k, uy: s * k};
}

/** Each participant's resting vertex. */
const VERTICES = PARTICIPANTS.map(({at}) => unit(at));

/** Half a node, plus room to breathe, in px. The label is the wide part. */
const CLEAR_X = 48;
const CLEAR_Y = 30;

type Role = 'primary' | 'context' | 'background';

const roleOf = (pathway: Pathway, id: string): Role =>
  pathway.primary.includes(id)
    ? 'primary'
    : pathway.context.includes(id)
      ? 'context'
      : 'background';

/**
 * How far outside the ring a participant travels when it leaves, in px.
 *
 * A participant stepping out of the network does not cross it. It steps just
 * outside the ring first, goes round that outer track to the right, and only
 * then walks out to the column, so it never passes over the copy or through
 * a participant that is staying.
 */
const TRACK = 44;
/** Between one participant in the column and the next, in px. */
const COLUMN_GAP = 74;
/**
 * The gap between the gateway cards and a polygon's lower vertices, in px,
 * over and above the node's own clearance. Without it a pentagon's lower
 * corners sat a few pixels under the cards and read as touching them.
 */
const BELOW_CARDS = 32;
/** How long each leaver waits after the one before it, in ms. */
const LEAVE_EVERY = 110;

/** The shortest way round from `from` to `to`, in degrees. */
const arc = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

/** How long a pathway's record takes over one link, and rests after a step. */
const HOP_MS = 750;
const STAGE_DWELL_MS = 1700;
/** Between the card being asked about and the first step setting off. */
const RECOMPOSE_MS = 1100;
/** Every pair, once. The claim ABDM makes is that any of these can exchange. */
const LINKS = PARTICIPANTS.flatMap((from, i) =>
  PARTICIPANTS.slice(i + 1).map((to) => [i, PARTICIPANTS.indexOf(to)] as const),
);

const REACH = 260; // px: how far the courier's light carries
const ARRIVE = 76; // px: close enough to a participant to hand the record over
const IDLE_AFTER = 3_000; // ms of stillness before the network demonstrates itself
const PACKET_MS = 900; // how long a record takes to travel one link

/**
 * How long the courier takes to cross from one participant to the next.
 *
 * The board says nothing while a crossing is under way: it holds the line it
 * is showing and turns over on arrival, so this constant sets the pace of the
 * walk and nothing else. It used to set the length of the board's turn as
 * well, which is why it once had to agree with FlapBoard.
 */
const TRAVEL_MS = 5000;

/**
 * How far along a crossing the courier counts as having got there.
 *
 * Not 1. The easing slows the courier into each participant, so the last
 * three percent of the distance takes the last six hundred milliseconds of
 * the crossing: the courier is sitting on the node, to the pixel, well before
 * the leg is arithmetically over. Announcing on the last frame put a visible
 * wait between the record landing and the board saying what it was. On a
 * four hundred pixel leg this fires within twelve pixels of the node, which
 * is inside the node's own circle.
 */
const LANDED = 0.97;

/**
 * How long the courier waits at a participant before setting off again.
 *
 * This is the board's reading time and it is the whole reason it exists.
 * The wave takes as long as the crossing, so without a pause the board is
 * mid-turn essentially all the time, and a split-flap caught mid-turn is
 * half of one message next to half of another: the first version of this
 * spent its life spelling things like "EBDR DEVELO ERAPORTAL". The courier
 * now sits still while the flaps hold what they landed on.
 */
const DWELL_MS = 4200;

/**
 * Every third delivery goes to the NHA, whose line on the board is the
 * portal's own name. That is what makes the site's identity the thing the
 * board keeps coming back to, on a rhythm rather than on a timer.
 */
const HOME_EVERY = 3;

type Point = {x: number; y: number};

/** 0 at `far` and beyond, 1 at zero distance, eased so there is no visible rim. */
function falloff(distance: number, far: number) {
  const t = Math.max(0, 1 - distance / far);
  return t * t;
}

export default function NetworkWeb({
  onArrive,
  onPoint,
  intent = null,
  onStage,
}: {
  /**
   * The gateway card the reader is asking about, as its short name in
   * PATHWAYS, or `null` for the network as a whole. While it is set the
   * courier stands down and the ring leans towards that journey.
   */
  intent?: string | null;
  /** Called with the board's line as each step of the journey sets off. */
  onStage?: (line: string) => void;
  /**
   * Called when the courier completes a leg of its own route, with the
   * participant it set out for. This is the itinerary, not proximity: a
   * courier passes close to plenty of participants it is not visiting, and
   * the board must not answer to those.
   */
  onArrive?: (id: string) => void;
  /**
   * Called with a participant the reader's own pointer has settled the light
   * onto. Not the itinerary: this is somebody pointing at a node and asking
   * what it is, so the board answers briefly and the walk takes over again
   * once the pointer goes still.
   *
   * Called with `null` when the pointer is moving and the light is on nobody.
   * The board has no question to answer then, so it goes back to the portal's
   * own name rather than holding the last node's line. Without this a reader
   * who points at the pharmacy and then moves away reads "Prescriptions that
   * travel" for as long as they keep the pointer moving, which says the board
   * is stuck rather than that it is answering them.
   */
  onPoint?: (id: string | null) => void;
} = {}): React.ReactNode {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in refs so a new callback identity never restarts the canvas.
  const arrive = useRef(onArrive);
  arrive.current = onArrive;
  const point = useRef(onPoint);
  point.current = onPoint;
  const asked = useRef(intent);
  asked.current = intent;
  const stageTo = useRef(onStage);
  stageTo.current = onStage;

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
    /** Deliveries made, so every third one can be sent home to the NHA. */
    let deliveries = 0;
    /** True once this leg's arrival has been announced to the board. */
    let landed = false;
    /** While set, the courier is resting at a participant until this time. */
    let dwellUntil = 0;
    /**
     * The participant the board has already answered for under the pointer.
     * `-1` before the pointer has asked anything, `-2` once it has been told
     * the light is on nobody, so neither is announced twice running.
     */
    let pointed = -1;
    const home = PARTICIPANTS.findIndex((who) => who.id === 'nha');
    const indexOf = (id: string) => PARTICIPANTS.findIndex((who) => who.id === id);

    /** The ring's centre and radii in px, once the sizing pass has run. */
    let ring = {cy: 0, x: 0, y: 0};
    /**
     * In px from the ring's centre: how far out a point must be to clear the
     * copy, and how far out it can be before it leaves the page, on each axis.
     */
    let bounds = {needX: 0, needY: 0, roomX: 0, up: 0, down: 0};
    /**
     * The copy's own blocks, the emblem and board, the statement, the lede and
     * the cards, in px from the ring's centre, grown by a node's clearance.
     * The copy is narrow at the top and wide at the cards, so testing a vertex
     * against its bounding box ruled out polygons that fit.
     */
    let blocks: {l: number; r: number; t: number; b: number}[] = [];
    /**
     * The circumradius of the pathway's polygon, and how far below the ring's
     * centre its own centre sits, both in px: as drawn, and as planned. The
     * drawn one eases towards the plan, so going from one pathway's polygon
     * straight to the next resizes it rather than snapping it.
     */
    let radius = 0;
    let lift = 0;
    const shape = {radius: 0, lift: 0};
    /** Where each participant stands on the ring now, and is heading. */
    const angles = PARTICIPANTS.map(({at}) => at);
    const HOME = PARTICIPANTS.map(({at}) => at);
    let targets = HOME;
    /**
     * How far outside the ring each participant stands, in px, now and
     * heading. 0 is on the ring; the column is further out still.
     */
    const dists = PARTICIPANTS.map(() => 0);
    let reaches = PARTICIPANTS.map(() => 0);
    /** How far each participant is towards the pathway's polygon, 0 to 1. */
    const scales = PARTICIPANTS.map(() => 0);
    let sizes = PARTICIPANTS.map(() => 0);
    /** Whether anyone moved last frame. A new pathway waits for everyone home. */
    let wasMoving = false;
    /** When each participant may set off towards its target. */
    const moveAt = PARTICIPANTS.map(() => 0);
    /** True while a pathway is being taken down and everyone is going home. */
    let homing = false;
    /**
     * From a node's point on the ring to the middle of its icon. The node is
     * an icon over a label centred on the point, so the icon sits above it.
     * Measured, then kept, so a moving node needs no layout read per frame.
     */
    let offsets: Point[] = PARTICIPANTS.map(() => ({x: 0, y: 0}));

    /** The pathway on screen, which trails `asked` while one fades out. */
    let shown: Pathway | null = null;
    let shownId: string | null = null;
    /** 0 for the whole network, 1 for a pathway, eased between. */
    let mix = 0;
    let stage = 0;
    let stageAt = 0;
    let stageSaid = false;
    /** The participant carrying the current step's caption. */
    let captioned = -1;
    /** Every link any step of the shown pathway crosses, as `low * 8 + high`. */
    const paths = new Set<number>();
    /** The sides of the pathway's polygon, the same way. */
    const sides = new Set<number>();
    const captions = icons.map((icon) =>
      icon.querySelector<HTMLElement>('.network-node__stage'),
    );
    const vias = icons.map((icon) =>
      icon.querySelector<HTMLElement>('.network-node__via'),
    );

    const layer = wrap.querySelector<HTMLElement>('.network-web__nodes');
    const copy = wrap.parentElement?.querySelector('.landing-hero__copy');

    /**
     * Size the ring against the copy it is drawn around.
     *
     * The stylesheet cannot do this on its own, which is what the shares of
     * the window it used to be given kept getting wrong. The copy's height is
     * its content's and it does not sit on the middle of the window, so a
     * ring measured from the window drifts onto the words as the window
     * changes: it was how a node ended up inside a gateway card.
     *
     * Each radius is put half way between the smallest that clears the copy
     * and the largest the layer has room for, so the ring stands as far out
     * as the page allows and never closer in than the words need. On a window
     * too small for both, room wins, because a node off the edge of the page
     * is a worse answer than a node near the words.
     */
    const size = (box: DOMRect) => {
      if (!layer || !copy) return;
      const c = copy.getBoundingClientRect();
      const cy = c.top + c.height / 2 - box.top;
      const clears = (half: number, clear: number) => (half + clear) / LONG;
      const fits = (room: number, clear: number) => Math.max(0, room - clear) / LONG;
      const between = (needs: number, room: number) =>
        room < needs ? room : (needs + room) / 2;
      const needsX = clears(c.width / 2, CLEAR_X);
      const needsY = clears(c.height / 2, CLEAR_Y);
      const roomX = fits(width / 2, CLEAR_X);
      const roomY = fits(Math.min(cy, height - cy), CLEAR_Y);
      ring = {
        cy: Math.round(cy),
        x: Math.round(between(needsX, roomX)),
        y: Math.round(between(needsY, roomY)),
      };
      // The top bar, if there is one: the layer reaches up under it, but a
      // participant standing under the bar is one nobody can read.
      const bar = document.querySelector('.landing-bar')?.getBoundingClientRect();
      const barFoot = bar ? bar.bottom - box.top : 0;
      blocks = Array.from(copy.children).map((child) => {
        const b = child.getBoundingClientRect();
        return {
          l: b.left - box.left - width / 2 - CLEAR_X,
          r: b.right - box.left - width / 2 + CLEAR_X,
          t: b.top - box.top - cy - CLEAR_Y,
          b: b.bottom - box.top - cy + CLEAR_Y,
        };
      });
      bounds = {
        needX: needsX * LONG,
        needY: needsY * LONG,
        roomX: roomX * LONG,
        // Up to the top of the layer, down to the bottom with room for a label.
        up: cy - barFoot - CLEAR_Y - 12,
        // Room for a label under the node, and the footnote under that.
        down: height - cy - CLEAR_Y - 52,
      };
      layer.style.setProperty('--ring-cy', `${ring.cy}px`);
      layer.style.setProperty('--ring-x', `${ring.x}px`);
      layer.style.setProperty('--ring-y', `${ring.y}px`);
      // A window with no room for the ring gets no drawing. Both cliffs are
      // real and neither is a width: at 1024x640 the copy fills the hero top
      // to bottom, and at 820 wide the card row leaves no gutter to stand a
      // node in. Measured rather than declared as a breakpoint, because what
      // decides it is the copy's own size, and a breakpoint would have to
      // guess that. Hidden rather than unmounted, so the boxes this pass
      // reads stay measurable and the ring comes back when the room does.
      wrap.dataset.ring = roomX >= needsX && roomY >= needsY ? 'clear' : 'crowded';
    };

    const measure = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Before the icons are read, because it is what moves them.
      size(box);
      // Measured off the icons rather than computed from the percentages. A
      // node is an icon above a label, centred on its own box, so the point
      // the percentages name is the middle of that pair: below the icon, in
      // the gap above the word. Light centred there lit the label and left
      // the mark it was meant to be lighting hanging over its top edge. The
      // vertex stands in for a node whose icon has not laid out yet.
      //
      // Kept as an offset from the node's point on the ring, so a node
      // sliding round the ring for a pathway is placed by arithmetic.
      if (!ring.x) {
        // No copy to size against: the stylesheet's own defaults.
        ring = {cy: height / 2, x: width * 0.38, y: height * 0.41};
      }
      offsets = icons.map((node, index) => {
        const mark = node.querySelector('.network-node__icon');
        const at = mark?.getBoundingClientRect();
        // A zero box is a node that is not laid out. Its point on the ring
        // stands in, so the mesh keeps its shape and only the icon goes.
        // Measuring the zero box instead would put the node at the top left
        // corner of the page and run every one of its links there.
        if (!at || !at.width) return {x: 0, y: 0};
        const {ux, uy, out} = spot(index);
        return {
          x: at.left + at.width / 2 - box.left - (width / 2 + (ring.x + out) * ux),
          y: at.top + at.height / 2 - box.top - (ring.cy + (ring.y + out) * uy),
        };
      });
      place();
    };

    /** A participant's point as the ring's unit vector, and px beyond it. */
    function spot(index: number) {
      // On the ring's rectangle, `out` px beyond it: the octagon, the outer
      // track and the column are all this.
      const {ux, uy} = unit(angles[index]);
      const k = scales[index];
      if (k < 0.0005) return {ux, uy, out: dists[index]};
      // Blended towards the pathway's circle, where the polygon is regular.
      // One continuous blend, so a participant going from one pathway's
      // polygon to the next, or out of it to the column, never jumps.
      const r = (angles[index] * Math.PI) / 180;
      const x = (ring.x + dists[index]) * ux * (1 - k) + k * shape.radius * Math.cos(r);
      const y = (ring.y + dists[index]) * uy * (1 - k) + k * (shape.lift - shape.radius * Math.sin(r));
      return {ux: x / ring.x, uy: y / ring.y, out: 0};
    }

    /** Every participant's icon centre, from where it stands. */
    const place = () => {
      places = angles.map((_, index) => {
        const {ux, uy, out} = spot(index);
        return {
          x: width / 2 + (ring.x + out) * ux + offsets[index].x,
          y: ring.cy + (ring.y + out) * uy + offsets[index].y,
        };
      });
    };

    /**
     * Put the pathway the reader asked about on screen, or take it off.
     *
     * Roles and captions change here, once, and the stylesheet fades them.
     * The frame loop only moves nodes and draws.
     */
    const show = (id: string | null) => {
      shownId = id;
      shown = id ? PATHWAYS[id] ?? null : null;
      stage = 0;
      stageAt = performance.now() + RECOMPOSE_MS;
      stageSaid = false;
      captioned = -1;
      captions.forEach((caption) => {
        caption?.classList.remove('is-on');
        if (caption) caption.textContent = '';
      });
      paths.clear();
      shown?.stages.forEach(({route}) =>
        route.slice(1).forEach((id, hop) => {
          const a = indexOf(route[hop]);
          const b = indexOf(id);
          paths.add(Math.min(a, b) * 8 + Math.max(a, b));
        }),
      );
      if (shown) {
        wrap.dataset.intent = shown.gateway;
      } else {
        delete wrap.dataset.intent;
      }
      icons.forEach((icon, index) => {
        const {id: who} = PARTICIPANTS[index];
        if (shown) icon.dataset.role = roleOf(shown, who);
        else delete icon.dataset.role;
        const via = vias[index];
        if (via) via.textContent = shown && shown.hub === who ? `${shown.gateway} gateway` : '';
      });
      // Reduced motion keeps everyone where they are: the hierarchy is
      // carried by strength of line and colour alone.
      homing = false;
      if (shown && !reduced.matches) plan(shown);
      else goHome();
    };

    /**
     * Where everyone stands for a pathway.
     *
     * The participants on the journey close up into a regular polygon: four
     * make a square, five a pentagon, three a triangle. It is regular on the
     * same stretched ring the octagon stands on, so it reads as the octagon
     * having lost some sides rather than as a new shape. Of every way to turn
     * it, the one that needs the least enlarging to clear the copy wins, and
     * among those the one nearest where everyone already stands, in the
     * order they already stand in.
     *
     * Everyone else leaves the network for a column in the right hand corner,
     * outside the ring and outside the polygon.
     */
    const plan = (pathway: Pathway) => {
      const all = PARTICIPANTS.map((_, index) => index);
      const staying = all.filter((index) => roleOf(pathway, PARTICIPANTS[index].id) === 'primary');
      const leaving = all.filter((index) => !staying.includes(index));
      const to = HOME.slice();
      const far = PARTICIPANTS.map(() => 0);
      const size = PARTICIPANTS.map(() => 0);

      const n = staying.length;
      const step = 360 / Math.max(1, n);
      // A vertex may not stand on the copy, and may not leave the page. The
      // copy is wider than it is tall, so a polygon centred on it often has
      // no size that does both: a triangle's lower corners land behind the
      // cards. The polygon's centre is allowed to move up or down to find
      // one, as little as it can.
      const {needY, roomX, up, down} = bounds;
      const fits = (turn: number, size: number, shift: number) => {
        for (let k = 0; k < n; k += 1) {
          const r = ((turn - k * step) * Math.PI) / 180;
          const x = size * Math.cos(r);
          const y = -size * Math.sin(r) + shift;
          if (Math.abs(x) > roomX || y < -up || y > down) return false;
          if (blocks.some(({l, r: right, t, b}) => x > l && x < right && y > t && y < b)) {
            return false;
          }
          // A vertex in the lower half stands below the cards, never beside
          // them or between them and the lede: there it reads as part of the
          // copy.
          if (y > 0 && y < needY + BELOW_CARDS) return false;
        }
        return true;
      };
      // Upright only, so the shape is symmetrical about the copy's centre
      // line, and a vertex at the top before a side across it: a side across
      // the top runs straight through the emblem.
      const turns = [90 % step, (90 + step / 2) % step];
      let found: {turn: number; size: number; shift: number; score: number} | null = null;
      turns.forEach((turn, rank) => {
        for (let size = 160; size <= Math.max(roomX, up + down); size += 4) {
          for (let shift = -240; shift <= 240; shift += 4) {
            if (!fits(turn, size, shift)) continue;
            const score = rank * 1e6 + Math.abs(shift) * 4 + Math.abs(size - ring.y);
            if (!found || score < found.score) found = {turn, size, shift, score};
          }
        }
      });
      // Nothing fits on a window this size: a vertex at the top, as large as
      // the height allows, centred.
      const chosen = found ?? {turn: turns[0], size: Math.min(up, down, roomX), shift: 0};
      radius = chosen.size;
      lift = chosen.shift;
      // Round the ring in the order everyone already stands, turned to be
      // nearest where they are.
      let best = {cost: Infinity, shift: 0};
      for (let shift = 0; shift < n; shift += 1) {
        let cost = 0;
        staying.forEach((index, i) => {
          cost += Math.abs(arc(HOME[index], chosen.turn - ((i + shift) % n) * step));
        });
        if (cost < best.cost) best = {cost, shift};
      }
      const turnTo = chosen.turn;
      // The polygon's own sides, so the shape is closed whatever the route
      // happens to cross.
      sides.clear();
      staying.forEach((a, i) => {
        const b = staying[(i + 1) % n];
        if (n > 2 || i === 0) sides.add(Math.min(a, b) * 8 + Math.max(a, b));
      });
      let reach = ring.x * LONG + TRACK;
      staying.forEach((index, i) => {
        to[index] = HOME[index] + arc(HOME[index], turnTo - ((i + best.shift) % n) * step);
        size[index] = 1;
        reach = Math.max(reach, radius * Math.cos((to[index] * Math.PI) / 180));
      });

      // The column stands clear of both the ring and the polygon, and is
      // stacked upwards from the ring's bottom edge.
      const columnX = Math.min(width / 2 - 60, reach + 70);
      const out = columnX / LONG - ring.x;
      const bottom = Math.min(ring.cy + ring.y * LONG, height - 90);
      leaving.forEach((index, order) => {
        const y = bottom - (leaving.length - 1 - order) * COLUMN_GAP;
        const uy = Math.max(-LONG, Math.min(LONG, (y - ring.cy) / (ring.y + out)));
        to[index] = (Math.atan2(-uy, LONG) * 180) / Math.PI;
        far[index] = out;
      });

      // Nobody on a polygon yet: the drawn shape can start at the plan.
      if (scales.every((k) => k < 0.01)) {
        shape.radius = radius;
        shape.lift = lift;
      }
      // The leavers go first, one after another, then the polygon closes up.
      const now = performance.now();
      targets = to;
      reaches = far;
      sizes = size;
      leaving.forEach((index, turn) => {
        moveAt[index] = now + turn * LEAVE_EVERY;
      });
      staying.forEach((index) => {
        moveAt[index] = now + leaving.length * LEAVE_EVERY + 350;
      });
    };

    /**
     * Everyone home: the polygon opens back out to the octagon first, then
     * the column comes back into it.
     */
    const goHome = () => {
      const now = performance.now();
      targets = HOME;
      reaches = PARTICIPANTS.map(() => 0);
      sizes = PARTICIPANTS.map(() => 0);
      let turn = 0;
      PARTICIPANTS.forEach((_, index) => {
        moveAt[index] = scales[index] > 0.01 ? now : now + 140 + 50 * turn++;
      });
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
     * The same accent, at the chroma a pale page needs.
     *
     * Dark mode has headroom: a low alpha wash over near black is read as
     * light, and that version stays as it is. A near-white page has none, so the identical
     * wash is read as a film of grey laid on the paper. A canvas composite
     * does not rescue it either: over a near white ground multiply
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
      // Resting at a participant, holding still so the board can be read.
      if (dwellUntil) {
        aim = places[idleTo];
        if (now < dwellUntil) return;
        dwellUntil = 0;
        idleFrom = idleTo;
        deliveries += 1;
        if (deliveries % HOME_EVERY === 0 && idleFrom !== home) {
          idleTo = home;
        } else {
          do {
            idleTo = Math.floor(Math.random() * PARTICIPANTS.length);
          } while (idleTo === idleFrom);
        }
        idleSince = now;
        landed = false;
        return;
      }

      const from = places[idleFrom];
      const to = places[idleTo];
      const t = Math.min(1, (now - idleSince) / TRAVEL_MS);
      // Ease in and out, so the courier slows into each participant.
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      aim = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };
      // The itinerary's own arrival, not deliver()'s. deliver() fires for
      // anyone the courier passes within ARRIVE of, and on a crossing this
      // long that is several participants it was never going to: the board
      // was being retargeted by near misses, which made the gaps between
      // messages anything from 0.8s to 14.5s against a designed 9.2s.
      if (eased >= LANDED && !landed) {
        landed = true;
        arrive.current?.(PARTICIPANTS[idleTo].id);
      }
      if (t >= 1) dwellUntil = now + DWELL_MS;
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

      // The walk stands down while a pathway is on screen: the pathway's own
      // record is what moves then, and two would be a crowd.
      if (idle && !reduced.matches && !shownId) {
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

      // One pathway to the next goes by way of the whole network: the first
      // fades and its participants go home, then the second is put up. Cut
      // straight across and it reads as a different picture; passing through
      // the network says both journeys run on the same one.
      const wanted = asked.current && PATHWAYS[asked.current] ? asked.current : null;
      if (wanted !== shownId) {
        // From one pathway straight to the next: the polygon re-forms for the
        // new journey without going back through the octagon.
        if (wanted || !shownId || (mix < 0.05 && !wasMoving) || reduced.matches) show(wanted);
        else if (!homing) {
          homing = true;
          goHome();
        }
      }
      const goal = shownId && shownId === wanted ? 1 : 0;
      mix = reduced.matches ? goal : mix + (goal - mix) * (1 - Math.exp(-elapsed / 180));
      const rest = 1 - mix;

      // Participants move towards where the pathway wants them, eased out
      // and never past the mark. A participant that has to travel round the
      // ring does it from the outer track: out to it first, round, and only
      // then to wherever it is going, on the ring or in the column.
      let moving = false;
      // Going home is quicker than setting out: the reader has moved on.
      const ease = 1 - Math.exp(-elapsed / (homing || !shown ? 80 : 150));
      // Eased towards the mark, but never faster than `cap` per second. On
      // its own the easing starts every move at full speed, so a participant
      // crossing half the ring covered a hundred pixels a frame and read as
      // a jump. Capped, a long move travels and a short one still settles.
      const pace = homing || !shown ? 1.8 : 1;
      const toward = (left: number, cap: number) =>
        Math.sign(left) * Math.min(Math.abs(left) * ease, (cap * pace * elapsed) / 1000);
      angles.forEach((angle, index) => {
        if (now < moveAt[index]) return;
        const left = arc(angle, targets[index]);
        const k = scales[index];
        const goal = sizes[index];
        if (goal > 0 && dists[index] > 0.5) {
          // Joining the polygon from the column: back to the ring first.
          dists[index] += toward(-dists[index], 450);
          moving = true;
          return;
        }
        if (goal > 0 || (k > 0.0005 && reaches[index] === 0)) {
          // On the polygon, or leaving it for home: turn and blend together.
          if (Math.abs(left) > 0.05 || Math.abs(goal - k) > 0.001) {
            angles[index] = angle + toward(left, 110);
            scales[index] = k + toward(goal - k, 1.4);
            moving = true;
          } else if (angle !== targets[index] || k !== goal) {
            angles[index] = targets[index];
            scales[index] = goal;
            moving = true;
          }
          return;
        }
        if (k > 0.0005) {
          // Leaving the polygon for the column: back onto the ring where it
          // stands, then round the outer track like anyone else.
          scales[index] = Math.abs(k) < 0.001 ? 0 : k + toward(-k, 1.4);
          moving = true;
          return;
        }
        const round = Math.abs(left) > 0.05;
        const want = round ? TRACK : reaches[index];
        const gap = want - dists[index];
        if (Math.abs(gap) > 0.5) {
          dists[index] += toward(gap, 450);
          moving = true;
        } else if (round) {
          dists[index] = want;
          angles[index] = angle + toward(left, 110);
          moving = true;
        } else if (angle !== targets[index] || dists[index] !== want) {
          angles[index] = targets[index];
          dists[index] = want;
          moving = true;
        }
      });
      if (Math.abs(shape.radius - radius) > 0.5 || Math.abs(shape.lift - lift) > 0.5) {
        shape.radius += toward(radius - shape.radius, 450);
        shape.lift += toward(lift - shape.lift, 450);
        moving = true;
      }
      wasMoving = moving;
      if (moving) {
        place();
        icons.forEach((icon, index) => {
          const {ux, uy, out} = spot(index);
          icon.style.setProperty('--ux', ux.toFixed(4));
          icon.style.setProperty('--uy', uy.toFixed(4));
          icon.style.setProperty('--out', `${out.toFixed(1)}px`);
        });
      }
      // Reduced motion gets the centring and none of the travel to it.
      settled = reduced.matches
        ? Number(over)
        : settled + ((over ? 1 : 0) - settled) * (1 - Math.exp(-elapsed / 90));
      // Settled under the reader's own pointer, rather than arrived on the
      // walk. Announced past the half way point so a pointer crossing a node
      // on its way somewhere else does not set the board off, and released
      // again once the light has left, so coming back to the same node asks
      // the question a second time.
      if (!idle && over && settled > 0.6 && onto !== pointed) {
        pointed = onto;
        point.current?.(PARTICIPANTS[onto].id);
      }
      // Adrift: the pointer is live and the light has left every node. Say so
      // once, on the frame the light is released, and let the board decide
      // what to show with no participant to speak for. While the walk owns the
      // board this is skipped, because the itinerary is announcing its own
      // legs and a gap between two of them is not a released pointer.
      if (settled < 0.2) {
        if (!idle && pointed !== -2) {
          pointed = -2;
          point.current?.(null);
        } else if (idle) {
          pointed = -1;
        }
      }

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
        // With a pathway up, its links hold a steady line and every other
        // link stays faintly drawn: the journey is one part of the network,
        // not the whole of it.
        const onPath = shown ? paths.has(a * 8 + b) : false;
        const outside = dists[a] > 1 || dists[b] > 1;
        context.globalAlpha = (0.05 + lit * 0.3) * rest + (outside ? 0 : mix * 0.022);
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
        // The polygon's sides close the shape in a lighter line, and the
        // pathway's own links hold a steadier one over them. A side is drawn
        // as structure, not as a route: NHCX's hospital and insurer only ever
        // talk through the gateway.
        const side = shown ? sides.has(a * 8 + b) : false;
        if ((onPath || side) && mix > 0.01 && !outside) {
          context.globalAlpha = mix * (onPath ? 0.24 : 0.13);
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        }
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
        context.globalAlpha = (0.15 + falloff(distance, REACH) * 0.5) * rest;
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
          context.globalAlpha = 0.5 * (1 - t) * rest;
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(at.x, at.y);
          context.stroke();

          context.globalAlpha = (1 - t * 0.4) * rest;
          context.fillStyle = colour;
          context.beginPath();
          context.arc(at.x, at.y, 3, 0, Math.PI * 2);
          context.fill();
        }
      }

      // The courier itself: the record the reader is carrying, and its light.
      if (courier.x > -9000 && rest > 0.01) {
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
        context.globalAlpha = rest;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(courier.x, courier.y, REACH * 1.5, 0, Math.PI * 2);
        context.fill();

        // The filament. It takes the torch colour rather than the accent, so
        // in light mode the very centre is the brightest, most saturated point
        // on the page and the glow has something to be the glow of.
        context.globalAlpha = 0.9 * rest;
        context.fillStyle = `rgb(${torch})`;
        context.beginPath();
        context.arc(courier.x, courier.y, 3.5, 0, Math.PI * 2);
        context.fill();
      }

      // The pathway's step in flight: its links resolve one after another as
      // the record crosses them, then hold while the caption is read.
      let head: Point | null = null;
      if (shown && mix > 0.01 && now >= stageAt && !moving) {
        const current = shown.stages[stage];
        const route = current.route.map(indexOf);
        const hops = route.length - 1;
        const travel = reduced.matches ? 0 : hops * HOP_MS;
        if (!stageSaid) {
          // The step's clock starts when it does, which can be later than
          // planned: it waits for the last participant to reach its place.
          stageAt = now;
          stageSaid = true;
          captioned = indexOf(current.at ?? current.route[hops]);
          const caption = captions[captioned];
          if (caption) {
            caption.textContent = current.label;
            caption.classList.add('is-on');
          }
          stageTo.current?.(current.line);
        }
        const since = now - stageAt;
        const along = (travel ? Math.min(1, since / travel) : 1) * hops;
        context.lineWidth = 1.5;
        context.fillStyle = colour;
        for (let hop = 0; hop < hops; hop += 1) {
          const t = Math.min(1, along - hop);
          if (t <= 0) break;
          const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          const from = places[route[hop]];
          const to = places[route[hop + 1]];
          const at = {
            x: from.x + (to.x - from.x) * eased,
            y: from.y + (to.y - from.y) * eased,
          };
          context.globalAlpha = 0.6 * mix;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(at.x, at.y);
          context.stroke();
          if (t < 1) head = at;
        }
        if (head) {
          context.globalAlpha = mix;
          context.beginPath();
          context.arc(head.x, head.y, 3, 0, Math.PI * 2);
          context.fill();
        }
        if (since > travel + (reduced.matches ? 3200 : STAGE_DWELL_MS)) {
          captions[captioned]?.classList.remove('is-on');
          stage = (stage + 1) % shown.stages.length;
          // A breath between steps, so one caption has gone before the next.
          stageAt = now + 300;
          stageSaid = false;
        }
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
        // On a pathway, a participant lights as the record reaches it, and
        // the one carrying the caption holds a little of that light.
        const reached = head
          ? falloff(Math.hypot(place.x - head.x, place.y - head.y), 90)
          : 0;
        const noted = shown && index === captioned && stageSaid ? 0.45 : 0;
        icon.style.setProperty(
          '--lit',
          (Math.max(lit, held) * rest + mix * Math.max(reached, noted)).toFixed(3),
        );
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
    // The ring is sized off the copy, so it has to be re-measured whenever the
    // copy changes shape and not only when the window does. A web font
    // arriving re-wraps the statement, which moves the ring's centre and its
    // height, and a resize listener would not hear about it.
    const watch = copy ? new ResizeObserver(onResize) : null;
    if (copy) watch?.observe(copy);
    window.addEventListener('pointermove', onPointer, {passive: true});
    return () => {
      cancelAnimationFrame(frame);
      watch?.disconnect();
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
        {PARTICIPANTS.map(({id, label, Icon, small}, index) => (
          <Link
            key={id}
            to={`/docs/hiecm/v3/concepts/participants/${id}`}
            data-participant={id}
            className={`network-node${small ? '' : ' network-node--wide'}`}
            // The vertex, not the position. The stylesheet owns the ring's
            // centre and its two radii, because both have to answer to the
            // copy in front of them; all a node carries is which way out of
            // the centre it stands.
            style={
              {
                '--ux': VERTICES[index].ux.toFixed(4),
                '--uy': VERTICES[index].uy.toFixed(4),
              } as React.CSSProperties
            }>
            <Icon className="network-node__icon" strokeWidth={1.5} aria-hidden="true" />
            <span className="network-node__label">{label}</span>
            {/* Written by the frame loop while a pathway is up: which gateway
                this node stands for, and the step it is the end of. Out of
                the node's flow, so they never move the icon. */}
            <span className="network-node__notes" aria-hidden="true">
              <span className="network-node__via" />
              <span className="network-node__stage" />
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
