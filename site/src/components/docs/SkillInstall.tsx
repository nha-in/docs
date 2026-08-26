import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Check, Copy, Download, Sparkles, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import manifest from '@site/src/data/skills.json';

export type SkillInstallProps = {
  /** The skill's folder name, for example "abdm-m1". Keys into skills.json. */
  slug: string;
  /** One line on what the skill gives an agent. */
  note: string;
};

type Entry = {
  module: string;
  title: string;
  docs: string;
  example: string;
  errorExample: string | null;
  operations: number;
  codes: number;
  tests: number;
};

type Target = {
  id: string;
  label: string;
  /** Where this agent reads skills from, for the panel's own copy. */
  dir: string | null;
  /** Built from the published URL, so the command works where the site is. */
  command: (url: string, slug: string) => string;
  /** One click into the agent, or null where the agent has no scheme for it. */
  link: ((command: string, module: string) => string) | null;
  note: string;
};

/**
 * The prompt a one click launch lands in the agent's composer.
 *
 * Every scheme below fills the composer and stops. Nothing is sent and nothing
 * runs until the reader presses Enter, which is why the install command can sit
 * in it. No working directory is set, because we cannot know where the reader
 * keeps the project they are integrating, so the last line tells the agent to
 * ask before it writes anything.
 */
function promptFor(command: string, module: string) {
  return [
    `Install the ABDM ${module} agent skill into this project, then help me use it.`,
    '',
    'Run this:',
    command,
    '',
    'If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything.',
  ].join('\n');
}

const TARGETS: Target[] = [
  {
    id: 'claude-code',
    label: 'Claude',
    dir: '.claude/skills',
    command: (url, slug) =>
      `mkdir -p .claude/skills/${slug} && curl -fsSL ${url}/skills/${slug}/SKILL.md -o .claude/skills/${slug}/SKILL.md`,
    // https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link
    link: (command, module) =>
      `claude://code/new?q=${encodeURIComponent(promptFor(command, module))}`,
    note: 'Drops the skill into this project. Claude loads it when a task matches.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    dir: '.cursor/skills',
    command: (url, slug) =>
      `mkdir -p .cursor/skills/${slug} && curl -fsSL ${url}/skills/${slug}/SKILL.md -o .cursor/skills/${slug}/SKILL.md`,
    // https://cursor.com/docs/integrations/deeplinks. Cursor has no skill
    // install deeplink, but it has a prompt one, so this lands the same way the
    // Claude link does: the command in the composer, waiting to be sent.
    link: (command, module) =>
      `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
        promptFor(command, module),
      )}`,
    note: 'Cursor reads the same file. It also picks up .claude/skills if you already installed there.',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    dir: '.github/skills',
    command: (url, slug) =>
      `mkdir -p .github/skills/${slug} && curl -fsSL ${url}/skills/${slug}/SKILL.md -o .github/skills/${slug}/SKILL.md`,
    // VS Code has a deeplink for MCP servers but none for skills, so this
    // target is the command only. Do not invent one.
    link: null,
    note: 'GitHub Copilot reads this on every surface your team uses, not only your editor.',
  },
  {
    id: 'any',
    label: 'Any agent',
    dir: null,
    command: (url, slug) => `curl -fsSL ${url}/skills/${slug}/SKILL.md`,
    link: null,
    note: 'One markdown file. Put it wherever your agent reads context from.',
  },
];

/** What the skill carries, counted from the file the generator wrote. */
function capabilities(entry: Entry) {
  return [
    {
      label: 'Integrate',
      detail:
        entry.operations > 0
          ? `${entry.operations} operations, with their hosts, headers and the rules that hold across them.`
          : 'No operation is recorded for this module yet.',
    },
    {
      label: 'Debug',
      detail:
        entry.codes > 0
          ? `${entry.codes} recorded error codes, each with its message and what to do about it.`
          : 'No error code is recorded for this module yet.',
    },
    {
      label: 'Test',
      detail:
        entry.tests > 0
          ? `${entry.tests} test cases, each with the call it makes and what to see when it passes.`
          : 'No test matrix exists for this module yet.',
    },
  ];
}

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

/**
 * The module's agent skill, at the top of its overview page: what the skill can
 * do, the one command that installs it, and how to put it to work.
 *
 * The file is generated from these pages by scripts/build-skills.mjs on every
 * build, so an agent works from the same facts a reader does, and a page that
 * changes changes the skill. The capability counts come from the same build, so
 * this panel cannot claim more than the skill holds.
 */
export default function SkillInstall({slug, note}: SkillInstallProps): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [target, setTarget] = useState(TARGETS[0]);
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');
  const download = useBaseUrl(`/skills/${slug}/SKILL.md`);
  const entry = (manifest as Record<string, Entry>)[slug];

  if (!entry) return null;

  return (
    <aside className="skill-install">
      <div className="skill-install__head">
        <span className="skill-install__icon" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        <div className="skill-install__body">
          <p className="skill-install__title">{entry.module} agent skill</p>
          <p className="skill-install__note">{note}</p>
        </div>
        <a className="skill-install__download" href={download} download>
          <Download className="size-4" aria-hidden="true" />
          Download
        </a>
      </div>

      <ul className="skill-caps">
        {capabilities(entry).map((capability) => (
          <li key={capability.label} className="skill-caps__item">
            <span className="skill-caps__label">{capability.label}</span>
            <span className="skill-caps__detail">{capability.detail}</span>
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

      <CopyLine value={target.command(base, slug)} />

      {target.link && (
        <a
          className="skill-launch"
          href={target.link(target.command(base, slug), entry.module)}>
          <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
          Open in {target.label}
        </a>
      )}

      <p className="skill-install__hint">{target.note}</p>

      <details className="skill-how">
        <summary className="skill-how__summary">How to use it</summary>
        <ol className="skill-how__steps">
          <li>Run the command above in the repository you are integrating.</li>
          <li>
            Ask your agent for the job in your own words. "{entry.example}"
            {entry.errorExample ? `, "why am I getting ${entry.errorExample}"` : ''}, or
            "write the {entry.module} tests for this". The skill loads when the task
            matches it.
          </li>
          <li>
            Check what it writes against these pages. The skill carries the facts,
            not the sandbox: nothing in it has been run against ABDM.
          </li>
          {target.link && (
            <li>
              Open in {target.label} needs that app installed. It fills the
              composer and waits: nothing runs until you read it and press Enter.
            </li>
          )}
        </ol>
      </details>

    </aside>
  );
}
