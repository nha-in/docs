/**
 * Where the widget's heavy parts live, and how they get loaded.
 *
 * The PDF reader, the OCR engine and the diagram renderer are all too large
 * to bundle into a script that ships to every page the assistant appears on,
 * and most readers never trigger any of them. They sit beside this script,
 * served from the same origin it was, and are fetched the first time they are
 * actually needed. Not from a CDN: a health documentation site should not
 * depend on somebody else's host being up.
 */

/**
 * currentScript is read at load, while the script is still executing, since
 * it is null by the time anything here runs. The widget embeds on other
 * people's pages, so this cannot be a path on the host page.
 */
export const ASSET_BASE = (() => {
  // The renderer is imported by a Node test with no DOM, and this runs at
  // module load rather than on first use, so the absence of a document has to
  // be a value rather than a throw.
  if (typeof document === 'undefined') return '/agent/vendor/';
  const src = (document.currentScript as HTMLScriptElement | null)?.src;
  try {
    return new URL('vendor/', src ?? '/agent/').href;
  } catch {
    return '/agent/vendor/';
  }
})();

const loaded = new Map<string, Promise<void>>();

/** Loads a classic script once, and hands every later caller the same promise. */
export function loadScript(url: string): Promise<void> {
  const already = loaded.get(url);
  if (already) return already;
  const pending = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = url;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`could not load ${url}`));
    document.head.append(el);
  });
  loaded.set(url, pending);
  return pending;
}
