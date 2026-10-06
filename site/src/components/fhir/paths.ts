/** A route into a bundle: property names, and indexes into lists. */
export type Path = (string | number)[];

/** The key the build script uses: `entry[0].resource.type.coding[0].system`. */
export function toKey(path: Path): string {
  let key = '';
  for (const step of path) {
    if (typeof step === 'number') key += `[${step}]`;
    else key += key ? `.${step}` : step;
  }
  return key;
}

/** The value at `path`, or undefined. */
export function getAt(value: unknown, path: Path): unknown {
  let at: any = value;
  for (const step of path) {
    if (at === null || typeof at !== 'object') return undefined;
    at = at[step];
  }
  return at;
}
