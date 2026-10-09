@echo off
title Green SM Operations Portal - Backend Spring Boot
echo ========================================================
echo   Green SM Operations Portal - Backend (Java Spring Boot)
echo   Port: 8000 ^| Context Path: /api
echo   Swagger UI: http://localhost:8000/api/swagger-ui.html
echo ========================================================

if not defined JAVA_HOME (
    if exist "C:\Users\anhl145\.jdks\jbr-21.0.11" (
        set "JAVA_HOME=C:\Users\anhl145\.jdks\jbr-21.0.11"
    ) else if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\jbr" (
        set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\jbr"
    ) else if exist "C:\Users\anho2\.jdks\corretto-17.0.13" (
        set "JAVA_HOME=C:\Users\anho2\.jdks\corretto-17.0.13"
    )
)

cd /d "%~dp0"
if exist "build\libs\gsm-compliance-backend-1.0.0.jar" (
    echo Starting from compiled JAR...
    "%JAVA_HOME%\bin\java.exe" -jar build\libs\gsm-compliance-backend-1.0.0.jar
) else (
    call .\gradlew.bat bootRun
)
pause
