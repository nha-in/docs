#!/usr/bin/env bash
# Publish abdm-docs into the AWS resources the abdm_docs_*.tf files create in NHA's account:
# the documentation site to S3 + CloudFront, docs-mcp to ECS.
#
#   deploy/nha/tofu/deploy.sh            both
#   deploy/nha/tofu/deploy.sh site       the documentation site only
#   deploy/nha/tofu/deploy.sh mcp        docs-mcp only
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
SITE_HOSTNAME=docs.nha.ohc.network
IMAGE_TAG=${IMAGE_TAG:-latest}

repo="$(cd "$(dirname "$0")/../../.." && pwd)"
if (($#)); then targets=("$@"); else targets=(site mcp); fi
export AWS_DEFAULT_REGION="$REGION"

caller="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$caller" != "$ACCOUNT_ID" ]]; then
  echo "AWS credentials are for account $caller, not $ACCOUNT_ID" >&2
  exit 1
fi

# docs-mcp's address is the NLB's own name; the site's browser code and the MCP install panel
# both carry it, so the site is built after the NLB exists.
nlb_dns="$(aws elbv2 describe-load-balancers --names "$NLB_NAME" --query 'LoadBalancers[0].DNSName' --output text)"
site_url="https://$SITE_HOSTNAME"
mcp_url="http://$nlb_dns/mcp"

for target in "${targets[@]}"; do
  case "$target" in
    site)
      distribution="$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?contains(Aliases.Items, '$SITE_HOSTNAME')].Id | [0]" --output text)"
      if [[ -z "$distribution" || "$distribution" == "None" ]]; then
        echo "no CloudFront distribution serves $SITE_HOSTNAME; run tofu apply first" >&2
        exit 1
      fi

      echo "==> site: building for $site_url"
      (cd "$repo" && npm ci && DOCUSAURUS_URL="$site_url" DOCUSAURUS_BASE_URL=/ MCP_URL="$mcp_url" npm run build)

      # Fingerprinted assets first, cached for a year, so every file a page references is in the
      # bucket before the page is. Pages and the spec files fetched at runtime must revalidate.
      aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/" --delete --only-show-errors \
        --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
        --cache-control "public,max-age=31536000,immutable"
      aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/" --delete --only-show-errors \
        --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" --include "*.md" \
        --cache-control "public,max-age=0,must-revalidate"

      aws cloudfront create-invalidation --distribution-id "$distribution" --paths "/*" \
        --query 'Invalidation.Id' --output text
      ;;
    mcp)
      registry="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
      image="$registry/$ECR_REPOSITORY:$IMAGE_TAG"

      # The search index is baked into the image and must be built with the same embedding
      # provider the server runs with, or the server refuses to start.
      echo "==> docs-mcp: building the search index against Bedrock in $REGION"
      (cd "$repo/mcp" && EMBED_PROVIDER=bedrock AWS_REGION="$REGION" go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db)

      # amd64 to match abdm_docs_mcp_cpu_architecture's default of X86_64.
      echo "==> docs-mcp: building and pushing $image"
      aws ecr get-login-password | docker login --username AWS --password-stdin "$registry"
      docker buildx build --platform linux/amd64 --provenance=false -t "$image" --push "$repo/mcp"

      echo "==> docs-mcp: rolling $SERVICE"
      aws ecs update-service --cluster "$CLUSTER" --service "$SERVICE" --force-new-deployment \
        --query 'service.serviceName' --output text
      aws ecs wait services-stable --cluster "$CLUSTER" --services "$SERVICE"
      ;;
    *)
      echo "unknown target: $target (expected site or mcp)" >&2
      exit 1
      ;;
  esac
done

echo "site: $site_url"
echo "mcp:  $mcp_url"
