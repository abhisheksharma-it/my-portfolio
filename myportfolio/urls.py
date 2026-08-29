from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('resume/', views.resume, name='resume'),
    path('contact/', views.contact, name='contact'),
    path('api/chatbot/', views.gemini_chatbot_api, name='gemini_chatbot'),
]
