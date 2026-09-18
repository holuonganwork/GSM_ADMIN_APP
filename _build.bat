@echo off
title Green SM Operations Portal - Build
echo ========================================================
echo   Green SM Operations Portal - Compiling Web
echo ========================================================
cd /d "%~dp0Frontend"
call npm run build
echo.
echo Build finished.
pause
