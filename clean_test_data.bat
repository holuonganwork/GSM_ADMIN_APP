@echo off
setlocal

echo ============================================================
echo   GSM Compliance Desk - Bo Cong Cu Don Dep Du Lieu Test
echo ============================================================

set PYTHON_CMD=
if exist "%~dp0..\..\MAIN AGENT\AI-LLM-Core\.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0..\..\MAIN AGENT\AI-LLM-Core\.venv\Scripts\python.exe"
) else if exist "%~dp0..\..\ML Anomaly Detection\SimulatorGSM-HaNoi\.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%~dp0..\..\ML Anomaly Detection\SimulatorGSM-HaNoi\.venv\Scripts\python.exe"
) else (
    set "PYTHON_CMD=python"
)

"%PYTHON_CMD%" "%~dp0clean_test_data.py"

if %ERRORLEVEL% EQU 0 (
    echo [THANH CONG] Da don dep sach se du lieu test!
) else (
    echo [THAT BAI] Co loi xay ra khi don dep du lieu.
)

endlocal
