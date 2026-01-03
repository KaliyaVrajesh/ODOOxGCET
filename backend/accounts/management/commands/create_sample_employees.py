from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from employees.models import EmployeeProfile
from attendance.models import AttendanceRecord

class Command(BaseCommand):
    help = 'Create sample employees and attendance records for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample employees...')
        
        # Sample employee data
        employees_data = [
            {
                'company_name': 'Odoo India',
                'full_name': 'Priya Sharma',
                'email': 'priya.sharma@odoo.com',
                'phone': '+91-9876543210',
                'password': 'Employee123',
                'job_title': 'Software Engineer',
                'department': 'Engineering',
                'profile_picture': 'https://i.pravatar.cc/150?img=1'
            },
            {
                'company_name': 'Odoo India',
                'full_name': 'Rahul Kumar',
                'email': 'rahul.kumar@odoo.com',
                'phone': '+91-9876543211',
                'password': 'Employee123',
                'job_title': 'Senior Developer',
                'department': 'Engineering',
                'profile_picture': 'https://i.pravatar.cc/150?img=2'
            },
            {
                'company_name': 'Odoo India',
                'full_name': 'Anita Desai',
                'email': 'anita.desai@odoo.com',
                'phone': '+91-9876543212',
                'password': 'Employee123',
                'job_title': 'HR Manager',
                'department': 'Human Resources',
                'profile_picture': 'https://i.pravatar.cc/150?img=3'
            },
            {
                'company_name': 'Odoo India',
                'full_name': 'Vikram Singh',
                'email': 'vikram.singh@odoo.com',
                'phone': '+91-9876543213',
                'password': 'Employee123',
                'job_title': 'Product Manager',
                'department': 'Product',
                'profile_picture': 'https://i.pravatar.cc/150?img=4'
            },
            {
                'company_name': 'Odoo India',
                'full_name': 'Sneha Patel',
                'email': 'sneha.patel@odoo.com',
                'phone': '+91-9876543214',
                'password': 'Employee123',
                'job_title': 'UI/UX Designer',
                'department': 'Design',
                'profile_picture': 'https://i.pravatar.cc/150?img=5'
            },
        ]
        
        created_count = 0
        for emp_data in employees_data:
            # Check if user already exists
            if User.objects.filter(email=emp_data['email']).exists():
                self.stdout.write(self.style.WARNING(f"User {emp_data['email']} already exists, skipping..."))
                continue
            
            # Create user
            user = User.objects.create_user(
                email=emp_data['email'],
                password=emp_data['password'],
                company_name=emp_data['company_name'],
                full_name=emp_data['full_name'],
                phone=emp_data['phone'],
                role='EMPLOYEE',
                is_staff=False,
                is_active=True
            )
            
            # Create employee profile
            EmployeeProfile.objects.create(
                user=user,
                profile_picture=emp_data['profile_picture'],
                job_title=emp_data['job_title'],
                department=emp_data['department']
            )
            
            # Create a sample attendance record for today (some checked in, some not)
            if created_count % 2 == 0:  # Every other employee is checked in
                AttendanceRecord.objects.create(
                    user=user,
                    check_in_time=timezone.now().replace(hour=9, minute=0, second=0),
                    status='PRESENT'
                )
            
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created employee: {user.full_name} ({user.login_id})"))
        
        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} sample employees!'))
        self.stdout.write(self.style.SUCCESS('Default password for all employees: Employee123'))
