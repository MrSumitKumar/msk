# users/models.py
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        ADMIN = 'ADMIN', 'Admin'
        TEACHER = 'TEACHER', 'Teacher'
        MANAGER = 'MANAGER', 'Manager'
        SPONSOR = 'SPONSOR', 'Sponsor'
        MEMBER = 'MEMBER', 'Member'

    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
    
    class Status(models.TextChoices):
        INACTIVE = 'INACTIVE', 'Inactive'
        ACTIVE = 'ACTIVE', 'Active'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT, verbose_name='User Role')
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True, verbose_name='Phone Number')
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name='Address')
    picture = models.ImageField(blank=True, null=True, verbose_name='Profile Picture', upload_to='profiles')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='Date of Birth')
    gender = models.CharField(max_length=10, choices=Gender.choices, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.INACTIVE)
    is_approved = models.BooleanField(default=False, verbose_name='Is Approved')

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.is_staff = True
        elif self.role in [self.Role.ADMIN, self.Role.TEACHER]:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)

class UserSession(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    refresh_jti = models.CharField(max_length=255, blank=True, null=True)
    access_jti = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - session"

