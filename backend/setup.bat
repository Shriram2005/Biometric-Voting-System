@echo off
echo ========================================
echo Biometric Voting System - Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo Virtual environment already exists
)

echo.
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/5] Upgrading pip...
python -m pip install --upgrade pip

echo.
echo [4/5] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [5/5] Setting up environment file...
if not exist ".env" (
    copy .env.example .env
    echo Environment file created. Please update .env with your configuration.
) else (
    echo Environment file already exists.
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo IMPORTANT: Make sure MongoDB is running before starting the server.
echo To start MongoDB, run: mongod
echo.
echo To start the backend server, run: start_server.bat
echo.
pause
