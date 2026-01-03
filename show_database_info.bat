@echo off
echo ========================================
echo Dayflow Database Information
echo ========================================
echo.

cd backend
call venv\Scripts\activate
python manage.py show_demo_data

echo.
echo ========================================
echo Commands:
echo   python manage.py reset_all_data  - Reset and recreate demo data
echo   python manage.py show_demo_data  - Show this summary
echo ========================================
echo.
pause
