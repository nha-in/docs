# docs-mcp and the docs site in NHA's OpenTofu

Six files that drop into the root of `nha-in/sandbox-tofu`, next to `ecs_cluster.tf`, `kms.tf`
and `backend_alb.tf`. They add to the existing state; nothing already there changes.

| File | Creates |
| --- | --- |
| `abdm_docs_variables.tf` | every setting, all with defaults |
| `abdm_docs_ecr.tf` | `ohn-<env>-abdm-docs-mcp`, KMS-encrypted, keeps 20 tagged images |
| `abdm_docs_nlb.tf` | internal NLB, TCP 80 → 8080, `/healthz` checks; reuses `backend_alb`'s security group |
| `abdm_docs_mcp_ecs_task.tf` | the docs-mcp Fargate service on `module.ecs_cluster`, 2 tasks, rollback on failure, Bedrock IAM |
| `abdm_docs_bedrock_endpoint.tf` | `bedrock-runtime` VPC endpoint, open only to the docs-mcp tasks |
| `abdm_docs_site.tf` | `docs.<zone>`: private bucket, CloudFront, certificate, DNS |

What they rely on from the root: `module.vpc`, `module.ecs_cluster`, `module.kms_key`,
`aws_security_group.nlb_sg`, `data.aws_route53_zone.external`, the `aws.us-east-1` provider
alias, `local.tags`, and the variables `environment`, `aws_region`, `aws_account_id`, `zone_name`.

## Deploy

**1. Infrastructure.** Copy the files in, then from the sandbox-tofu root:

```sh
tofu init -upgrade -backend-config=backend/nha-ap-south-1.tfbackend
tofu plan -var-file=environments/nha-ap-south-1.tfvars
```

`-upgrade` once: the committed lock file allows aws `>= 6.28`, the modules need `>= 6.41`. The
plan must show additions only, every one named `abdm_docs_*` or `module.abdm_docs_*`. Then
`tofu apply`. The ECR repository starts empty, so docs-mcp tasks fail to pull until step 2; that
is expected and stops on its own.

**2. docs-mcp image.** From this repository at a commit that includes the stateless MCP server
(`mcp/internal/server/http.go` passing `Stateless: true`); older builds break with two tasks.

```sh
cd mcp
EMBED_PROVIDER=bedrock AWS_REGION=ap-south-1 go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db
docker build -t <ecr repository url>:latest .
docker push <ecr repository url>:latest
aws ecs update-service --cluster ohn-prod --service ohn-prod-abdm-docs-mcp --force-new-deployment
```

The repository URL is the `abdm_docs_mcp_ecr_repository_url` output. A plain `docker build`
produces an amd64 image, which matches the `X86_64` default; build with
`--platform linux/arm64` only if `abdm_docs_mcp_cpu_architecture` is changed. To pin releases
instead of `latest`, push a tagged image and set `abdm_docs_mcp_image_tag` before applying.

**3. Docs site.**

```sh
DOCUSAURUS_URL=https://docs.<zone> DOCUSAURUS_BASE_URL=/ MCP_URL=<abdm_docs_mcp_url output> npm run build
aws s3 sync site/build "s3://<abdm_docs_site_bucket output>" --delete \
  --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync site/build "s3://<abdm_docs_site_bucket output>" --delete \
  --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" --include "*.md" \
  --cache-control "public,max-age=0,must-revalidate"
aws cloudfront create-invalidation --distribution-id <abdm_docs_site_distribution_id output> --paths "/*"
```

Two passes so every asset a page references is in the bucket before the page is.

## Check

From inside the VPC or across the transit gateway (the NLB is internal):

```sh
curl http://<abdm_docs_nlb_dns_name output>/healthz
curl 'http://<abdm_docs_nlb_dns_name output>/api/search?q=abha'
aws logs tail ohn/prod/abdm-docs-mcp --since 15m
```

A healthy start logs `docs-mcp starting … embeddings=true`.

## Known limits

- docs-mcp is internal and plain HTTP. Coding agents inside NHA's network reach it; the public
  site's search box does not, because a browser will not call `http://` from an `https://` page.
  Put TLS in front of the NLB, or a CloudFront behaviour, when that matters.
- `private_dns_enabled` on the Bedrock endpoint applies to the whole VPC: everything in it that
  calls Bedrock goes through the endpoint from then on.
- Chat is off (`CHAT_MODEL` unset). Add it to `abdm_docs_mcp_environment` to turn it on.
- Destroying: empty the ECR repository and the versioned site bucket first, or `tofu destroy`
  stops on them.

## How this was tested

Applied byte-for-byte into a copy of the `ohn` network in another account: no internet gateway,
no NAT, no default route, only VPC endpoints, with `kms.tf`, `ecs_cluster.tf`, `locals.tf` and
`route53.tf` from this root unchanged. Three full apply/deploy/verify/destroy cycles (ARM64, the
X86_64 default, the shared security group). From inside that VPC: health, search, CORS, the MCP
protocol end to end against two tasks, a task kill with no failed health checks, and a broken
deploy rolled back by the circuit breaker with no failed health checks. Plan clean afterwards.
