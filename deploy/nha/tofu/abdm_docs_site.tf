# The documentation site: static Docusaurus output in a private bucket. It is served by a CloudFront
# distribution in NHA's CDN account (449563540430) on docs.abdm.gov.in, which is not managed here:
# it reads main/ as its origin path, rewrites directory URLs to index.html, maps 403 to /404.html,
# and forwards /mcp/*, /api/* and /healthz to docs-mcp uncached.
resource "aws_s3_bucket" "abdm_docs_site" {
  bucket = "ohn-${var.environment}-abdm-docs"
  tags   = local.tags
}

resource "aws_s3_bucket_public_access_block" "abdm_docs_site" {
  bucket                  = aws_s3_bucket.abdm_docs_site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "abdm_docs_site" {
  bucket = aws_s3_bucket.abdm_docs_site.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "abdm_docs_site" {
  bucket = aws_s3_bucket.abdm_docs_site.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Read access for that distribution only, as supplied by NHA's CDN team.
resource "aws_s3_bucket_policy" "abdm_docs_site" {
  bucket = aws_s3_bucket.abdm_docs_site.id
  policy = jsonencode({
    "Version" : "2008-10-17",
    "Id" : "PolicyForCloudFrontPrivateContent",
    "Statement" : [
      {
        "Sid" : "AllowCloudFrontServicePrincipal",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "cloudfront.amazonaws.com"
        },
        "Action" : "s3:GetObject",
        "Resource" : "${aws_s3_bucket.abdm_docs_site.arn}/*",
        "Condition" : {
          "StringEquals" : {
            "AWS:SourceArn" : var.abdm_docs_site_distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.abdm_docs_site]
}

output "abdm_docs_site_url" {
  description = "Public documentation site, served by NHA's CDN account"
  value       = var.abdm_docs_site_url
}

output "abdm_docs_site_bucket" {
  description = "Bucket the site deploy syncs into"
  value       = aws_s3_bucket.abdm_docs_site.id
}

output "abdm_docs_mcp_url" {
  description = "docs-mcp endpoint as published on docs.abdm.gov.in; the NLB behind it is internal"
  value       = "${var.abdm_docs_site_url}/mcp"
}
