# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from mlm.models import *
from .serializers import *
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from backend.utils import *
from django.utils import timezone
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal
from rest_framework.authtoken.models import Token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def check_sponsor(request):
    username = request.data.get('username')
    try:
        sponsor = CustomUser.objects.get(username=username)
        sponsor_member = sponsor.mlm_profile
        left_team_size = sponsor_member.left_count
        right_team_size = sponsor_member.right_count
        return Response({
            'exists': True,
            'details': {
                'name': f"{sponsor.first_name} {sponsor.last_name}".strip(),
                'left_team_size': left_team_size,
                'right_team_size': right_team_size,
                'recommended_position': 'Left' if left_team_size <= right_team_size else 'Right'
            }
        })
    except CustomUser.DoesNotExist:
        return Response({'exists': False}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def check_phone_unique(request):
    phone = request.data.get('phone')
    exists = CustomUser.objects.filter(phone=phone).exists()
    return Response({'exists': exists})

@api_view(['POST'])
def check_email_unique(request):
    email = request.data.get('email')
    exists = CustomUser.objects.filter(email=email).exists()
    return Response({'exists': exists})


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        response_data = serializer.save()
        user = CustomUser.objects.get(username=response_data['user']['username'])

        try:
            send_email(
                to_email=user.email,
                subject="🎉 Welcome to MSK Institute",
                text_body=f"Hi {user.first_name or user.username},\n\nWelcome to MSK Institute!",
                html_template="emails/welcome.html",
                context={
                    "first_name": user.first_name,
                    "username": user.username,
                    "now": timezone.now(),
                }
            )
            logger.info(f"Welcome email sent to {user.email}")
        except Exception as e:
            logger.exception(f"Failed to send welcome email to {user.email}: {str(e)}")

        return response_data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class LoginAPIView(APIView):
    def post(self, request):
        identifier = request.data.get("identifier") or request.data.get("username")  # can be username/email/phone
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"detail": "Username and password are required."}, status=400)

        user = authenticate(request, username=identifier, password=password)
        if not user:
            user_obj = CustomUser.objects.filter(phone__iexact=identifier).first()
            if user_obj:
                user = authenticate(request, username=user_obj.username, password=password)            
                if not user:
                    user_obj = CustomUser.objects.filter(email__iexact=identifier).first()
                    if user_obj:
                        user = authenticate(request, username=user_obj.username, password=password)
                    

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "id": user.id,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role if hasattr(user, 'role') else None,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                },
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": f"Logout failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data, context={'request': request}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
