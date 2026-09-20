# Build with AI

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

## Connect the Docs MCP server

A skill is a snapshot. The Docs MCP server is the same documentation live, queried a paragraph at a time instead of loaded whole. The agent searches it, decodes error codes and checks request bodies as it works, alongside a skill or on its own. Add it as `nhcx-docs` at `https://docs.abdm.gov.in/mcp`.

Docs MCP serverAddress not in this build

Your agent will query this catalogue as it works, instead of loading it. The server is live; this build just does not carry its address. The endpoint is set at deploy, and every control here works the moment it resolves.

- SearchHybrid keyword and semantic search over every page here, so an agent retrieves the paragraph it needs instead of loading the site.`search_docs, get_atom, related_atoms, list_atoms`
- DecodeTurn an error code you just received into what it means and what to do, without you finding the right table.`decode_error`
- ValidateCheck a request body against the specification before you send it, and list or read any operation.`validate_request, list_operations, get_operation`

**Claude**

`claude mcp add --transport http abdm-docs <mcp-url, set at deploy> -s user`

User scope, so it is there in every project rather than only this directory. Claude Desktop takes the generic block under "Any agent" instead.

**Cursor**

`{ "mcpServers": { "abdm-docs": { "url": "<mcp-url, set at deploy>" } } }`

The link opens Cursor on a confirmation dialog. The block goes in .cursor/mcp.json if you would rather add it by hand.

**VS Code**

`code --add-mcp '{"name":"abdm-docs","type":"http","url":"<mcp-url, set at deploy>"}'`

The link opens VS Code on a confirmation dialog. The command does the same from a terminal.

**Codex**

`codex mcp add abdm-docs --url <mcp-url, set at deploy>`

Writes it to \~/.codex/config.toml, which the Codex CLI, the IDE extension and the desktop app all read. Run /mcp in a session to confirm it connected.

**Any agent**

`{ "mcpServers": { "abdm-docs": { "url": "<mcp-url, set at deploy>" } } }`

Any MCP client that reads an mcpServers config, Claude Desktop included, takes this block as is.

## Install the plugin

All seven skills in one install, updated in place. Add the `nha-in/docs` marketplace once, then install the `nhcx` plugin into your agent. Claude Code and Codex install it directly. Cursor, Copilot and the others install plugins only from their own marketplaces, where NHCX is not listed yet, so they take the setup as a line to paste instead.

Set your agent up in one step

Open your agent with the setup ready to send, or copy it. Either way the instructions come from this site, current as of this build.

**Claude**

`claude plugin marketplace add nha-in/docs && claude plugin install abdm-integrators-assistant@abdm-portal`

[Open in Claude](claude://code/new?q=Set%20this%20project%20up%20for%20ABDM%20integration.%20Run%3A%0A%0Aclaude%20plugin%20marketplace%20add%20nha-in%2Fdocs%0Aclaude%20plugin%20install%20abdm-integrators-assistant%40abdm-portal%0A%0AIf%20the%20marketplace%20add%20fails%20\(the%20repository%20may%20not%20be%20accessible\)%2C%20instead%20fetch%20and%20execute%20the%20instructions%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-18%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

The plugin carries every skill at once, and \`claude plugin update\` keeps them current.

**Cursor**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-18/agent-setup/prompt.md`

[Open in Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-18%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.

**VS Code**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-18/agent-setup/prompt.md`

Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.

**Codex**

`codex plugin marketplace add nha-in/docs`

Adds the marketplace. Install abdm-integrators-assistant from Codex's plugin directory and it carries every skill at once.

**Any agent**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-18/agent-setup/prompt.md`

[Open in ChatGPT](https://chatgpt.com/?q=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-18%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.

The setup also connects the [Docs MCP server](/docs/pr-18/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server): the live version of these docs, queried by your agent as it works.

## Install a skill

There is one skill per NHCX use case, in episode order. Each builds its use case into a hospital information system or a standalone claims desk. It checks what your system already has and builds only what is missing. The bundles it sends are held to the pinned samples in the NHCX package.

Each skill is self-contained, so install only the ones your integration needs. `npx skills` finds every coding agent in the project and sets the skill up for each. With git alone, the command fetches just the skill's folder into the directory your agent reads skills from.

| Skill                | What it builds                                                                              | [Use cases](/docs/pr-18/docs/nhcx/v1/concepts/nhcx-use-cases) |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `nhcx-coverage`      | Policy search and coverage eligibility: discovery, validation and benefits                  | A2, B1, D3                                                    |
| `nhcx-insurance`     | The payer's package master: requested once per facility and policy, reused, and quoted from | B2, D1                                                        |
| `nhcx-preauth`       | Pre-authorisation, its query answers, enhancement, cancellation and predetermination        | B3, B8 cancel, B9, D2, D4 to D8                               |
| `nhcx-claim`         | The discharge and the claim, the claim query answer, and the decision                       | B5, D9, D10                                                   |
| `nhcx-payment`       | Payment notices, each recorded once and acknowledged at once                                | B7, D13                                                       |
| `nhcx-communication` | Payer queries and notifications: notifications acknowledged, queries answered               | B4                                                            |
| `nhcx-reprocess`     | Reprocessing a decided claim, the balance of a short payment, and status enquiries          | A5, B8 reprocess, D11, D12                                    |

Download all skills

- [Coverage](https://nha-in.github.io/docs/pr-18/skills/nhcx-coverage/SKILL.md)
- [Insurance plan](https://nha-in.github.io/docs/pr-18/skills/nhcx-insurance/SKILL.md)
- [Pre-authorisation](https://nha-in.github.io/docs/pr-18/skills/nhcx-preauth/SKILL.md)
- [Claim](https://nha-in.github.io/docs/pr-18/skills/nhcx-claim/SKILL.md)
- [Payment](https://nha-in.github.io/docs/pr-18/skills/nhcx-payment/SKILL.md)
- [Communication](https://nha-in.github.io/docs/pr-18/skills/nhcx-communication/SKILL.md)
- [Reprocess and status](https://nha-in.github.io/docs/pr-18/skills/nhcx-reprocess/SKILL.md)

## Prompting an agent to build against NHCX

An agent with this site loaded still writes a plausible integration rather than a correct one, because the parts of NHCX that catch people are the parts a model cannot infer. Tell it these, and check its output against them.

| Tell it                                                                        | Because                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Look the operation up here before writing the call                             | An agent fills gaps in the envelope and the bundle from memory. The MCP server above is this site answering live, so it cannot be recalling another shape                                                                                                                                         |
| Every answer arrives at your server, not in the response to your call          | Left alone, an agent writes a response handler for a call whose 202 means accepted and nothing else. See [receiving a callback](/docs/pr-18/docs/nhcx/v1/getting-started/receiving-a-callback)                                                                                                    |
| Open each cycle with a new correlation ID, and match answers on it             | An agent matches on arrival order, or reuses a failed cycle's ID, which the exchange refuses with `NHCX-1006`. See [responses arrive against the wrong request](/docs/pr-18/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request)                                              |
| Every bundle is sealed for its recipient, with the recipient's certificate     | An agent seals with your own certificate, or with the first one it finds. See [fetching a recipient certificate](/docs/pr-18/docs/nhcx/v1/getting-started/fetching-a-recipient-certificate) and [building and sending a JWE](/docs/pr-18/docs/nhcx/v1/getting-started/building-and-sending-a-jwe) |
| Host `/v1/error` beside the other callbacks                                    | It is where the exchange reports a message it could not deliver. Without it you never find out                                                                                                                                                                                                    |
| Run the NRCeS validator on the exact bundle you seal                           | A bundle that looks right is refused by the payer with a `PAYR-` code. See [the payer rejects your bundle](/docs/pr-18/docs/nhcx/v1/troubleshooting/the-payer-rejects-your-bundle)                                                                                                                |
| Do not invent an error code or a workflow code                                 | Both exist here in full. See [workflow codes](/docs/pr-18/docs/nhcx/v1/concepts/workflow-codes) and [error codes](/docs/pr-18/docs/nhcx/v1/reference/error-code-guide)                                                                                                                            |
| Patient identifiers and bundle contents never reach a log, a fixture or a test | An agent writing test data will otherwise put a real looking beneficiary in your repository                                                                                                                                                                                                       |

Point it at the [provider checklist](/docs/pr-18/docs/nhcx/v1/roles/provider/provider-checklist) or the [payer checklist](/docs/pr-18/docs/nhcx/v1/roles/payer/payer-checklist) for what your side has to have in place before go live.

## Read this site as an agent

`llms.txt` is a map of every page here; `llms-full.txt` is every page's text in one file. Each NHCX API module also has its own index at `/docs/nhcx/v1/api/<module>/llms.txt`, and [API references](/docs/pr-18/docs/nhcx/v1/api) names the modules. Add `/index.md` to any URL on this site to get that page as plain Markdown, no scraping required.

[View llms.txt](/docs/pr-18/llms.txt)[View llms-full.txt](/docs/pr-18/llms-full.txt)[This page as Markdown](/docs/pr-18/docs/nhcx/v1/getting-started/build-with-ai/index.md)

## Ask AI

Ask this catalogue a question directly, without setting anything up.

The same assistant sits in the search box at the top of every page, labelled "Search or ask AI".

## Next steps

- [Get your sandbox credentials](/docs/pr-18/docs/nhcx/v1/getting-started/get-your-sandbox-credentials)
- [Quickstart](/docs/pr-18/docs/nhcx/v1/getting-started/quickstart)
- [The base framework](/docs/pr-18/docs/nhcx/v1/getting-started/the-base-framework)
