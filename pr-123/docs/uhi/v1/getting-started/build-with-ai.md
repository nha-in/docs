# Build with AI

Use the [UHI](/docs/pr-123/docs/uhi/v1/getting-started/glossary#uhi) documentation with AI-assisted development tools. Your coding agent can search the service guides, the API reference and the concept pages while you build.

note

Review all AI-generated code against the UHI documentation and run it in the sandbox.

Every fact on this site is a public URL. There are five ways to put it in front of your agent, and they combine.

[Recommended](#connect-the-docs-mcp-server)

[Docs MCP server](#connect-the-docs-mcp-server)

[This documentation live, queried a paragraph at a time as your agent works, including every UHI operation.](#connect-the-docs-mcp-server)

[AI plugin](#install-the-plugin)

[All six UHI skills in one install, updated in place, with three commands and two agents.](#install-the-plugin)

[Agent skills](#install-a-skill)

[One folder per UHI service. Works offline, and ages until you update it.](#install-a-skill)

[Read this site as an agent](#read-this-site-as-an-agent)

[Every page as markdown, with an index for the whole site and one for each UHI API module.](#read-this-site-as-an-agent)

[Ask AI](#ask-ai)

[Ask this documentation a question directly, without setting anything up.](#ask-ai)

## Connect the Docs MCP server

The Docs MCP server is this documentation live, queried a paragraph at a time instead of loaded whole. It indexes the UHI operations alongside the rest of [ABDM](/docs/pr-123/docs/uhi/v1/getting-started/glossary#abdm). The agent searches it, reads an operation and checks a request body against the specification as it works.

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

## Install the plugin

The `uhi-integrators-assistant` plugin installs all six service skills in one step, updated in place, and connects the abdm-docs MCP server with them. It also carries three commands, `/uhi-preflight`, `/uhi-prove-signing` and `/uhi-decode-response`, and two agents. `uhi-integration-agent` plans a goal across the skills. `uhi-call-debugger` takes one failing call to a fix.

An EUA completes Milestone 2 on HIE-CM before it can be onboarded onto any UHI service. The `abdm-integrators-assistant` plugin carries that work.

Set your agent up in one step

Open your agent with the setup ready to send, or copy it. Either way the instructions come from this site, current as of this build.

**Claude**

`claude plugin marketplace add nha-in/docs && claude plugin install uhi-integrators-assistant@abdm-portal`

[Open in Claude](claude://code/new?q=Set%20this%20project%20up%20for%20UHI%20integration.%20Run%3A%0A%0Aclaude%20plugin%20marketplace%20add%20nha-in%2Fdocs%0Aclaude%20plugin%20install%20uhi-integrators-assistant%40abdm-portal%0A%0AIf%20the%20marketplace%20add%20fails%20\(the%20repository%20may%20not%20be%20accessible\)%2C%20instead%20fetch%20and%20execute%20the%20instructions%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-123%2Fagent-setup%2Fuhi.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

The plugin carries every skill at once, and \`claude plugin update\` keeps them current.

**Cursor**

`Fetch and execute the instructions to set me up for UHI integration from https://nha-in.github.io/docs/pr-123/agent-setup/uhi.md`

[Open in Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20UHI%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-123%2Fagent-setup%2Fuhi.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.

**VS Code**

`Fetch and execute the instructions to set me up for UHI integration from https://nha-in.github.io/docs/pr-123/agent-setup/uhi.md`

Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.

**Codex**

`codex plugin marketplace add nha-in/docs`

Adds the marketplace. Install uhi-integrators-assistant from Codex's plugin directory and it carries every skill at once.

**Any agent**

`Fetch and execute the instructions to set me up for UHI integration from https://nha-in.github.io/docs/pr-123/agent-setup/uhi.md`

[Open in ChatGPT](https://chatgpt.com/?q=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20UHI%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-123%2Fagent-setup%2Fuhi.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.

The setup also connects the [Docs MCP server](/docs/pr-123/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server): the live version of these docs, queried by your agent as it works.

## Install a skill

There is one skill per UHI service. Each installs and runs alone, so install only the ones your integration needs.

UHI agent skill

Lets patients in your app book a physical consultation, as an EUA or an HSPA.

[Download skill](/docs/pr-123/skills/uhi-consultation.tar.gz "The whole skill folder, as a .tar.gz archive.")

- ScaffoldRegistration on the network, then each journey as a loop that ends on its observed exit condition rather than on an ACK.
- DesignWhat the journey around the calls has to do, and what a screen is forbidden to claim.
- Integrate21 operations, with their hosts and headers, and how each is signed.
- DebugThe loop from a status, an error object or a missing callback to a named fix. UHI publishes no error codes.
- TestThe checks the service is held to before go-live, and the steps to production.

`mkdir -p .claude/skills && curl -fsSL https://nha-in.github.io/docs/pr-123/skills/uhi-consultation.tar.gz | tar -xzf - -C .claude/skills`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20UHI%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-123%2Fskills%2Fuhi-consultation.tar.gz%20%7C%20tar%20-xzf%20-%20-C%20.claude%2Fskills%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "Let patients in our app book a physical consultation". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill names the cases it could not reach on the NHCX sandbox, and nothing in it is re-verified here.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

Download all skills

- [Physical consultation](https://nha-in.github.io/docs/pr-123/skills/uhi-consultation.tar.gz)
- [Ambulance](https://nha-in.github.io/docs/pr-123/skills/uhi-ambulance.tar.gz)
- [PM-JAY HEM](https://nha-in.github.io/docs/pr-123/skills/uhi-pmjay-hem.tar.gz)
- [Blood bank](https://nha-in.github.io/docs/pr-123/skills/uhi-blood-bank.tar.gz)
- [Jan Aushadhi](https://nha-in.github.io/docs/pr-123/skills/uhi-jan-aushadhi.tar.gz)
- [NOTTO](https://nha-in.github.io/docs/pr-123/skills/uhi-notto.tar.gz)

## Read this site as an agent

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Each UHI API module also has its own index at `/docs/uhi/v1/api/<module>/llms.txt`, and [the UHI API reference](/docs/pr-123/docs/uhi/v1/api) names the modules. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

[View llms.txt](/docs/pr-123/llms.txt)[View llms-full.txt](/docs/pr-123/llms-full.txt)[This page as Markdown](/docs/pr-123/docs/uhi/v1/getting-started/build-with-ai/index.md)

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

- The handling rules to hold your agent to: [Build it well](/docs/pr-123/docs/uhi/v1/getting-started/build-it-well).
- The service you are building: [Services](/docs/pr-123/docs/uhi/v1/services).
