# 🚀 Quick Reference - Dayflow HRMS

## ⚡ Start the Application

### Frontend
```bash
cd frontend
npm run dev
```
**URL:** http://localhost:5173

### Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
**URL:** http://localhost:8000

---

## 📝 Test Credentials

After running `python manage.py create_sample_employees`:
- **Admin:** admin@dayflow.com / admin123
- **Employee:** employee@dayflow.com / employee123

Or create your own via Sign Up!

---

## 🔧 Common Commands

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

### Backend
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample data
python manage.py create_sample_employees
python manage.py init_timeoff_types

# Start server
python manage.py runserver
```

---

## 🐛 Quick Fixes

### "Cannot find module 'react'"
```bash
cd frontend
npm install
```

### "Database does not exist"
```bash
psql -U postgres
CREATE DATABASE dayflow_db;
\q
python manage.py migrate
```

### "CORS Error"
Check `backend/dayflow_core/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Frontend not loading
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 System URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React app |
| Backend API | http://localhost:8000/api | REST API |
| Django Admin | http://localhost:8000/admin | Admin panel |

---

## ✅ Status Check

### Frontend Running?
```bash
curl http://localhost:5173
```

### Backend Running?
```bash
curl http://localhost:8000/api/
```

### Database Connected?
```bash
psql -U postgres -d dayflow_db
\dt
\q
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| START_HERE.md | Start here! |
| QUICK_START.md | 5-min setup |
| ALL_ERRORS_FIXED.md | Error fixes |
| SYSTEM_STATUS_AND_SETUP.md | Complete guide |
| backend/API_DOCUMENTATION.md | API reference |

---

## 🎯 Quick Test

1. Open http://localhost:5173
2. Sign up as admin
3. Check in
4. View Attendance
5. Create Time Off request
6. Update Profile

---

**Everything working? You're all set! 🎉**
