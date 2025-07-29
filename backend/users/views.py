# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated


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

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LoginAPIView(APIView):
    def post(self, request):
        identifier = request.data.get("username")  # can be username/email/phone
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
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role if hasattr(user, 'role') else None,
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
        user = request.user
        serializer = UserSerializer(user)
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
