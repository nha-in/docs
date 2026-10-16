/**
 * What the composer offers after an answer: the next step, and related
 * questions.
 *
 * The next step is the call that follows in the journey the answer sits in.
 * It sits in the empty box as grey text and Tab takes it. Related questions
 * are other things worth asking; they open above the box while it has focus,
 * the arrow keys move between them, and the one the reader moves to takes
 * the box. Nothing here touches the page: it says what is on offer and what
 * a key means, so both can be tested without a browser.
 */
import type {Suggestion} from './sse';

export type Tray = {
  /** Which related question the reader moved to; -1 while on none. */
  active: number;
  /** The reader put the suggestions away for this answer. */
  dismissed: boolean;
};

export const CLOSED: Tray = {active: -1, dismissed: false};

export const related = (suggestions: Suggestion[]) => suggestions.filter((s) => s.kind !== 'step');

/**
 * Whether anything is on offer: an empty box, something to suggest, nothing
 * in flight, and the reader has not put the suggestions away.
 */
export function offering(
  draft: string,
  suggestions: Suggestion[],
  tray: Tray,
  busy: boolean,
): boolean {
  return !busy && draft === '' && suggestions.length > 0 && !tray.dismissed;
}

/**
 * What the box shows: the related question the reader moved to, else the
 * next step, else nothing. A related question never takes the box unasked.
 */
export function shownOf(suggestions: Suggestion[], tray: Tray): Suggestion | null {
  const rel = related(suggestions);
  if (tray.active >= 0) return rel[Math.min(tray.active, rel.length - 1)] ?? null;
  return suggestions.find((s) => s.kind === 'step') ?? null;
}

export type TrayKey =
  | {kind: 'none'}
  | {kind: 'fill'; text: string}
  | {kind: 'move'; tray: Tray}
  | {kind: 'dismiss'; tray: Tray};

/**
 * What a key press means while something is on offer. Tab takes what the box
 * shows and is left alone when it shows nothing; Shift and Tab is always left
 * alone, so a reader moving backwards through the page is never held in the
 * box. Escape puts the offer away so Tab moves on as usual.
 */
export function trayKey(
  key: string,
  shift: boolean,
  suggestions: Suggestion[],
  tray: Tray,
): TrayKey {
  if (suggestions.length === 0) return {kind: 'none'};
  const n = related(suggestions).length;
  if (key === 'Tab' && !shift) {
    const shown = shownOf(suggestions, tray);
    return shown ? {kind: 'fill', text: shown.prompt} : {kind: 'none'};
  }
  if (key === 'ArrowDown' && n > 0)
    return {kind: 'move', tray: {...tray, active: Math.min(tray.active + 1, n - 1)}};
  if (key === 'ArrowUp' && n > 0)
    return {kind: 'move', tray: {...tray, active: Math.max(tray.active - 1, -1)}};
  if (key === 'Escape') return {kind: 'dismiss', tray: {...tray, dismissed: true}};
  return {kind: 'none'};
}
