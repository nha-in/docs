resource "aws_lb" "this" {
  name                             = var.name
  load_balancer_type               = "network"
  internal                         = false
  subnets                          = data.aws_subnets.default.ids
  security_groups                  = [aws_security_group.nlb.id]
  enable_cross_zone_load_balancing = true
}

resource "aws_lb_target_group" "mcp" {
  name                 = "${var.name}-mcp"
  port                 = 8080
  protocol             = "TCP"
  target_type          = "ip"
  vpc_id               = data.aws_vpc.default.id
  deregistration_delay = 30

  health_check {
    protocol            = "HTTP"
    path                = "/healthz"
    matcher             = "200"
    interval            = 15
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Plain TCP unless var.mcp_certificate_arn names a certificate, in which case TLS ends here and the
# container still serves plain HTTP on 8080. No certificate is ever created: staging reuses the
# wildcard DevOps issues, and the platform team owns TLS.
resource "aws_lb_listener" "mcp" {
  load_balancer_arn = aws_lb.this.arn
  port              = local.mcp_port
  protocol          = local.mcp_tls ? "TLS" : "TCP"
  certificate_arn   = local.mcp_tls ? var.mcp_certificate_arn : null
  ssl_policy        = local.mcp_tls ? "ELBSecurityPolicy-TLS13-1-2-2021-06" : null

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.mcp.arn
  }
}
