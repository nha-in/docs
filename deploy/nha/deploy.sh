#!/usr/bin/env bash
# Publish abdm-docs: the documentation site to S3 (served by a CDN on SITE_URL), docs-mcp to ECR
# for the ECS service to run, and the integrator plugins to the public nha-in/agent-plugins
# repository (see publish-agent-plugins.sh).
#
#   deploy/nha/deploy.sh <version>        e.g. deploy/nha/deploy.sh v1.0.0
#
# Always both halves. <version> is the git tag being released: the image is pushed under it, never
# as latest, and goes live when the infrastructure's image tag names it and is applied; the site
# goes to main/ in the bucket (the CDN's origin path) and a copy is kept under <version>/.
#
# Environment-specific names come from deploy/nha/.env (gitignored; see .env.example) or the
# environment. Run from a checkout of this repository with AWS credentials for the target
# account. Needs Node for the site; Go and Docker for docs-mcp. The infrastructure must exist first.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"

if [[ -f "$here/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$here/.env"
  set +a
fi

: "${ACCOUNT_ID:?set ACCOUNT_ID in deploy/nha/.env}"
: "${REGION:?set REGION in deploy/nha/.env}"
: "${CLUSTER:?set CLUSTER in deploy/nha/.env}"
: "${SERVICE:?set SERVICE in deploy/nha/.env}"
: "${ECR_REPOSITORY:?set ECR_REPOSITORY in deploy/nha/.env}"
: "${SITE_BUCKET:?set SITE_BUCKET in deploy/nha/.env}"
# One public hostname: the site from the bucket, /mcp/*, /api/* and /healthz forwarded to
# docs-mcp. Must match the site URL the infrastructure configures docs-mcp with.
: "${SITE_URL:?set SITE_URL in deploy/nha/.env}"

VERSION="${1:?usage: deploy/nha/deploy.sh <version>   (the git tag being released, e.g. v1.0.0)}"
export AWS_DEFAULT_REGION="$REGION"

caller="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$caller" != "$ACCOUNT_ID" ]]; then
  echo "AWS credentials are for account $caller, not $ACCOUNT_ID" >&2
  exit 1
fi

if ! aws s3api head-bucket --bucket "$SITE_BUCKET" 2>/dev/null; then
  echo "no bucket $SITE_BUCKET; create the infrastructure first" >&2
  exit 1
fi
site_url="$SITE_URL"
mcp_url="$SITE_URL/mcp"

echo "==> site: building for $site_url"
# CHAT_URL is the origin the Ask AI panel posts /api/chat to; the CDN forwards /api/* to
# docs-mcp on the site's own hostname. Without it the panel ships as a labelled mock.
(cd "$repo" && npm ci && DOCUSAURUS_URL="$site_url" DOCUSAURUS_BASE_URL=/ MCP_URL="$mcp_url" CHAT_URL="$site_url" npm run build)

# The public plugin marketplace, before the site: the site's install commands name it, so it
# carries this build's plugins before any page points at them, and a failed publish stops here.
"$here/publish-agent-plugins.sh" "$VERSION"

# The CDN serves main/ (its origin path). Fingerprinted assets go first, cached for a year,
# so every file a page references is in the bucket before the page is; pages and the spec
# files fetched at runtime must revalidate, which is what makes a deploy visible without an
# invalidation (the distribution is in another account).
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*.html" --exclude "*.xml" --exclude "*.yaml" --exclude "*.json" --exclude "*.txt" --exclude "*.md" \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/main/" --delete --only-show-errors \
  --exclude "*" --include "*.html" --include "*.xml" --include "*.yaml" --include "*.json" --include "*.txt" --include "*.md" \
  --cache-control "public,max-age=0,must-revalidate"

# The same build under <version>/, which the CDN never serves and later deploys never
# delete. An earlier version goes back live with one sync from <version>/ to main/.
echo "==> site: keeping a copy at s3://$SITE_BUCKET/$VERSION/"
aws s3 sync "$repo/site/build/" "s3://$SITE_BUCKET/$VERSION/" --only-show-errors

registry="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
image="$registry/$ECR_REPOSITORY:$VERSION"

# The search index is baked into the image and must be built with the same embedding
# provider the server runs with, or the server refuses to start.
echo "==> docs-mcp: building the search index against Bedrock in $REGION"
(cd "$repo/mcp" && EMBED_PROVIDER=bedrock AWS_REGION="$REGION" go run ./cmd/indexer -catalogue ../catalogue -out catalogue.db)

# amd64 to match the service's X86_64 CPU architecture. Pushed under the
# version only, never as latest: the service runs whichever version
# the infrastructure names, so the rollout, and any rollback, goes through it.
echo "==> docs-mcp: building and pushing $image"
aws ecr get-login-password | docker login --username AWS --password-stdin "$registry"
docker buildx build --platform linux/amd64 --provenance=false -t "$image" --push "$repo/mcp"

running="$(aws ecs describe-services --cluster "$CLUSTER" --services "$SERVICE" \
  --query 'services[0].taskDefinition' --output text 2>/dev/null | xargs -I{} aws ecs describe-task-definition \
  --task-definition {} --query 'taskDefinition.containerDefinitions[0].image' --output text 2>/dev/null || true)"
echo "==> docs-mcp: pushed. Service currently runs ${running:-nothing yet}."
echo "    To roll it out: set the docs-mcp image tag to \"$VERSION\" in the infrastructure config and apply it."

echo "version: $VERSION"
echo "site:    $site_url"
echo "mcp:     $mcp_url"
