from django.urls import path
from .views import *

urlpatterns = [
    # 🔐 Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-phone/', check_phone_unique, name='check-phone'),
    path('check-email/', check_email_unique, name='check-email'),
    path('check-sponsor/', check_sponsor, name='check-sponsor'),

    # 👤 Current Authenticated User Profile
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
]
