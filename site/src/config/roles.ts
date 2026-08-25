/**
 * Integrator roles, per gateway.
 *
 * Every gateway splits by what the integrator is, and the split changes both
 * the API surface and the use cases. A PHR developer reading the HIP side of
 * M2 is reading something they will never implement.
 *
 * The roles a module serves are declared in its specification as
 * `info.x-abdm-roles` and reach the site through `api-sidebar.json`, so this
 * file names the choices a reader is offered and nothing else. Adding a
 * module to a role is done in the catalogue.
 */
import {useCallback, useEffect, useState} from 'react';

export type Role = {
  /** Stable id, stored against the reader's choice. */
  id: string;
  label: string;
  /** One line under the label in the picker. */
  description: string;
  /**
   * The `x-abdm-roles` values this choice covers. An information management
   * system acts as a HIP when it publishes and an HIU when it reads, so one
   * choice covers several declared roles.
   */
  covers: string[];
};

export const ROLES: Record<string, Role[]> = {
  hiecm: [
    {
      id: 'ims',
      label: 'Information Management System',
      description: 'HMIS, EMR, LIMS or a pharmacy system. Holds records and shares them.',
      covers: ['his', 'hip', 'hiu'],
    },
    {
      id: 'phr',
      label: 'PHR',
      description: "The patient's own application. Discovers, links and consents.",
      covers: ['phr'],
    },
  ],
  uhi: [
    {
      id: 'hspa',
      label: 'HSPA',
      description: 'Health Service Provider Application. Offers a service.',
      covers: ['hspa'],
    },
    {
      id: 'eua',
      label: 'EUA',
      description: 'End User Application. Books one.',
      covers: ['eua'],
    },
  ],
  nhcx: [
    {
      id: 'provider',
      label: 'Provider',
      description: 'A hospital submitting claims.',
      covers: ['provider'],
    },
    {
      id: 'payer',
      label: 'Payer',
      description: 'An insurer receiving and adjudicating them.',
      covers: ['payer'],
    },
  ],
};

export const rolesFor = (platformId: string): Role[] => ROLES[platformId] ?? [];

const storageKey = (platformId: string) => `abdm-portal.role.${platformId}`;

/**
 * The reader's chosen role for one gateway, remembered between visits.
 *
 * The choice is kept in storage rather than in the URL, so no published link
 * changes and no link breaks. Putting the role in the path is the larger move
 * described in docs/roles-design.md, and it needs redirects for every existing
 * URL before it can happen.
 */
export function useRole(platformId: string): [string | null, (id: string | null) => void] {
  const [role, setRoleState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKey(platformId));
    const known = rolesFor(platformId).some((r) => r.id === stored);
    setRoleState(known ? stored : null);
  }, [platformId]);

  const setRole = useCallback(
    (id: string | null) => {
      setRoleState(id);
      if (typeof window === 'undefined') return;
      if (id) window.localStorage.setItem(storageKey(platformId), id);
      else window.localStorage.removeItem(storageKey(platformId));
    },
    [platformId],
  );

  return [role, setRole];
}

/** True when a module declaring `moduleRoles` belongs to the chosen role. */
export function moduleMatchesRole(
  moduleRoles: string[] | undefined,
  platformId: string,
  roleId: string | null,
): boolean {
  if (!roleId) return true; // no choice made: show everything
  const role = rolesFor(platformId).find((r) => r.id === roleId);
  if (!role) return true;
  // A module that declares no roles is plumbing everyone needs, the gateway
  // session above all, so it is never filtered away.
  if (!moduleRoles || moduleRoles.length === 0) return true;
  return moduleRoles.some((r) => role.covers.includes(r));
}
