// Drives the landing page's split flap board and asserts what it says.
//
// The board answers three different things and the difference is the whole
// point of it: the participant the pointer is resting on, the delivery the
// idle walk is making, and the portal's own name when neither is true. The
// third case is the one that had no test and the one that was wrong: a pointer
// moving across empty canvas left whichever node it last passed on the board,
// so the board read as stuck rather than as answering the reader.
//
// None of that is reachable from a unit test. The message is decided inside a
// requestAnimationFrame loop in NetworkWeb that reads real pointer positions
// against a real canvas size, so the check drives a real browser.
//
//   node scripts/check-flap-board.mjs [http://localhost:4321]
//
// Serve a build first: npm run build && npm run serve --workspace site
import {chromium} from 'playwright';

const origin = process.argv[2] ?? 'http://localhost:4321';
const RESTING = 'ABDM Developer Portal';

// A blank flap carries no character, so reading the cells back gives the
// message with its spaces missing. Both sides are reduced to the letters and
// digits before they are compared, which is the part the reader reads anyway.
const letters = (text) => text.toUpperCase().replace(/[^A-Z0-9]/g, '');
const isResting = (text) => letters(text) === letters(RESTING);

// NetworkWeb waits this long after the last pointer move before the idle walk
// takes the board over. Anything the pointer is meant to prove has to happen
// inside it, so the pointer is kept moving.
const IDLE_AFTER = 3000;

const failures = [];
function check(name, actual, wants) {
  const ok = wants(actual);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}: ${JSON.stringify(actual)}`);
  if (!ok) failures.push(name);
}

/** What the board is showing, read off the flaps rather than off the label. */
const board = (page) =>
  page.evaluate(() => {
    const cells = document.querySelectorAll('.flap__cell');
    return Array.from(cells)
      .map((cell) => {
        // Mid turn a cell holds both faces. The incoming one is what it is
        // becoming, which is what the reader ends up with.
        const incoming = cell.querySelector('.flap__face--in');
        const face = incoming ?? cell.querySelector('.flap__face');
        return face?.textContent ?? '';
      })
      .join('')
      .trim();
  });

/** Where a participant is drawn, in page pixels. */
const nodeBox = (page, id) =>
  page.evaluate((wanted) => {
    const icon = document.querySelector(`[data-participant="${wanted}"]`);
    const box = (icon ?? document.querySelector('[data-participant]'))?.getBoundingClientRect();
    return box ? {x: box.x + box.width / 2, y: box.y + box.height / 2} : null;
  }, id);

/** Keep the pointer moving, so the idle walk never takes the board. */
async function jiggle(page, at, times = 12) {
  for (let i = 0; i < times; i += 1) {
    await page.mouse.move(at.x + (i % 2), at.y + ((i + 1) % 2));
    await page.waitForTimeout(60);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1440, height: 900}});
try {
  await page.goto(origin, {waitUntil: 'networkidle'});
  await page.waitForSelector('.flap__cell');

  check('the board rests on the portal name', await board(page), isResting);

  // Sit on a participant until the board answers for it. Which participant is
  // whichever the drawing puts first; the assertion is that the board leaves
  // the resting name, not that it lands on a particular line.
  const icon = await page.evaluate(() => {
    const first = document.querySelector('[data-participant]');
    if (!first) return null;
    const box = first.getBoundingClientRect();
    return {x: box.x + box.width / 2, y: box.y + box.height / 2};
  });
  if (!icon) {
    throw new Error('no participant icon on the page, so there is nothing to point at');
  }
  await jiggle(page, icon, 16);
  const pointed = await board(page);
  check('pointing at a participant takes the board off the resting name',
    pointed, (t) => !isResting(t) && letters(t).length > 0);

  // Now the case this check exists for. Move away, keep moving, and the board
  // must go home rather than hold the participant's line.
  const empty = {x: 8, y: 8};
  await jiggle(page, empty, 20);
  check('moving away from every participant sends the board home',
    await board(page), isResting);

  // And the walk still owns the board once the pointer stops. This is the
  // slow half of the check and the one worth having: the board holds the line
  // it is showing for the whole crossing and turns over when the courier
  // arrives, so at no moment does it show anything that is not one of its own
  // lines. Sampling is the only way to see that from outside.
  const LINES = [
    RESTING,
    'Unique health identity',
    'Your records, in one place',
    'Unified health services',
    'Interoperable medical records',
    'History at the point of care',
    'Reports that reach you',
    'Prescriptions that travel',
    'Faster insurance claims',
  ].map(letters);
  const isALine = (text) => LINES.includes(letters(text));

  // A sample only counts once the board has held it still for three reads in
  // a row. The cells turn one after another, so a sample taken mid turn reads
  // as half of the old line and half of the new one, which is neither and is
  // not a defect. A whole turn finishes well inside 600ms, so nothing that is
  // still turning survives the hold, and what does survive is what a reader
  // actually gets to read.
  const seen = new Set();
  const strays = new Set();
  let held = null;
  let holds = 0;
  // Long enough for the walk to start (IDLE_AFTER), make a delivery and rest,
  // with room for a second one.
  for (let waited = 0; waited < 16_000; waited += 200) {
    await page.waitForTimeout(200);
    const showing = await board(page);
    if (!letters(showing)) continue;
    if (letters(showing) === held) holds += 1;
    else {
      held = letters(showing);
      holds = 1;
    }
    if (holds !== 3) continue;
    if (isALine(showing)) seen.add(letters(showing));
    else strays.add(showing);
  }
  check('the walk turns the board over to another of its lines',
    seen.size, (n) => n >= 2);
  check('and every line it settles on is one of its own',
    [...strays], (list) => list.length === 0);
} finally {
  await browser.close();
}

if (failures.length) {
  console.log(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nThe board answers the pointer, and goes home when the pointer answers nobody.');
