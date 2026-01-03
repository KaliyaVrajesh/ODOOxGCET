from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/timeoff/', include('timeoff.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = 'Dayflow HRMS Administration'
admin.site.site_title = 'Dayflow HRMS'
admin.site.index_title = 'Welcome to Dayflow HRMS'
