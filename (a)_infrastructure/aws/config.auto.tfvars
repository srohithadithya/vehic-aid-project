# config.auto.tfvars: File used to pass sensitive variables to Terraform

# --- Environment Settings ---
environment = "staging"  # Change to "production" for the live environment
aws_region  = "ap-south-1" 

# --- Database Credentials (Sensitive) ---
db_username = "vehicaid_db_user"
db_password = "SUPER_SECRET_DB_PASSWORD_PROD_OR_STAGING"

# --- API Endpoints ---
# This URL is the public endpoint of the API Load Balancer, used by IoT Core to route data.
api_ingestion_url = "https://api-staging.vehicaid.in/api/v1/iot/data-ingest/"