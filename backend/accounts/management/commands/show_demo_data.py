from django.core.management.base import BaseCommand
from accounts.models import User
from employees.models import EmployeeProfile
from profiles.models import ProfileDetail, ResumeDetail, BankDetail, SalaryStructure, Skill, Certification
from attendance.models import AttendanceRecord
from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest


class Command(BaseCommand):
    help = 'Display comprehensive demo data summary'

    def handle(self, *args, **kwargs):
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('DAYFLOW DATABASE - DEMO DATA SUMMARY'))
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write('')
        
        # Database counts
        self.stdout.write(self.style.WARNING('DATABASE RECORD COUNTS:'))
        self.stdout.write(f'  Users: {User.objects.count()}')
        self.stdout.write(f'  Employee Profiles: {EmployeeProfile.objects.count()}')
        self.stdout.write(f'  Profile Details: {ProfileDetail.objects.count()}')
        self.stdout.write(f'  Resume Details: {ResumeDetail.objects.count()}')
        self.stdout.write(f'  Bank Details: {BankDetail.objects.count()}')
        self.stdout.write(f'  Salary Structures: {SalaryStructure.objects.count()}')
        self.stdout.write(f'  Skills: {Skill.objects.count()}')
        self.stdout.write(f'  Certifications: {Certification.objects.count()}')
        self.stdout.write(f'  Attendance Records: {AttendanceRecord.objects.count()}')
        self.stdout.write(f'  Time Off Types: {TimeOffType.objects.count()}')
        self.stdout.write(f'  Time Off Balances: {TimeOffBalance.objects.count()}')
        self.stdout.write(f'  Time Off Requests: {TimeOffRequest.objects.count()}')
        self.stdout.write('')
        
        # All users
        self.stdout.write(self.style.WARNING('ALL USERS:'))
        self.stdout.write('')
        self.stdout.write(f'{"NAME":<20} {"EMAIL":<35} {"ROLE":<10} {"LOGIN ID":<20}')
        self.stdout.write('-' * 85)
        
        for user in User.objects.all().order_by('role', 'full_name'):
            self.stdout.write(
                f'{user.full_name:<20} {user.email:<35} {user.role:<10} {user.login_id:<20}'
            )
        
        self.stdout.write('')
        
        # Sample detailed user
        self.stdout.write(self.style.WARNING('SAMPLE USER DETAILS (John Doe):'))
        self.stdout.write('')
        
        try:
            user = User.objects.get(email='john.doe@dayflow.com')
            
            self.stdout.write(f'Basic Info:')
            self.stdout.write(f'  Name: {user.full_name}')
            self.stdout.write(f'  Email: {user.email}')
            self.stdout.write(f'  Login ID: {user.login_id}')
            self.stdout.write(f'  Role: {user.role}')
            self.stdout.write(f'  Phone: {user.phone}')
            self.stdout.write('')
            
            if hasattr(user, 'profile_detail'):
                profile = user.profile_detail
                self.stdout.write(f'Profile:')
                self.stdout.write(f'  Job Position: {profile.job_position}')
                self.stdout.write(f'  Department: {profile.department}')
                self.stdout.write(f'  Location: {profile.location}')
                self.stdout.write('')
            
            if hasattr(user, 'resume_detail'):
                resume = user.resume_detail
                self.stdout.write(f'Resume:')
                self.stdout.write(f'  Gender: {resume.gender}')
                self.stdout.write(f'  Date of Birth: {resume.date_of_birth}')
                self.stdout.write(f'  Marital Status: {resume.marital_status}')
                self.stdout.write(f'  Date of Joining: {resume.date_of_joining}')
                self.stdout.write(f'  Address: {resume.address[:50]}...')
                self.stdout.write('')
            
            if hasattr(user, 'bank_detail'):
                bank = user.bank_detail
                self.stdout.write(f'Bank Details:')
                self.stdout.write(f'  Bank: {bank.bank_name}')
                self.stdout.write(f'  Account: {bank.bank_account_number}')
                self.stdout.write(f'  IFSC: {bank.ifsc_code}')
                self.stdout.write(f'  UPI: {bank.upi_id}')
                self.stdout.write('')
            
            if hasattr(user, 'salary_structure'):
                salary = user.salary_structure
                self.stdout.write(f'Salary Structure:')
                self.stdout.write(f'  Basic Salary: ₹{salary.basic_salary:,.2f}')
                self.stdout.write(f'  HRA: ₹{salary.hra_calculated:,.2f}')
                self.stdout.write(f'  Gross Salary: ₹{salary.gross_salary:,.2f}')
                self.stdout.write(f'  Total Deductions: ₹{salary.total_deductions:,.2f}')
                self.stdout.write(f'  Net Salary (Monthly): ₹{salary.net_salary:,.2f}')
                self.stdout.write(f'  Annual Salary: ₹{salary.annual_salary:,.2f}')
                self.stdout.write('')
            
            skills = user.skills.all()
            if skills.exists():
                self.stdout.write(f'Skills ({skills.count()}):')
                for skill in skills:
                    self.stdout.write(f'  • {skill.name} ({skill.level})')
                self.stdout.write('')
            
            certs = user.certifications.all()
            if certs.exists():
                self.stdout.write(f'Certifications ({certs.count()}):')
                for cert in certs:
                    self.stdout.write(f'  • {cert.title} - {cert.issuer} (Issued: {cert.issued_date})')
                self.stdout.write('')
            
            attendance = user.attendance_records.all()
            self.stdout.write(f'Attendance Records: {attendance.count()}')
            self.stdout.write('')
            
            requests = user.timeoff_requests.all()
            self.stdout.write(f'Time Off Requests: {requests.count()}')
            if requests.exists():
                for req in requests:
                    self.stdout.write(f'  • {req.timeoff_type.name}: {req.start_date} to {req.end_date} ({req.status})')
            self.stdout.write('')
            
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('  John Doe not found in database'))
            self.stdout.write('')
        
        # Time off requests summary
        self.stdout.write(self.style.WARNING('TIME OFF REQUESTS SUMMARY:'))
        self.stdout.write('')
        
        pending = TimeOffRequest.objects.filter(status='PENDING').count()
        approved = TimeOffRequest.objects.filter(status='APPROVED').count()
        rejected = TimeOffRequest.objects.filter(status='REJECTED').count()
        
        self.stdout.write(f'  Pending: {pending}')
        self.stdout.write(f'  Approved: {approved}')
        self.stdout.write(f'  Rejected: {rejected}')
        self.stdout.write(f'  Total: {pending + approved + rejected}')
        self.stdout.write('')
        
        # Login credentials
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.WARNING('LOGIN CREDENTIALS:'))
        self.stdout.write('')
        self.stdout.write('ADMIN:')
        self.stdout.write('  Email: admin@dayflow.com')
        self.stdout.write('  Password: admin123')
        self.stdout.write('')
        self.stdout.write('HR MANAGER:')
        self.stdout.write('  Email: hr@dayflow.com')
        self.stdout.write('  Password: hr123')
        self.stdout.write('')
        self.stdout.write('EMPLOYEES (all use password: employee123):')
        self.stdout.write('  • john.doe@dayflow.com (Software Engineer)')
        self.stdout.write('  • jane.smith@dayflow.com (Senior Developer)')
        self.stdout.write('  • mike.wilson@dayflow.com (Product Manager)')
        self.stdout.write('  • sarah.jones@dayflow.com (UI/UX Designer)')
        self.stdout.write('  • david.brown@dayflow.com (QA Engineer)')
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write(self.style.SUCCESS('For complete documentation, see: backend/DATABASE_DEMO_DATA.md'))
        self.stdout.write(self.style.SUCCESS('=' * 80))
        self.stdout.write('')
