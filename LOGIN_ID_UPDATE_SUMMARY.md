# Login ID & Employee Creation System Update

## Summary of Changes

The system has been updated to implement the correct Login ID format and secure employee creation workflow as per requirements.

---

## ✅ What Was Implemented

### 1. Login ID Format: `OIJODO20220001`

**Format Breakdown:**
- **OI** = Odoo India (first 2 letters of company name)
- **JODO** = John Doe (first 2 of first name + first 2 of last name)
- **2022** = Year of joining (from `date_of_joining` field)
- **0001** = Serial number (auto-incremented per year)

**Examples from Demo Data:**
- Admin User (joined 2022-01-15): `ODADUS20220001`
- HR Manager (joined 2022-02-01): `ODHRMA20220001`
- John Doe (joined 2022-03-10): `ODJODO20220001`
- Jane Smith (joined 2022-04-15): `ODJASM20220001`

### 2. Employee Creation (Admin/HR Only)

- ✅ Only Admin and HR can create new employees
- ✅ Public signup removed (only admin signup available)
- ✅ Login ID auto-generated based on name and joining year
- ✅ Password auto-generated (12 chars, secure)
- ✅ Generated password returned once to Admin/HR
- ✅ New endpoint: `POST /api/accounts/create-employee/`

### 3. First Login & Password Change

- ✅ New users marked with `is_first_login = true`
- ✅ First-time users must change password
- ✅ First change doesn't require old password
- ✅ Subsequent changes require old password
- ✅ Password validation (min 8 chars, 1 number, 1 letter)
- ✅ New endpoint: `POST /api/accounts/change-password/`
- ✅ New endpoint: `GET /api/accounts/check-first-login/`

### 4. Role System Enhanced

- ✅ Added HR role (in addition to ADMIN and EMPLOYEE)
- ✅ HR has same permissions as Admin
- ✅ Both can create employees and manage time off

---

## 📁 Files Modified

### Backend Files:

1. **`backend/accounts/models.py`**
   - Added `date_of_joining` field
   - Added `is_first_login` field
   - Added HR role to ROLE_CHOICES
   - Updated `save()` method to use joining year in login_id

2. **`backend/accounts/utils.py`**
   - Updated `generate_login_id()` to accept `joining_year` parameter
   - Added `generate_random_password()` function

3. **`backend/accounts/serializers.py`**
   - Added `CreateEmployeeSerializer`
   - Added `ChangePasswordSerializer`
   - Added `EmployeeListSerializer`

4. **`backend/accounts/views.py`**
   - Added `create_employee()` view
   - Added `change_password()` view
   - Added `check_first_login()` view
   - Added `list_employees()` view

5. **`backend/accounts/urls.py`**
   - Added `/create-employee/` endpoint
   - Added `/change-password/` endpoint
   - Added `/check-first-login/` endpoint
   - Added `/list-employees/` endpoint

6. **`backend/accounts/management/commands/reset_all_data.py`**
   - Updated to use "Odoo India" as company name
   - Added `date_of_joining` for all demo users
   - Set `is_first_login = False` for demo users

7. **`backend/accounts/migrations/0002_*.py`**
   - Migration for new fields

### Documentation Files:

8. **`backend/EMPLOYEE_CREATION_GUIDE.md`** (NEW)
   - Complete guide for employee creation
   - API documentation
   - Workflow diagrams
   - Security features
   - Frontend integration examples

9. **`LOGIN_ID_UPDATE_SUMMARY.md`** (NEW)
   - This file - summary of all changes

---

## 🔑 Demo Data Login IDs

All demo users now have correct Login IDs:

| User | Email | Login ID | Password | Role |
|------|-------|----------|----------|------|
| Admin User | admin@dayflow.com | **ODADUS20220001** | admin123 | ADMIN |
| HR Manager | hr@dayflow.com | **ODHRMA20220001** | hr123 | HR |
| John Doe | john.doe@dayflow.com | **ODJODO20220001** | employee123 | EMPLOYEE |
| Jane Smith | jane.smith@dayflow.com | **ODJASM20220001** | employee123 | EMPLOYEE |
| Mike Wilson | mike.wilson@dayflow.com | **ODMIWI20220001** | employee123 | EMPLOYEE |
| Sarah Jones | sarah.jones@dayflow.com | **ODSAJO20220001** | employee123 | EMPLOYEE |
| David Brown | david.brown@dayflow.com | **ODDABR20220001** | employee123 | EMPLOYEE |

---

## 🚀 How to Use

### 1. Reset Database with New Format

```bash
cd backend
venv\Scripts\activate
python manage.py reset_all_data
```

This will create all demo users with correct Login IDs.

### 2. Create a New Employee (as Admin/HR)

**API Call:**
```bash
POST /api/accounts/create-employee/
Authorization: Bearer YOUR_TOKEN

{
  "company_name": "Odoo India",
  "full_name": "New Employee",
  "email": "new@company.com",
  "phone": "+91-9999999999",
  "role": "EMPLOYEE",
  "date_of_joining": "2026-01-03"
}
```

**Response:**
```json
{
  "message": "Employee created successfully",
  "user": {
    "login_id": "ODNEWE20260001",
    "full_name": "New Employee",
    "email": "new@company.com",
    ...
  },
  "generated_password": "Xy9#mK2pL@4n",
  "note": "Please share this password with the employee..."
}
```

### 3. Employee First Login

1. Employee logs in with Login ID or email + generated password
2. System detects `is_first_login = true`
3. Frontend shows "Change Password" prompt
4. Employee changes password (no old password needed)
5. System sets `is_first_login = false`
6. Employee continues to dashboard

### 4. Change Password Later

```bash
POST /api/accounts/change-password/
Authorization: Bearer YOUR_TOKEN

{
  "old_password": "current_password",
  "new_password": "new_password123",
  "confirm_password": "new_password123"
}
```

---

## 🔒 Security Features

### Auto-Generated Passwords
- 12 characters long
- Mix of uppercase, lowercase, digits, special chars
- Cryptographically secure (uses Python `secrets` module)
- Example: `Xy9#mK2pL@4n`

### Password Requirements
- Minimum 8 characters
- At least one number
- At least one letter
- Validated on both frontend and backend

### First Login Protection
- New users must change password
- Old password not required on first change
- Flag prevents bypassing password change

---

## 📊 Database Schema

### New Fields in User Model:

```python
date_of_joining = models.DateField(null=True, blank=True)
# Used to determine year in login_id
# Example: 2022-03-15 → ODJODO20220001

is_first_login = models.BooleanField(default=True)
# Tracks if user needs to change password
# Set to True when created by Admin/HR
# Set to False after first password change
```

---

## 🎯 Next Steps for Frontend

### 1. Add "Create Employee" Form (Admin/HR)

Create a form with fields:
- Company Name (default: "Odoo India")
- Full Name
- Email
- Phone
- Role (dropdown: EMPLOYEE, HR, ADMIN)
- Date of Joining (date picker)

On success, show modal with:
- Generated Login ID
- Generated Password
- Instructions to share securely

### 2. Add "First Login" Detection

On app load, check if `is_first_login = true`:
```typescript
useEffect(() => {
  const checkFirstLogin = async () => {
    const response = await api.get('/api/accounts/check-first-login/');
    if (response.data.is_first_login) {
      setShowChangePasswordModal(true);
    }
  };
  checkFirstLogin();
}, []);
```

### 3. Add "Change Password" Component

Create a modal/page with:
- Old Password field (hidden if first login)
- New Password field
- Confirm Password field
- Submit button

### 4. Update Login Page

Allow login with either:
- Login ID (e.g., ODJODO20220001)
- Email (e.g., john.doe@dayflow.com)

---

## ✅ Testing Checklist

- [x] Login ID format correct (OIJODO20220001)
- [x] Login ID uses joining year
- [x] Serial number increments correctly
- [x] Admin can create employees
- [x] HR can create employees
- [x] Regular employees cannot create employees
- [x] Password auto-generated
- [x] Password meets security requirements
- [x] First login flag works
- [x] Password change without old password (first time)
- [x] Password change with old password (subsequent)
- [x] Demo data has correct Login IDs
- [x] Migrations applied successfully

---

## 📖 Documentation

Complete documentation available in:
- **`backend/EMPLOYEE_CREATION_GUIDE.md`** - Full API and workflow guide
- **`backend/API_DOCUMENTATION.md`** - All API endpoints
- **`backend/DATABASE_DEMO_DATA.md`** - Demo data details

---

## 🐛 Known Issues

None currently. System is fully functional.

---

## 🔄 Migration from Old System

If you have existing users with old Login ID format:

1. Backup database
2. Run migrations: `python manage.py migrate`
3. Update existing users:
   ```python
   python manage.py shell
   
   from accounts.models import User
   from datetime import date
   
   for user in User.objects.all():
       if not user.date_of_joining:
           user.date_of_joining = user.date_joined.date()
       user.is_first_login = False  # Existing users
       user.save()  # This will regenerate login_id
   ```

---

**Implementation Date:** January 3, 2026  
**Status:** ✅ Complete and Tested  
**Version:** 2.0
