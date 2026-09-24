# 21 September 2026

4 changes

### NHCX error pages list their codes

This is a correction. [Error codes](/docs/pr-48/docs/nhcx/v1/reference/error-codes) said no code was recorded, and so did the errors page of every NHCX module. 310 codes were recorded all along, and the pages now list them: by who sent them on the reference page, and by the paths they arrive on under each module. An NHCX code reaches you sealed inside a callback rather than in the response to your call, which is why a page built from response examples found none.

### The NHCX plugin installs

This is a correction. The command on [Build with AI](/docs/pr-48/docs/nhcx/v1/getting-started/build-with-ai#install-the-plugin) failed, because the marketplace did not list the plugin it named. It does now. The plugin also carries three commands and an agent for Claude Code: `/nhcx-decode-error`, `/nhcx-preflight`, `/nhcx-prove-seal` and `nhcx-call-debugger`.

### NHCX skills install as a folder

This is a correction. The install box for an NHCX skill was empty, and the command behind it fetched three files that an NHCX skill does not have. Each skill is 59 files across eight directories, so the command now takes the archive. Each also gains a scaffold, and its router says where the folder came from, that it is a snapshot, and what its claims rest on.

### Build it well, for NHCX

[Build it well](/docs/pr-48/docs/nhcx/v1/getting-started/build-it-well) is new. It covers who refused a message, which sends are safe to repeat, how to match an answer to its request, and what to do when no answer comes.
