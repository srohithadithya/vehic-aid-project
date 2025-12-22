# main.tf: Core AWS Infrastructure for Vehic-Aid

# Provider Configuration (Assumes AWS credentials are set up)
provider "aws" {
  region = var.aws_region
}

# --- 1. Networking (VPC, Subnets, Internet Gateway) ---
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.1.0"
  
  name = "${var.environment}-vehicaid-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["${var.aws_region}a", "${var.aws_region}b"]
  
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.11.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = true
}

# --- 2. Database (PostgreSQL RDS) ---
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14.5"
  instance_class       = "db.t3.micro"
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  skip_final_snapshot  = true
  
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name
}

resource "aws_db_subnet_group" "default" {
  name       = "${var.environment}-vehicaid-db-sng"
  subnet_ids = module.vpc.private_subnets
}

# --- 3. Compute (EC2/ECS for Django API & Celery) ---
resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-vehicaid-cluster"
}

# --- 4. IoT Core (For Device Communication) ---
resource "aws_iot_topic_rule" "data_ingest_rule" {
  name        = "${var.environment}_data_ingest_rule"
  description = "Forwards IoT button presses to the Django API endpoint."
  enabled     = true

  sql = "SELECT * FROM 'vehicaid/data/in'"
  sql_version = "2016-03-23"

  http {
    url = var.api_ingestion_url # e.g., https://api.vehicaid.com/api/v1/iot/data-ingest/
    confirmation_url = var.api_ingestion_url
    name = "django_ingest"
  }
}