# variables.tf: Inputs for Terraform Deployment

variable "environment" {
  description = "The deployment environment (staging or production)"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "ap-south-1" # Targeting Mumbai, India
}

variable "db_name" {
  description = "Name for the PostgreSQL database"
  type        = string
  default     = "vehicaid_prod_db"
}

variable "db_username" {
  description = "Database master username"
  type        = string
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true # Mark as sensitive for security
}

variable "api_ingestion_url" {
  description = "The public URL for the Django IoT data ingestion endpoint"
  type        = string
}