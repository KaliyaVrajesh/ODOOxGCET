from django.urls import path
from attendance import views

app_name = 'attendance'

urlpatterns = [
    # Check-in/out
    path('check-in/', views.CheckInView.as_view(), name='check-in'),
    path('check-out/', views.CheckOutView.as_view(), name='check-out'),
    path('current/', views.CurrentStatusView.as_view(), name='current-status'),
    
    # Admin view - day attendance
    path('admin/day/', views.AdminDayAttendanceView.as_view(), name='admin-day'),
    
    # Employee view - month attendance
    path('me/month/', views.EmployeeMonthAttendanceView.as_view(), name='employee-month'),
]
