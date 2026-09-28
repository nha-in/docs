import type {ReactNode} from 'react';

/**
 * Content written for AI agents: rules, exit conditions, failure modes, as
 * Mintlify's <Visibility for="agents"> and Fern's <llms-only> carry it.
 * Always rendered into the HTML, because emit-page-markdown builds each
 * page's .md copy and llms-full.txt from the HTML; hidden by CSS until the
 * reader turns notes on from the footer link or with ?agent-notes=1.
 */
export default function AgentOnly({children}: {children: ReactNode}): ReactNode {
  return (
    <aside className="agent-only" data-agent-only>
      <p className="agent-only__label">Notes for AI agents</p>
      {children}
    </aside>
  );
}
