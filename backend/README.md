# Dayflow HRMS - Backend

Production-ready HRMS backend with Django, PostgreSQL, JWT authentication, employee management, and attendance tracking.

## Features

- **Authentication System**
  - Custom User model with auto-generated login_id
  - Admin/HR signup with role-based access
  - Flexible sign-in (login_id or email)
  - JWT authentication with access and refresh tokens

- **Employee Management**
  - Employee profiles with job title and department
  - Profile pictures support
  - Search and filter employees
  - Role-based access (Admin sees all, employees see only themselves)

- **Attendance Tracking**
  - Check-in/Check-out functionality
  - Real-time status tracking (PRESENT, ON_LEAVE, ABSENT)
  - Duration calculation
  - One record per user per day
  - Prevents duplicate check-ins

## Login ID Generation

Login IDs are auto-generated in the format: `{company_code}{name_code}{year}{serial}`

**Example:** `OIJODO20260001`
- `OI` = First 2 letters of company name (Odoo India)
- `JODO` = First 2 letters of first name (John) + first 2 letters of last name (Doe)
- `2026` = Year of joining
- `0001` = Serial number (increments for each user in that year)

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True

DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOW_ALL=True
```

### 3. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE dayflow_db;
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Sample Data (Optional)

```bash
python manage.py create_sample_employees
```

This creates 5 sample employees with the password `Employee123`.

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Admin/HR Sign Up

**POST** `/api/auth/admin/signup/`

Request:
```json
{
  "company_name": "Odoo India",
  "full_name": "John Doe",
  "email": "john@odoo.com",
  "phone": "+91-9876543210",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}
```

Response (201):
```json
{
  "user": {
    "id": "uuid-here",
    "login_id": "OIJODO20260001",
    "company_name": "Odoo India",
    "full_name": "John Doe",
    "email": "john@odoo.com",
    "phone": "+91-9876543210",
    "role": "ADMIN"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Sign In

**POST** `/api/auth/signin/`

Request (with login_id or email):
```json
{
  "login_identifier": "OIJODO20260001",
  "password": "SecurePass123"
}
```

Response (200):
```json
{
  "user": {
    "id": "uuid-here",
    "login_id": "OIJODO20260001",
    "company_name": "Odoo India",
    "full_name": "John Doe",
    "email": "john@odoo.com",
    "phone": "+91-9876543210",
    "role": "ADMIN"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Employee Management

#### List Employees

**GET** `/api/employees/`

Query Parameters:
- `search` (optional): Filter by name, email, login_id, job_title, or department

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
[
  {
    "id": "uuid-here",
    "login_id": "OIPRSH20260001",
    "full_name": "Priya Sharma",
    "email": "priya.sharma@odoo.com",
    "profile_picture": "https://i.pravatar.cc/150?img=1",
    "job_title": "Software Engineer",
    "department": "Engineering",
    "status_icon": "PRESENT"
  }
]
```

**Permissions:**
- Admin users see all employees
- Regular employees see only themselves

#### Get Employee Detail

**GET** `/api/employees/<uuid:user_id>/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "id": "uuid-here",
  "login_id": "OIPRSH20260001",
  "full_name": "Priya Sharma",
  "email": "priya.sharma@odoo.com",
  "phone": "+91-9876543210",
  "role": "EMPLOYEE",
  "profile_picture": "https://i.pravatar.cc/150?img=1",
  "job_title": "Software Engineer",
  "department": "Engineering",
  "date_joined": "2026-01-03T10:00:00Z",
  "status_icon": "PRESENT",
  "recent_attendance": [
    {
      "date": "2026-01-03",
      "check_in": "2026-01-03T09:00:00Z",
      "check_out": null,
      "status": "PRESENT",
      "duration": null
    }
  ]
}
```

### Attendance

#### Check In

**POST** `/api/attendance/check-in/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (201):
```json
{
  "since_time": "2026-01-03T09:00:00Z",
  "current_status": "PRESENT",
  "message": "Successfully checked in"
}
```

Error Response (400) - Already Checked In:
```json
{
  "error": "ALREADY_CHECKED_IN",
  "detail": "You have already checked in today and have not checked out yet."
}
```

#### Check Out

**POST** `/api/attendance/check-out/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "check_in_time": "2026-01-03T09:00:00Z",
  "check_out_time": "2026-01-03T18:00:00Z",
  "duration": "9h 0m",
  "message": "Successfully checked out"
}
```

Error Response (400) - Not Checked In:
```json
{
  "error": "NOT_CHECKED_IN",
  "detail": "You have not checked in today or have already checked out."
}
```

#### Get Current Status

**GET** `/api/attendance/current/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200) - Checked In:
```json
{
  "is_checked_in": true,
  "since_time": "2026-01-03T09:00:00Z",
  "check_in_time": "2026-01-03T09:00:00Z",
  "status_icon": "PRESENT",
  "duration_so_far": "2h 30m"
}
```

Response (200) - Not Checked In:
```json
{
  "is_checked_in": false,
  "since_time": null,
  "check_in_time": null,
  "status_icon": "ABSENT",
  "duration_so_far": null
}
```

## Frontend Integration Examples

### Using fetch

```javascript
const API_URL = 'http://localhost:8000/api';

// Get access token from localStorage
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
});

// Get employees list
const getEmployees = async (search = '') => {
  const url = search 
    ? `${API_URL}/employees/?search=${encodeURIComponent(search)}`
    : `${API_URL}/employees/`;
    
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  
  return response.json();
};

// Check in
const checkIn = async () => {
  const response = await fetch(`${API_URL}/attendance/check-in/`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Check-in failed');
  }
  
  return data;
};

// Get current status
const getCurrentStatus = async () => {
  const response = await fetch(`${API_URL}/attendance/current/`, {
    headers: getAuthHeaders()
  });
  
  return response.json();
};
```

### Using axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get employees list
export const getEmployees = async (search = '') => {
  const params = search ? { search } : {};
  const response = await api.get('/employees/', { params });
  return response.data;
};

// Check in
export const checkIn = async () => {
  try {
    const response = await api.post('/attendance/check-in/');
    return response.data;
  } catch (error) {
    if (error.response?.data?.error === 'ALREADY_CHECKED_IN') {
      throw new Error('Already checked in today');
    }
    throw error;
  }
};
```

## Status Icons

The `status_icon` field can have three values:

- `PRESENT` - Employee has checked in today (green indicator)
- `ON_LEAVE` - Employee is on leave (yellow indicator)
- `ABSENT` - Employee has not checked in today (red indicator)

## Permissions

### Admin Users (role='ADMIN')
- View all employees
- View all employee details
- Access all attendance records
- (Future) Create/edit employees

### Regular Employees (role='EMPLOYEE')
- View only their own profile
- Check in/out for themselves
- View their own attendance status

## Project Structure

```
backend/
├── dayflow_core/          # Django project
│   ├── settings.py        # Configuration
│   ├── urls.py            # Root routing
│   └── wsgi.py            # WSGI entry
├── accounts/              # Authentication
│   ├── models.py          # User model
│   ├── serializers.py     # Auth serializers
│   ├── views.py           # Auth endpoints
│   ├── urls.py            # Auth routes
│   ├── utils.py           # Login ID generator
│   └── management/        # Management commands
│       └── commands/
│           └── create_sample_employees.py
├── employees/             # Employee management
│   ├── models.py          # EmployeeProfile model
│   ├── serializers.py     # Employee serializers
│   ├── views.py           # Employee endpoints
│   ├── urls.py            # Employee routes
│   └── permissions.py     # Custom permissions
├── attendance/            # Attendance tracking
│   ├── models.py          # AttendanceRecord model
│   ├── serializers.py     # Attendance serializers
│   ├── views.py           # Attendance endpoints
│   └── urls.py            # Attendance routes
├── manage.py              # Django CLI
└── requirements.txt       # Dependencies
```

## Admin Panel

Access the Django admin at `http://localhost:8000/admin/`

Features:
- User management
- Employee profile management
- Attendance record management
- View login IDs and durations
- Filter and search capabilities
