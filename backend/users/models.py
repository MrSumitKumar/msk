# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('Student', 'student'),
        ('Admin', 'admin'),
        ('Teacher', 'teacher'),
        ('Manager', 'manager'),
        ('Sponsor', 'sponsor'),
        ('Member', 'member'),
    ]

    GENDER_CHOICES = [
        ('Male', 'male'),
        ('Female', 'female'),
    ]
    
    STATUS_CHOICES = [
        ('Inactive', 'inactive'),
        ('Active', 'active'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student', verbose_name='User Role')
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True, verbose_name='Phone Number')
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name='Address')
    picture = models.ImageField(blank=True, null=True, verbose_name='Profile Picture', upload_to='profiles')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='Date of Birth')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='inactive')

    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
        ordering = ['username']
    
    def __str__(self):
        return f"{self.username} ({self.role})"
