/**
 * The agents every install panel on Build with AI offers, in one place.
 *
 * The page tells a reader there are three ways to hand this catalogue to an
 * agent, and says they combine. Three ways that answer for three different
 * sets of agents do not combine: the MCP panel used to speak to Claude only,
 * so a Cursor or Codex reader reached the server by reading a Claude command
 * and translating it. One row, defined here, and each panel says what it
 * installs for each entry in it.
 *
 * What lives here is what does not change between panels: the agent's name,
 * and the directory it reads Agent Skills from. Commands and deeplinks are
 * the panel's own business, because they differ per panel by nature.
 *
 * ChatGPT is deliberately absent. It installs nothing into a project, so it
 * cannot answer the skill or the plugin panel; the line under "Any agent" is
 * what a reader pastes into it, and that target carries its deeplink.
 */
export type AgentId = 'claude' | 'cursor' | 'vscode' | 'codex' | 'any';

export type Agent = {
  id: AgentId;
  label: string;
  /** Where this agent reads Agent Skills from, relative to the project. */
  skillDir: string;
};

export const AGENTS: Agent[] = [
  {id: 'claude', label: 'Claude', skillDir: '.claude/skills'},
  {id: 'cursor', label: 'Cursor', skillDir: '.cursor/skills'},
  {id: 'vscode', label: 'VS Code', skillDir: '.github/skills'},
  {id: 'codex', label: 'Codex', skillDir: '.agents/skills'},
  {id: 'any', label: 'Any agent', skillDir: 'skills'},
];

/** The MCP server's name wherever it is installed. */
export const MCP_NAME = 'abdm-docs';

/** The prompt a one click launch lands in an agent's composer. Nothing is
    sent and nothing runs until the reader presses Enter, which is why an
    install command can sit in it. No working directory is set, because we
    cannot know where the reader keeps the project they are integrating. */
export function guarded(body: string): string {
  return [
    body,
    '',
    'If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything.',
  ].join('\n');
}
