from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date
from accounts.models import User
from profiles.models import ProfileDetail, Skill, Certification

class Command(BaseCommand):
    help = 'Create sample profile data for existing users'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample profile data...')
        
        # Sample data for different users
        sample_profiles = {
            'priya.sharma@odoo.com': {
                'profile': {
                    'job_position': 'Software Engineer',
                    'department': 'Engineering',
                    'manager_name': 'Vikram Singh',
                    'location': 'Bangalore, India',
                    'about': 'Passionate software engineer with 5+ years of experience in full-stack development. Love building scalable applications and mentoring junior developers.',
                    'what_i_love': 'I love solving complex problems, learning new technologies, and contributing to open-source projects. Coffee and coding are my favorite combination!',
                    'interests_and_hobbies': 'Reading tech blogs, hiking, photography, playing guitar, and participating in hackathons.',
                },
                'skills': [
                    {'name': 'Python', 'level': 'Expert'},
                    {'name': 'Django', 'level': 'Expert'},
                    {'name': 'React', 'level': 'Advanced'},
                    {'name': 'PostgreSQL', 'level': 'Advanced'},
                    {'name': 'Docker', 'level': 'Intermediate'},
                ],
                'certifications': [
                    {
                        'title': 'AWS Certified Developer',
                        'issuer': 'Amazon Web Services',
                        'issued_date': date(2023, 6, 15)
                    },
                    {
                        'title': 'Python Professional Certificate',
                        'issuer': 'Python Institute',
                        'issued_date': date(2022, 3, 20)
                    },
                ]
            },
            'rahul.kumar@odoo.com': {
                'profile': {
                    'job_position': 'Senior Developer',
                    'department': 'Engineering',
                    'manager_name': 'Vikram Singh',
                    'location': 'Mumbai, India',
                    'about': 'Senior developer specializing in backend systems and microservices architecture. Focused on building robust and maintainable code.',
                    'what_i_love': 'I love architecting scalable systems and optimizing performance. Nothing beats the satisfaction of solving a challenging bug!',
                    'interests_and_hobbies': 'Cricket, chess, reading sci-fi novels, and exploring new restaurants.',
                },
                'skills': [
                    {'name': 'Java', 'level': 'Expert'},
                    {'name': 'Spring Boot', 'level': 'Expert'},
                    {'name': 'Microservices', 'level': 'Advanced'},
                    {'name': 'Kubernetes', 'level': 'Advanced'},
                    {'name': 'Redis', 'level': 'Intermediate'},
                ],
                'certifications': [
                    {
                        'title': 'Certified Kubernetes Administrator',
                        'issuer': 'Cloud Native Computing Foundation',
                        'issued_date': date(2023, 9, 10)
                    },
                ]
            },
        }
        
        created_count = 0
        for email, data in sample_profiles.items():
            try:
                user = User.objects.get(email=email)
                
                # Create or update profile detail
                profile, created = ProfileDetail.objects.get_or_create(user=user)
                for key, value in data['profile'].items():
                    setattr(profile, key, value)
                profile.save()
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created profile for {user.full_name}"))
                else:
                    self.stdout.write(self.style.SUCCESS(f"Updated profile for {user.full_name}"))
                
                # Add skills
                for skill_data in data.get('skills', []):
                    skill, created = Skill.objects.get_or_create(
                        user=user,
                        name=skill_data['name'],
                        defaults={'level': skill_data.get('level', '')}
                    )
                    if created:
                        self.stdout.write(f"  Added skill: {skill.name}")
                
                # Add certifications
                for cert_data in data.get('certifications', []):
                    cert, created = Certification.objects.get_or_create(
                        user=user,
                        title=cert_data['title'],
                        defaults={
                            'issuer': cert_data.get('issuer', ''),
                            'issued_date': cert_data.get('issued_date')
                        }
                    )
                    if created:
                        self.stdout.write(f"  Added certification: {cert.title}")
                
                created_count += 1
                
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"User {email} not found, skipping..."))
                continue
        
        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created/updated {created_count} profiles!'))
        self.stdout.write(self.style.SUCCESS('Run "python manage.py create_sample_employees" first if you need sample users.'))
