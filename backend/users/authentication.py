from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import UserSession

class EnforceSingleSessionAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Agar header hi na ho → skip
        header = self.get_header(request)
        if header is None:
            return None

        user_auth_tuple = super().authenticate(request)
        if user_auth_tuple is None:
            return None

        user, validated_token = user_auth_tuple
        jti = validated_token.get("jti")

        try:
            session = UserSession.objects.get(user=user)
        except UserSession.DoesNotExist:
            raise AuthenticationFailed("Session does not exist.")

        if str(session.access_jti) != str(jti):
            raise AuthenticationFailed("Session expired. Logged in from another device.")

        return user, validated_token
