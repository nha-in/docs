import React from 'react';
import {useHistory} from '@docusaurus/router';
import {Check, SlidersHorizontal} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '@site/src/components/ui/popover';
import {
  activePlatform,
  activeVersion,
  platforms,
  type Platform,
  useRoutePath,
} from '@site/src/config/navigation';
import {rolesFor, useRole} from '@site/src/config/roles';

/**
 * The controls at the top of the sidebar, behind one equaliser button.
 *
 * Version and role were two pickers sitting side by side, which read as two
 * pieces of chrome competing with the tree below them and left the role
 * truncated to "Information Mana...". They are the same kind of thing, a
 * setting that changes what the tree shows, so they live together behind one
 * control that says so.
 *
 * The button carries a dot whenever a setting is off its default, because a
 * filtered tree with no visible sign of filtering is how a reader concludes a
 * page is missing.
 */
export default function SidebarPickers({
  showVersion = true,
}: {
  /**
   * The version belongs to the API reference, the way it does on the
   * reference sites this follows: a version is a property of the contract
   * you are calling, not of the guides that explain it. The role is a
   * property of the reader, so it shows on both sidebars.
   */
  showVersion?: boolean;
} = {}): React.ReactNode {
  const pathname = useRoutePath();
  const history = useHistory();
  // Controlled, so that choosing something closes the panel. A setting that
  // takes effect behind an open panel leaves the reader looking at the panel
  // rather than at what they just changed.
  const [open, setOpen] = React.useState(false);
  const platform: Platform = activePlatform(pathname) ?? platforms[0];
  const version = activeVersion(platform, pathname);
  const roles = rolesFor(platform.id);
  const [role, setRole] = useRole(platform.id);
  const currentRole = roles.find((r) => r.id === role);
  const filtered = currentRole !== undefined;

  return (
    <div className="sidebar-pickers">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="sidebar-settings"
          aria-label={`Settings.${showVersion ? ` Version ${version.label}` : ''}${
            roles.length > 0 ? ` Role ${currentRole?.label ?? 'Everything'}` : ''
          }`}>
          <SlidersHorizontal className="size-4 shrink-0" aria-hidden="true" />
          <span className="sidebar-settings__summary">
            {showVersion ? version.label : null}
            {showVersion && roles.length > 0 ? ' · ' : null}
            {roles.length > 0 ? (currentRole?.label ?? 'Everything') : null}
          </span>
          {filtered ? <span className="sidebar-settings__dot" aria-hidden="true" /> : null}
        </PopoverTrigger>

        <PopoverContent align="start" className="sidebar-settings__panel">
          {showVersion ? (
          <Group label={`${platform.label} version`}>
            {platform.versions.map((entry) => (
              <Option
                key={entry.label}
                label={entry.label}
                note={entry.note}
                selected={entry.label === version.label}
                disabled={!entry.to}
                onSelect={() => {
                  if (!entry.to) return;
                  setOpen(false);
                  history.push(entry.to);
                }}
              />
            ))}
            <p className="sidebar-settings__footnote">
              Versions track the specification's versions, not this portal's.
            </p>
          </Group>
          ) : null}

          {roles.length > 0 ? (
            <Group label={`${platform.label} role`}>
              <Option
                label="Everything"
                note="Every module this gateway has"
                selected={role === null}
                onSelect={() => {
                  setRole(null);
                  setOpen(false);
                }}
              />
              {roles.map((entry) => (
                <Option
                  key={entry.id}
                  label={entry.label}
                  note={entry.description}
                  selected={role === entry.id}
                  onSelect={() => {
                    setRole(entry.id);
                    setOpen(false);
                  }}
                />
              ))}
            </Group>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Group({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <section className="sidebar-settings__group">
      <p className="sidebar-settings__group-label">{label}</p>
      {children}
    </section>
  );
}

/** One setting. Every row is the same height: a name, and one line under it. */
function Option({
  label,
  note,
  selected,
  disabled,
  onSelect,
}: {
  label: string;
  note?: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="sidebar-settings__option"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onSelect}>
      <span className="sidebar-settings__option-main">
        <span className="sidebar-settings__option-label">{label}</span>
        {note ? <span className="sidebar-settings__option-note">{note}</span> : null}
      </span>
      {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
    </button>
  );
}
