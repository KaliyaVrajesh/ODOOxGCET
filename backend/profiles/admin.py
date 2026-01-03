from django.contrib import admin
from .models import ProfileDetail, Skill, Certification

@admin.register(ProfileDetail)
class ProfileDetailAdmin(admin.ModelAdmin):
    list_display = ['user', 'job_position', 'department', 'location', 'updated_at']
    list_filter = ['department', 'location']
    search_fields = ['user__full_name', 'user__email', 'job_position', 'department']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Public / Header Information', {
            'fields': ('job_position', 'department', 'manager_name', 'location')
        }),
        ('Private Information', {
            'fields': ('about', 'what_i_love', 'interests_and_hobbies')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'level', 'created_at']
    list_filter = ['level', 'created_at']
    search_fields = ['name', 'user__full_name', 'user__email']
    readonly_fields = ['id', 'created_at']

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'issuer', 'issued_date', 'created_at']
    list_filter = ['issued_date', 'created_at']
    search_fields = ['title', 'issuer', 'user__full_name', 'user__email']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'issued_date'
