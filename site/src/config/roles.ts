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
      label: 'IMS',
      description: 'HIMS, LIMS, EMR and other information management systems',
      covers: ['his', 'hip', 'hiu', 'shared'],
    },
    {
      id: 'phr',
      label: 'PHR',
      description: "A Personal Health Record application, the patient's own",
      covers: ['phr', 'shared'],
    },
  ],
  uhi: [
    {
      id: 'hspa',
      label: 'HSPA',
      description: 'Offers a service',
      covers: ['hspa'],
    },
    {
      id: 'eua',
      label: 'EUA',
      description: 'Books one',
      covers: ['eua'],
    },
  ],
  nhcx: [
    {
      id: 'provider',
      label: 'Provider',
      description: 'Submits claims',
      covers: ['provider'],
    },
    {
      id: 'payer',
      label: 'Payer',
      description: 'Receives and adjudicates them',
      covers: ['payer'],
    },
  ],
};

export const rolesFor = (platformId: string): Role[] => ROLES[platformId] ?? [];

const storageKey = (platformId: string) => `abdm-portal.role.${platformId}`;

/** The query parameter that carries a role in a shared link. */
const ROLE_PARAM = 'role';

/**
 * Every `useRole` is its own `useState`, and the page has two of them: the
 * picker in the sidebar head, and the hook that scopes the tree below it.
 * Setting the role in the picker left the tree on the old value until
 * something else re-mounted it, which is why choosing a role appeared to do
 * nothing until the reader navigated.
 *
 * A custom event rather than a context: the two hooks are on opposite sides of
 * the theme's own component tree, and a provider would have to wrap the whole
 * layout to reach both.
 */
const ROLE_EVENT = 'abdm-portal:role';

/**
 * The reader's chosen role for one gateway, remembered between visits and
 * carried by a link when one is shared.
 *
 * The role is a facet, not a location, so it never enters the path: a module
 * can serve several roles (the gateway session serves all of them, M1 and M3
 * serve both HIE-CM roles), and a path segment can only put a page in one
 * place. It rides in `?role=` instead, which makes a role scoped view
 * shareable without duplicating a page or breaking a published URL.
 *
 * Precedence is link, then storage. Someone opening a colleague's link sees
 * what the colleague saw, and that choice becomes theirs.
 */
export function useRole(platformId: string): [string | null, (id: string | null) => void] {
  const [role, setRoleState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const known = (id: string | null) =>
      id && rolesFor(platformId).some((r) => r.id === id) ? id : null;

    const fromLink = known(new URLSearchParams(window.location.search).get(ROLE_PARAM));
    if (fromLink) {
      setRoleState(fromLink);
      window.localStorage.setItem(storageKey(platformId), fromLink);
      return;
    }
    setRoleState(known(window.localStorage.getItem(storageKey(platformId))));
  }, [platformId]);

  // Follow any other copy of this hook that changes the same gateway's role.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{platformId: string; id: string | null}>).detail;
      if (detail?.platformId === platformId) setRoleState(detail.id);
    };
    window.addEventListener(ROLE_EVENT, onChange);
    return () => window.removeEventListener(ROLE_EVENT, onChange);
  }, [platformId]);

  const setRole = useCallback(
    (id: string | null) => {
      setRoleState(id);
      if (typeof window === 'undefined') return;
      if (id) window.localStorage.setItem(storageKey(platformId), id);
      else window.localStorage.removeItem(storageKey(platformId));

      // Keep the address bar in step so copying it shares the current view.
      // replaceState rather than push, because choosing a role is not a
      // navigation and should not need a back press to undo.
      const url = new URL(window.location.href);
      if (id) url.searchParams.set(ROLE_PARAM, id);
      else url.searchParams.delete(ROLE_PARAM);
      window.history.replaceState(window.history.state, '', url);

      window.dispatchEvent(
        new CustomEvent(ROLE_EVENT, {detail: {platformId, id}}),
      );
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
  // A module that declares no roles is plumbing everyone needs, so it is never
  // filtered away. `shared` says the same thing explicitly, and every role
  // covers it: a PHR still has to get a session token.
  if (!moduleRoles || moduleRoles.length === 0) return true;
  return moduleRoles.some((r) => role.covers.includes(r));
}
