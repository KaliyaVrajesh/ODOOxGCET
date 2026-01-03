from rest_framework import serializers
from django.db import transaction
from profiles.models import ProfileDetail, Skill, Certification
from accounts.models import User

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        read_only_fields = ['id']

    def create(self, validated_data):
        # User will be set in the view
        return super().create(validated_data)

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuer', 'issued_date']
        read_only_fields = ['id']

    def create(self, validated_data):
        # User will be set in the view
        return super().create(validated_data)

class ProfileDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for ProfileDetail model (header + private info fields)
    """
    class Meta:
        model = ProfileDetail
        fields = [
            'job_position', 'department', 'manager_name', 'location',
            'about', 'what_i_love', 'interests_and_hobbies'
        ]

class MyProfileSerializer(serializers.Serializer):
    """
    Nested serializer for the complete My Profile view.
    Combines User fields, ProfileDetail, Skills, and Certifications.
    """
    # Basic header info from User
    id = serializers.UUIDField(source='user.id', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    login_id = serializers.CharField(source='user.login_id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    company_name = serializers.CharField(source='user.company_name', read_only=True)
    
    # Profile detail fields (editable)
    job_position = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    manager_name = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    
    # Private info fields (editable)
    about = serializers.CharField(required=False, allow_blank=True)
    what_i_love = serializers.CharField(required=False, allow_blank=True)
    interests_and_hobbies = serializers.CharField(required=False, allow_blank=True)
    
    # Related data (read-only in this serializer)
    skills = SkillSerializer(many=True, read_only=True, source='user.skills')
    certifications = CertificationSerializer(many=True, read_only=True, source='user.certifications')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If instance is a User, wrap it in a dict-like object
        if isinstance(self.instance, User):
            self.instance = {'user': self.instance}

    def to_representation(self, instance):
        """
        Custom representation to handle both User and ProfileDetail instances
        """
        if isinstance(instance, dict):
            user = instance.get('user')
            profile = getattr(user, 'profile_detail', None)
        else:
            profile = instance
            user = profile.user if hasattr(instance, 'user') else instance

        # Get or create profile detail
        if not hasattr(user, 'profile_detail'):
            profile, _ = ProfileDetail.objects.get_or_create(user=user)
        else:
            profile = user.profile_detail

        return {
            'id': str(user.id),
            'full_name': user.full_name,
            'login_id': user.login_id,
            'email': user.email,
            'phone': user.phone,
            'company_name': user.company_name,
            'job_position': profile.job_position,
            'department': profile.department,
            'manager_name': profile.manager_name,
            'location': profile.location,
            'about': profile.about,
            'what_i_love': profile.what_i_love,
            'interests_and_hobbies': profile.interests_and_hobbies,
            'skills': SkillSerializer(user.skills.all(), many=True).data,
            'certifications': CertificationSerializer(user.certifications.all(), many=True).data,
        }

    def update(self, instance, validated_data):
        """
        Update ProfileDetail fields only (User fields are read-only)
        """
        user = instance if isinstance(instance, User) else instance.user
        
        # Get or create profile detail
        profile, _ = ProfileDetail.objects.get_or_create(user=user)
        
        # Update profile detail fields
        profile.job_position = validated_data.get('job_position', profile.job_position)
        profile.department = validated_data.get('department', profile.department)
        profile.manager_name = validated_data.get('manager_name', profile.manager_name)
        profile.location = validated_data.get('location', profile.location)
        profile.about = validated_data.get('about', profile.about)
        profile.what_i_love = validated_data.get('what_i_love', profile.what_i_love)
        profile.interests_and_hobbies = validated_data.get('interests_and_hobbies', profile.interests_and_hobbies)
        
        profile.save()
        
        return user
