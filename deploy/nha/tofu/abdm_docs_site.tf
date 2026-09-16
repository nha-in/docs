# The documentation site: static Docusaurus output in a private bucket, read only by CloudFront.
# Same shape as the nhcx distribution in this account: OAC, a viewer-request function, and the
# certificate issued in us-east-1.
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

resource "aws_cloudfront_origin_access_control" "abdm_docs_site" {
  name                              = "ohn-${var.environment}-abdm-docs"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Docusaurus writes every page as <route>/index.html, and an S3 REST origin only resolves
# index.html at the root. Without this, every page except / returns 403.
resource "aws_cloudfront_function" "abdm_docs_site_rewrite_index" {
  name    = "ohn-${var.environment}-abdm-docs-rewrite-index"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOT
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
  EOT
}

# Honours the Cache-Control headers the deploy sets: a year for fingerprinted assets, revalidate
# for pages and for the spec files the API reference fetches at runtime.
data "aws_cloudfront_cache_policy" "abdm_docs_caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_acm_certificate" "abdm_docs_site" {
  provider          = aws.us-east-1
  domain_name       = local.abdm_docs_site_domain_name
  validation_method = "DNS"
  tags              = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "abdm_docs_site_certificate_validation" {
  for_each = {
    for option in aws_acm_certificate.abdm_docs_site.domain_validation_options :
    option.domain_name => option
  }

  zone_id         = data.aws_route53_zone.external.zone_id
  name            = each.value.resource_record_name
  type            = each.value.resource_record_type
  records         = [each.value.resource_record_value]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "abdm_docs_site" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.abdm_docs_site.arn
  validation_record_fqdns = [for record in aws_route53_record.abdm_docs_site_certificate_validation : record.fqdn]
}

resource "aws_cloudfront_distribution" "abdm_docs_site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.abdm_docs_site_domain_name
  aliases             = [local.abdm_docs_site_domain_name]
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  tags                = local.tags

  origin {
    origin_id                = "s3"
    domain_name              = aws_s3_bucket.abdm_docs_site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.abdm_docs_site.id
  }

  default_cache_behavior {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.abdm_docs_caching_optimized.id
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.abdm_docs_site_rewrite_index.arn
    }
  }

  # Under OAC, S3 answers 403 for a missing key. Serve the site's own 404 page with a real 404, so
  # a broken link is never dressed up as a working page.
  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.abdm_docs_site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

data "aws_iam_policy_document" "abdm_docs_site_bucket" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.abdm_docs_site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.abdm_docs_site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "abdm_docs_site" {
  bucket = aws_s3_bucket.abdm_docs_site.id
  policy = data.aws_iam_policy_document.abdm_docs_site_bucket.json

  depends_on = [aws_s3_bucket_public_access_block.abdm_docs_site]
}

resource "aws_route53_record" "abdm_docs_site" {
  for_each = toset(["A", "AAAA"])

  zone_id = data.aws_route53_zone.external.zone_id
  name    = local.abdm_docs_site_domain_name
  type    = each.key

  alias {
    name                   = aws_cloudfront_distribution.abdm_docs_site.domain_name
    zone_id                = aws_cloudfront_distribution.abdm_docs_site.hosted_zone_id
    evaluate_target_health = false
  }
}

output "abdm_docs_site_url" {
  description = "Public documentation site"
  value       = "https://${local.abdm_docs_site_domain_name}"
}

output "abdm_docs_site_bucket" {
  description = "Bucket the site deploy syncs into"
  value       = aws_s3_bucket.abdm_docs_site.id
}

output "abdm_docs_site_distribution_id" {
  description = "Distribution the site deploy invalidates"
  value       = aws_cloudfront_distribution.abdm_docs_site.id
}

output "abdm_docs_mcp_url" {
  description = "docs-mcp endpoint on the internal NLB, reachable inside NHA's network only. Put a hostname in front by setting MCP_URL in abdm_docs_mcp_environment"
  value       = "http://${module.abdm_docs_nlb.lb_dns_name}/mcp"
}
