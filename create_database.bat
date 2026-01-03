@echo off
echo ========================================
echo Creating PostgreSQL Database
echo ========================================
echo.

echo Creating database 'dayflow_db'...
echo.

psql -U postgres -c "CREATE DATABASE dayflow_db;"

if errorlevel 1 (
    echo.
    echo ⚠️  Failed to create database automatically.
    echo.
    echo Please create it manually:
    echo   1. Open Command Prompt or PowerShell
    echo   2. Run: psql -U postgres
    echo   3. Enter your PostgreSQL password
    echo   4. Run: CREATE DATABASE dayflow_db;
    echo   5. Run: \q
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Database 'dayflow_db' created successfully!
echo.
echo Now you can run:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py migrate
echo.
pause
