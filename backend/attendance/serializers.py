from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, timedelta
from attendance.models import AttendanceRecord
from accounts.models import User


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Base attendance record serializer"""
    employee_name = serializers.CharField(source='user.full_name', read_only=True)
    check_in = serializers.SerializerMethodField()
    check_out = serializers.SerializerMethodField()
    work_hours = serializers.SerializerMethodField()
    extra_hours = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'employee_name', 'date', 'check_in', 'check_out',
            'work_hours', 'extra_hours', 'status'
        ]
        read_only_fields = ['id', 'status']
    
    def get_check_in(self, obj):
        """Format check-in time as HH:MM"""
        if obj.check_in_time:
            return obj.check_in_time.strftime('%H:%M')
        return None
    
    def get_check_out(self, obj):
        """Format check-out time as HH:MM"""
        if obj.check_out_time:
            return obj.check_out_time.strftime('%H:%M')
        return None
    
    def get_date(self, obj):
        """Format date as DD/MM/YYYY"""
        if obj.check_in_time:
            return obj.check_in_time.strftime('%d/%m/%Y')
        return None
    
    def get_work_hours(self, obj):
        """Calculate work hours in HH:MM format"""
        if obj.check_out_time and obj.check_in_time:
            delta = obj.check_out_time - obj.check_in_time
            hours = int(delta.total_seconds() // 3600)
            minutes = int((delta.total_seconds() % 3600) // 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"
    
    def get_extra_hours(self, obj):
        """Calculate extra hours beyond 9 hours"""
        if obj.check_out_time and obj.check_in_time:
            delta = obj.check_out_time - obj.check_in_time
            total_hours = delta.total_seconds() / 3600
            extra = max(0, total_hours - 9)  # Assuming 9 hours is standard
            hours = int(extra)
            minutes = int((extra % 1) * 60)
            return f"{hours:02d}:{minutes:02d}"
        return "00:00"


class CheckInSerializer(serializers.Serializer):
    """Check-in request"""
    def validate(self, data):
        user = self.context['request'].user
        
        # Check if already checked in today
        if AttendanceRecord.has_open_record(user):
            raise serializers.ValidationError({
                'error': 'ALREADY_CHECKED_IN',
                'message': 'You have already checked in today'
            })
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        record = AttendanceRecord.objects.create(
            user=user,
            check_in_time=timezone.now(),
            status='PRESENT'
        )
        return record


class CheckOutSerializer(serializers.Serializer):
    """Check-out request"""
    def validate(self, data):
        user = self.context['request'].user
        today = timezone.now().date()
        
        # Find today's open record
        record = AttendanceRecord.objects.filter(
            user=user,
            check_in_time__date=today,
            check_out_time__isnull=True
        ).first()
        
        if not record:
            raise serializers.ValidationError({
                'error': 'NO_OPEN_RECORD',
                'message': 'No open check-in record found for today'
            })
        
        data['record'] = record
        return data
    
    def create(self, validated_data):
        record = validated_data['record']
        record.check_out_time = timezone.now()
        record.save()
        return record


class CurrentStatusSerializer(serializers.Serializer):
    """Current attendance status"""
    is_checked_in = serializers.BooleanField()
    since_time = serializers.CharField(allow_null=True)
    status_icon = serializers.CharField()
    check_in_time = serializers.DateTimeField(allow_null=True)
    check_out_time = serializers.DateTimeField(allow_null=True)


class AdminDayAttendanceSerializer(serializers.Serializer):
    """Admin view - all employees for a specific day"""
    date = serializers.DateField()
    employees = AttendanceRecordSerializer(many=True)
    total_present = serializers.IntegerField()
    total_absent = serializers.IntegerField()
    total_on_leave = serializers.IntegerField()


class EmployeeMonthAttendanceSerializer(serializers.Serializer):
    """Employee view - their attendance for a month"""
    month = serializers.CharField()
    year = serializers.IntegerField()
    days_present = serializers.IntegerField()
    days_on_leave = serializers.IntegerField()
    total_days = serializers.IntegerField()
    records = AttendanceRecordSerializer(many=True)
