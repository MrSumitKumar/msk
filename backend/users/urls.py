from django.urls import path
from .views import RegisterView, LogoutView, CurrentUserView, UserProfileUpdateView, LoginAPIView, check_phone_unique, CheckEmailExistsView

urlpatterns = [
    # 🔐 Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-phone/', check_phone_unique, name='check-phone'),
    path('check-email/', CheckEmailExistsView, name='check-email'),

    # 👤 Current Authenticated User Profile
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
]
