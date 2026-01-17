# scripts/ci_cd/deploy_staging.sh
#!/bin/bash
# Script to build and deploy the backend application to the Staging environment on AWS ECS/EC2.

# --- Configuration ---
ENV="staging"
AWS_REGION="ap-south-1"
ECR_REPO="vehicaid-backend-${ENV}"
# Use the short commit hash as the image tag
IMAGE_TAG=$(git rev-parse --short HEAD) 

# Exit immediately if any command fails
set -e

echo "--- 1. Starting Staging Deployment for Tag: ${IMAGE_TAG} ---"

# 1. Run Automated Tests
# The CI environment should have all test dependencies installed via requirements.txt
echo "Running automated backend tests..."
python manage.py test --settings=vehic_aid_backend.settings.testing

if [ $? -ne 0 ]; then
    echo "Tests FAILED. Aborting deployment."
    exit 1
fi
echo "Tests Passed."

# 2. Build Docker Image (Assumes Dockerfile is in the root backend directory)
echo "Building Docker image..."
docker build -t ${ECR_REPO}:${IMAGE_TAG} ../backend/

# 3. Authenticate Docker to AWS ECR (Credentials usually passed via CI Secrets)
echo "Authenticating with AWS ECR..."
# Placeholder command: use AWS CLI to get login credentials
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# 4. Tag and Push Image to ECR
echo "Pushing image to ECR..."
docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# 5. Update ECS Service (Triggers the blue/green or rolling deployment)
echo "Updating ECS service definition..."
aws ecs update-service \
    --cluster ${ENV}-vehicaid-cluster \
    --service ${ENV}-vehicaid-api-service \
    --task-definition ${ENV}-vehicaid-task-def:${IMAGE_TAG} \
    --force-new-deployment

echo "--- Deployment to Staging Complete ---"