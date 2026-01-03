from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import (
    AdminSignUpSerializer,
    SignInSerializer,
    AuthTokenResponseSerializer
)

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
