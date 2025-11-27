from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),  # برای تست
    path('api/', include('users.urls', namespace='users')),      # بعداً
    path('api/', include('courses.urls', namespace='courses')),  # بعداً
]