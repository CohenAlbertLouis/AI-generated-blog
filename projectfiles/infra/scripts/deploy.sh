#!/bin/bash

# --- Configuration (UPDATE THESE VALUES ON EC2 OR BEFORE COMMIT) ---
REGION="us-east-1" 
ECR_REPO_BACKEND="<YOUR_ACCOUNT_ID>.dkr.ecr.${REGION}.amazonaws.com/tech-test-backend"
ECR_REPO_FRONTEND="<YOUR_ACCOUNT_ID>.dkr.ecr.${REGION}.amazonaws.com/tech-test-frontend"

# --- Execution ---

echo "Starting deployment script on EC2 instance..."

# 1. Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin ${ECR_REPO_BACKEND%%/*}

# 2. Stop and remove old containers (if they exist)
echo "Stopping and removing old containers..."
docker stop frontend backend || true
docker rm frontend backend || true

# 3. Pull latest images
echo "Pulling latest Docker images..."
docker pull ${ECR_REPO_BACKEND}:latest
docker pull ${ECR_REPO_FRONTEND}:latest

# 4. Create a shared network
echo "Creating bridge network 'tech-test-net'..."
docker network create tech-test-net || true

# 5. Run Backend Container
echo "Running backend container..."
mkdir -p /home/ec2-user/tech-test-data
docker run -d \
    --name backend \
    --network tech-test-net \
    -p 3001:3001 \
    -v /home/ec2-user/tech-test-data/articles.json:/app/articles.json \
    ${ECR_REPO_BACKEND}:latest

# 6. Run Frontend Container
echo "Running frontend container..."
docker run -d \
    --name frontend \
    --network tech-test-net \
    -p 80:80 \
    --restart always \
    ${ECR_REPO_FRONTEND}:latest

echo "Deployment complete. Application should be available on port 80."