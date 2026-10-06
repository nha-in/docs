import {toKey, type Path} from './paths';
import type {Annotations} from './types';

export type SetResult<T> = {ok: true; value: T} | {ok: false; reason: 'not-a-number' | 'not-a-boolean'};

const NUMBER = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;

/**
 * A copy of `value` with the leaf at `path` set from what the reader typed.
 * The leaf keeps its JSON type: a number stays a number and a boolean a
 * boolean, and text that cannot be either is refused rather than written as
 * a string. `value` itself is never changed.
 */
export function setAt<T>(value: T, path: Path, raw: string): SetResult<T> {
  const current = path.reduce<any>((at, step) => at?.[step], value);
  let next: unknown = raw;
  if (typeof current === 'number') {
    if (!NUMBER.test(raw.trim())) return {ok: false, reason: 'not-a-number'};
    next = Number(raw.trim());
  } else if (typeof current === 'boolean') {
    if (raw !== 'true' && raw !== 'false') return {ok: false, reason: 'not-a-boolean'};
    next = raw === 'true';
  }
  const write = (node: any, depth: number): any => {
    if (depth === path.length) return next;
    const step = path[depth];
    const copy = Array.isArray(node) ? [...node] : {...node};
    copy[step as any] = write(node[step as any], depth + 1);
    return copy;
  };
  return {ok: true, value: write(value, 0)};
}

/** Keys of leaves the profile requires (min 1 or more) that are now empty. */
export function emptyRequired(value: unknown, annotations: Annotations): string[] {
  const out: string[] = [];
  const walk = (node: unknown, path: Path) => {
    if (node !== null && typeof node === 'object') {
      if (Array.isArray(node)) node.forEach((item, i) => walk(item, [...path, i]));
      else for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
      return;
    }
    const key = toKey(path);
    if (node === '' && (annotations[key]?.min ?? 0) >= 1) out.push(key);
  };
  walk(value, []);
  return out;
}
