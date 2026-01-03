# 🔧 Fix Database Error - Step by Step

## 🚨 Current Error

```
ProgrammingError at /api/employees/
```

This means the database tables don't exist yet.

---

## ⚡ Quick Fix (Choose One)

### Option A: Run Automated Script
```bash
quick_backend_fix.bat
```

### Option B: Manual Steps (Follow Below)

---

## 📋 Manual Fix Steps

### 1. Open Terminal in Backend Directory
```bash
cd backend
```

### 2. Activate Virtual Environment
```bash
venv\Scripts\activate
```

**Important:** You should see `(venv)` in your terminal prompt.

### 3. Install Dependencies (if not done)
```bash
pip install -r requirements.txt
```

### 4. Check .env File Exists
```bash
dir .env
```

If not found, create it:
```bash
copy .env.example .env
```

### 5. Edit .env File

Open `backend\.env` and set your PostgreSQL password:
```env
DB_PASSWORD=your_postgres_password_here
```

### 6. Create PostgreSQL Database

**Option A: Using psql command line**
```bash
psql -U postgres
```

Then in psql:
```sql
CREATE DATABASE dayflow_db;
\q
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click "Databases"
3. Create > Database
4. Name: `dayflow_db`
5. Click Save

### 7. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

**Expected output:**
```
Operations to perform:
  Apply all migrations: accounts, admin, attendance, auth, contenttypes, employees, profiles, sessions, timeoff
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying accounts.0001_initial... OK
  Applying employees.0001_initial... OK
  ...
```

### 8. Create Sample Data (Optional but Recommended)
```bash
python manage.py create_sample_employees
python manage.py init_timeoff_types
```

### 9. Restart Django Server
```bash
python manage.py runserver
```

### 10. Refresh Browser
Go to `http://localhost:5173` and sign in again.

---

## ✅ Verification

### Check Migrations Applied
```bash
python manage.py showmigrations
```

All should have `[X]`:
```
accounts
 [X] 0001_initial
attendance
 [X] 0001_initial
employees
 [X] 0001_initial
...
```

### Check Database Tables
```bash
psql -U postgres -d dayflow_db
\dt
```

Should show:
```
 accounts_user
 attendance_attendancerecord
 employees_employeeprofile
 profiles_profiledetail
 ...
```

### Test API
```bash
curl http://localhost:8000/api/employees/
```

Should return JSON, not an error page.

---

## 🐛 Troubleshooting

### Error: "No module named 'django'"
**Cause:** Virtual environment not activated

**Fix:**
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Error: "database 'dayflow_db' does not exist"
**Cause:** Database not created

**Fix:**
```bash
psql -U postgres
CREATE DATABASE dayflow_db;
\q
```

### Error: "password authentication failed"
**Cause:** Wrong password in .env file

**Fix:**
1. Open `backend\.env`
2. Set correct `DB_PASSWORD`
3. Restart Django server

### Error: "relation 'accounts_user' does not exist"
**Cause:** Migrations not run

**Fix:**
```bash
cd backend
venv\Scripts\activate
python manage.py migrate
```

### Error: "port 8000 already in use"
**Cause:** Django server already running

**Fix:**
1. Find the terminal running Django
2. Press `Ctrl+C` to stop it
3. Start again: `python manage.py runserver`

---

## 📊 What Gets Fixed

### Database Tables Created:
- ✅ `accounts_user` - User accounts
- ✅ `employees_employeeprofile` - Employee profiles
- ✅ `attendance_attendancerecord` - Attendance records
- ✅ `profiles_profiledetail` - Profile details
- ✅ `profiles_resumedetail` - Resume info
- ✅ `profiles_bankdetail` - Bank info
- ✅ `profiles_salarystructure` - Salary data
- ✅ `profiles_skill` - Skills
- ✅ `profiles_certification` - Certifications
- ✅ `timeoff_timeofftype` - Leave types
- ✅ `timeoff_timeoffbalance` - Leave balances
- ✅ `timeoff_timeoffrequest` - Leave requests

### Sample Data (if created):
- ✅ 2 Admin users
- ✅ 5 Employee users
- ✅ Time off types

---

## 🎯 After Fix

### 1. Sign In
Go to `http://localhost:5173`

**Test Credentials:**
- Email: `admin@dayflow.com`
- Password: `admin123`

Or create new account via Sign Up.

### 2. Dashboard Should Load
- ✅ No error page
- ✅ Employee cards visible
- ✅ Check-in/out buttons work
- ✅ Navigation works

### 3. All Features Work
- ✅ Employees Dashboard
- ✅ Attendance Page
- ✅ Time Off Page
- ✅ My Profile Page

---

## 🔍 Debug Commands

### Check Django is working:
```bash
python manage.py check
```

### Check database connection:
```bash
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("Connected!")
>>> exit()
```

### View all users:
```bash
python manage.py shell
>>> from accounts.models import User
>>> User.objects.all()
>>> exit()
```

### Create superuser for admin panel:
```bash
python manage.py createsuperuser
```

Then access: `http://localhost:8000/admin`

---

## 📝 Complete Command Sequence

```bash
# 1. Navigate to backend
cd backend

# 2. Activate virtual environment
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env if needed
copy .env.example .env

# 5. Edit .env with your DB password
notepad .env

# 6. Create database (in psql)
# psql -U postgres
# CREATE DATABASE dayflow_db;
# \q

# 7. Run migrations
python manage.py makemigrations
python manage.py migrate

# 8. Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types

# 9. Start server
python manage.py runserver
```

---

## ✅ Success Indicators

### Terminal Shows:
```
System check identified no issues (0 silenced).
January 03, 2026 - 14:30:00
Django version 4.2.x
Starting development server at http://127.0.0.1:8000/
```

### Browser Shows:
- ✅ Dashboard loads
- ✅ No Django error pages
- ✅ Employee cards display

### Database Has:
```bash
psql -U postgres -d dayflow_db
\dt
# Shows all tables
```

---

## 🎉 Done!

Once you see the success indicators:
1. ✅ Database tables created
2. ✅ Migrations applied
3. ✅ Server running
4. ✅ No more errors!

**Refresh your browser and enjoy your HRMS! 🚀**
