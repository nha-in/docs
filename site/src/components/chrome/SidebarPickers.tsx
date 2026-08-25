import React from 'react';
import {useHistory} from '@docusaurus/router';
import {Check, ChevronDown} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@site/src/components/ui/dropdown-menu';
import {
  activePlatform,
  activeVersion,
  platforms,
  type Platform,
  useRoutePath,
} from '@site/src/config/navigation';
import {rolesFor, useRole} from '@site/src/config/roles';

/**
 * The controls at the top of the sidebar: the version and the role.
 *
 * The gateway used to sit here too, but only inside the API references tab; it
 * now lives in the top bar, where it is reachable from every tab.
 *
 * The role is here rather than in the top bar because it scopes the tree
 * directly below it, and it is present on every page of every gateway that
 * declares roles.
 */
export default function SidebarPickers(): React.ReactNode {
  const pathname = useRoutePath();
  const history = useHistory();
  const platform: Platform = activePlatform(pathname) ?? platforms[0];
  const version = activeVersion(platform, pathname);
  return (
    <div className="sidebar-pickers">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="sidebar-picker sidebar-picker--version"
          aria-label={`Version: ${version.label}`}>
          {/* The bare "V3" read as a label of unknown kind. Naming the field
              in front of it says what is being chosen before it is chosen. */}
          <span className="sidebar-picker__field">Version</span>
          <span className="sidebar-picker__value">{version.label}</span>
          <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>{platform.label} version</DropdownMenuLabel>
          {platform.versions.map((entry) => (
            <DropdownMenuItem
              key={entry.label}
              className="sidebar-picker__option"
              disabled={!entry.to}
              onSelect={() => entry.to && history.push(entry.to)}>
              <span className="sidebar-picker__option-main">
                <span className="sidebar-picker__option-label">
                  {entry.label}
                </span>
                {entry.note ? (
                  <span className="sidebar-picker__option-note">{entry.note}</span>
                ) : null}
              </span>
              {entry.label === version.label ? (
                <Check className="size-4 shrink-0" aria-hidden="true" />
              ) : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="sidebar-picker__footnote">
            Versions track NHA's specification versions, not this portal's
            release cadence.
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>

      <RolePicker platform={platform} />
    </div>
  );
}

/**
 * Which kind of integrator the reader is. The choice scopes the tree to the
 * modules that role actually implements, so a PHR developer is not reading the
 * provider side of M2.
 *
 * "Everything" is a real choice, not a placeholder: someone building both
 * sides, or comparing them, needs the unfiltered tree.
 */
function RolePicker({platform}: {platform: Platform}): React.ReactNode {
  const roles = rolesFor(platform.id);
  const [role, setRole] = useRole(platform.id);
  if (roles.length === 0) return null;
  const current = roles.find((r) => r.id === role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="sidebar-picker sidebar-picker--role"
        aria-label={`Role: ${current?.label ?? 'Everything'}`}>
        <span className="sidebar-picker__field">Role</span>
        <span className="sidebar-picker__value">{current?.label ?? 'Everything'}</span>
        <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{platform.label} role</DropdownMenuLabel>
        <DropdownMenuItem
          className="sidebar-picker__option"
          onSelect={() => setRole(null)}>
          <span className="sidebar-picker__option-label">
            Everything
            <span className="sidebar-picker__option-note">
              Every module this gateway has.
            </span>
          </span>
          {role === null ? <Check className="size-3.5" aria-hidden="true" /> : null}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {roles.map((entry) => (
          <DropdownMenuItem
            key={entry.id}
            className="sidebar-picker__option"
            onSelect={() => setRole(entry.id)}>
            <span className="sidebar-picker__option-label">
              {entry.label}
              <span className="sidebar-picker__option-note">{entry.description}</span>
            </span>
            {role === entry.id ? <Check className="size-3.5" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
