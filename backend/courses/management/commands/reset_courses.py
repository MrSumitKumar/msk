from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from django.apps import apps
from courses.models import Course, CourseChapter, ChapterTopic, Category, Level, Language, CourseReview, Enrollment, EnrollmentFeeHistory
import os
import shutil

class Command(BaseCommand):
    help = 'Reset the courses app completely - delete all data, migrations, and media files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input', 
            action='store_true', 
            help='Do not ask for user input'
        )

    def handle(self, *args, **kwargs):
        if not kwargs['no_input']:
            confirm = input('\nThis will delete all courses data, migrations, and media files. Are you sure? (yes/no): ')
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.WARNING('Operation cancelled.'))
                return

        try:
            # Step 1: Delete all media files for courses
            self.delete_media_files()

            # Step 2: Drop all related tables
            self.drop_tables()

            # Step 3: Delete migration files
            self.delete_migrations()

            # Step 4: Reset migrations
            self.reset_migrations()

            self.stdout.write(self.style.SUCCESS('Successfully reset the courses app!'))
            
            # Print next steps
            self.stdout.write('\nNext steps:')
            self.stdout.write('1. Run: python manage.py makemigrations courses')
            self.stdout.write('2. Run: python manage.py migrate courses')
            self.stdout.write('3. Create initial data if needed\n')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise e

    def delete_media_files(self):
        """Delete all media files related to courses"""
        self.stdout.write('Deleting media files...')
        
        # Delete course featured images
        course_media_dir = os.path.join(settings.MEDIA_ROOT, 'course')
        if os.path.exists(course_media_dir):
            shutil.rmtree(course_media_dir)
            os.makedirs(course_media_dir)  # Recreate empty directory

    def drop_tables(self):
        """Drop all tables related to the courses app"""
        self.stdout.write('Dropping database tables...')
        
        models = [
            Course, CourseChapter, ChapterTopic, Category, Level, 
            Language, CourseReview, Enrollment, EnrollmentFeeHistory
        ]
        
        with connection.cursor() as cursor:
            # Disable foreign key checks temporarily
            if connection.vendor == 'postgresql':
                cursor.execute("""
                    DO $$ 
                    DECLARE
                        r RECORD;
                    BEGIN
                        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                            EXECUTE 'ALTER TABLE IF EXISTS ' || quote_ident(r.tablename) || ' DISABLE TRIGGER ALL';
                        END LOOP;
                    END $$;
                """)

            # Drop tables
            for model in models:
                table_name = model._meta.db_table
                self.stdout.write(f'  Dropping table {table_name}...')
                cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE')

            # Re-enable foreign key checks
            if connection.vendor == 'postgresql':
                cursor.execute("""
                    DO $$ 
                    DECLARE
                        r RECORD;
                    BEGIN
                        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                            EXECUTE 'ALTER TABLE IF EXISTS ' || quote_ident(r.tablename) || ' ENABLE TRIGGER ALL';
                        END LOOP;
                    END $$;
                """)

    def delete_migrations(self):
        """Delete all migration files"""
        self.stdout.write('Deleting migration files...')
        
        migrations_dir = os.path.join(settings.BASE_DIR, 'courses', 'migrations')
        for filename in os.listdir(migrations_dir):
            if filename.endswith('.py') and filename != '__init__.py':
                filepath = os.path.join(migrations_dir, filename)
                os.remove(filepath)
                self.stdout.write(f'  Deleted {filename}')

    def reset_migrations(self):
        """Reset migrations in django_migrations table"""
        self.stdout.write('Resetting migrations in database...')
        
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM django_migrations WHERE app = 'courses'")