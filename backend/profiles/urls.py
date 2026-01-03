from django.urls import path
from profiles import views

app_name = 'profiles'

urlpatterns = [
    # Full profile (all tabs)
    path('me/full/', views.MyFullProfileView.as_view(), name='my-full-profile'),
    
    # Skills
    path('me/skills/', views.SkillListCreateView.as_view(), name='skill-list-create'),
    path('me/skills/<uuid:pk>/', views.SkillDetailView.as_view(), name='skill-detail'),
    
    # Certifications
    path('me/certifications/', views.CertificationListCreateView.as_view(), name='certification-list-create'),
    path('me/certifications/<uuid:pk>/', views.CertificationDetailView.as_view(), name='certification-detail'),
    
    # Salary (Admin/HR only)
    path('me/salary/', views.MySalaryView.as_view(), name='my-salary'),
]
