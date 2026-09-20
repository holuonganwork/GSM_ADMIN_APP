@echo off
title Green SM Operations Portal - Backend Spring Boot
echo ========================================================
echo   Green SM Operations Portal - Backend (Java Spring Boot)
echo   Port: 8000 ^| Context Path: /api
echo   Swagger UI: http://localhost:8000/api/swagger-ui.html
echo ========================================================

cd /d "%~dp0Backend"
call run_backend.bat
