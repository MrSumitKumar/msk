# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from django.conf import settings
import logging

from .models import CustomUser, UserSession
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
)
from backend.utils import send_email

User = get_user_model()
logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
def check_phone_unique(request):
    phone = request.data.get('phone')
    exists = CustomUser.objects.filter(phone=phone).exists()
    return Response({'exists': exists})


@api_view(['POST'])
@permission_classes([AllowAny])
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
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier") or request.data.get("username")
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"detail": "Username/email/phone and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_obj = CustomUser.objects.filter(
            Q(username__iexact=identifier) |
            Q(email__iexact=identifier) |
            Q(phone__iexact=identifier)
        ).first()

        if not user_obj:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(request, username=user_obj.username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        with transaction.atomic():
            old_session = UserSession.objects.filter(user=user).first()
            if old_session:
                try:
                    RefreshToken(old_session.refresh_token).blacklist()
                except Exception:
                    pass
                old_session.delete()

            new_refresh = RefreshToken.for_user(user)
            new_access = new_refresh.access_token

            UserSession.objects.update_or_create(
                user=user,
                defaults={
                    "refresh_token": str(new_refresh),
                    "refresh_jti": str(new_refresh["jti"]),
                    "access_jti": str(new_access["jti"]),
                },
            )

            return Response({
                "id": user.id,
                "refresh": str(new_refresh),
                "access": str(new_access),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": getattr(user, "role", None),
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                },
            }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            UserSession.objects.filter(user=request.user, refresh_jti=token["jti"]).delete()

            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)

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


class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Password reset attempted for non-existent email: {email}")
            return Response({"error": "No account found with this email"}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        try:
            email_sent = send_email(
                to_email=user.email,
                subject="🔑 Reset your password - MSK Institute",
                text_body=f"""
                Hi {user.first_name or user.username},

                We received a request to reset your password for your MSK Institute account.
                Click the link below to set a new password: 

                {reset_link}

                If you did not request this, please ignore this email.
                Your account will remain secure.

                Best regards,
                MSK Institute Team
                """,
                html_template="emails/password_reset.html",
                context={
                    "first_name": user.first_name or user.username,
                    "reset_link": reset_link,
                    "now": timezone.now(),
                },
                fail_silently=False
            )

            if not email_sent:
                logger.error(f"Failed to send password reset email to {user.email}")
                return Response(
                    {"error": "Failed to send password reset email. Please try again later."}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            logger.info(f"Password reset email sent successfully to {user.email}")
        except Exception as e:
            logger.exception(f"Error sending password reset email to {user.email}: {str(e)}")
            return Response(
                {"error": "Failed to send password reset email. Please try again later."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)


class ResetPasswordConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, uidb64, token, *args, **kwargs):
        password = request.data.get("password")
        if not password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # --- Reset password ---
        user.set_password(password)
        user.save()

        # --- Send success email ---
        try:
            send_email(
                to_email=user.email,
                subject="✅ Your password has been reset - MSK Institute",
                text_body=f"""
                Hi {user.first_name or user.username},

                Your password has been successfully reset.
                You can now login to your MSK Institute account with your new password.

                If you did not make this change, please contact us immediately.

                Best regards,
                MSK Institute Team
                """,
                html_template="emails/password_reset_success.html",
                context={
                    "first_name": user.first_name or user.username,
                    "now": timezone.now(),
                },
            )
            logger.info(f"Password reset success email sent to {user.email}")
        except Exception as e:
            logger.exception(f"Failed to send password reset success email to {user.email}: {str(e)}")

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)

