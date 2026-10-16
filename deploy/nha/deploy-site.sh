#!/usr/bin/env bash
# Publish the documentation site only: build it and sync it to the S3 bucket the CDN serves.
# docs-mcp (the MCP endpoint and the Ask AI panel's backend) is not touched; the site keeps
# pointing at whichever docs-mcp is already live on SITE_URL.
#
#   deploy/nha/deploy-site.sh <version> [environment]
#
#   deploy/nha/deploy-site.sh v1.2.92            production, from deploy/nha/.env
#   deploy/nha/deploy-site.sh v1.2.92 staging    staging, from deploy/nha/.env.staging
#
# <version> is the git tag being released. The build goes to main/ in the bucket (the CDN's
# origin path) and a copy is kept under <version>/, so an earlier version goes back live with
# one sync from <version>/ to main/. The sync steps are the same as deploy/nha/deploy.sh; keep
# the two in step.
#
# Each environment file (gitignored; see .env.example) needs ACCOUNT_ID, REGION, SITE_BUCKET
# and SITE_URL. It may also set AWS_PROFILE to pick the credentials for that account.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"

VERSION="${1:?usage: deploy/nha/deploy-site.sh <version> [environment]   e.g. v1.2.92 staging}"
ENVIRONMENT="${2:-prod}"

case "$ENVIRONMENT" in
  prod) env_file="$here/.env" ;;
  *)    env_file="$here/.env.$ENVIRONMENT" ;;
esac
if [[ ! -f "$env_file" ]]; then
  echo "no $env_file for environment '$ENVIRONMENT'; copy .env.example there and fill it in" >&2
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$env_file"
set +a

: "${ACCOUNT_ID:?set ACCOUNT_ID in $env_file}"
: "${REGION:?set REGION in $env_file}"
: "${SITE_BUCKET:?set SITE_BUCKET in $env_file}"
: "${SITE_URL:?set SITE_URL in $env_file}"
export AWS_DEFAULT_REGION="$REGION"

caller="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$caller" != "$ACCOUNT_ID" ]]; then
  echo "AWS credentials are for account $caller, not $ACCOUNT_ID ($ENVIRONMENT)" >&2
  exit 1
fi
if ! aws s3api head-bucket --bucket "$SITE_BUCKET" 2>/dev/null; then
  echo "no bucket $SITE_BUCKET in $ACCOUNT_ID; create the infrastructure first" >&2
  exit 1
fi
if ! git -C "$repo" rev-parse -q --verify "refs/tags/$VERSION" >/dev/null; then
  echo "no git tag $VERSION; tag the commit being released and push the tag first" >&2
  exit 1
fi

echo "==> site ($ENVIRONMENT): building $VERSION for $SITE_URL"
# MCP_URL and CHAT_URL point the Ask AI panel at the docs-mcp already serving on this hostname.
(cd "$repo" && npm ci && DOCUSAURUS_URL="$SITE_URL" DOCUSAURUS_BASE_URL=/ MCP_URL="$SITE_URL/mcp" CHAT_URL="$SITE_URL" npm run build)
test -f "$repo/site/build/index.html"

echo "==> site ($ENVIRONMENT): syncing to s3://$SITE_BUCKET/main/"
# Fingerprinted assets first, cached for a year; everything else revalidates, which is what
# makes a deploy visible without a CDN invalidation. Same four passes as deploy.sh.
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*" --include "assets/*" \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "assets/*" \
  --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
  --cache-control "public,max-age=0,must-revalidate"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" \
  --cache-control "public,max-age=0,must-revalidate"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*" --include "*.md" \
  --content-type "text/markdown; charset=utf-8" \
  --cache-control "public,max-age=0,must-revalidate"

echo "==> site ($ENVIRONMENT): keeping a copy at s3://$SITE_BUCKET/$VERSION/"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/$VERSION/" --only-show-errors

echo "version:     $VERSION"
echo "environment: $ENVIRONMENT"
echo "site:        $SITE_URL"
echo "docs-mcp:    untouched"
