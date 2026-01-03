# Dayflow - Employee Management System

A full-stack employee management system built with Django REST Framework and React + TypeScript.

## Features

- 🔐 **Authentication**: JWT-based authentication with auto-generated login IDs
- 👥 **Employee Management**: View all employees with real-time status indicators
- ⏰ **Attendance Tracking**: Check-in/check-out system with duration tracking
- 🏖️ **Time Off Management**: Request, approve, and track time off with balance management
- 👤 **Profile Management**: Comprehensive employee profiles with skills, certifications, and salary details
- 🎯 **Role-Based Access**: Admin, HR, and Employee roles with appropriate permissions

## Tech Stack

### Backend
- Django 4.2.27
- Django REST Framework
- PostgreSQL
- Simple JWT for authentication

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- Tailwind CSS
- Lucide React (icons)

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Automated Setup (Recommended)

**Windows Users:**
1. Run `setup_backend_complete.bat` - Sets up backend, database, and creates demo data
2. Run `setup_frontend.bat` - Sets up frontend
3. Run `start_backend.bat` - Starts Django server
4. In a new terminal, run `npm run dev` in the frontend folder

### Demo Data

The system includes comprehensive test data with:
- 7 users (1 Admin, 1 HR, 5 Employees)
- Complete profiles with personal info, education, experience
- Bank details and salary structures
- Skills and certifications
- 7 days of attendance records
- Sample time off requests (approved, pending, rejected)

**View Demo Data:**
```bash
cd backend
python manage.py reset_all_data  # Reset and recreate all demo data
```

See `backend/DATABASE_DEMO_DATA.md` for complete documentation of demo data.

**Login Credentials:**
- Admin: admin@dayflow.com / admin123
- HR: hr@dayflow.com / hr123
- Employees: john.doe@dayflow.com / employee123 (and 4 others)

### Manual Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE dayflow_db;
```

5. Update `.env` file with your database credentials:
```env
DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create initial data:
```bash
python manage.py reset_all_data
```

8. Start development server:
```bash
python manage.py runserver
```

Backend will be available at: http://127.0.0.1:8000/

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173/

## Default Credentials

### Admin
- Email: `admin@dayflow.com`
- Password: `admin123`

### HR Manager
- Email: `hr@dayflow.com`
- Password: `hr123`

### Employees
All employees use password: `employee123`
- `john.doe@dayflow.com`
- `jane.smith@dayflow.com`
- `mike.wilson@dayflow.com`
- `sarah.jones@dayflow.com`
- `david.brown@dayflow.com`

## API Documentation

See `backend/API_DOCUMENTATION.md` for detailed API endpoints and usage.

## Features Overview

### For All Users
- ✅ View all employees and their status
- ✅ Check in/out for attendance
- ✅ Create time off requests
- ✅ View and update own profile
- ✅ Search employees

### For Admin/HR Only
- ✅ View all attendance records
- ✅ Approve/reject time off requests
- ✅ View all time off requests
- ✅ Manage employee data

## Project Structure

```
dayflow/
├── backend/
│   ├── accounts/          # User authentication
│   ├── employees/         # Employee profiles
│   ├── attendance/        # Attendance tracking
│   ├── timeoff/          # Time off management
│   ├── profiles/         # Detailed profiles
│   └── dayflow_core/     # Django settings
├── frontend/
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── app/          # React components
│   │   └── styles/       # CSS styles
│   └── public/           # Static assets
└── README.md
```

## Database Schema

- **Users**: Authentication and basic info
- **EmployeeProfile**: Job title, department, profile picture
- **AttendanceRecord**: Check-in/out times and status
- **TimeOffType**: Types of leave (PTO, sick, unpaid)
- **TimeOffBalance**: Available days per user
- **TimeOffRequest**: Leave requests with approval workflow
- **ProfileDetail**: Extended profile information
- **Skills & Certifications**: Employee qualifications

## Development

### Backend Commands

```bash
# Create admin users
python manage.py create_admin_users

# Reset all data (WARNING: Deletes everything)
python manage.py reset_all_data

# Check employee profiles
python manage.py check_profiles
```

### Frontend Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for efficient employee management**
