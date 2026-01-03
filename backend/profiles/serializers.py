from rest_framework import serializers
from django.db import transaction
from profiles.models import (
    ProfileDetail, Skill, Certification, 
    ResumeDetail, BankDetail, SalaryStructure
)
from accounts.models import User


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        read_only_fields = ['id']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuer', 'issued_date']
        read_only_fields = ['id']


class ProfileDetailSerializer(serializers.ModelSerializer):
    """Header + Private Info fields"""
    class Meta:
        model = ProfileDetail
        fields = [
            'job_position', 'department', 'manager_name', 'location',
            'about', 'what_i_love', 'interests_and_hobbies'
        ]


class ResumeDetailSerializer(serializers.ModelSerializer):
    """Resume tab - personal details"""
    class Meta:
        model = ResumeDetail
        fields = [
            'address', 'personal_email', 'gender', 'marital_status',
            'date_of_joining', 'date_of_birth'
        ]


class BankDetailSerializer(serializers.ModelSerializer):
    """Bank details for salary"""
    class Meta:
        model = BankDetail
        fields = ['bank_account_number', 'bank_name', 'ifsc_code', 'upi_id']


class SalaryStructureSerializer(serializers.ModelSerializer):
    """Salary structure with calculated fields"""
    hra_calculated = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    standard_allowance_calculated = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    gross_salary = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    pf_contribution = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_deductions = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    net_salary = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    annual_salary = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = SalaryStructure
        fields = [
            'basic_salary', 'hra_percentage', 'hra_fixed',
            'standard_allowance_percentage', 'performance_bonus',
            'leave_travel_allowance', 'pf_percentage', 'professional_tax',
            'income_tax', 'monthly_working_days', 'weeks_per_month', 'year',
            # Calculated fields
            'hra_calculated', 'standard_allowance_calculated', 'gross_salary',
            'pf_contribution', 'total_deductions', 'net_salary', 'annual_salary'
        ]



class FullProfileSerializer(serializers.Serializer):
    """
    Complete profile with all tabs: Header, Resume, Private Info, Bank, Salary
    """
    # User basic info (read-only)
    id = serializers.UUIDField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    login_id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    phone = serializers.CharField(read_only=True)
    company_name = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    
    # Profile detail (header + private info)
    profile = ProfileDetailSerializer(required=False)
    
    # Resume tab
    resume = ResumeDetailSerializer(required=False)
    
    # Bank details
    bank = BankDetailSerializer(required=False)
    
    # Salary (admin only)
    salary = SalaryStructureSerializer(required=False)
    
    # Skills and certifications
    skills = SkillSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)
    
    def to_representation(self, instance):
        """Build complete profile representation"""
        user = instance if isinstance(instance, User) else instance.user
        
        # Get or create related models
        profile, _ = ProfileDetail.objects.get_or_create(user=user)
        resume, _ = ResumeDetail.objects.get_or_create(user=user)
        bank, _ = BankDetail.objects.get_or_create(user=user)
        
        data = {
            'id': str(user.id),
            'full_name': user.full_name,
            'login_id': user.login_id,
            'email': user.email,
            'phone': user.phone,
            'company_name': user.company_name,
            'role': user.role,
            'profile': ProfileDetailSerializer(profile).data,
            'resume': ResumeDetailSerializer(resume).data,
            'bank': BankDetailSerializer(bank).data,
            'skills': SkillSerializer(user.skills.all(), many=True).data,
            'certifications': CertificationSerializer(user.certifications.all(), many=True).data,
        }
        
        # Include salary only for admin/HR
        request = self.context.get('request')
        if request and request.user.role in ['ADMIN', 'HR']:
            try:
                salary = user.salary_structure
                data['salary'] = SalaryStructureSerializer(salary).data
            except SalaryStructure.DoesNotExist:
                data['salary'] = None
        
        return data
    
    @transaction.atomic
    def update(self, instance, validated_data):
        """Update all profile sections"""
        user = instance if isinstance(instance, User) else instance.user
        
        # Update profile detail
        if 'profile' in validated_data:
            profile, _ = ProfileDetail.objects.get_or_create(user=user)
            profile_data = validated_data.pop('profile')
            for key, value in profile_data.items():
                setattr(profile, key, value)
            profile.save()
        
        # Update resume
        if 'resume' in validated_data:
            resume, _ = ResumeDetail.objects.get_or_create(user=user)
            resume_data = validated_data.pop('resume')
            for key, value in resume_data.items():
                setattr(resume, key, value)
            resume.save()
        
        # Update bank
        if 'bank' in validated_data:
            bank, _ = BankDetail.objects.get_or_create(user=user)
            bank_data = validated_data.pop('bank')
            for key, value in bank_data.items():
                setattr(bank, key, value)
            bank.save()
        
        # Update salary (admin only)
        if 'salary' in validated_data:
            request = self.context.get('request')
            if request and request.user.role in ['ADMIN', 'HR']:
                salary, _ = SalaryStructure.objects.get_or_create(user=user)
                salary_data = validated_data.pop('salary')
                for key, value in salary_data.items():
                    setattr(salary, key, value)
                salary.save()
        
        return user
