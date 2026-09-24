# Build with AI

Use ABDM documentation with AI-assisted development tools. Developers may use supported AI-assisted tools to search ABDM integration guides, API references and milestone-specific documentation while building their solution.

note

Review all AI-generated code against the official ABDM documentation and test it in the Sandbox.

Every fact on this site is a public URL. There are three ways to put it in front of your agent, and they combine: the plugin is the one command that sets up the other two.

[Recommended](#connect-the-docs-mcp-server)

[Search the documentation (MCP server)](#connect-the-docs-mcp-server)

[Use the documentation service while developing to find API endpoints, review request formats and understand error codes.](#connect-the-docs-mcp-server)

[Set up your coding assistant](#install-the-plugin)

[Follow the setup guide to connect a supported coding assistant with the ABDM documentation and begin using it for integration support.](#install-the-plugin)

[Use milestone-specific guidance](#install-a-skill)

[Provide the coding assistant with the relevant references for ABHA, record linking, consent, registries or FHIR bundles.](#install-a-skill)

## Learn how to use AI

Never built with a coding assistant before? Start here. Three things have to be in place before anything else on this page works.

| What you need               | Why                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| A coding assistant          | Claude, Cursor, VS Code with GitHub Copilot, Codex and ChatGPT are the ones set up below. Any of them is enough. Pick one and stay on it. |
| A paid plan on it           | Free tiers stop partway through a long task. The cheapest paid plan on any of these carries a milestone.                                  |
| Your own project open in it | The assistant reads and writes the folder it is opened in. Open the repository you are integrating ABDM into first.                       |

Then work down the page in order.

1. Connect the Docs MCP server, so the assistant looks ABDM up here instead of recalling an older version of it.
2. Install the plugin, which is one command or one pasted line.
3. Install the skill for the milestone you are on, M1 first if you are starting.
4. Ask for what you want in plain language, one flow at a time. "Add ABHA creation by Aadhaar OTP to this project, using the M1 skill" is a good first prompt.

You do not need to know what MCP, a plugin or a skill is to use them. They are three ways of handing the same documentation to the assistant: live lookup, one install for everything, and one file for one milestone.

Read what it writes before you run it. An assistant is fast and confident, and it is wrong in ways only the Sandbox will show you.

## Connect the Docs MCP server

A skill is a snapshot. The Docs MCP server is the same catalogue live, queried a paragraph at a time instead of loaded whole.

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

## Install the plugin

One command for both halves: the skills as files and the server as a connection. Claude and Codex take it as a plugin; Cursor, VS Code, ChatGPT and anything else that can fetch a URL take the same setup as a line to paste.

Set your agent up in one step

Open your agent with the setup ready to send, or copy it. Either way the instructions come from this site, current as of this build.

**Claude**

`claude plugin marketplace add nha-in/docs && claude plugin install abdm-integrators-assistant@abdm-portal`

[Open in Claude](claude://code/new?q=Set%20this%20project%20up%20for%20ABDM%20integration.%20Run%3A%0A%0Aclaude%20plugin%20marketplace%20add%20nha-in%2Fdocs%0Aclaude%20plugin%20install%20abdm-integrators-assistant%40abdm-portal%0A%0AIf%20the%20marketplace%20add%20fails%20\(the%20repository%20may%20not%20be%20accessible\)%2C%20instead%20fetch%20and%20execute%20the%20instructions%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

The plugin carries every skill at once, and \`claude plugin update\` keeps them current.

**Cursor**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/main/agent-setup/prompt.md`

[Open in Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.

**VS Code**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/main/agent-setup/prompt.md`

Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.

**Codex**

`codex plugin marketplace add nha-in/docs`

Adds the marketplace. Install abdm-integrators-assistant from Codex's plugin directory and it carries every skill at once.

**Any agent**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/main/agent-setup/prompt.md`

[Open in ChatGPT](https://chatgpt.com/?q=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.

The setup also connects the [Docs MCP server](/docs/main/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server): the live version of these docs, queried by your agent as it works.

## Install a skill

One file per job, in three shapes. A module skill carries every endpoint, header and error code for that milestone, provider side (M1 to M4) or patient side (P1 to P4). A scaffold or debug skill is a procedure instead: it works against the sandbox in a loop that ends on an observed result, not on a call returning 200. Every module skill carries both, under its `references/`. The FHIR skills build or audit NRCES compliant bundles.

M1 agent skill

The whole of M1: the calls, the loop that builds them, every error code and the tests.

[SKILL.md](/docs/main/skills/abdm-m1/SKILL.md "The router. Use the command below to take the references with it.")

- ScaffoldThe loop that builds the module flow by flow against the sandbox, ending on an observed result rather than on a call returning 200.
- DesignWhat the journey around the calls has to do, and what a screen is forbidden to claim.
- Integrate125 operations, with their hosts and headers.
- Debug17 error codes, each with what to do about it.

`mkdir -p .claude/skills/abdm-m1/references && curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-m1/SKILL.md -o .claude/skills/abdm-m1/SKILL.md && for f in scaffold design integrate debug; do curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-m1/references/$f.md -o .claude/skills/abdm-m1/references/$f.md; done`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20M1%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%2Fabdm-m1%2Freferences%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fskills%2Fabdm-m1%2FSKILL.md%20-o%20.claude%2Fskills%2Fabdm-m1%2FSKILL.md%20%26%26%20for%20f%20in%20scaffold%20design%20integrate%20debug%3B%20do%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fmain%2Fskills%2Fabdm-m1%2Freferences%2F%24f.md%20-o%20.claude%2Fskills%2Fabdm-m1%2Freferences%2F%24f.md%3B%20done%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "Add ABHA creation by Aadhaar OTP to this codebase", "why am I getting 404". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill carries the facts, not the sandbox: nothing in it has been run against ABDM.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

Download all skills

- [Create and verify ABHA (M1)](https://nha-in.github.io/docs/main/skills/abdm-m1/SKILL.md)
- [Create and link records (M2)](https://nha-in.github.io/docs/main/skills/abdm-m2/SKILL.md)
- [Fetch data with consent (M3)](https://nha-in.github.io/docs/main/skills/abdm-m3/SKILL.md)
- [Register facilities and professionals (M4)](https://nha-in.github.io/docs/main/skills/abdm-m4/SKILL.md)
- [PHR registration and login (P1)](https://nha-in.github.io/docs/main/skills/abdm-p1/SKILL.md)
- [Consents Management (P2)](https://nha-in.github.io/docs/main/skills/abdm-p2/SKILL.md)
- [PHR subscriptions (P3)](https://nha-in.github.io/docs/main/skills/abdm-p3/SKILL.md)
- [Health lockers (P4)](https://nha-in.github.io/docs/main/skills/abdm-p4/SKILL.md)
- [FHIR bundles](https://nha-in.github.io/docs/main/skills/abdm-fhir/SKILL.md)

## Prompting an agent to build against ABDM

An agent with this site loaded still writes a plausible integration rather than a correct one, because the parts of ABDM that catch people are the parts a model cannot infer. Tell it these, and check its output against them.

| Tell it                                                                                             | Because                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Look the operation up here before writing the call                                                  | The ABDM v3 APIs differ from the v1 and v2 an agent was trained on. The MCP server above is this site answering live, so it cannot be recalling an older shape                                                                 |
| Identifiers are encrypted, and the plaintext has a shape                                            | An agent encrypts what looks like the value. An ABHA number keeps its dashes, and the bare digits are refused. See [encryption](/docs/main/docs/hiecm/v3/concepts/encryption)                                                  |
| Callbacks are how the answer arrives in M2 and M3                                                   | Left alone, an agent writes a synchronous call and a response handler for a flow where the 202 means accepted and nothing else. See [the gateway](/docs/main/docs/hiecm/v3/concepts/gateway)                                   |
| Do not invent an error code or an endpoint                                                          | Both exist here in full. An invented `ABDM-` code is indistinguishable from a real one until somebody hits it                                                                                                                  |
| One bridge serves every facility, so the callback URL and the credentials are not facility settings | Left alone, an agent builds a settings screen per facility and puts them on it. That works for the first facility. See [one bridge, many facilities](/docs/main/docs/hiecm/v3/concepts/how-it-fits#one-bridge-many-facilities) |
| Aadhaar numbers, one time passwords and passwords never reach a log, a fixture or a test            | An agent writing test data will otherwise put a real looking Aadhaar number in your repository                                                                                                                                 |

Point it at [Build it well](/docs/main/docs/hiecm/v3/getting-started/build-it-well) for the handling rules themselves: what to validate, what each error means, what is safe to retry, and what the screen should say.

## Read this site as an agent

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

[View llms.txt](/docs/main/llms.txt)[View llms-full.txt](/docs/main/llms-full.txt)[This page as Markdown](/docs/main/docs/hiecm/v3/getting-started/build-with-ai/index.md)

## Ask AI

Ask this catalogue a question directly, without setting anything up.

The same assistant sits in the search box at the top of every page, labelled "Search or ask AI".

### Attaching a file

Ask AI takes a file with your question: a failing request body, a FHIR bundle, a log, a CSV, a PDF, or a screenshot. The paperclip is on the left of the box. At most 20,000 characters of text, 256KB for a text file and 8MB for a PDF or an image.

What happens to it is worth knowing before you attach one.

- The file is read in your own browser and only the text it gives up travels with your question. A PDF gives up the text it already carries. A screenshot is read by a text recognition engine your browser downloads once, from this site, and runs on your own machine. The picture itself is never sent, so nothing is uploaded and nothing is stored: the conversation lives in the panel and is gone when you close it.
- A PDF that is only pictures of text, a scan, gives up nothing. Screenshot the part you mean instead and that will be read.
- Text read from a picture carries reading mistakes. The assistant is told where the text came from, so it can say when an answer turns on a character it cannot trust.
- Personal data is removed before the file reaches the model. A file that parses as JSON is masked by its field names, so `name`, `telecom`, `address`, `birthDate` and identifier values in a FHIR bundle are replaced with placeholders such as `<MASKED_NAME>`. Aadhaar, ABHA, PAN, passport, voter, mobile, email and bearer tokens are matched by pattern anywhere in the file, JSON or not.
- A file with no field names, a log or the text read from a screenshot, gets the same pattern masking, and a name on a labelled line goes too: `patient: Rakesh Sharma` leaves as `patient: <MASKED_NAME>`.
- What none of that catches is a name written in running prose, with nothing marking it as a name. Redact those yourself, the same way you would in a support request. The panel says so next to any file it read for you.
- Your question is logged, masked, to improve the answers. The file is not logged.
