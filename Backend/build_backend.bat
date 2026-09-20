@echo off
title Green SM Operations Portal - Build Backend
echo ========================================================
echo   Green SM Operations Portal - Building Backend JAR
echo ========================================================

if not defined JAVA_HOME (
    if exist "C:\Users\anho2\.jdks\corretto-17.0.13" (
        set "JAVA_HOME=C:\Users\anho2\.jdks\corretto-17.0.13"
    )
)

cd /d "%~dp0"
call .\gradlew.bat clean build -x test
echo.
echo Build complete. Output JAR is in build\libs\
pause
