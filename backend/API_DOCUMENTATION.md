# Dayflow HRMS - Complete API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except signup/signin) require JWT authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication APIs

### 1.1 Admin Signup
```http
POST /api/auth/admin/signup/
```

**Request Body:**
```json
{
  "company_name": "Tech Solutions Inc",
  "full_name": "John Doe",
  "email": "admin@company.com",
  "phone": "+1234567890",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "login_id": "TEJO20260001",
    "company_name": "Tech Solutions Inc",
    "full_name": "John Doe",
    "email": "admin@company.com",
    "phone": "+1234567890",
    "role": "ADMIN"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 1.2 Sign In
```http
POST /api/auth/signin/
```

**Request Body:**
```json
{
  "login_identifier": "admin@company.com",  // or login_id
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "login_id": "TEJO20260001",
    "full_name": "John Doe",
    "email": "admin@company.com",
    "role": "ADMIN"
  },
  "tokens": {
    "access": "...",
    "refresh": "..."
  }
}
```

---

## 2. Employee APIs

### 2.1 List Employees
```http
GET /api/employees/?search=john
```

**Response (200):**
```json
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@company.com",
      "login_id": "TEJO20260001",
      "job_position": "Software Engineer",
      "profile_picture": null,
      "status_icon": "PRESENT"  // PRESENT, ABSENT, ON_LEAVE
    }
  ]
}
```

### 2.2 Employee Detail
```http
GET /api/employees/{id}/
```

**Response (200):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "email": "john@company.com",
  "login_id": "TEJO20260001",
  "phone": "+1234567890",
  "job_position": "Software Engineer",
  "department": "Engineering",
  "profile_picture": null
}
```

---

## 3. Attendance APIs

### 3.1 Check In
```http
POST /api/attendance/check-in/
```

**Response (201):**
```json
{
  "message": "Checked in successfully",
  "since_time": "09:30",
  "status": "PRESENT"
}
```

**Error (400):**
```json
{
  "error": "ALREADY_CHECKED_IN",
  "message": "You have already checked in today"
}
```

### 3.2 Check Out
```http
POST /api/attendance/check-out/
```

**Response (200):**
```json
{
  "message": "Checked out successfully",
  "duration": "8h 30m",
  "check_in": "09:30",
  "check_out": "18:00"
}
```

### 3.3 Current Status
```http
GET /api/attendance/current/
```

**Response (200):**
```json
{
  "is_checked_in": true,
  "since_time": "09:30",
  "status_icon": "PRESENT",
  "check_in_time": "2026-01-03T09:30:00Z",
  "check_out_time": null
}
```

### 3.4 Admin Day View
```http
GET /api/attendance/admin/day/?date=2026-01-03
```

**Response (200):**
```json
{
  "date": "03/01/2026",
  "total_present": 8,
  "total_absent": 2,
  "total_on_leave": 1,
  "employees": [
    {
      "id": "uuid",
      "employee_name": "John Doe",
      "date": "03/01/2026",
      "check_in": "09:30",
      "check_out": "18:00",
      "work_hours": "08:30",
      "extra_hours": "00:00",
      "status": "PRESENT"
    }
  ]
}
```

### 3.5 Employee Month View
```http
GET /api/attendance/me/month/?month=1&year=2026
```

**Response (200):**
```json
{
  "month": "Jan",
  "year": 2026,
  "days_present": 20,
  "days_on_leave": 2,
  "total_days": 31,
  "records": [
    {
      "id": "uuid",
      "date": "03/01/2026",
      "check_in": "09:30",
      "check_out": "18:00",
      "work_hours": "08:30",
      "extra_hours": "00:00",
      "status": "PRESENT"
    }
  ]
}
```

---

## 4. Profile APIs

### 4.1 Get Full Profile
```http
GET /api/profile/me/full/
```

**Response (200):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "login_id": "TEJO20260001",
  "email": "john@company.com",
  "phone": "+1234567890",
  "company_name": "Tech Solutions Inc",
  "role": "ADMIN",
  "profile": {
    "job_position": "Software Engineer",
    "department": "Engineering",
    "manager_name": "Jane Smith",
    "location": "San Francisco, CA",
    "about": "Passionate developer...",
    "what_i_love": "Building great products...",
    "interests_and_hobbies": "Coding, hiking..."
  },
  "resume": {
    "address": "123 Main St, SF, CA 94102",
    "personal_email": "john.personal@email.com",
    "gender": "MALE",
    "marital_status": "SINGLE",
    "date_of_joining": "2022-01-15",
    "date_of_birth": "1990-05-20"
  },
  "bank": {
    "bank_account_number": "1234567890",
    "bank_name": "Chase Bank",
    "ifsc_code": "CHAS0001234",
    "upi_id": "john@upi"
  },
  "salary": {
    "basic_salary": "30000.00",
    "hra_percentage": "50.00",
    "hra_fixed": "5000.00",
    "hra_calculated": "15000.00",
    "standard_allowance_percentage": "50.00",
    "standard_allowance_calculated": "15000.00",
    "performance_bonus": "3000.00",
    "leave_travel_allowance": "2000.00",
    "gross_salary": "70000.00",
    "pf_percentage": "12.00",
    "pf_contribution": "3600.00",
    "professional_tax": "200.00",
    "income_tax": "6200.00",
    "total_deductions": "10000.00",
    "net_salary": "60000.00",
    "annual_salary": "720000.00",
    "monthly_working_days": 22,
    "weeks_per_month": 4,
    "year": 2025
  },
  "skills": [
    {
      "id": "uuid",
      "name": "Python",
      "level": "Expert"
    }
  ],
  "certifications": [
    {
      "id": "uuid",
      "title": "AWS Certified",
      "issuer": "Amazon",
      "issued_date": "2023-01-15"
    }
  ]
}
```

### 4.2 Update Profile
```http
PATCH /api/profile/me/full/
```

**Request Body (partial update):**
```json
{
  "profile": {
    "about": "Updated about text..."
  },
  "resume": {
    "address": "New address..."
  }
}
```

### 4.3 Skills CRUD
```http
GET    /api/profile/me/skills/
POST   /api/profile/me/skills/
GET    /api/profile/me/skills/{id}/
PUT    /api/profile/me/skills/{id}/
DELETE /api/profile/me/skills/{id}/
```

**POST Request:**
```json
{
  "name": "Python",
  "level": "Expert"
}
```

### 4.4 Certifications CRUD
```http
GET    /api/profile/me/certifications/
POST   /api/profile/me/certifications/
GET    /api/profile/me/certifications/{id}/
PUT    /api/profile/me/certifications/{id}/
DELETE /api/profile/me/certifications/{id}/
```

**POST Request:**
```json
{
  "title": "AWS Certified Solutions Architect",
  "issuer": "Amazon Web Services",
  "issued_date": "2023-01-15"
}
```

### 4.5 Salary (Admin Only)
```http
GET /api/profile/me/salary/
PUT /api/profile/me/salary/
```

**PUT Request:**
```json
{
  "basic_salary": "35000.00",
  "performance_bonus": "5000.00",
  "income_tax": "7000.00"
}
```

---

## 5. Time Off APIs

### 5.1 Employee - List My Requests
```http
GET /api/timeoff/me/
```

**Response (200):**
```json
{
  "balances": [
    {
      "type_name": "Paid Time Off",
      "days_available": 24
    },
    {
      "type_name": "Sick Leave",
      "days_available": 7
    }
  ],
  "requests": [
    {
      "id": "uuid",
      "type_name": "Paid Time Off",
      "start_date": "2026-02-01",
      "end_date": "2026-02-05",
      "days_requested": 5,
      "status": "PENDING",
      "reason": "Family vacation"
    }
  ]
}
```

### 5.2 Employee - Create Request
```http
POST /api/timeoff/me/
```

**Request Body:**
```json
{
  "timeoff_type": "uuid",
  "start_date": "2026-02-01",
  "end_date": "2026-02-05",
  "reason": "Family vacation",
  "attachment": null
}
```

### 5.3 Admin - List All Requests
```http
GET /api/timeoff/admin/?status=PENDING
```

**Response (200):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "uuid",
      "employee_name": "John Doe",
      "type_name": "Paid Time Off",
      "start_date": "2026-02-01",
      "end_date": "2026-02-05",
      "days_requested": 5,
      "status": "PENDING",
      "reason": "Family vacation",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

### 5.4 Admin - Approve Request
```http
POST /api/timeoff/admin/{id}/approve/
```

**Response (200):**
```json
{
  "message": "Request approved successfully",
  "request": {
    "id": "uuid",
    "status": "APPROVED"
  }
}
```

### 5.5 Admin - Reject Request
```http
POST /api/timeoff/admin/{id}/reject/
```

**Request Body:**
```json
{
  "rejection_reason": "Insufficient leave balance"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "Admin/HR access only"
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Role-Based Access

| Endpoint | Admin | HR | Employee |
|----------|-------|-----|----------|
| Auth | ✅ | ✅ | ✅ |
| Employees List | ✅ | ✅ | ❌ |
| Check In/Out | ✅ | ✅ | ✅ |
| Attendance Admin View | ✅ | ✅ | ❌ |
| Attendance My View | ✅ | ✅ | ✅ |
| Profile (own) | ✅ | ✅ | ✅ |
| Salary View | ✅ | ✅ | ❌ |
| Time Off Create | ✅ | ✅ | ✅ |
| Time Off Approve | ✅ | ✅ | ❌ |
