@echo off
echo ========================================
echo Quick Backend Fix - Database Setup
echo ========================================
echo.

cd backend

echo Step 1: Activating virtual environment...
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo Step 2: Installing dependencies...
pip install -q -r requirements.txt
echo ✓ Dependencies installed
echo.

echo Step 3: Running migrations...
python manage.py makemigrations
python manage.py migrate
if errorlevel 1 (
    echo.
    echo ⚠️  Migration failed! 
    echo.
    echo Please make sure:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'dayflow_db' exists
    echo 3. Edit backend\.env with correct DB_PASSWORD
    echo.
    echo To create database, run:
    echo   psql -U postgres
    echo   CREATE DATABASE dayflow_db;
    echo   \q
    echo.
    pause
    exit /b 1
)
echo ✓ Migrations completed
echo.

echo Step 4: Creating sample data...
python manage.py create_sample_employees
python manage.py init_timeoff_types
echo ✓ Sample data created
echo.

echo ========================================
echo ✓ Backend Fixed!
echo ========================================
echo.
echo Starting server...
python manage.py runserver
