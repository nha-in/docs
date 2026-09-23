# NHCX editor

A single file PHP app for editing the hand-written NHCX content in this
repository. It needs PHP 8.1 or later and nothing else.

## What it edits

| Area | Folder | Files |
| --- | --- | --- |
| Site pages | `site/docs/nhcx` | `.md`, `.mdx` |
| Atoms | `catalogue/nhcx` | `.md` |
| OpenAPI sources | `catalogue/openapi/nhcx` | `.yaml`, `.md` |

Under `api/`, only the module overview pages (`api/<module>/index.md`) and
`api/README.md` are offered. The endpoint pages, `errors.md`, `_servers.md`,
`api/index.md` and every `_category_.json` are written by
`scripts/build-api-reference.mjs`, so the editor hides them and refuses to
load or save them. To change one, edit the OpenAPI source and let the
generator run.

## Run it

From the repository root:

```sh
php -S 127.0.0.1:8090 -t tools/nhcx-editor tools/nhcx-editor/index.php
```

Open http://127.0.0.1:8090/. Run `npm start` alongside it and the
"View on site" button opens the page on the Docusaurus dev server, which
reloads on every save.

To reach it from another machine, bind to `0.0.0.0` and set a password.
Without `NHCX_EDITOR_PASSWORD`, the editor serves only this machine.

```sh
NHCX_EDITOR_PASSWORD='choose-one' php -S 0.0.0.0:8090 -t tools/nhcx-editor tools/nhcx-editor/index.php
```

Other machines sign in with any user name and that password. Set
`NHCX_SITE_URL` if the docs site is not on port 3000 of the same host.

## What it checks

- As you type: em dashes, missing frontmatter, a page with no `title` or
  `description`, an atom with no `id`, `type`, `gateway` or `title`, and an
  atom that claims `verified`.
- Run checks: saves, then runs `lint:content` for pages or `lint:atoms` for
  atoms, and shows the lines that name the open file.
- Save: if the file changed on disk after you opened it, the editor asks
  before overwriting.

Saves go straight to the working tree. Review them with `git diff` and commit
as usual.
