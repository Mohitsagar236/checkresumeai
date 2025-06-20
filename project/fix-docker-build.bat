@echo off
REM Fix Docker build error script for Windows

echo Starting Docker build fix...

REM Stop and remove any running containers
echo Cleaning up any running containers...
docker ps -aq | foreach { docker stop $_ }
docker ps -aq | foreach { docker rm $_ }

REM Remove old images
echo Removing old images...
docker images -q checkresumeai | foreach { docker rmi $_ -f }

REM Clean Docker cache
echo Cleaning Docker cache...
docker builder prune -f

REM Replace old Dockerfile with new one
echo Updating Dockerfile...
move /Y Dockerfile Dockerfile.old
move /Y Dockerfile.new Dockerfile

REM Build new image
echo Building new Docker image...
docker build -t checkresumeai:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Build successful! You can now run your application with:
    echo docker run -p 5000:5000 checkresumeai:latest
) else (
    echo.
    echo Build failed. Please check the error messages above.
    echo For this project, we recommend using Nixpacks with Railway instead of Docker.
    echo See the RAILWAY_NIXPACKS_DEPLOYMENT_READY.md file for instructions.
)
