from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from unittest import mock

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.registration_data = {
            'email': 'test@example.com',
            'phone': '1234567890',
            'password': 'TestPass123!',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'STUDENT'
        }
        # For direct user creation in tests (bypassing registration view)
        self.test_user_data = {
            'username': 'testuser',  # Required for direct user creation
            **self.registration_data
        }
        self.login_url = reverse('login')
        self.register_url = reverse('register')
        self.logout_url = reverse('logout')
        self.forgot_password_url = reverse('forgot-password')

    def test_user_registration(self):
        """Test user registration with valid data"""
        response = self.client.post(self.register_url, self.registration_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.registration_data['email']).exists())

    def test_user_registration_invalid_data(self):
        """Test user registration with invalid data"""
        invalid_data = self.registration_data.copy()
        invalid_data['email'] = 'invalid-email'
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """Test user login with username"""
        # Create a user first
        user = User.objects.create_user(**self.test_user_data)
        
        # Test login with username
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': self.test_user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Test login with email
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['email'],
            'password': self.test_user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test login with phone
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['phone'],
            'password': self.test_user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_logout(self):
        """Test user logout"""
        # Create and login user
        user = User.objects.create_user(**self.test_user_data)
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': self.test_user_data['password']
        })
        refresh_token = response.data['refresh']
        
        # Set authentication for subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        
        # Test logout
        response = self.client.post(self.logout_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    @mock.patch('users.views.send_email')
    def test_password_reset_flow(self, mock_send_email):
        """Test the complete password reset flow"""
        # Create a user
        user = User.objects.create_user(**self.test_user_data)
        user.is_active = True
        user.save()
        
        # Request password reset
        response = self.client.post(self.forgot_password_url, {
            'email': self.test_user_data['email']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(mock_send_email.called)
        
        # Generate reset token (simulating email link)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = reverse('password-reset-confirm', kwargs={'uidb64': uid, 'token': token})
        
        # Reset password
        new_password = 'NewTestPass123!'
        response = self.client.post(reset_url, {
            'password': new_password
        })
        if response.status_code != status.HTTP_200_OK:
            print(f"Reset password response: {response.status_code}")
            print(f"Response data: {response.data if hasattr(response, 'data') else 'No data'}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Wait for the user to be saved
        user.refresh_from_db()
        
        # Verify can login with new password
        response = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': new_password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_unique_fields(self):
        """Test endpoints that check for unique email and phone"""
        # Create initial user
        User.objects.create_user(**self.test_user_data)
        
        # Test email uniqueness
        response = self.client.post(reverse('check-email'), {
            'email': self.test_user_data['email']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['exists'])
        
        # Test phone uniqueness
        response = self.client.post(reverse('check-phone'), {
            'phone': self.test_user_data['phone']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['exists'])
        
        # Test with non-existing email
        response = self.client.post(reverse('check-email'), {
            'email': 'new@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['exists'])

    def test_single_session(self):
        """Test that logging in from a new device invalidates the old session"""
        # Create user and first login
        user = User.objects.create_user(**self.test_user_data)
        response1 = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': self.test_user_data['password']
        })
        first_access = response1.data['access']
        
        # Second login (simulating different device)
        response2 = self.client.post(self.login_url, {
            'identifier': self.test_user_data['username'],
            'password': self.test_user_data['password']
        })
        second_access = response2.data['access']
        
        # Try to use first token (should fail)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {first_access}')
        response = self.client.get(reverse('current_user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try to use second token (should succeed)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {second_access}')
        response = self.client.get(reverse('current_user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
