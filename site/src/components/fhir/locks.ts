import {getAt, toKey, type Path} from './paths';
import type {Annotations} from './types';

/**
 * Why a leaf cannot be edited, or null when it can. Each lock exists because
 * the edit would break the bundle without the reader seeing why.
 */
export type LockReason = 'resourceType' | 'link' | 'profile' | 'record-type' | 'fixed' | 'data' | 'narrative';

export const LOCK_LABELS: Record<LockReason, string> = {
  resourceType: 'Names the resource',
  link: 'The bundle links to it',
  profile: 'Declares the profile',
  'record-type': 'Declares the record type',
  fixed: 'Fixed by the profile',
  data: 'Base64 data',
  narrative: 'Narrative XHTML',
};

export function lockReason(root: unknown, path: Path, annotations: Annotations): LockReason | null {
  const last = path[path.length - 1];
  if (last === 'resourceType') return 'resourceType';
  if (last === 'id' || last === 'fullUrl' || last === 'reference') return 'link';
  for (let i = 0; i + 1 < path.length; i++) {
    if (path[i] === 'meta' && path[i + 1] === 'profile') return 'profile';
    if (path[i] === 'text' && path[i + 1] === 'div') return 'narrative';
  }
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== 'resource' || path[i + 1] !== 'type') continue;
    const resource = getAt(root, path.slice(0, i + 1)) as {resourceType?: string} | undefined;
    if (resource?.resourceType === 'Composition') return 'record-type';
  }
  for (let i = path.length; i >= 0; i--) {
    if (annotations[toKey(path.slice(0, i))]?.fixed !== undefined) return 'fixed';
  }
  // Base64 content, and the contentType that describes it: changing the type
  // alone would mislabel data the reader cannot change.
  if (last === 'data' || last === 'contentType') {
    const parent = getAt(root, path.slice(0, -1)) as object | undefined;
    if (parent && typeof parent === 'object' && 'contentType' in parent && 'data' in parent) return 'data';
  }
  return null;
}
