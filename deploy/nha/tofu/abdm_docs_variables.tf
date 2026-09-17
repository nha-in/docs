variable "abdm_docs_mcp_image_tag" {
  description = "Version of the docs-mcp image to run, as pushed by deploy/nha/tofu/deploy.sh in abdm-docs (the git tag, e.g. v1.0.0). No default on purpose: every task definition names one version, so a rollout that fails rolls back to the previous version, and reverting is setting the earlier one here"
  type        = string
}

variable "abdm_docs_mcp_cpu_architecture" {
  description = "Fargate CPU architecture for docs-mcp, X86_64 or ARM64. Must match how the image is built: deploy/nha/workflows/mcp-deploy.yml runs a plain docker build on ubuntu-latest, which produces X86_64. ARM64 is cheaper and matches the other ohn services, but needs docker buildx build --platform linux/arm64"
  type        = string
  default     = "X86_64"
  validation {
    condition     = contains(["ARM64", "X86_64"], var.abdm_docs_mcp_cpu_architecture)
    error_message = "abdm_docs_mcp_cpu_architecture must be ARM64 or X86_64."
  }
}

variable "abdm_docs_mcp_desired_count" {
  description = "Number of docs-mcp tasks. Two keep one serving through a deployment or an AZ loss"
  type        = number
  default     = 2
}

variable "abdm_docs_mcp_task_cpu" {
  description = "CPU units for a docs-mcp task"
  type        = number
  default     = 512
}

variable "abdm_docs_mcp_task_memory" {
  description = "Memory (MiB) for a docs-mcp task"
  type        = number
  default     = 1024
}

variable "abdm_docs_mcp_environment" {
  description = "Environment variables for docs-mcp, in addition to AWS_REGION"
  type        = map(string)
  default = {
    EMBED_PROVIDER = "bedrock"
  }
}


variable "abdm_docs_mcp_log_retention_days" {
  description = "Retention for docs-mcp logs. CERT-In expects 180 days"
  type        = number
  default     = 180
}

variable "abdm_docs_site_url" {
  description = "Public origin of the documentation site. docs-mcp announces itself under it (MCP_URL) and admits browser calls from it (ALLOW_ORIGIN); the site is built against it"
  type        = string
  default     = "https://docs.abdm.gov.in"
}

variable "abdm_docs_site_distribution_arn" {
  description = "CloudFront distribution in NHA's CDN account that serves the site bucket"
  type        = string
  default     = "arn:aws:cloudfront::449563540430:distribution/E2ER503YJXRSWI"
}
