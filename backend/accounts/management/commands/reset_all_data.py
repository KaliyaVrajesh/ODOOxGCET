from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import User
from employees.models import EmployeeProfile
from attendance.models import AttendanceRecord
from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest
from profiles.models import ProfileDetail, ResumeDetail, BankDetail, SalaryStructure, Skill, Certification
from datetime import datetime, timedelta
from django.utils import timezone
from decimal import Decimal


class Command(BaseCommand):
    help = 'Delete all data and create comprehensive test data with all details'

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
        
        self.stdout.write(self.style.WARNING('\nCreating comprehensive test data...'))
        
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
        
        # Create users with complete profiles
        self.stdout.write('\nCreating users with complete profiles...')
        
        users_data = [
            {
                'email': 'admin@dayflow.com',
                'password': 'admin123',
                'full_name': 'Admin User',
                'phone': '+91-9876543210',
                'company_name': 'Odoo India',
                'role': 'ADMIN',
                'job_title': 'System Administrator',
                'department': 'IT',
                'date_of_joining': '2022-01-15',
                'profile_data': {
                    'date_of_birth': '1985-05-15',
                    'gender': 'Male',
                    'marital_status': 'Married',
                    'nationality': 'Indian',
                    'address_line1': '123 Tech Park',
                    'address_line2': 'Sector 5',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560001',
                    'country': 'India',
                    'emergency_contact_name': 'Jane Admin',
                    'emergency_contact_relationship': 'Spouse',
                    'emergency_contact_phone': '+91-9876543299',
                },
                'resume_data': {
                    'highest_qualification': 'Master of Computer Applications',
                    'university': 'Bangalore University',
                    'year_of_passing': 2008,
                    'previous_company': 'Tech Solutions Inc',
                    'previous_designation': 'Senior System Admin',
                    'years_of_experience': 15,
                    'skills_summary': 'System Administration, Network Security, Cloud Infrastructure',
                },
                'bank_data': {
                    'bank_name': 'HDFC Bank',
                    'account_number': '50100123456789',
                    'ifsc_code': 'HDFC0001234',
                    'branch_name': 'Bangalore MG Road',
                    'account_holder_name': 'Admin User',
                    'pan_number': 'ABCDE1234F',
                    'aadhaar_number': '1234-5678-9012',
                },
                'salary_data': {
                    'basic_salary': Decimal('80000.00'),
                    'hra': Decimal('40000.00'),
                    'transport_allowance': Decimal('5000.00'),
                    'special_allowance': Decimal('15000.00'),
                    'provident_fund': Decimal('9600.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('15000.00'),
                },
                'skills': ['System Administration', 'Linux', 'AWS', 'Docker', 'Kubernetes'],
                'certifications': [
                    {'name': 'AWS Certified Solutions Architect', 'issuing_organization': 'Amazon Web Services', 'issue_date': '2022-06-15', 'expiry_date': '2025-06-15'},
                    {'name': 'Certified Kubernetes Administrator', 'issuing_organization': 'CNCF', 'issue_date': '2023-03-20', 'expiry_date': '2026-03-20'},
                ],
            },
            {
                'email': 'hr@dayflow.com',
                'password': 'hr123',
                'full_name': 'HR Manager',
                'phone': '+91-9876543211',
                'company_name': 'Odoo India',
                'role': 'HR',
                'job_title': 'HR Manager',
                'department': 'Human Resources',
                'date_of_joining': '2022-02-01',
                'profile_data': {
                    'date_of_birth': '1988-08-22',
                    'gender': 'Female',
                    'marital_status': 'Single',
                    'nationality': 'Indian',
                    'address_line1': '456 HR Colony',
                    'address_line2': 'Whitefield',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560066',
                    'country': 'India',
                    'emergency_contact_name': 'Robert Manager',
                    'emergency_contact_relationship': 'Father',
                    'emergency_contact_phone': '+91-9876543298',
                },
                'resume_data': {
                    'highest_qualification': 'MBA in Human Resources',
                    'university': 'Christ University',
                    'year_of_passing': 2012,
                    'previous_company': 'People First HR Solutions',
                    'previous_designation': 'HR Executive',
                    'years_of_experience': 12,
                    'skills_summary': 'Recruitment, Employee Relations, Performance Management, HR Policies',
                },
                'bank_data': {
                    'bank_name': 'ICICI Bank',
                    'account_number': '60200234567890',
                    'ifsc_code': 'ICIC0002345',
                    'branch_name': 'Bangalore Whitefield',
                    'account_holder_name': 'HR Manager',
                    'pan_number': 'FGHIJ5678K',
                    'aadhaar_number': '2345-6789-0123',
                },
                'salary_data': {
                    'basic_salary': Decimal('70000.00'),
                    'hra': Decimal('35000.00'),
                    'transport_allowance': Decimal('4000.00'),
                    'special_allowance': Decimal('11000.00'),
                    'provident_fund': Decimal('8400.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('12000.00'),
                },
                'skills': ['Recruitment', 'Employee Engagement', 'HRIS', 'Payroll Management', 'Labor Laws'],
                'certifications': [
                    {'name': 'SHRM Certified Professional', 'issuing_organization': 'SHRM', 'issue_date': '2021-09-10', 'expiry_date': '2024-09-10'},
                ],
            },
            {
                'email': 'john.doe@dayflow.com',
                'password': 'employee123',
                'full_name': 'John Doe',
                'phone': '+91-9876543212',
                'company_name': 'Odoo India',
                'role': 'EMPLOYEE',
                'job_title': 'Software Engineer',
                'department': 'Engineering',
                'date_of_joining': '2022-03-10',
                'profile_data': {
                    'date_of_birth': '1995-03-10',
                    'gender': 'Male',
                    'marital_status': 'Single',
                    'nationality': 'Indian',
                    'address_line1': '789 Tech Avenue',
                    'address_line2': 'Koramangala',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560034',
                    'country': 'India',
                    'emergency_contact_name': 'Mary Doe',
                    'emergency_contact_relationship': 'Mother',
                    'emergency_contact_phone': '+91-9876543297',
                },
                'resume_data': {
                    'highest_qualification': 'B.Tech in Computer Science',
                    'university': 'VTU',
                    'year_of_passing': 2017,
                    'previous_company': 'StartupXYZ',
                    'previous_designation': 'Junior Developer',
                    'years_of_experience': 7,
                    'skills_summary': 'Python, Django, React, PostgreSQL, REST APIs',
                },
                'bank_data': {
                    'bank_name': 'SBI',
                    'account_number': '70300345678901',
                    'ifsc_code': 'SBIN0003456',
                    'branch_name': 'Bangalore Koramangala',
                    'account_holder_name': 'John Doe',
                    'pan_number': 'KLMNO9012P',
                    'aadhaar_number': '3456-7890-1234',
                },
                'salary_data': {
                    'basic_salary': Decimal('60000.00'),
                    'hra': Decimal('30000.00'),
                    'transport_allowance': Decimal('3000.00'),
                    'special_allowance': Decimal('7000.00'),
                    'provident_fund': Decimal('7200.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('8000.00'),
                },
                'skills': ['Python', 'Django', 'React', 'PostgreSQL', 'Git', 'Docker'],
                'certifications': [
                    {'name': 'AWS Developer Associate', 'issuing_organization': 'AWS', 'issue_date': '2023-01-15', 'expiry_date': '2026-01-15'},
                ],
            },
            {
                'email': 'jane.smith@dayflow.com',
                'password': 'employee123',
                'full_name': 'Jane Smith',
                'phone': '+91-9876543213',
                'company_name': 'Odoo India',
                'role': 'EMPLOYEE',
                'job_title': 'Senior Developer',
                'department': 'Engineering',
                'date_of_joining': '2022-04-15',
                'profile_data': {
                    'date_of_birth': '1992-11-25',
                    'gender': 'Female',
                    'marital_status': 'Married',
                    'nationality': 'Indian',
                    'address_line1': '321 Developer Street',
                    'address_line2': 'Indiranagar',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560038',
                    'country': 'India',
                    'emergency_contact_name': 'Tom Smith',
                    'emergency_contact_relationship': 'Spouse',
                    'emergency_contact_phone': '+91-9876543296',
                },
                'resume_data': {
                    'highest_qualification': 'M.Tech in Software Engineering',
                    'university': 'IIT Bangalore',
                    'year_of_passing': 2015,
                    'previous_company': 'BigTech Corp',
                    'previous_designation': 'Software Developer',
                    'years_of_experience': 9,
                    'skills_summary': 'Full Stack Development, Microservices, Cloud Architecture, Team Leadership',
                },
                'bank_data': {
                    'bank_name': 'Axis Bank',
                    'account_number': '80400456789012',
                    'ifsc_code': 'UTIB0004567',
                    'branch_name': 'Bangalore Indiranagar',
                    'account_holder_name': 'Jane Smith',
                    'pan_number': 'PQRST3456U',
                    'aadhaar_number': '4567-8901-2345',
                },
                'salary_data': {
                    'basic_salary': Decimal('90000.00'),
                    'hra': Decimal('45000.00'),
                    'transport_allowance': Decimal('5000.00'),
                    'special_allowance': Decimal('10000.00'),
                    'provident_fund': Decimal('10800.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('18000.00'),
                },
                'skills': ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'Microservices'],
                'certifications': [
                    {'name': 'Google Cloud Professional Architect', 'issuing_organization': 'Google Cloud', 'issue_date': '2022-08-20', 'expiry_date': '2024-08-20'},
                    {'name': 'Certified Scrum Master', 'issuing_organization': 'Scrum Alliance', 'issue_date': '2021-05-10', 'expiry_date': None},
                ],
            },
            {
                'email': 'mike.wilson@dayflow.com',
                'password': 'employee123',
                'full_name': 'Mike Wilson',
                'phone': '+91-9876543214',
                'company_name': 'Odoo India',
                'role': 'EMPLOYEE',
                'job_title': 'Product Manager',
                'department': 'Product',
                'date_of_joining': '2022-05-20',
                'profile_data': {
                    'date_of_birth': '1990-07-18',
                    'gender': 'Male',
                    'marital_status': 'Married',
                    'nationality': 'Indian',
                    'address_line1': '654 Product Lane',
                    'address_line2': 'HSR Layout',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560102',
                    'country': 'India',
                    'emergency_contact_name': 'Lisa Wilson',
                    'emergency_contact_relationship': 'Spouse',
                    'emergency_contact_phone': '+91-9876543295',
                },
                'resume_data': {
                    'highest_qualification': 'MBA',
                    'university': 'IIM Bangalore',
                    'year_of_passing': 2014,
                    'previous_company': 'Product Innovations Ltd',
                    'previous_designation': 'Associate Product Manager',
                    'years_of_experience': 10,
                    'skills_summary': 'Product Strategy, Roadmap Planning, Agile, Stakeholder Management',
                },
                'bank_data': {
                    'bank_name': 'HDFC Bank',
                    'account_number': '90500567890123',
                    'ifsc_code': 'HDFC0005678',
                    'branch_name': 'Bangalore HSR Layout',
                    'account_holder_name': 'Mike Wilson',
                    'pan_number': 'UVWXY7890Z',
                    'aadhaar_number': '5678-9012-3456',
                },
                'salary_data': {
                    'basic_salary': Decimal('85000.00'),
                    'hra': Decimal('42500.00'),
                    'transport_allowance': Decimal('5000.00'),
                    'special_allowance': Decimal('12500.00'),
                    'provident_fund': Decimal('10200.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('16000.00'),
                },
                'skills': ['Product Management', 'Agile', 'JIRA', 'User Research', 'Data Analysis'],
                'certifications': [
                    {'name': 'Certified Product Manager', 'issuing_organization': 'Product School', 'issue_date': '2022-04-12', 'expiry_date': None},
                ],
            },
            {
                'email': 'sarah.jones@dayflow.com',
                'password': 'employee123',
                'full_name': 'Sarah Jones',
                'phone': '+91-9876543215',
                'company_name': 'Odoo India',
                'role': 'EMPLOYEE',
                'job_title': 'UI/UX Designer',
                'department': 'Design',
                'date_of_joining': '2022-06-25',
                'profile_data': {
                    'date_of_birth': '1994-02-14',
                    'gender': 'Female',
                    'marital_status': 'Single',
                    'nationality': 'Indian',
                    'address_line1': '987 Design Plaza',
                    'address_line2': 'Jayanagar',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560041',
                    'country': 'India',
                    'emergency_contact_name': 'Patricia Jones',
                    'emergency_contact_relationship': 'Mother',
                    'emergency_contact_phone': '+91-9876543294',
                },
                'resume_data': {
                    'highest_qualification': 'Bachelor of Design',
                    'university': 'NID Bangalore',
                    'year_of_passing': 2016,
                    'previous_company': 'Creative Studios',
                    'previous_designation': 'UI Designer',
                    'years_of_experience': 8,
                    'skills_summary': 'UI/UX Design, Figma, Adobe XD, User Research, Prototyping',
                },
                'bank_data': {
                    'bank_name': 'ICICI Bank',
                    'account_number': '10600678901234',
                    'ifsc_code': 'ICIC0006789',
                    'branch_name': 'Bangalore Jayanagar',
                    'account_holder_name': 'Sarah Jones',
                    'pan_number': 'ABCDE2345F',
                    'aadhaar_number': '6789-0123-4567',
                },
                'salary_data': {
                    'basic_salary': Decimal('65000.00'),
                    'hra': Decimal('32500.00'),
                    'transport_allowance': Decimal('3500.00'),
                    'special_allowance': Decimal('9000.00'),
                    'provident_fund': Decimal('7800.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('9000.00'),
                },
                'skills': ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping'],
                'certifications': [
                    {'name': 'Google UX Design Certificate', 'issuing_organization': 'Google', 'issue_date': '2023-02-28', 'expiry_date': None},
                ],
            },
            {
                'email': 'david.brown@dayflow.com',
                'password': 'employee123',
                'full_name': 'David Brown',
                'phone': '+91-9876543216',
                'company_name': 'Odoo India',
                'role': 'EMPLOYEE',
                'job_title': 'QA Engineer',
                'department': 'Quality Assurance',
                'date_of_joining': '2022-07-30',
                'profile_data': {
                    'date_of_birth': '1993-09-05',
                    'gender': 'Male',
                    'marital_status': 'Single',
                    'nationality': 'Indian',
                    'address_line1': '147 QA Street',
                    'address_line2': 'BTM Layout',
                    'city': 'Bangalore',
                    'state': 'Karnataka',
                    'postal_code': '560076',
                    'country': 'India',
                    'emergency_contact_name': 'Richard Brown',
                    'emergency_contact_relationship': 'Father',
                    'emergency_contact_phone': '+91-9876543293',
                },
                'resume_data': {
                    'highest_qualification': 'B.E in Information Science',
                    'university': 'BMS College of Engineering',
                    'year_of_passing': 2015,
                    'previous_company': 'Testing Solutions Inc',
                    'previous_designation': 'QA Analyst',
                    'years_of_experience': 9,
                    'skills_summary': 'Manual Testing, Automation Testing, Selenium, API Testing, Performance Testing',
                },
                'bank_data': {
                    'bank_name': 'SBI',
                    'account_number': '11700789012345',
                    'ifsc_code': 'SBIN0007890',
                    'branch_name': 'Bangalore BTM Layout',
                    'account_holder_name': 'David Brown',
                    'pan_number': 'FGHIJ6789K',
                    'aadhaar_number': '7890-1234-5678',
                },
                'salary_data': {
                    'basic_salary': Decimal('55000.00'),
                    'hra': Decimal('27500.00'),
                    'transport_allowance': Decimal('3000.00'),
                    'special_allowance': Decimal('7500.00'),
                    'provident_fund': Decimal('6600.00'),
                    'professional_tax': Decimal('200.00'),
                    'income_tax': Decimal('7000.00'),
                },
                'skills': ['Selenium', 'Pytest', 'Postman', 'JMeter', 'TestNG', 'CI/CD'],
                'certifications': [
                    {'name': 'ISTQB Certified Tester', 'issuing_organization': 'ISTQB', 'issue_date': '2021-11-18', 'expiry_date': None},
                ],
            },
        ]
        
        current_year = datetime.now().year
        timeoff_types = TimeOffType.objects.filter(is_active=True)
        pto_type = TimeOffType.objects.get(code='PTO')
        sick_type = TimeOffType.objects.get(code='SICK')
        
        created_users = []
        
        for user_data in users_data:
            email = user_data['email']
            password = user_data.pop('password')
            job_title = user_data.pop('job_title')
            department = user_data.pop('department')
            date_of_joining_str = user_data.pop('date_of_joining')
            profile_data = user_data.pop('profile_data')
            resume_data = user_data.pop('resume_data')
            bank_data = user_data.pop('bank_data')
            salary_data = user_data.pop('salary_data')
            skills_list = user_data.pop('skills')
            certifications_list = user_data.pop('certifications')
            
            # Parse date_of_joining
            date_of_joining = datetime.strptime(date_of_joining_str, '%Y-%m-%d').date()
            
            # Create user
            user = User.objects.create(
                **user_data,
                date_of_joining=date_of_joining,
                is_first_login=False  # Demo users don't need to change password
            )
            user.set_password(password)
            user.save()
            created_users.append(user)
            
            # Create employee profile
            EmployeeProfile.objects.create(
                user=user,
                job_title=job_title,
                department=department
            )
            
            # Create profile detail
            ProfileDetail.objects.create(
                user=user,
                job_position=job_title,
                department=department,
                location=profile_data.get('city', ''),
                about=f"Experienced {job_title} at Dayflow Technologies",
                what_i_love="Working with cutting-edge technologies and solving complex problems",
                interests_and_hobbies="Technology, Reading, Travel"
            )
            
            # Create resume detail
            full_address = f"{profile_data['address_line1']}, {profile_data['address_line2']}, {profile_data['city']}, {profile_data['state']} - {profile_data['postal_code']}, {profile_data['country']}"
            ResumeDetail.objects.create(
                user=user,
                address=full_address,
                personal_email=email,
                gender=profile_data['gender'].upper(),
                marital_status=profile_data['marital_status'].upper(),
                date_of_birth=profile_data['date_of_birth'],
                date_of_joining=timezone.now().date() - timedelta(days=365 * resume_data['years_of_experience'])
            )
            
            # Create bank detail
            BankDetail.objects.create(
                user=user,
                bank_account_number=bank_data['account_number'],
                bank_name=bank_data['bank_name'],
                ifsc_code=bank_data['ifsc_code'],
                upi_id=f"{user.phone.replace('+91-', '')}@paytm"
            )
            
            # Create salary structure
            SalaryStructure.objects.create(
                user=user,
                basic_salary=salary_data['basic_salary'],
                hra_percentage=Decimal('50.00'),
                hra_fixed=Decimal('0.00'),
                standard_allowance_percentage=Decimal('30.00'),
                performance_bonus=salary_data.get('special_allowance', Decimal('0.00')),
                leave_travel_allowance=salary_data.get('transport_allowance', Decimal('0.00')),
                pf_percentage=Decimal('12.00'),
                professional_tax=salary_data.get('professional_tax', Decimal('200.00')),
                income_tax=salary_data.get('income_tax', Decimal('0.00')),
                monthly_working_days=22,
                weeks_per_month=4,
                year=current_year
            )
            
            # Create skills
            for skill_name in skills_list:
                Skill.objects.create(
                    user=user,
                    name=skill_name,
                    level='Advanced'
                )
            
            # Create certifications
            for cert_data in certifications_list:
                Certification.objects.create(
                    user=user,
                    title=cert_data['name'],
                    issuer=cert_data['issuing_organization'],
                    issued_date=cert_data['issue_date']
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
                    f'  ✓ {user.full_name} ({user.role}) - {user.login_id} [Complete Profile]'
                )
            )
        
        # Create attendance records for the past 7 days
        self.stdout.write('\nCreating attendance records...')
        today = timezone.now().date()
        
        for i in range(7):
            date = today - timedelta(days=i)
            check_in_time = timezone.make_aware(datetime.combine(date, datetime.strptime('09:00', '%H:%M').time()))
            check_out_time = timezone.make_aware(datetime.combine(date, datetime.strptime('18:00', '%H:%M').time()))
            
            # Create attendance for most employees (skip one or two randomly)
            for idx, user in enumerate(created_users):
                # Skip weekends for some variety
                if date.weekday() >= 5:
                    continue
                    
                # Skip some employees on some days for variety
                if i == 1 and idx == 2:  # John Doe absent on day 1
                    continue
                if i == 3 and idx == 4:  # Mike Wilson absent on day 3
                    continue
                
                AttendanceRecord.objects.create(
                    user=user,
                    check_in_time=check_in_time,
                    check_out_time=check_out_time,
                    status='PRESENT',
                    is_on_leave=False
                )
        
        self.stdout.write(self.style.SUCCESS('  ✓ Created 7 days of attendance records'))
        
        # Create some time off requests
        self.stdout.write('\nCreating time off requests...')
        
        # Approved request for John Doe
        TimeOffRequest.objects.create(
            employee=created_users[2],  # John Doe
            timeoff_type=pto_type,
            start_date=today + timedelta(days=10),
            end_date=today + timedelta(days=12),
            allocation_days=Decimal('3.0'),
            status='APPROVED',
            requested_by=created_users[2],
            approved_by=created_users[0]  # Admin
        )
        
        # Pending request for Jane Smith
        TimeOffRequest.objects.create(
            employee=created_users[3],  # Jane Smith
            timeoff_type=sick_type,
            start_date=today + timedelta(days=5),
            end_date=today + timedelta(days=6),
            allocation_days=Decimal('2.0'),
            status='PENDING',
            requested_by=created_users[3]
        )
        
        # Approved request for Sarah Jones
        TimeOffRequest.objects.create(
            employee=created_users[5],  # Sarah Jones
            timeoff_type=pto_type,
            start_date=today + timedelta(days=15),
            end_date=today + timedelta(days=19),
            allocation_days=Decimal('5.0'),
            status='APPROVED',
            requested_by=created_users[5],
            approved_by=created_users[1]  # HR Manager
        )
        
        # Rejected request for David Brown
        TimeOffRequest.objects.create(
            employee=created_users[6],  # David Brown
            timeoff_type=pto_type,
            start_date=today + timedelta(days=3),
            end_date=today + timedelta(days=4),
            allocation_days=Decimal('2.0'),
            status='REJECTED',
            requested_by=created_users[6],
            approved_by=created_users[0],  # Admin
            rejection_reason='Project deadline approaching'
        )
        
        self.stdout.write(self.style.SUCCESS('  ✓ Created 4 time off requests (approved, pending, rejected)'))
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write(self.style.SUCCESS('COMPREHENSIVE TEST DATA CREATED SUCCESSFULLY!'))
        self.stdout.write(self.style.SUCCESS('=' * 70))
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('DATABASE INCLUDES:'))
        self.stdout.write('  • 7 Users (1 Admin, 1 HR, 5 Employees)')
        self.stdout.write('  • Complete Profile Details (personal info, address, emergency contacts)')
        self.stdout.write('  • Resume Details (education, experience, skills summary)')
        self.stdout.write('  • Bank Details (account, PAN, Aadhaar)')
        self.stdout.write('  • Salary Structures (basic, allowances, deductions)')
        self.stdout.write('  • Skills (multiple per user)')
        self.stdout.write('  • Certifications (with expiry dates)')
        self.stdout.write('  • 7 Days of Attendance Records')
        self.stdout.write('  • Time Off Requests (Approved, Pending, Rejected)')
        self.stdout.write('  • Time Off Balances for all users')
        self.stdout.write('')
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
        self.stdout.write('  - john.doe@dayflow.com (Software Engineer)')
        self.stdout.write('  - jane.smith@dayflow.com (Senior Developer)')
        self.stdout.write('  - mike.wilson@dayflow.com (Product Manager)')
        self.stdout.write('  - sarah.jones@dayflow.com (UI/UX Designer)')
        self.stdout.write('  - david.brown@dayflow.com (QA Engineer)')
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('Ready for demonstration!'))
        self.stdout.write('')
