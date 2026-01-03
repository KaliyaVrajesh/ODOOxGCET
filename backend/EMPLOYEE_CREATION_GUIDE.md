# Employee Creation & Password Management Guide

## Overview

The Dayflow system now implements a secure employee creation workflow where:
- **Only Admin and HR** can create new employees
- **Login IDs are auto-generated** in the format: `OIJODO20220001`
- **Passwords are auto-generated** for security
- **Users must change password** on first login

---

## Login ID Format

### Format: `{CompanyCode}{NameCode}{Year}{Serial}`

**Example:** `OIJODO20220001`

- **OI** = Odoo India (first 2 letters of company name)
- **JODO** = John Doe (first 2 letters of first name + first 2 letters of last name)
- **2022** = Year of joining
- **0001** = Serial number for that year (auto-incremented)

### Examples:
- Admin User joining in 2022: `ODADUS20220001`
- HR Manager joining in 2022: `ODHRMA20220001`
- John Doe joining in 2022: `ODJODO20220001`
- Jane Smith joining in 2022: `ODJASM20220001`
- Second John Doe in 2022: `ODJODO20220002`
- John Doe joining in 2023: `ODJODO20230001`

---

## API Endpoints

### 1. Create Employee (Admin/HR Only)

**Endpoint:** `POST /api/accounts/create-employee/`

**Authentication:** Required (JWT Token)

**Authorization:** Admin or HR role only

**Request Body:**
```json
{
  "company_name": "Odoo India",
  "full_name": "John Doe",
  "email": "john.doe@company.com",
  "phone": "+91-9876543210",
  "role": "EMPLOYEE",
  "date_of_joining": "2022-03-15"
}
```

**Fields:**
- `company_name` (required): Company name (used for login ID generation)
- `full_name` (required): Employee's full name (used for login ID generation)
- `email` (required): Unique email address
- `phone` (required): Contact phone number
- `role` (required): One of `EMPLOYEE`, `HR`, or `ADMIN`
- `date_of_joining` (optional): Date of joining (defaults to today). Year is used in login ID.

**Response (201 Created):**
```json
{
  "message": "Employee created successfully",
  "user": {
    "id": "uuid-here",
    "login_id": "ODJODO20220001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+91-9876543210",
    "role": "EMPLOYEE",
    "date_of_joining": "2022-03-15"
  },
  "generated_password": "Xy9#mK2pL@4n",
  "note": "Please share this password with the employee. They must change it on first login."
}
```

**Important:** The `generated_password` is only returned once. Admin/HR must securely share this with the employee.

---

### 2. Check First Login Status

**Endpoint:** `GET /api/accounts/check-first-login/`

**Authentication:** Required (JWT Token)

**Response:**
```json
{
  "is_first_login": true,
  "login_id": "ODJODO20220001",
  "full_name": "John Doe"
}
```

---

### 3. Change Password

**Endpoint:** `POST /api/accounts/change-password/`

**Authentication:** Required (JWT Token)

**Request Body (First Login):**
```json
{
  "new_password": "MyNewPassword123",
  "confirm_password": "MyNewPassword123"
}
```

**Request Body (Subsequent Changes):**
```json
{
  "old_password": "MyNewPassword123",
  "new_password": "AnotherPassword456",
  "confirm_password": "AnotherPassword456"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one number
- At least one letter

**Response (200 OK):**
```json
{
  "message": "Password changed successfully",
  "is_first_login": false
}
```

---

### 4. List All Employees (Admin/HR Only)

**Endpoint:** `GET /api/accounts/list-employees/`

**Authentication:** Required (JWT Token)

**Authorization:** Admin or HR role only

**Response:**
```json
[
  {
    "id": "uuid-here",
    "login_id": "ODJODO20220001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+91-9876543210",
    "role": "EMPLOYEE",
    "date_of_joining": "2022-03-15",
    "is_active": true,
    "is_first_login": true,
    "date_joined": "2022-03-15T10:30:00Z"
  }
]
```

---

## Workflow

### Creating a New Employee

1. **Admin/HR logs in** to the system
2. **Admin/HR creates employee** via API or UI:
   - Provides employee details
   - System auto-generates Login ID
   - System auto-generates secure password
3. **System returns** the generated Login ID and password
4. **Admin/HR shares credentials** with the new employee securely
5. **Employee logs in** using Login ID or email + generated password
6. **System detects first login** and prompts password change
7. **Employee changes password** to their own secure password
8. **Employee can now use** the system normally

### Password Change Flow

#### First Login:
```
1. Employee logs in with generated password
2. System checks is_first_login flag (true)
3. Frontend shows "Change Password" modal/page
4. Employee enters new password (no old password required)
5. System updates password and sets is_first_login = false
6. Employee continues to dashboard
```

#### Subsequent Changes:
```
1. Employee goes to profile/settings
2. Employee clicks "Change Password"
3. Employee enters old password + new password
4. System validates old password
5. System updates to new password
6. Employee continues using system
```

---

## Security Features

### Auto-Generated Passwords
- 12 characters long
- Contains uppercase letters
- Contains lowercase letters
- Contains digits
- Contains special characters (!@#$%^&*)
- Cryptographically secure (uses `secrets` module)

### Password Validation
- Minimum 8 characters
- Must contain at least one number
- Must contain at least one letter
- Prevents weak passwords

### First Login Tracking
- `is_first_login` flag tracks if user needs to change password
- First-time users don't need old password
- After first change, old password is required

---

## Frontend Integration

### 1. Create Employee Form (Admin/HR)

```typescript
const createEmployee = async (data: EmployeeData) => {
  const response = await api.post('/api/accounts/create-employee/', data);
  
  // Show generated password to admin
  alert(`Employee created!
    Login ID: ${response.data.user.login_id}
    Password: ${response.data.generated_password}
    
    Please share these credentials securely with the employee.`);
};
```

### 2. Check First Login on App Load

```typescript
useEffect(() => {
  const checkFirstLogin = async () => {
    const response = await api.get('/api/accounts/check-first-login/');
    
    if (response.data.is_first_login) {
      // Show change password modal
      setShowChangePasswordModal(true);
    }
  };
  
  checkFirstLogin();
}, []);
```

### 3. Change Password Component

```typescript
const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
  const payload = isFirstLogin 
    ? { new_password: newPassword, confirm_password: confirmPassword }
    : { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword };
  
  await api.post('/api/accounts/change-password/', payload);
  
  setIsFirstLogin(false);
  alert('Password changed successfully!');
};
```

---

## Database Schema Changes

### User Model Updates

```python
class User(AbstractBaseUser, PermissionsMixin):
    # ... existing fields ...
    
    role = models.CharField(
        max_length=20, 
        choices=[('ADMIN', 'Admin'), ('HR', 'HR Manager'), ('EMPLOYEE', 'Employee')],
        default='EMPLOYEE'
    )
    
    date_of_joining = models.DateField(null=True, blank=True)  # Used in login_id
    is_first_login = models.BooleanField(default=True)  # Track password change requirement
```

---

## Testing

### Test Employee Creation

```bash
# Login as admin
curl -X POST http://localhost:8000/api/accounts/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "admin@dayflow.com",
    "password": "admin123"
  }'

# Create employee
curl -X POST http://localhost:8000/api/accounts/create-employee/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "company_name": "Odoo India",
    "full_name": "Test Employee",
    "email": "test@company.com",
    "phone": "+91-9999999999",
    "role": "EMPLOYEE",
    "date_of_joining": "2026-01-03"
  }'
```

### Test Password Change

```bash
# First login
curl -X POST http://localhost:8000/api/accounts/change-password/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "new_password": "MyNewPass123",
    "confirm_password": "MyNewPass123"
  }'
```

---

## Error Handling

### Common Errors

**403 Forbidden - Not Admin/HR:**
```json
{
  "error": "Permission denied. Only Admin or HR can create employees."
}
```

**400 Bad Request - Email exists:**
```json
{
  "email": ["A user with this email already exists."]
}
```

**400 Bad Request - Weak password:**
```json
{
  "new_password": ["Password must contain at least one number."]
}
```

**400 Bad Request - Passwords don't match:**
```json
{
  "confirm_password": ["Passwords do not match."]
}
```

**400 Bad Request - Wrong old password:**
```json
{
  "old_password": ["Old password is incorrect."]
}
```

---

## Best Practices

### For Admin/HR:
1. **Securely share credentials** - Use secure channels (not email/SMS)
2. **Verify employee identity** before sharing credentials
3. **Document the handover** - Keep record of when credentials were shared
4. **Monitor first logins** - Check if employees changed their passwords

### For Employees:
1. **Change password immediately** on first login
2. **Use strong passwords** - Mix of letters, numbers, symbols
3. **Don't share passwords** with anyone
4. **Change password regularly** for security

### For Developers:
1. **Never log passwords** in plain text
2. **Use HTTPS** in production
3. **Implement rate limiting** on password endpoints
4. **Add password history** to prevent reuse (future enhancement)

---

## Migration Guide

If you have existing users without `date_of_joining` or `is_first_login`:

```python
# Run this migration
python manage.py shell

from accounts.models import User
from datetime import date

# Set date_of_joining for existing users
for user in User.objects.filter(date_of_joining__isnull=True):
    user.date_of_joining = user.date_joined.date()
    user.is_first_login = False  # Existing users don't need to change password
    user.save()
```

---

## Future Enhancements

- [ ] Email notification with credentials
- [ ] Password expiry policy
- [ ] Password history to prevent reuse
- [ ] Two-factor authentication
- [ ] Account lockout after failed attempts
- [ ] Password reset via email
- [ ] Bulk employee import
- [ ] Employee onboarding workflow

---

**Last Updated:** January 3, 2026  
**Version:** 2.0  
**Status:** ✅ Implemented
