@echo off
title Prerequisites Check
color 0B

echo.
echo  =========================================================
echo  ║                                                       ║
echo  ║     BIOMETRIC VOTING SYSTEM - PREREQUISITES CHECK   ║
echo  ║                                                       ║
echo  =========================================================
echo.

set "pass=0"
set "fail=0"

REM Check Python
echo [1/4] Checking Python...
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python --version
    echo      ✓ Python is installed
    set /a pass+=1
) else (
    echo      ✗ Python is NOT installed
    echo      Download from: https://www.python.org/downloads/
    set /a fail+=1
)

echo.
REM Check Node.js
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    node --version
    echo      ✓ Node.js is installed
    set /a pass+=1
) else (
    echo      ✗ Node.js is NOT installed
    echo      Download from: https://nodejs.org/
    set /a fail+=1
)

echo.
REM Check npm
echo [3/4] Checking npm...
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo      ✓ npm is installed
    set /a pass+=1
) else (
    echo      ✗ npm is NOT installed
    echo      npm comes with Node.js
    set /a fail+=1
)

echo.
REM Check MongoDB
echo [4/4] Checking MongoDB...
mongod --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ✓ MongoDB is installed
    set /a pass+=1
    
    REM Check if MongoDB is running
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo      ✓ MongoDB is running
    ) else (
        echo      ⚠ MongoDB is installed but NOT running
        echo      Start it with: mongod
    )
) else (
    echo      ✗ MongoDB is NOT installed
    echo      Download from: https://www.mongodb.com/try/download/community
    set /a fail+=1
)

echo.
echo  =========================================================
echo.
echo  Results: %pass% passed, %fail% failed
echo.

if %fail% GTR 0 (
    echo  ⚠ Some prerequisites are missing!
    echo  Please install the missing software and run this check again.
    echo.
    echo  Installation Links:
    echo  - Python: https://www.python.org/downloads/
    echo  - Node.js: https://nodejs.org/
    echo  - MongoDB: https://www.mongodb.com/try/download/community
) else (
    echo  ✓ All prerequisites are installed!
    echo  You can now proceed with project setup.
    echo.
    echo  Next Steps:
    echo  1. Run: cd backend && setup.bat
    echo  2. Run: cd frontend && setup.bat
    echo  3. Start MongoDB: mongod
    echo  4. Run: START_ALL.bat
)

echo.
echo  =========================================================
echo.
pause
