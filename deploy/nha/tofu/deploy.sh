#!/usr/bin/env bash
# Publish abdm-docs into the AWS resources the abdm_docs_*.tf files create in NHA's account:
# the documentation site to S3 + CloudFront, docs-mcp to ECS.
#
#   deploy/nha/tofu/deploy.sh <version>        e.g. deploy/nha/tofu/deploy.sh v1.0.0
#
# Always both halves. <version> is the git tag being released: the image is pushed under it, never
# as latest, and goes live when abdm_docs_mcp_image_tag names it and tofu apply runs; the site
# goes to main/ in the bucket (what CloudFront serves) and a copy is kept under <version>/.
#
# Run from a checkout of this repository, with AWS credentials for NHA's account. Needs Node for
# the site; Go and Docker for docs-mcp. `tofu apply` must have run first, in sandbox-tofu.
set -euo pipefail

ACCOUNT_ID=684488299495
REGION=ap-south-1
CLUSTER=ohn-prod
SERVICE=ohn-prod-abdm-docs-mcp
ECR_REPOSITORY=ohn-prod-abdm-docs-mcp
NLB_NAME=ohn-prod-abdm-docs
SITE_BUCKET=ohn-prod-abdm-docs
SITE_DISTRIBUTION_COMMENT=ohn-prod-abdm-docs

repo="$(cd "$(dirname "$0")/../../.." && pwd)"

VERSION="${1:?usage: deploy/nha/tofu/deploy.sh <version>   (the git tag being released, e.g. v1.0.0)}"
export AWS_DEFAULT_REGION="$REGION"

caller="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$caller" != "$ACCOUNT_ID" ]]; then
  echo "AWS credentials are for account $caller, not $ACCOUNT_ID" >&2
  exit 1
fi

# Both addresses come from what tofu apply created: the site is the distribution's own
# cloudfront.net name, docs-mcp is the NLB's name. The site's browser code and the MCP install
# panel carry the docs-mcp address, so the site is built after the NLB exists.
distribution="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='$SITE_DISTRIBUTION_COMMENT'].Id | [0]" --output text)"
if [[ -z "$distribution" || "$distribution" == "None" ]]; then
  echo "no CloudFront distribution named $SITE_DISTRIBUTION_COMMENT; run tofu apply first" >&2
  exit 1
fi
site_domain="$(aws cloudfront get-distribution --id "$distribution" --query 'Distribution.DomainName' --output text)"
nlb_dns="$(aws elbv2 describe-load-balancers --names "$NLB_NAME" --query 'LoadBalancers[0].DNSName' --output text)"
site_url="https://$site_domain"
mcp_url="http://$nlb_dns/mcp"

echo "==> site: building for $site_url"
(cd "$repo" && npm ci && DOCUSAURUS_URL="$site_url" DOCUSAURUS_BASE_URL=/ MCP_URL="$mcp_url" npm run build)

# CloudFront serves main/ (its origin path). Fingerprinted assets go first, cached for a
# year, so every file a page references is in the bucket before the page is; pages and the
# spec files fetched at runtime must revalidate.
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" --include "*.md" \
  --cache-control "public,max-age=0,must-revalidate"

aws cloudfront create-invalidation --distribution-id "$distribution" --paths "/*" \
  --query 'Invalidation.Id' --output text

# The same build under <version>/, which CloudFront never serves and later deploys never
# delete. An earlier version goes back live with one sync from <version>/ to main/.
echo "==> site: keeping a copy at s3://$SITE_BUCKET/$VERSION/"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/$VERSION/" --only-show-errors

registry="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
image="$registry/$ECR_REPOSITORY:$VERSION"

# The search index is baked into the image and must be built with the same embedding
# provider the server runs with, or the server refuses to start.
echo "==> docs-mcp: building the search index against Bedrock in $REGION"
(cd "$repo/mcp" && EMBED_PROVIDER=bedrock AWS_REGION="$REGION" go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db)

# amd64 to match abdm_docs_mcp_cpu_architecture's default of X86_64. Pushed under the
# version only, never as latest: the service runs whichever version
# abdm_docs_mcp_image_tag names, so the rollout, and any rollback, goes through Tofu.
echo "==> docs-mcp: building and pushing $image"
aws ecr get-login-password | docker login --username AWS --password-stdin "$registry"
docker buildx build --platform linux/amd64 --provenance=false -t "$image" --push "$repo/mcp"

running="$(aws ecs describe-services --cluster "$CLUSTER" --services "$SERVICE" \
  --query 'services[0].taskDefinition' --output text 2>/dev/null | xargs -I{} aws ecs describe-task-definition \
  --task-definition {} --query 'taskDefinition.containerDefinitions[0].image' --output text 2>/dev/null || true)"
echo "==> docs-mcp: pushed. Service currently runs ${running:-nothing yet}."
echo "    To roll it out: set abdm_docs_mcp_image_tag = \"$VERSION\" in sandbox-tofu's tfvars and run tofu apply."

echo "version: $VERSION"
echo "site:    $site_url"
echo "mcp:     $mcp_url"
