from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from attendance.models import AttendanceRecord
from attendance.serializers import (
    CheckInSerializer,
    CheckOutSerializer,
    CurrentStatusSerializer
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_in(request):
    """
    POST /api/attendance/check-in/
    Check in the authenticated user
    """
    user = request.user
    
    # Check if already checked in today
    if AttendanceRecord.has_open_record(user):
        return Response(
            {
                'error': 'ALREADY_CHECKED_IN',
                'detail': 'You have already checked in today and have not checked out yet.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create new attendance record
    now = timezone.now()
    record = AttendanceRecord.objects.create(
        user=user,
        check_in_time=now,
        status='PRESENT'
    )
    
    response_data = {
        'since_time': record.check_in_time,
        'current_status': 'PRESENT',
        'message': 'Successfully checked in'
    }
    
    serializer = CheckInSerializer(response_data)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_out(request):
    """
    POST /api/attendance/check-out/
    Check out the authenticated user
    """
    user = request.user
    today = timezone.now().date()
    
    # Find today's open record
    record = AttendanceRecord.objects.filter(
        user=user,
        check_in_time__date=today,
        check_out_time__isnull=True
    ).first()
    
    if not record:
        return Response(
            {
                'error': 'NOT_CHECKED_IN',
                'detail': 'You have not checked in today or have already checked out.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Set check out time
    now = timezone.now()
    record.check_out_time = now
    record.save()
    
    response_data = {
        'check_in_time': record.check_in_time,
        'check_out_time': record.check_out_time,
        'duration': record.duration_formatted,
        'message': 'Successfully checked out'
    }
    
    serializer = CheckOutSerializer(response_data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_status(request):
    """
    GET /api/attendance/current/
    Get current attendance status for authenticated user
    """
    user = request.user
    today = timezone.now().date()
    
    # Get today's record
    record = AttendanceRecord.objects.filter(
        user=user,
        check_in_time__date=today
    ).first()
    
    if record:
        is_checked_in = record.check_out_time is None
        
        # Determine status icon
        if record.is_on_leave:
            status_icon = 'ON_LEAVE'
        else:
            status_icon = record.status
        
        # Calculate duration so far if still checked in
        duration_so_far = None
        if is_checked_in:
            delta = timezone.now() - record.check_in_time
            hours = int(delta.total_seconds() // 3600)
            minutes = int((delta.total_seconds() % 3600) // 60)
            duration_so_far = f"{hours}h {minutes}m"
        
        response_data = {
            'is_checked_in': is_checked_in,
            'since_time': record.check_in_time if is_checked_in else None,
            'check_in_time': record.check_in_time,
            'status_icon': status_icon,
            'duration_so_far': duration_so_far
        }
    else:
        # No record for today
        response_data = {
            'is_checked_in': False,
            'since_time': None,
            'check_in_time': None,
            'status_icon': 'ABSENT',
            'duration_so_far': None
        }
    
    serializer = CurrentStatusSerializer(response_data)
    return Response(serializer.data, status=status.HTTP_200_OK)
