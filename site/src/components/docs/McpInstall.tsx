import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, Copy, Lock, Plug, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {Button} from '@site/src/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@site/src/components/ui/tabs';

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

type DeepLink = {
  id: string;
  label: string;
  /** The one click install, once a public URL exists. */
  link: (url: string) => string;
  note: string;
};

const NAME = 'abdm-docs';

/**
 * Platforms with an install deeplink. Each opens the target app directly,
 * rather than a copyable command, where the app has a scheme for it.
 *
 * Verified against official docs: neither could be confirmed. Cursor's own
 * deeplinks page (cursor.com/docs/integrations/deeplinks) documents the
 * `prompt`, `command` and `rule` schemes but not `mcp/install`; VS Code's MCP
 * docs (code.visualstudio.com/docs/copilot/chat/mcp-servers) document the
 * Extensions view, the Command Palette and `code --add-mcp`, not a
 * `vscode:mcp/install` URI. Both forms below match what Cursor's and VS
 * Code's own "Add to Cursor" / "Install in VS Code" marketplace badges emit,
 * so they are kept, but treat them as best effort rather than confirmed.
 */
const DEEPLINKS: DeepLink[] = [
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

  // The endpoint at build time, or a placeholder the copyable forms show so
  // the panel still reads correctly before the deploy pipeline sets MCP_URL.
  const shown = url ?? '<mcp-url, set at deploy>';
  const claudeCliCmd = `claude mcp add --transport http ${NAME} ${shown} -s user`;
  const genericConfig = JSON.stringify(
    {mcpServers: {[NAME]: {url: shown}}},
    null,
    2,
  );

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

      <div className="skill-install__actions skill-install__actions--wrap">
        {DEEPLINKS.map((option) =>
          url ? (
            <Button key={option.id} asChild variant="outline" size="sm">
              <a href={option.link(url)} title={option.note}>
                <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                Add to {option.label}
              </a>
            </Button>
          ) : (
            <Button key={option.id} variant="outline" size="sm" disabled title={option.note}>
              <Lock className="size-3.5" aria-hidden="true" />
              Add to {option.label}
            </Button>
          ),
        )}
      </div>

      <Tabs defaultValue="claude-cli" className="skill-install__mcp-tabs">
        <TabsList>
          <TabsTrigger value="claude-cli">Claude Code (CLI)</TabsTrigger>
          <TabsTrigger value="generic">Claude Desktop / generic</TabsTrigger>
        </TabsList>
        <TabsContent value="claude-cli">
          <CopyLine value={claudeCliCmd} />
          <p className="skill-install__hint">Run this in the repository you are integrating.</p>
        </TabsContent>
        <TabsContent value="generic">
          <CopyLine value={genericConfig} block />
          <p className="skill-install__hint">
            Any MCP client that reads an <code>mcpServers</code> config, Claude Desktop
            included, takes this block as is.
          </p>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
