
python manage.py makemigrations
python manage.py migrate


python manage.py create_sample_users


---

### Solution — Migrations Reset & Clean Start

Aapko purane JSONField migrations hata ke fresh migrations banana padega.

#### Step 1: Purane SQLite DB & Migrations delete karna

⚠ Ye step karne se aapka purana data delete ho jayega. Agar data bachana hai to dump lo:

```bash
python manage.py dumpdata > backup.json
```

Phir:

```bash
del db.sqlite3
del courses\migrations\0*.py
del users\migrations\0*.py
del mlm\migrations\0*.py
```

(Only `__init__.py` migration file chhodna.)

---

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
