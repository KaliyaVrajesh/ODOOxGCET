import uuid
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('HR', 'HR Manager'),
        ('EMPLOYEE', 'Employee'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    login_id = models.CharField(max_length=50, unique=True, editable=False)
    company_name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, max_length=255)
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')
    date_of_joining = models.DateField(null=True, blank=True)  # Year used in login_id
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_first_login = models.BooleanField(default=True)  # Track if user needs to change password
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'company_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.login_id} - {self.full_name}"

    def save(self, *args, **kwargs):
        # Generate login_id if not set
        if not self.login_id:
            from accounts.utils import generate_login_id
            # Use date_of_joining year if available, otherwise current year
            joining_year = self.date_of_joining.year if self.date_of_joining else datetime.now().year
            self.login_id = generate_login_id(self.company_name, self.full_name, joining_year)
        super().save(*args, **kwargs)
