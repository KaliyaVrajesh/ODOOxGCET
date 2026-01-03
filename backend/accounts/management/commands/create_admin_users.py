from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import User
from employees.models import EmployeeProfile
from timeoff.models import TimeOffType, TimeOffBalance
from datetime import datetime


class Command(BaseCommand):
    help = 'Create admin test users with time off balances'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating admin users...')
        
        admins_data = [
            {
                'company_name': 'Dayflow Technologies',
                'full_name': 'Admin User',
                'email': 'admin@dayflow.com',
                'phone': '+91-9876543210',
                'password': 'admin123',
                'role': 'ADMIN',
                'job_title': 'System Administrator',
                'department': 'IT'
            },
            {
                'company_name': 'Dayflow Technologies',
                'full_name': 'HR Manager',
                'email': 'hr@dayflow.com',
                'phone': '+91-9876543211',
                'password': 'hr123',
                'role': 'HR',
                'job_title': 'HR Manager',
                'department': 'Human Resources'
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for admin_data in admins_data:
            email = admin_data['email']
            job_title = admin_data.pop('job_title')
            department = admin_data.pop('department')
            
            try:
                with transaction.atomic():
                    # Check if user exists
                    user, created = User.objects.get_or_create(
                        email=email,
                        defaults=admin_data
                    )
                    
                    if created:
                        user.set_password(admin_data['password'])
                        user.save()
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Created admin: {user.full_name} ({user.login_id})'
                            )
                        )
                        created_count += 1
                    else:
                        # Update existing user
                        for key, value in admin_data.items():
                            if key != 'password':
                                setattr(user, key, value)
                        user.set_password(admin_data['password'])
                        user.save()
                        self.stdout.write(
                            self.style.WARNING(
                                f'Updated existing admin: {user.full_name} ({user.login_id})'
                            )
                        )
                        updated_count += 1
                    
                    # Create or update employee profile
                    profile, profile_created = EmployeeProfile.objects.get_or_create(
                        user=user,
                        defaults={
                            'job_title': job_title,
                            'department': department
                        }
                    )
                    
                    if not profile_created:
                        profile.job_title = job_title
                        profile.department = department
                        profile.save()
                        self.stdout.write(f'  - Updated employee profile')
                    else:
                        self.stdout.write(f'  - Created employee profile')
                    
                    # Create time off balances for current year
                    current_year = datetime.now().year
                    timeoff_types = TimeOffType.objects.filter(is_active=True)
                    
                    for timeoff_type in timeoff_types:
                        balance, balance_created = TimeOffBalance.objects.get_or_create(
                            user=user,
                            timeoff_type=timeoff_type,
                            year=current_year,
                            defaults={
                                'allocated_days': timeoff_type.default_annual_allocation_days,
                                'used_days': 0
                            }
                        )
                        
                        if balance_created:
                            self.stdout.write(
                                f'  - Created balance: {timeoff_type.name} ({balance.allocated_days} days)'
                            )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating admin {email}: {str(e)}')
                )
        
        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} admin(s), updated {updated_count}'
            )
        )
        self.stdout.write('')
        self.stdout.write('Admin credentials:')
        self.stdout.write('  Email: admin@dayflow.com | Password: admin123')
        self.stdout.write('  Email: hr@dayflow.com | Password: hr123')
