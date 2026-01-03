# Database Demo Data Documentation

## Overview
This document describes the comprehensive test data created in the database for demonstration purposes.

## How to Reset and Recreate Data

```bash
cd backend
venv\Scripts\activate
python manage.py reset_all_data
```

This command will:
1. Delete all existing data
2. Create fresh comprehensive test data
3. Display login credentials

---

## Database Contents

### 1. Users (7 Total)

#### Admin User
- **Email:** admin@dayflow.com
- **Password:** admin123
- **Login ID:** DAADUS20260001
- **Role:** ADMIN
- **Job Title:** System Administrator
- **Department:** IT

#### HR Manager
- **Email:** hr@dayflow.com
- **Password:** hr123
- **Login ID:** DAHRMA20260001
- **Role:** HR
- **Job Title:** HR Manager
- **Department:** Human Resources

#### Employees (Password: employee123)

1. **John Doe**
   - Email: john.doe@dayflow.com
   - Login ID: DAJODO20260001
   - Job Title: Software Engineer
   - Department: Engineering

2. **Jane Smith**
   - Email: jane.smith@dayflow.com
   - Login ID: DAJASM20260001
   - Job Title: Senior Developer
   - Department: Engineering

3. **Mike Wilson**
   - Email: mike.wilson@dayflow.com
   - Login ID: DAMIWI20260001
   - Job Title: Product Manager
   - Department: Product

4. **Sarah Jones**
   - Email: sarah.jones@dayflow.com
   - Login ID: DASAJO20260001
   - Job Title: UI/UX Designer
   - Department: Design

5. **David Brown**
   - Email: david.brown@dayflow.com
   - Login ID: DADABR20260001
   - Job Title: QA Engineer
   - Department: Quality Assurance

---

### 2. Profile Details (All Users)

Each user has complete profile information including:

#### Personal Information
- Date of Birth
- Gender (Male/Female)
- Marital Status (Single/Married)
- Nationality (Indian)
- Full Address (Line 1, Line 2, City, State, Postal Code, Country)
- Emergency Contact (Name, Relationship, Phone)

#### Professional Information
- Job Position
- Department
- Location
- About section
- Interests and Hobbies

**Example (Admin User):**
- DOB: 1985-05-15
- Gender: Male
- Marital Status: Married
- Address: 123 Tech Park, Sector 5, Bangalore, Karnataka - 560001, India
- Emergency Contact: Jane Admin (Spouse) - +91-9876543299

---

### 3. Resume Details (All Users)

Each user has detailed resume information:

#### Education & Experience
- Highest Qualification
- University
- Year of Passing
- Previous Company
- Previous Designation
- Years of Experience
- Skills Summary

**Example (John Doe):**
- Qualification: B.Tech in Computer Science
- University: VTU
- Year: 2017
- Previous Company: StartupXYZ
- Previous Role: Junior Developer
- Experience: 7 years
- Skills: Python, Django, React, PostgreSQL, REST APIs

---

### 4. Bank Details (All Users)

Each user has complete banking information:
- Bank Account Number
- Bank Name
- IFSC Code
- Branch Name
- UPI ID
- PAN Number (in original data)
- Aadhaar Number (in original data)

**Example (Jane Smith):**
- Bank: Axis Bank
- Account: 80400456789012
- IFSC: UTIB0004567
- Branch: Bangalore Indiranagar
- UPI: 9876543213@paytm

---

### 5. Salary Structures (All Users)

Each user has a detailed salary structure with:

#### Components
- Basic Salary
- HRA (50% of basic)
- Standard Allowance (30% of basic)
- Performance Bonus
- Leave Travel Allowance
- PF Contribution (12% of basic)
- Professional Tax
- Income Tax

#### Auto-Calculated Fields
- Gross Salary
- Total Deductions
- Net Salary (Take-home)
- Annual Salary

**Example Salary Ranges:**
- Admin: ₹80,000 basic
- HR Manager: ₹70,000 basic
- Senior Developer: ₹90,000 basic
- Software Engineer: ₹60,000 basic
- Product Manager: ₹85,000 basic
- UI/UX Designer: ₹65,000 basic
- QA Engineer: ₹55,000 basic

---

### 6. Skills (Multiple per User)

Each user has 5-6 relevant skills with proficiency levels.

**Examples:**
- **Admin:** System Administration, Linux, AWS, Docker, Kubernetes
- **John Doe:** Python, Django, React, PostgreSQL, Git, Docker
- **Jane Smith:** JavaScript, TypeScript, Node.js, React, MongoDB, Microservices
- **Sarah Jones:** Figma, Adobe XD, Sketch, User Research, Wireframing, Prototyping

---

### 7. Certifications (1-2 per User)

Each user has professional certifications with:
- Certification Name
- Issuing Organization
- Issue Date
- Expiry Date (if applicable)

**Examples:**
- **Admin:** AWS Certified Solutions Architect (expires 2025-06-15)
- **Admin:** Certified Kubernetes Administrator (expires 2026-03-20)
- **HR Manager:** SHRM Certified Professional (expires 2024-09-10)
- **John Doe:** AWS Developer Associate (expires 2026-01-15)
- **Jane Smith:** Google Cloud Professional Architect, Certified Scrum Master

---

### 8. Attendance Records (7 Days)

Past 7 days of attendance records for all employees:
- Check-in Time: 09:00 AM
- Check-out Time: 06:00 PM
- Status: PRESENT
- Excludes weekends
- Some employees have occasional absences for variety

**Patterns:**
- John Doe: Absent on one day
- Mike Wilson: Absent on one day
- Others: Regular attendance

---

### 9. Time Off Types (3 Types)

1. **Paid Time Off (PTO)**
   - Code: PTO
   - Annual Allocation: 24 days

2. **Sick Leave**
   - Code: SICK
   - Annual Allocation: 7 days

3. **Unpaid Leave**
   - Code: UNPAID
   - Annual Allocation: 0 days

---

### 10. Time Off Balances (All Users)

Each user has balances for all time off types for the current year (2026):
- Allocated Days (based on type)
- Used Days (0 initially)
- Available Days (calculated)

---

### 11. Time Off Requests (4 Requests)

#### 1. John Doe - APPROVED
- Type: Paid Time Off
- Dates: 10 days from today (3 days)
- Status: Approved by Admin
- Allocation: 3.0 days

#### 2. Jane Smith - PENDING
- Type: Sick Leave
- Dates: 5 days from today (2 days)
- Status: Pending approval
- Allocation: 2.0 days

#### 3. Sarah Jones - APPROVED
- Type: Paid Time Off
- Dates: 15 days from today (5 days)
- Status: Approved by HR Manager
- Allocation: 5.0 days

#### 4. David Brown - REJECTED
- Type: Paid Time Off
- Dates: 3 days from today (2 days)
- Status: Rejected by Admin
- Reason: Project deadline approaching
- Allocation: 2.0 days

---

## Database Tables Summary

| Table | Records | Description |
|-------|---------|-------------|
| Users | 7 | Admin, HR, 5 Employees |
| Employee Profiles | 7 | Job title, department |
| Profile Details | 7 | Personal info, address |
| Resume Details | 7 | Education, experience |
| Bank Details | 7 | Banking information |
| Salary Structures | 7 | Salary components |
| Skills | ~40 | 5-6 per user |
| Certifications | ~10 | 1-2 per user |
| Attendance Records | ~35 | 7 days × 5 employees |
| Time Off Types | 3 | PTO, Sick, Unpaid |
| Time Off Balances | 21 | 3 types × 7 users |
| Time Off Requests | 4 | Various statuses |

---

## API Endpoints to Test

### Authentication
- POST `/api/accounts/signup/` - Create new account
- POST `/api/accounts/signin/` - Login
- POST `/api/accounts/token/refresh/` - Refresh token

### Employees
- GET `/api/employees/` - List all employees
- GET `/api/employees/<user_id>/` - Get employee details

### Attendance
- POST `/api/attendance/check-in/` - Check in
- POST `/api/attendance/check-out/` - Check out
- GET `/api/attendance/current-status/` - Get current status
- GET `/api/attendance/my-records/` - Get my attendance records
- GET `/api/attendance/all-records/` - Admin: Get all records

### Time Off
- GET `/api/timeoff/my-balances/` - Get my balances
- POST `/api/timeoff/request/` - Create time off request
- GET `/api/timeoff/my-requests/` - Get my requests
- GET `/api/timeoff/all-requests/` - Admin: Get all requests
- POST `/api/timeoff/approve/<request_id>/` - Admin: Approve request
- POST `/api/timeoff/reject/<request_id>/` - Admin: Reject request

### Profile
- GET `/api/profile/me/full/` - Get complete profile
- PUT `/api/profile/me/full/` - Update complete profile
- PATCH `/api/profile/me/full/` - Partial update profile

---

## Testing Scenarios

### 1. User Authentication
- Sign in as admin, HR, or any employee
- Test token refresh
- Test logout

### 2. Employee Dashboard
- View all employees
- See real-time status indicators
- Search employees
- Click on employee cards to view details

### 3. Attendance Tracking
- Check in as different users
- Check out after some time
- View attendance history
- Admin can see all attendance records

### 4. Time Off Management
- View available balances
- Create new time off request
- Admin/HR approve or reject requests
- See request history with different statuses

### 5. Profile Management
- View complete profile with all details
- Update personal information
- Add/remove skills
- Add/remove certifications
- Update bank details
- View salary structure

---

## Notes

- All passwords are simple for demo purposes (admin123, hr123, employee123)
- Login IDs are auto-generated in format: DAXXXXYYYYNNNN
- All data is realistic and comprehensive
- Salary structures include auto-calculated fields
- Attendance records exclude weekends
- Time off requests show different statuses for testing
- All users have complete profiles ready for demonstration

---

## Quick Start for Demo

1. **Reset Database:**
   ```bash
   python manage.py reset_all_data
   ```

2. **Start Backend:**
   ```bash
   python manage.py runserver
   ```

3. **Start Frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

4. **Login as Admin:**
   - Email: admin@dayflow.com
   - Password: admin123

5. **Explore Features:**
   - View all employees with status indicators
   - Check in/out
   - View and manage time off requests
   - View complete profile with all details
   - Test all CRUD operations

---

**Last Updated:** January 3, 2026
**Database Version:** PostgreSQL
**Framework:** Django 5.1.4
