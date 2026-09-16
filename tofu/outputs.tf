output "site_url" {
  value = local.site_url
}

output "mcp_url" {
  value = local.mcp_url
}

# The rest is read by deploy.sh.
output "name" {
  value = var.name
}

output "region" {
  value = var.region
}

output "account_id" {
  value = var.account_id
}

output "image_tag" {
  value = var.image_tag
}

output "mcp_ecr_repository_url" {
  value = aws_ecr_repository.mcp.repository_url
}

output "site_bucket" {
  value = aws_s3_bucket.site.id
}

output "site_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}
