import React from 'react';
import Link from '@docusaurus/Link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@site/src/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@site/src/components/ui/tabs';
import AgentSetup from './AgentSetup';
import McpInstall from './McpInstall';
import SkillPicker from './SkillPicker';

export type InstallToolsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * The "Install AI tools" pop-up: a centred dialog reusing the three panels the
 * Build with AI page already built (McpInstall, AgentSetup, SkillPicker),
 * behind tabs instead of stacked one after another.
 *
 * It is that page in brief, so it says the same things in the same order and
 * with the same names. A reader who opens this and then opens the page should
 * meet no new vocabulary: the server first and recommended, the plugin as the
 * one command that sets up both, the skills as files. The leads below are the
 * page's three cards, shortened.
 *
 * Those three assume they render inside a doc page's MDX body, which
 * Docusaurus wraps in a `.markdown` element: most of their text (titles,
 * notes, hints, the skill capability list) is only styled by `.markdown`
 * ancestor selectors in sidebar.css and typography.css, with no un-scoped
 * fallback. Outside that ancestor the same markup would render with
 * browser-default type. Rather than editing those read-only components,
 * the tab body below is wrapped in a plain `.markdown` div, the same class
 * Docusaurus itself puts around them on the Build with AI page, so they
 * pick up their intended styling unchanged.
 */
export default function InstallToolsDialog({
  open,
  onOpenChange,
}: InstallToolsDialogProps): React.ReactNode {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-[720px]">
        <DialogHeader className="gap-1 p-6 pb-4">
          <DialogTitle>Install AI tools</DialogTitle>
          <DialogDescription>
            Every fact on this site is a public URL. Three ways to put it in
            front of your coding agent, and they combine.
          </DialogDescription>
        </DialogHeader>

        <div className="markdown overflow-y-auto px-6" style={{maxHeight: '80vh'}}>
          <Tabs defaultValue="mcp">
            <TabsList>
              <TabsTrigger value="mcp">Docs MCP server</TabsTrigger>
              <TabsTrigger value="plugin">AI plugin</TabsTrigger>
              <TabsTrigger value="skills">Agent skills</TabsTrigger>
            </TabsList>
            <TabsContent value="mcp">
              <p className="install-tools__lead">
                Recommended. This documentation live, queried a paragraph at a
                time as your agent works. It cannot go stale, because it is this
                site answering.
              </p>
              <McpInstall />
            </TabsContent>
            <TabsContent value="plugin">
              <p className="install-tools__lead">
                One command that sets your agent up with both of the others: the
                skills as files, the server as a connection.
              </p>
              <AgentSetup />
            </TabsContent>
            <TabsContent value="skills">
              <p className="install-tools__lead">
                One file per job, carrying a whole milestone: every endpoint,
                header, error code and test. Works offline, and ages until you
                update it.
              </p>
              <SkillPicker />
            </TabsContent>
          </Tabs>
        </div>

        <p className="m-0 border-t border-[var(--border)] px-6 py-4 text-sm text-[var(--text-muted)]">
          <Link to="/docs/hiecm/v3/getting-started/build-with-ai">
            Everything about building with AI
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
