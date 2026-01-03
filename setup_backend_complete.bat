@echo off
echo ========================================
echo Dayflow HRMS - Complete Backend Setup
echo ========================================
echo.

cd backend

echo [1/8] Creating virtual environment...
if not exist venv (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python 3.10+ is installed
        pause
        exit /b 1
    )
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)
echo.

echo [2/8] Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo [3/8] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [4/8] Checking for .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env file with your database credentials!
    echo    - Set DB_PASSWORD to your PostgreSQL password
    echo    - Set SECRET_KEY to a secure random string
    echo.
    echo Press any key after you've edited the .env file...
    pause
) else (
    echo ✓ .env file already exists
)
echo.

echo [5/8] Creating migrations...
python manage.py makemigrations
if errorlevel 1 (
    echo.
    echo ERROR: Failed to create migrations
    echo.
    pause
    exit /b 1
)
echo ✓ Migrations created
echo.

echo [6/8] Running database migrations...
python manage.py migrate
if errorlevel 1 (
    echo.
    echo ERROR: Database migration failed
    echo.
    echo Make sure:
    echo 1. PostgreSQL is installed and running
    echo 2. Database 'dayflow_db' exists
    echo 3. .env file has correct database credentials
    echo.
    echo To create the database, run:
    echo   psql -U postgres
    echo   CREATE DATABASE dayflow_db;
    echo   \q
    echo.
    pause
    exit /b 1
)
echo ✓ Database migrations completed
echo.

echo [7/8] Creating superuser (optional)...
set /p create_super="Create Django superuser for admin panel? (y/n): "
if /i "%create_super%"=="y" (
    python manage.py createsuperuser
    echo ✓ Superuser created
) else (
    echo ⊘ Skipped superuser creation
)
echo.

echo [8/8] Creating sample data (optional)...
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
echo Press any key to start the server now...
pause

echo.
echo Starting Django development server...
python manage.py runserver
