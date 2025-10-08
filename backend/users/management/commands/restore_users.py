from django.core.management.base import BaseCommand
from django.core import serializers
from users.models import CustomUser
from django.contrib.auth.hashers import make_password
import json
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Restore user data from a JSON backup file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--input',
            required=True,
            help='Input backup file name'
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip existing users instead of updating them'
        )

    def handle(self, *args, **options):
        try:
            # Get the backup file path
            backup_dir = os.path.join(settings.BASE_DIR, 'backups')
            filepath = os.path.join(backup_dir, options['input'])

            if not os.path.exists(filepath):
                self.stdout.write(
                    self.style.ERROR(f'\nBackup file not found: {filepath}\n')
                )
                return

            # Read the backup file
            with open(filepath, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)

            if 'metadata' not in backup_data or 'users' not in backup_data:
                self.stdout.write(
                    self.style.ERROR('\nInvalid backup file format\n')
                )
                return

            total_users = len(backup_data['users'])
            restored_count = 0
            skipped_count = 0
            updated_count = 0
            error_count = 0

            self.stdout.write(f'\nRestoring {total_users} users...\n')

            # Process each user
            for user_data in backup_data['users']:
                try:
                    # Check if user exists
                    existing_user = CustomUser.objects.filter(
                        username=user_data['username']
                    ).first()

                    if existing_user:
                        if options['skip_existing']:
                            skipped_count += 1
                            continue

                        # Update existing user
                        for key, value in user_data.items():
                            if key != 'password':  # Don't update password
                                setattr(existing_user, key, value)
                        existing_user.save()
                        updated_count += 1
                    else:
                        # Create new user
                        user_data.pop('picture', None)  # Remove picture field if it exists
                        CustomUser.objects.create(**user_data)
                        restored_count += 1

                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Error processing user {user_data.get('username')}: {str(e)}"
                        )
                    )
                    error_count += 1

            # Print summary
            self.stdout.write(self.style.SUCCESS(
                f'\nRestore completed!\n'
                f'Total users in backup: {total_users}\n'
                f'New users restored: {restored_count}\n'
                f'Existing users updated: {updated_count}\n'
                f'Users skipped: {skipped_count}\n'
                f'Errors encountered: {error_count}\n'
            ))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'\nError restoring backup: {str(e)}\n')
            )