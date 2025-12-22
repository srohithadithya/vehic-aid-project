# security.tf: Defines Security Groups and necessary IAM roles

# Security Group for the PostgreSQL Database
resource "aws_security_group" "db_sg" {
  name        = "db-access-sg-${var.environment}"
  description = "Allow inbound traffic from application servers only"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "PostgreSQL access from Application servers"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    # Allow traffic only from the ECS Cluster/Application Security Group
    security_groups = [aws_security_group.app_sg.id] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for the Application Servers (ECS/EC2)
resource "aws_security_group" "app_sg" {
  name        = "app-server-sg-${var.environment}"
  description = "Allow inbound HTTP/S traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTPS from Internet"
    from_port   = 443
    to_port     = 443
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