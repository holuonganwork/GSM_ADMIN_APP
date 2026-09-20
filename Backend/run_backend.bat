@echo off
title Green SM Operations Portal - Backend Spring Boot
echo ========================================================
echo   Green SM Operations Portal - Backend (Java Spring Boot)
echo   Port: 8000 ^| Context Path: /api
echo   Swagger UI: http://localhost:8000/api/swagger-ui.html
echo ========================================================

if not defined JAVA_HOME (
    if exist "C:\Users\anho2\.jdks\corretto-17.0.13" (
        set "JAVA_HOME=C:\Users\anho2\.jdks\corretto-17.0.13"
    )
)

cd /d "%~dp0"
call .\gradlew.bat bootRun
pause
