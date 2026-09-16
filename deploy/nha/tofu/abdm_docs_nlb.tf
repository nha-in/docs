# Internal, like backend_alb: the VPC has no internet gateway and traffic arrives over the transit
# gateway. It shares backend_alb's security group (aws_security_group.nlb_sg: port 80 in from
# anywhere, all egress), so nothing new is opened; docs-mcp tasks admit 8080 from that group only.
module "abdm_docs_nlb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "8.5.0"

  name = "ohn-${var.environment}-abdm-docs"

  load_balancer_type = "network"

  vpc_id                           = module.vpc.vpc_id
  subnets                          = module.vpc.private_subnets
  security_groups                  = [aws_security_group.nlb_sg.id]
  internal                         = true
  enable_cross_zone_load_balancing = true

  target_groups = [
    {
      name_prefix      = "mcp"
      backend_protocol = "TCP"
      backend_port     = 8080
      target_type      = "ip"
      # Time for an in-flight /api/chat stream to finish when a task is replaced.
      deregistration_delay = 60
      health_check = {
        enabled             = true
        interval            = 15
        path                = "/healthz"
        port                = "traffic-port"
        healthy_threshold   = 2
        unhealthy_threshold = 2
        timeout             = 10
        protocol            = "HTTP"
        matcher             = "200"
      }
    }
  ]

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "TCP"
      target_group_index = 0
    }
  ]

  tags = local.tags
}

# Outputs
# ------------------------------------------------------------

output "abdm_docs_nlb_dns_name" {
  description = "Internal DNS name of the abdm-docs NLB"
  value       = module.abdm_docs_nlb.lb_dns_name
}
