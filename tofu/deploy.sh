#!/usr/bin/env bash
# Publish to what `tofu apply` created: the docs site to S3 + CloudFront, docs-mcp to ECS.
#
#   ./deploy.sh          both
#   ./deploy.sh site     docs site only
#   ./deploy.sh mcp      docs-mcp only
#
# Needs AWS_PROFILE for the account in variables.tf, Node for the site, Go and Docker for docs-mcp.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/.." && pwd)"
if (($#)); then targets=("$@"); else targets=(site mcp); fi

out() { tofu -chdir="$here" output -raw "$1"; }
name="$(out name)"
region="$(out region)"
site_url="$(out site_url)"
mcp_url="$(out mcp_url)"

if [[ "$(aws sts get-caller-identity --query Account --output text)" != "$(out account_id)" ]]; then
  echo "AWS credentials are not for account $(out account_id); set AWS_PROFILE" >&2
  exit 1
fi

for target in "${targets[@]}"; do
  case "$target" in
    site)
      bucket="$(out site_bucket)"
      echo "==> docs site: building for $site_url"
      # CHAT_URL stays unset, so the Ask AI panel renders as a labeled mock instead of a dead composer.
      (cd "$repo" && npm ci && DOCUSAURUS_URL="$site_url" DOCUSAURUS_BASE_URL=/ MCP_URL="$mcp_url" npm run build)

      # Fingerprinted assets first, cached for a year, so no page goes live before the files it references.
      aws s3 sync "$repo/site/build/" "s3://$bucket/" --region "$region" --delete \
        --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
        --cache-control "public,max-age=31536000,immutable"
      # Pages and the files fetched at runtime must revalidate, or a deploy stays invisible until the cache expires.
      aws s3 sync "$repo/site/build/" "s3://$bucket/" --region "$region" --delete \
        --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" --include "*.md" \
        --cache-control "public,max-age=0,must-revalidate"

      aws cloudfront create-invalidation --distribution-id "$(out site_distribution_id)" --paths "/*" \
        --query 'Invalidation.Id' --output text
      ;;
    mcp)
      image="$(out mcp_ecr_repository_url):$(out image_tag)"
      echo "==> docs-mcp: building catalogue.db with Bedrock embeddings in $region"
      (cd "$repo/mcp" && EMBED_PROVIDER=bedrock AWS_REGION="$region" go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db)

      aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "${image%%/*}"
      docker buildx build --platform linux/arm64 --provenance=false -t "$image" --push "$repo/mcp"

      aws ecs update-service --region "$region" --cluster "$name" --service "$name-mcp" \
        --force-new-deployment --query 'service.serviceName' --output text
      echo "==> waiting for docs-mcp to become stable (up to 10 minutes)"
      aws ecs wait services-stable --region "$region" --cluster "$name" --services "$name-mcp"
      ;;
    *)
      echo "unknown target: $target (expected site or mcp)" >&2
      exit 1
      ;;
  esac
done

echo "site: $site_url"
echo "mcp:  $mcp_url"
