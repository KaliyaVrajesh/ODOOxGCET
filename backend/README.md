# Dayflow HRMS - Backend

Production-ready HRMS backend with Django, PostgreSQL, and auto-generated login IDs.

## Features

- Custom User model with auto-generated login_id
- Admin/HR signup with role-based access
- Flexible sign-in (login_id or email)
- JWT authentication with access and refresh tokens
- PostgreSQL database
- CORS enabled for frontend integration
- Scalable structure for future features

## Login ID Generation

Login IDs are auto-generated in the format: `{company_code}{name_code}{year}{serial}`

**Example:** `OIJODO20220001`
- `OI` = First 2 letters of company name (Odoo India)
- `JODO` = First 2 letters of first name (John) + first 2 letters of last name (Doe)
- `2022` = Year of joining
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

### 5. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Admin/HR Sign Up

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

**Password Requirements:**
- Minimum 8 characters
- At least one number
- At least one letter

**Validation Errors:**
```json
{
  "email": ["A user with this email already exists."],
  "password": ["Password must contain at least one number."],
  "confirm_password": ["Passwords do not match."]
}
```

### Sign In

**POST** `/api/auth/signin/`

Request (with login_id):
```json
{
  "login_identifier": "OIJODO20260001",
  "password": "SecurePass123"
}
```

Request (with email):
```json
{
  "login_identifier": "john@odoo.com",
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

Error Response (401):
```json
{
  "error": "INVALID_CREDENTIALS",
  "detail": "Invalid login credentials. Please check your login ID/email and password."
}
```

## Frontend Integration

### Using fetch

```javascript
// Admin Sign Up
const adminSignup = async (formData) => {
  const response = await fetch('http://localhost:8000/api/auth/admin/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      company_name: formData.companyName,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw data;
  }
};

// Sign In
const signin = async (loginIdentifier, password) => {
  const response = await fetch('http://localhost:8000/api/auth/signin/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login_identifier: loginIdentifier,
      password: password,
    }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw data;
  }
};

// Making authenticated requests
const getProtectedData = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:8000/api/some-endpoint/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

### Using axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

// Admin Sign Up
export const adminSignup = async (formData) => {
  const response = await axios.post(`${API_URL}/admin/signup/`, {
    company_name: formData.companyName,
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    confirm_password: formData.confirmPassword,
  });
  
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
};

// Sign In
export const signin = async (loginIdentifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/signin/`, {
      login_identifier: loginIdentifier,
      password: password,
    });
    
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    if (error.response?.data?.error === 'INVALID_CREDENTIALS') {
      throw new Error('Invalid login credentials');
    }
    throw error;
  }
};
```

### Using curl

```bash
# Admin Sign Up
curl -X POST http://localhost:8000/api/auth/admin/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Odoo India",
    "full_name": "John Doe",
    "email": "john@odoo.com",
    "phone": "+91-9876543210",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123"
  }'

# Sign In with login_id
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "OIJODO20260001",
    "password": "SecurePass123"
  }'

# Sign In with email
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "john@odoo.com",
    "password": "SecurePass123"
  }'

# Authenticated request
curl -X GET http://localhost:8000/api/some-endpoint/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## JWT Token Configuration

- Access token lifetime: 1 hour
- Refresh token lifetime: 7 days
- Tokens include: user_id, email, role, login_id
- Easy to extend with additional claims

## User Roles

- **ADMIN**: HR/Admin users (created via signup)
- **EMPLOYEE**: Regular employees (to be added later)

## Future Extensions

The system is designed to easily add:
- Employee management endpoints
- Department and team management
- Attendance tracking
- Leave management
- Payroll integration
- Performance reviews
- Document management
- Notifications system

## Project Structure

```
backend/
├── dayflow_core/          # Django project
│   ├── settings.py        # Configuration
│   ├── urls.py            # Root routing
│   └── wsgi.py            # WSGI entry
├── accounts/              # Authentication app
│   ├── models.py          # User model
│   ├── serializers.py     # DRF serializers
│   ├── views.py           # Auth endpoints
│   ├── urls.py            # Auth routes
│   ├── utils.py           # Login ID generator
│   └── admin.py           # Admin config
├── manage.py              # Django CLI
└── requirements.txt       # Dependencies
```

## Admin Panel

Access the Django admin at `http://localhost:8000/admin/`

Features:
- User management
- View login IDs
- Filter by role, status, date
- Search by login_id, email, name, company
