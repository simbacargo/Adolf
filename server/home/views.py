from rest_framework import serializers
from .models import Member

from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    # Map the JSON keys (camelCase) to the Model fields (snake_case)
    fullName = serializers.CharField(source='full_name')
    maritalStatus = serializers.CharField(source='marital_status')
    regDate = serializers.DateField(source='reg_date')
    expDate = serializers.DateField(source='exp_date')
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = Member
        fields = [
            'id', 'fullName', 'age', 'sex', 'maritalStatus', 
            'children', 'phone', 'regDate', 'expDate', 'is_active'
        ]


from rest_framework import viewsets, filters

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    # Add built-in search functionality
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'phone']
    ordering_fields = ['full_name', 'reg_date', 'exp_date']



from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from rest_framework import serializers
from django.contrib.auth.models import User
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

# 1. Login API
class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)

# 2. Change Password API
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # Set new password
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "success", "message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)