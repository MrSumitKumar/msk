#### Step 2: Naya migration banana

```bash
python manage.py makemigrations
python manage.py migrate
```

---

#### Step 3: (Optional) Data restore karna

```bash
python manage.py loaddata backup.json
```

---

1. Backend ke migration files delete karo
```bash
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

find . -name "__pycache__" -exec rm -rf {} +
find . -name "*.pyc" -delete
```


```sh
python manage.py createsuperuser
```

- If needed Deactivate Virtual env
```sh
deactivate
```

- Restart Gunicorn (You may need to restart everytime you make change in your project code)
```sh
sudo systemctl daemon-reload
sudo systemctl restart api.shikohabad.in.gunicorn
```


```sh
python manage.py import_courses updated_courses.json
```



1. **Backup Command**:
```bash
# Basic usage
python manage.py backup_users

# With pretty printing (formatted JSON)
python manage.py backup_users --pretty

# Custom output filename
python manage.py backup_users --output custom_backup.json
```

2. **Restore Command**:
```bash
# Basic usage
python manage.py restore_users --input users_backup_20250924_123456.json

# Skip existing users (don't update them)
python manage.py restore_users --input users_backup_20250924_123456.json --skip-existing
```

Features:

**Backup Command (`backup_users`):**
- Creates timestamped backups (e.g., `users_backup_20250924_123456.json`)
- Saves files in a `backups` directory
- Option for pretty-printed JSON
- Provides restore command instructions

**Restore Command (`restore_users`):**
- Restores users from backup file
- Can update existing users or skip them
- Preserves original passwords
- Provides detailed statistics:
  - New users created
  - Existing users updated
  - Users skipped
  - Errors encountered
- Error handling for each user
