# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

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

    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    def save(self, *args, **kwargs):
        if self.role in [self.Role.ADMIN, self.Role.TEACHER]:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)

