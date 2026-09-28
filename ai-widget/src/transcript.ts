/**
 * Which turns the model is shown.
 *
 * Some exchanges are the panel talking to itself: the install flow, and the
 * question asking which module a command is about. They are in the thread
 * because the reader had them, but they are not part of the conversation the
 * model answers, and the server wants roles that alternate strictly, user
 * first and user last. So a panel-only answer goes with the turn it answered,
 * as a pair, and what is left still alternates.
 */
type Said = {from: 'you' | 'assistant'; install?: unknown; local?: boolean};

export function forModel<T extends Said>(turns: T[]): T[] {
  const out: T[] = [];
  for (const turn of turns) {
    if (turn.from === 'assistant' && (turn.install || turn.local)) {
      if (out.length && out[out.length - 1].from === 'you') out.pop();
      continue;
    }
    out.push(turn);
  }
  return out;
}

/**
 * How many turns go to the server with a question: the question and the eight
 * exchanges before it. The server's MaxTurns (mcp/internal/chat/loop.go) is
 * the same number, and a request over it is refused, so the two move together.
 */
export const MAX_TURNS = 17;

/**
 * How much of the conversation the next question takes with it.
 *
 * Readers said the panel forgot what they had asked, and nothing on screen
 * told them it remembers a fixed number of exchanges. The limit that binds is
 * that number, not the model's context window, which no conversation here
 * comes near: each question goes with the eight exchanges before it. So the
 * count is of exchanges, and the panel's own answers take none.
 */
export function memoryOf<T extends Said>(turns: T[]) {
  const earlier = Math.floor(forModel(turns).length / 2);
  const window = (MAX_TURNS - 1) / 2;
  return {earlier, window, full: earlier >= window};
}
