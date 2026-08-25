import React from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
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
  activeTab,
  activeVersion,
  platforms,
  type Platform,
} from '@site/src/config/navigation';

/**
 * The controls at the top of the sidebar: the gateway, when the reader is in
 * the API references tab, and the version always.
 */
export default function SidebarPickers(): React.ReactNode {
  const {pathname} = useLocation();
  const history = useHistory();
  const platform: Platform = activePlatform(pathname) ?? platforms[0];
  const version = activeVersion(platform, pathname);
  // In the API references tab a reader is inside one gateway's contract, so
  // the gateway is a control here. In the Overview tab it is a branch of the
  // tree instead, and a second way to switch would just be noise.
  const inApiTab = activeTab(pathname)?.id === 'api';

  return (
    <div className="sidebar-pickers">
      {inApiTab ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="sidebar-picker sidebar-picker--platform"
            aria-label={`Gateway: ${platform.label}`}>
            <span className="sidebar-picker__value">{platform.label}</span>
            <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>Gateway</DropdownMenuLabel>
            {platforms.map((entry) => (
              <DropdownMenuItem
                key={entry.id}
                className="sidebar-picker__option"
                onSelect={() => history.push(entry.apiTo)}>
                <span className="sidebar-picker__option-main">
                  <span className="sidebar-picker__option-label">
                    {entry.label}
                  </span>
                  <span className="sidebar-picker__option-note">
                    {entry.description}
                  </span>
                </span>
                {entry.id === platform.id ? (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

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
