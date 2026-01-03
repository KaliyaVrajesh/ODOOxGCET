from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import transaction

from profiles.models import Skill, Certification, SalaryStructure
from profiles.serializers import (
    FullProfileSerializer, SkillSerializer, CertificationSerializer,
    SalaryStructureSerializer
)


class MyFullProfileView(APIView):
    """
    GET/PUT/PATCH /api/profile/me/full/
    Complete profile with all tabs
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = FullProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request):
        serializer = FullProfileSerializer(
            request.user, 
            data=request.data, 
            partial=False,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        serializer = FullProfileSerializer(
            request.user, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SkillListCreateView(generics.ListCreateAPIView):
    """
    GET/POST /api/profile/me/skills/
    """
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/PATCH/DELETE /api/profile/me/skills/<id>/
    """
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)


class CertificationListCreateView(generics.ListCreateAPIView):
    """
    GET/POST /api/profile/me/certifications/
    """
    serializer_class = CertificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certification.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CertificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/PATCH/DELETE /api/profile/me/certifications/<id>/
    """
    serializer_class = CertificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Certification.objects.filter(user=self.request.user)


class MySalaryView(APIView):
    """
    GET/PUT /api/profile/me/salary/
    Admin/HR only
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role not in ['ADMIN', 'HR']:
            return Response(
                {'error': 'Only Admin/HR can view salary information'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            salary = request.user.salary_structure
            serializer = SalaryStructureSerializer(salary)
            return Response(serializer.data)
        except SalaryStructure.DoesNotExist:
            return Response(
                {'error': 'Salary structure not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request):
        if request.user.role not in ['ADMIN', 'HR']:
            return Response(
                {'error': 'Only Admin/HR can update salary information'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        salary, created = SalaryStructure.objects.get_or_create(user=request.user)
        serializer = SalaryStructureSerializer(salary, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
