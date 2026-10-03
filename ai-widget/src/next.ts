/**
 * The next question, offered in the composer.
 *
 * The best one sits in the empty box as grey text and Tab takes it; the rest
 * open above the box while it has focus, and the arrow keys move between
 * them. Nothing here touches the page: it says what is on offer and what a
 * key means, so both can be tested without a browser.
 */
import type {Suggestion} from './sse';

export type Tray = {
  /** Which suggestion the box shows and the tray marks. */
  active: number;
  /** The reader put the suggestions away for this answer. */
  dismissed: boolean;
};

export const CLOSED: Tray = {active: 0, dismissed: false};

/**
 * Whether a next question is on offer: an empty box, something to suggest,
 * nothing in flight, and the reader has not put the suggestions away.
 */
export function offering(
  draft: string,
  suggestions: Suggestion[],
  tray: Tray,
  busy: boolean,
): boolean {
  return !busy && draft === '' && suggestions.length > 0 && !tray.dismissed;
}

export type TrayKey =
  | {kind: 'none'}
  | {kind: 'fill'; text: string}
  | {kind: 'move'; tray: Tray}
  | {kind: 'dismiss'; tray: Tray};

/**
 * What a key press means while a next question is on offer. Shift and Tab is
 * left alone, so a reader moving backwards through the page is never held in
 * the box, and Escape puts the offer away so Tab moves on as usual.
 */
export function trayKey(
  key: string,
  shift: boolean,
  suggestions: Suggestion[],
  tray: Tray,
): TrayKey {
  const n = suggestions.length;
  if (n === 0) return {kind: 'none'};
  const at = Math.min(tray.active, n - 1);
  if (key === 'Tab' && !shift) return {kind: 'fill', text: suggestions[at].prompt};
  if (key === 'ArrowDown') return {kind: 'move', tray: {...tray, active: (at + 1) % n}};
  if (key === 'ArrowUp') return {kind: 'move', tray: {...tray, active: (at - 1 + n) % n}};
  if (key === 'Escape') return {kind: 'dismiss', tray: {...tray, dismissed: true}};
  return {kind: 'none'};
}
