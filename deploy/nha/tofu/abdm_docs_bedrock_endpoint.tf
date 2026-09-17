# docs-mcp embeds every search query through Bedrock and refuses to start if the model is
# unreachable. This VPC has no internet gateway and sends 0.0.0.0/0 to the transit gateway, so
# this endpoint keeps the calls inside the VPC rather than depending on what the hub allows.
#
# private_dns_enabled applies to the whole VPC: after this, anything here resolving
# bedrock-runtime.<region>.amazonaws.com reaches this endpoint instead of the public address.
resource "aws_security_group" "abdm_docs_bedrock_endpoint" {
  name        = "ohn-${var.environment}-bedrock-runtime-endpoint"
  description = "HTTPS from docs-mcp to the Bedrock runtime endpoint"
  vpc_id      = module.vpc.vpc_id
  tags        = local.tags
}

resource "aws_security_group_rule" "abdm_docs_bedrock_endpoint_ingress" {
  description              = "docs-mcp tasks"
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.abdm_docs_bedrock_endpoint.id
  source_security_group_id = module.abdm_docs_mcp_service_task.service_security_group_id
}

resource "aws_vpc_endpoint" "abdm_docs_bedrock_runtime" {
  vpc_id              = module.vpc.vpc_id
  service_name        = "com.amazonaws.${var.aws_region}.bedrock-runtime"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = module.vpc.private_subnets
  security_group_ids  = [aws_security_group.abdm_docs_bedrock_endpoint.id]
  private_dns_enabled = true

  tags = merge(local.tags, { Name = "ohn-${var.environment}-bedrock-runtime" })
}
