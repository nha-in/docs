import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, Copy, Database, Sparkles, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';

/**
 * The Build with AI page's opening move. Each agent gets its shortest path:
 * a deeplink that opens the agent with the setup already in its composer
 * where the agent has a URL scheme (Claude, Cursor), a copyable line where
 * it does not (Codex, anything else). What travels is one line pointing at
 * hosted instructions (agent-setup/prompt.md, regenerated every build), so
 * the pasted prompt can never go stale.
 *
 * Claude Code and Codex get the plugin instead: one marketplace, every skill
 * at once, updated in place rather than by re-downloading files. Codex can
 * because the plugin is packaged to Agent Plugins 1.0 as well as to Claude
 * Code's own layout (see scripts/build-plugin-manifests.mjs). The rest of the
 * clients that read the standard install from their own marketplaces, which
 * is not a command anyone can paste, so they keep the prompt.
 */

/** The repository that serves the Claude Code plugin marketplace. Update at
    handover, together with the same constant in scripts/build-skills.mjs. */
const PLUGIN_REPO = 'eka-care/abdm-docs';

/**
 * What differs between gateways: the plugin that carries their skills and the
 * hosted prompt that sets an agent up without it. Everything else is shared.
 */
type Gateway = {
  /** The name a reader and the prompt call it by. */
  name: string;
  plugin: string;
  /** The repository whose marketplace carries the plugin. */
  repo: string;
  /** Under /agent-setup/, written by scripts/build-skills.mjs. */
  prompt: string;
  /** The gateway's Build with AI page, where the MCP server is connected. */
  page: string;
};

const GATEWAYS: Record<'abdm' | 'nhcx', Gateway> = {
  abdm: {
    name: 'ABDM',
    plugin: 'abdm-integrators-assistant',
    repo: PLUGIN_REPO,
    prompt: 'prompt.md',
    page: '/docs/hiecm/v3/getting-started/build-with-ai',
  },
  nhcx: {
    name: 'NHCX',
    plugin: 'nhcx',
    // As the NHCX landing page publishes it.
    repo: 'nha-in/docs',
    prompt: 'nhcx.md',
    page: '/docs/nhcx/v1/getting-started/build-with-ai',
  },
};

function fetchPrompt(g: Gateway, base: string) {
  return `Fetch and execute the instructions to set me up for ${g.name} integration from ${base}/agent-setup/${g.prompt}`;
}

/** What a deeplink lands in the agent's composer. Nothing runs until the
    reader presses Enter, which is why install commands can sit in it. */
function guarded(g: Gateway, body: string) {
  return [
    body,
    '',
    `If this session did not open in the repository I am integrating ${g.name} into, ask me for the path before you write anything.`,
  ].join('\n');
}

type Surface = {
  id: string;
  label: string;
  /** The line the copy button yields. */
  command: (base: string) => string;
  /** One click into the agent, where the agent has a scheme for it. */
  link: ((base: string) => string) | null;
  note: string;
};

/**
 * A target is one agent. Where a vendor ships more than one surface and they
 * are set up differently, the surfaces sit under it as variants rather than
 * as siblings in the top row: OpenAI's CLI and its chat window are one
 * choice for a reader, then a second, smaller one.
 */
type Target = Surface | {id: string; label: string; variants: Surface[]};

function surfacesOf(target: Target): Surface[] {
  return 'variants' in target ? target.variants : [target];
}

const targetsFor = (g: Gateway): Target[] => [
  {
    id: 'claude-code',
    label: 'Claude',
    command: () =>
      `claude plugin marketplace add ${g.repo} && claude plugin install ${g.plugin}@nha-in`,
    // https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link
    link: (base) =>
      `claude://code/new?q=${encodeURIComponent(
        guarded(
          g,
          [
            `Set this project up for ${g.name} integration. Run:`,
            '',
            `claude plugin marketplace add ${g.repo}`,
            `claude plugin install ${g.plugin}@nha-in`,
            '',
            `If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${base}/agent-setup/${g.prompt}`,
          ].join('\n'),
        ),
      )}`,
    note: 'The plugin carries every skill at once, and `claude plugin update` keeps them current.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    command: (base) => fetchPrompt(g, base),
    // https://cursor.com/docs/integrations/deeplinks
    link: (base) =>
      `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
        guarded(g, fetchPrompt(g, base)),
      )}`,
    note: 'Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    // One vendor, two surfaces, and they are not interchangeable: Codex is
    // the agent that writes in the reader's repository, the chat window is
    // where they paste a question. Both are here because a reader who has
    // only ChatGPT should not leave with nothing.
    variants: [
      {
        id: 'codex',
        label: 'Codex CLI',
        // Codex reads Agent Plugins 1.0, and this repository publishes a
        // marketplace it can add directly. Codex is a CLI with no URL scheme,
        // so there is no deeplink. Do not invent one.
        command: () => `codex plugin marketplace add ${g.repo}`,
        link: null,
        note: `Adds the marketplace. Then open /plugins in Codex and install ${g.plugin}. It carries every skill at once.`,
      },
      {
        id: 'chatgpt',
        label: 'ChatGPT',
        command: (base) => fetchPrompt(g, base),
        // https://help.openai.com/en/articles/9955102 - chatgpt.com/?q=<text>
        // opens a new chat with the text preloaded. Nothing sends until
        // Enter, the same as the other deeplinks here.
        link: (base: string) =>
          `https://chatgpt.com/?q=${encodeURIComponent(guarded(g, fetchPrompt(g, base)))}`,
        note: 'Opens ChatGPT with the setup preloaded. It answers from this site, and writes nothing into your project.',
      },
    ],
  },
  {
    id: 'any',
    label: 'Any agent',
    command: (base) => fetchPrompt(g, base),
    link: null,
    note: 'One line, any agent that can fetch a URL. The instructions live on this site and are rebuilt with it.',
  },
];

type AgentSetupProps = {
  /** Which gateway to set the agent up for: ABDM by default, or NHCX. */
  set?: 'abdm' | 'nhcx';
};

export default function AgentSetup({set = 'abdm'}: AgentSetupProps): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const g = GATEWAYS[set] ?? GATEWAYS.abdm;
  const TARGETS = targetsFor(g);
  const [target, setTarget] = useState<Target>(TARGETS[0]);
  const [surface, setSurface] = useState<Surface>(surfacesOf(TARGETS[0])[0]);
  const [copied, setCopied] = useState(false);
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');

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
        {TARGETS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            id={`agent-setup-tab-${option.id}`}
            aria-selected={option.id === target.id}
            className={cn(
              'skill-install__target',
              option.id === target.id && 'skill-install__target--active',
            )}
            onClick={() => {
              setTarget(option);
              setSurface(surfacesOf(option)[0]);
              setCopied(false);
            }}>
            {option.label}
          </button>
        ))}
      </div>

      {/* A vendor with more than one surface asks a second, smaller question:
          which of theirs. One row of two, not four tabs in the row above,
          because the reader picks the vendor first. */}
      {surfacesOf(target).length > 1 && (
        <div
          className="skill-install__targets skill-install__targets--sub"
          role="tablist"
          aria-label={`${target.label} surface`}>
          {surfacesOf(target).map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              id={`agent-setup-tab-${option.id}`}
              aria-selected={option.id === surface.id}
              className={cn(
                'skill-install__target',
                option.id === surface.id && 'skill-install__target--active',
              )}
              onClick={() => {
                setSurface(option);
                setCopied(false);
              }}>
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Every surface renders and the unselected ones carry `hidden`, so the
          screen shows one and the built HTML carries all of them. That HTML is
          what an agent fetching this page as markdown reads, and rendering
          only the selected surface left it with one install line out of five,
          missing the one line that works for any agent at all. See
          scripts/emit-page-markdown.mjs. */}
      {TARGETS.flatMap(surfacesOf).map((option) => {
        const line = option.command(base);
        const active = option.id === surface.id;
        return (
          <div
            key={option.id}
            role="tabpanel"
            aria-labelledby={`agent-setup-tab-${option.id}`}
            hidden={!active}>
            <p className="sr-only"><strong>{option.label}</strong></p>
            <div className="skill-cmd">
              <code className="skill-cmd__text">{line}</code>
              {active && (
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

            {option.link && (
              <a className="skill-launch" href={option.link(base)}>
                <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
                Open in {option.label}
              </a>
            )}

            <p className="skill-install__hint">{option.note}</p>
          </div>
        );
      })}

      <p className="agent-setup__mcp">
        <Database className="size-3.5" aria-hidden="true" />
        {/* The nhcx plugin carries skills only, so only the pasted setup
            connects the server; the plugin lines leave it to the reader. */}
        <span>
          {set === 'nhcx' ? 'Connect the ' : 'The setup also connects the '}
          <Link to={`${g.page}#connect-the-docs-mcp-server`}>Docs MCP server</Link>
          {set === 'nhcx'
            ? ' alongside the plugin: the live version of these docs, queried by your agent as it works.'
            : ': the live version of these docs, queried by your agent as it works.'}
        </span>
      </p>
    </aside>
  );
}
