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

            # Discount
            discount = course_data.get("discount")
            if discount is None:
                discount = Decimal("0.00")
            else:
                discount = Decimal(str(discount))

            # Update or create Course
            course, created = Course.objects.update_or_create(
                title=course_data.get("title"),
                defaults={
                    "status": course_data.get("status", "DRAFT"),
                    "featured_image": course_data.get("featured_image", ""),
                    "featured_video": course_data.get("featured_video"),
                    "sort_description": course_data.get("sort_description", ""),
                    "github_readme_link": course_data.get("github_readme_link"),
                    "level": level_obj,
                    "duration": course_data.get("duration", 1),
                    "price": Decimal(str(course_data.get("price", 0.00))),
                    "discount": discount,
                    "discount_end_date": course_data.get("discount_end_date"),
                    "certificate": course_data.get("certificate", False),
                    "mode": course_data.get("mode", "ONLINE"),
                    "course_type": course_data.get("course_type", "SINGLE"),
                    "created_by": user,
                    "slug": course_data.get("slug"),
                }
            )

            # Set categories
            course.categories.set(category_objs)

            # Set languages
            course.language.set([lang.id for lang in language_objs])

            # Clear existing chapters
            course.chapters.all().delete()

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
                            video_url=topic_data.get("video_url"),
                            notes_url=topic_data.get("notes_url")
                        )
                    else:
                        # If topic_data is a string, use it as the title
                        ChapterTopic.objects.create(
                            chapter=chapter,
                            title=topic_data,
                            video_url=None,
                            notes_url=None
                        )

            self.stdout.write(self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} course: {course.title}"
            ))

