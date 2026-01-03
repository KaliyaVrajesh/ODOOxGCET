# 🚀 Dayflow HRMS - Human Resource Management System

A complete, production-ready HRMS built with **Django REST Framework** + **PostgreSQL** + **React** + **TypeScript**.

![Status](https://img.shields.io/badge/Status-Complete-success)
![Backend](https://img.shields.io/badge/Backend-Django%204.2-green)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with auto-refresh
- Role-based access control (Admin, HR, Employee)
- Auto-generated login IDs (OIJODO20260001 format)
- Secure password hashing

### 👥 Employee Management
- Employee profiles with avatars
- Job positions and departments
- Real-time status indicators
- Search and filter functionality

### ⏰ Attendance Tracking
- Check-in/check-out system
- Automatic duration calculation
- Admin day view with statistics
- Employee month view with summary
- Status tracking (Present, Absent, On Leave)

### 🏖️ Time Off Management
- Multiple leave types (Paid Time Off, Sick Leave, etc.)
- Balance tracking per employee
- Request creation with attachments
- Admin approval/rejection workflow
- Automatic balance deduction

### 👤 Profile Management
- **Resume Tab**: Personal details, bank information
- **Private Info Tab**: About sections, skills, certifications
- **Salary Tab**: Complete salary breakdown (Admin/HR only)
- **Security Tab**: Password management (coming soon)
- Auto-save functionality
- Skills and certifications CRUD

### 💰 Salary Management
- Auto-calculated salary components
- Gross, net, and annual salary
- Deductions (PF, tax, etc.)
- Monthly and yearly breakdowns
- Role-based visibility

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL 14+
- **Authentication**: Simple JWT
- **API**: RESTful with comprehensive endpoints
- **CORS**: Configured for frontend integration

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **State Management**: React Hooks
- **UI Theme**: Purple accent (#E381FF)

---

## 📁 Project Structure

```
dayflow-hrms/
├── backend/                    # Django REST API
│   ├── accounts/              # Authentication & User management
│   ├── employees/             # Employee profiles
│   ├── attendance/            # Attendance tracking
│   ├── profiles/              # Complete profile management
│   ├── timeoff/               # Time off management
│   ├── dayflow_core/          # Project settings
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── api/              # API integration layer
│   │   └── app/              # React components
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite configuration
│
├── setup_backend.bat          # Windows backend setup script
├── setup_frontend.bat         # Windows frontend setup script
├── QUICK_START.md            # Quick start guide
└── SYSTEM_STATUS_AND_SETUP.md # Complete setup guide
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Option 1: Automated Setup (Windows)

```bash
# Setup backend
setup_backend.bat

# Setup frontend (in new terminal)
setup_frontend.bat
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure database (edit .env)
copy .env.example .env

# Run migrations
python manage.py migrate

# Create sample data (optional)
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
echo VITE_API_URL=http://localhost:8000/api > .env

# Start dev server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

---

## 🧪 Testing

### Test Credentials (after running sample data)
- **Admin**: admin@dayflow.com / admin123
- **Employee**: employee@dayflow.com / employee123

### Test Flow
1. **Sign Up** → Create admin account
2. **Sign In** → JWT authentication
3. **Check In** → Create attendance record
4. **View Attendance** → See statistics
5. **Request Time Off** → Create leave request
6. **Update Profile** → Edit personal details
7. **Add Skills** → Manage skills and certifications

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[SYSTEM_STATUS_AND_SETUP.md](SYSTEM_STATUS_AND_SETUP.md)** - Complete setup guide
- **[ALL_PAGES_CONNECTED.md](ALL_PAGES_CONNECTED.md)** - Feature overview
- **[backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - API reference
- **[FINAL_SETUP_AND_TEST.md](FINAL_SETUP_AND_TEST.md)** - Testing guide

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/admin/signup/` - Admin registration
- `POST /api/auth/signin/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Employees
- `GET /api/employees/` - List employees
- `GET /api/employees/{id}/` - Employee detail

### Attendance
- `POST /api/attendance/check-in/` - Check in
- `POST /api/attendance/check-out/` - Check out
- `GET /api/attendance/admin/day/` - Admin day view
- `GET /api/attendance/me/month/` - Employee month view

### Profile
- `GET /api/profile/me/full/` - Complete profile
- `PATCH /api/profile/me/full/` - Update profile
- `POST /api/profile/me/skills/` - Add skill
- `DELETE /api/profile/me/skills/{id}/` - Delete skill

### Time Off
- `GET /api/timeoff/me/` - My requests
- `POST /api/timeoff/me/` - Create request
- `POST /api/timeoff/admin/{id}/approve/` - Approve request

See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for complete reference.

---

## 🎨 Screenshots

### Dashboard
Employee cards with real-time status indicators and check-in/out functionality.

### Attendance Page
- **Admin View**: Day view with statistics and employee table
- **Employee View**: Month view with summary tiles

### Time Off Page
- **Employee View**: Request creation and balance tracking
- **Admin View**: Approval workflow

### My Profile
- **Resume Tab**: Personal and bank details
- **Private Info Tab**: Skills and certifications
- **Salary Tab**: Complete salary breakdown (Admin only)

---

## 🔒 Security Features

- JWT authentication with secure token storage
- Password hashing with Django's built-in system
- Role-based access control
- CORS configuration
- SQL injection protection (Django ORM)
- XSS protection
- CSRF protection

---

## 🛠️ Development

### Backend Development
```bash
cd backend
venv\Scripts\activate

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Frontend Development
```bash
cd frontend

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure production database
3. Set secure `SECRET_KEY`
4. Configure `ALLOWED_HOSTS`
5. Collect static files: `python manage.py collectstatic`
6. Use production WSGI server (Gunicorn, uWSGI)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting service
3. Configure environment variables
4. Set up reverse proxy (Nginx, Apache)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Django REST Framework for the excellent API framework
- React team for the amazing frontend library
- PostgreSQL for the robust database
- Tailwind CSS for the utility-first CSS framework

---

## 📞 Support

For issues, questions, or contributions:
- Check the documentation files
- Review the API documentation
- Check browser console for errors
- Review backend logs

---

## ✅ Status

**Project Status**: ✅ Complete and Production-Ready

- ✅ Backend: Complete Django REST API
- ✅ Frontend: Complete React TypeScript app
- ✅ Integration: All pages connected
- ✅ Authentication: JWT with auto-refresh
- ✅ Database: PostgreSQL with migrations
- ✅ Documentation: Comprehensive guides
- ✅ Testing: Manual testing complete
- ✅ Security: Role-based access control

---

## 🎯 Next Steps

1. **Setup**: Follow QUICK_START.md to get running
2. **Test**: Create account and test all features
3. **Customize**: Add your company logo and branding
4. **Deploy**: Follow deployment guide for production
5. **Extend**: Add new features as needed

---

**Built with ❤️ for modern HR management**