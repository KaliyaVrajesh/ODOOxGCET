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

- **Profile Management**
  - Complete user profiles with public and private information
  - Skills management (add/remove skills with proficiency levels)
  - Certifications tracking (title, issuer, issue date)
  - Editable profile fields (job position, department, manager, location)
  - Private info section (about, interests, hobbies)

- **Time Off Management**
  - Multiple time off types (Paid, Sick, Unpaid)
  - Balance tracking per user, type, and year
  - Employee self-service (view balances, create requests)
  - Admin/HR approval workflow
  - Automatic balance deduction on approval
  - File attachment support for medical certificates

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
# Create sample employees
python manage.py create_sample_employees

# Create sample profile data for existing users
python manage.py create_sample_profiles

# Initialize time off types (Paid, Sick, Unpaid)
python manage.py init_timeoff_types

# Initialize time off balances for all users
python manage.py init_timeoff_balances

# Create sample time off requests
python manage.py create_sample_timeoff
```

This creates sample employees, profiles, time off types, balances, and requests for testing.

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

### Profile Management

#### Get My Profile

**GET** `/api/profile/me/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "id": "uuid-here",
  "full_name": "Priya Sharma",
  "login_id": "OIPRSH20260001",
  "email": "priya.sharma@odoo.com",
  "phone": "+91-9876543210",
  "company_name": "Odoo India",
  "job_position": "Software Engineer",
  "department": "Engineering",
  "manager_name": "Vikram Singh",
  "location": "Bangalore, India",
  "about": "Passionate software engineer with 5+ years of experience...",
  "what_i_love": "I love solving complex problems...",
  "interests_and_hobbies": "Reading tech blogs, hiking, photography...",
  "skills": [
    {
      "id": "uuid-here",
      "name": "Python",
      "level": "Expert"
    },
    {
      "id": "uuid-here",
      "name": "Django",
      "level": "Expert"
    }
  ],
  "certifications": [
    {
      "id": "uuid-here",
      "title": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "issued_date": "2023-06-15"
    }
  ]
}
```

#### Update My Profile

**PUT/PATCH** `/api/profile/me/`

Headers:
```
Authorization: Bearer <access_token>
```

Request Body (all fields optional for PATCH):
```json
{
  "job_position": "Senior Software Engineer",
  "department": "Engineering",
  "manager_name": "Vikram Singh",
  "location": "Bangalore, India",
  "about": "Updated about section...",
  "what_i_love": "Updated what I love...",
  "interests_and_hobbies": "Updated interests..."
}
```

Response (200):
```json
{
  "id": "uuid-here",
  "full_name": "Priya Sharma",
  "login_id": "OIPRSH20260001",
  "email": "priya.sharma@odoo.com",
  "phone": "+91-9876543210",
  "company_name": "Odoo India",
  "job_position": "Senior Software Engineer",
  "department": "Engineering",
  "manager_name": "Vikram Singh",
  "location": "Bangalore, India",
  "about": "Updated about section...",
  "what_i_love": "Updated what I love...",
  "interests_and_hobbies": "Updated interests...",
  "skills": [...],
  "certifications": [...]
}
```

#### Add Skill

**POST** `/api/profile/me/skills/`

Headers:
```
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "name": "Python",
  "level": "Expert"
}
```

Response (201):
```json
{
  "id": "uuid-here",
  "name": "Python",
  "level": "Expert"
}
```

Error Response (400) - Duplicate Skill:
```json
{
  "name": ["You already have this skill in your profile."]
}
```

#### Delete Skill

**DELETE** `/api/profile/me/skills/<uuid:skill_id>/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "message": "Skill deleted successfully"
}
```

#### Add Certification

**POST** `/api/profile/me/certifications/`

Headers:
```
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "title": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issued_date": "2023-06-15"
}
```

Note: `issuer` and `issued_date` are optional.

Response (201):
```json
{
  "id": "uuid-here",
  "title": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issued_date": "2023-06-15"
}
```

#### Delete Certification

**DELETE** `/api/profile/me/certifications/<uuid:certification_id>/`

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "message": "Certification deleted successfully"
}
```

### Time Off Management

#### Get My Time Off (Employee)

**GET** `/api/timeoff/me/`

Query Parameters:
- `year` (optional): Year to filter balances (default: current year)
- `search` (optional): Search in type name or status

Headers:
```
Authorization: Bearer <access_token>
```

Response (200):
```json
{
  "balances": [
    {
      "id": "uuid-here",
      "type_code": "PAID",
      "type_name": "Paid time off",
      "year": 2026,
      "allocated_days": "24.0",
      "used_days": "5.0",
      "available_days": "19.0"
    },
    {
      "id": "uuid-here",
      "type_code": "SICK",
      "type_name": "Sick leave",
      "year": 2026,
      "allocated_days": "7.0",
      "used_days": "2.0",
      "available_days": "5.0"
    }
  ],
  "requests": [
    {
      "id": "uuid-here",
      "employee_id": "uuid-here",
      "employee_name": "Priya Sharma",
      "timeoff_type_name": "Paid time off",
      "timeoff_type_code": "PAID",
      "start_date": "2026-06-01",
      "end_date": "2026-06-05",
      "allocation_days": "5.0",
      "status": "PENDING",
      "approved_by_name": null,
      "rejection_reason": "",
      "attachment_url": null,
      "created_at": "2026-01-03T10:00:00Z",
      "updated_at": "2026-01-03T10:00:00Z"
    }
  ]
}
```

#### Create Time Off Request (Employee)

**POST** `/api/timeoff/me/`

Headers:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data (if uploading attachment)
```

Request Body:
```json
{
  "timeoff_type": "uuid-of-timeoff-type",
  "start_date": "2026-07-01",
  "end_date": "2026-07-05",
  "allocation_days": "5.0",
  "attachment": "<file>"
}
```

Notes:
- `allocation_days` is optional - will be auto-calculated from date range if not provided
- `attachment` is optional - for medical certificates, etc.
- Status is automatically set to "PENDING"

Response (201):
```json
{
  "request": {
    "id": "uuid-here",
    "employee_id": "uuid-here",
    "employee_name": "Priya Sharma",
    "timeoff_type": "uuid-here",
    "timeoff_type_name": "Paid time off",
    "timeoff_type_code": "PAID",
    "start_date": "2026-07-01",
    "end_date": "2026-07-05",
    "allocation_days": "5.0",
    "status": "PENDING",
    "requested_by_name": "Priya Sharma",
    "approved_by_name": null,
    "rejection_reason": "",
    "attachment_url": null,
    "created_at": "2026-01-03T10:00:00Z",
    "updated_at": "2026-01-03T10:00:00Z"
  },
  "balances": [...],
  "message": "Time off request created successfully"
}
```

Error Response (400) - Invalid Dates:
```json
{
  "end_date": ["End date must be after or equal to start date."]
}
```

#### List All Time Off Requests (Admin/HR)

**GET** `/api/timeoff/admin/`

Query Parameters:
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED)
- `type` (optional): Filter by type code (PAID, SICK, UNPAID)
- `employee` (optional): Filter by employee UUID
- `search` (optional): Search in employee name, email, type, or status

Headers:
```
Authorization: Bearer <access_token>
```

Permissions: Admin or HR role required

Response (200):
```json
[
  {
    "id": "uuid-here",
    "employee_id": "uuid-here",
    "employee_name": "Priya Sharma",
    "timeoff_type_name": "Paid time off",
    "timeoff_type_code": "PAID",
    "start_date": "2026-06-01",
    "end_date": "2026-06-05",
    "allocation_days": "5.0",
    "status": "PENDING",
    "approved_by_name": null,
    "rejection_reason": "",
    "attachment_url": null,
    "created_at": "2026-01-03T10:00:00Z",
    "updated_at": "2026-01-03T10:00:00Z"
  }
]
```

#### Approve Time Off Request (Admin/HR)

**POST** `/api/timeoff/admin/<uuid:request_id>/approve/`

Headers:
```
Authorization: Bearer <access_token>
```

Permissions: Admin or HR role required

Response (200):
```json
{
  "request": {
    "id": "uuid-here",
    "employee_id": "uuid-here",
    "employee_name": "Priya Sharma",
    "timeoff_type": "uuid-here",
    "timeoff_type_name": "Paid time off",
    "timeoff_type_code": "PAID",
    "start_date": "2026-06-01",
    "end_date": "2026-06-05",
    "allocation_days": "5.0",
    "status": "APPROVED",
    "requested_by_name": "Priya Sharma",
    "approved_by_name": "Admin User",
    "rejection_reason": "",
    "attachment_url": null,
    "created_at": "2026-01-03T10:00:00Z",
    "updated_at": "2026-01-03T11:00:00Z"
  },
  "balances": [
    {
      "id": "uuid-here",
      "type_code": "PAID",
      "type_name": "Paid time off",
      "year": 2026,
      "allocated_days": "24.0",
      "used_days": "10.0",
      "available_days": "14.0"
    }
  ],
  "message": "Time off request approved successfully"
}
```

Error Response (400) - Already Processed:
```json
{
  "error": "INVALID_STATUS",
  "detail": "Cannot approve request with status: APPROVED"
}
```

Error Response (400) - Insufficient Balance:
```json
{
  "error": "INSUFFICIENT_BALANCE",
  "detail": "Insufficient balance. Requested: 10.0 days, Available: 5.0 days for Paid time off"
}
```

#### Reject Time Off Request (Admin/HR)

**POST** `/api/timeoff/admin/<uuid:request_id>/reject/`

Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body (optional):
```json
{
  "rejection_reason": "Overlaps with team event"
}
```

Permissions: Admin or HR role required

Response (200):
```json
{
  "request": {
    "id": "uuid-here",
    "employee_id": "uuid-here",
    "employee_name": "Priya Sharma",
    "timeoff_type": "uuid-here",
    "timeoff_type_name": "Paid time off",
    "timeoff_type_code": "PAID",
    "start_date": "2026-06-01",
    "end_date": "2026-06-05",
    "allocation_days": "5.0",
    "status": "REJECTED",
    "requested_by_name": "Priya Sharma",
    "approved_by_name": "Admin User",
    "rejection_reason": "Overlaps with team event",
    "attachment_url": null,
    "created_at": "2026-01-03T10:00:00Z",
    "updated_at": "2026-01-03T11:00:00Z"
  },
  "balances": [...],
  "message": "Time off request rejected"
}
```

#### Get Employee Balances (Admin/HR)

**GET** `/api/timeoff/admin/balances/<uuid:employee_id>/`

Query Parameters:
- `year` (optional): Year to get balances for (default: current year)

Headers:
```
Authorization: Bearer <access_token>
```

Permissions: Admin or HR role required

Response (200):
```json
{
  "employee_id": "uuid-here",
  "employee_name": "Priya Sharma",
  "year": 2026,
  "balances": [
    {
      "id": "uuid-here",
      "type_code": "PAID",
      "type_name": "Paid time off",
      "year": 2026,
      "allocated_days": "24.0",
      "used_days": "5.0",
      "available_days": "19.0"
    },
    {
      "id": "uuid-here",
      "type_code": "SICK",
      "type_name": "Sick leave",
      "year": 2026,
      "allocated_days": "7.0",
      "used_days": "2.0",
      "available_days": "5.0"
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

// Get my profile
const getMyProfile = async () => {
  const response = await fetch(`${API_URL}/profile/me/`, {
    headers: getAuthHeaders()
  });
  
  return response.json();
};

// Update my profile
const updateMyProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/profile/me/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }
  
  return data;
};

// Add skill
const addSkill = async (skillData) => {
  const response = await fetch(`${API_URL}/profile/me/skills/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(skillData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }
  
  return data;
};

// Delete skill
const deleteSkill = async (skillId) => {
  const response = await fetch(`${API_URL}/profile/me/skills/${skillId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  return response.json();
};

// Add certification
const addCertification = async (certData) => {
  const response = await fetch(`${API_URL}/profile/me/certifications/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(certData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }
  
  return data;
};

// Delete certification
const deleteCertification = async (certId) => {
  const response = await fetch(`${API_URL}/profile/me/certifications/${certId}/`, {
    method: 'DELETE',
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
├── profiles/              # Profile management
│   ├── models.py          # ProfileDetail, Skill, Certification models
│   ├── serializers.py     # Profile serializers
│   ├── views.py           # Profile endpoints
│   ├── urls.py            # Profile routes
│   └── management/        # Management commands
│       └── commands/
│           └── create_sample_profiles.py
├── timeoff/               # Time off management
│   ├── models.py          # TimeOffType, TimeOffBalance, TimeOffRequest models
│   ├── serializers.py     # Time off serializers
│   ├── views.py           # Time off endpoints
│   ├── urls.py            # Time off routes
│   ├── permissions.py     # Custom permissions
│   ├── utils.py           # Helper functions
│   └── management/        # Management commands
│       └── commands/
│           ├── init_timeoff_types.py
│           ├── init_timeoff_balances.py
│           └── create_sample_timeoff.py
├── manage.py              # Django CLI
└── requirements.txt       # Dependencies
```

## Admin Panel

Access the Django admin at `http://localhost:8000/admin/`

Features:
- User management
- Employee profile management
- Attendance record management
- Profile details management (job position, department, private info)
- Skills and certifications management
- Time off types configuration
- Time off balances tracking
- Time off requests approval/rejection
- View login IDs and durations
- Filter and search capabilities

## Time Off System

### Time Off Types
- **PAID** - Paid time off (default: 24 days/year)
- **SICK** - Sick leave (default: 7 days/year)
- **UNPAID** - Unpaid leaves (default: 0 days/year)

### Balance Tracking
- Balances are tracked per user, type, and year
- Auto-created when first needed
- Automatically deducted on approval
- Available days = Allocated days - Used days

### Request Workflow
1. Employee creates request (status: PENDING)
2. Admin/HR reviews request
3. Admin/HR approves (deducts from balance) or rejects
4. Employee sees updated status and balances

### Business Rules
- Employees can only view/create their own requests
- Admin/HR can view all requests and approve/reject
- Approval validates sufficient balance
- Rejection does not affect balance
- All status changes are auditable (approved_by, updated_at)

## Profile Structure

### Public/Header Fields (Editable)
- job_position
- department
- manager_name
- location

### Private Info Fields (Editable)
- about - General information about the user
- what_i_love - What the user loves about their work
- interests_and_hobbies - Personal interests and hobbies

### Skills
- name - Skill name (e.g., "Python", "Django")
- level - Proficiency level (e.g., "Expert", "Advanced", "Intermediate")

### Certifications
- title - Certification title
- issuer - Issuing organization (optional)
- issued_date - Date of issue (optional)

## Future Extensions

The system is designed to easily add:
- Salary information tab (reserved for future implementation)
- Leave management system
- Department and team hierarchy
- Shift scheduling
- Overtime tracking
- Payroll integration
- Performance reviews
- Document management
- Notifications and alerts
- Reports and analytics
- Mobile app support
