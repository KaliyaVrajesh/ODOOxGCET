from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import (
    AdminSignUpSerializer,
    SignInSerializer,
    AuthTokenResponseSerializer,
    CreateEmployeeSerializer,
    ChangePasswordSerializer,
    EmployeeListSerializer
)
from .models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_signup(request):
    """
    Admin/HR Sign Up endpoint
    Creates a new admin user with auto-generated login_id
    """
    serializer = AdminSignUpSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        token_data = AuthTokenResponseSerializer.get_tokens_for_user(user)
        return Response(token_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    """
    Sign In endpoint
    Accepts login_id or email as login_identifier
    """
    serializer = SignInSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token_data = AuthTokenResponseSerializer.get_tokens_for_user(user)
        return Response(token_data, status=status.HTTP_200_OK)
    
    errors = serializer.errors
    if 'non_field_errors' in errors and 'INVALID_CREDENTIALS' in str(errors['non_field_errors']):
        return Response(
            {
                'error': 'INVALID_CREDENTIALS',
                'detail': 'Invalid login credentials. Please check your login ID/email and password.'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    """
    Create new employee endpoint (Admin/HR only)
    Auto-generates login_id and password
    Returns the generated password in response
    """
    # Check if user is Admin or HR
    if request.user.role not in ['ADMIN', 'HR']:
        return Response(
            {'error': 'Permission denied. Only Admin or HR can create employees.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = CreateEmployeeSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Employee created successfully',
            'user': {
                'id': str(user.id),
                'login_id': user.login_id,
                'full_name': user.full_name,
                'email': user.email,
                'phone': user.phone,
                'role': user.role,
                'date_of_joining': user.date_of_joining,
            },
            'generated_password': user.generated_password,
            'note': 'Please share this password with the employee. They must change it on first login.'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change password endpoint
    For first-time login, old_password is not required
    For subsequent changes, old_password is required
    """
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Password changed successfully',
            'is_first_login': False
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_employees(request):
    """
    List all employees (Admin/HR only)
    """
    # Check if user is Admin or HR
    if request.user.role not in ['ADMIN', 'HR']:
        return Response(
            {'error': 'Permission denied. Only Admin or HR can view all employees.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    employees = User.objects.all().order_by('-date_joined')
    serializer = EmployeeListSerializer(employees, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_first_login(request):
    """
    Check if user needs to change password (first login)
    """
    return Response({
        'is_first_login': request.user.is_first_login,
        'login_id': request.user.login_id,
        'full_name': request.user.full_name
    }, status=status.HTTP_200_OK)
