from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal
from django.contrib.auth import get_user_model
from .models import (
    Course, CourseChapter, ChapterTopic, CourseReview,
    Category, Level, Language, ProgrammingLanguage,
    Enrollment, EnrollmentFeeHistory, EnrollmentFeeSubmitRequest,
    PlatformSettings
)

User = get_user_model()

class CourseModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.category = Category.objects.create(name='Web Development')
        self.level = Level.objects.create(name='Beginner')
        self.language = Language.objects.create(name='English')

    def test_course_creation(self):
        course = Course.objects.create(
            title='Test Course',
            price=Decimal('999.99'),
            created_by=self.user
        )
        self.assertEqual(course.title, 'Test Course')
        self.assertEqual(course.status, Course.StatusChoices.DRAFT)
        self.assertTrue(course.slug)  # Verify slug was generated
        
    def test_course_slug_uniqueness(self):
        course1 = Course.objects.create(title='Test Course 1')
        course2 = Course.objects.create(title='Test Course 1 Duplicate')
        self.assertTrue(course1.slug.startswith('test-course-1'))
        self.assertTrue(course2.slug.startswith('test-course-1-duplicate'))
        self.assertNotEqual(course1.slug, course2.slug)

    def test_course_price_validation(self):
        with self.assertRaises(ValidationError):
            course = Course.objects.create(
                title='Invalid Price Course',
                price=Decimal('-100.00')
            )
            course.full_clean()

class CourseReviewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='reviewer', password='pass123')
        self.course = Course.objects.create(title='Course for Review')

    def test_review_creation(self):
        review = CourseReview.objects.create(
            course=self.course,
            user=self.user,
            rating=5,
            comment='Great course!'
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Great course!')

    def test_invalid_rating(self):
        with self.assertRaises(ValidationError):
            review = CourseReview.objects.create(
                course=self.course,
                user=self.user,
                rating=6  # Invalid rating
            )
            review.full_clean()

    def test_unique_user_review(self):
        CourseReview.objects.create(
            course=self.course,
            user=self.user,
            rating=4
        )
        with self.assertRaises(Exception):  # Will raise IntegrityError
            CourseReview.objects.create(
                course=self.course,
                user=self.user,
                rating=5
            )

class EnrollmentTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='student', password='pass123')
        self.course = Course.objects.create(
            title='Enrollment Test Course',
            price=Decimal('1000.00')
        )

    def test_enrollment_creation(self):
        enrollment = Enrollment.objects.create(
            user=self.user,
            course=self.course,
            amount=self.course.price
        )
        self.assertIsNotNone(enrollment.enrollment_no)
        self.assertEqual(enrollment.status, Enrollment.StatusChoices.PENDING)
        self.assertEqual(enrollment.payment_method, Enrollment.PaymentMethod.MONTHLY)

    def test_enrollment_payment_flow(self):
        enrollment = Enrollment.objects.create(
            user=self.user,
            course=self.course,
            amount=Decimal('1000.00')
        )
        
        # Create a fee submit request
        fee_request = EnrollmentFeeSubmitRequest.objects.create(
            enrollment=enrollment,
            amount=Decimal('500.00'),
            payment_gateway=EnrollmentFeeHistory.FeePaymentGateway.UPI,
            payment_method=EnrollmentFeeHistory.FeePaymentMethod.ONLINE,
        )
        
        # Approve the request
        fee_request.status = EnrollmentFeeSubmitRequest.RequestStatus.APPROVED
        fee_request.save()
        
        # Refresh enrollment from db
        enrollment.refresh_from_db()
        
        # Check that payment was recorded
        self.assertEqual(enrollment.total_paid_amount, Decimal('500.00'))
        self.assertEqual(enrollment.total_due_amount, Decimal('500.00'))
        self.assertFalse(enrollment.payment_complete)

        # Submit and approve remaining amount
        fee_request2 = EnrollmentFeeSubmitRequest.objects.create(
            enrollment=enrollment,
            amount=Decimal('500.00'),
            payment_gateway=EnrollmentFeeHistory.FeePaymentGateway.UPI,
            payment_method=EnrollmentFeeHistory.FeePaymentMethod.ONLINE,
        )
        fee_request2.status = EnrollmentFeeSubmitRequest.RequestStatus.APPROVED
        fee_request2.save()
        
        # Refresh enrollment again
        enrollment.refresh_from_db()
        
        # Verify full payment completion
        self.assertEqual(enrollment.total_paid_amount, Decimal('1000.00'))
        self.assertEqual(enrollment.total_due_amount, Decimal('0.00'))
        self.assertTrue(enrollment.payment_complete)

class PlatformSettingsTest(TestCase):
    def test_singleton_behavior(self):
        # Create first instance
        settings1 = PlatformSettings.objects.create(
            otp_discount=Decimal('10.00'),
            referral_distribution=Decimal('5.00')
        )
        
        # Try to create second instance
        with self.assertRaises(ValidationError):
            PlatformSettings.objects.create(
                otp_discount=Decimal('15.00')
            )
    
    def test_emi_discounts(self):
        settings = PlatformSettings.objects.create()
        test_discounts = [
            {'months': 3, 'discount': 5},
            {'months': 6, 'discount': 10}
        ]
        
        settings.set_default_emi_discounts(test_discounts)
        settings.save()
        
        retrieved_discounts = settings.get_default_emi_discounts()
        self.assertEqual(retrieved_discounts, test_discounts)
