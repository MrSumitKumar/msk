from django.core.management.base import BaseCommand
from django.core import serializers
from users.models import CustomUser
from django.contrib.auth.hashers import make_password
import json
from datetime import datetime
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Create a backup of all user data in JSON format'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default='users_backup.json',
            help='Output file name (default: users_backup.json)'
        )
        parser.add_argument(
            '--pretty',
            action='store_true',
            help='Pretty print the JSON output'
        )

    def handle(self, *args, **options):
        try:
            # Create backups directory if it doesn't exist
            backup_dir = os.path.join(settings.BASE_DIR, 'backups')
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)

            # Generate filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{options['output'].replace('.json', '')}_{timestamp}.json"
            filepath = os.path.join(backup_dir, filename)

            # Get all users
            users = CustomUser.objects.all()
            
            # Prepare data for serialization
            backup_data = {
                'metadata': {
                    'timestamp': datetime.now().isoformat(),
                    'total_users': users.count(),
                    'version': '1.0'
                },
                'users': []
            }

            # Serialize each user
            for user in users:
                user_data = {
                    'username': user.username,
                    'email': user.email,
                    'phone': user.phone,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'role': user.role,
                    'gender': user.gender,
                    'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
                    'address': user.address,
                    'city': user.city,
                    'state': user.state,
                    'pincode': user.pincode,
                    'education': user.education,
                    'password': user.password,  # This is already hashed
                    # Add picture field if it exists
                    'picture': user.picture.url if user.picture else None,
                }
                backup_data['users'].append(user_data)

            # Write to file
            with open(filepath, 'w', encoding='utf-8') as f:
                if options['pretty']:
                    json.dump(backup_data, f, indent=2, ensure_ascii=False)
                else:
                    json.dump(backup_data, f, ensure_ascii=False)

            self.stdout.write(self.style.SUCCESS(
                f'\nSuccessfully created backup at {filepath}\n'
                f'Total users backed up: {users.count()}\n'
            ))

            # Print restore command help
            self.stdout.write(
                "To restore this backup, use:\n"
                f"python manage.py restore_users --input {filename}\n"
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'\nError creating backup: {str(e)}\n')
            )