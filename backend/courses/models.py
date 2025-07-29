# courses/models.py
from django.urls import reverse
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_save, post_delete
from django.db.models import Avg, Count, F
from backend.utils import send_email, generate_random_numbers
from django.dispatch import receiver
from django.utils.timezone import now, timedelta
from celery import shared_task
import os, uuid
from django.conf import settings
from decimal import Decimal
from django.db import models, transaction
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model
from django.db.models import F, Q

User = get_user_model()

# ----------------------------------
# Constants & Global Config
# ----------------------------------

DEFAULT_EMI_DISCOUNTS = {
    2: Decimal("10.0"),
    3: Decimal("8.0"),
    4: Decimal("6.0"),
    5: Decimal("4.0"),
    6: Decimal("2.0"),
}



# ----------------------------------
# Core Metadata Models
# ----------------------------------

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


class Label(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class CourseLanguage(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# ----------------------------------
# Course Model & Related
# ----------------------------------

class Course(models.Model):
    class Status(models.TextChoices):
        PUBLISH = 'PUBLISH', 'Publish'
        DRAFT = 'DRAFT', 'Draft'

    class CertificateChoices(models.TextChoices):
        YES = 'YES', 'Yes'
        NO = 'NO', 'No'

    class ModeChoices(models.TextChoices):
        ONLINE = 'ONLINE', 'Online'
        OFFLINE = 'OFFLINE', 'Offline'
        BOTH = 'BOTH', 'Both'

    class CourseType(models.TextChoices):
        SINGLE = 'SINGLE', 'Single Course'
        COMBO = 'COMBO', 'Combo Course'

    course_type = models.CharField(choices=CourseType.choices, max_length=10, default=CourseType.SINGLE)
    featured_image = models.ImageField(upload_to="course/poster/", default="course/poster/default.jpg")
    featured_video = models.CharField(max_length=50, null=True, blank=True)
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name="courses", blank=True)
    level = models.ForeignKey(Label, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.ManyToManyField(CourseLanguage, blank=True, related_name="courses")
    duration = models.PositiveIntegerField(default=6, validators=[MinValueValidator(1)])

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    referral_comission = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_end_date = models.DateField(null=True, blank=True)
    otp_discount = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)

    # Features
    certificate = models.CharField(choices=CertificateChoices.choices, max_length=10, default=CertificateChoices.NO)
    mode = models.CharField(choices=ModeChoices.choices, max_length=10, default=ModeChoices.ONLINE)
    single_courses = models.ManyToManyField('self', blank=True, related_name="combo_courses", symmetrical=False)

    enrollments = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0.0)
    slug = models.SlugField(unique=True, blank=True)

    status = models.CharField(choices=Status.choices, max_length=10, default=Status.DRAFT)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("course_details", kwargs={'slug': self.slug})

    def get_discounted_price(self, use_emi=False, total_emi=None):
        price = self.price
        if not use_emi:
            return price - (price * self.otp_discount / Decimal('100.0'))
        if total_emi and total_emi >= 2:
            discount_percent = DEFAULT_EMI_DISCOUNTS.get(total_emi, Decimal("0.0"))
            return price - (price * discount_percent / Decimal('100.0'))
        return price

    def save(self, *args, **kwargs):
        if self.otp_discount is None:
            self.otp_discount = Decimal("15.0")
        super().save(*args, **kwargs)


@receiver(post_save, sender=Course)
def create_course_emi(sender, instance, created, **kwargs):
    if instance.course_type == Course.CourseType.COMBO and instance.price > 999 and instance.duration >= 3:
        CourseEMI.objects.filter(course=instance).delete()
        for months, discount in DEFAULT_EMI_DISCOUNTS.items():
            if months <= instance.duration:
                discounted_price = instance.get_discounted_price(use_emi=True, total_emi=months)
                emi_amount = discounted_price / months
                CourseEMI.objects.update_or_create(
                    course=instance,
                    total_emi=months,
                    defaults={"emi_amount": emi_amount}
                )

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
        except Exception as e:
            pass  # optionally log



# ----------------------------------
# Supplementary Course Models
# ----------------------------------

class CourseEMI(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="emi_plans")
    total_emi = models.PositiveIntegerField(default=0)
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ['course', 'total_emi']
        ordering = ['total_emi']

    def __str__(self):
        return f"{self.course.title} - {self.total_emi} months EMI - ₹{self.emi_amount}"


class CoursePointBase(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    points = models.CharField(max_length=300)

    class Meta:
        abstract = True


class CourseWhyLearn(CoursePointBase):
    def __str__(self):
        return self.points


class CourseWhoCanJoin(CoursePointBase):
    def __str__(self):
        return self.points


class CourseCareerOpportunities(CoursePointBase):
    def __str__(self):
        return self.points


class CourseRequirements(CoursePointBase):
    def __str__(self):
        return self.points


class CourseWhatYouLearn(CoursePointBase):
    def __str__(self):
        return self.points


class CourseChapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class ChapterTopic(models.Model):
    chapter = models.ForeignKey(CourseChapter, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    notes_url = models.URLField(null=True, blank=True)  # Not Use PDF only use link because our notes on github
    

    def __str__(self):
        return f"{self.chapter.course.title} - {self.chapter.title} - {self.title}"


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


@receiver(post_save, sender=CourseReview)
def update_course_rating(sender, instance, **kwargs):
    avg_rating = CourseReview.objects.filter(course=instance.course).aggregate(avg=Avg("rating"))["avg"] or 0
    instance.course.rating = round(avg_rating, 2)
    instance.course.save(update_fields=["rating"])





class Enrollment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'


    PAYMENT_METHOD_CHOICES = [
        ('emi', 'EMI'),
        ('monthly', 'Monthly'),
        ('otp', 'One-Time Payment'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_enrollments")
    enrollment_no = models.BigIntegerField(unique=True, default=0)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=Decimal('0.00'))
    total_due_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    payment_complete = models.BooleanField(default=False)
  
    total_emi = models.IntegerField(default=0)
    emi = models.BooleanField(default=False)

    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='monthly')

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

    is_active = models.BooleanField(default=True)

    certificate = models.BooleanField(default=False)
    enrolled_at = models.DateField(null=True, blank=True)
    end_at = models.DateField(null=True, blank=True)

    def __str__(self):  
        return f"{self.user} - {self.course.title} - {self.status}"

    @transaction.atomic
    def save(self, *args, **kwargs):
        if not self.enrolled_at:
            self.enrolled_at = now()
        if not self.enrollment_no:
            enrollment_number = generate_random_numbers(12)
            while Enrollment.objects.filter(enrollment_no=enrollment_number).exists():
                enrollment_number = generate_random_numbers(12)
            self.enrollment_no = enrollment_number

        super().save(*args, **kwargs)

        if (
            self.status == "Approved"
            and self.emi
            and self.total_emi > 0 
            and self.course.course_type == "COMBO" 
            and not EnrollmentEmi.objects.filter(enrollment=self).exists()
            and self.payment_method == 'emi'
        ):
            emi_plan = self.course.emi_plans.filter(total_emi=self.total_emi).first()
            if emi_plan:
                emi_objs = [
                    EnrollmentEmi(
                        enrollment=self,
                        emi_number=i,
                        amount=emi_plan.emi_amount
                    )
                    for i in range(1, emi_plan.total_emi + 1)
                ]
                EnrollmentEmi.objects.bulk_create(emi_objs)

                first_emi = self.emis.order_by("emi_number").first()
                if first_emi and first_emi.status != "Paid":
                    first_emi.status = "Paid"
                    first_emi.paid_at = now()
                    first_emi.save(update_fields=["status", "paid_at"])

    @property
    def payment_status(self):
        return "Completed" if self.payment_complete else "Pending"


    def delete(self, *args, **kwargs):
        self.course.enrollments -= 1
        self.course.save(update_fields=['enrollments'])
        super().delete(*args, **kwargs)


class EnrollmentEmi(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'


    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="emis")
    emi_number = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"EMI {self.emi_number} - {self.enrollment.user} - {self.enrollment.course.title} - {self.status}"

    def save(self, *args, **kwargs):
        if not self.paid_at:
            self.paid_at = now()
        if not self.due_date and self.enrollment.enrolled_at:
            self.due_date = self.enrollment.enrolled_at + timedelta(days=30 * self.emi_number)
        super().save(*args, **kwargs)

        if self.status == "Paid":
            enrollment = self.enrollment
            enrollment.total_paid_amount += self.amount
            enrollment.total_due_amount = enrollment.amount - enrollment.total_paid_amount
            enrollment.save(update_fields=['total_paid_amount', 'total_due_amount'])

            """Send email notification to user."""
            subject = f"EMI {self.emi_number} Paid for {self.enrollment.course.title}"
            message = f"""
            Dear {self.enrollment.user.username},\n\n
            Your EMI {self.emi_number} for the course {self.enrollment.course.title} has been successfully paid.\n\n
            Here are your EMI details:\n
            ---------------------------------------------\n
            🆔 Enrollment No: {self.enrollment.enrollment_no}\n
            📚 Course: {self.enrollment.course.title}\n
            💰 Total Course Fee: ₹{self.enrollment.amount}\n
            💳 Total Amount Paid: ₹{self.enrollment.total_paid_amount}\n
            ❗ Due Amount: ₹{self.enrollment.total_due_amount}\n
            📅 EMI Number: {self.emi_number}\n
            💰 EMI Amount: ₹{self.amount}\n
            📆 Due Date: {self.due_date.strftime('%Y-%m-%d')}\n
            ---------------------------------------------\n\n
            Thank you for your enrollment.\n
            Best Regards,\n
            MSK Institute
            """
            send_email(self.enrollment.user.email, subject, message)

            EnrollmentFeeHistory.objects.create(
                enrollment = enrollment,
                payment_method = 'online',
                amount = self.amount,
            )

            is_payment_complete = enrollment.total_paid_amount == enrollment.amount
            
            if is_payment_complete:
                enrollment.payment_complete = True
                enrollment.save(update_fields=['total_paid_amount', 'total_due_amount', 'payment_complete'])

                # Send email notification for full payment completion
                subject_complete = f"Course Fee Fully Paid for {self.enrollment.course.title}"
                message_complete = f"""
                Dear {self.enrollment.user.username},\n\n
                Congratulations! You have successfully completed the payment for your course {self.enrollment.course.title}.\n\n
                Here are your payment details:\n
                ---------------------------------------------\n
                🆔 Enrollment No: {self.enrollment.enrollment_no}\n
                📚 Course: {self.enrollment.course.title}\n
                💰 Total Course Fee: ₹{self.enrollment.amount}\n
                💳 Total Amount Paid: ₹{self.enrollment.total_paid_amount}\n
                ✅ Payment Status: Completed\n
                ---------------------------------------------\n\n
                Thank you for choosing MSK Institute.\n
                Best Regards,\n
                MSK Institute
                """
                send_email(self.enrollment.user.email, subject_complete, message_complete)


@shared_task
def auto_reject_pending_enrollments():
    """Rejects enrollments that have been pending for more than 3 days."""
    three_days_ago = now() - timedelta(days=3)
    pending_enrollments = Enrollment.objects.filter(status="Pending", enrolled_at__lte=three_days_ago)
    
    for enrollment in pending_enrollments:
        enrollment.status = "Rejected"
        enrollment.save()


class EnrollmentRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    FEE_TYPE = [
        ('Admission', 'Admission'),
        ('Course', 'Course'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="enrollment_requests")
    order_id = models.CharField(max_length=20, unique=True, editable=False, default=uuid.uuid4().hex[:12].upper())
    payment_screenshot = models.ImageField(upload_to="payment_screenshots/", null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    monthly_otp_emi = models.CharField(max_length=5, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    request_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.user} for {self.course.title} - {self.status}"

    def delete(self, *args, **kwargs):
        """Delete screenshot file when object is deleted."""
        if self.payment_screenshot:
            screenshot_path = os.path.join(settings.MEDIA_ROOT, str(self.payment_screenshot))
            if os.path.exists(screenshot_path):
                os.remove(screenshot_path)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.status == 'Approved':
            enrollment, created = Enrollment.objects.get_or_create(user=self.user, course=self.course, defaults={'status': self.status} )
            if not created:
                enrollment.status = self.status
                enrollment.save(update_fields=['status'])
            
            subject = f"You're enrolled in {self.course.title}!"
            message = f"Hi {self.user.username},\n\nYou have successfully enrolled in {self.course.title}.\nStart learning now! \n\nYour Enrollment No: {enrollment.enrollment_no}"
            send_email(self.user.email, subject, message)

            Course.objects.filter(id=self.course.id).update(enrollments=F('enrollments') + 1)

            profile = self.user.profile
            if profile.status != "Active":
                profile.status = "Active"
                profile.save(update_fields=['status'])

            if profile.sponsor:
                referral_commission = self.course.get_referral_commission() if hasattr(self.course, 'get_referral_commission') else Decimal('0.00')
                if hasattr(profile.sponsor, 'add_earnings'):
                    profile.sponsor.add_earnings(referral_commission)

            
            Enrollment.objects.filter(user=self.user, course=self.course, status="Pending").delete()
            self.delete()

        elif self.status == 'Pending':
            subject = f"Your request for {self.course.title} has been submitted."
            message = f"Hi {self.user.username},\n\nYour request for {self.course.title} has been successfully submitted.\nPlease wait 1 to 3 days for approval.\nYour Order ID: {self.order_id}"
            send_email(self.user.email, subject, message)
            
            enrollment = Enrollment.objects.create(
                user=self.user,
                course=self.course,
                amount=self.course.get_discounted_price(),
                total_emi=int(self.monthly_otp_emi or 0),
                emi=(self.monthly_otp_emi != "0"),
            )
            enrollment.save()

        elif self.status == 'Rejected':
            subject = f"Your enrollment for {self.course.title} was rejected!"
            message = f"Hi {self.user.username},\n\nYour enrollment in {self.course.title} has been rejected because your payment was not approved."
            send_email(self.user.email, subject, message)
            Enrollment.objects.filter(user=self.user, course=self.course).delete()
            self.delete()




class EnrollmentFeeHistory(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    PAYMENT_GATEWAY_CHOICES = [
        ('paytm', 'Paytm'),
        ('phonepe', 'PhonePe'),
        ('googlepay', 'Google Pay'),
        ('upi', 'UPI'),
        ('cash', 'Cash'),
        ('bank', 'Bank Transfer'),
        ('other', 'Other'),
    ]

    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="fee_history")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default="online")
    payment_gateway = models.CharField(max_length=20, choices=PAYMENT_GATEWAY_CHOICES, default='upi')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.user} - {self.enrollment.course.title} - ₹{self.amount} [{self.payment_gateway}]"

class EnrollmentEmiPaymentRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('paytm', 'Paytm'),
        ('phonepe', 'PhonePe'),
        ('googlepay', 'Google Pay'),
        ('upi', 'UPI'),
        ('other', 'Other'),
    ]

    enrollment_emi = models.ForeignKey(EnrollmentEmi, on_delete=models.CASCADE, related_name="emi_payments")
    payment_screenshot = models.ImageField(upload_to="emi_payments/", null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    paid_at = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)


    def __str__(self):
        return f"{self.enrollment_emi.enrollment.user} - {self.enrollment_emi.enrollment.course.title} - {self.enrollment_emi.emi_number} - {self.payment_method}"

    def delete(self, *args, **kwargs):
        if self.payment_screenshot:
            try:
                screenshot_path = os.path.join(settings.MEDIA_ROOT, str(self.payment_screenshot))
                if os.path.exists(screenshot_path):
                    os.remove(screenshot_path)
            except Exception:
                pass
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.status == 'Approved':
            self.enrollment_emi.status = "Paid"
            self.enrollment_emi.save(update_fields=['status'])
            
            self.enrollment_emi.enrollment.total_paid_amount = F('total_paid_amount') + self.payment_amount
            self.enrollment_emi.enrollment.total_due_amount = F('total_due_amount') - self.payment_amount
            self.enrollment_emi.enrollment.save(update_fields=['total_paid_amount', 'total_due_amount'])
            
            EnrollmentFeeHistory.objects.create(
                enrollment = self.enrollment_emi.enrollment,
                payment_method = self.payment_method,
                amount = self.payment_amount,
            )
            self.delete()

        elif self.status == 'Pending':
            subject = f"Your payment request for EMI {self.enrollment_emi.emi_number} is pending."
            message = f"Hi {self.enrollment_emi.enrollment.user.username},\n\nYour payment for EMI {self.enrollment_emi.emi_number} is pending.\nPlease wait for approval."
            send_email(self.enrollment_emi.enrollment.user.email, subject, message)

        elif self.status == 'Rejected':
            subject = f"Your payment request for EMI {self.enrollment_emi.emi_number} was rejected!"
            message = f"Hi {self.enrollment_emi.enrollment.user.username},\n\nYour payment for EMI {self.enrollment_emi.emi_number} has been rejected because your payment was not approved."
            send_email(self.enrollment_emi.enrollment.user.email, subject, message)
            self.delete()


@receiver(post_delete, sender=EnrollmentRequest)
@receiver(post_delete, sender=EnrollmentEmiPaymentRequest)
def delete_uploaded_file(sender, instance, **kwargs):
    if hasattr(instance, 'payment_screenshot') and instance.payment_screenshot:
        try:
            file_path = instance.payment_screenshot.path
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass


