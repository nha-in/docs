import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, Copy, Database, Sparkles, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import {AGENTS, AgentId, guarded} from './agents';

/**
 * The Build with AI page's opening move. Each agent gets its shortest path:
 * a deeplink that opens the agent with the setup already in its composer
 * where the agent has a URL scheme (Claude, Cursor, ChatGPT), a copyable line
 * where it does not (Codex, VS Code). What travels is one line pointing at
 * hosted instructions (agent-setup/prompt.md, regenerated every build), so
 * the pasted prompt can never go stale.
 *
 * Claude Code and Codex get the plugin instead: one marketplace, every skill
 * at once, updated in place rather than by re-downloading files. Codex can
 * because the plugin is packaged to Agent Plugins 1.0 as well as to Claude
 * Code's own layout (see scripts/build-plugin-manifests.mjs). The rest read
 * plugins from their own marketplaces, which is not a command anyone can
 * paste, so they keep the prompt.
 *
 * The row of agents is AGENTS, shared with the MCP and skill panels, so the
 * page's three ways in all answer for the same agents.
 */

/** Each gateway's plugin, the word the prompts use for it, and its hosted
    instructions (scripts/build-skills.mjs writes both prompt files). */
const SETS = {
  abdm: {plugin: 'abdm-integrators-assistant', label: 'ABDM', prompt: 'prompt.md'},
  nhcx: {plugin: 'nhcx', label: 'NHCX', prompt: 'nhcx.md'},
} as const;

/** Everything a line here is built from: where this site is published, and
    which repository serves its plugin marketplace. Both come from the build,
    so a fork publishes its own commands. See docusaurus.config.ts. */
type Ctx = {base: string; repo: string; marketplace: string};

type Surface = {
  /** The line the copy button yields. */
  command: (ctx: Ctx) => string;
  /** One click into the agent, where the agent has a scheme for it. */
  link: ((ctx: Ctx) => string) | null;
  note: string;
};

function surfacesFor(set: keyof typeof SETS): Record<AgentId, Surface> {
  const {plugin: PLUGIN, label: LABEL, prompt: PROMPT} = SETS[set];
  const fetchPrompt = (base: string) =>
    `Fetch and execute the instructions to set me up for ${LABEL} integration from ${base}/agent-setup/${PROMPT}`;
  return {
  claude: {
    command: ({repo, marketplace}) =>
      `claude plugin marketplace add ${repo} && claude plugin install ${PLUGIN}@${marketplace}`,
    // https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link
    link: ({base, repo, marketplace}) =>
      `claude://code/new?q=${encodeURIComponent(
        guarded(
          [
            `Set this project up for ${LABEL} integration. Run:`,
            '',
            `claude plugin marketplace add ${repo}`,
            `claude plugin install ${PLUGIN}@${marketplace}`,
            '',
            `If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${base}/agent-setup/${PROMPT}`,
          ].join('\n'),
        ),
      )}`,
    note: 'The plugin carries every skill at once, and `claude plugin update` keeps them current.',
  },
  cursor: {
    command: ({base}) => fetchPrompt(base),
    // https://cursor.com/docs/integrations/deeplinks
    link: ({base}) =>
      `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
        guarded(fetchPrompt(base)),
      )}`,
    note: 'Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.',
  },
  vscode: {
    command: ({base}) => fetchPrompt(base),
    // VS Code has a deeplink for MCP servers but none that fills the Copilot
    // composer, so this target is the line only. Do not invent one.
    link: null,
    note: 'Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.',
  },
  codex: {
    // Codex reads Agent Plugins 1.0, and this repository publishes a
    // marketplace it can add directly. Codex is a CLI with no URL scheme,
    // so there is no deeplink. Do not invent one.
    command: ({repo}) => `codex plugin marketplace add ${repo}`,
    link: null,
    note: `Adds the marketplace. Install ${PLUGIN} from Codex's plugin directory and it carries every skill at once.`,
  },
  any: {
    command: ({base}) => fetchPrompt(base),
    // https://help.openai.com/en/articles/9955102 - chatgpt.com/?q=<text>
    // opens a new chat with the text preloaded. Nothing sends until Enter,
    // the same as the other deeplinks here. ChatGPT installs nothing, so it
    // belongs to the target that is a line rather than an install.
    link: ({base}) =>
      `https://chatgpt.com/?q=${encodeURIComponent(guarded(fetchPrompt(base)))}`,
    note: 'One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.',
  },

  };
}

export default function AgentSetup({set = 'abdm'}: {set?: keyof typeof SETS}): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const SURFACES = surfacesFor(set);
  const [active, setActive] = useState<AgentId>(AGENTS[0].id);
  const [copied, setCopied] = useState(false);
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');
  const repo = siteConfig.customFields?.pluginRepo as string;
  const marketplace = siteConfig.customFields?.marketplaceName as string;
  const ctx: Ctx = {base, repo, marketplace};

  return (
    <aside className="agent-setup">
      <div className="agent-setup__row">
        <span className="skill-install__icon" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        <div className="agent-setup__body">
          <p className="skill-install__title">Set your agent up in one step</p>
          <p className="skill-install__note">
            Open your agent with the setup ready to send, or copy it. Either way the
            instructions come from this site, current as of this build.
          </p>
        </div>
      </div>

      <div className="skill-install__targets" role="tablist" aria-label="Set up for">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            type="button"
            role="tab"
            id={`agent-setup-tab-${agent.id}`}
            aria-selected={agent.id === active}
            className={cn(
              'skill-install__target',
              agent.id === active && 'skill-install__target--active',
            )}
            onClick={() => {
              setActive(agent.id);
              setCopied(false);
            }}>
            {agent.label}
          </button>
        ))}
      </div>

      {/* Every target renders and the unselected ones carry `hidden`, so the
          screen shows one and the built HTML carries all of them. That HTML is
          what an agent fetching this page as markdown reads, and rendering
          only the selected target left it with one install line out of five,
          missing the one line that works for any agent at all. See
          scripts/emit-page-markdown.mjs. */}
      {AGENTS.map((agent) => {
        const surface = SURFACES[agent.id];
        const line = surface.command(ctx);
        const isActive = agent.id === active;
        return (
          <div
            key={agent.id}
            role="tabpanel"
            aria-labelledby={`agent-setup-tab-${agent.id}`}
            hidden={!isActive}>
            <p className="sr-only"><strong>{agent.label}</strong></p>
            <div className="skill-cmd">
              <code className="skill-cmd__text">{line}</code>
              {isActive && (
                <button
                  type="button"
                  className="skill-cmd__copy"
                  aria-label={copied ? 'Copied' : 'Copy'}
                  onClick={() => {
                    navigator.clipboard?.writeText(line);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  }}>
                  {copied ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3.5" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>

            {surface.link && (
              <a className="skill-launch" href={surface.link(ctx)}>
                <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                Open in {agent.id === 'any' ? 'ChatGPT' : agent.label}
              </a>
            )}

            <p className="skill-install__hint">{surface.note}</p>
          </div>
        );
      })}

      <p className="agent-setup__mcp">
        <Database className="size-3.5" aria-hidden="true" />
        <span>
          The setup also connects the{' '}
          <Link to="/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server">Docs MCP server</Link>: the live
          version of these docs, queried by your agent as it works.
        </span>
      </p>
    </aside>
  );
}
