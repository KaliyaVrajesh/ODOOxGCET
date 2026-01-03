@echo off
echo ========================================
echo Dayflow HRMS - Frontend Setup Script
echo ========================================
echo.

cd frontend

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Make sure Node.js 18+ is installed
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [2/3] Creating .env file...
if not exist .env (
    echo VITE_API_URL=http://localhost:8000/api > .env
    echo ✓ .env file created
) else (
    echo ✓ .env file already exists
)
echo.

echo [3/3] Verifying setup...
if exist node_modules (
    echo ✓ node_modules folder exists
) else (
    echo ⚠️  Warning: node_modules folder not found
)

if exist .env (
    echo ✓ .env file exists
) else (
    echo ⚠️  Warning: .env file not found
)
echo.

echo ========================================
echo ✓ Frontend Setup Complete!
echo ========================================
echo.
echo To start the frontend server:
echo   1. cd frontend
echo   2. npm run dev
echo.
echo Frontend will run on: http://localhost:5173
echo.
echo Make sure backend is running on http://localhost:8000
echo.
pause
