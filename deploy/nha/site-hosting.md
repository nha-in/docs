# The docs site on NHA's domain

Decided: the site serves from NHA's AWS under NHA's domain, not GitHub
Pages. The build is fully static (~110 MB, a third of it the vendored API
reference bundle), so the whole hosting story is one bucket and one CDN.

## Pieces

| Piece | Detail |
|---|---|
| S3 bucket | private, static content only; CloudFront reaches it through Origin Access Control, the bucket is never public |
| CloudFront distribution | default root `index.html`; the viewer-request function below; THEN 403 mapped to `/404.html` with code 404; compress on |
| ACM certificate | for the docs hostname, issued in `us-east-1` (CloudFront only accepts certificates from that region, regardless of where everything else lives) |
| DNS | docs hostname as an alias to the distribution |
| CI permission | the existing CI role (OIDC) additionally gets `s3:PutObject`/`s3:ListBucket`/`s3:DeleteObject` on the bucket and `cloudfront:CreateInvalidation` on the distribution |

## The index rewrite function, required

S3's REST origin resolves `index.html` only at the root. Docusaurus emits
every page as `<route>/index.html`, so without this function a refresh or
deep link on any inner page returns 403. Create it under CloudFront ->
Functions, publish, and associate with the default behavior's viewer
request:

    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
      }
      return request;
    }

Order matters: add the 403-to-404 error mapping only after this function
works, or every routing miss is dressed up as the 404 page and the real
problem hides. Do not use the single-page-app trick of mapping errors to
`/index.html`; this is a multi-page site and that serves wrong content at
wrong URLs.

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
