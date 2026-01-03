# ⚡ Quick Start Guide - Dayflow HRMS

## 🚀 Get Running in 5 Minutes

### Prerequisites Check
- [ ] Python 3.10+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed or Docker available

---

## 🎯 Option 1: Quick Setup (Recommended)

### Step 1: Backend (2 minutes)
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy and edit)
copy .env.example .env
```

**Edit `.env` file:**
```env
SECRET_KEY=django-insecure-change-this-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

```bash
# Create database (if PostgreSQL is installed)
# Open psql and run: CREATE DATABASE dayflow_db;

# Run migrations
python manage.py migrate

# Create sample data (optional)
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start server
python manage.py runserver
```

✅ Backend running on `http://localhost:8000`

### Step 2: Frontend (1 minute)
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:8000/api > .env

# Start dev server
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### Step 3: Test (2 minutes)
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Create admin account
4. Test check-in/out
5. Explore all pages!

---

## 🎯 Option 2: Docker Setup (Coming Soon)

```bash
# Start everything with Docker Compose
docker-compose up -d

# Access at http://localhost:5173
```

---

## 🧪 Quick Test

### Test Backend
```bash
# Check if backend is running
curl http://localhost:8000/api/
```

### Test Frontend
```bash
# Open in browser
start http://localhost:5173
```

---

## 🐛 Quick Fixes

### Backend won't start?
```bash
# Make sure virtual environment is activated
cd backend
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Database error?
```bash
# Create database
psql -U postgres
CREATE DATABASE dayflow_db;
\q

# Run migrations
python manage.py migrate
```

### Frontend error?
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
```

### CORS error?
Check `backend/dayflow_core/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

## 📝 Test Credentials

After running `create_sample_employees`:
- **Admin**: admin@dayflow.com / admin123
- **Employee**: employee@dayflow.com / employee123

Or create your own via Sign Up!

---

## ✅ Success Indicators

### Backend Terminal
```
✅ System check identified no issues (0 silenced).
✅ Django version 4.2.x
✅ Starting development server at http://127.0.0.1:8000/
```

### Frontend Terminal
```
✅ VITE v5.x.x ready in xxx ms
✅ Local: http://localhost:5173/
```

### Browser Console (F12)
```
✅ POST http://localhost:8000/api/auth/signup/ 201
✅ GET http://localhost:8000/api/employees/ 200
```

---

## 🎯 What to Test

1. **Sign Up** → Creates user in database
2. **Sign In** → JWT authentication works
3. **Check In** → Creates attendance record
4. **Attendance Page** → See real data
5. **Time Off** → Create and approve requests
6. **My Profile** → Update and save changes

---

## 📚 Full Documentation

For detailed setup and troubleshooting:
- `SYSTEM_STATUS_AND_SETUP.md` - Complete setup guide
- `ALL_PAGES_CONNECTED.md` - Feature overview
- `backend/API_DOCUMENTATION.md` - API reference

---

## 🎉 You're Ready!

Once both servers are running, you have a fully functional HRMS system with:
- ✅ User authentication
- ✅ Employee management
- ✅ Attendance tracking
- ✅ Time off management
- ✅ Profile management
- ✅ Real-time updates
- ✅ PostgreSQL persistence

**Happy coding! 🚀**
