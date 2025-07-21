from django.core.management.base import BaseCommand
from users.models import CustomUser
from courses.models import Course, Category, Label, CourseLanguage
import random

# python manage.py create_sample_users


class Command(BaseCommand):
    help = 'Create sample users and sample courses'

    def handle(self, *args, **kwargs):
        self.stdout.write("📦 Creating sample data...")

        self.create_categories()
        self.create_labels()
        self.create_languages()

        self.create_admins()
        self.create_teachers()
        self.create_students()
        self.create_courses()

        self.stdout.write(self.style.SUCCESS("✅ Sample data created successfully."))

    def create_categories(self):
        categories = ['Web Development', 'Data Science', 'Graphic Design', 'Cyber Security', 'AI & ML']
        for name in categories:
            Category.objects.get_or_create(name=name)

    def create_labels(self):
        labels = ['Beginner', 'Intermediate', 'Advanced']
        for name in labels:
            Label.objects.get_or_create(name=name)

    def create_languages(self):
        languages = ['English', 'Hindi', 'Spanish', 'French']
        for name in languages:
            CourseLanguage.objects.get_or_create(name=name)

    def create_admins(self):
        for i in range(2):
            email = f'admin{i+1}@msk.com'
            username = f'admin{i+1}'
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'role': 'admin',
                    'is_staff': True,
                    'is_superuser': True,
                    'phone': f'90000000{i+1}',
                }
            )
            if created:
                user.set_password('admin123')
                user.save()

    def create_teachers(self):
        for i in range(5):
            email = f'teacher{i+1}@msk.com'
            username = f'teacher{i+1}'
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'role': 'teacher',
                    'is_staff': False,
                    'is_superuser': False,
                    'phone': f'80000000{i+1}',
                }
            )
            if created:
                user.set_password('teacher123')
                user.save()

    def create_students(self):
        for i in range(30):
            email = f'student{i+1}@msk.com'
            username = f'student{i+1}'
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'role': 'student',
                    'is_staff': False,
                    'is_superuser': False,
                    'phone': f'70000000{i+1}',
                }
            )
            if created:
                user.set_password('student123')
                user.save()

    def create_courses(self):
        teachers = CustomUser.objects.filter(role='teacher')
        categories = list(Category.objects.all())
        levels = list(Label.objects.all())
        languages = list(CourseLanguage.objects.all())

        for i in range(50):
            title = f"Sample Course {i+1}"
            course, created = Course.objects.get_or_create(
                title=title,
                defaults={
                    'course_type': 'SINGLE',
                    'description': f"This is the description of course {i+1}.",
                    'level': random.choice(levels) if levels else None,
                    'duration': random.randint(1, 12),
                    'price': random.randint(500, 5000),
                    'discount': random.choice([0, 10, 20]),
                    'certificate': random.choice(['YES', 'NO']),
                    'mode': random.choice(['ONLINE', 'OFFLINE', 'BOTH']),
                    'created_by': random.choice(teachers) if teachers else None,
                    'status': 'PUBLISH',
                }
            )
            if created:
                # Assign multiple categories and languages
                course.categories.set(random.sample(categories, k=random.randint(1, 3)))
                course.language.set(random.sample(languages, k=random.randint(1, 2)))
                course.save()
