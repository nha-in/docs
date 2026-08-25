import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Check, Copy, Download, Sparkles} from 'lucide-react';
import {cn} from '@site/src/lib/utils';

export type SkillInstallProps = {
  /** The module the skill covers, for example "M1". */
  module: string;
  /** The skill's folder name, for example "abdm-m1". */
  slug: string;
  /** One line on what the skill gives an agent. */
  note: string;
};

type Target = {
  id: string;
  label: string;
  /** Built from the published URL, so the command works where the site is. */
  command: (url: string, slug: string) => string;
  note: string;
};

const TARGETS: Target[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    command: (url, slug) =>
      `mkdir -p .claude/skills/${slug} && curl -fsSL ${url}/skills/${slug}/SKILL.md -o .claude/skills/${slug}/SKILL.md`,
    note: 'Drops the skill into this project. Claude Code picks it up on the next run, and loads it when a task matches its description.',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    command: (url, slug) =>
      `mkdir -p .cursor/rules && curl -fsSL ${url}/skills/${slug}.mdc -o .cursor/rules/${slug}.mdc`,
    note: 'The same content with Cursor rule frontmatter, written where Cursor looks for rules.',
  },
  {
    id: 'any',
    label: 'Any agent',
    command: (url, slug) => `curl -fsSL ${url}/skills/${slug}/SKILL.md`,
    note: 'It is one markdown file. Fetch it and put it wherever your agent reads context from.',
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

/**
 * The skill bundle for a module: a file to download, and the one command that
 * puts it where an agent will read it.
 *
 * The file is generated from these pages by scripts/build-skills.mjs on every
 * build, so an agent works from the same facts a reader does, and a page that
 * changes changes the skill.
 */
export default function SkillInstall({
  module,
  slug,
  note,
}: SkillInstallProps): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [target, setTarget] = useState(TARGETS[0]);
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');
  const download = useBaseUrl(`/skills/${slug}/SKILL.md`);

  return (
    <aside className="skill-install">
      <div className="skill-install__head">
        <span className="skill-install__icon" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        <div className="skill-install__body">
          <p className="skill-install__title">{module} agent skill</p>
          <p className="skill-install__note">{note}</p>
        </div>
        <a className="skill-install__download" href={download} download>
          <Download className="size-4" aria-hidden="true" />
          Download
        </a>
      </div>

      <div className="skill-install__targets" role="tablist" aria-label="Install for">
        {TARGETS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === target.id}
            className={cn(
              'skill-install__target',
              entry.id === target.id && 'skill-install__target--active',
            )}
            onClick={() => setTarget(entry)}>
            {entry.label}
          </button>
        ))}
      </div>

      <CopyLine value={target.command(base, slug)} />
      <p className="skill-install__hint">{target.note}</p>
    </aside>
  );
}
