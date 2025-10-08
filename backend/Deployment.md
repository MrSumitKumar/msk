
## ✅ **Part 1: Django Backend Deployment (Gunicorn + Nginx + HTTPS)**

### 1. **Setup Environment on Server**

```bash
sudo apt update && sudo apt upgrade
sudo apt install python3-pip python3-venv nginx
```

### 2. **Clone Project & Setup Virtual Environment**

```bash
cd ~
git clone <your-repo-url> msk
cd msk/backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 3. **Django Settings Update**

* In `settings.py`:

  ```python
  ALLOWED_HOSTS = ['api.shikohabad.in']
  STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
  ```

### 4. **Collect Static Files**

```bash
python manage.py collectstatic
```

### 5. **Gunicorn Setup**

✍️ 1. Create a new systemd service file

```bash
sudo vim /etc/systemd/system/api.shikohabad.in.gunicorn.service
```

📄 Paste this config:

```ini
[Unit]
Description=Gunicorn daemon for E-Kharidari.in backend
After=network.target

[Service]
User=sumit
Group=www-data
WorkingDirectory=/home/sumit/ekharidari/backend
Environment="PYTHONPATH=/home/sumit/ekharidari/backend"
ExecStart=/home/sumit/ekharidari/backend/env/bin/gunicorn --workers 3 --bind unix:/home/sumit/ekharidari/backend/run/api.ekharidari.in.gunicorn.sock backend.wsgi:application

[Install]
WantedBy=multi-user.target

```

💾 Save and exit.

## ✅ PHASE 3: Restart and Enable Services

🔄 Reload systemd
```bash
sudo systemctl daemon-reload
```

✅ Enable & start Gunicorn service:

```bash
sudo systemctl enable api.ekharidari.in.gunicorn.service
sudo systemctl start api.ekharidari.in.gunicorn.service
```

✅ Restart Nginx
```bash
sudo systemctl restart nginx
```

## ✅ PHASE 4: Confirm Everything Works

✅ Check Gunicorn status
```bash
sudo systemctl status api.ekharidari.in.gunicorn.service
```

### 6. **Nginx Configuration**

```bash
sudo vim /etc/nginx/sites-available/api.ekharidari.in
```

Paste:

```nginx
server {
    listen 80;
    server_name api.ekharidari.in;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/sumit/ekharidari/backend;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/sumit/ekharidari/backend/run/api.ekharidari.in.gunicorn.sock;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/api.ekharidari.in /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### 7. **Enable HTTPS**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.ekharidari.in
```

---

## ✅ **Part 2: React Frontend Deployment (Vite + Nginx)**

### 1. **Build React App**

```bash
cd ~/msk/frontend
npm install
npm run build
```

Build output will be in `dist/`

### 2. **Move to Server Root**

```bash
sudo cp -r dist/ /var/www/msk.shikohabad.in/
```

### 3. **Nginx Config for Frontend**

```bash
sudo vim /etc/nginx/sites-available/msk.shikohabad.in
```

Paste:

```nginx
server {
    listen 80;
    server_name msk.shikohabad.in;

    root /var/www/msk.shikohabad.in;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
server {
    server_name msk.shikohabad.in;

    root /home/sumit/msk/frontend/dist;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8003/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/msk.shikohabad.in/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/msk.shikohabad.in/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = msk.shikohabad.in) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name msk.shikohabad.in;
    return 404; # managed by Certbot
}
```








Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/msk.shikohabad.in /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### 4. **Enable HTTPS**

```bash
sudo certbot --nginx -d msk.shikohabad.in
```

---

## ✅ **Important Notes**

* Update React `.env`:

  ```env
  VITE_API_BASE_URL=https://api.shikohabad.in/api/
  ```
* Use `axios` with this base URL in frontend.
* Make sure CORS is allowed in Django:

  ```python
  CORS_ALLOWED_ORIGINS = ['https://msk.shikohabad.in']
  ```

---

Would you like this as a downloadable PDF or `.md` (Markdown) file as well?
