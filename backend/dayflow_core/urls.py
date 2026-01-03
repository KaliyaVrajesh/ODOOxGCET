from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
]

admin.site.site_header = 'Dayflow HRMS Administration'
admin.site.site_title = 'Dayflow HRMS'
admin.site.index_title = 'Welcome to Dayflow HRMS'
