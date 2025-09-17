# courses/management/commands/import_courses.py

import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Course, CourseChapter, ChapterTopic, Category, Level, Language

User = get_user_model()


class Command(BaseCommand):
    help = "Import courses from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str, help="Path to the courses JSON file")
        parser.add_argument("--user", type=str, help="Username of the creator (default: first superuser)")

    def handle(self, *args, **options):
        json_file = options["json_file"]
        username = options.get("user")

        # Determine the user
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"User '{username}' not found."))
                return
        else:
            # Use first superuser if --user not provided
            try:
                user = User.objects.filter(is_superuser=True).first()
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR("No superuser found. Please create one or provide --user."))
                return

        # Load JSON
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                courses_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read JSON file: {e}"))
            return

        for course_data in courses_data:
            # Categories
            category_objs = []
            for cat_name in course_data.get("categories", []):
                cat_obj, _ = Category.objects.get_or_create(name=cat_name)
                category_objs.append(cat_obj)

            # Level
            level_name = course_data.get("level", "Beginner")
            level_obj, _ = Level.objects.get_or_create(name=level_name)

            # Languages
            language_objs = []
            for lang_name in course_data.get("language", []):
                lang_obj, _ = Language.objects.get_or_create(name=lang_name)
                language_objs.append(lang_obj)

            # Update or create Course
            # Create or update the course
            course, created = Course.objects.update_or_create(
                title=course_data.get("title"),
                defaults={
                    "status": course_data.get("status", "DRAFT"),
                    "sort_description": course_data.get("sort_description", ""),
                    "level": level_obj,
                    "duration": course_data.get("duration", 1),
                    "price": Decimal(str(course_data.get("price", 0.00))),
                    "certificate": course_data.get("certificate", False),
                    "mode": course_data.get("mode", "ONLINE"),
                    "course_type": course_data.get("course_type", "SINGLE"),
                    "created_by": user,
                }
            )

            # Handle single courses for combo courses
            if course_data.get("course_type") == "COMBO":
                # Clear existing single courses
                course.single_courses.clear()
                
                # Add single courses by slug
                single_course_slugs = course_data.get("single_courses", [])
                for slug in single_course_slugs:
                    try:
                        single_course = Course.objects.get(slug=slug, course_type="SINGLE")
                        course.single_courses.add(single_course)
                    except Course.DoesNotExist:
                        self.stdout.write(self.style.WARNING(
                            f"Single course with slug '{slug}' not found for combo course: {course.title}"
                        ))

            # Set categories
            course.categories.set(category_objs)

            # Set languages
            course.language.set([lang.id for lang in language_objs])

            # Clear existing chapters
            course.chapters.all().delete()

            if course_data.get("course_type") == "SINGLE":
                # Add chapters and topics
                for chapter_data in course_data.get("chapters", []):
                    chapter = CourseChapter.objects.create(
                        course=course,
                        title=chapter_data.get("title")
                    )
                    for topic_data in chapter_data.get("topics", []):
                        if isinstance(topic_data, dict):
                            ChapterTopic.objects.create(
                                chapter=chapter,
                                title=topic_data.get("title"),
                            )
                        else:
                            # If topic_data is a string, use it as the title
                            ChapterTopic.objects.create(
                                chapter=chapter,
                                title=topic_data,
                            )

            self.stdout.write(self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} course: {course.title}"
            ))

