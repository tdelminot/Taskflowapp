#!/bin/bash

# Build and start all containers
docker-compose up -d --build

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Run migrations
docker exec taskflow_backend npm run db:migrate

echo "TaskFlow is running!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:5000/api/health"