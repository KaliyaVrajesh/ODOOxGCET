from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import User
from employees.models import EmployeeProfile
from attendance.models import AttendanceRecord
from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest
from profiles.models import ProfileDetail, ResumeDetail, BankDetail, SalaryStructure, Skill, Certification
from datetime import datetime


class Command(BaseCommand):
    help = 'Delete all data and create fresh test data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Deleting all data...'))
        
        # Delete all data
        with transaction.atomic():
            TimeOffRequest.objects.all().delete()
            TimeOffBalance.objects.all().delete()
            AttendanceRecord.objects.all().delete()
            Skill.objects.all().delete()
            Certification.objects.all().delete()
            SalaryStructure.objects.all().delete()
            BankDetail.objects.all().delete()
            ResumeDetail.objects.all().delete()
            ProfileDetail.objects.all().delete()
            EmployeeProfile.objects.all().delete()
            User.objects.all().delete()
            
            self.stdout.write(self.style.SUCCESS('All data deleted!'))
        
        self.stdout.write(self.style.WARNING('\nCreating fresh data...'))
        
        # Create time off types first
        self.stdout.write('Creating time off types...')
        timeoff_types_data = [
            {'code': 'PTO', 'name': 'Paid time off', 'default_annual_allocation_days': 24},
            {'code': 'SICK', 'name': 'Sick leave', 'default_annual_allocation_days': 7},
            {'code': 'UNPAID', 'name': 'Unpaid leaves', 'default_annual_allocation_days': 0},
        ]
        
        for data in timeoff_types_data:
            TimeOffType.objects.get_or_create(code=data['code'], defaults=data)
            self.stdout.write(f'  - Created: {data["name"]}')
        
        # Create users with profiles
        self.stdout.write('\nCreating users...')
        
        users_data = [
            {
                'email': 'admin@dayflow.com',
                'password': 'admin123',
                'full_name': 'Admin User',
                'phone': '+91-9876543210',
                'company_name': 'Dayflow Technologies',
                'role': 'ADMIN',
                'job_title': 'System Administrator',
                'department': 'IT'
            },
            {
                'email': 'hr@dayflow.com',
                'password': 'hr123',
                'full_name': 'HR Manager',
                'phone': '+91-9876543211',
                'company_name': 'Dayflow Technologies',
                'role': 'HR',
                'job_title': 'HR Manager',
                'department': 'Human Resources'
            },
            {
                'email': 'john.doe@dayflow.com',
                'password': 'employee123',
                'full_name': 'John Doe',
                'phone': '+91-9876543212',
                'company_name': 'Dayflow Technologies',
                'role': 'EMPLOYEE',
                'job_title': 'Software Engineer',
                'department': 'Engineering'
            },
            {
                'email': 'jane.smith@dayflow.com',
                'password': 'employee123',
                'full_name': 'Jane Smith',
                'phone': '+91-9876543213',
                'company_name': 'Dayflow Technologies',
                'role': 'EMPLOYEE',
                'job_title': 'Senior Developer',
                'department': 'Engineering'
            },
            {
                'email': 'mike.wilson@dayflow.com',
                'password': 'employee123',
                'full_name': 'Mike Wilson',
                'phone': '+91-9876543214',
                'company_name': 'Dayflow Technologies',
                'role': 'EMPLOYEE',
                'job_title': 'Product Manager',
                'department': 'Product'
            },
            {
                'email': 'sarah.jones@dayflow.com',
                'password': 'employee123',
                'full_name': 'Sarah Jones',
                'phone': '+91-9876543215',
                'company_name': 'Dayflow Technologies',
                'role': 'EMPLOYEE',
                'job_title': 'UI/UX Designer',
                'department': 'Design'
            },
            {
                'email': 'david.brown@dayflow.com',
                'password': 'employee123',
                'full_name': 'David Brown',
                'phone': '+91-9876543216',
                'company_name': 'Dayflow Technologies',
                'role': 'EMPLOYEE',
                'job_title': 'QA Engineer',
                'department': 'Quality Assurance'
            },
        ]
        
        current_year = datetime.now().year
        timeoff_types = TimeOffType.objects.filter(is_active=True)
        
        for user_data in users_data:
            email = user_data['email']
            password = user_data.pop('password')
            job_title = user_data.pop('job_title')
            department = user_data.pop('department')
            
            # Create user
            user = User.objects.create(**user_data)
            user.set_password(password)
            user.save()
            
            # Create employee profile
            EmployeeProfile.objects.create(
                user=user,
                job_title=job_title,
                department=department
            )
            
            # Create time off balances
            for timeoff_type in timeoff_types:
                TimeOffBalance.objects.create(
                    user=user,
                    timeoff_type=timeoff_type,
                    year=current_year,
                    allocated_days=timeoff_type.default_annual_allocation_days,
                    used_days=0
                )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'  ✓ {user.full_name} ({user.role}) - {user.login_id}'
                )
            )
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Fresh data created successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write('')
        self.stdout.write('Login Credentials:')
        self.stdout.write('')
        self.stdout.write('ADMIN:')
        self.stdout.write('  Email: admin@dayflow.com')
        self.stdout.write('  Password: admin123')
        self.stdout.write('')
        self.stdout.write('HR:')
        self.stdout.write('  Email: hr@dayflow.com')
        self.stdout.write('  Password: hr123')
        self.stdout.write('')
        self.stdout.write('EMPLOYEES (all use password: employee123):')
        self.stdout.write('  - john.doe@dayflow.com')
        self.stdout.write('  - jane.smith@dayflow.com')
        self.stdout.write('  - mike.wilson@dayflow.com')
        self.stdout.write('  - sarah.jones@dayflow.com')
        self.stdout.write('  - david.brown@dayflow.com')
        self.stdout.write('')
