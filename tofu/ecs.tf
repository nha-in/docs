resource "aws_ecs_cluster" "this" {
  name = var.name
}

resource "aws_cloudwatch_log_group" "mcp" {
  name              = "/ecs/${var.name}/mcp"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "mcp" {
  family                   = "${var.name}-mcp"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.mcp_task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([{
    name         = "mcp"
    image        = "${aws_ecr_repository.mcp.repository_url}:${var.image_tag}"
    essential    = true
    portMappings = [{ containerPort = 8080, protocol = "tcp" }]

    # CHAT_MODEL stays unset: chat needs Claude, which Bedrock in ap-south-2 does not offer on demand.
    environment = [
      { name = "EMBED_PROVIDER", value = "bedrock" },
      { name = "AWS_REGION", value = var.region },
      # The site calls /api/search from the reader's browser, so its origin must be allowed.
      { name = "ALLOW_ORIGIN", value = local.site_url },
      { name = "MCP_URL", value = local.mcp_url },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.mcp.name
        awslogs-region        = var.region
        awslogs-stream-prefix = "mcp"
      }
    }
  }])
}

# Until deploy.sh pushes the first image, tasks fail to pull and ECS keeps retrying. That is expected.
resource "aws_ecs_service" "mcp" {
  name                              = "${var.name}-mcp"
  cluster                           = aws_ecs_cluster.this.id
  task_definition                   = aws_ecs_task_definition.mcp.arn
  desired_count                     = var.desired_count
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.mcp.arn
    container_name   = "mcp"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.mcp]
}
