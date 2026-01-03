@echo off
echo ========================================
echo Dayflow Database - Sample Data Viewer
echo ========================================
echo.

cd backend
call venv\Scripts\activate

echo Counting records in database...
echo.

python manage.py shell -c "from accounts.models import User; from profiles.models import *; from timeoff.models import *; from attendance.models import *; from employees.models import *; print('=== DATABASE SUMMARY ==='); print(f'Users: {User.objects.count()}'); print(f'Employee Profiles: {EmployeeProfile.objects.count()}'); print(f'Profile Details: {ProfileDetail.objects.count()}'); print(f'Resume Details: {ResumeDetail.objects.count()}'); print(f'Bank Details: {BankDetail.objects.count()}'); print(f'Salary Structures: {SalaryStructure.objects.count()}'); print(f'Skills: {Skill.objects.count()}'); print(f'Certifications: {Certification.objects.count()}'); print(f'Attendance Records: {AttendanceRecord.objects.count()}'); print(f'Time Off Types: {TimeOffType.objects.count()}'); print(f'Time Off Balances: {TimeOffBalance.objects.count()}'); print(f'Time Off Requests: {TimeOffRequest.objects.count()}'); print(); print('=== SAMPLE USER DATA ==='); u = User.objects.get(email='john.doe@dayflow.com'); print(f'User: {u.full_name} ({u.login_id})'); print(f'Email: {u.email}'); print(f'Role: {u.role}'); print(f'Job: {u.profile_detail.job_position} - {u.profile_detail.department}'); print(f'Resume: {u.resume_detail.gender}, DOB: {u.resume_detail.date_of_birth}'); print(f'Bank: {u.bank_detail.bank_name} - Acc: {u.bank_detail.bank_account_number}'); print(f'Salary: Basic Rs.{u.salary_structure.basic_salary}, Net Rs.{u.salary_structure.net_salary:.2f}/month'); print(f'Skills: {[s.name for s in u.skills.all()[:3]]}...'); print(f'Certifications: {u.certifications.count()} cert(s)'); print(f'Attendance Records: {u.attendance_records.count()}'); print(f'Time Off Requests: {u.timeoff_requests.count()}'); print(); print('=== ALL USERS ==='); for user in User.objects.all(): print(f'{user.full_name:20} | {user.email:30} | {user.role:10} | {user.login_id}')"

echo.
echo ========================================
echo View complete documentation in:
echo backend/DATABASE_DEMO_DATA.md
echo ========================================
pause
