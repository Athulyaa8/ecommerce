@echo off
title Launching NovaStore Ecommerce Application
echo Starting Backend and Frontend...

start "NovaStore Backend (Port 8081)" "%~dp0run-backend.bat"
start "NovaStore Frontend (Port 5173)" "%~dp0run-frontend.bat"

echo Waiting for servers to initialize...
timeout /t 6 /nobreak >nul

echo Opening NovaStore in your browser...
start http://localhost:5173

echo Done! Leave the console windows open while testing the application.
