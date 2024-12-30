from django.contrib import admin
from django.urls import path, include, re_path
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.shortcuts import render

# Serve the React app for all non-API requests
def serve_react_app(request, path=''):
    return render(request, 'index.html')  # Ensure this is the correct path to your React app's index.html

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API routes
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    
    # Serve the React app for all other routes
    re_path(r'^.*$', serve_react_app), # This will catch all non-API requests
]
