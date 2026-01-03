from django.urls import path
from . import views

urlpatterns = [
    path('', views.EmployeeListView.as_view(), name='employee_list'),
    path('<uuid:user_id>/', views.EmployeeDetailView.as_view(), name='employee_detail'),
]
