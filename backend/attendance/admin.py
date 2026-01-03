from django.contrib import admin
from .models import AttendanceRecord

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'check_in_time', 'check_out_time', 'status', 'duration_formatted']
    list_filter = ['status', 'is_on_leave', 'check_in_time']
    search_fields = ['user__full_name', 'user__email', 'user__login_id']
    readonly_fields = ['id', 'created_at', 'updated_at', 'duration_formatted']
    date_hierarchy = 'check_in_time'
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Attendance Details', {
            'fields': ('check_in_time', 'check_out_time', 'status', 'is_on_leave')
        }),
        ('Metadata', {
            'fields': ('id', 'duration_formatted', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def duration_formatted(self, obj):
        return obj.duration_formatted or 'Not checked out'
    duration_formatted.short_description = 'Duration'
