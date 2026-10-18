/**
 * Tells a finished fetch whether it is still the one the reader asked for.
 * Picking a second record type while the first is loading must not let the
 * first one land on top of the second.
 */
export function createLatest() {
  let current = 0;
  return {
    next: () => ++current,
    isCurrent: (token: number) => token === current,
  };
}
