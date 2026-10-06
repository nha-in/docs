// Annotates every node of an ABDM example bundle from the NRCeS profiles: the
// snapshot element that governs it, its cardinality, any fixed or pattern
// value, any binding, and the link to that element on nrces.in. Everything is
// read from StructureDefinition snapshots. Where a sliced list cannot be
// matched to one slice from the instance, the node takes the unsliced element:
// the annotation is then less specific, never wrong.

const IG = 'https://nrces.in/ndhm/fhir/r4';

/** Every StructureDefinition in the package that carries a snapshot, by url. */
export function structureDefinitions(files) {
  const sds = new Map();
  for (const [path, buf] of files) {
    if (!/^package\/StructureDefinition-[^/]+\.json$/.test(path)) continue;
    const sd = JSON.parse(buf);
    if (sd.snapshot?.element) sds.set(sd.url, sd);
  }
  return sds;
}

const indexes = new WeakMap();
/** Elements by id, and each element's direct children names. */
function index(sd) {
  if (!indexes.has(sd)) {
    const byId = new Map(sd.snapshot.element.map((e) => [e.id, e]));
    indexes.set(sd, byId);
  }
  return indexes.get(sd);
}

const fixedOf = (e) => {
  const key = e && Object.keys(e).find((k) => k.startsWith('fixed') || k.startsWith('pattern'));
  return key === undefined ? undefined : e[key];
};

/** True when `pattern` is contained in `value`: equal primitives, or every key matching. */
function contains(value, pattern) {
  if (pattern === null || typeof pattern !== 'object') return value === pattern;
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(pattern)) {
    return Array.isArray(value) && pattern.every((p) => value.some((v) => contains(v, p)));
  }
  return Object.entries(pattern).every(([k, p]) => contains(value[k], p));
}

/** The element id for property `key` under element `parent`, or null. */
function childId(byId, parent, key) {
  if (byId.has(`${parent}.${key}`)) return `${parent}.${key}`;
  for (const id of byId.keys()) {
    if (!id.startsWith(`${parent}.`) || !id.endsWith('[x]')) continue;
    const name = id.slice(parent.length + 1, -3);
    if (name.includes('.') || name.includes(':')) continue;
    if (key.startsWith(name) && /^[A-Z]/.test(key.slice(name.length))) return id;
  }
  return null;
}

/** The slice of `elementId` this list item belongs to, or the element itself. */
function sliceFor(byId, elementId, item) {
  const discriminators = byId.get(elementId)?.slicing?.discriminator ?? [];
  if (!discriminators.length || !discriminators.every((d) => d.type === 'value' || d.type === 'pattern')) {
    return elementId;
  }
  const slices = [...byId.keys()].filter((id) => id.startsWith(`${elementId}:`) && !/[.:]/.test(id.slice(elementId.length + 1)));
  // Every value at a discriminator path, crossing lists the way FHIRPath does:
  // `code.coding.code` reads the code of every coding, not `.code` of a list.
  const at = (value, path) => {
    let values = [value];
    if (path === '$this') return values;
    for (const k of path.split('.')) {
      values = values.flatMap((v) => (v == null || typeof v !== 'object' ? [] : [v[k]].flat()));
    }
    return values.filter((v) => v !== undefined);
  };
  for (const slice of slices) {
    const matches = discriminators.every((d) => {
      if (!/^(\$this|[A-Za-z]+(\.[A-Za-z]+)*)$/.test(d.path)) return false;
      const expected = fixedOf(byId.get(d.path === '$this' ? slice : `${slice}.${d.path}`));
      return expected !== undefined && at(item, d.path).some((v) => contains(v, expected));
    });
    if (matches) return slice;
  }
  return elementId;
}

function annotation(sd, element) {
  const e = index(sd).get(element);
  const a = {
    element,
    profile: sd.name,
    min: e.min,
    max: e.max,
    anchor: `${IG}/StructureDefinition-${sd.id}-definitions.html#key_${element}`,
  };
  const fixed = fixedOf(e);
  if (fixed !== undefined) a.fixed = fixed;
  if (e.binding?.valueSet) a.binding = {strength: e.binding.strength, valueSet: e.binding.valueSet};
  return a;
}

/** Annotations for every node of `bundle`, keyed by JSON path ("" for the root). */
export function annotateBundle(bundle, sdsByUrl) {
  const out = {};
  const profileOf = (resource) => sdsByUrl.get(resource?.meta?.profile?.[0]);

  const walk = (node, sd, element, key) => {
    if (element) out[key] = annotation(sd, element);
    if (node === null || typeof node !== 'object') return;
    const byId = sd && index(sd);
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, sd, element && sliceFor(byId, element, item), `${key}[${i}]`));
      return;
    }
    for (const [prop, value] of Object.entries(node)) {
      const at = key ? `${key}.${prop}` : prop;
      if (prop === 'resource' && value?.resourceType && profileOf(value)) {
        const own = profileOf(value);
        walk(value, own, value.resourceType, at);
        continue;
      }
      const child = element && !prop.startsWith('_') ? childId(byId, element, prop) : null;
      walk(value, sd, child, at);
    }
  };

  const root = profileOf(bundle);
  walk(bundle, root, root ? bundle.resourceType : null, '');
  return out;
}
