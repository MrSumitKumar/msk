
# 🚀 **MSK - Advanced Learning & Earning Platform**

![MSK Platform](./frontend/public/brand/logo.png)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![MLM](https://img.shields.io/badge/MLM-Integrated-orange.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Business Model](#business-model)
- [Contributing](#contributing)
- [License](#license)

---

## � Overview

MSK is a revolutionary platform that combines professional skill development with a structured earning system. It offers:

- 💡 High-quality online courses in tech and digital skills
- 💰 Multi-level marketing (MLM) based earning opportunities
- 🎓 Professional certifications
- 👥 Community-driven learning environment
- 🤝 Referral-based growth system

## ✨ Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication
- Role-based access control (Student/Teacher/Admin)
- Social login integration
- Profile management with avatar support
- Two-factor authentication (2FA)

### 📚 Learning Management System (LMS)
- Course creation and management
- Video lecture integration
- Interactive assignments
- Progress tracking
- Certificate generation
- Quiz and assessment system

### 💹 MLM System
- Binary tree structure
- Multi-level commission system
- Real-time team visualization
- Automated placement system
- Commission tracking dashboard
- Payout management

### 💼 Business Features
- Subscription management
- Payment gateway integration
- Wallet system
- Commission distribution
- Withdrawal requests
- Income reports

### 📱 User Interface
- Responsive design
- Dark/Light theme
- Real-time notifications
- Interactive dashboards
- Mobile-first approach

---

## � Getting Started

### Prerequisites
```bash
# Frontend dependencies
node >= 16.x
npm >= 8.x

# Backend dependencies
python >= 3.8
virtualenv
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/msk.git
cd msk
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend Setup**
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: .\env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

4. **Environment Variables**
```bash
# Create .env files in both frontend and backend directories
cp .env.example .env
```

## 🏗 Architecture

### System Design
```
├── Frontend (React)
│   ├── Authentication
│   ├── Course Management
│   ├── MLM System
│   ├── User Dashboard
│   └── Admin Panel
│
├── Backend (Django)
│   ├── User Management
│   ├── MLM Logic
│   ├── Course Management
│   ├── Payment Processing
│   └── API Endpoints
│
└── Services
    ├── Redis (Caching/Queue)
    ├── PostgreSQL
    ├── S3 (File Storage)
    └── Email Service
```

---

## 💳 **Entry Level Plans**

| Plan Name   | Price (INR) | Features                                                                                                   |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| **Starter** | ₹499        | 1 Basic Skill Module (HTML Basics / Canva Design), Limited MLM Access (Matching Only, ₹300/day cap)        |
| **Pro**     | ₹999        | 2 Skill Modules (HTML + Python Basics / Digital Marketing Starter), Level Income (Level 1–3), ₹500/day cap |
| **Premium** | ₹15,000+    | Full 1-Year Course Access (Any Premium Course), All Income Types Unlocked, ₹10,000/day cap                 |

---

## 🎓 **Premium Course Options** (₹15k–₹25k)

| Sr | Course Name                     | Duration | Price   |
| -- | ------------------------------- | -------- | ------- |
| 1  | Python + Django Full Stack      | 1 Year   | ₹15,000 |
| 2  | Digital Marketing & Automation  | 1 Year   | ₹15,000 |
| 3  | UI/UX Design & Frontend         | 1 Year   | ₹15,000 |
| 4  | Data Science with Python        | 1 Year   | ₹20,000 |
| 5  | Cybersecurity & Ethical Hacking | 1 Year   | ₹20,000 |
| 6  | Blockchain & Web3 Development   | 1 Year   | ₹25,000 |

---

## 💰 **Income Distribution Structure (20% Commission Pool)**

| Income Type     | % of Course Fee | How It Works                      | Example (₹15k Course) |
| --------------- | --------------- | --------------------------------- | --------------------- |
| Direct Income   | 5%              | Direct referral bonus             | ₹750                  |
| Level Income    | 6%              | Up to 10 Levels                   | ₹900                  |
| Matching Income | 4%              | Binary pairing bonus              | ₹600                  |
| Resale Income   | 5%              | Downline course resale commission | ₹750                  |
| **Total**       | **20%**         |                                   | **₹3,000**            |

---

### 📊 **Level Income Split (6%)**

| Level | Commission % | Condition               |
| ----- | ------------ | ----------------------- |
| 1     | 2%           | No condition            |
| 2     | 1.5%         | No condition            |
| 3     | 1%           | No condition            |
| 4     | 0.5%         | Min. 5 active downline  |
| 5–10  | 0.2% each    | Min. 10 active downline |

---

## 🔄 **Resale Income (5% - 10 Level Model)**

* L1: 1%
* L2: 0.8%
* L3: 0.6%
* L4: 0.4%
* L5–L8: 0.3% each
* L9: 0.5%
* L10: 0.8%

---

## ⚡ **Special Bonuses**

1. **Course Upgrade Bonus** – Premium user upgrade पर sponsor को ₹500 बोनस
2. **Leadership Overriding** – Silver: 0.5% team sales, Gold: 1% team sales
3. **Global Pool** – Top 10 sellers share 2% pool
4. **Trial Conversion Commission** – Free user को paid में convert करने पर ₹299

---

## 🛡 **Legal & Risk Management**

* Courses only (no product stock)
* Income disclaimer everywhere
* 10% TDS on payouts
* Max payout cap ₹2 lakh/user/month
* No-refund after 7 days or 1st module completion

---

## � Documentation

### API Documentation
- Complete API documentation available at `/api/docs/`
- Swagger UI for testing endpoints
- Authentication and endpoints usage guide

### MLM System
- Binary tree implementation
- Commission calculation logic
- Team structure and hierarchy
- Placement algorithms
- Payout processing



# MLM Registration & Auto-Placement System

This module handles **MLM member registration and placement** with **auto-balancing logic**.

---

## 🔑 Key Concepts

- **Sponsor**  
  The member who directly referred the new user.  
  - Set at the time of registration using the referral link or entered username.  
  - Always saved as `sponsor` field.

- **Head Member**  
  The actual **upline node** under which the new member is placed.  
  - Calculated using the auto-placement rules.  
  - May be different from the sponsor.  
  - Saved as `head_member`.

- **Position**  
  Defines whether the new member is placed on the **LEFT** or **RIGHT** side of the head.  
  - Stored in `position`.

---

## ⚙️ Placement Rules

1. **Auto Position Selection**
   - If sponsor's `left_count < right_count` → place in LEFT branch.
   - If sponsor's `right_count < left_count` → place in RIGHT branch.
   - If both counts are equal → default to **LEFT**.

2. **Traversal**
   - If the chosen side is empty → place the new member directly.
   - If not empty → keep moving **downward in the same side** (left→left or right→right)  
     until an empty slot is found.

3. **Head Member**
   - The node where the new member is finally attached.  
   - This becomes the `head_member`.

4. **Sponsor**
   - Always the user who referred the new member.  
   - Remains fixed even if the placement happens under a different head.

5. **Ancestor Updates**
   - After placement, update **all ancestor counts** (`left_count` or `right_count`) up the tree.

---

## 📝 Example

### Input
- New member registered with sponsor = `anshul`.

### Output
- Suppose Anshul’s left and right counts are equal.  
- System selects **LEFT branch**.  
- Traverses until it finds an empty left slot (e.g., under Prince).  
- New member is placed there.

### Result
- **Sponsor** = `anshul`  
- **Head Member** = `prince`  
- **Position** = `LEFT`  

---

## 📂 Important Model Fields

- `sponsor` → Referrer of the user  
- `head_member` → Actual placement parent  
- `position` → LEFT / RIGHT under the head  
- `left` / `right` → Direct child references  
- `left_count` / `right_count` → Cached subtree counts  

---

## ✅ Benefits of This Approach

- **Balanced growth** of the tree (auto left/right selection).  
- **No manual intervention** needed for placement.  
- **Correct sponsor tracking** even when head member is different.  
- **Fast retrieval** with cached counters.

---

## 🚀 Usage

During registration:

1. User enters **sponsor username** (or comes via referral link).  
2. System finds placement automatically using the above rules.  
3. New member is saved with correct `sponsor`, `head_member`, and `position`.  
4. Tree counters are updated automatically.

---

## 🔍 Example Table Output

| User             | Position | Head Username  | Sponsor Username |
|------------------|----------|----------------|------------------|
| sapna choudary (SAPNA88638775) | Left  | PRINCE66522320 | PRINCE66522320 |
| mogli kumari (MOGLI71082622)   | Right | PRINCE66522320 | ANSHUL77892619 |
| prince kumar (PRINCE66522320)  | Right | AMIT33952647   | SUMIT12032468  |
| ankit yadav (ANKIT7197826)     | Left  | AMIT33952647   | AMIT33952647   |
| kittu yadav (KITTU23222285)    | Left  | SUMIT12032468  | SUMIT12032468  |
| anu kumari (ANU84974761)       | Left  | ROHIT41637152  | ROHIT41637152  |
| golu kumar (GOLU94765954)      | Right | MOHIT59070738  | MOHIT59070738  |
| rani yadav (RANI76012474)      | Left  | ATUL78474103   | MOHIT59070738  |
| rohit yadav (ROHIT41637152)    | Right | MOHIT59070738  | MOHIT59070738  |
| atul yadav (ATUL78474103)      | Left  | MOHIT59070738  | ANUJ28731368   |
| amit yadav (AMIT33952647)      | Right | SUMIT12032468  | ANSHUL77892619 |
| mohit kumar (MOHIT59070738)    | Left  | ANUJ28731368   | ANUJ28731368   |
| sumit kumar (SUMIT12032468)    | Right | ANSHUL77892619 | ANSHUL77892619 |
| anuj kumar (ANUJ28731368)      | Left  | ANSHUL77892619 | ANSHUL77892619 |
| anshul yadav (ANSHUL77892619)  | -     | -              | -              |

---

💡 With this README, anyone can understand **how registration + placement works** in your project.







## � Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **State Management:** Context API
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Lucide icons
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast
- **Charts:** React Charts

### Backend
- **Framework:** Django 5.0
- **API:** Django REST Framework
- **Database:** SQLite (Development), PostgreSQL (Production)
- **Authentication:** JWT with Simple JWT
- **File Storage:** Django Storage with AWS S3
- **Task Queue:** Celery with Redis
- **Caching:** Redis
- **Email:** SMTP with SendGrid

### DevOps & Tools
- **Version Control:** Git
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Monitoring:** Sentry
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest (Frontend), PyTest (Backend)
- **Code Quality:** ESLint, Black

### Security
- **Authentication:** JWT with refresh tokens
- **Password Security:** Argon2 hashing
- **API Security:** CORS, Rate limiting
- **Data Protection:** Field-level encryption
- **Input Validation:** Frontend + Backend validation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- React Team
- Django Team
- All Contributors
- Our Amazing Community

---

Made with ❤️ by MSK Team


