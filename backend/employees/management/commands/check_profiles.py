from django.core.management.base import BaseCommand
from employees.models import EmployeeProfile
from accounts.models import User


class Command(BaseCommand):
    help = 'Check employee profiles'

    def handle(self, *args, **kwargs):
        self.stdout.write('Checking employee profiles...\n')
        
        # Check admin/HR users
        admins = User.objects.filter(role__in=['ADMIN', 'HR'])
        self.stdout.write(f'Admin/HR users: {admins.count()}')
        for user in admins:
            has_profile = EmployeeProfile.objects.filter(user=user).exists()
            self.stdout.write(f'  {user.email} ({user.role}) - Has profile: {has_profile}')
        
        # Check all profiles
        self.stdout.write(f'\nEmployee profiles: {EmployeeProfile.objects.count()}')
        for profile in EmployeeProfile.objects.all():
            self.stdout.write(f'  {profile.user.email} - {profile.job_title} ({profile.user.role})')
