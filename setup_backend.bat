@echo off
echo ========================================
echo Dayflow HRMS - Backend Setup Script
echo ========================================
echo.

cd backend

echo [1/6] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    echo Make sure Python 3.10+ is installed
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo [3/6] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [4/6] Checking for .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env file with your database credentials!
    echo    - Set DB_PASSWORD to your PostgreSQL password
    echo    - Set SECRET_KEY to a secure random string
    echo.
    pause
) else (
    echo ✓ .env file already exists
)
echo.

echo [5/6] Running database migrations...
python manage.py migrate
if errorlevel 1 (
    echo.
    echo ERROR: Database migration failed
    echo.
    echo Make sure:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'dayflow_db' exists (run: CREATE DATABASE dayflow_db;)
    echo 3. .env file has correct database credentials
    echo.
    pause
    exit /b 1
)
echo ✓ Database migrations completed
echo.

echo [6/6] Creating sample data (optional)...
set /p create_samples="Create sample employees and time off types? (y/n): "
if /i "%create_samples%"=="y" (
    python manage.py create_sample_employees
    python manage.py init_timeoff_types
    echo ✓ Sample data created
) else (
    echo ⊘ Skipped sample data creation
)
echo.

echo ========================================
echo ✓ Backend Setup Complete!
echo ========================================
echo.
echo To start the backend server:
echo   1. cd backend
echo   2. venv\Scripts\activate
echo   3. python manage.py runserver
echo.
echo Backend will run on: http://localhost:8000
echo.
pause
