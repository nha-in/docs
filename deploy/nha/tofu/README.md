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
| `deploy.sh` | publishes the site and docs-mcp into the above; not a Tofu file, stays in this repository |

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

**2. Publish.** From a checkout of this repository, at a commit that includes the stateless
MCP server (`mcp/internal/server/http.go` passing `Stateless: true`; older builds break with
two tasks), with credentials for NHA's account:

```sh
deploy/nha/tofu/deploy.sh
```

`deploy.sh` carries NHA's names (account, region, cluster, service, repository, bucket,
hostname) and looks the rest up. It builds the site with the right URLs and syncs it to the
bucket in two passes (assets first, then pages), invalidates CloudFront, builds the search index
against Bedrock, builds and pushes the amd64 docs-mcp image, rolls the ECS service and waits for
it to be stable. `deploy.sh site` or `deploy.sh mcp` does one half. Set `IMAGE_TAG` to push a
release tag instead of `latest`, and set `abdm_docs_mcp_image_tag` to match before applying.

Needs Node for the site, Go and Docker for docs-mcp, and the deploying identity needs
`bedrock:InvokeModel` on Titan Text Embeddings for the index build.

## Check

From inside the VPC or across the transit gateway (the NLB is internal). `deploy.sh` prints the
two URLs when it finishes.

```sh
curl http://<nlb dns name>/healthz
curl 'http://<nlb dns name>/api/search?q=abha'
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
