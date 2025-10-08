
# 🐘 PostgreSQL Essential Notes (Backup & Restore)

---

### 🔑 Change `postgres` User Password

```sql
ALTER USER postgres PASSWORD 'SSkk#?95postgrey@admin';
```

---

## 1️⃣ Connect to PostgreSQL

Login using your own user and database:

```bash
psql -U msk_user -h localhost -d postgres -W
```

### 1.1 PostgreSQL me aap ek hi command me direct **database login** kar sakte ho.

```bash
Syntax:
psql -U <username> -h <hostname> -d <database_name>

Example:
psql -U msk_user -h localhost -d msk_shikohabad_in
```

It will ask for the password (SSkk#?95postgrey) → enter and you’re inside.

---

### 1.2 Avoid Typing Password Every Time

🔒 open or create `.pgpass` file in home directory:

```bash
vim ~/.pgpass
```

Add line:

```sh
localhost:5432:msk_shikohabad_in:msk_user:your_password_here
```

Set permission:

```bash
chmod 600 ~/.pgpass
```

Now you can simply run this command:

```bash
psql -U msk_user -h localhost -d msk_shikohabad_in
```

---

## 3️⃣ Data Check Before Backup

👉 Useful Commands:

```sql
\l       -- list all databases
\c dbname -- connect to a database
\dt      -- show all tables
\q       -- back or exit 
```

Check rows inside table:

```sql
SELECT COUNT(*) FROM users_customuser;
```

* `0` → empty table
* `>0` → data present

---

## 4️⃣ Backup Database/Table

### 📝 Backup with full INSERTs:

```bash
pg_dump -U msk_user -h localhost -d msk_shikohabad_in -t users_customuser --column-inserts > users_backup.sql
```

👉 Notes:

`--column-inserts` use karne se output me `INSERT INTO` ... (col1, col2, ...) `VALUES` (...) aayega → easy to read and restore.


### ⚡ Faster backup (COPY format):

```bash
pg_dump -U msk_user -h localhost -d msk_shikohabad_in -t users_customuser > users_backup.sql
```

and 

```sh
pg_dump -U msk_user -h localhost -d msk_shikohabad_in -t users_customuser --data-only > users_backup_data.sql
```

👉 **Tip:** Always check file size after dump.

---

## 5️⃣ Restore Database/Table

### 🚨 Truncate before restore (safe):

```sql
TRUNCATE TABLE users_customuser RESTART IDENTITY CASCADE;
```

### ▶ Restore from file:

```bash
psql -U msk_user -h localhost -d msk_shikohabad_in -f users_backup.sql
```

⚠ If IDs clash → you may get duplicate key errors. Always truncate first.

---

## 6️⃣ Verify Backup

### 📏 Check file size:

```bash
ls -lh users_backup.sql
```

Agar file ka size `0` bytes nahi hai (jaise kuch MBs/KBs me hoga), to iska matlab backup hua hai.

### 🔎 Count inserted rows:

```bash
grep -c "INSERT INTO public.users_customuser" users_backup.sql
```



### 👀 Preview content:

```bash
head -n 20 users_backup.sql                     # Isse file ke starting ke 20 lines dikhengi.
grep "INSERT INTO" users_backup.sql | head
grep "COPY users_customuser" users_backup.sql
```

👉 Jaldi check karne ke liye `head users_backup.sql` aur `grep "INSERT"` best method hai.


---

## 7️⃣ Clean Course Related Tables

```sql
TRUNCATE TABLE courses_enrollmentfeesubmitrequest, courses_enrollmentfeehistory, courses_enrollment, courses_coursereview, courses_chaptertopic, courses_coursechapter, courses_course, courses_programminglanguage, courses_language, courses_category, courses_level, courses_platformsettings RESTART IDENTITY CASCADE;
```


---

## 8️⃣ Drop & Recreate Database existing database (if you want to recreate)

⚠ Warning: Deletes everything inside the DB.

```sql
DROP DATABASE IF EXISTS msk_shikohabad_in;
CREATE DATABASE msk_shikohabad_in OWNER msk_user;
```

---

## 9️⃣ Extra Important Points

* 🧑‍🤝‍🧑 **Create a new user with role**

  ```sql
  CREATE USER msk_user WITH PASSWORD 'your_password';
  GRANT ALL PRIVILEGES ON DATABASE msk_shikohabad_in TO msk_user;
  ```

* 📂 **Check schema exists**

  ```sql
  \dn
  ```

* 🔄 **Grant schema permissions** (common mistake if restore fails)

  ```sql
  GRANT ALL ON SCHEMA public TO msk_user;
  ```

* 🛠 **Check active connections** before dropping DB

  ```sql
  SELECT pid, usename, datname, application_name, client_addr FROM pg_stat_activity;
  ```

  Kill a connection:

  ```sql
  SELECT pg_terminate_backend(pid);
  ```

---

👉 This order ensures: **Password → Login → Data Check → Backup → Restore → Verify → Clean Tables → Drop DB → Extra Fixes**.

---

Would you like me to also **make a short one-page “cheat sheet” PDF version** of this (with all icons and compact commands) so that you can keep it handy while working on your VPS?





