from django.core.management.base import BaseCommand
from decimal import Decimal
from timeoff.models import TimeOffType

class Command(BaseCommand):
    help = 'Initialize default time off types'

    def handle(self, *args, **kwargs):
        self.stdout.write('Initializing time off types...')
        
        types_data = [
            {
                'code': 'PAID',
                'name': 'Paid time off',
                'default_annual_allocation_days': Decimal('24.0')
            },
            {
                'code': 'SICK',
                'name': 'Sick leave',
                'default_annual_allocation_days': Decimal('7.0')
            },
            {
                'code': 'UNPAID',
                'name': 'Unpaid leaves',
                'default_annual_allocation_days': Decimal('0.0')
            },
        ]
        
        created_count = 0
        updated_count = 0
        
        for type_data in types_data:
            timeoff_type, created = TimeOffType.objects.update_or_create(
                code=type_data['code'],
                defaults={
                    'name': type_data['name'],
                    'default_annual_allocation_days': type_data['default_annual_allocation_days'],
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {timeoff_type.name}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"Updated: {timeoff_type.name}"))
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully initialized time off types! '
            f'Created: {created_count}, Updated: {updated_count}'
        ))
