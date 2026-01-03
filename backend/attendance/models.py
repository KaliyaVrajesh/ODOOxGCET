import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ON_LEAVE', 'On Leave'),
        ('ABSENT', 'Absent'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    check_in_time = models.DateTimeField()
    check_out_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PRESENT')
    is_on_leave = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance_records'
        verbose_name = 'Attendance Record'
        verbose_name_plural = 'Attendance Records'
        ordering = ['-check_in_time']
        indexes = [
            models.Index(fields=['user', 'check_in_time']),
            models.Index(fields=['check_in_time']),
        ]

    def __str__(self):
        return f"{self.user.full_name} - {self.check_in_time.date()} - {self.status}"

    @property
    def duration(self):
        """Calculate duration in seconds if checked out"""
        if self.check_out_time:
            delta = self.check_out_time - self.check_in_time
            return delta.total_seconds()
        return None

    @property
    def duration_formatted(self):
        """Return formatted duration string"""
        if self.duration:
            hours = int(self.duration // 3600)
            minutes = int((self.duration % 3600) // 60)
            return f"{hours}h {minutes}m"
        return None

    @classmethod
    def get_today_record(cls, user):
        """Get today's attendance record for a user"""
        today = timezone.now().date()
        return cls.objects.filter(
            user=user,
            check_in_time__date=today
        ).first()

    @classmethod
    def has_open_record(cls, user):
        """Check if user has an open (not checked out) record today"""
        today = timezone.now().date()
        return cls.objects.filter(
            user=user,
            check_in_time__date=today,
            check_out_time__isnull=True
        ).exists()
