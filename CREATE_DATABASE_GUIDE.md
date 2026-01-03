# 🗄️ Create PostgreSQL Database - Multiple Methods

## 🎯 Goal
Create the `dayflow_db` database in PostgreSQL.

---

## ⚡ Method 1: Using Batch Script (Easiest)

**Run this:**
```bash
create_database.bat
```

Enter your PostgreSQL password when prompted.

---

## 📝 Method 2: Using psql Command Line

### Step 1: Open Command Prompt or PowerShell

### Step 2: Connect to PostgreSQL
```bash
psql -U postgres
```

Enter your PostgreSQL password.

### Step 3: Create Database
```sql
CREATE DATABASE dayflow_db;
```

### Step 4: Verify Database Created
```sql
\l
```

You should see `dayflow_db` in the list.

### Step 5: Exit psql
```sql
\q
```

---

## 🖥️ Method 3: Using pgAdmin (GUI)

### Step 1: Open pgAdmin
Find pgAdmin in your Start Menu.

### Step 2: Connect to PostgreSQL Server
- Expand "Servers"
- Click on "PostgreSQL 14" (or your version)
- Enter your password

### Step 3: Create Database
1. Right-click on "Databases"
2. Select "Create" → "Database..."
3. In the "Database" field, enter: `dayflow_db`
4. Click "Save"

### Step 4: Verify
You should see `dayflow_db` in the Databases list.

---

## 🔧 Method 4: Using SQL File

### Step 1: Run SQL File
```bash
psql -U postgres -f create_database.sql
```

Enter your password when prompted.

---

## 🐳 Method 5: Using Docker (If PostgreSQL in Docker)

### Step 1: Connect to Docker Container
```bash
docker exec -it dayflow-postgres psql -U postgres
```

### Step 2: Create Database
```sql
CREATE DATABASE dayflow_db;
\q
```

---

## ✅ Verify Database Created

### Option A: Using psql
```bash
psql -U postgres -l
```

Look for `dayflow_db` in the list.

### Option B: Using psql interactive
```bash
psql -U postgres
\l
\q
```

### Option C: Try to connect
```bash
psql -U postgres -d dayflow_db
```

If it connects without error, database exists!

---

## 🔍 Troubleshooting

### Error: "psql: command not found"

**Cause:** PostgreSQL bin directory not in PATH

**Fix:**
1. Find PostgreSQL installation (usually `C:\Program Files\PostgreSQL\14\bin`)
2. Add to PATH or use full path:
```bash
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

### Error: "password authentication failed"

**Cause:** Wrong password

**Fix:**
1. Remember the password you set during PostgreSQL installation
2. Or reset password (requires admin access)

### Error: "database 'dayflow_db' already exists"

**Good news!** Database already exists. Skip to next step:
```bash
cd backend
venv\Scripts\activate
python manage.py migrate
```

### Error: "could not connect to server"

**Cause:** PostgreSQL service not running

**Fix:**
1. Open Services (Win+R, type `services.msc`)
2. Find "postgresql-x64-14" (or your version)
3. Right-click → Start

Or use command:
```bash
net start postgresql-x64-14
```

---

## 📋 After Creating Database

### Step 1: Verify .env File
Check `backend\.env` has correct settings:
```env
DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
```

### Step 2: Run Migrations
```bash
cd backend
venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create Sample Data (Optional)
```bash
python manage.py create_sample_employees
python manage.py init_timeoff_types
```

### Step 4: Start Server
```bash
python manage.py runserver
```

### Step 5: Test
Open `http://localhost:5173` and sign in!

---

## 🎯 Complete Command Sequence

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE dayflow_db;
\q

# 2. Navigate to backend
cd backend

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types

# 6. Start server
python manage.py runserver
```

---

## 📊 What Happens After Database Creation

### 1. Migrations Create Tables
```
accounts_user
employees_employeeprofile
attendance_attendancerecord
profiles_profiledetail
profiles_resumedetail
profiles_bankdetail
profiles_salarystructure
profiles_skill
profiles_certification
timeoff_timeofftype
timeoff_timeoffbalance
timeoff_timeoffrequest
```

### 2. Sample Data Populates Tables
- 2 Admin users
- 5 Employee users
- Time off types

### 3. Server Starts Successfully
```
Starting development server at http://127.0.0.1:8000/
```

### 4. Frontend Works
- No more ProgrammingError
- Dashboard loads
- All features work

---

## ✅ Success Indicators

### Database Created:
```bash
psql -U postgres -l | findstr dayflow_db
# Shows: dayflow_db | postgres | ...
```

### Migrations Applied:
```bash
python manage.py showmigrations
# All show [X]
```

### Server Running:
```
System check identified no issues (0 silenced).
Starting development server at http://127.0.0.1:8000/
```

### Frontend Works:
- ✅ No Django error pages
- ✅ Dashboard loads
- ✅ API calls succeed

---

## 🚀 Quick Start After Database Creation

```bash
cd backend
venv\Scripts\activate
python manage.py migrate
python manage.py create_sample_employees
python manage.py runserver
```

Then open `http://localhost:5173` and sign in with:
- Email: `admin@dayflow.com`
- Password: `admin123`

---

## 📞 Need Help?

### Check PostgreSQL Status:
```bash
# Windows
sc query postgresql-x64-14

# Or
net start | findstr postgres
```

### Check PostgreSQL Version:
```bash
psql --version
```

### Check if Database Exists:
```bash
psql -U postgres -c "\l" | findstr dayflow_db
```

---

## 🎉 You're Done!

Once database is created:
1. ✅ Run migrations
2. ✅ Create sample data
3. ✅ Start server
4. ✅ Use the app!

**Create the database using any method above, then continue with migrations!** 🚀
