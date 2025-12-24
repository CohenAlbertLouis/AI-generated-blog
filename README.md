# 🤖 AI-generated blog: AI-Powered Daily News Generator

## 💡 Overview
This project is a full-stack, containerized application designed to demonstrate automated content generation and deployment.The application features:A Backend Service that runs a scheduled cron job (once per day).The cron job uses the Hugging Face Inference API to generate a new, topical blog article daily.The generated article is persisted to a local JSON file (articles.json) acting as a simple database.A Frontend Service that displays the generated articles via an Nginx proxy.

## ⚙️ Tech Stack
### Docker Compose: Orchestration of all services in a single environment.
### Frontend: React, served by Nginx reverse proxy.
### Backend: Node.js (Express), node-cron, axios. Runs the daily scheduling job and communicates with the AI
### Services: LLMLlama 3.1 8B via Hugging Face API generates the daily article content.

## 🚀 Quick Start (Local Development)
Prerequisites: Docker Desktop installed (includes Docker and Docker Compose).A valid Hugging Face Access Token with granted access to the Llama 3.1 model.
1. Configure the Token. Ensure your backend/jobs/generateArticle.js file is updated with your valid, approved Hugging Face token. This token allows the backend to successfully call the Inference API:JavaScript// backend/jobs/generateArticle.js
const HF_ACCESS_TOKEN = "hf_YOUR_APPROVED_TOKEN_HERE"; 
2. Build and Run the StackRun the following command from the project root directory. The --build flag ensures your latest code changes (including the token and cron schedule) are included in the container images.Bashdocker compose up --build -d
3. Access the Application. The frontend application is mapped to port 8080 on your host machine and will be accessible at: http://localhost:8080
4. Verify Backend Job. Check the backend container logs to confirm the daily generation job is active: (bash) docker logs backend -f
The job is now scheduled to run once per day (Cron expression: 0 0 * * *).
