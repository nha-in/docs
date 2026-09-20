import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, Copy, Lock, Plug, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {Button} from '@site/src/components/ui/button';
import {AGENTS, AgentId, MCP_NAME, guarded} from './agents';

/**
 * The Docs MCP server, and the one click that installs it.
 *
 * MCP_URL at build time is what arms it: with the endpoint set (the deploy
 * pipeline sets it), every button below is live. Without it, a build with no
 * backend (a PR preview, a local run) renders the panel locked: the targets
 * are listed and described, and nothing is clickable.
 *
 * Locked is a deliberate state, not a broken one: a reader sees what the
 * server offers and where it would come from.
 *
 * One tab per agent in AGENTS, the same row the plugin and skill panels
 * carry. It used to be three deeplink buttons over two Claude tabs, so a
 * Cursor or Codex reader who wanted the command rather than the deeplink had
 * a Claude one to translate, and Codex had nothing at all.
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

/** The `mcpServers` block every client that reads one takes as is. */
function mcpServersJson(url: string) {
  return JSON.stringify({mcpServers: {[MCP_NAME]: {url}}}, null, 2);
}

type Surface = {
  /** What the copy button yields for this agent. */
  command: (url: string) => string;
  /** True where the command is a config block rather than a line to run. */
  block?: boolean;
  /** One click into the agent, where the agent has a scheme for it. */
  link: ((url: string) => string) | null;
  note: string;
};

/**
 * Deeplinks verified against official docs as far as they can be: Cursor's
 * own deeplinks page (cursor.com/docs/integrations/deeplinks) documents the
 * `prompt`, `command` and `rule` schemes but not `mcp/install`; VS Code's MCP
 * docs (code.visualstudio.com/docs/copilot/chat/mcp-servers) document the
 * Extensions view, the Command Palette and `code --add-mcp`, not a
 * `vscode:mcp/install` URI. Both forms below match what Cursor's and VS
 * Code's own "Add to Cursor" / "Install in VS Code" marketplace badges emit,
 * so they are kept, but treat them as best effort rather than confirmed.
 *
 * The commands are confirmed. Codex takes `codex mcp add <name> --url <url>`
 * for a streamable HTTP server and stores it under `[mcp_servers.<name>]` in
 * ~/.codex/config.toml (learn.chatgpt.com/docs/extend/mcp).
 */
const SURFACES: Record<AgentId, Surface> = {
  claude: {
    command: (url) => `claude mcp add --transport http ${MCP_NAME} ${url} -s user`,
    // Neither Claude scheme has an MCP install action, so this opens a Code
    // session in the desktop app with the add command in the composer.
    link: (url) =>
      `claude://code/new?q=${encodeURIComponent(
        guarded(
          [
            'Add the ABDM documentation MCP server, then use it to answer my ABDM questions.',
            '',
            'Run this:',
            `claude mcp add --transport http ${MCP_NAME} ${url} -s user`,
            '',
            'User scope, so it is available in every project rather than only this directory.',
          ].join('\n'),
        ),
      )}`,
    note: 'User scope, so it is there in every project rather than only this directory. Claude Desktop takes the generic block under "Any agent" instead.',
  },
  cursor: {
    command: mcpServersJson,
    block: true,
    link: (url) =>
      `cursor://anysphere.cursor-deeplink/mcp/install?name=${MCP_NAME}&config=${encodeURIComponent(
        btoa(JSON.stringify({url})),
      )}`,
    note: 'The link opens Cursor on a confirmation dialog. The block goes in .cursor/mcp.json if you would rather add it by hand.',
  },
  vscode: {
    command: (url) =>
      `code --add-mcp '${JSON.stringify({name: MCP_NAME, type: 'http', url})}'`,
    link: (url) =>
      `vscode:mcp/install?${encodeURIComponent(
        JSON.stringify({name: MCP_NAME, type: 'http', url}),
      )}`,
    note: 'The link opens VS Code on a confirmation dialog. The command does the same from a terminal.',
  },
  codex: {
    command: (url) => `codex mcp add ${MCP_NAME} --url ${url}`,
    // Codex is a CLI with no URL scheme. Do not invent one.
    link: null,
    note: 'Writes it to ~/.codex/config.toml, which the Codex CLI, the IDE extension and the desktop app all read. Run /mcp in a session to confirm it connected.',
  },
  any: {
    command: mcpServersJson,
    block: true,
    link: null,
    note: 'Any MCP client that reads an mcpServers config, Claude Desktop included, takes this block as is.',
  },
};

function CopyLine({value, block}: {value: string; block?: boolean}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={cn('skill-cmd', block && 'skill-cmd--block')}>
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
  const [active, setActive] = useState<AgentId>(AGENTS[0].id);

  // The endpoint at build time, or a placeholder the copyable forms show so
  // the panel still reads correctly before the deploy pipeline sets MCP_URL.
  const shown = url ?? '<mcp-url, set at deploy>';

  return (
    <aside className={cn('skill-install', !url && 'skill-install--locked')}>
      <div className="skill-install__head">
        <span className="skill-install__icon" aria-hidden="true">
          {url ? <Plug className="size-4" /> : <Lock className="size-4" />}
        </span>
        <div className="skill-install__body">
          <p className="skill-install__title">
            Docs MCP server
            {!url && <span className="skill-chip">Address not in this build</span>}
          </p>
          <p className="skill-install__note">
            {url
              ? 'Your agent queries this catalogue as it works, instead of loading it.'
              : 'Your agent will query this catalogue as it works, instead of loading it. The server is live; this build just does not carry its address. The endpoint is set at deploy, and every control here works the moment it resolves.'}
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

      <div className="skill-install__targets" role="tablist" aria-label="Add to">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            type="button"
            role="tab"
            id={`mcp-install-tab-${agent.id}`}
            aria-selected={agent.id === active}
            className={cn(
              'skill-install__target',
              agent.id === active && 'skill-install__target--active',
            )}
            onClick={() => setActive(agent.id)}>
            {agent.label}
          </button>
        ))}
      </div>

      {/* Every target renders, unselected ones hidden, for the same reason
          AgentSetup does it: the built HTML is what an agent reading this
          page as markdown gets, and it should carry all five. */}
      {AGENTS.map((agent) => {
        const surface = SURFACES[agent.id];
        return (
          <div
            key={agent.id}
            role="tabpanel"
            aria-labelledby={`mcp-install-tab-${agent.id}`}
            hidden={agent.id !== active}>
            <p className="sr-only"><strong>{agent.label}</strong></p>
            {surface.link && (
              <div className="skill-install__actions">
                {url ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={surface.link(url)}>
                      <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                      Add to {agent.label}
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <Lock className="size-3.5" aria-hidden="true" />
                    Add to {agent.label}
                  </Button>
                )}
              </div>
            )}
            <CopyLine value={surface.command(shown)} block={surface.block} />
            <p className="skill-install__hint">{surface.note}</p>
          </div>
        );
      })}
    </aside>
  );
}
