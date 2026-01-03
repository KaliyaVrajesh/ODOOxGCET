from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q
from decimal import Decimal
from datetime import datetime

from timeoff.models import TimeOffType, TimeOffBalance, TimeOffRequest
from timeoff.serializers import (
    TimeOffBalanceSerializer,
    TimeOffRequestListSerializer,
    TimeOffRequestCreateSerializer,
    TimeOffRequestDetailSerializer,
    MyTimeOffResponseSerializer
)
from timeoff.permissions import IsAdminOrHR
from timeoff.utils import get_or_create_balance, validate_balance_for_request

class MyTimeOffView(APIView):
    """
    GET /api/timeoff/me/
    List employee's own time off balances and requests
    
    POST /api/timeoff/me/
    Create new time off request
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        year = request.query_params.get('year')
        search = request.query_params.get('search', '')

        # Get current year if not specified
        if not year:
            year = datetime.now().year
        else:
            year = int(year)

        # Get balances for the year
        balances = TimeOffBalance.objects.filter(
            user=user,
            year=year
        ).select_related('timeoff_type')

        # Get requests
        requests_qs = TimeOffRequest.objects.filter(
            employee=user
        ).select_related('timeoff_type', 'approved_by')

        # Apply search filter
        if search:
            requests_qs = requests_qs.filter(
                Q(timeoff_type__name__icontains=search) |
                Q(status__icontains=search)
            )

        # Serialize data
        balance_serializer = TimeOffBalanceSerializer(balances, many=True)
        request_serializer = TimeOffRequestListSerializer(
            requests_qs,
            many=True,
            context={'request': request}
        )

        return Response({
            'balances': balance_serializer.data,
            'requests': request_serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TimeOffRequestCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            with transaction.atomic():
                # Create the request
                timeoff_request = serializer.save()

                # Get updated balances
                year = timeoff_request.start_date.year
                balances = TimeOffBalance.objects.filter(
                    user=request.user,
                    year=year
                ).select_related('timeoff_type')

                # Return created request and updated balances
                request_serializer = TimeOffRequestDetailSerializer(
                    timeoff_request,
                    context={'request': request}
                )
                balance_serializer = TimeOffBalanceSerializer(balances, many=True)

                return Response({
                    'request': request_serializer.data,
                    'balances': balance_serializer.data,
                    'message': 'Time off request created successfully'
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminTimeOffListView(generics.ListAPIView):
    """
    GET /api/timeoff/admin/
    List all time off requests (Admin/HR only)
    """
    serializer_class = TimeOffRequestListSerializer
    permission_classes = [IsAuthenticated, IsAdminOrHR]

    def get_queryset(self):
        queryset = TimeOffRequest.objects.select_related(
            'employee',
            'timeoff_type',
            'approved_by'
        ).all()

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by type
        type_filter = self.request.query_params.get('type')
        if type_filter:
            queryset = queryset.filter(timeoff_type__code=type_filter)

        # Filter by employee
        employee_filter = self.request.query_params.get('employee')
        if employee_filter:
            queryset = queryset.filter(employee__id=employee_filter)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(employee__full_name__icontains=search) |
                Q(employee__email__icontains=search) |
                Q(timeoff_type__name__icontains=search) |
                Q(status__icontains=search)
            )

        return queryset

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminOrHR])
def approve_timeoff_request(request, request_id):
    """
    POST /api/timeoff/admin/<uuid:request_id>/approve/
    Approve a time off request
    """
    timeoff_request = get_object_or_404(TimeOffRequest, id=request_id)

    if timeoff_request.status != 'PENDING':
        return Response(
            {
                'error': 'INVALID_STATUS',
                'detail': f'Cannot approve request with status: {timeoff_request.status}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        # Get or create balance for the year
        year = timeoff_request.start_date.year
        balance = get_or_create_balance(
            timeoff_request.employee,
            timeoff_request.timeoff_type,
            year
        )

        # Validate balance
        validation_error = validate_balance_for_request(balance, timeoff_request.allocation_days)
        if validation_error:
            return Response(
                {
                    'error': 'INSUFFICIENT_BALANCE',
                    'detail': validation_error
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct from balance
        balance.used_days += timeoff_request.allocation_days
        balance.save()

        # Update request status
        timeoff_request.status = 'APPROVED'
        timeoff_request.approved_by = request.user
        timeoff_request.save()

        # Get updated balances for the employee
        balances = TimeOffBalance.objects.filter(
            user=timeoff_request.employee,
            year=year
        ).select_related('timeoff_type')

        # Serialize response
        request_serializer = TimeOffRequestDetailSerializer(
            timeoff_request,
            context={'request': request}
        )
        balance_serializer = TimeOffBalanceSerializer(balances, many=True)

        return Response({
            'request': request_serializer.data,
            'balances': balance_serializer.data,
            'message': 'Time off request approved successfully'
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminOrHR])
def reject_timeoff_request(request, request_id):
    """
    POST /api/timeoff/admin/<uuid:request_id>/reject/
    Reject a time off request
    """
    timeoff_request = get_object_or_404(TimeOffRequest, id=request_id)

    if timeoff_request.status != 'PENDING':
        return Response(
            {
                'error': 'INVALID_STATUS',
                'detail': f'Cannot reject request with status: {timeoff_request.status}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get rejection reason from request body
    rejection_reason = request.data.get('rejection_reason', '')

    with transaction.atomic():
        # Update request status (no balance changes)
        timeoff_request.status = 'REJECTED'
        timeoff_request.approved_by = request.user
        timeoff_request.rejection_reason = rejection_reason
        timeoff_request.save()

        # Get balances for the employee
        year = timeoff_request.start_date.year
        balances = TimeOffBalance.objects.filter(
            user=timeoff_request.employee,
            year=year
        ).select_related('timeoff_type')

        # Serialize response
        request_serializer = TimeOffRequestDetailSerializer(
            timeoff_request,
            context={'request': request}
        )
        balance_serializer = TimeOffBalanceSerializer(balances, many=True)

        return Response({
            'request': request_serializer.data,
            'balances': balance_serializer.data,
            'message': 'Time off request rejected'
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrHR])
def get_employee_balances(request, employee_id):
    """
    GET /api/timeoff/admin/balances/<uuid:employee_id>/
    Get time off balances for a specific employee
    """
    from accounts.models import User
    
    employee = get_object_or_404(User, id=employee_id)
    year = request.query_params.get('year')

    if not year:
        year = datetime.now().year
    else:
        year = int(year)

    balances = TimeOffBalance.objects.filter(
        user=employee,
        year=year
    ).select_related('timeoff_type')

    serializer = TimeOffBalanceSerializer(balances, many=True)
    
    return Response({
        'employee_id': str(employee.id),
        'employee_name': employee.full_name,
        'year': year,
        'balances': serializer.data
    }, status=status.HTTP_200_OK)
