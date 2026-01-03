import uuid
from django.db import models
from django.conf import settings

class ProfileDetail(models.Model):
    """
    Extended profile information for users.
    Contains public header fields and private info fields.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile_detail'
    )
    
    # Public / Header fields (editable by Admin)
    job_position = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    manager_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    
    # Private info fields
    about = models.TextField(blank=True)
    what_i_love = models.TextField(blank=True)
    interests_and_hobbies = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'profile_details'
        verbose_name = 'Profile Detail'
        verbose_name_plural = 'Profile Details'

    def __str__(self):
        return f"Profile: {self.user.full_name}"

class Skill(models.Model):
    """
    Skills associated with a user profile.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skills'
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
        ordering = ['name']
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.user.full_name} - {self.name}"

class Certification(models.Model):
    """
    Certifications associated with a user profile.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='certifications'
    )
    title = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255, blank=True)
    issued_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'certifications'
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'
        ordering = ['-issued_date', 'title']

    def __str__(self):
        return f"{self.user.full_name} - {self.title}"


class ResumeDetail(models.Model):
    """
    Resume tab information - personal details
    """
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
        ('PREFER_NOT_TO_SAY', 'Prefer not to say'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('SINGLE', 'Single'),
        ('MARRIED', 'Married'),
        ('DIVORCED', 'Divorced'),
        ('WIDOWED', 'Widowed'),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='resume_detail'
    )
    
    # Personal Information
    address = models.TextField(blank=True)
    personal_email = models.EmailField(blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resume_details'
        verbose_name = 'Resume Detail'
        verbose_name_plural = 'Resume Details'

    def __str__(self):
        return f"Resume: {self.user.full_name}"


class BankDetail(models.Model):
    """
    Bank details for salary payments
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='bank_detail'
    )
    
    bank_account_number = models.CharField(max_length=50, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    ifsc_code = models.CharField(max_length=20, blank=True)
    upi_id = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bank_details'
        verbose_name = 'Bank Detail'
        verbose_name_plural = 'Bank Details'

    def __str__(self):
        return f"Bank: {self.user.full_name}"


class SalaryStructure(models.Model):
    """
    Salary structure with auto-calculated components
    Admin/HR only access
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='salary_structure'
    )
    
    # Base components
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    hra_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    hra_fixed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    standard_allowance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    performance_bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    leave_travel_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Deductions
    pf_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=12.00)
    professional_tax = models.DecimalField(max_digits=10, decimal_places=2, default=200)
    income_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Work details
    monthly_working_days = models.IntegerField(default=22)
    weeks_per_month = models.IntegerField(default=4)
    year = models.IntegerField(default=2025)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'salary_structures'
        verbose_name = 'Salary Structure'
        verbose_name_plural = 'Salary Structures'

    def __str__(self):
        return f"Salary: {self.user.full_name}"
    
    @property
    def hra_calculated(self):
        """Calculate HRA based on percentage of basic salary"""
        return float(self.basic_salary) * float(self.hra_percentage) / 100
    
    @property
    def standard_allowance_calculated(self):
        """Calculate standard allowance based on percentage of basic salary"""
        return float(self.basic_salary) * float(self.standard_allowance_percentage) / 100
    
    @property
    def gross_salary(self):
        """Calculate gross salary"""
        return (
            float(self.basic_salary) +
            self.hra_calculated +
            float(self.hra_fixed) +
            self.standard_allowance_calculated +
            float(self.performance_bonus) +
            float(self.leave_travel_allowance)
        )
    
    @property
    def pf_contribution(self):
        """Calculate PF contribution"""
        return float(self.basic_salary) * float(self.pf_percentage) / 100
    
    @property
    def total_deductions(self):
        """Calculate total deductions"""
        return (
            self.pf_contribution +
            float(self.professional_tax) +
            float(self.income_tax)
        )
    
    @property
    def net_salary(self):
        """Calculate net take-home salary"""
        return self.gross_salary - self.total_deductions
    
    @property
    def annual_salary(self):
        """Calculate annual salary"""
        return self.net_salary * 12
