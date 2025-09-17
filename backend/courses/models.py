# courses/models.py

from django.urls import reverse
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_save, post_delete
from django.db import models, transaction
from django.dispatch import receiver
from django.utils.timezone import now
from datetime import timedelta
from celery import shared_task
import os
import logging
from decimal import Decimal
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model
from django.db.models import Avg
from typing import Optional
import re
import json


User = get_user_model()
logger = logging.getLogger(__name__)

# ----------------------------------
# Constants & Global Config
# ----------------------------------

# Default EMI discounts (months -> percentage)
DEFAULT_EMI_DISCOUNTS = {
    2: Decimal("10.0"),
    3: Decimal("8.0"),
    4: Decimal("6.0"),
    5: Decimal("4.0"),
    6: Decimal("2.0"),
}

# Default OTP discount if PlatformSettings is not present
DEFAULT_OTP_DISCOUNT = Decimal("10.00")

def validate_youtube_url(value):
    youtube_regex = (
        r'^(https?://)?(www\.)?'
        r'(youtube\.com/watch\?v=|youtu\.be/)'
        r'[\w-]{11}($|&)'
    )
    if not re.search(youtube_regex, value):
        raise ValidationError("Only valid YouTube URLs are allowed.")


class PlatformSettings(models.Model):
    """Global settings for the courses platform. Only one instance allowed."""
    otp_discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('10.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
            MaxValueValidator(Decimal('100.00'))
        ],
        help_text="OTP (one-time-payment) discount percentage for all courses."
    )
    referral_distribution = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
            MaxValueValidator(Decimal('100.00'))
        ],
        help_text="Referral distribution percentage for the platform."
    )
    default_emi_discounts = models.TextField(
        default="[]",
        help_text="Default EMI discounts for all courses. Example: [{'months': 3, 'discount': 5}]"
    )

    def set_default_emi_discounts(self, data_list):
        """Save list as JSON string."""
        self.default_emi_discounts = json.dumps(data_list)

    def get_default_emi_discounts(self):
        """Return JSON string as Python list."""
        try:
            return json.loads(self.default_emi_discounts)
        except json.JSONDecodeError:
            return []

    def save(self, *args, **kwargs):
        """Ensure only one PlatformSettings instance exists."""
        if not self.pk and PlatformSettings.objects.exists():
            raise ValidationError("Only one PlatformSettings instance allowed.")
        return super().save(*args, **kwargs)

    def __str__(self):
        return "Platform Settings"

    class Meta:
        verbose_name = "Platform Settings"
        verbose_name_plural = "Platform Settings"


# ----------------------------------
# Core Metadata Models
# ----------------------------------

class Level(models.Model):
    """
    Like: Beginner, Intermediate, Beginner to Intermediate
    """
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        verbose_name = "Level"
        verbose_name_plural = "Levels"
        ordering = ['name']

    def __str__(self):
        return self.name


class Category(models.Model):
    """
    Like: Web Designing, Software Development
    """
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Language(models.Model):
    """
    Like: Hindi, English
    """
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages"
        ordering = ['name']

    def __str__(self):
        return self.name


class ProgrammingLanguage(models.Model):
    """
    Like: Python, Java
    """
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Programming Language"
        verbose_name_plural = "Programming Languages"
        ordering = ['name']

    def __str__(self):
        return self.name


# ----------------------------------
# Course Model & Related
# ----------------------------------

class Course(models.Model):
    class StatusChoices(models.TextChoices):
        PUBLISH = 'PUBLISH', 'Publish'
        DRAFT = 'DRAFT', 'Draft'

    class ModeChoices(models.TextChoices):
        ONLINE = 'ONLINE', 'Online'
        OFFLINE = 'OFFLINE', 'Offline'
        BOTH = 'BOTH', 'Both'

    class CourseTypeChoices(models.TextChoices):
        SINGLE = 'SINGLE', 'Single Course'
        COMBO = 'COMBO', 'Combo Course'

    status = models.CharField(choices=StatusChoices.choices, max_length=10, default=StatusChoices.DRAFT)
    featured_image = models.ImageField(upload_to="course/poster/", blank=True)

    featured_video = models.URLField(max_length=255, null=True, blank=True, validators=[validate_youtube_url])
    title = models.CharField(max_length=500, unique=True)
    sort_description = models.TextField(null=True, blank=True)
    github_readme_link = models.URLField(blank=True, null=True)
    categories = models.ManyToManyField(Category,  blank=True, related_name="courses")
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    language = models.ManyToManyField(Language, blank=True, related_name="courses")
    duration = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))] )
    discount = models.DecimalField(max_digits=5,decimal_places=2,default=Decimal('0.00'),null=False,blank=False,validators=[MinValueValidator(Decimal('0.00')),MaxValueValidator(Decimal('100.00'))])
    discount_end_date = models.DateField(null=True, blank=True)

    certificate = models.BooleanField(default=False)
    mode = models.CharField(choices=ModeChoices.choices, max_length=10, default=ModeChoices.ONLINE)
    course_type = models.CharField(choices=CourseTypeChoices.choices, max_length=10, default=CourseTypeChoices.SINGLE)
    single_courses = models.ManyToManyField('self', blank=True, related_name="combo_courses", symmetrical=False)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("course_details", kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

@receiver(pre_save, sender=Course)
def generate_course_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.title)
        slug = base_slug
        while Course.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
            slug = f"{base_slug}-{get_random_string(4)}"
        instance.slug = slug

@receiver(post_delete, sender=Course)
def delete_course_image(sender, instance, **kwargs):
    default_img = "course/poster/default.jpg"
    if instance.featured_image and instance.featured_image.name != default_img:
        try:
            file_path = instance.featured_image.path
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            logger.exception("Failed to delete course image for Course id=%s", getattr(instance, 'pk', None))


class CourseChapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class ChapterTopic(models.Model):
    chapter = models.ForeignKey(CourseChapter, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    notes_url = models.URLField(null=True, blank=True)  # use link (e.g., notes hosted on GitHub)

    def __str__(self):
        return f"{self.chapter.course.title} - {self.chapter.title} - {self.title}"



# ----------------------------------
# Enrollment & Payment Models
# ----------------------------------


class CourseReview(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['course', 'user'], name='unique_course_user_review')
        ]
        verbose_name = 'Course Review'
        verbose_name_plural = 'Course Reviews'

    def __str__(self):
        return f"{self.user.username} - {self.course.title} ({self.rating}★)"

    def clean(self):
        if not (1 <= self.rating <= 5):
            raise ValidationError("Rating must be between 1 and 5.")

    @property
    def is_edited(self):
        return self.created_at != self.updated_at


# ----------------------------------
# Enrollment & Payment Models
# ----------------------------------

class Enrollment(models.Model):
    class PaymentMethod(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        ONE_TIME = 'one_time', 'One-Time Payment'

    class StatusChoices(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name="enrollments")

    enrollment_no = models.BigIntegerField(unique=True, null=True, blank=True, default=None)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_due_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    payment_complete = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.MONTHLY)
    is_active = models.BooleanField(default=True)
    certificate = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)

    enrolled_at = models.DateField(null=True, blank=True)
    end_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.course.title} - {self.status}"

    @transaction.atomic
    def save(self, *args, **kwargs):
        if not self.enrollment_no:
            from backend.utils import generate_random_numbers
            enrollment_number = generate_random_numbers(12)
            while Enrollment.objects.filter(enrollment_no=enrollment_number).exists():
                enrollment_number = generate_random_numbers(12)
            self.enrollment_no = enrollment_number
        super().save(*args, **kwargs)

    @property
    def payment_status(self):
        return "Completed" if self.payment_complete else "Pending"


class EnrollmentFeeHistory(models.Model):
    class FeePaymentMethod(models.TextChoices):
        ONLINE = 'online', 'Online'
        OFFLINE = 'offline', 'Offline'

    class FeePaymentGateway(models.TextChoices):
        PAYTM = 'paytm', 'Paytm'
        PHONEPE = 'phonepe', 'PhonePe'
        GOOGLEPAY = 'googlepay', 'Google Pay'
        UPI = 'upi', 'UPI'
        CASH = 'cash', 'Cash'
        BANK = 'bank', 'Bank Transfer'
        OTHER = 'other', 'Other'

    enrollment = models.ForeignKey('Enrollment', on_delete=models.CASCADE, related_name="fee_histories")
    transaction_id = models.CharField(max_length=100, null=True, blank=True, help_text="Payment transaction reference number")
    payment_method = models.CharField(max_length=10, choices=FeePaymentMethod.choices, default=FeePaymentMethod.ONLINE)
    payment_gateway = models.CharField(max_length=20, choices=FeePaymentGateway.choices, default=FeePaymentGateway.UPI)
    gateway_note = models.CharField(max_length=255, null=True, blank=True, help_text="Additional details like UPI handle, bank name, etc.")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment} | {self.amount} | {self.payment_gateway}"


class EnrollmentFeeSubmitRequest(models.Model):
    class RequestStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    enrollment = models.ForeignKey('Enrollment', on_delete=models.CASCADE, related_name="fee_submit_requests")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_gateway = models.CharField(max_length=20, choices=EnrollmentFeeHistory.FeePaymentGateway.choices)
    payment_method = models.CharField(max_length=10, choices=EnrollmentFeeHistory.FeePaymentMethod.choices)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    gateway_note = models.CharField(max_length=255, null=True, blank=True)
    proof_image = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=RequestStatus.choices, default=RequestStatus.PENDING)
    admin_note = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.enrollment.user} | ₹{self.amount} | {self.status}"

    @transaction.atomic
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        old_status = None

        if not is_new:
            old_status = EnrollmentFeeSubmitRequest.objects.filter(pk=self.pk).values_list("status", flat=True).first()

        super().save(*args, **kwargs)

        # Only act if status just changed to APPROVED
        if old_status != self.status and self.status == self.RequestStatus.APPROVED:
            # 1. Create Fee History
            EnrollmentFeeHistory.objects.create(
                enrollment=self.enrollment,
                payment_method=self.payment_method,
                payment_gateway=self.payment_gateway,
                amount=self.amount,
                transaction_id=self.transaction_id,
                gateway_note=self.gateway_note,
            )

            # 2. Update Enrollment amounts
            enrollment = self.enrollment
            enrollment.total_paid_amount += self.amount
            enrollment.total_due_amount = max(enrollment.amount - enrollment.total_paid_amount, 0)

            # If fully paid, mark as complete
            if enrollment.total_paid_amount >= enrollment.amount:
                enrollment.payment_complete = True

            enrollment.save()
