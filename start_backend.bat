@echo off
echo ========================================
echo Starting Dayflow HRMS Backend Server
echo ========================================
echo.

cd backend
call venv\Scripts\activate.bat
python manage.py runserver
