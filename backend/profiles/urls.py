from django.urls import path
from . import views

urlpatterns = [
    # My Profile
    path('me/', views.MyProfileView.as_view(), name='my_profile'),
    
    # Skills management
    path('me/skills/', views.add_skill, name='add_skill'),
    path('me/skills/<uuid:skill_id>/', views.delete_skill, name='delete_skill'),
    
    # Certifications management
    path('me/certifications/', views.add_certification, name='add_certification'),
    path('me/certifications/<uuid:certification_id>/', views.delete_certification, name='delete_certification'),
]
