import uuid
from decimal import Decimal
from datetime import timedelta
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class TimeOffType(models.Model):
    """
    Types of time off (Paid, Sick, Unpaid)
    """
    CODE_CHOICES = [
        ('PAID', 'Paid Time Off'),
        ('SICK', 'Sick Leave'),
        ('UNPAID', 'Unpaid Leave'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, choices=CODE_CHOICES, unique=True)
    name = models.CharField(max_length=255)
    default_annual_allocation_days = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        validators=[MinValueValidator(Decimal('0.0'))]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'timeoff_types'
        verbose_name = 'Time Off Type'
        verbose_name_plural = 'Time Off Types'
        ordering = ['code']

    def __str__(self):
        return f"{self.name} ({self.code})"

class TimeOffBalance(models.Model):
    """
    Tracks remaining time off days per user, type, and year
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timeoff_balances'
    )
    timeoff_type = models.ForeignKey(
        TimeOffType,
        on_delete=models.CASCADE,
        related_name='balances'
    )
    year = models.IntegerField()
    allocated_days = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        validators=[MinValueValidator(Decimal('0.0'))]
    )
    used_days = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        default=Decimal('0.0'),
        validators=[MinValueValidator(Decimal('0.0'))]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timeoff_balances'
        verbose_name = 'Time Off Balance'
        verbose_name_plural = 'Time Off Balances'
        unique_together = ['user', 'timeoff_type', 'year']
        ordering = ['-year', 'timeoff_type__code']

    def __str__(self):
        return f"{self.user.full_name} - {self.timeoff_type.code} {self.year}"

    @property
    def available_days(self):
        """Calculate available days"""
        return self.allocated_days - self.used_days

class TimeOffRequest(models.Model):
    """
    Time off allocation or leave request
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timeoff_requests'
    )
    timeoff_type = models.ForeignKey(
        TimeOffType,
        on_delete=models.CASCADE,
        related_name='requests'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    allocation_days = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        validators=[MinValueValidator(Decimal('0.5'))]
    )
    attachment = models.FileField(
        upload_to='timeoff_attachments/',
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='timeoff_requests_created'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='timeoff_requests_approved'
    )
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timeoff_requests'
        verbose_name = 'Time Off Request'
        verbose_name_plural = 'Time Off Requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"{self.employee.full_name} - {self.timeoff_type.code} ({self.start_date} to {self.end_date})"

    @staticmethod
    def calculate_days(start_date, end_date):
        """
        Calculate number of days between start and end date (inclusive)
        Can be extended to exclude weekends/holidays
        """
        if end_date < start_date:
            raise ValueError("End date must be after start date")
        
        delta = end_date - start_date
        return Decimal(str(delta.days + 1))  # +1 to include both start and end dates

    def clean(self):
        """Validate the request"""
        from django.core.exceptions import ValidationError
        
        if self.end_date < self.start_date:
            raise ValidationError("End date must be after or equal to start date")
        
        # Auto-calculate allocation_days if not provided
        if not self.allocation_days:
            self.allocation_days = self.calculate_days(self.start_date, self.end_date)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
