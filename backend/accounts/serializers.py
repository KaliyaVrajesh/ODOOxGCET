import re
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'login_id', 'company_name', 'full_name', 'email', 'phone', 'role']
        read_only_fields = ['id', 'login_id']

class AdminSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['company_name', 'full_name', 'email', 'phone', 'password', 'confirm_password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_password(self, value):
        """
        Validate password:
        - Minimum 8 characters
        - At least one number
        - At least one letter
        """
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long.')
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError('Password must contain at least one number.')
        
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError('Password must contain at least one letter.')
        
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            company_name=validated_data['company_name'],
            full_name=validated_data['full_name'],
            phone=validated_data['phone'],
            role='ADMIN',
            is_staff=True,
            is_active=True
        )
        return user

class SignInSerializer(serializers.Serializer):
    login_identifier = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        login_identifier = data.get('login_identifier')
        password = data.get('password')

        if not login_identifier or not password:
            raise serializers.ValidationError('Login identifier and password are required.')

        # Try to find user by login_id first, then by email
        user = None
        try:
            user = User.objects.get(login_id=login_identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=login_identifier)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('INVALID_CREDENTIALS')

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError('INVALID_CREDENTIALS')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        data['user'] = user
        return data

class AuthTokenResponseSerializer(serializers.Serializer):
    user = UserResponseSerializer(read_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    @staticmethod
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['login_id'] = user.login_id
        
        return {
            'user': UserResponseSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
