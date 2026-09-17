module "abdm_docs_mcp_ecr" {
  source          = "terraform-aws-modules/ecr/aws"
  version         = "1.7.1"
  repository_name = "ohn-${var.environment}-abdm-docs-mcp"

  repository_lifecycle_policy     = local.abdm_docs_mcp_repository_lifecycle_policy
  repository_encryption_type      = "KMS"
  repository_image_tag_mutability = "MUTABLE"
  tags                            = local.tags
  repository_kms_key              = module.kms_key.key_arn
}

locals {
  # Expires by tagged count only. An "untagged" rule would delete the per-platform manifests
  # inside a multi-architecture image, which are untagged, and break the tag that points at them.
  abdm_docs_mcp_repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep the 20 most recent tagged images",
        selection = {
          tagStatus      = "tagged",
          tagPatternList = ["*"],
          countType      = "imageCountMoreThan",
          countNumber    = 20
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Outputs
# ------------------------------------------------------------

output "abdm_docs_mcp_ecr_repository_url" {
  description = "ECR repository for the docs-mcp image"
  value       = module.abdm_docs_mcp_ecr.repository_url
}
