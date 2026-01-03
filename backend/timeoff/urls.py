from django.urls import path
from . import views

urlpatterns = [
    # Employee endpoints
    path('me/', views.MyTimeOffView.as_view(), name='my_timeoff'),
    
    # Admin/HR endpoints
    path('admin/', views.AdminTimeOffListView.as_view(), name='admin_timeoff_list'),
    path('admin/<uuid:request_id>/approve/', views.approve_timeoff_request, name='approve_timeoff'),
    path('admin/<uuid:request_id>/reject/', views.reject_timeoff_request, name='reject_timeoff'),
    path('admin/balances/<uuid:employee_id>/', views.get_employee_balances, name='employee_balances'),
]
