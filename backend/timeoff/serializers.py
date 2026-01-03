from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest

class TimeOffTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeOffType
        fields = ['id', 'code', 'name', 'default_annual_allocation_days']

class TimeOffBalanceSerializer(serializers.ModelSerializer):
    type_code = serializers.CharField(source='timeoff_type.code', read_only=True)
    type_name = serializers.CharField(source='timeoff_type.name', read_only=True)
    available_days = serializers.DecimalField(
        max_digits=5,
        decimal_places=1,
        read_only=True
    )

    class Meta:
        model = TimeOffBalance
        fields = [
            'id', 'type_code', 'type_name', 'year',
            'allocated_days', 'used_days', 'available_days'
        ]
        read_only_fields = ['id', 'used_days']

class TimeOffRequestListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing time off requests (both employee and admin views)
    """
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_id = serializers.UUIDField(source='employee.id', read_only=True)
    timeoff_type_name = serializers.CharField(source='timeoff_type.name', read_only=True)
    timeoff_type_code = serializers.CharField(source='timeoff_type.code', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True, allow_null=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = TimeOffRequest
        fields = [
            'id', 'employee_id', 'employee_name', 'timeoff_type_name', 'timeoff_type_code',
            'start_date', 'end_date', 'allocation_days', 'status',
            'approved_by_name', 'rejection_reason', 'attachment_url',
            'created_at', 'updated_at'
        ]

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None

class TimeOffRequestCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating time off requests
    """
    timeoff_type = serializers.PrimaryKeyRelatedField(
        queryset=TimeOffType.objects.filter(is_active=True)
    )
    allocation_days = serializers.DecimalField(
        max_digits=5,
        decimal_places=1,
        required=False,
        allow_null=True
    )

    class Meta:
        model = TimeOffRequest
        fields = [
            'timeoff_type', 'start_date', 'end_date',
            'allocation_days', 'attachment'
        ]

    def validate(self, data):
        """Validate the request"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be after or equal to start date.'
            })

        # Auto-calculate allocation_days if not provided
        if not data.get('allocation_days'):
            data['allocation_days'] = TimeOffRequest.calculate_days(start_date, end_date)

        return data

    def validate_allocation_days(self, value):
        """Validate allocation days"""
        if value and value < Decimal('0.5'):
            raise serializers.ValidationError('Allocation days must be at least 0.5')
        return value

    def create(self, validated_data):
        """Create time off request"""
        # Set employee and requested_by from context
        user = self.context['request'].user
        validated_data['employee'] = user
        validated_data['requested_by'] = user
        validated_data['status'] = 'PENDING'

        return TimeOffRequest.objects.create(**validated_data)

class TimeOffRequestDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for time off requests
    """
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_id = serializers.UUIDField(source='employee.id', read_only=True)
    timeoff_type_name = serializers.CharField(source='timeoff_type.name', read_only=True)
    timeoff_type_code = serializers.CharField(source='timeoff_type.code', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.full_name', read_only=True, allow_null=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True, allow_null=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = TimeOffRequest
        fields = [
            'id', 'employee_id', 'employee_name',
            'timeoff_type', 'timeoff_type_name', 'timeoff_type_code',
            'start_date', 'end_date', 'allocation_days',
            'status', 'requested_by_name', 'approved_by_name',
            'rejection_reason', 'attachment_url',
            'created_at', 'updated_at'
        ]

    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None

class MyTimeOffResponseSerializer(serializers.Serializer):
    """
    Response serializer for employee's time off view
    Includes balances and requests
    """
    balances = TimeOffBalanceSerializer(many=True, read_only=True)
    requests = TimeOffRequestListSerializer(many=True, read_only=True)
