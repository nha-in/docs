
resource "aws_cloudwatch_log_group" "abdm_docs_mcp_logs" {
  name              = "ohn/${var.environment}/abdm-docs-mcp"
  kms_key_id        = module.kms_key.key_arn
  retention_in_days = var.abdm_docs_mcp_log_retention_days
  tags              = local.tags
}

locals {
  abdm_docs_mcp_container_name = "ohn-${var.environment}-abdm-docs-mcp"

  # The NLB works at layer 4 and adds no X-Forwarded-For, so TRUST_PROXY stays unset.
  #
  # ALLOW_ORIGIN lets the documentation site's browser code call /api/search; MCP_URL is the
  # address docs-mcp names to coding agents, and without it the server falls back to a built-in
  # default that points somewhere else entirely. The NLB's own name is the default; override
  # MCP_URL in abdm_docs_mcp_environment once a hostname exists.
  abdm_docs_mcp_environment_variables = [
    for name, value in merge({
      AWS_REGION   = var.aws_region
      ALLOW_ORIGIN = "https://${local.abdm_docs_site_domain_name}"
      MCP_URL      = "http://${module.abdm_docs_nlb.lb_dns_name}/mcp"
      }, var.abdm_docs_mcp_environment) : {
      name  = name
      value = value
    }
  ]
}

module "abdm_docs_mcp_container_definition" {
  source          = "cloudposse/ecs-container-definition/aws"
  version         = "0.61.2"
  container_name  = local.abdm_docs_mcp_container_name
  container_image = "${module.abdm_docs_mcp_ecr.repository_url}:${var.abdm_docs_mcp_image_tag}"
  port_mappings = [
    {
      containerPort = 8080
      hostPort      = 8080
      protocol      = "tcp"
    }
  ]
  container_memory             = var.abdm_docs_mcp_task_memory
  container_memory_reservation = var.abdm_docs_mcp_task_memory
  container_cpu                = var.abdm_docs_mcp_task_cpu

  # Distroless image that writes nothing: no shell, so no ECS Exec and no container health check.
  readonly_root_filesystem = true
  user                     = "65532:65532"
  stop_timeout             = 60

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-region        = var.aws_region
      awslogs-group         = aws_cloudwatch_log_group.abdm_docs_mcp_logs.name
      awslogs-stream-prefix = "mcp"
    }
  }
  environment = local.abdm_docs_mcp_environment_variables
}

module "abdm_docs_mcp_service_task" {
  source  = "cloudposse/ecs-alb-service-task/aws"
  version = "0.67.1"

  namespace                 = "ohn"
  stage                     = var.environment
  name                      = "abdm-docs-mcp"
  container_definition_json = module.abdm_docs_mcp_container_definition.json_map_encoded_list
  ecs_cluster_arn           = module.ecs_cluster.cluster_arn
  launch_type               = "FARGATE"
  vpc_id                    = module.vpc.vpc_id
  subnet_ids                = module.vpc.private_subnets
  ecs_load_balancers = [{ elb_name = ""
    container_name = local.abdm_docs_mcp_container_name
    container_port = 8080
  target_group_arn = module.abdm_docs_nlb.target_group_arns[0] }]
  tags                           = local.tags
  ignore_changes_task_definition = false
  network_mode                   = "awsvpc"
  exec_enabled                   = false

  # docs-mcp exits at startup when its configuration is wrong; a deployment that never gets healthy rolls back.
  health_check_grace_period_seconds  = 60
  circuit_breaker_deployment_enabled = true
  circuit_breaker_rollback_enabled   = true

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  desired_count                      = var.abdm_docs_mcp_desired_count
  task_memory                        = var.abdm_docs_mcp_task_memory
  task_cpu                           = var.abdm_docs_mcp_task_cpu

  container_port = 8080

  runtime_platform = [{ cpu_architecture : var.abdm_docs_mcp_cpu_architecture }]

  task_policy_arns_map = {
    bedrock = aws_iam_policy.abdm_docs_mcp_bedrock.arn
  }
}

resource "aws_security_group_rule" "abdm_docs_allow_nlb_mcp" {
  description              = "Allow the NLB (backend_alb security group) to reach docs-mcp"
  type                     = "ingress"
  security_group_id        = module.abdm_docs_mcp_service_task.service_security_group_id
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.nlb_sg.id
}

resource "aws_iam_policy" "abdm_docs_mcp_bedrock" {
  name        = "ohn-${var.environment}-abdm-docs-mcp-bedrock"
  path        = "/"
  description = "Bedrock invocation for docs-mcp in ${var.environment}."
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "InvokeBedrockModels",
        "Effect" : "Allow",
        "Action" : [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
        ],
        "Resource" : [
          "arn:aws:bedrock:*::foundation-model/*",
          "arn:aws:bedrock:*:${var.aws_account_id}:inference-profile/*",
        ]
      }
    ]
  })

  tags = local.tags
}

# Outputs
# ------------------------------------------------------------

output "abdm_docs_mcp_service_name" {
  description = "ECS service running docs-mcp"
  value       = module.abdm_docs_mcp_service_task.service_name
}
