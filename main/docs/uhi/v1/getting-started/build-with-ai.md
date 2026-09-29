# Build with AI

Use the [UHI](/docs/main/docs/uhi/v1/getting-started/glossary#uhi) documentation with AI-assisted development tools. Your coding agent can search the service guides, the API reference and the concept pages while you build.

note

Review all AI-generated code against the UHI documentation and run it in the sandbox.

Every fact on this site is a public URL. There are three ways to put it in front of your agent.

[Recommended](#connect-the-docs-mcp-server)

[Docs MCP server](#connect-the-docs-mcp-server)

[This documentation live, queried a paragraph at a time as your agent works, including every UHI operation.](#connect-the-docs-mcp-server)

[Read this site as an agent](#read-this-site-as-an-agent)

[Every page as markdown, with an index for the whole site and one for each UHI API module.](#read-this-site-as-an-agent)

[Ask AI](#ask-ai)

[Ask this documentation a question directly, without setting anything up.](#ask-ai)

## Connect the Docs MCP server

The Docs MCP server is this documentation live, queried a paragraph at a time instead of loaded whole. It indexes the UHI operations alongside the rest of [ABDM](/docs/main/docs/uhi/v1/getting-started/glossary#abdm). The agent searches it, reads an operation and checks a request body against the specification as it works.

Docs MCP server

Your agent queries this catalogue as it works, instead of loading it.

- SearchHybrid keyword and semantic search over every page here, so an agent retrieves the paragraph it needs instead of loading the site.`search_docs, get_atom, related_atoms, list_atoms`
- DecodeTurn an error code you just received into what it means and what to do, without you finding the right table.`decode_error`
- ValidateCheck a request body against the specification before you send it, and list or read any operation.`validate_request, list_operations, get_operation`

**Claude**

[Add to Claude](claude://code/new?q=Add%20the%20ABDM%20documentation%20MCP%20server%2C%20then%20use%20it%20to%20answer%20my%20ABDM%20questions.%0A%0ARun%20this%3A%0Aclaude%20mcp%20add%20--transport%20http%20abdm-docs%20https%3A%2F%2Fdocs.abdm.gov.in%2Fmcp%20-s%20user%0A%0AUser%20scope%2C%20so%20it%20is%20available%20in%20every%20project%20rather%20than%20only%20this%20directory.%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

`claude mcp add --transport http abdm-docs https://docs.abdm.gov.in/mcp -s user`

User scope, so it is there in every project rather than only this directory. Claude Desktop takes the generic block under "Any agent" instead.

**Cursor**

[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=abdm-docs\&config=eyJ1cmwiOiJodHRwczovL2RvY3MuYWJkbS5nb3YuaW4vbWNwIn0%3D)

`{ "mcpServers": { "abdm-docs": { "url": "https://docs.abdm.gov.in/mcp" } } }`

The link opens Cursor on a confirmation dialog. The block goes in .cursor/mcp.json if you would rather add it by hand.

**VS Code**

[Add to VS Code](vscode:mcp/install?%7B%22name%22%3A%22abdm-docs%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs.abdm.gov.in%2Fmcp%22%7D)

`code --add-mcp '{"name":"abdm-docs","type":"http","url":"https://docs.abdm.gov.in/mcp"}'`

The link opens VS Code on a confirmation dialog. The command does the same from a terminal.

**Codex**

`codex mcp add abdm-docs --url https://docs.abdm.gov.in/mcp`

Writes it to \~/.codex/config.toml, which the Codex CLI, the IDE extension and the desktop app all read. Run /mcp in a session to confirm it connected.

**Any agent**

`{ "mcpServers": { "abdm-docs": { "url": "https://docs.abdm.gov.in/mcp" } } }`

Any MCP client that reads an mcpServers config, Claude Desktop included, takes this block as is.

Tell the agent to look an operation up here before it writes the call. It then reads the UHI message shape rather than recalling another protocol's.

## Read this site as an agent

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Each UHI API module also has its own index at `/docs/uhi/v1/api/<module>/llms.txt`, and [the UHI API reference](/docs/main/docs/uhi/v1/api) names the modules. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

[View llms.txt](/docs/main/llms.txt)[View llms-full.txt](/docs/main/llms-full.txt)[This page as Markdown](/docs/main/docs/uhi/v1/getting-started/build-with-ai/index.md)

## Ask AI

Ask this documentation a question directly, without setting anything up.

The same assistant sits in the search box at the top of every page, labelled "Search or ask AI".

### Attaching a file

Ask AI takes a file with your question: a failing request body, a callback you received, a log, a CSV, a PDF, or a screenshot. The paperclip is on the left of the box. At most 20,000 characters of text, 256KB for a text file and 8MB for a PDF or an image.

What happens to it is worth knowing before you attach one.

- The file is read in your own browser and only the text it gives up travels with your question. A screenshot is read by a text recognition engine your browser downloads once, from this site, and runs on your own machine. Nothing is uploaded and nothing is stored: the conversation lives in the panel and is gone when you close it.
- A PDF that is only pictures of text, a scan, gives up nothing. Screenshot the part you mean instead and that will be read.
- Personal data is removed before the file reaches the model. Aadhaar, ABHA, PAN, passport, voter, mobile, email and bearer tokens are matched by pattern anywhere in the file, and a JSON file is also masked by its field names.
- What none of that catches is a name written in running prose, with nothing marking it as a name. Redact those yourself, the same way you would in a support request.
- Your question is logged, masked, to improve the answers. The file is not logged.

Never paste your private key into Ask AI or into any agent. Signing happens on your own server.

## Next steps

- The handling rules to hold your agent to: [Build it well](/docs/main/docs/uhi/v1/getting-started/build-it-well).
- The service you are building: [Services](/docs/main/docs/uhi/v1/services).
