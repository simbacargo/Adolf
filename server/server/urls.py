from django.urls import path, include
from rest_framework.routers import DefaultRouter
from home.views import MemberViewSet
from knox import views as knox_views
from home.views import LoginAPI, ChangePasswordView
router = DefaultRouter()
router.register(r'members', MemberViewSet)

urlpatterns = [
    path('api/', include(router.urls)),


    # Login endpoint
    path('api/login/', LoginAPI.as_view(), name='login'),
    
    # Logout endpoint (built into Knox)
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    
    # Change Password endpoint
    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
]