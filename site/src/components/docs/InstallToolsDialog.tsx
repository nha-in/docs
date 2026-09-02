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
 * The "Install tools" pop-up: a centred dialog reusing the three panels the
 * Build with AI page already built (AgentSetup, SkillPicker, McpInstall),
 * behind tabs instead of stacked one after another.
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
          <DialogTitle>Install tools</DialogTitle>
          <DialogDescription>
            Give your coding agent everything on this site.
          </DialogDescription>
        </DialogHeader>

        <div className="markdown overflow-y-auto px-6" style={{maxHeight: '80vh'}}>
          <Tabs defaultValue="agent-setup">
            <TabsList>
              <TabsTrigger value="agent-setup">Agent setup</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="mcp">MCP server</TabsTrigger>
            </TabsList>
            <TabsContent value="agent-setup">
              <AgentSetup />
            </TabsContent>
            <TabsContent value="skills">
              <SkillPicker />
            </TabsContent>
            <TabsContent value="mcp">
              <McpInstall />
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
