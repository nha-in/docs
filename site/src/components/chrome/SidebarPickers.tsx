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

/**
 * The control at the top of the sidebar: the version. The gateway used to sit
 * here too, but only inside the API references tab; it now lives in the top
 * bar, where it is reachable from every tab (see chrome/TopBar).
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
    </div>
  );
}
