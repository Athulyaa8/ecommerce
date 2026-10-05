@echo off
title Ecommerce Backend (Port 8081)
cd /d "c:\Users\prave\OneDrive\Desktop\ecommerce"
echo ========================================================
echo Starting Spring Boot Backend on http://localhost:8081
echo ========================================================
.\mvnw.cmd spring-boot:run
pause
