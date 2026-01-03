from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from timeoff.utils import initialize_balances_for_user

class Command(BaseCommand):
    help = 'Initialize time off balances for all users for the current year'

    def add_arguments(self, parser):
        parser.add_argument(
            '--year',
            type=int,
            help='Year to initialize balances for (default: current year)',
        )

    def handle(self, *args, **kwargs):
        year = kwargs.get('year') or timezone.now().year
        
        self.stdout.write(f'Initializing time off balances for year {year}...')
        
        users = User.objects.filter(is_active=True)
        total_users = users.count()
        
        if total_users == 0:
            self.stdout.write(self.style.WARNING('No active users found.'))
            return
        
        initialized_count = 0
        
        for user in users:
            balances = initialize_balances_for_user(user, year)
            initialized_count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f"Initialized {len(balances)} balances for {user.full_name}"
                )
            )
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully initialized balances for {initialized_count} users!'
        ))
