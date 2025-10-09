@echo off
title Biometric Voting System - Quick Start
color 0A

echo.
echo  =========================================================
echo  ║                                                       ║
echo  ║     BIOMETRIC FACE VOTING SYSTEM - QUICK START      ║
echo  ║                                                       ║
echo  =========================================================
echo.
echo  This script will help you start all services.
echo.

REM Check if MongoDB is running
echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo      MongoDB is running ✓
) else (
    echo      MongoDB is NOT running!
    echo      Please start MongoDB first by running: mongod
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Backend Server...
echo      Opening backend in new window...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Frontend Server...
echo      Opening frontend in new window...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo  =========================================================
echo  ║                 ALL SERVICES STARTED                  ║
echo  =========================================================
echo.
echo  ✓ MongoDB        : Running
echo  ✓ Backend        : http://localhost:5000
echo  ✓ Frontend       : http://localhost:3000
echo.
echo  The application will open in your browser shortly.
echo.
echo  Admin Login:
echo  - URL: http://localhost:3000/admin
echo  - Username: admin
echo  - Password: admin123
echo.
echo  Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo  Application is now running!
echo  Close this window when you're done (servers will keep running).
echo.
pause
