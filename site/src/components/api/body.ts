import type {Field} from './ApiEndpoint';

export type BodyNode = {
  field: Field;
  /** The last dotted segment. What the reader is actually typing a value for. */
  leaf: string;
  children: BodyNode[];
};

/** True when no other row is a child of this one, so this row takes an input. */
function hasChildren(fields: Field[], name: string): boolean {
  return fields.some((other) => other.name.startsWith(`${name}.`));
}

/**
 * Rebuild the nesting the generator flattened away.
 *
 * Depth lives only in the dot in `name`, so the parent of `a.b.c` is whichever
 * row is called `a.b`. Rows whose parent is missing are hoisted to the root
 * rather than dropped: a spec that skips a level should still be fillable.
 */
export function toTree(fields: Field[]): BodyNode[] {
  const byName = new Map<string, BodyNode>();
  const roots: BodyNode[] = [];
  for (const field of fields) {
    const segments = field.name.split('.');
    const node: BodyNode = {field, leaf: segments[segments.length - 1], children: []};
    byName.set(field.name, node);
    const parent = byName.get(segments.slice(0, -1).join('.'));
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

/** Rows that take an input: everything with no children of its own. */
export function leaves(fields: Field[]): Field[] {
  return fields.filter((field) => !hasChildren(fields, field.name));
}

function cast(type: string, text: string): unknown {
  if (type.endsWith('[]')) {
    const item = type.slice(0, -2);
    return text
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => cast(item, value));
  }
  if (type === 'number' || type === 'integer') {
    const value = Number(text);
    // A half typed number stays visible rather than being sent as NaN.
    return Number.isFinite(value) ? value : text;
  }
  if (type === 'boolean') return text === 'true';
  return text;
}

/**
 * Build the JSON body from what the reader typed.
 *
 * An empty box is an omitted key, not a null: the specs mark whole branches
 * optional (`authData.otp` beside `authData.password`) and sending the unused
 * branch as empty strings is what NHA rejects.
 */
export function compose(
  fields: Field[],
  values: Record<string, string>,
): Record<string, unknown> {
  const types = new Map(fields.map((field) => [field.name, field.type]));
  const root: Record<string, unknown> = {};
  for (const field of leaves(fields)) {
    const text = (values[field.name] ?? '').trim();
    if (!text) continue;
    const segments = field.name.split('.');
    let cursor: Record<string, unknown> = root;
    for (let index = 0; index < segments.length - 1; index += 1) {
      const prefix = segments.slice(0, index + 1).join('.');
      const array = (types.get(prefix) ?? '').endsWith('[]');
      if (cursor[segments[index]] === undefined) {
        cursor[segments[index]] = array ? [{}] : {};
      }
      const next = cursor[segments[index]];
      // The flattened rows carry no index, so an array of objects is edited as
      // its first element. The raw tab is the way to send more than one.
      cursor = (Array.isArray(next) ? next[0] : next) as Record<string, unknown>;
    }
    cursor[segments[segments.length - 1]] = cast(field.type, text);
  }
  return root;
}

/** Read a dotted path out of a JSON value, stepping into element zero of arrays. */
function read(value: unknown, segments: string[]): unknown {
  let cursor = value;
  for (const segment of segments) {
    if (Array.isArray(cursor)) cursor = cursor[0];
    if (!cursor || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

/** Fill the per field boxes from a JSON value: the spec example, or typed JSON. */
export function seed(fields: Field[], example: unknown): Record<string, string> {
  const values: Record<string, string> = {};
  if (!example || typeof example !== 'object') return values;
  for (const field of leaves(fields)) {
    const found = read(example, field.name.split('.'));
    if (found === undefined || found === null) continue;
    if (Array.isArray(found)) values[field.name] = found.map(String).join(', ');
    else if (typeof found === 'object') continue; // A shape the rows do not describe.
    else values[field.name] = String(found);
  }
  return values;
}
