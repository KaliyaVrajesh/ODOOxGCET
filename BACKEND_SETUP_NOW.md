# 🚨 Backend Setup Required - Fix Database Error

## ⚠️ Current Issue

You're seeing a `ProgrammingError` because the database tables haven't been created yet. Let's fix this now!

---

## 🚀 Quick Fix (5 Minutes)

### Option 1: Automated Setup (Easiest)

**Run this script:**
```bash
setup_backend_complete.bat
```

This will:
1. Create virtual environment
2. Install dependencies
3. Create .env file
4. Run migrations
5. Create database tables
6. Start the server

### Option 2: Manual Setup

Follow these steps:

#### Step 1: Navigate to Backend
```bash
cd backend
```

#### Step 2: Create Virtual Environment (if not exists)
```bash
python -m venv venv
```

#### Step 3: Activate Virtual Environment
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal.

#### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 5: Create .env File
```bash
copy .env.example .env
```

Edit `.env` with your settings:
```env
SECRET_KEY=django-insecure-change-this-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Step 6: Create PostgreSQL Database

**Open PostgreSQL:**
```bash
psql -U postgres
```

**Create database:**
```sql
CREATE DATABASE dayflow_db;
\q
```

#### Step 7: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

This creates all the database tables.

#### Step 8: Create Sample Data (Optional)
```bash
python manage.py create_sample_employees
python manage.py init_timeoff_types
```

#### Step 9: Start Server
```bash
python manage.py runserver
```

---

## ✅ Verification

### Check if migrations worked:
```bash
python manage.py showmigrations
```

All should have `[X]` marks.

### Check database tables:
```bash
psql -U postgres -d dayflow_db
\dt
```

You should see tables like:
- `accounts_user`
- `employees_employeeprofile`
- `attendance_attendancerecord`
- `profiles_profiledetail`
- `timeoff_timeoffrequest`

### Test the API:
```bash
curl http://localhost:8000/api/
```

Should return API response without errors.

---

## 🐛 Common Issues

### "No module named 'django'"
**Solution:** Activate virtual environment
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### "Database 'dayflow_db' does not exist"
**Solution:** Create the database
```bash
psql -U postgres
CREATE DATABASE dayflow_db;
\q
```

### "FATAL: password authentication failed"
**Solution:** Check your .env file has correct DB_PASSWORD

### "relation does not exist"
**Solution:** Run migrations
```bash
python manage.py migrate
```

---

## 📊 What Gets Created

### Database Tables:
1. **accounts_user** - Users with auto-generated login_id
2. **employees_employeeprofile** - Employee profiles
3. **attendance_attendancerecord** - Check-in/out records
4. **profiles_profiledetail** - Profile header info
5. **profiles_resumedetail** - Personal details
6. **profiles_bankdetail** - Bank information
7. **profiles_salarystructure** - Salary breakdown
8. **profiles_skill** - Skills
9. **profiles_certification** - Certifications
10. **timeoff_timeofftype** - Leave types
11. **timeoff_timeoffbalance** - Employee balances
12. **timeoff_timeoffrequest** - Leave requests

### Sample Data (if created):
- 2 Admin users
- 5 Employee users
- Time off types (Paid Time Off, Sick Leave, etc.)

---

## 🎯 After Setup

### 1. Backend Running
```
✓ Django development server at http://localhost:8000
✓ All database tables created
✓ Sample data loaded (if created)
```

### 2. Test Sign In
Open `http://localhost:5173` and sign in with:
- **Email:** admin@dayflow.com
- **Password:** admin123

Or create a new account via Sign Up.

### 3. Verify Dashboard Loads
After sign in, you should see:
- ✅ Dashboard loads without errors
- ✅ Employee cards display (if sample data created)
- ✅ Check-in/out buttons work
- ✅ Navigation works

---

## 🔍 Debug Backend

### Check Django logs:
Look at the terminal where `python manage.py runserver` is running.

### Check for errors:
```bash
python manage.py check
```

### Test database connection:
```bash
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("Database connected!")
>>> exit()
```

---

## 📝 Quick Commands Reference

```bash
# Navigate to backend
cd backend

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start server
python manage.py runserver

# Check migrations
python manage.py showmigrations

# Check for issues
python manage.py check
```

---

## ✅ Success Indicators

### Terminal Output:
```
System check identified no issues (0 silenced).
January 03, 2026 - 14:00:00
Django version 4.2.x, using settings 'dayflow_core.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Browser:
- ✅ No Django error pages
- ✅ Dashboard loads
- ✅ API calls succeed

### Database:
```bash
psql -U postgres -d dayflow_db
\dt
# Should show all tables
```

---

## 🎉 You're Done!

Once the backend is set up:
1. ✅ Database tables created
2. ✅ Migrations applied
3. ✅ Server running
4. ✅ Ready to use!

**Refresh your browser and sign in again. The error should be gone!** 🚀
