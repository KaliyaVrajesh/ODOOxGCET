# ✅ Setup Checklist - Dayflow HRMS

Use this checklist to track your setup progress!

---

## 📋 Pre-Setup Checklist

### Prerequisites
- [ ] Python 3.10+ installed
  ```bash
  python --version
  # Should show: Python 3.10.x or higher
  ```

- [ ] Node.js 18+ installed
  ```bash
  node --version
  # Should show: v18.x.x or higher
  ```

- [ ] PostgreSQL 14+ installed
  ```bash
  psql --version
  # Should show: psql (PostgreSQL) 14.x or higher
  ```

- [ ] Git installed (optional)
  ```bash
  git --version
  ```

---

## 🔧 Backend Setup Checklist

### Step 1: Virtual Environment
- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Create virtual environment
  ```bash
  python -m venv venv
  ```

- [ ] Activate virtual environment
  ```bash
  venv\Scripts\activate
  # You should see (venv) in your terminal
  ```

### Step 2: Dependencies
- [ ] Install Python packages
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Verify installation
  ```bash
  pip list
  # Should show Django, djangorestframework, etc.
  ```

### Step 3: Database Configuration
- [ ] Create PostgreSQL database
  ```bash
  psql -U postgres
  CREATE DATABASE dayflow_db;
  \q
  ```

- [ ] Create .env file
  ```bash
  copy .env.example .env
  ```

- [ ] Edit .env with your credentials
  - [ ] Set DB_PASSWORD
  - [ ] Set SECRET_KEY
  - [ ] Set ALLOWED_HOSTS
  - [ ] Set CORS_ALLOWED_ORIGINS

### Step 4: Database Migrations
- [ ] Create migrations
  ```bash
  python manage.py makemigrations
  ```

- [ ] Apply migrations
  ```bash
  python manage.py migrate
  ```

- [ ] Verify migrations
  ```bash
  python manage.py showmigrations
  # All should have [X] marks
  ```

### Step 5: Sample Data (Optional)
- [ ] Create sample employees
  ```bash
  python manage.py create_sample_employees
  ```

- [ ] Initialize time off types
  ```bash
  python manage.py init_timeoff_types
  ```

### Step 6: Start Backend
- [ ] Start development server
  ```bash
  python manage.py runserver
  ```

- [ ] Verify backend is running
  ```bash
  curl http://localhost:8000/api/
  # Should return API response
  ```

- [ ] Check terminal output
  - [ ] No errors shown
  - [ ] "Starting development server" message
  - [ ] Running on http://127.0.0.1:8000/

✅ **Backend Setup Complete!**

---

## 🎨 Frontend Setup Checklist

### Step 1: Navigate to Frontend
- [ ] Open new terminal
- [ ] Navigate to frontend directory
  ```bash
  cd frontend
  ```

### Step 2: Dependencies
- [ ] Install Node packages
  ```bash
  npm install
  ```

- [ ] Verify installation
  ```bash
  npm list --depth=0
  # Should show react, typescript, vite, etc.
  ```

### Step 3: Environment Configuration
- [ ] Create .env file
  ```bash
  echo VITE_API_URL=http://localhost:8000/api > .env
  ```

- [ ] Verify .env file exists
  ```bash
  type .env
  # Should show: VITE_API_URL=http://localhost:8000/api
  ```

### Step 4: Start Frontend
- [ ] Start development server
  ```bash
  npm run dev
  ```

- [ ] Check terminal output
  - [ ] No errors shown
  - [ ] "VITE ready" message
  - [ ] Running on http://localhost:5173

- [ ] Open in browser
  ```bash
  start http://localhost:5173
  ```

✅ **Frontend Setup Complete!**

---

## 🧪 Testing Checklist

### Initial Access
- [ ] Frontend loads in browser
- [ ] No console errors (F12)
- [ ] Sign In page displays correctly
- [ ] Sign Up page displays correctly

### Authentication Testing
- [ ] Click "Sign Up"
- [ ] Fill in all fields:
  - [ ] Company Name
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Password
  - [ ] Confirm Password
- [ ] Click "Sign Up" button
- [ ] Redirected to dashboard
- [ ] No errors in console

### Dashboard Testing
- [ ] Dashboard loads
- [ ] User name displays in header
- [ ] Navigation tabs visible (Employees, Attendance, Time Off)
- [ ] User avatar dropdown works
- [ ] Employee cards display (if sample data created)

### Check-In/Out Testing
- [ ] Click "Check In" button
- [ ] Green dot appears
- [ ] Check-in time displays
- [ ] Click "Check Out" button
- [ ] Duration alert shows
- [ ] Status updates

### Attendance Page Testing
- [ ] Click "Attendance" tab
- [ ] Page loads without errors
- [ ] Date selector works (Admin)
- [ ] Month selector works (Employee)
- [ ] Statistics display correctly
- [ ] Attendance table shows data
- [ ] Search functionality works

### Time Off Page Testing
- [ ] Click "Time Off" tab
- [ ] Page loads without errors
- [ ] Balance cards display (Employee)
- [ ] Click "NEW" button
- [ ] Fill request form:
  - [ ] Select type
  - [ ] Select from date
  - [ ] Select to date
  - [ ] Enter reason
- [ ] Click "Submit"
- [ ] Request appears in table
- [ ] Status shows "Pending"

### My Profile Testing
- [ ] Click user avatar
- [ ] Click "My Profile"
- [ ] Profile page loads

#### Resume Tab
- [ ] Personal details display
- [ ] Bank details display
- [ ] Edit a field
- [ ] Tab out (blur)
- [ ] "Profile updated" message shows

#### Private Info Tab
- [ ] Click "Private Info" tab
- [ ] About sections display
- [ ] Click "+ Add Skills"
- [ ] Enter skill name
- [ ] Skill appears in list
- [ ] Click X to delete skill
- [ ] Skill removed from list

#### Salary Tab (Admin Only)
- [ ] Click "Salary" tab (if admin)
- [ ] Salary breakdown displays
- [ ] Monthly summary shows
- [ ] Annual summary shows
- [ ] All calculations correct

### Navigation Testing
- [ ] Navigate between all pages
- [ ] Back buttons work
- [ ] Navigation tabs work
- [ ] User dropdown works
- [ ] Logout works

✅ **All Tests Passed!**

---

## 🔍 Verification Checklist

### Backend Verification
- [ ] Backend server running
  ```bash
  curl http://localhost:8000/api/
  ```

- [ ] Database has data
  ```bash
  psql -U postgres -d dayflow_db
  SELECT COUNT(*) FROM accounts_user;
  \q
  ```

- [ ] No errors in terminal
- [ ] All migrations applied

### Frontend Verification
- [ ] Frontend server running
  ```bash
  curl http://localhost:5173
  ```

- [ ] No console errors (F12)
- [ ] All API calls successful (Network tab)
- [ ] No 404 errors
- [ ] No CORS errors

### Integration Verification
- [ ] Sign up creates user in database
- [ ] Sign in returns JWT token
- [ ] Check-in creates attendance record
- [ ] Time off request saves to database
- [ ] Profile updates persist
- [ ] Skills add/delete works
- [ ] All data persists across page refreshes

✅ **System Verified!**

---

## 📊 Success Indicators

### Backend Terminal ✅
```
System check identified no issues (0 silenced).
January 03, 2026 - 10:00:00
Django version 4.2.x, using settings 'dayflow_core.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Frontend Terminal ✅
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Browser Console ✅
```
POST http://localhost:8000/api/auth/signup/ 201 Created
GET http://localhost:8000/api/employees/ 200 OK
POST http://localhost:8000/api/attendance/check-in/ 201 Created
GET http://localhost:8000/api/attendance/current/ 200 OK
```

### Database ✅
```sql
-- Users created
SELECT COUNT(*) FROM accounts_user;
-- Should show: 1 or more

-- Attendance records
SELECT COUNT(*) FROM attendance_attendancerecord;
-- Should show: 1 or more (after check-in)

-- Time off requests
SELECT COUNT(*) FROM timeoff_timeoffrequest;
-- Should show: 1 or more (after creating request)
```

---

## 🐛 Troubleshooting Checklist

### Backend Issues
- [ ] Virtual environment activated?
  ```bash
  # Should see (venv) in terminal
  ```

- [ ] Dependencies installed?
  ```bash
  pip list | findstr Django
  ```

- [ ] Database created?
  ```bash
  psql -U postgres -l | findstr dayflow_db
  ```

- [ ] .env file exists?
  ```bash
  dir .env
  ```

- [ ] Migrations applied?
  ```bash
  python manage.py showmigrations
  ```

### Frontend Issues
- [ ] Node modules installed?
  ```bash
  dir node_modules
  ```

- [ ] .env file exists?
  ```bash
  type .env
  ```

- [ ] Backend running?
  ```bash
  curl http://localhost:8000/api/
  ```

- [ ] Correct API URL in .env?
  ```bash
  type .env
  # Should show: VITE_API_URL=http://localhost:8000/api
  ```

### Integration Issues
- [ ] CORS configured?
  - Check backend/dayflow_core/settings.py
  - CORS_ALLOWED_ORIGINS should include frontend URL

- [ ] JWT tokens working?
  - Check browser localStorage (F12 → Application → Local Storage)
  - Should see access_token and refresh_token

- [ ] API calls successful?
  - Check Network tab (F12 → Network)
  - All calls should return 200 or 201

---

## 📝 Post-Setup Checklist

### Documentation
- [ ] Read START_HERE.md
- [ ] Read QUICK_START.md
- [ ] Bookmark API_DOCUMENTATION.md
- [ ] Review ALL_PAGES_CONNECTED.md

### Customization
- [ ] Add company logo
- [ ] Customize colors (optional)
- [ ] Add more employees
- [ ] Configure time off types
- [ ] Set up salary structures

### Security
- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up HTTPS
- [ ] Configure production database

### Deployment (Optional)
- [ ] Choose hosting service
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Build frontend
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production deployment

---

## 🎉 Completion Checklist

- [ ] Backend setup complete
- [ ] Frontend setup complete
- [ ] All tests passed
- [ ] System verified
- [ ] Documentation reviewed
- [ ] Ready to use!

---

## 📞 Need Help?

If any checkbox fails:
1. Check the error message
2. Review [SYSTEM_STATUS_AND_SETUP.md](SYSTEM_STATUS_AND_SETUP.md) troubleshooting section
3. Check browser console (F12)
4. Check backend terminal for errors
5. Verify database connection

---

**Once all checkboxes are checked, you're ready to go! 🚀**
