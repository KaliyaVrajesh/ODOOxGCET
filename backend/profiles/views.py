from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from profiles.models import ProfileDetail, Skill, Certification
from profiles.serializers import (
    MyProfileSerializer,
    SkillSerializer,
    CertificationSerializer
)

class MyProfileView(APIView):
    """
    GET /api/profile/me/
    Retrieve the authenticated user's complete profile
    
    PUT/PATCH /api/profile/me/
    Update the authenticated user's profile (header + private info fields)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = MyProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return self._update_profile(request, partial=False)

    def patch(self, request):
        return self._update_profile(request, partial=True)

    def _update_profile(self, request, partial=False):
        user = request.user
        serializer = MyProfileSerializer(user, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            # Return updated profile
            response_serializer = MyProfileSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_skill(request):
    """
    POST /api/profile/me/skills/
    Add a new skill to the authenticated user's profile
    
    Body: { "name": "Python", "level": "Expert" }
    """
    serializer = SkillSerializer(data=request.data)
    
    if serializer.is_valid():
        # Check if skill already exists for this user
        if Skill.objects.filter(user=request.user, name=serializer.validated_data['name']).exists():
            return Response(
                {'name': ['You already have this skill in your profile.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_skill(request, skill_id):
    """
    DELETE /api/profile/me/skills/<uuid:skill_id>/
    Remove a skill from the authenticated user's profile
    """
    skill = get_object_or_404(Skill, id=skill_id, user=request.user)
    skill.delete()
    return Response(
        {'message': 'Skill deleted successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_certification(request):
    """
    POST /api/profile/me/certifications/
    Add a new certification to the authenticated user's profile
    
    Body: {
        "title": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issued_date": "2023-06-15"
    }
    """
    serializer = CertificationSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_certification(request, certification_id):
    """
    DELETE /api/profile/me/certifications/<uuid:certification_id>/
    Remove a certification from the authenticated user's profile
    """
    certification = get_object_or_404(Certification, id=certification_id, user=request.user)
    certification.delete()
    return Response(
        {'message': 'Certification deleted successfully'},
        status=status.HTTP_200_OK
    )
