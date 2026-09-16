# The account's default VPC: public subnets only, so tasks get public IPs and reach ECR and
# Bedrock without a NAT gateway.
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

resource "aws_security_group" "nlb" {
  name        = "${var.name}-nlb"
  description = "Public access to docs-mcp"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = local.mcp_port
    to_port     = local.mcp_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "tasks" {
  name        = "${var.name}-tasks"
  description = "docs-mcp tasks, reachable only from the NLB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "traffic and health checks from the NLB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.nlb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
