from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal
from accounts.models import User
from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest
from timeoff.utils import initialize_balances_for_user

class Command(BaseCommand):
    help = 'Create sample time off requests for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample time off data...')
        
        # Get current year
        current_year = timezone.now().year
        
        # Get time off types
        try:
            paid_type = TimeOffType.objects.get(code='PAID')
            sick_type = TimeOffType.objects.get(code='SICK')
        except TimeOffType.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                'Time off types not found. Run "python manage.py init_timeoff_types" first.'
            ))
            return
        
        # Get sample users
        sample_emails = [
            'priya.sharma@odoo.com',
            'rahul.kumar@odoo.com',
            'anita.desai@odoo.com',
        ]
        
        users = User.objects.filter(email__in=sample_emails)
        
        if not users.exists():
            self.stdout.write(self.style.WARNING(
                'No sample users found. Run "python manage.py create_sample_employees" first.'
            ))
            return
        
        created_count = 0
        
        for user in users:
            # Initialize balances for current year
            balances = initialize_balances_for_user(user, current_year)
            self.stdout.write(f"Initialized balances for {user.full_name}")
            
            # Create sample requests
            sample_requests = [
                {
                    'timeoff_type': paid_type,
                    'start_date': date(current_year, 2, 15),
                    'end_date': date(current_year, 2, 19),
                    'status': 'APPROVED',
                },
                {
                    'timeoff_type': sick_type,
                    'start_date': date(current_year, 3, 10),
                    'end_date': date(current_year, 3, 11),
                    'status': 'APPROVED',
                },
                {
                    'timeoff_type': paid_type,
                    'start_date': date(current_year, 6, 1),
                    'end_date': date(current_year, 6, 5),
                    'status': 'PENDING',
                },
            ]
            
            for req_data in sample_requests:
                # Calculate days
                allocation_days = TimeOffRequest.calculate_days(
                    req_data['start_date'],
                    req_data['end_date']
                )
                
                # Check if request already exists
                existing = TimeOffRequest.objects.filter(
                    employee=user,
                    start_date=req_data['start_date'],
                    end_date=req_data['end_date']
                ).first()
                
                if existing:
                    self.stdout.write(f"  Request already exists: {req_data['start_date']} to {req_data['end_date']}")
                    continue
                
                # Create request
                request = TimeOffRequest.objects.create(
                    employee=user,
                    timeoff_type=req_data['timeoff_type'],
                    start_date=req_data['start_date'],
                    end_date=req_data['end_date'],
                    allocation_days=allocation_days,
                    status=req_data['status'],
                    requested_by=user
                )
                
                # If approved, update balance
                if req_data['status'] == 'APPROVED':
                    balance = TimeOffBalance.objects.get(
                        user=user,
                        timeoff_type=req_data['timeoff_type'],
                        year=current_year
                    )
                    balance.used_days += allocation_days
                    balance.save()
                
                created_count += 1
                self.stdout.write(self.style.SUCCESS(
                    f"  Created {req_data['status']} request: "
                    f"{req_data['start_date']} to {req_data['end_date']} "
                    f"({allocation_days} days)"
                ))
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully created {created_count} sample time off requests!'
        ))
