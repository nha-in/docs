# abdm-docs in Hyderabad (dev POC)

The same shape as Eka dev (`abdm-docs.dev.eka.care`) and NHA's architecture diagram, in account
`607765814920`, region `ap-south-2`. State is a local file in this folder, so run it from one
machine only.

| URL | Serves |
| --- | --- |
| `https://abdm-docs-hyd.dev.eka.care` | docs site: CloudFront → private S3 bucket |
| `http://abdm-docs-mcp-hyd.dev.eka.care/mcp` | docs-mcp: NLB → ECS Fargate; also `/healthz`, `/api/search` |

The site's browser code calls docs-mcp on its own hostname; docs-mcp allows the site's origin
for CORS.

## Certificates

Nothing here issues a certificate, the same way staging doesn't: CloudFront reuses the
`*.dev.eka.care` wildcard DevOps keeps in us-east-1, and the platform team owns TLS everywhere
else. The NLB therefore listens on plain TCP port 80 by default.

Set `mcp_certificate_arn` to an existing certificate in `ap-south-2` to move it to TLS on 443.
Until then the site is HTTPS while docs-mcp is HTTP, so a browser blocks the site's search calls
as mixed content. `curl` is unaffected, and `/healthz`, `/api/search` and `/mcp` all work.

## Deploy

Needs OpenTofu and Node, plus Go and Docker for docs-mcp.

```bash
export AWS_PROFILE=607765814920_AdministratorAccess
cd tofu
tofu init
tofu apply
./deploy.sh
```

`tofu apply` creates the infrastructure; CloudFront takes a few minutes. `deploy.sh` builds the
site and syncs it to S3, then builds the search index against Bedrock, pushes the docs-mcp image
and waits for the service to be healthy. Until the first image is pushed, docs-mcp tasks fail to
pull and ECS retries.

After a change, run `./deploy.sh site` or `./deploy.sh mcp`.

## Check

```bash
curl -I https://abdm-docs-hyd.dev.eka.care
curl https://abdm-docs-mcp-hyd.dev.eka.care/healthz
curl 'https://abdm-docs-mcp-hyd.dev.eka.care/api/search?q=abha'
aws logs tail /ecs/abdm-docs-hyd/mcp --region ap-south-2 --since 15m
```

## Remove

```bash
tofu destroy
```

This removes everything, including the bucket contents, the image and the DNS records it added.

## Not like NHA

NHA's docs-mcp runs in private subnets with no internet gateway, behind an internal NLB, and
reaches AWS through a transit gateway. Here it runs in the default VPC with public IPs. Chat is
off because Bedrock in ap-south-2 has no on-demand Claude model.
