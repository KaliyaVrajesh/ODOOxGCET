# Demo Data Quick Start Guide

## What's Included

Your Dayflow database now contains comprehensive test data perfect for demonstrations:

### 📊 Complete Data Set
- **7 Users** (1 Admin, 1 HR Manager, 5 Employees)
- **Complete Profiles** with personal information, addresses, emergency contacts
- **Resume Details** including education, experience, and skills summaries
- **Bank Information** with account numbers, IFSC codes, and UPI IDs
- **Salary Structures** with auto-calculated gross, deductions, and net pay
- **39 Skills** across all users (5-6 per person)
- **9 Certifications** with issue and expiry dates
- **33 Attendance Records** covering the past 7 days
- **4 Time Off Requests** (Approved, Pending, Rejected statuses)
- **28 Time Off Balances** (all users × all time off types)

---

## 🚀 Quick Commands

### View Database Summary
```bash
# Windows
show_database_info.bat

# Or manually
cd backend
venv\Scripts\activate
python manage.py show_demo_data
```

### Reset and Recreate All Data
```bash
cd backend
venv\Scripts\activate
python manage.py reset_all_data
```

---

## 🔑 Login Credentials

### Admin Account
- **Email:** admin@dayflow.com
- **Password:** admin123
- **Login ID:** DAADUS20260001
- **Access:** Full system access, can manage all employees

### HR Manager Account
- **Email:** hr@dayflow.com
- **Password:** hr123
- **Login ID:** DAHRMA20260001
- **Access:** Same as admin, can approve/reject time off

### Employee Accounts (Password: employee123)

1. **John Doe** - Software Engineer
   - Email: john.doe@dayflow.com
   - Login ID: DAJODO20260001
   - Has 1 approved time off request

2. **Jane Smith** - Senior Developer
   - Email: jane.smith@dayflow.com
   - Login ID: DAJASM20260001
   - Has 1 pending time off request

3. **Mike Wilson** - Product Manager
   - Email: mike.wilson@dayflow.com
   - Login ID: DAMIWI20260001

4. **Sarah Jones** - UI/UX Designer
   - Email: sarah.jones@dayflow.com
   - Login ID: DASAJO20260001
   - Has 1 approved time off request

5. **David Brown** - QA Engineer
   - Email: david.brown@dayflow.com
   - Login ID: DADABR20260001
   - Has 1 rejected time off request

---

## 📋 What You Can Demonstrate

### 1. Authentication & User Management
- Sign in with different roles (Admin, HR, Employee)
- Auto-generated login IDs
- JWT token-based authentication

### 2. Employee Dashboard
- View all 7 employees with profile cards
- Real-time status indicators:
  - 🟢 Green = Currently checked in
  - 🟡 Yellow = Absent (not checked in today)
  - 🔵 Blue plane = On approved leave
- Search functionality
- Click cards to view detailed employee information

### 3. Attendance Tracking
- Check in/out functionality
- View 7 days of historical attendance
- Duration calculation
- Admin can view all employee attendance

### 4. Time Off Management
- View available balances (PTO: 24 days, Sick: 7 days)
- Create new time off requests
- Admin/HR can approve or reject requests
- See different request statuses:
  - ✅ Approved (John Doe, Sarah Jones)
  - ⏳ Pending (Jane Smith)
  - ❌ Rejected (David Brown)

### 5. Profile Management
- Complete employee profiles with:
  - Personal information (DOB, gender, marital status)
  - Contact details and addresses
  - Emergency contacts
  - Education and experience
  - Bank details
  - Salary structure with auto-calculations
  - Skills and certifications

---

## 💰 Sample Salary Data

All users have complete salary structures:

| Employee | Basic Salary | Net Monthly | Annual |
|----------|--------------|-------------|---------|
| Admin User | ₹80,000 | ₹1,23,600 | ₹14,83,200 |
| HR Manager | ₹70,000 | ₹1,08,150 | ₹12,97,800 |
| Jane Smith | ₹90,000 | ₹1,38,600 | ₹16,63,200 |
| Mike Wilson | ₹85,000 | ₹1,31,100 | ₹15,73,200 |
| John Doe | ₹60,000 | ₹1,02,600 | ₹12,31,200 |
| Sarah Jones | ₹65,000 | ₹1,10,850 | ₹13,30,200 |
| David Brown | ₹55,000 | ₹94,350 | ₹11,32,200 |

*Includes HRA (50%), Standard Allowance (30%), minus PF (12%), Professional Tax, and Income Tax*

---

## 🎯 Testing Scenarios

### Scenario 1: Admin Workflow
1. Login as admin@dayflow.com
2. View all employees on dashboard
3. Check attendance records
4. Review pending time off requests
5. Approve/reject requests
6. View employee profiles

### Scenario 2: Employee Workflow
1. Login as john.doe@dayflow.com
2. Check in for the day
3. View other employees' status
4. Check time off balances
5. Create a new time off request
6. View/update personal profile
7. Check out at end of day

### Scenario 3: HR Manager Workflow
1. Login as hr@dayflow.com
2. Review all time off requests
3. Approve pending requests
4. View team attendance
5. Access employee profiles
6. Manage own time off

---

## 📁 Documentation Files

- **`backend/DATABASE_DEMO_DATA.md`** - Complete detailed documentation
- **`backend/API_DOCUMENTATION.md`** - API endpoints reference
- **`backend/API_EXAMPLES.md`** - API usage examples
- **`README.md`** - Project setup and overview

---

## 🔄 Resetting Data

If you need to start fresh or the data gets corrupted:

```bash
cd backend
venv\Scripts\activate
python manage.py reset_all_data
```

This will:
1. Delete all existing data
2. Create fresh time off types
3. Create 7 users with complete profiles
4. Generate 7 days of attendance records
5. Create sample time off requests
6. Display all login credentials

---

## 🎨 UI Features to Showcase

### Dashboard
- Clean, modern interface with Tailwind CSS
- Responsive grid layout for employee cards
- Real-time status indicators
- Search functionality
- Tab navigation (Employees, Attendance, Time Off)

### Attendance Page
- Check-in/out buttons with visual feedback
- Animated status indicators
- Historical records table
- Duration calculations

### Time Off Page
- Balance cards showing available days
- Request form with date pickers
- Status badges (Pending, Approved, Rejected)
- Admin approval interface

### Profile Page
- Tabbed interface (Profile, Resume, Bank, Salary)
- Skills and certifications management
- Auto-calculated salary components
- Edit/view modes

---

## 🐛 Troubleshooting

### No data showing?
```bash
python manage.py reset_all_data
```

### Can't login?
Check credentials in this document or run:
```bash
python manage.py show_demo_data
```

### Database connection error?
Ensure PostgreSQL is running and check `backend/.env` file

---

## 📞 Support

For issues or questions:
1. Check `backend/DATABASE_DEMO_DATA.md` for detailed documentation
2. Review `backend/API_DOCUMENTATION.md` for API details
3. Run `python manage.py show_demo_data` to verify data

---

**Last Updated:** January 3, 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Demonstration
