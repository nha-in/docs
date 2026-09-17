# docs-mcp and the docs site in NHA's OpenTofu

Six files that drop into the root of `nha-in/sandbox-tofu`, next to `ecs_cluster.tf`, `kms.tf`
and `backend_alb.tf`. They add to the existing state; nothing already there changes.

| File | Creates |
| --- | --- |
| `abdm_docs_variables.tf` | every setting; all defaulted except `abdm_docs_mcp_image_tag`, the image version to run |
| `abdm_docs_ecr.tf` | `ohn-<env>-abdm-docs-mcp`, KMS-encrypted, keeps 20 tagged images |
| `abdm_docs_nlb.tf` | internal NLB, TCP 80 → 8080, `/healthz` checks; reuses `backend_alb`'s security group |
| `abdm_docs_mcp_ecs_task.tf` | the docs-mcp Fargate service on `module.ecs_cluster`, 2 tasks, rollback on failure, Bedrock IAM |
| `abdm_docs_bedrock_endpoint.tf` | `bedrock-runtime` VPC endpoint, open only to the docs-mcp tasks |
| `abdm_docs_site.tf` | the docs site bucket, readable by the CloudFront distribution in NHA's CDN account that serves `docs.abdm.gov.in` |
| `deploy.sh` | publishes the site and docs-mcp into the above; not a Tofu file, stays in this repository |

What they rely on from the root: `module.vpc`, `module.ecs_cluster`, `module.kms_key`,
`aws_security_group.nlb_sg`, `aws_security_group.vpc_endpoints` (the group on the ECR, logs and
SSM interface endpoints; docs-mcp adds an ingress rule to it), `local.tags`, and the variables
`environment`, `aws_region`, `aws_account_id`.

## Deploy

**1. Infrastructure.** Copy the files in, then from the sandbox-tofu root:

```sh
tofu init -upgrade -backend-config=backend/nha-ap-south-1.tfbackend
tofu plan -var-file=environments/nha-ap-south-1.tfvars
```

`-upgrade` once: the committed lock file allows aws `>= 6.28`, the modules need `>= 6.41`.
`abdm_docs_mcp_image_tag` has no default: put the version you are about to publish in the
tfvars (`abdm_docs_mcp_image_tag = "v1.0.0"`). The plan must show additions only, every one
named `abdm_docs_*` or `module.abdm_docs_*`. Then `tofu apply`. The ECR repository starts
empty, so docs-mcp tasks fail to pull until step 2 pushes that version; ECS keeps retrying and
they start on their own once it is there.

**2. Publish.** From a checkout of this repository, at a commit that includes the stateless
MCP server (`mcp/internal/server/http.go` passing `Stateless: true`; older builds break with
two tasks), with credentials for NHA's account:

```sh
deploy/nha/tofu/deploy.sh v1.0.0
```

The argument is the version being released: the git tag on the commit you are deploying from.
`deploy.sh` carries NHA's names (account, region, cluster, service, repository, bucket) and the
public origin `https://docs.abdm.gov.in`, and always publishes both the site and docs-mcp. There
is no `latest` anywhere.

- **Site:** built against `https://docs.abdm.gov.in`, synced to `main/` in the bucket in two
  passes (assets first, then pages). `main/` is the CDN's origin path and the only prefix it
  serves. Pages are uploaded with `must-revalidate` and assets are fingerprinted, so no
  invalidation is needed; the distribution lives in NHA's CDN account (449563540430) and is not
  managed here. A copy is kept under `<version>/`, which later deploys never delete.
- **docs-mcp:** the search index is built against Bedrock, the amd64 image is built and pushed
  as `<version>`, and the script prints what to do next. Nothing rolls out until Tofu says so:

  ```sh
  # sandbox-tofu, environments/nha-ap-south-1.tfvars
  abdm_docs_mcp_image_tag = "v1.1.0"
  ```

  then `tofu apply`. That is a new task-definition revision naming that version; ECS rolls the
  two tasks one at a time, and if the new version never gets healthy the circuit breaker puts the
  previous revision, and so the previous version, back.

**Reverting.** docs-mcp: set the earlier version in the tfvars and `tofu apply`. Site:
`aws s3 sync s3://ohn-prod-abdm-docs/<version>/ s3://ohn-prod-abdm-docs/main/ --delete`.

Needs Node for the site, Go and Docker for docs-mcp, and the deploying identity needs
`bedrock:InvokeModel` on Titan Text Embeddings for the index build.

## Check

Through the CDN, from anywhere:

```sh
curl https://docs.abdm.gov.in/healthz
curl 'https://docs.abdm.gov.in/api/search?q=abha'
aws logs tail ohn/prod/abdm-docs-mcp --since 15m
```

The NLB itself is internal; the CDN reaches it through an external ALB NHA runs. Whatever
targets the docs-mcp tasks must carry `aws_security_group.nlb_sg`, the only group they admit
on 8080.

A healthy start logs `docs-mcp starting … embeddings=true`.

## Known limits

- The CDN's `/mcp/*`, `/api/*` and `/healthz` behaviours must forward every method, header and
  query string uncached: MCP is `POST` with `Accept: text/event-stream`, chat streams.
- `private_dns_enabled` on the Bedrock endpoint applies to the whole VPC: everything in it that
  calls Bedrock goes through the endpoint from then on.
- Chat needs `CHAT_MODEL` in `abdm_docs_mcp_environment`, plus `TRUST_PROXY = "true"` and
  `TRUST_PROXY_HOPS = "2"` so the per-IP rate limit keys on the reader rather than on the ALB
  or the CDN edge. Unset `CHAT_MODEL` turns chat off and the Ask AI panel becomes a labelled
  mock on the next site build.
- Destroying: empty the ECR repository and the versioned site bucket first, or `tofu destroy`
  stops on them.

## How this was tested

Applied byte-for-byte into a copy of the `ohn` network in another account: no internet gateway,
no NAT, no default route, only VPC endpoints, with `kms.tf`, `ecs_cluster.tf`, `locals.tf` and
`route53.tf` from this root unchanged. Three full apply/deploy/verify/destroy cycles (ARM64, the
X86_64 default, the shared security group). From inside that VPC: health, search, CORS, the MCP
protocol end to end against two tasks, a task kill with no failed health checks, and a broken
deploy rolled back by the circuit breaker with no failed health checks. Plan clean afterwards.

One gap that harness did not catch: its interface endpoints admitted the whole VPC CIDR, while
NHA's admit only their shared task security group. The first live deploy failed on that
(`ResourceInitializationError ... api.ecr ... i/o timeout`); the rule in
`abdm_docs_mcp_ecs_task.tf` that admits docs-mcp at those endpoints is the fix.
