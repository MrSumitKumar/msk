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


अगर आपने PostgreSQL से direct SQL backup लिया है, जैसे:
```bash
pg_dump -U msk_user -h localhost -d msk_shikohabad_in -t users_customuser > users_backup.sql
```

तो restore करने के लिए:
```bash
psql -U msk_user -h localhost -d msk_shikohabad_in < users_backup.sql
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
python manage.py import_courses courses.json
```
