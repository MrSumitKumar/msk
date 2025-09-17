

postgres=# ALTER USER postgres PASSWORD 'SSkk#?95postgrey@admin';
ALTER ROLE
postgres=# \q
postgres@msk:~$


1️⃣ Connect to PostgreSQL as your user

Use the database name explicitly:
```bash
psql -U msk_user -h localhost -d postgres -W
```

It will ask for the password (SSkk#?95postgrey) and then you should be inside the database.



\l                       -- list all databases
\c msk_shikohabad_in     -- connect to your database
\dt                      -- show all tables



```sh
TRUNCATE TABLE courses_enrollmentfeesubmitrequest, courses_enrollmentfeehistory, courses_enrollment, courses_coursereview, courses_chaptertopic, courses_coursechapter, courses_course, courses_programminglanguage, courses_language, courses_category, courses_level, courses_platformsettings RESTART IDENTITY CASCADE;
```


2️⃣ Drop the existing database (if you want to recreate)

Warning: This will delete all data in the database.
```bash
DROP DATABASE IF EXISTS msk_shikohabad_in;
```
