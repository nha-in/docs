# Build with AI

Give your coding agent the NHCX documentation while it builds. Connect it to the Docs MCP server, install the NHCX agent skills, or have it fetch these pages as Markdown.

## Connect the Docs MCP server

The Docs MCP server searches the portal's catalogue. For NHCX it holds an entry for each concept, call, callback, error, flow and test case. It also holds the operations in the NHCX specifications. HIE-CM uses the same server, so one connection covers both.

Docs MCP serverAddress not in this build

Your agent will query this catalogue as it works, instead of loading it. The server is live; this build just does not carry its address. The endpoint is set at deploy, and every control here works the moment it resolves.

- SearchHybrid keyword and semantic search over every page here, so an agent retrieves the paragraph it needs instead of loading the site.`search_docs, get_atom, related_atoms, list_atoms`
- DecodeTurn an error code you just received into what it means and what to do, without you finding the right table.`decode_error`
- ValidateCheck a request body against the specification before you send it, and list or read any operation.`validate_request, list_operations, get_operation`

**Claude Code (CLI)**

`claude mcp add --transport http abdm-docs <mcp-url, set at deploy> -s user`

Run this in the repository you are integrating.

**Claude Desktop / generic**

`{ "mcpServers": { "abdm-docs": { "url": "<mcp-url, set at deploy>" } } }`

Any MCP client that reads an `mcpServers` config, Claude Desktop included, takes this block as is.

## Read these pages as Markdown

- `/llms.txt` lists every page on this site. `/llms-full.txt` carries the text of every page in one file.
- Each NHCX API module has its own index at `/docs/nhcx/v1/api/<module>/llms.txt`. [API references](/docs/pr-10/docs/nhcx/v1/api) names the modules.
- Add `/index.md` to the address of any page to get that page as Markdown.

## Agent skills

There is one skill per NHCX use case, in episode order. Each builds its use case into a hospital information system or a standalone claims desk. It checks what your system already has and builds only what is missing. The bundles it sends are held to the pinned samples in the NHCX package. Each skill installs and runs alone.

| Skill                | What it builds                                                                              | [Use cases](/docs/pr-10/docs/nhcx/v1/concepts/nhcx-use-cases) |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `nhcx-coverage`      | Policy search and coverage eligibility: discovery, validation and benefits                  | A2, B1, D3                                                    |
| `nhcx-insurance`     | The payer's package master: requested once per facility and policy, reused, and quoted from | B2, D1                                                        |
| `nhcx-preauth`       | Pre-authorisation, its query answers, enhancement, cancellation and predetermination        | B3, B8 cancel, B9, D2, D4 to D8                               |
| `nhcx-claim`         | The discharge and the claim, the claim query answer, and the decision                       | B5, D9, D10                                                   |
| `nhcx-payment`       | Payment notices, each recorded once and acknowledged at once                                | B7, D13                                                       |
| `nhcx-communication` | Payer queries and notifications: notifications acknowledged, queries answered               | B4                                                            |
| `nhcx-reprocess`     | Reprocessing a decided claim, the balance of a short payment, and status enquiries          | A5, B8 reprocess, D11, D12                                    |

Download all skills

- [Coverage](https://nha-in.github.io/docs/pr-10/skills/nhcx-coverage/SKILL.md)
- [Insurance plan](https://nha-in.github.io/docs/pr-10/skills/nhcx-insurance/SKILL.md)
- [Pre-authorisation](https://nha-in.github.io/docs/pr-10/skills/nhcx-preauth/SKILL.md)
- [Claim](https://nha-in.github.io/docs/pr-10/skills/nhcx-claim/SKILL.md)
- [Payment](https://nha-in.github.io/docs/pr-10/skills/nhcx-payment/SKILL.md)
- [Communication](https://nha-in.github.io/docs/pr-10/skills/nhcx-communication/SKILL.md)
- [Reprocess and status](https://nha-in.github.io/docs/pr-10/skills/nhcx-reprocess/SKILL.md)

In Claude Code the portal's `nhcx` plugin carries all seven. Add the portal's marketplace as [Install the plugin](/docs/pr-10/docs/hiecm/v3/getting-started/build-with-ai#install-the-plugin) shows, then run `claude plugin install nhcx@abdm-portal`.

## Next steps

- [Get your sandbox credentials](/docs/pr-10/docs/nhcx/v1/getting-started/get-your-sandbox-credentials)
- [Quickstart](/docs/pr-10/docs/nhcx/v1/getting-started/quickstart)
- [The base framework](/docs/pr-10/docs/nhcx/v1/getting-started/the-base-framework)
