from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
from calendar import monthrange

from attendance.models import AttendanceRecord
from attendance.serializers import (
    AttendanceRecordSerializer, CheckInSerializer, CheckOutSerializer,
    CurrentStatusSerializer, AdminDayAttendanceSerializer,
    EmployeeMonthAttendanceSerializer
)
from accounts.models import User


class CheckInView(APIView):
    """
    POST /api/attendance/check-in/
    Employee checks in
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CheckInSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            return Response({
                'message': 'Checked in successfully',
                'since_time': record.check_in_time.strftime('%H:%M'),
                'status': 'PRESENT'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckOutView(APIView):
    """
    POST /api/attendance/check-out/
    Employee checks out
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CheckOutSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            
            # Calculate duration
            delta = record.check_out_time - record.check_in_time
            hours = int(delta.total_seconds() // 3600)
            minutes = int((delta.total_seconds() % 3600) // 60)
            
            return Response({
                'message': 'Checked out successfully',
                'duration': f"{hours}h {minutes}m",
                'check_in': record.check_in_time.strftime('%H:%M'),
                'check_out': record.check_out_time.strftime('%H:%M')
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentStatusView(APIView):
    """
    GET /api/attendance/current/
    Get current attendance status
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        record = AttendanceRecord.objects.filter(
            user=request.user,
            check_in_time__date=today
        ).first()
        
        if record and not record.check_out_time:
            # Checked in, not checked out
            data = {
                'is_checked_in': True,
                'since_time': record.check_in_time.strftime('%H:%M'),
                'status_icon': 'PRESENT',
                'check_in_time': record.check_in_time,
                'check_out_time': None
            }
        elif record and record.check_out_time:
            # Already checked out
            data = {
                'is_checked_in': False,
                'since_time': None,
                'status_icon': 'PRESENT',
                'check_in_time': record.check_in_time,
                'check_out_time': record.check_out_time
            }
        else:
            # Not checked in
            data = {
                'is_checked_in': False,
                'since_time': None,
                'status_icon': 'ABSENT',
                'check_in_time': None,
                'check_out_time': None
            }
        
        serializer = CurrentStatusSerializer(data)
        return Response(serializer.data)


class AdminDayAttendanceView(APIView):
    """
    GET /api/attendance/admin/day/?date=YYYY-MM-DD
    Admin view - all employees for a specific day
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role not in ['ADMIN', 'HR']:
            return Response(
                {'error': 'Admin/HR access only'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get date from query params or use today
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            target_date = timezone.now().date()
        
        # Get all attendance records for this date
        records = AttendanceRecord.objects.filter(
            check_in_time__date=target_date
        ).select_related('user')
        
        # Get all employees
        all_employees = User.objects.filter(role='EMPLOYEE')
        
        # Build response with all employees
        employee_records = []
        present_count = 0
        absent_count = 0
        leave_count = 0
        
        for employee in all_employees:
            record = records.filter(user=employee).first()
            if record:
                employee_records.append(record)
                if record.status == 'PRESENT':
                    present_count += 1
                elif record.status == 'ON_LEAVE':
                    leave_count += 1
            else:
                # Create a placeholder for absent employees
                absent_count += 1
                # You might want to create actual absent records here
        
        serializer = AttendanceRecordSerializer(employee_records, many=True)
        
        return Response({
            'date': target_date.strftime('%d/%m/%Y'),
            'employees': serializer.data,
            'total_present': present_count,
            'total_absent': absent_count,
            'total_on_leave': leave_count
        })


class EmployeeMonthAttendanceView(APIView):
    """
    GET /api/attendance/me/month/?month=10&year=2025
    Employee view - their attendance for a month
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get month and year from query params or use current
        month = int(request.query_params.get('month', timezone.now().month))
        year = int(request.query_params.get('year', timezone.now().year))
        
        # Validate month
        if month < 1 or month > 12:
            return Response(
                {'error': 'Invalid month. Use 1-12'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get first and last day of month
        first_day = datetime(year, month, 1).date()
        last_day = datetime(year, month, monthrange(year, month)[1]).date()
        
        # Get all records for this month
        records = AttendanceRecord.objects.filter(
            user=request.user,
            check_in_time__date__gte=first_day,
            check_in_time__date__lte=last_day
        ).order_by('-check_in_time')
        
        # Calculate statistics
        days_present = records.filter(status='PRESENT').count()
        days_on_leave = records.filter(status='ON_LEAVE').count()
        total_days = (last_day - first_day).days + 1
        
        serializer = AttendanceRecordSerializer(records, many=True)
        
        month_names = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
        
        return Response({
            'month': month_names[month - 1],
            'year': year,
            'days_present': days_present,
            'days_on_leave': days_on_leave,
            'total_days': total_days,
            'records': serializer.data
        })
