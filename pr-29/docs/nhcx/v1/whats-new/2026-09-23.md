# 23 September 2026

5 changes

### The JWE message format has its own page

[The JWE message format](/docs/pr-29/docs/nhcx/v1/getting-started/jwe-message-format) is new. It lists the five parts of a message, the algorithms, every protected header field with its obligation, the status values, the receipt, protocol errors and the correlation rule in one place. [JWE Secure Messaging](/docs/pr-29/docs/nhcx/v1/concepts/jwe-status-and-errors) now explains how a message is sealed and opened in plain terms.

### Workflow codes follow the Workflow Status Sheet

This is a correction. Where the PMJAY Handbook and the Workflow Status Sheet disagree, the pages now follow the sheet. Cancel a preauthorisation on `PC01`, answered on `PC02`, not `122`. `251` acknowledges a resubmitted preauthorisation and is no longer listed as a reprocess acknowledgement. `25` is the claim document acknowledgement. [Workflow Codes](/docs/pr-29/docs/nhcx/v1/concepts/workflow-codes) also has a searchable list of every code with its status.

### Task inputs use intimationNumber

This is a correction. Pages told a preauthorisation Task to send its reference as `initimationNumber`, the spelling in NHA's PMJAY samples. They now use `intimationNumber`, the standard's spelling. If a payer refuses a Task for an invalid case number, check which spelling it expects.

### The NHCX adapter downloads and runs in Docker

[NHCX adapter](/docs/pr-29/docs/nhcx/v1/getting-started/nhcx-adapter#download) now offers the latest release for your operating system and architecture, with its checksums, and the commands to run the published container image `ghcr.io/nha-in/nhcx-adapter`.

### The NHCX skills are rebuilt

The seven NHCX skills on [Build with AI](/docs/pr-29/docs/nhcx/v1/getting-started/build-with-ai#install-a-skill) are replaced by a new generation. `nhcx-full` builds the whole provider-side integration end to end, and the insurance plan now belongs to `nhcx-preauth`, so `nhcx-insurance` is withdrawn. Each skill works through eight logged steps, from discovery to tests on the sandbox, and takes its NHCX facts from the nhcx-docs MCP server or a release of the NHCX package. The `nhcx` plugin is now version 1.0.0 and connects the nhcx-docs MCP server when it installs. Download a skill again rather than updating a copy from before this date.
