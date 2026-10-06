import {lockReason} from './locks';
import {toKey, type Path} from './paths';
import type {Annotations} from './types';

/**
 * Sorts a bundle's editable fields into the builder's steps. Only leaves the
 * reader may change become fields: ids, references, profiles, fixed codes,
 * base64 and narrative stay in the JSON and out of the form.
 */

export type FieldStep = 'patient' | 'author' | 'clinical';

/** `main` fields show by default; the rest wait under "More fields". */
export type Field = {path: Path; key: string; label: string; required: boolean; main: boolean; anchor?: string};

export type Group = {step: FieldStep; title: string; fields: Field[]};

const AUTHOR = new Set(['Practitioner', 'PractitionerRole', 'Organization']);

const stepOf = (resourceType: string): FieldStep =>
  resourceType === 'Patient' ? 'patient' : AUTHOR.has(resourceType) ? 'author' : 'clinical';

const NAMES: Record<string, string> = {
  birthDate: 'Date of birth',
  name: 'Name',
};

/** Names that say little alone, so the parent's name goes in front. */
const QUALIFIED = new Set(['value', 'code', 'display', 'system', 'unit', 'start', 'end', 'text', 'family', 'given', 'use', 'type']);

const words = (name: string) => {
  const spaced = name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return spaced[0].toUpperCase() + spaced.slice(1);
};

/** A readable name for a field: `name[0].text` is "Name", `code.coding[0].display` is "Code display". */
export function labelOf(path: Path): string {
  const names = path.filter((step): step is string => typeof step === 'string' && step !== 'coding');
  const last = names[names.length - 1];
  const parent = names[names.length - 2];
  if (last === 'text' && parent) return NAMES[parent] ?? words(parent);
  if (NAMES[last]) return NAMES[last];
  if (parent && QUALIFIED.has(last)) return `${words(parent)} ${last.toLowerCase()}`;
  return words(last);
}

/**
 * Whether a field is one a person fills in, rather than plumbing. The rest are
 * still editable, one click away. Paths start `entry, i, resource`, so the
 * resource's own properties begin at index 3.
 */
function isMain(bundle: any, path: Path): boolean {
  const own = path.slice(3);
  const last = own[own.length - 1];
  if (own[0] === 'meta' || own[0] === 'text' || own[0] === 'language' || own[0] === 'section') return false;
  if (own.includes('extension') || own.includes('modifierExtension')) return false;
  if (last === 'system' || last === 'use') return false;
  const identifier = own.indexOf('identifier');
  if (identifier !== -1 && own[identifier + 2] === 'type') return false;
  if (last === 'display') {
    let parent: any = bundle;
    for (const step of path.slice(0, -1)) parent = parent?.[step];
    if (parent && typeof parent === 'object' && 'reference' in parent) return false;
  }
  return true;
}

/** What a resource is, in a few words: "Condition: Abdominal pain". */
function titleOf(resource: any): string {
  const concept = (c: any) => c?.text ?? c?.coding?.[0]?.display;
  const name = (n: any) => (typeof n === 'string' ? n : n?.[0]?.text ?? [n?.[0]?.given, n?.[0]?.family].flat().filter(Boolean).join(' '));
  if (resource.resourceType === 'Composition') return resource.title ? `Record: ${resource.title}` : 'Record';
  const what =
    concept(resource.code) ??
    concept(resource.medicationCodeableConcept) ??
    concept(resource.vaccineCode) ??
    concept(resource.type) ??
    (name(resource.name) || undefined);
  return what ? `${resource.resourceType}: ${what}` : resource.resourceType;
}

/** Every editable field in the bundle, one group per entry, Composition first. */
export function groupFields(bundle: any, annotations: Annotations): Group[] {
  const groups: Group[] = [];
  (bundle?.entry ?? []).forEach((entry: any, i: number) => {
    const resource = entry?.resource;
    if (!resource?.resourceType) return;
    const fields: Field[] = [];
    const walk = (value: unknown, path: Path) => {
      if (value !== null && typeof value === 'object') {
        const items = Array.isArray(value) ? value.map((v, j) => [j, v] as const) : Object.entries(value);
        for (const [step, child] of items) walk(child, [...path, step]);
        return;
      }
      if (lockReason(bundle, path, annotations) !== null) return;
      const key = toKey(path);
      const a = annotations[key];
      fields.push({path, key, label: labelOf(path), required: (a?.min ?? 0) >= 1, main: isMain(bundle, path), anchor: a?.anchor});
    };
    walk(resource, ['entry', i, 'resource']);
    if (fields.length) groups.push({step: stepOf(resource.resourceType), title: titleOf(resource), fields});
  });
  return groups;
}
