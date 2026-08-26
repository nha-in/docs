import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, Copy, Lock, Plug, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';

/**
 * The Docs MCP server, and the one click that installs it.
 *
 * The server is not public yet, so this panel renders locked: the targets are
 * listed and described, and nothing is clickable. Set MCP_URL at build time and
 * every button below becomes live. That is the only wiring left to do.
 *
 * Locked is a deliberate state, not a broken one. A reader can see what the
 * server will give them and decide whether to wait for it.
 */

/** What the server carries, from mcp/README.md. */
const CAPABILITIES = [
  {
    label: 'Search',
    detail:
      'Hybrid keyword and semantic search over every page here, so an agent retrieves the paragraph it needs instead of loading the site.',
    tools: 'search_docs, get_atom, related_atoms, list_atoms',
  },
  {
    label: 'Decode',
    detail:
      'Turn an error code you just received into what it means and what to do, without you finding the right table.',
    tools: 'decode_error',
  },
  {
    label: 'Validate',
    detail:
      'Check a request body against the specification before you send it, and list or read any operation.',
    tools: 'validate_request, list_operations, get_operation',
  },
];

type Target = {
  id: string;
  label: string;
  /** The one click install, once a public URL exists. */
  link: (url: string) => string;
  note: string;
};

const NAME = 'abdm-docs';

const TARGETS: Target[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    // Neither Claude scheme has an MCP install action, so this opens a Code
    // session in the desktop app with the add command in the composer.
    link: (url) =>
      `claude://code/new?q=${encodeURIComponent(
        [
          'Add the ABDM documentation MCP server, then use it to answer my ABDM questions.',
          '',
          'Run this:',
          `claude mcp add --transport http ${NAME} ${url} -s user`,
          '',
          'User scope, so it is available in every project rather than only this directory.',
        ].join('\n'),
      )}`,
    note: 'Opens the Claude app with the add command ready. Nothing runs until you press Enter.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    link: (url) =>
      `cursor://anysphere.cursor-deeplink/mcp/install?name=${NAME}&config=${encodeURIComponent(
        btoa(JSON.stringify({url})),
      )}`,
    note: 'Opens Cursor on a confirmation dialog. No command to run.',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    link: (url) =>
      `vscode:mcp/install?${encodeURIComponent(
        JSON.stringify({name: NAME, type: 'http', url}),
      )}`,
    note: 'Opens VS Code on a confirmation dialog. No command to run.',
  },
];

function CopyLine({value}: {value: string}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="skill-cmd">
      <code className="skill-cmd__text">{value}</code>
      <button
        type="button"
        className="skill-cmd__copy"
        aria-label={copied ? 'Copied' : 'Copy the command'}
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }}>
        {copied ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export default function McpInstall(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const url = (siteConfig.customFields?.mcpUrl as string | null) ?? null;
  const [target, setTarget] = useState(TARGETS[0]);

  return (
    <aside className={cn('skill-install', !url && 'skill-install--locked')}>
      <div className="skill-install__head">
        <span className="skill-install__icon" aria-hidden="true">
          {url ? <Plug className="size-4" /> : <Lock className="size-4" />}
        </span>
        <div className="skill-install__body">
          <p className="skill-install__title">
            Docs MCP server
            {!url && <span className="skill-chip">Not public yet</span>}
          </p>
          <p className="skill-install__note">
            {url
              ? 'Your agent queries this catalogue as it works, instead of loading it.'
              : 'Your agent will query this catalogue as it works, instead of loading it. The server runs, but only inside our network. These buttons go live when it gets a public address.'}
          </p>
        </div>
      </div>

      <ul className="skill-caps">
        {CAPABILITIES.map((capability) => (
          <li key={capability.label} className="skill-caps__item">
            <span className="skill-caps__label">{capability.label}</span>
            <span className="skill-caps__detail">{capability.detail}</span>
            <code className="skill-caps__tools">{capability.tools}</code>
          </li>
        ))}
      </ul>

      <div className="skill-install__targets" role="tablist" aria-label="Install for">
        {TARGETS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === target.id}
            className={cn(
              'skill-install__target',
              option.id === target.id && 'skill-install__target--active',
            )}
            onClick={() => setTarget(option)}>
            {option.label}
          </button>
        ))}
      </div>

      {url ? (
        <a className="skill-launch" href={target.link(url)}>
          <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
          Add to {target.label}
        </a>
      ) : (
        <span className="skill-launch skill-launch--locked" aria-disabled="true">
          <Lock className="size-3.5" aria-hidden="true" />
          Add to {target.label}
        </span>
      )}

      <p className="skill-install__hint">{target.note}</p>

      {url && target.id === 'claude-code' && (
        <CopyLine value={`claude mcp add --transport http ${NAME} ${url} -s user`} />
      )}
    </aside>
  );
}
