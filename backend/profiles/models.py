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
