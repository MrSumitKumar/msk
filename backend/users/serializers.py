# users/serializers.py
from rest_framework import serializers
from .models import CustomUser
from backend.utils import generate_username
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'role', 'first_name', 'last_name', 'email', 'phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        username = generate_username(validated_data.get('first_name', 'user'))

        user = CustomUser.objects.create_user(
            username=username,
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            role=validated_data.get('role'),
            phone=validated_data.get('phone'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='get_role_display', read_only=True)
    gender = serializers.CharField(source='get_gender_display', read_only=True)
    status = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'role', 'phone', 'address',
            'picture', 'date_of_birth', 'gender', 'status', 'is_staff', 'is_superuser'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [ 'username', 'email', 'first_name', 'last_name',
            'phone', 'address', 'date_of_birth', 'gender', 'picture',
        ]
        read_only_fields = ['username', 'email']

    def get_picture(self, obj):
        request = self.context.get('request', None)
        if request and obj.picture:
            return request.build_absolute_uri(obj.picture.url)
        elif obj.picture:
            return obj.picture.url
        return None

    def update(self, instance, validated_data):
        # Allow image upload
        picture = self.context['request'].FILES.get('picture')
        if picture:
            instance.picture = picture

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

