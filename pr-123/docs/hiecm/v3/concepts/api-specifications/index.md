# The API specifications

Every HIE-CM call is published as an OpenAPI 3.1 specification. The [API reference](/docs/pr-123/docs/hiecm/v3/api) renders them, and the files are yours to download, generate a client from, or hand to a coding agent.

## One file per module

Each module has a specification of its own: the gateway, M1 to M4, P1 to P4, and the three use cases. A module's file is complete on its own, so an integration that builds one milestone reads one file. Each is published in YAML and JSON, for example `/specs/hiecm-m2.yaml` and `/specs/hiecm-m2.json`.

The headers every call carries, such as `REQUEST-ID` and `TIMESTAMP`, are declared again in each file, so no file depends on another.

Notes for AI agents

**Before you start.** Know which milestones your role builds. See [milestones](/docs/pr-123/docs/hiecm/v3/milestones).

**What happens.** Load only the files for the modules you build, and treat each as independent. A header declared in one file is declared again in every other, so do not merge the files into one document.

**How you know it worked.** Every call your integration makes is found in the file of the module it belongs to, with no reference into another file.

## Callbacks are webhooks in the same file

Many HIE-CM calls answer later, as a POST from the gateway to your registered URL. Each module's specification describes those callbacks under `webhooks`, the OpenAPI 3.1 section for requests your system receives, beside the calls that cause them. One file tells you what you call, what comes back at once, and what arrives later.

Your system serves each webhook at its path on your bridge URL. For example, the outcome of linking a care context arrives at `/api/v3/link/on_carecontext`. Why the answer arrives this way is on [a 200 means accepted, not done](/docs/pr-123/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks).

Notes for AI agents

**What happens.** Read `webhooks` alongside `paths` for every module you build. An entry under `paths` is a call your system makes. An entry under `webhooks` is an endpoint your system serves, and its request body is what the gateway posts to you.

**How you know it worked.** For every call your system makes that answers 202, you can name the webhook that carries its result and the handler that serves it.

**When it goes wrong.** A client generated from `paths` alone has no callback handlers, and the integration waits on answers it has no endpoint for. Read `webhooks` as well.

## Next

- [The API reference](/docs/pr-123/docs/hiecm/v3/api), every call and callback rendered.
- [Proving a callback came from ABDM](/docs/pr-123/docs/hiecm/v3/concepts/callback-authenticity), before your handler acts.
- [Build with AI](/docs/pr-123/docs/hiecm/v3/getting-started/build-with-ai), to give the files to a coding agent.
