# 📦 Git Setup Guide - Dayflow HRMS

## ✅ .gitignore Files Created

Your repository now has comprehensive .gitignore files:
- ✅ Root `.gitignore` - General project files
- ✅ `backend/.gitignore` - Python/Django specific
- ✅ `frontend/.gitignore` - Node/React specific

---

## 🚀 Quick Git Setup

### 1. Initialize Git Repository (if not already done)
```bash
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Check What Will Be Committed
```bash
git status
```

You should see:
- ✅ Source code files
- ✅ Configuration files (without secrets)
- ✅ Documentation files
- ❌ node_modules/ (ignored)
- ❌ venv/ (ignored)
- ❌ .env files (ignored)
- ❌ __pycache__/ (ignored)

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: Dayflow HRMS - Complete system"
```

### 5. Add Remote Repository
```bash
# Replace with your repository URL
git remote add origin https://github.com/yourusername/dayflow-hrms.git
```

### 6. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## 🔒 What's Being Ignored

### Environment & Secrets
- `.env` files (contains database passwords, secret keys)
- `secrets.json`, `credentials.json`
- `*.pem`, `*.key`, `*.cert` files

### Dependencies
- `node_modules/` (frontend dependencies - 370 packages!)
- `venv/` (Python virtual environment)
- `__pycache__/` (Python bytecode)

### Build Artifacts
- `dist/`, `build/` (compiled frontend)
- `staticfiles/` (Django static files)
- `*.pyc`, `*.pyo` (Python compiled files)

### Database
- `db.sqlite3` (local database)
- `*.db`, `*.sqlite` files

### IDE & OS Files
- `.vscode/`, `.idea/` (editor settings)
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)

### Logs & Temporary Files
- `*.log` files
- `*.tmp`, `*.temp` files
- Coverage reports

---

## ⚠️ Important: Before Pushing

### 1. Check for Sensitive Data
```bash
# Search for potential secrets
git grep -i "password"
git grep -i "secret"
git grep -i "api_key"
```

### 2. Verify .env is Ignored
```bash
git status
# .env should NOT appear in the list
```

### 3. Check File Sizes
```bash
# List large files
git ls-files | xargs ls -lh | sort -k5 -hr | head -20
```

---

## 📝 Recommended .env.example Files

### Backend .env.example
Already exists at `backend/.env.example`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=dayflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend .env.example
Create this file:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔄 Git Workflow

### Daily Development
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push
```

### Commit Message Convention
```bash
# Features
git commit -m "feat: add employee search functionality"

# Bug fixes
git commit -m "fix: resolve attendance calculation error"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: improve code structure"

# Style changes
git commit -m "style: format code with prettier"
```

---

## 🌿 Branching Strategy

### Create Feature Branch
```bash
git checkout -b feature/employee-reports
```

### Work on Feature
```bash
git add .
git commit -m "feat: add employee reports"
```

### Merge to Main
```bash
git checkout main
git merge feature/employee-reports
git push
```

---

## 📦 What Gets Committed

### ✅ Should Be Committed:
- Source code (`.py`, `.tsx`, `.ts`, `.jsx`, `.js`)
- Configuration templates (`.env.example`)
- Documentation (`.md` files)
- Requirements (`requirements.txt`, `package.json`)
- Static assets (images, fonts)
- Database migrations (`*/migrations/*.py`)
- Tests

### ❌ Should NOT Be Committed:
- Environment files (`.env`)
- Dependencies (`node_modules/`, `venv/`)
- Build outputs (`dist/`, `build/`)
- Database files (`*.sqlite3`)
- Logs (`*.log`)
- IDE settings (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Secrets and credentials

---

## 🔍 Verify Before Pushing

### Check Ignored Files
```bash
git status --ignored
```

### Check What Will Be Pushed
```bash
git diff origin/main
```

### List All Tracked Files
```bash
git ls-files
```

---

## 🚨 If You Accidentally Committed Secrets

### Remove from Last Commit
```bash
git rm --cached .env
git commit --amend -m "Remove .env file"
```

### Remove from History (if already pushed)
```bash
# Use git filter-branch or BFG Repo-Cleaner
# Then change all exposed secrets immediately!
```

**Important:** If secrets were pushed, change them immediately:
1. Change database passwords
2. Generate new SECRET_KEY
3. Rotate API keys
4. Update all credentials

---

## 📊 Repository Structure

```
dayflow-hrms/
├── .git/                    # Git repository data
├── .gitignore              # Root ignore rules
├── README.md               # Main documentation
├── backend/
│   ├── .gitignore          # Backend ignore rules
│   ├── .env.example        # Environment template
│   ├── requirements.txt    # Python dependencies (committed)
│   ├── manage.py
│   └── ...
├── frontend/
│   ├── .gitignore          # Frontend ignore rules
│   ├── package.json        # Node dependencies (committed)
│   ├── src/
│   └── ...
└── Documentation/
    └── *.md files
```

---

## 🎯 Quick Commands Reference

```bash
# Initialize
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin <url>
git push -u origin main

# Daily workflow
git status
git add .
git commit -m "message"
git push

# Branching
git checkout -b feature-name
git checkout main
git merge feature-name

# Undo changes
git restore <file>
git reset --soft HEAD~1

# View history
git log --oneline
git log --graph --oneline --all
```

---

## 📚 Additional Resources

### Git Documentation
- [Git Official Docs](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

### .gitignore Templates
- [GitHub .gitignore Templates](https://github.com/github/gitignore)
- [gitignore.io](https://www.toptal.com/developers/gitignore)

---

## ✅ Checklist Before First Push

- [ ] .gitignore files created
- [ ] .env files are ignored
- [ ] No secrets in code
- [ ] .env.example files created
- [ ] README.md updated
- [ ] All tests passing
- [ ] Code formatted
- [ ] Documentation complete
- [ ] Remote repository created
- [ ] Ready to push!

---

## 🎉 You're Ready!

Your repository is now properly configured with .gitignore files. You can safely push your code without exposing sensitive information.

```bash
git add .
git commit -m "Initial commit: Dayflow HRMS"
git push -u origin main
```

**Happy coding! 🚀**
