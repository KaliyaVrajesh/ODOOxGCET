from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from employees.models import EmployeeProfile
from employees.serializers import EmployeeCardSerializer, EmployeeDetailSerializer

class EmployeeListView(generics.ListAPIView):
    """
    GET /api/employees/
    List all employees with optional search
    Query params: search (filters by name or email)
    """
    serializer_class = EmployeeCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = EmployeeProfile.objects.select_related('user').all()
        
        # Only admins can see all employees
        if self.request.user.role != 'ADMIN':
            # Regular employees see only themselves
            queryset = queryset.filter(user=self.request.user)
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__full_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__login_id__icontains=search) |
                Q(job_title__icontains=search) |
                Q(department__icontains=search)
            )
        
        return queryset

class EmployeeDetailView(generics.RetrieveAPIView):
    """
    GET /api/employees/<uuid:user_id>/
    Get detailed employee information (view-only)
    """
    serializer_class = EmployeeDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user_id'

    def get_queryset(self):
        queryset = EmployeeProfile.objects.select_related('user').all()
        
        # Regular employees can only view their own profile
        if self.request.user.role != 'ADMIN':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            return self.get_queryset().get(user__id=user_id)
        except EmployeeProfile.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound('Employee profile not found')
