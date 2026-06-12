# Build and start all containers
docker-compose up -d --build

# Wait for MySQL
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run migrations
docker exec taskflow_backend npm run db:migrate

Write-Host "TaskFlow is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost"
Write-Host "Backend API: http://localhost:5000/api/health"