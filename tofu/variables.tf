variable "account_id" {
  type    = string
  default = "607765814920"
}

variable "region" {
  type    = string
  default = "ap-south-2"
}

variable "name" {
  description = "Prefix for every resource."
  type        = string
  default     = "abdm-docs-hyd"
}

variable "zone_name" {
  description = "Public Route 53 zone the hostnames live in."
  type        = string
  default     = "dev.eka.care"
}

variable "site_hostname" {
  type    = string
  default = "abdm-docs-hyd.dev.eka.care"
}

variable "mcp_hostname" {
  type    = string
  default = "abdm-docs-mcp-hyd.dev.eka.care"
}

variable "mcp_certificate_arn" {
  description = <<-EOT
    Existing ACM certificate in var.region for the docs-mcp NLB listener, the way staging reuses the
    DevOps-provisioned *.dev.eka.care wildcard. Empty serves plain HTTP and creates no certificate;
    the browser then blocks the site's search calls as mixed content until TLS sits in front.
  EOT
  type        = string
  default     = ""
}

variable "image_tag" {
  description = "Tag the docs-mcp service runs. deploy.sh pushes to this tag."
  type        = string
  default     = "latest"
}

variable "desired_count" {
  description = "docs-mcp tasks."
  type        = number
  default     = 1
}

locals {
  # Both are default ports, so neither scheme needs one in the URL.
  mcp_tls    = var.mcp_certificate_arn != ""
  mcp_port   = local.mcp_tls ? 443 : 80
  mcp_origin = "${local.mcp_tls ? "https" : "http"}://${var.mcp_hostname}"

  # CloudFront always serves HTTPS, on the zone's existing wildcard certificate.
  site_url = "https://${var.site_hostname}"
  mcp_url  = "${local.mcp_origin}/mcp"
}
