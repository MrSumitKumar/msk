# urls.py
from django.urls import path, include
from .views import *
from . import admin_urls
from .my_enrollments import MyEnrollmentsView

urlpatterns = [
    # 🔐 Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('check-phone/', check_phone_unique, name='check-phone'),
    path('check-email/', check_email_unique, name='check-email'),
    path('check-sponsor/', check_sponsor, name='check-sponsor'),

    # 👤 Profile
    path('me/', CurrentUserView.as_view(), name='current_user_alias'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
    
    # 📚 Enrollments
    path('my-enrollments/', MyEnrollmentsView.as_view(), name='my-enrollments'),

    # 🔑 Password Reset
    path('password/forgot/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('password/reset/<uidb64>/<token>/', ResetPasswordConfirmView.as_view(), name='password-reset-confirm'),

    # 👑 Admin routes grouped
    path('admin/', include(admin_urls)),
]
