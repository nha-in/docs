/**
 * The two things the orb asks of the browser: whether it is worth animating
 * right now, and whether it can draw with WebGL at all.
 */

/**
 * Calls back when the element starts or stops being worth animating: in view
 * and in a visible tab. A panel left open in a background tab should cost
 * nothing.
 */
export const observeActivity = (
  el: Element,
  onChange: (active: boolean) => void,
): (() => void) => {
  let inView = true;
  let pageVisible = document.visibilityState === 'visible';
  let active = inView && pageVisible;

  const sync = () => {
    const next = inView && pageVisible;
    if (next === active) return;
    active = next;
    onChange(next);
  };

  const observer = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1]?.isIntersecting ?? true;
    sync();
  });
  observer.observe(el);

  const onVisibility = () => {
    pageVisible = document.visibilityState === 'visible';
    sync();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
};

let webgl: boolean | null = null;

/**
 * Whether a WebGL context can be had without a major performance caveat.
 * Asked once per page: the answer does not change while the page is open.
 */
export const hasWebGL = (): boolean => {
  if (webgl !== null) return webgl;
  try {
    const canvas = document.createElement('canvas');
    const attributes: WebGLContextAttributes = {failIfMajorPerformanceCaveat: true};
    webgl =
      canvas.getContext('webgl2', attributes) !== null ||
      canvas.getContext('webgl', attributes) !== null;
  } catch {
    webgl = false;
  }
  return webgl;
};
