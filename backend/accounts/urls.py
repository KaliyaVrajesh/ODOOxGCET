from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('admin/signup/', views.admin_signup, name='admin_signup'),
    path('signin/', views.signin, name='signin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Employee Management (Admin/HR only)
    path('create-employee/', views.create_employee, name='create_employee'),
    path('list-employees/', views.list_employees, name='list_employees'),
    
    # Password Management
    path('change-password/', views.change_password, name='change_password'),
    path('check-first-login/', views.check_first_login, name='check_first_login'),
]
