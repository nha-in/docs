/**
 * The four skills a reader can assign to a question, and what the server says back about
 * the skill a command used.
 *
 * A command names a section of a module's agent skill. The panel sends only
 * the name, never the skill's text: the server has the text, works out which
 * module the question is about, and says which section it used in a `skill`
 * event before the answer starts.
 */
export const COMMANDS = [
  {id: 'scaffold', label: 'Scaffold', hint: 'Set up a project for a module'},
  {id: 'design', label: 'Design', hint: 'The design rules for a module'},
  {id: 'integrate', label: 'Integrate', hint: 'Build a module step by step'},
  {id: 'debug', label: 'Debug', hint: 'Work out why a call fails'},
] as const;

export type CommandId = (typeof COMMANDS)[number]['id'];

export type SkillUse = {
  module?: string;
  section: string;
  status: 'used' | 'missing' | 'unresolved';
  resolved_by?: 'pick' | 'page' | 'question';
  truncated?: boolean;
  uri?: string;
  href?: string;
  candidates?: string[];
};

/**
 * The skills a draft that starts with a slash is asking for: all four for a
 * bare slash, then those whose name starts with what follows. Nothing once
 * there is a space, because by then it is a question.
 */
export function slashMatches(draft: string) {
  const m = /^\/([a-z]*)$/i.exec(draft);
  if (!m) return [];
  const typed = m[1].toLowerCase();
  return COMMANDS.filter((c) => c.id.startsWith(typed));
}

export const commandLabel = (id: string) => COMMANDS.find((c) => c.id === id)?.label ?? id;

/** `abdm-m2` reads as M2, `abdm-scan-and-pay` as Scan and pay. */
export function moduleLabel(module: string): string {
  const bare = module.replace(/^abdm-/, '');
  if (/^[mp]\d$/.test(bare)) return bare.toUpperCase();
  const words = bare.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** The line the panel shows for a skill event. */
export function skillNote(use: SkillUse): string {
  switch (use.status) {
    case 'used':
      return `Using ${moduleLabel(use.module ?? '')} · ${commandLabel(use.section)}`;
    case 'missing':
      return `No ${use.section} guide for ${moduleLabel(use.module ?? '')} yet. Answering from the docs.`;
    default:
      return 'Which module is this about?';
  }
}
