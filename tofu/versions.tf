terraform {
  required_version = ">= 1.8"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # No backend block: state is terraform.tfstate in this folder, on your machine only.
}

# Credentials come from AWS_PROFILE; allowed_account_ids stops a run against any other account.
provider "aws" {
  region              = var.region
  allowed_account_ids = [var.account_id]

  default_tags {
    tags = {
      Project   = "abdm-docs"
      Name      = var.name
      ManagedBy = "opentofu"
    }
  }
}

# CloudFront only accepts certificates from us-east-1.
provider "aws" {
  alias               = "us_east_1"
  region              = "us-east-1"
  allowed_account_ids = [var.account_id]
}
