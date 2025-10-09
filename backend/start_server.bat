@echo off
echo ========================================
echo Starting Biometric Voting System Backend
echo ========================================
echo.

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found. Creating from .env.example...
    copy .env.example .env
)

echo Starting Flask server...
echo.
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
