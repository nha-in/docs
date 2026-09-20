import React, {useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {Check, Copy, Download, Sparkles, SquareArrowOutUpRight} from 'lucide-react';
import {cn} from '@site/src/lib/utils';
import manifest from '@site/src/data/skills.json';
import {AGENTS, AgentId} from './agents';

export type SkillInstallProps = {
  /** The skill's folder name, for example "abdm-m1". Keys into skills.json. */
  slug: string;
  /** One line on what the skill gives an agent. */
  note: string;
};

type Entry = {
  /** Absent on module skills; "guided" marks a committed procedure skill. */
  kind?: 'guided';
  module: string;
  title: string;
  docs?: string;
  example: string;
  errorExample?: string | null;
  operations?: number;
  codes?: number;
  /** Test matrix rows the skill carries. Only the NHCX skills count these. */
  tests?: number;
  /** The reference files this skill is made of, from the generator. */
  sections: string[];
  /** True when the skill is more than SKILL.md plus references/, so it ships
      as an archive. The NHCX skills are 59 files across eight directories. */
  folder?: boolean;
};

type Target = {
  /** Built from the published URL, so the command works where the site is. */
  command: (url: string, slug: string, entry: Entry) => string;
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

/**
 * A skill is a folder: the SKILL.md that routes, and the sections it links to
 * under references/, which an agent loads only when the work needs them.
 * Fetching the router alone leaves every link in it broken, so every command
 * here takes the whole folder.
 *
 * A skill marked `folder` is more than that shape. The NHCX skills carry
 * core/, stages/, flow/, fhir/, ui/, templates/ and scripts/ as well, 59 files
 * in all, so naming their sections in a curl loop would fetch three files that
 * do not exist and leave every pointer in the router broken. Those take the
 * archive the generator already writes beside them.
 */
function fetchFolder(url: string, slug: string, dir: string, entry: Entry) {
  if (entry.folder) {
    return [
      `mkdir -p ${dir}`,
      `curl -fsSL ${url}/skills/${slug}.tar.gz | tar -xzf - -C ${dir}`,
    ].join(' && ');
  }
  const into = `${dir}/${slug}`;
  return [
    `mkdir -p ${into}/references`,
    `curl -fsSL ${url}/skills/${slug}/SKILL.md -o ${into}/SKILL.md`,
    `for f in ${entry.sections.join(' ')}; do curl -fsSL ${url}/skills/${slug}/references/$f.md -o ${into}/references/$f.md; done`,
  ].join(' && ');
}

const TARGETS: Record<AgentId, Target> = {
  claude: {
    command: (url, slug, entry) => fetchFolder(url, slug, '.claude/skills', entry),
    // https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link
    link: (command, module) =>
      `claude://code/new?q=${encodeURIComponent(promptFor(command, module))}`,
    note: 'Drops the skill into this project. Claude loads it when a task matches.',
  },
  cursor: {
    // Cursor reads Agent Skills natively now (cursor.com/docs/context/skills),
    // so this is the same folder every other target takes. It used to be
    // converted into a .mdc project rule, which was the answer before the
    // format was a standard Cursor implemented.
    command: (url, slug, entry) => fetchFolder(url, slug, '.cursor/skills', entry),
    // https://cursor.com/docs/integrations/deeplinks. Cursor has no skill
    // install deeplink, but it has a prompt one, so this lands the same way the
    // Claude link does: the command in the composer, waiting to be sent.
    link: (command, module) =>
      `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
        promptFor(command, module),
      )}`,
    note: 'Cursor reads this folder as a skill and matches it by its description when a task calls for it.',
  },
  vscode: {
    command: (url, slug, entry) => fetchFolder(url, slug, '.github/skills', entry),
    // VS Code has a deeplink for MCP servers but none for skills, so this
    // target is the command only. Do not invent one.
    link: null,
    note: 'GitHub Copilot reads this on every surface your team uses, not only your editor.',
  },
  codex: {
    command: (url, slug, entry) => fetchFolder(url, slug, '.agents/skills', entry),
    // Codex is a CLI with no URL scheme. Do not invent one.
    link: null,
    note: 'Codex reads this folder as a skill and loads it when a task matches its description.',
  },
  any: {
    command: (url, slug, entry) => fetchFolder(url, slug, 'skills', entry),
    link: null,
    note: 'One folder. Put it wherever your agent reads skills from.',
  },
};

/**
 * What the skill carries, one row per section the generator actually wrote.
 *
 * Driven by entry.sections rather than by a fixed list, so a module with no
 * scaffolding loop of its own does not get a row promising one.
 */
const DETAIL: Record<string, (entry: Entry) => string> = {
  scaffold: (entry) =>
    entry.folder
      ? 'The loop that builds the use case stage by stage, ending when a gate closes on evidence rather than on the work looking right.'
      : 'The loop that builds the module flow by flow against the sandbox, ending on an observed result rather than on a call returning 200.',
  test: (entry) =>
    (entry.tests ?? 0) > 0
      ? `${entry.tests} test matrix rows, from offline pins up to a live payer on the sandbox.`
      : 'The test pyramid, from offline pins up to a live payer on the sandbox.',
  generate: () => 'Building NRCES compliant bundle generation into a codebase.',
  audit: () => "Checking an existing FHIR store's output against the same profiles.",
};

function capabilities(entry: Entry) {
  const counted = [
    {
      label: 'Integrate',
      detail:
        (entry.operations ?? 0) > 0
          ? `${entry.operations} operations, with their hosts, headers and the rules that hold across them.`
          : 'No operation is recorded for this module yet.',
    },
    {
      label: 'Debug',
      detail:
        (entry.codes ?? 0) > 0
          ? `${entry.codes} recorded error codes, each with its message and what to do about it.`
          : 'No error code is recorded for this module yet.',
    },
  ];
  const named = new Map(counted.map((row) => [row.label.toLowerCase(), row]));
  return entry.sections.map((section) => {
    const row = named.get(section);
    if (row) return row;
    return {
      label: `${section[0].toUpperCase()}${section.slice(1)}`,
      detail: DETAIL[section]?.(entry) ?? '',
    };
  });
}

/** Copies the raw SKILL.md text, not just the install command, for a reader
    who wants to paste the file itself somewhere the curl targets do not cover. */
function CopySkillButton({url}: {url: string}) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  return (
    <button
      type="button"
      className="skill-install__download"
      onClick={async () => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(String(res.status));
          await navigator.clipboard.writeText(await res.text());
          setState('copied');
        } catch {
          setState('error');
        }
        window.setTimeout(() => setState('idle'), 2000);
      }}>
      {state === 'copied' ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {state === 'error' ? 'Unavailable here' : state === 'copied' ? 'Copied' : 'Copy SKILL.md'}
    </button>
  );
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
  const [agent, setAgent] = useState(AGENTS[0]);
  const target = TARGETS[agent.id];
  const base = `${siteConfig.url}${siteConfig.baseUrl}`.replace(/\/+$/, '');
  // The router, for the copy button. The install commands take the whole
  // folder, because the router alone has links to files that are not there.
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
          <p className="skill-install__title">
            {entry.module} agent skill
          </p>
          <p className="skill-install__note">{note}</p>
        </div>
        <div className="skill-install__actions">
          <CopySkillButton url={download} />
          {/* The router only. Named for what it is, because the folder is
              what installs and the command above is what fetches it. */}
          <a
            className="skill-install__download"
            href={download}
            download
            title="The router. Use the command below to take the references with it.">
            <Download className="size-4" aria-hidden="true" />
            SKILL.md
          </a>
        </div>
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
        {AGENTS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === agent.id}
            className={cn(
              'skill-install__target',
              option.id === agent.id && 'skill-install__target--active',
            )}
            onClick={() => setAgent(option)}>
            {option.label}
          </button>
        ))}
      </div>

      <CopyLine value={target.command(base, slug, entry)} />

      {target.link && (
        <a
          className="skill-launch"
          href={target.link(target.command(base, slug, entry), entry.module)}>
          <SquareArrowOutUpRight className="size-3.5" aria-hidden="true" />
          Open in {agent.label}
        </a>
      )}

      <p className="skill-install__hint">{target.note}</p>

      <details className="skill-how">
        <summary className="skill-how__summary">How to use it</summary>
        <ol className="skill-how__steps">
          <li>Run the command above in the repository you are integrating.</li>
          <li>
            Ask your agent for the job in your own words. "{entry.example}"
            {entry.errorExample ? `, "why am I getting ${entry.errorExample}"` : ''}
            {'. The skill loads when the task matches it.'}
          </li>
          <li>
            {/* The ABDM skills are compiled from the catalogue and no call in
                them has been run. The NHCX skills were built against the NHCX
                sandbox, and say so in their own routers, so claiming the
                opposite here would be the page contradicting the skill. */}
            {entry.folder ? (
              <>
                Check what it writes against these pages. The skill names the
                cases it could not reach on the NHCX sandbox, and nothing in it
                is re-verified here.
              </>
            ) : (
              <>
                Check what it writes against these pages. The skill carries the
                facts, not the sandbox: nothing in it has been run against ABDM.
              </>
            )}
          </li>
          {target.link && (
            <li>
              Open in {agent.label} needs that app installed. It fills the
              composer and waits: nothing runs until you read it and press Enter.
            </li>
          )}
        </ol>
      </details>

    </aside>
  );
}
