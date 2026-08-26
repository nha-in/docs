# The docs site on NHA's domain

Decided: the site serves from NHA's AWS under NHA's domain, not GitHub
Pages. The build is fully static (~110 MB, a third of it the vendored API
reference bundle), so the whole hosting story is one bucket and one CDN.

## Pieces

| Piece | Detail |
|---|---|
| S3 bucket | private, static content only; CloudFront reaches it through Origin Access Control, the bucket is never public |
| CloudFront distribution | default root `index.html`; 404 handling mapped to the site's own 404 page; compress on |
| ACM certificate | for the docs hostname, issued in `us-east-1` (CloudFront only accepts certificates from that region, regardless of where everything else lives) |
| DNS | docs hostname as an alias to the distribution |
| CI permission | the existing CI role (OIDC) additionally gets `s3:PutObject`/`s3:ListBucket`/`s3:DeleteObject` on the bucket and `cloudfront:CreateInvalidation` on the distribution |

## Build settings

The deploy sets two environment values and nothing else changes:

    DOCUSAURUS_URL=https://<docs hostname>
    DOCUSAURUS_BASE_URL=/

The chrome is base-URL clean in both directions, so moving from a
`/repo/` base to the domain root is configuration, not code.

## CI step, in outline

    npm run build
    aws s3 sync site/build "s3://<bucket>" --delete
    aws cloudfront create-invalidation --distribution-id <id> --paths "/*"

`--delete` keeps the bucket exactly equal to the build, so removed pages
disappear rather than lingering as stale orphans.
