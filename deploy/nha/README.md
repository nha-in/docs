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
