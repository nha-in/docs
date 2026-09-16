# force_delete lets `tofu destroy` remove the repository with images inside.
resource "aws_ecr_repository" "mcp" {
  name                 = "${var.name}-mcp"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}
