from django.contrib import admin
from .models import TimeOffType, TimeOffBalance, TimeOffRequest

@admin.register(TimeOffType)
class TimeOffTypeAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'default_annual_allocation_days', 'is_active', 'created_at']
    list_filter = ['is_active', 'code']
    search_fields = ['name', 'code']
    readonly_fields = ['id', 'created_at']

@admin.register(TimeOffBalance)
class TimeOffBalanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'timeoff_type', 'year', 'allocated_days', 'used_days', 'available_days']
    list_filter = ['year', 'timeoff_type']
    search_fields = ['user__full_name', 'user__email', 'user__login_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    def available_days(self, obj):
        return obj.available_days
    available_days.short_description = 'Available Days'

@admin.register(TimeOffRequest)
class TimeOffRequestAdmin(admin.ModelAdmin):
    list_display = [
        'employee', 'timeoff_type', 'start_date', 'end_date',
        'allocation_days', 'status', 'approved_by', 'created_at'
    ]
    list_filter = ['status', 'timeoff_type', 'start_date', 'created_at']
    search_fields = ['employee__full_name', 'employee__email', 'employee__login_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Request Information', {
            'fields': ('employee', 'timeoff_type', 'start_date', 'end_date', 'allocation_days')
        }),
        ('Status', {
            'fields': ('status', 'requested_by', 'approved_by', 'rejection_reason')
        }),
        ('Attachment', {
            'fields': ('attachment',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
