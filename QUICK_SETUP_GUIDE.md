# Quick Setup Guide - Connect Frontend to Backend

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- PostgreSQL installed and running

## Step 1: Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (if needed)
# Add your PostgreSQL credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (Admin account)
python manage.py createsuperuser
# Follow prompts to create admin account

# Optional: Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start backend server
python manage.py runserver
```

Backend will run on: **http://localhost:8000**

## Step 2: Frontend Setup

```bash
cd frontend

# Install axios (if not already installed)
npm install axios

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start frontend development server
npm run dev
```

Frontend will run on: **http://localhost:5173** (or similar)

## Step 3: Test the Connection

1. **Open browser** to `http://localhost:5173`

2. **Sign Up** as a new admin:
   - Company Name: Your Company
   - Name: Your Name
   - Email: your@email.com
   - Phone: +1234567890
   - Password: SecurePass123
   - Confirm Password: SecurePass123

3. **Or Sign In** with the superuser you created:
   - Login ID: your-email@example.com
   - Password: your-password

4. **Test Features**:
   - ✅ Check In/Out (updates in real-time)
   - ✅ View Employees (if admin)
   - ✅ Navigate to Attendance page
   - ✅ Navigate to Time Off page
   - ✅ Navigate to My Profile
   - ✅ View Salary tab (admin only)

## Troubleshooting

### Backend Issues

**CORS Error:**
```python
# In backend/dayflow_core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

**Database Connection Error:**
```python
# Check backend/dayflow_core/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'dayflow_db',
        'USER': 'your_postgres_user',
        'PASSWORD': 'your_postgres_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

**Migrations Error:**
```bash
# Delete all migration files except __init__.py
# Then run:
python manage.py makemigrations
python manage.py migrate
```

### Frontend Issues

**API Connection Error:**
```bash
# Check .env file exists
cat .env
# Should show: VITE_API_URL=http://localhost:8000/api

# Restart dev server after creating .env
npm run dev
```

**Module Not Found:**
```bash
# Install missing dependencies
npm install axios
```

**TypeScript Errors:**
```bash
# Install type definitions
npm install --save-dev @types/node
```

## Verify Backend is Running

Open browser to: `http://localhost:8000/api/`

You should see Django REST Framework browsable API.

## Verify Frontend is Connected

1. Open browser console (F12)
2. Sign in
3. Check Network tab - you should see API calls to `http://localhost:8000/api/auth/signin/`
4. Check for successful responses (200 status)

## API Endpoints Available

- `POST /api/auth/admin/signup/` - Create admin account
- `POST /api/auth/signin/` - Sign in
- `GET /api/employees/` - List employees (admin only)
- `POST /api/attendance/check-in/` - Check in
- `POST /api/attendance/check-out/` - Check out
- `GET /api/attendance/current/` - Current status
- `GET /api/profile/me/full/` - Get full profile
- `PATCH /api/profile/me/full/` - Update profile
- `GET /api/timeoff/me/` - My time off requests
- And many more...

## What's Connected

✅ **Authentication** - Real signup/signin with JWT
✅ **Employees Dashboard** - Fetches real employee data
✅ **Check In/Out** - Updates backend and reflects in UI
✅ **Status Indicators** - Real-time from backend
✅ **Search** - Searches backend with debounce
✅ **Error Handling** - Shows backend errors to user
✅ **Loading States** - Shows loading while fetching

## What Still Uses Mock Data

The following components still use mock data and need to be connected:
- ⚠️ **AttendancePage** - Admin day view and employee month view
- ⚠️ **TimeOff** - Time off requests and approvals
- ⚠️ **MyProfile** - Profile tabs (Resume, Private Info, Salary)

These will be connected in the next update!

## Next Steps

1. Test the basic flow (signup → signin → dashboard)
2. Test check-in/out functionality
3. Verify employees list loads (if admin)
4. Check browser console for any errors
5. Verify backend logs show API requests

## Need Help?

- Check `backend/API_DOCUMENTATION.md` for complete API reference
- Check `FRONTEND_BACKEND_INTEGRATION.md` for detailed integration guide
- Check browser console for errors
- Check backend terminal for Django errors
- Check Network tab in browser DevTools for API calls
