from django.urls import reverse
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_save
from django.db.models import Avg, Count, F
from backend.utils import send_email, generate_random_numbers
from django.dispatch import receiver
from django.utils.timezone import now, timedelta
from celery import shared_task
import os, uuid
from django.conf import settings
from decimal import Decimal
from django.db import models, transaction

# Replace all 'from django.contrib.auth.models import User' with:
User = settings.AUTH_USER_MODEL


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

class Course(models.Model):
    STATUS = [('PUBLISH', 'PUBLISH'), ('DRAFT', 'DRAFT')]
    CERTIFICATE = [('YES', 'Yes'), ('NO', 'No')]
    MODE_CHOICES = [('ONLINE', 'Online'), ('OFFLINE', 'Offline'), ('BOTH', 'Both')]
    COURSE_TYPE = [('SINGLE', 'Single Course'), ('COMBO', 'Combo Course')]

    course_type = models.CharField(choices=COURSE_TYPE, max_length=10, default='SINGLE')
    featured_image = models.ImageField(upload_to="course/poster/", default="course/poster/default.jpg" )
    featured_video = models.CharField(max_length=50, null=True, blank=True)
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name="courses", blank=True)
    level = models.ForeignKey(Label, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.ManyToManyField(CourseLanguage, blank=True, related_name="courses")
    duration = models.IntegerField(default=6)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)              # Discount %
    referral_comission = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_end_date = models.DateField(null=True, blank=True)
    otp_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)          # Discount %

    # Course Features
    certificate = models.CharField(choices=CERTIFICATE, max_length=10, default='NO')
    mode = models.CharField(choices=MODE_CHOICES, max_length=10, default='ONLINE')
    single_courses = models.ManyToManyField('self', blank=True, related_name="combo_courses", symmetrical=False)

    enrollments = models.PositiveIntegerField(default=0)
    rating = models.FloatField(default=0.0)
    slug = models.SlugField(unique=True, blank=True)

    # Tracking & Visibility
    status = models.CharField(choices=STATUS, max_length=10, default='DRAFT')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """Generate a unique slug before saving the course."""
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.otp_discount:
            self.otp_discount = 7
        super().save(*args, **kwargs)

        if self.course_type != "COMBO":
            CourseEMI.objects.filter(course=self).delete()
            return

        emi_options = [d for d in range(3, self.duration + 1, 3)]
        if self.price > 999 and self.duration >= 3 and self.course_type == "COMBO":
            for emi_months in emi_options:
                emi_amount = self.get_discounted_price() / emi_months
                CourseEMI.objects.update_or_create(course=self, total_emi=emi_months, defaults={"emi_amount":emi_amount} )
    
    def get_absolute_url(self):
        return reverse("course_details", kwargs={'slug': self.slug})

    def get_discounted_price(self):
        if self.discount > 0: return self.price - (self.price * (self.discount / 100))
        return self.price
    
    def get_referral_commission(self):
        return self.get_discounted_price() * (self.referral_comission / Decimal(100))

    def get_otp_discounted_price(self):
        discount_amount = self.get_discounted_price() * (self.otp_discount / Decimal(100))
        return int(self.get_discounted_price()) - int(discount_amount)

    def is_combo_course(self):
        return self.course_type == "COMBO"

    def get_single_courses(self):
        return self.single_courses.all() if self.is_combo_course() else None
    
    @staticmethod
    def get_combo_courses():
        return Course.objects.filter(course_type="COMBO", status="PUBLISH")

    @staticmethod
    def get_top_courses(length: int):
        return Course.objects.filter(status="PUBLISH").order_by('-rating')[:length]

    @staticmethod
    def get_popular_courses():
        return Course.objects.filter(status="PUBLISH").order_by('-enrollments')[:10]

    @staticmethod
    def get_latest_courses():
        return Course.objects.filter(status="PUBLISH").order_by('-created_at')[:6]

    @staticmethod
    def get_discounted_courses():
        return Course.objects.filter(status="PUBLISH", discount__gt=0).order_by('-discount')

    @staticmethod
    def get_all_courses():
        return Course.objects.filter(status="PUBLISH")


@receiver(models.signals.post_delete, sender=Course)
def delete_course_image(sender, instance, **kwargs):
    if instance.featured_image and instance.featured_image.name != "course/poster/default.jpg":
        if os.path.isfile(instance.featured_image.path):
            os.remove(instance.featured_image.path)

            

class CourseEMI(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="emi_plans")
    total_emi = models.IntegerField(default=0) 
    emi_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.course.title} - {self.total_emi} months EMI - ₹{self.emi_amount}"

class CourseWhyLearn(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="why_learn_points")
    points = models.CharField(max_length=300)

    def __str__(self):
        return self.points

class CourseWhoCanJoin(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="who_can_join_points")
    points = models.CharField(max_length=300)

    def __str__(self):
        return self.points

class CourseCareerOpportunities(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="career_opportunities_points")
    points = models.CharField(max_length=300)

    def __str__(self):
        return self.points

class CourseRequirements(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="requirements_points")
    points = models.CharField(max_length=300)

    def __str__(self):
        return self.points

class CourseWhatYouLearn(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="what_you_learn_points")
    points = models.CharField(max_length=300)

    def __str__(self):
        return self.points

class CourseChapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Attachment(models.Model):
    file = models.FileField(upload_to="lesson_pdfs/", null=True, blank=True)

    def __str__(self):
        return f"Attachment #{self.pk}"

class ChapterTopic(models.Model):
    chapter = models.ForeignKey(CourseChapter, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    attachments = models.ManyToManyField(Attachment, blank=True, related_name="topics")

    def __str__(self):
        return f"{self.chapter.course.title} - {self.chapter.title} - {self.title}"


class CourseReview(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Course Review'
        verbose_name_plural = 'Course Reviews'

    def __str__(self):
        return f"{self.user.username} - {self.course.title} ({self.rating}★)"

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
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

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    certificate = models.BooleanField(default=False)
    enrolled_at = models.DateField(null=True, blank=True)
    end_at = models.DateField(null=True, blank=True)

    def __str__(self):  
        return f"{self.user} - {self.course.title} - {self.status}"

    def save(self, *args, **kwargs):
        if not self.enrolled_at:
            self.enrolled_at = now()
        if not self.enrollment_no:
            enrollment_number = generate_random_numbers(12)
            while Enrollment.objects.filter(enrollment_no=enrollment_number).exists():
                enrollment_number = generate_random_numbers(12)
            self.enrollment_no = enrollment_number

        super().save(*args, **kwargs)

        if (self.status == "Approved" and self.emi and self.total_emi > 0 and self.course.course_type == "COMBO" and not EnrollmentEmi.objects.filter(enrollment=self).exists()):
            emi_plan = self.course.emi_plans.filter(id=self.total_emi).first()
            if emi_plan:
                for i in range(1, emi_plan.total_emi + 1):
                    EnrollmentEmi.objects.create(enrollment=self, emi_number=i, amount=emi_plan.emi_amount)

            # Mark the first EMI as paid
            first_emi = self.emis.order_by("emi_number").first()
            if first_emi and first_emi.status != "Paid":
                first_emi.status = "Paid"
                first_emi.paid_at = now()
                first_emi.save(update_fields=["status", "paid_at"])

    def delete(self, *args, **kwargs):
        self.course.enrollments -= 1
        self.course.save(update_fields=['enrollments'])
        super().delete(*args, **kwargs)

class EnrollmentEmi(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
    ]

    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="emis")
    emi_number = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"EMI {self.emi_number} - {self.enrollment.user} - {self.enrollment.course.title} - {self.status}"

    def save(self, *args, **kwargs):
        if not self.paid_at:
            self.enrolled_at = now()
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
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    FEE_TYPE = [
        ('Admission', 'Admission'),
        ('Course', 'Course'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="enrollment_requests")
    order_id = models.CharField(max_length=20, unique=True, editable=False, default=uuid.uuid4().hex[:12].upper())
    payment_screenshot = models.ImageField(upload_to="payment_screenshots/", null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    otp_or_emi = models.CharField(max_length=5, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
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

            self.course.enrollments = F('enrollments') + 1
            self.course.save(update_fields=['enrollments'])

            profile = self.user.profile
            if profile.status != "Active":
                profile.status = "Active"
                profile.save(update_fields=['status'])

            if profile.sponsor:
                referral_commission = self.course.get_referral_commission()
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
                total_emi=self.otp_or_emi,
                emi=self.otp_or_emi != "0",
            )
            enrollment.save()

        elif self.status == 'Rejected':
            subject = f"Your enrollment for {self.course.title} was rejected!"
            message = f"Hi {self.user.username},\n\nYour enrollment in {self.course.title} has been rejected because your payment was not approved."
            send_email(self.user.email, subject, message)
            Enrollment.objects.filter(user=self.user, course=self.course).delete()
            self.delete()

class EnrollmentFeeHistory(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name="fee_history")
    payment_method = models.CharField(max_length=10, choices=[('online', 'Online'), ('offline', 'Offline')], default="online")
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.user} - {self.enrollment.user.first_name} {self.enrollment.user.last_name} - {self.enrollment.course.title} - {self.amount}"
    
class EnrollmentEmiPaymentRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    enrollment_emi = models.ForeignKey(EnrollmentEmi, on_delete=models.CASCADE, related_name="emi_payments")
    payment_screenshot = models.ImageField(upload_to="emi_payments/", null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment_emi.enrollment.user} - {self.enrollment_emi.enrollment.course.title} - {self.enrollment_emi.emi_number}"

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
            self.enrollment_emi.status = "Paid"
            self.enrollment_emi.save(update_fields=['status'])
            self.enrollment_emi.enrollment.total_paid_amount = F('total_paid_amount') + self.payment_amount
            self.enrollment_emi.enrollment.total_due_amount = F('total_due_amount') - self.payment_amount
            self.enrollment_emi.enrollment.save(update_fields=['total_paid_amount', 'total_due_amount'])
            EnrollmentFeeHistory.objects.create(
                enrollment = self.enrollment_emi.enrollment,
                payment_method = 'online',
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

