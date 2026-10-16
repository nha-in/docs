# Deploying the portal for NHA

The portal has two halves, and one script publishes both:

- **The site.** Static Docusaurus output in a private S3 bucket, served by
  NHA's CloudFront distribution on `docs.abdm.gov.in`.
- **docs-mcp.** One stateless container on ECS Fargate, behind an internal
  network load balancer. The read-only catalogue snapshot is baked into the
  image, so there is no database server, queue or volume. Its only AWS
  dependency is Bedrock, reached through the task's IAM role.

The CDN forwards `/mcp`, `/api/*` and `/healthz` on the site's hostname to
docs-mcp, uncached. So the MCP endpoint is `https://docs.abdm.gov.in/mcp`, and
the Ask AI panel posts to the site's own origin.

## Where each piece is defined

| Piece | Defined in |
|---|---|
| Bucket, ECR repository, ECS task and service, load balancer, IAM, Bedrock endpoint | `nha-in/sandbox-tofu`, the `abdm_docs_*.tf` files |
| The CloudFront distribution and its path forwarding | NHA's CDN account, not managed in either repository |
| Building and publishing a release | `deploy.sh` here |
| Why the site is hosted this way | `site-hosting.md` here |

## Releasing a version

1. Copy `.env.example` to `.env` and fill it in. `.env` is gitignored.
2. Tag the commit being released, for example `v1.0.10`, and push the tag.
3. Run the script with AWS credentials for the target account:

   ```sh
   bash deploy/nha/deploy.sh v1.0.10
   ```

   It builds the site for `SITE_URL` and syncs it to `main/` in the bucket,
   which the CDN serves, keeping a copy under `v1.0.10/`. It then builds the
   search index against Bedrock and pushes the docs-mcp image to ECR under
   the tag, never as `latest`.
4. Roll out docs-mcp by setting `abdm_docs_mcp_image_tag` to the new tag in
   `sandbox-tofu` and applying it. The site is live as soon as the sync ends.

Rolling back the site is one sync from `<version>/` to `main/`. Rolling back
docs-mcp is setting the earlier tag in `sandbox-tofu` and applying it.

## Releasing the site only

When only pages changed, publish the site without rebuilding or pushing
docs-mcp:

```sh
bash deploy/nha/deploy-site.sh v1.0.11            # production, from .env
bash deploy/nha/deploy-site.sh v1.0.11 staging    # staging, from .env.staging
```

It runs the same build and the same four sync passes as `deploy.sh`, keeps the
copy under `<version>/`, and stops there. The site keeps pointing at whichever
docs-mcp is already live on `SITE_URL`. Each environment file needs only
`ACCOUNT_ID`, `REGION`, `SITE_BUCKET` and `SITE_URL`, and may set `AWS_PROFILE`
to pick the credentials for that account. Staging has no environment file
yet: its bucket is `ohn-staging-abdm-docs` in the staging account if the
`abdm_docs_*` infrastructure has been applied there, and its hostname is not
configured anywhere, so both have to be settled before `.env.staging` can be
written.

## What failure looks like, on purpose

docs-mcp refuses to start rather than serve degraded answers. A missing
`EMBED_PROVIDER`, an unreachable model, a missing IAM permission, or an index
built with a different embedding provider all stop the task at startup, and
the log names the exact problem. ECS keeps the previous task serving.

## One commit, both halves

The site, which generates the downloadable agent skills, and the docs-mcp
snapshot both derive from `catalogue/` through different build steps. Release
them from the same commit, which `deploy.sh` does by building both, or the
skills a developer downloads and the answers docs-mcp gives can disagree.
Every skill file and every MCP response carries the catalogue version, so a
mismatch is at least visible.

## MCP registry

Not submitted yet. Once `docs.abdm.gov.in` is live, submit the server at
registry.modelcontextprotocol.io, pointing at `https://docs.abdm.gov.in/mcp`
and `/.well-known/mcp.json`, and record the submission date and entry here.
