/**
 * The install flow, walked through in the conversation rather than in a
 * pop-up over it.
 *
 * A reader who has just asked how to integrate something wants the catalogue
 * inside their own agent, and the shortest way there is the panel they are
 * already reading: pick the tool, say which agent, get the line to run. The
 * pop-up this replaces covered the answer they had asked for, and closed the
 * conversation to open a second one.
 *
 * The commands are the same ones the Build with AI page renders from
 * site/src/components/docs (AgentSetup, McpInstall, SkillPicker). They are
 * written again here rather than imported because this widget is a
 * standalone element that embeds on hosts which do not have that page, the
 * same reason its citations carry an absolute origin. Change one, change the
 * other.
 */

/** The three things this site offers an agent. */
export type ToolId = 'skills' | 'mcp' | 'plugin';

/** Which agent the reader is in. `other` carries a name they typed. */
export type AgentId = 'claude' | 'codex' | 'cursor' | 'other';

/** Where the flow has got to. `tools` is the opening move. */
export type Step =
  | {at: 'tools'}
  | {at: 'agents'; tool: ToolId}
  | {at: 'answer'; tool: ToolId; agent: AgentId; named?: string};

/** What the panel needs from its host to write a command out. */
export type Context = {docsOrigin: string; mcpUrl: string | null};

/** The repository that serves the Claude Code plugin marketplace. Update at
    handover, together with the same constant in site AgentSetup and in
    scripts/build-skills.mjs. */
const PLUGIN_REPO = 'eka-care/abdm-docs';

/** What the MCP server is called wherever it is installed. */
const MCP_NAME = 'abdm-docs';

export const TOOLS: {id: ToolId; label: string}[] = [
  {id: 'skills', label: 'Skills'},
  {id: 'mcp', label: 'MCP server'},
  {id: 'plugin', label: 'Plugin'},
];

export const AGENTS: {id: AgentId; label: string}[] = [
  {id: 'claude', label: 'Claude'},
  {id: 'codex', label: 'Codex'},
  {id: 'cursor', label: 'Cursor'},
  {id: 'other', label: 'Other'},
];

/**
 * What the reader sees the moment they ask for the tools: what each one is,
 * in a line, so the choice under it is a choice and not a guess.
 */
export const OVERVIEW = [
  'Three ways to give your agent this catalogue. Take any of them, or all three.',
  '',
  '- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.',
  '- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.',
  '- **Plugin**: Claude Code only. Every skill at once, kept current by `claude plugin update`.',
  '',
  'Which one do you want?',
].join('\n');

/** The plugin exists in one agent, so there is nothing to ask about it. */
export function needsAgent(tool: ToolId): boolean {
  return tool !== 'plugin';
}

export function toolLabel(tool: ToolId): string {
  return TOOLS.find((t) => t.id === tool)!.label;
}

/** How a reader is addressed once they have said which agent they are in. */
export function agentLabel(agent: AgentId, named?: string): string {
  if (agent === 'other') return named?.trim() || 'your agent';
  return AGENTS.find((a) => a.id === agent)!.label;
}

/** The one line that fetches this site's own setup instructions. */
function fetchPrompt(base: string): string {
  return `Fetch and execute the instructions to set me up for ABDM integration from ${base}/agent-setup/prompt.md`;
}

/**
 * What a deeplink lands in the agent's composer. Nothing runs until the
 * reader presses Enter, which is why install commands can sit in it.
 */
function guarded(body: string): string {
  return [
    body,
    '',
    'If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything.',
  ].join('\n');
}

function trimmed(origin: string): string {
  return origin.replace(/\/+$/, '');
}

/**
 * What the panel renders for a scripted answer.
 *
 * The command goes inside `text` as a fenced block rather than beside it as
 * a field of its own: the panel already renders fences, with the copy button
 * a reader has used on every other answer in the thread, and a second kind
 * of code box would be one to build and one to keep matching.
 */
export type Answer = {
  /** Markdown, shown by the same renderer the model's own answers use. */
  text: string;
  /** One click into the agent, where the agent has a scheme for it. */
  link?: {href: string; label: string};
};

/** A line to run, as the fence the panel already knows how to draw. */
function fenced(command: string): string {
  return ['```', command, '```'].join('\n');
}

const PLUGIN_COMMAND = `claude plugin marketplace add ${PLUGIN_REPO} && claude plugin install abdm-integrators-assistant@abdm-portal`;

function pluginLink(base: string): string {
  return `claude://code/new?q=${encodeURIComponent(
    guarded(
      [
        'Set this project up for ABDM integration. Run:',
        '',
        `claude plugin marketplace add ${PLUGIN_REPO}`,
        'claude plugin install abdm-integrators-assistant@abdm-portal',
        '',
        `If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${base}/agent-setup/prompt.md`,
      ].join('\n'),
    ),
  )}`;
}

function skills(agent: AgentId, named: string | undefined, base: string): Answer {
  const line = fetchPrompt(base);
  if (agent === 'claude') {
    return {
      text: [
        'Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.',
        '',
        fenced(PLUGIN_COMMAND),
      ].join('\n'),
      link: {href: pluginLink(base), label: 'Open in Claude'},
    };
  }
  if (agent === 'cursor') {
    return {
      text: [
        'Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.',
        '',
        fenced(line),
      ].join('\n'),
      link: {
        href: `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(
          guarded(line),
        )}`,
        label: 'Open in Cursor',
      },
    };
  }
  if (agent === 'codex') {
    return {
      text: [
        'Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.',
        '',
        fenced(line),
      ].join('\n'),
    };
  }
  return {
    text: [
      `Any agent that can fetch a URL takes this line, ${agentLabel(
        agent,
        named,
      )} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,
      '',
      fenced(line),
    ].join('\n'),
  };
}

function mcp(agent: AgentId, named: string | undefined, base: string, url: string | null): Answer {
  if (!url) {
    // The locked state the site's own panel shows, said in a sentence. The
    // server is live; a build with no backend just does not carry its
    // address, and inventing one here would be worse than saying so.
    return {
      text: `The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${base}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`,
    };
  }
  if (agent === 'claude') {
    return {
      text: [
        'User scope, so it is there in every project rather than only this directory.',
        '',
        fenced(`claude mcp add --transport http ${MCP_NAME} ${url} -s user`),
      ].join('\n'),
      link: {
        href: `claude://code/new?q=${encodeURIComponent(
          [
            'Add the ABDM documentation MCP server, then use it to answer my ABDM questions.',
            '',
            'Run this:',
            `claude mcp add --transport http ${MCP_NAME} ${url} -s user`,
            '',
            'User scope, so it is available in every project rather than only this directory.',
          ].join('\n'),
        )}`,
        label: 'Open in Claude',
      },
    };
  }
  if (agent === 'cursor') {
    return {
      text: 'The link opens Cursor on a confirmation dialog, and there is no command to run.',
      link: {
        href: `cursor://anysphere.cursor-deeplink/mcp/install?name=${MCP_NAME}&config=${encodeURIComponent(
          btoa(JSON.stringify({url})),
        )}`,
        label: 'Add to Cursor',
      },
    };
  }
  return {
    text: [
      `Any client that reads an \`mcpServers\` config takes this block as it stands, ${agentLabel(
        agent,
        named,
      )} included.`,
      '',
      fenced(JSON.stringify({mcpServers: {[MCP_NAME]: {url}}}, null, 2)),
    ].join('\n'),
  };
}

/**
 * The scripted answer for one tool and one agent.
 *
 * Every branch says something true for the agent it names. Where a vendor
 * ships no scheme for what is being installed there is no link, because a
 * button that opens nothing is worse than a line to paste.
 */
export function answer(step: Extract<Step, {at: 'answer'}>, ctx: Context): Answer {
  const base = trimmed(ctx.docsOrigin);
  if (step.tool === 'plugin') {
    return {
      text: [
        "The plugin is Claude Code's own format, so there is one answer here. Run this in the repository you are integrating, and `claude plugin update` keeps it current.",
        '',
        fenced(PLUGIN_COMMAND),
      ].join('\n'),
      link: {href: pluginLink(base), label: 'Open in Claude'},
    };
  }
  if (step.tool === 'mcp') return mcp(step.agent, step.named, base, ctx.mcpUrl);
  return skills(step.agent, step.named, base);
}

/**
 * What the panel says at a step. The opening move explains the three tools,
 * the second asks the one question that changes the answer, and the third is
 * the answer itself.
 */
export function say(step: Step, ctx: Context): string {
  if (step.at === 'tools') return OVERVIEW;
  if (step.at === 'agents') {
    return `${toolLabel(step.tool)} it is. Which agent are you working in?`;
  }
  return answer(step, ctx).text;
}

/**
 * Whether a question is one an agent would help with, which is the only kind
 * that should be offered the tools.
 *
 * A reader asking what a care context is wants the sentence, not a plugin. A
 * reader asking why their link request fails is already in an editor, and the
 * catalogue in their agent is the thing that shortens their afternoon. The
 * list is intent, not vocabulary: words that only appear in the answer, like
 * "endpoint" or "callback", are left out, because every answer here has them
 * and the offer would be back under all of them.
 */
const INTENT =
  /\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;

export function wantsTools(question: string): boolean {
  return INTENT.test(question);
}
