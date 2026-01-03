# Final Setup & Test Guide

## 🚀 Complete Setup (5 Minutes)

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies (if not done)
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create sample data (optional)
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start server
python manage.py runserver
```

✅ Backend running on: `http://localhost:8000`

### Step 2: Frontend Setup
```bash
cd frontend

# Install axios (if not done)
npm install axios

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start dev server
npm run dev
```

✅ Frontend running on: `http://localhost:5173`

---

## 🧪 Complete Test Flow (10 Minutes)

### 1. Sign Up (1 min)
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Fill form:
   - Company: "Tech Solutions"
   - Name: "John Doe"
   - Email: "john@tech.com"
   - Phone: "+1234567890"
   - Password: "SecurePass123"
   - Confirm: "SecurePass123"
4. Click "Sign Up"

✅ **Expected:** Redirected to dashboard, user created in database

### 2. Check In/Out (1 min)
1. Click "Check In" button
2. See green dot appear
3. See time displayed
4. Click "Check Out"
5. See duration alert

✅ **Expected:** Attendance record created in database

### 3. View Employees (1 min)
1. If admin, see employee cards
2. Try search bar
3. See status dots (green/red/yellow)

✅ **Expected:** Real employees from database

### 4. Attendance Page (2 min)
1. Click "Attendance" tab
2. **Admin:** See day view with statistics
3. **Admin:** Try date navigation (< >)
4. **Employee:** See month view with summary
5. **Employee:** Try month selector

✅ **Expected:** Real attendance data from database

### 5. Time Off Page (2 min)
1. Click "Time Off" tab
2. See balance cards (employee view)
3. Click "NEW" button
4. Fill form:
   - Type: "Paid Time Off"
   - From: Tomorrow's date
   - To: Day after tomorrow
   - Reason: "Family vacation"
5. Click "Submit"
6. **Admin:** See request in table
7. **Admin:** Click "Approve"

✅ **Expected:** Request saved, status updates, balance deducted

### 6. My Profile (3 min)
1. Click user avatar → "My Profile"
2. **Resume Tab:**
   - Edit address
   - Edit bank details
   - Tab out to save
3. **Private Info Tab:**
   - Edit "About" section
   - Click "+ Add Skills"
   - Enter "Python"
   - See skill appear
   - Click X to delete
4. **Salary Tab (Admin only):**
   - See salary breakdown
   - See auto-calculated totals
   - See monthly & annual summary

✅ **Expected:** All changes saved to database

---

## ✅ Success Indicators

### Browser Console (F12)
```
✅ POST http://localhost:8000/api/auth/signup/ 201
✅ GET http://localhost:8000/api/employees/ 200
✅ POST http://localhost:8000/api/attendance/check-in/ 201
✅ GET http://localhost:8000/api/attendance/admin/day/ 200
✅ POST /api/timeoff/me/ 201
✅ GET /api/profile/me/full/ 200
```

### Backend Terminal
```
✅ [03/Jan/2026] "POST /api/auth/signup/ HTTP/1.1" 201
✅ [03/Jan/2026] "GET /api/employees/ HTTP/1.1" 200
✅ [03/Jan/2026] "POST /api/attendance/check-in/ HTTP/1.1" 201
```

### Database (Django Admin)
1. Open `http://localhost:8000/admin`
2. Login with superuser
3. Check:
   - ✅ Users table has new user
   - ✅ Attendance records exist
   - ✅ Time off requests exist
   - ✅ Profile details exist

---

## 🐛 Troubleshooting

### "Network Error"
```bash
# Check backend is running
curl http://localhost:8000/api/

# Check .env file
cat frontend/.env

# Restart frontend
cd frontend
npm run dev
```

### "CORS Error"
```python
# In backend/dayflow_core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### "No employees found"
```bash
# Create sample data
cd backend
python manage.py create_sample_employees
```

### "401 Unauthorized"
```typescript
// Clear tokens and sign in again
localStorage.clear()
// Refresh page
```

---

## 📊 What's Connected

| Feature | Status | API Endpoint |
|---------|--------|--------------|
| Sign Up | ✅ | POST /api/auth/admin/signup/ |
| Sign In | ✅ | POST /api/auth/signin/ |
| Employees List | ✅ | GET /api/employees/ |
| Check In | ✅ | POST /api/attendance/check-in/ |
| Check Out | ✅ | POST /api/attendance/check-out/ |
| Admin Day View | ✅ | GET /api/attendance/admin/day/ |
| Employee Month View | ✅ | GET /api/attendance/me/month/ |
| My Time Off | ✅ | GET /api/timeoff/me/ |
| Create Request | ✅ | POST /api/timeoff/me/ |
| Approve Request | ✅ | POST /api/timeoff/admin/{id}/approve/ |
| Full Profile | ✅ | GET /api/profile/me/full/ |
| Update Profile | ✅ | PATCH /api/profile/me/full/ |
| Add Skill | ✅ | POST /api/profile/me/skills/ |
| Delete Skill | ✅ | DELETE /api/profile/me/skills/{id}/ |
| Add Certification | ✅ | POST /api/profile/me/certifications/ |
| Delete Certification | ✅ | DELETE /api/profile/me/certifications/{id}/ |
| View Salary | ✅ | GET /api/profile/me/salary/ |

---

## 🎯 Quick Verification

Run these commands to verify everything:

```bash
# 1. Check backend is running
curl http://localhost:8000/api/

# 2. Check frontend is running
curl http://localhost:5173

# 3. Check database has data
cd backend
python manage.py shell
>>> from accounts.models import User
>>> User.objects.count()
# Should show number of users

# 4. Check attendance records
>>> from attendance.models import AttendanceRecord
>>> AttendanceRecord.objects.count()
# Should show number of records
```

---

## 🎉 You're Done!

**Everything is connected and working!**

- ✅ Frontend talks to backend
- ✅ Backend saves to PostgreSQL
- ✅ Real-time updates work
- ✅ All pages functional
- ✅ Role-based access works
- ✅ JWT authentication secure

**Next Steps:**
1. Add more employees
2. Test all features
3. Customize as needed
4. Deploy to production!

---

## 📞 Need Help?

Check these files:
- `ALL_PAGES_CONNECTED.md` - Complete connection status
- `backend/API_DOCUMENTATION.md` - API reference
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration details
- `QUICK_SETUP_GUIDE.md` - Setup instructions

Or check:
- Browser console for errors
- Backend terminal for Django errors
- Network tab for API calls
- Database for data persistence
