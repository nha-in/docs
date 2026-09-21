# Get started

Connect your application to India's Interoperable Digital Health Infrastructure.

## What ABDM is

Ayushman Bharat Digital Mission (ABDM) is India's national digital health ecosystem, designed to enable secure, interoperable, and consent-based exchange of health information across healthcare stakeholders. ABDM enables identification of healthcare beneficiaries, healthcare professionals, and healthcare facilities through nationally recognized digital registries. It also facilitates secure and consent-driven exchange of health information among authorized participants.

ABDM does not maintain a centralized repository of health records. Health records continue to reside with the respective healthcare providers or repositories responsible for creating and maintaining them. Health information remains with the originating healthcare information provider and is shared only upon receipt of valid consent from the individual. The ABDM framework facilitates the secure exchange of consent requests, consent artefacts, and health information between participating systems in accordance with established security and privacy standards. The ABDM gateway infrastructure facilitates routing and exchange of consented health information without accessing, storing, or interpreting the clinical content being exchanged.

Three gateways carry different work, and this section documents the first.

| Gateway                                                             | What it carries                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [HIE-CM](/docs/pr-20/docs/hiecm/v3/getting-started/glossary#hie-cm) | Care seeker ([ABHA](/docs/pr-20/docs/hiecm/v3/getting-started/glossary#abha)) and care provider ([HPR](/docs/pr-20/docs/hiecm/v3/getting-started/glossary#hpr), [HFR](/docs/pr-20/docs/hiecm/v3/getting-started/glossary#hfr)) identities, care contexts, consent and health records |
| [UHI](/docs/pr-20/docs/uhi/v1)                                      | Unified Health Interface: discovery and delivery of digital health services through an open and interoperable network                                                                                                                                                                |
| [NHCX](/docs/pr-20/docs/nhcx/v1)                                    | National Health Claims Exchange: standardised exchange of health insurance claim information among payers, healthcare providers, beneficiaries, third-party administrators and other participating entities                                                                          |

Your work on HIE-CM is [four milestones](/docs/pr-20/docs/hiecm/v3/milestones): Create the identity, Attach your records to it, Retrieve records held elsewhere, Enrol your facility and your professionals.

## Who are you?

This is where you choose your path. Pick the one that fits and the rest of the documentation follows it, in the sidebar and on every page. You can change it whenever you like from the filter at the top of the sidebar.

## Start here: build with AI

Your coding agent can read every page, every endpoint and every error code on this site.

Set your agent up in one step

Open your agent with the setup ready to send, or copy it. Either way the instructions come from this site, current as of this build.

**Claude**

`claude plugin marketplace add nha-in/docs && claude plugin install abdm-integrators-assistant@abdm-portal`

[Open in Claude](claude://code/new?q=Set%20this%20project%20up%20for%20ABDM%20integration.%20Run%3A%0A%0Aclaude%20plugin%20marketplace%20add%20nha-in%2Fdocs%0Aclaude%20plugin%20install%20abdm-integrators-assistant%40abdm-portal%0A%0AIf%20the%20marketplace%20add%20fails%20\(the%20repository%20may%20not%20be%20accessible\)%2C%20instead%20fetch%20and%20execute%20the%20instructions%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-20%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

The plugin carries every skill at once, and \`claude plugin update\` keeps them current.

**Cursor**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-20/agent-setup/prompt.md`

[Open in Cursor](cursor://anysphere.cursor-deeplink/prompt?text=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-20%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Opens Cursor with the prompt in the composer. It fetches the current instructions from this site.

**VS Code**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-20/agent-setup/prompt.md`

Paste into GitHub Copilot Chat in the repository you are integrating. It fetches the current instructions from this site.

**Codex**

`codex plugin marketplace add nha-in/docs`

Adds the marketplace. Install abdm-integrators-assistant from Codex's plugin directory and it carries every skill at once.

**Any agent**

`Fetch and execute the instructions to set me up for ABDM integration from https://nha-in.github.io/docs/pr-20/agent-setup/prompt.md`

[Open in ChatGPT](https://chatgpt.com/?q=Fetch%20and%20execute%20the%20instructions%20to%20set%20me%20up%20for%20ABDM%20integration%20from%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-20%2Fagent-setup%2Fprompt.md%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

One line, any agent that can fetch a URL, ChatGPT included. The instructions live on this site and are rebuilt with it.

The setup also connects the [Docs MCP server](/docs/pr-20/docs/hiecm/v3/getting-started/build-with-ai#connect-the-docs-mcp-server): the live version of these docs, queried by your agent as it works.

More ways to set one up are on [Build with AI](/docs/pr-20/docs/hiecm/v3/getting-started/build-with-ai).

## Start building

[Get your sandbox credentials](/docs/pr-20/docs/hiecm/v3/getting-started/sandbox)

[Register and get a client id and secret.](/docs/pr-20/docs/hiecm/v3/getting-started/sandbox)

[Quickstart](/docs/pr-20/docs/hiecm/v3/getting-started/first-fifteen-minutes)

[Create your first test ABHA live, with your own credentials.](/docs/pr-20/docs/hiecm/v3/getting-started/first-fifteen-minutes)

[Milestones](/docs/pr-20/docs/hiecm/v3/milestones)

[The four milestones and what each one gets you.](/docs/pr-20/docs/hiecm/v3/milestones)

[Build with AI](/docs/pr-20/docs/hiecm/v3/getting-started/build-with-ai)

[Skills, MCP server and prompts for your coding agent.](/docs/pr-20/docs/hiecm/v3/getting-started/build-with-ai)

[Go live](/docs/pr-20/docs/hiecm/v3/getting-started/going-live)

[What certification and the exit process involve.](/docs/pr-20/docs/hiecm/v3/getting-started/going-live)

[Fix what broke](/docs/pr-20/docs/hiecm/v3/troubleshooting)

[Start from the symptom you are seeing, not the error code.](/docs/pr-20/docs/hiecm/v3/troubleshooting)

## Common use cases

[I want to create an ABHA](/docs/pr-20/docs/hiecm/v3/milestones/m1)

[Identity for every patient, created and verified.](/docs/pr-20/docs/hiecm/v3/milestones/m1)

[I want to share health records](/docs/pr-20/docs/hiecm/v3/milestones/m2)

[Link care contexts and serve them under consent.](/docs/pr-20/docs/hiecm/v3/milestones/m2)

[I want to read records held elsewhere](/docs/pr-20/docs/hiecm/v3/milestones/m3)

[Request consent, fetch and decrypt.](/docs/pr-20/docs/hiecm/v3/milestones/m3)

[I want to build a patient's health app](/docs/pr-20/docs/hiecm/v3/milestones/p1)

[ABHA login, record discovery, consent control.](/docs/pr-20/docs/hiecm/v3/milestones/p1)

[I want to register a facility or professional](/docs/pr-20/docs/hiecm/v3/milestones/m4)

[Get the ids every call needs.](/docs/pr-20/docs/hiecm/v3/milestones/m4)

## More resources

[Explore every API](/docs/pr-20/docs/hiecm/v3/api)

[The full reference, with try-it.](/docs/pr-20/docs/hiecm/v3/api)

[How consent works](/docs/pr-20/docs/hiecm/v3/concepts/consent)

[The one concept you must understand.](/docs/pr-20/docs/hiecm/v3/concepts/consent)
