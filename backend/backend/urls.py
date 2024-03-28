"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from CSDS393PROJECT import views

from rest_framework.urlpatterns import format_suffix_patterns
#router = routers.DefaultRouter()
#router.register(r'UserProfile', views.ProfileView, 'Profiles')
#router.register(r'EventDatabase', views.EventView, 'Events')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('profiles/', views.ProfileView),
    path('EventDatabase/', views.EventView),
    path('profiles/<int:pk>/', views.ProfileUpdate),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
]

urlpatterns= format_suffix_patterns(urlpatterns)
