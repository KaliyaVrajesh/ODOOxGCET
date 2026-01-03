from rest_framework import serializers
from django.utils import timezone
from accounts.models import User
from employees.models import EmployeeProfile
from attendance.models import AttendanceRecord

class EmployeeCardSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    login_id = serializers.CharField(source='user.login_id', read_only=True)
    status_icon = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = ['id', 'login_id', 'full_name', 'email', 'profile_picture', 'job_title', 'department', 'status_icon']

    def get_status_icon(self, obj):
        """
        Determine status based on today's attendance record
        Returns: PRESENT (checked in), ON_LEAVE, or ABSENT
        """
        today = timezone.now().date()
        record = AttendanceRecord.objects.filter(
            user=obj.user,
            check_in_time__date=today
        ).first()

        if record:
            if record.is_on_leave:
                return 'ON_LEAVE'
            # If checked in but not checked out yet, show PRESENT
            if record.check_out_time is None:
                return 'PRESENT'
            # If already checked out, show ABSENT (not currently in office)
            return 'ABSENT'
        
        # No record for today means absent
        return 'ABSENT'

class EmployeeDetailSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='user.id', read_only=True)
    login_id = serializers.CharField(source='user.login_id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    status_icon = serializers.SerializerMethodField()
    recent_attendance = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'login_id', 'full_name', 'email', 'phone', 'role',
            'profile_picture', 'job_title', 'department', 'date_joined',
            'status_icon', 'recent_attendance'
        ]

    def get_status_icon(self, obj):
        """Get current status for today"""
        today = timezone.now().date()
        record = AttendanceRecord.objects.filter(
            user=obj.user,
            check_in_time__date=today
        ).first()

        if record:
            if record.is_on_leave:
                return 'ON_LEAVE'
            # If checked in but not checked out yet, show PRESENT
            if record.check_out_time is None:
                return 'PRESENT'
            # If already checked out, show ABSENT (not currently in office)
            return 'ABSENT'
        
        return 'ABSENT'

    def get_recent_attendance(self, obj):
        """Get last 5 attendance records"""
        records = AttendanceRecord.objects.filter(user=obj.user)[:5]
        return [{
            'date': record.check_in_time.date(),
            'check_in': record.check_in_time,
            'check_out': record.check_out_time,
            'status': record.status,
            'duration': record.duration_formatted
        } for record in records]
