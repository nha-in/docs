# Build with AI

Every fact on this site is a public URL. There are three ways to put it in front of your agent, and they combine: the plugin is the one command that sets up the other two.

## Connect the Docs MCP server

A skill is a snapshot. The Docs MCP server is the same catalogue live, queried a paragraph at a time instead of loaded whole.

## Install the plugin

One command for both halves: the skills as files and the server as a connection. Claude takes it as a plugin; Cursor, Codex, ChatGPT and anything else that can fetch a URL take the same setup as a line to paste.

## Install a skill

One file per job. The module skills carry every endpoint, header, error code and test for that milestone; the FHIR skills are guided procedures for building or auditing NRCES compliant bundles.

## Read this site as an agent

export const ReadAsAgent = () => {
  const llmsTxt = useBaseUrl('/llms.txt');
  const llmsFullTxt = useBaseUrl('/llms-full.txt');
  const {pathname} = useLocation();
  const pageAsMarkdown = `${pathname.replace(/\/$/, '')}/index.md`;
  return (
    <div className="docs-cta-row">
      <Button asChild variant="outline" size="sm">
        <a href={llmsTxt}>
          <FileText className="size-3.5" aria-hidden="true" />
          View llms.txt
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={llmsFullTxt}>
          <FileText className="size-3.5" aria-hidden="true" />
          View llms-full.txt
        </a>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={pageAsMarkdown}>
          <FileText className="size-3.5" aria-hidden="true" />
          This page as Markdown
        </a>
      </Button>
    </div>
  );
};

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

## Ask AI

Ask this catalogue a question directly, without setting anything up.

export const AskAiButton = () => (
  <Button
    size="sm"
    onClick={() => window.dispatchEvent(new CustomEvent('abdm:ask-ai'))}>
    <Sparkles className="size-3.5" aria-hidden="true" />
    Ask AI
  </Button>
);

The same assistant sits in the search box at the top of every page, labelled "Search or ask AI".
