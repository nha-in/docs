# Build with AI

Use NHCX documentation with AI-assisted development tools. Developers may use supported AI-assisted tools to search NHCX integration guides, API references and use case documentation while building their solution.

note

Review all AI-generated code against the official NHCX documentation and test it in the Sandbox.

Every fact on this site is a public URL. There are three ways to put it in front of your agent, and they combine. From lightest to fullest:

- Copy one skill into your project.
- Install all seven skills as a plugin.
- Connect the docs server, so the agent can look things up as it works.

[Recommended](#connect-the-docs-mcp-server)

[Docs MCP server](#connect-the-docs-mcp-server)

[This documentation live, queried a paragraph at a time as your agent works. It cannot go stale, because it is this site answering.](#connect-the-docs-mcp-server)

[AI plugin](#install-the-plugin)

[All seven NHCX skills in one install, updated in place. Add the marketplace once, then install the plugin.](#install-the-plugin)

[Agent skills](#install-a-skill)

[One folder per NHCX use case, in episode order. Works offline, and ages until you update it.](#install-a-skill)

## Learn how to use AI

Never built with a coding assistant before? Start here. Three things have to be in place before anything else on this page works.

| What you need               | Why                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| A coding assistant          | Claude, Cursor, VS Code with GitHub Copilot, Codex and ChatGPT are the ones set up below. Any of them is enough. Pick one and stay on it. |
| A paid plan on it           | Free tiers stop partway through a long task. The cheapest paid plan on any of these carries a use case.                                   |
| Your own project open in it | The assistant reads and writes the folder it is opened in. Open the repository you are integrating NHCX into first.                       |

Then work down the page in order.

1. Connect the Docs MCP server, so the assistant looks NHCX up here instead of recalling an older version of it.
2. Install the plugin, which is one command or one pasted line.
3. Install the skill for the use case you are on, `nhcx-coverage` first if you are starting.
4. Ask for what you want in plain language, one use case at a time. "Add coverage eligibility to this project, using the nhcx-coverage skill" is a good first prompt.

You do not need to know what MCP, a plugin or a skill is to use them. They are three ways of handing the same documentation to the assistant: live lookup, one install for everything, and one folder for one use case.

Read what it writes before you run it. An assistant is fast and confident, and it is wrong in ways only the Sandbox will show you.

## Connect the Docs MCP server

A skill is a snapshot. The Docs MCP server is the same documentation live, queried a paragraph at a time instead of loaded whole. The agent searches it, decodes error codes and checks request bodies as it works, alongside a skill or on its own. Add it as `nhcx-docs` at `https://docs.abdm.gov.in/mcp`.

Docs MCP server

Your agent queries this catalogue as it works, instead of loading it.

- SearchHybrid keyword and semantic search over every page here, so an agent retrieves the paragraph it needs instead of loading the site.`search_docs, get_atom, related_atoms, list_atoms`
- DecodeTurn an error code you just received into what it means and what to do, without you finding the right table.`decode_error`
- ValidateCheck a request body against the specification before you send it, and list or read any operation.`validate_request, list_operations, get_operation`

**Claude**

[Add to Claude](claude://code/new?q=Add%20the%20NHCX%20documentation%20MCP%20server%2C%20then%20use%20it%20to%20answer%20my%20NHCX%20questions.%0A%0ARun%20this%3A%0Aclaude%20mcp%20add%20--transport%20http%20nhcx-docs%20https%3A%2F%2Fdocs.abdm.gov.in%2Fmcp%20-s%20user%0A%0AUser%20scope%2C%20so%20it%20is%20available%20in%20every%20project%20rather%20than%20only%20this%20directory.%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

`claude mcp add --transport http nhcx-docs https://docs.abdm.gov.in/mcp -s user`

User scope, so it is there in every project rather than only this directory. Claude Desktop takes the generic block under "Any agent" instead.

**Cursor**

[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=nhcx-docs\&config=eyJ1cmwiOiJodHRwczovL2RvY3MuYWJkbS5nb3YuaW4vbWNwIn0%3D)

`{ "mcpServers": { "nhcx-docs": { "url": "https://docs.abdm.gov.in/mcp" } } }`

The link opens Cursor on a confirmation dialog. The block goes in .cursor/mcp.json if you would rather add it by hand.

**VS Code**

[Add to VS Code](vscode:mcp/install?%7B%22name%22%3A%22nhcx-docs%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs.abdm.gov.in%2Fmcp%22%7D)

`code --add-mcp '{"name":"nhcx-docs","type":"http","url":"https://docs.abdm.gov.in/mcp"}'`

The link opens VS Code on a confirmation dialog. The command does the same from a terminal.

**Codex**

`codex mcp add nhcx-docs --url https://docs.abdm.gov.in/mcp`

Writes it to \~/.codex/config.toml, which the Codex CLI, the IDE extension and the desktop app all read. Run /mcp in a session to confirm it connected.

**Any agent**

`{ "mcpServers": { "nhcx-docs": { "url": "https://docs.abdm.gov.in/mcp" } } }`

Any MCP client that reads an mcpServers config, Claude Desktop included, takes this block as is.

## Install the plugin

All seven skills in one install, updated in place, and the nhcx-docs MCP server connected with them. Add the `nha-in/docs` marketplace once, then install the `nhcx` plugin into your agent. Claude Code and Codex install it directly. Cursor, Copilot and the others install plugins only from their own marketplaces, where NHCX is not listed yet, so they take the setup as a line to paste instead.

Set your agent up in one step

Open your agent with the setup ready to send, or copy it. Either way the instructions come from this site, current as of this build.

**Claude**

`claude plugin marketplace add nha-in/docs && claude plugin install nhcx@abdm-portal`

[Open in Claude](claude://code/new?q=Set%20this%20project%20up%20for%20NHCX%20integration.%20Run%3A%0A%0Aclaude%20plugin%20marketplace%20add%20nha-in%2Fdocs%0Aclaude%20plugin%20install%20nhcx%40abdm-portal%0A%0AIf%20the%20marketplace%20add%20fails%20\(the%20repository%20may%20not%20be%20accessible\)%2C%20instead%20fetch%20and%20execute%20the%20instructions%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-41%2Fagent-setup%2Fnhcx.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

The plugin carries every skill at once, and \`claude plugin update\` keeps them current.

**Cursor**

`Fetch and execute the instructions to set me up for NHCX integration from https://nha-in.github.io/docs/pr-41/agent-setup/nhcx.md`

[Open in Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20NHCX%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-41%2Fagent-setup%2Fnhcx.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.

**VS Code**

`Fetch and execute the instructions to set me up for NHCX integration from https://nha-in.github.io/docs/pr-41/agent-setup/nhcx.md`

Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.

**Codex**

`codex plugin marketplace add nha-in/docs`

Adds the marketplace. Install nhcx from Codex's plugin directory and it carries every skill at once.

**Any agent**

`Fetch and execute the instructions to set me up for NHCX integration from https://nha-in.github.io/docs/pr-41/agent-setup/nhcx.md`

[Open in ChatGPT](https://chatgpt.com/?q=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20NHCX%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-41%2Fagent-setup%2Fnhcx.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.

The setup also connects the [Docs MCP server](/docs/pr-41/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server): the live version of these docs, queried by your agent as it works.

## Install a skill

There is one skill for the whole provider-side integration, `nhcx-full`, and one per NHCX use case. Each builds into an existing hospital information system through eight logged steps, from discovery and mapping to tests on the sandbox. It finds what your system already has and builds only what is missing. It takes its NHCX facts from the nhcx-docs MCP server when it is connected, and from a release of the NHCX package otherwise.

Each skill is self-contained, so install only the ones your integration needs. `npx skills` finds every coding agent in the project and sets the skill up for each. With git alone, the command fetches just the skill's folder into the directory your agent reads skills from.

| Skill                | What it builds                                                                                                                                 | [Use cases](/docs/pr-41/docs/nhcx/v1/concepts/nhcx-use-cases) |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `nhcx-full`          | The whole provider-side integration, every exchange end to end, with the NHCX gateway embedded in the application                              | All provider use cases                                        |
| `nhcx-coverage`      | Beneficiary policy search and coverage eligibility: validation, benefits and discovery                                                         | A2, B1, D3                                                    |
| `nhcx-preauth`       | The payer's insurance plan, line items, authorisation requirements, the pre-authorisation, enhancement, query answers, cancellation and status | B2, B3, B8 cancel, D1, D2, D4 to D8                           |
| `nhcx-claim`         | Discharge details, claim documents and forms, the claim and its query answers, the payer's verdict and status enquiries                        | A5, B5, D9, D10                                               |
| `nhcx-communication` | Payer queries, notifications and notes on a case, replies with text and documents, and acknowledgements                                        | B4                                                            |
| `nhcx-payment`       | The payer's payment notice and its breakdown, matched to the claim and acknowledged                                                            | B7, D13                                                       |
| `nhcx-reprocess`     | Asking the payer to look again at a decided claim, and asking for the unpaid balance of a partly paid claim                                    | B8 reprocess, D11, D12                                        |

NHCX agent skill

The whole provider-side integration, every exchange end to end, with the NHCX gateway embedded in the application.

[SKILL.md](/docs/pr-41/skills/nhcx-full/SKILL.md "The router. Use the command below to take the references with it.")

- ScaffoldThe eight steps that build the use case into your system, from discovery and mapping through code to tests on the sandbox, each logged as it goes.
- Integrate26 operations, with their hosts and headers.
- Test10 test matrix rows, from offline pins up to a live payer on the sandbox.

`mkdir -p .claude/skills && curl -fsSL https://nha-in.github.io/docs/pr-41/skills/nhcx-full.tar.gz | tar -xzf - -C .claude/skills`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20NHCX%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-41%2Fskills%2Fnhcx-full.tar.gz%20%7C%20tar%20-xzf%20-%20-C%20.claude%2Fskills%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "Build the whole provider-side NHCX integration into this hospital system". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill names the cases it could not reach on the NHCX sandbox, and nothing in it is re-verified here.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

Download all skills

- [Everything](https://nha-in.github.io/docs/pr-41/skills/nhcx-full.tar.gz)
- [Coverage](https://nha-in.github.io/docs/pr-41/skills/nhcx-coverage.tar.gz)
- [Preauth](https://nha-in.github.io/docs/pr-41/skills/nhcx-preauth.tar.gz)
- [Claim](https://nha-in.github.io/docs/pr-41/skills/nhcx-claim.tar.gz)
- [Communication](https://nha-in.github.io/docs/pr-41/skills/nhcx-communication.tar.gz)
- [Payment](https://nha-in.github.io/docs/pr-41/skills/nhcx-payment.tar.gz)
- [Reprocess](https://nha-in.github.io/docs/pr-41/skills/nhcx-reprocess.tar.gz)

## Prompting an agent to build against NHCX

An agent with this site loaded still writes a plausible integration rather than a correct one, because the parts of NHCX that catch people are the parts a model cannot infer. Tell it these, and check its output against them.

| Tell it                                                                        | Because                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Look the operation up here before writing the call                             | An agent fills gaps in the envelope and the bundle from memory. The MCP server above is this site answering live, so it cannot be recalling another shape                                                                                                                                         |
| Every answer arrives at your server, not in the response to your call          | Left alone, an agent writes a response handler for a call whose 202 means accepted and nothing else. See [receiving a callback](/docs/pr-41/docs/nhcx/v1/getting-started/receiving-a-callback)                                                                                                    |
| Open each cycle with a new correlation ID, and match answers on it             | An agent matches on arrival order, or reuses a failed cycle's ID, which the exchange refuses with `NHCX-1006`. See [responses arrive against the wrong request](/docs/pr-41/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request)                                              |
| Every bundle is sealed for its recipient, with the recipient's certificate     | An agent seals with your own certificate, or with the first one it finds. See [fetching a recipient certificate](/docs/pr-41/docs/nhcx/v1/getting-started/fetching-a-recipient-certificate) and [building and sending a JWE](/docs/pr-41/docs/nhcx/v1/getting-started/building-and-sending-a-jwe) |
| Host `/v1/error` beside the other callbacks                                    | It is where the exchange reports a message it could not deliver. Without it you never find out                                                                                                                                                                                                    |
| Run the NRCeS validator on the exact bundle you seal                           | A bundle that looks right is refused by the payer with a `PAYR-` code. See [the payer rejects your bundle](/docs/pr-41/docs/nhcx/v1/troubleshooting/the-payer-rejects-your-bundle)                                                                                                                |
| Do not invent an error code or a workflow code                                 | Both exist here in full. See [workflow codes](/docs/pr-41/docs/nhcx/v1/concepts/workflow-codes) and [error codes](/docs/pr-41/docs/nhcx/v1/reference/error-code-guide)                                                                                                                            |
| Patient identifiers and bundle contents never reach a log, a fixture or a test | An agent writing test data will otherwise put a real looking beneficiary in your repository                                                                                                                                                                                                       |

Point it at [Build it well](/docs/pr-41/docs/nhcx/v1/getting-started/build-it-well) for the handling rules themselves: who refused a message, what is safe to send again, and what to do when no answer comes. Then point it at the [provider checklist](/docs/pr-41/docs/nhcx/v1/roles/provider/provider-checklist) or the [payer checklist](/docs/pr-41/docs/nhcx/v1/roles/payer/payer-checklist) for what your side has to have in place before go live.

## Read this site as an agent

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Each NHCX API module also has its own index at `/docs/nhcx/v1/api/<module>/llms.txt`, and [API references](/docs/pr-41/docs/nhcx/v1/api) names the modules. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

[View llms.txt](/docs/pr-41/llms.txt)[View llms-full.txt](/docs/pr-41/llms-full.txt)[This page as Markdown](/docs/pr-41/docs/nhcx/v1/getting-started/build-with-ai/index.md)

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

## Next steps

- [Get your sandbox credentials](/docs/pr-41/docs/nhcx/v1/getting-started/get-your-sandbox-credentials)
- [Quickstart](/docs/pr-41/docs/nhcx/v1/getting-started/quickstart)
- [The base framework](/docs/pr-41/docs/nhcx/v1/getting-started/the-base-framework)
