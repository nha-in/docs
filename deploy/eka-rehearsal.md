# Rehearsing NHA's hosting shape on an Eka domain

The site moves off GitHub Pages onto S3 + CloudFront in Eka's account, at
docs.abdm.dev.eka.care, following the same pattern as the nectar frontends
(dev-abdm-s3-deploy and siblings): tag-triggered deploys from the shared
runner, the runner role via OIDC, a DevOps-provisioned bucket and
distribution named in the workflow. `.github/workflows/dev-docs-s3-deploy.yml`
is the live workflow; it fires on `dev-docs-*` tags, so it is inert until
the first tag is pushed.

## Ask to DevOps, same as any nectar frontend

The bucket is the existing `elixir-dev-abdm`, which the runner role can
already sync; the docs live under the `docs/` prefix beside the abdm
frontend's `main/`. That shrinks the ask to the distribution:

| Piece | Value |
|---|---|
| CloudFront distribution | origin `elixir-dev-abdm` with origin path `/docs`, certificate for `docs.abdm.dev.eka.care` |
| DNS | `docs.abdm.dev.eka.care` to the distribution |
| Role permission | `cloudfront:CreateInvalidation` on the new distribution for `github-runner-role`, if its policy names distributions individually |

Then fill `DISTRIBUTION_ID` in the workflow and push a `dev-docs-*` tag. GitHub Pages keeps serving until the first tag deploy is
verified; retire `.github/workflows/deploy-pages.yml` after that.

## What the rehearsal proves

Domain-root base URL (`/` instead of `/abdm-docs/`), the bucket sync, the
invalidation, and the OIDC-only credential path: every piece NHA's install
depends on, exercised end to end before the transfer. NHA's own copy stays
variable-driven (`deploy/nha/workflows/site-deploy.yml`) since their repo
runs on GitHub-hosted runners without Eka's conventions; the hosting shape
is identical.
