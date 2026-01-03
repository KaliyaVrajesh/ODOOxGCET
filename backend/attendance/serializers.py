from rest_framework import serializers
from django.utils import timezone
from attendance.models import AttendanceRecord

class AttendanceRecordSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    duration = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'user', 'user_name', 'check_in_time', 'check_out_time',
            'status', 'is_on_leave', 'duration', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_duration(self, obj):
        return obj.duration_formatted

class CheckInSerializer(serializers.Serializer):
    """Serializer for check-in response"""
    since_time = serializers.DateTimeField()
    current_status = serializers.CharField()
    message = serializers.CharField()

class CheckOutSerializer(serializers.Serializer):
    """Serializer for check-out response"""
    check_in_time = serializers.DateTimeField()
    check_out_time = serializers.DateTimeField()
    duration = serializers.CharField()
    message = serializers.CharField()

class CurrentStatusSerializer(serializers.Serializer):
    """Serializer for current attendance status"""
    is_checked_in = serializers.BooleanField()
    since_time = serializers.DateTimeField(required=False, allow_null=True)
    status_icon = serializers.CharField()
    check_in_time = serializers.DateTimeField(required=False, allow_null=True)
    duration_so_far = serializers.CharField(required=False, allow_null=True)
