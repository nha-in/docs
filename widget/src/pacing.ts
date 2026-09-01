/**
 * How fast an answer is revealed.
 *
 * A stream does not arrive evenly: a tool call, a second of silence, then a
 * whole paragraph in one packet. Rendering each packet the moment it lands is
 * what makes a streamed answer stutter, and it is why a chat panel can feel
 * slower than it is. Text is buffered instead and drained on the display's own
 * clock, a share of the backlog per frame, so the answer reads at an even pace
 * whatever the network did.
 */

/** The panel thinks for at least this long before it shows a word. */
export const THINKING_HOLD = 550;
/** Unless this much is already waiting, in which case it gets on with it. */
export const THINKING_BURST = 220;
/** Share of the waiting text taken each frame: a sixth drains in ~100ms. */
const REVEAL_SHARE = 6;
/** Never fewer than this many characters a frame, or a long tail crawls. */
const REVEAL_FLOOR = 2;

/**
 * How many characters to reveal this frame. Zero means hold: either nothing
 * has arrived, or the panel is still visibly thinking and a fast first token
 * would otherwise flash a word up in place of the indicator.
 */
export function revealStep(
  backlog: number,
  sinceAsk: number,
  revealing: boolean,
  atOnce: boolean,
): number {
  if (backlog <= 0) return 0;
  if (!revealing && sinceAsk < THINKING_HOLD && backlog < THINKING_BURST) {
    return 0;
  }
  if (atOnce) return backlog;
  return Math.min(backlog, Math.max(REVEAL_FLOOR, Math.ceil(backlog / REVEAL_SHARE)));
}
