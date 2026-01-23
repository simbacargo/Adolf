from django.urls import path, include
from rest_framework.routers import DefaultRouter
from home.views import MemberViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]