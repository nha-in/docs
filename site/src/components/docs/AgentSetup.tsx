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
 * the pasted prompt can never go stale. Claude Code gets the plugin
 * instead: one marketplace, all four skills, updated by `claude plugin
 * update` rather than by re-downloading files.
 */

/** The repository that serves the Claude Code plugin marketplace. Update at
    handover, together with the same constant in scripts/build-skills.mjs. */
const PLUGIN_REPO = 'eka-care/abdm-docs';

function fetchPrompt(base: string) {
  return `Fetch and execute the instructions to set me up for ABDM integration from ${base}/agent-setup/prompt.md`;
}

/** What a deeplink lands in the agent's composer. Nothing runs until the
    reader presses Enter, which is why install commands can sit in it. */
function guarded(body: string) {
  return [
    body,
    '',
    'If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything.',
  ].join('\n');
}

type Target = {
  id: string;
  label: string;
  /** The line the copy button yields. */
  command: (base: string) => string;
  /** One click into the agent, where the agent has a scheme for it. */
  link: ((base: string) => string) | null;
  note: string;
};

const TARGETS: Target[] = [
  {
    id: 'claude-code',
    label: 'Claude',
    command: () =>
      `claude plugin marketplace add ${PLUGIN_REPO} && claude plugin install abdm@abdm-portal`,
    // https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link
    link: (base) =>
      `claude://code/new?q=${encodeURIComponent(
        guarded(
          [
            'Set this project up for ABDM integration. Run:',
            '',
            `claude plugin marketplace add ${PLUGIN_REPO}`,
            'claude plugin install abdm@abdm-portal',
            '',
            `If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${base}/agent-setup/prompt.md`,
          ].join('\n'),
        ),
      )}`,
    note: 'The plugin carries all four skills at once, and `claude plugin update` keeps them current.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    command: fetchPrompt,
    // https://cursor.com/docs/integrations/deeplinks
    link: (base) =>
      `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
        guarded(fetchPrompt(base)),
      )}`,
    note: 'Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.',
  },
  {
    // OpenAI's coding agent, which is the surface that writes code in a
    // repository. Plain ChatGPT was here too and has gone: it is the same
    // vendor answering in a chat window with no access to the project, so
    // the reader who picked it got a worse version of "Any agent".
    id: 'codex',
    label: 'Codex',
    command: fetchPrompt,
    // Codex is a CLI with no URL scheme. Do not invent one.
    link: null,
    note: 'Paste into a Codex session. It fetches the current instructions from this site.',
  },
  {
    id: 'any',
    label: 'Any agent',
    command: fetchPrompt,
    link: null,
    note: 'One line, any agent that can fetch a URL. The instructions live on this site and are rebuilt with it.',
  },
];

export default function AgentSetup(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [target, setTarget] = useState(TARGETS[0]);
  const [copied, setCopied] = useState(false);
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');
  const command = target.command(base);

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
            aria-selected={option.id === target.id}
            className={cn(
              'skill-install__target',
              option.id === target.id && 'skill-install__target--active',
            )}
            onClick={() => {
              setTarget(option);
              setCopied(false);
            }}>
            {option.label}
          </button>
        ))}
      </div>

      <div className="skill-cmd">
        <code className="skill-cmd__text">{command}</code>
        <button
          type="button"
          className="skill-cmd__copy"
          aria-label={copied ? 'Copied' : 'Copy'}
          onClick={() => {
            navigator.clipboard?.writeText(command);
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

      {target.link && (
        <a className="skill-launch" href={target.link(base)}>
          <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
          Open in {target.label}
        </a>
      )}

      <p className="skill-install__hint">{target.note}</p>

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
