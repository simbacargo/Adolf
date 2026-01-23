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