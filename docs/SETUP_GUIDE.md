# 📘 Complete Setup Guide - Biometric Face Voting System

This guide will walk you through the complete setup process for the Biometric Face Voting System on Windows.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [Testing the System](#testing-the-system)
6. [Common Issues](#common-issues)

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10 or later
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Camera**: Working webcam
- **Internet**: Required for initial setup (downloading dependencies)

### Software Requirements
- Python 3.8 or higher
- Node.js 16.x or higher
- MongoDB Community Edition
- Modern web browser (Chrome, Edge, Firefox)

---

## Installing Prerequisites

### Step 1: Install Python

1. Go to https://www.python.org/downloads/
2. Download Python 3.8+ (latest version recommended)
3. Run the installer
4. **IMPORTANT**: Check ✅ "Add Python to PATH"
5. Click "Install Now"
6. Verify installation:
   ```powershell
   python --version
   ```
   Should show: `Python 3.x.x`

### Step 2: Install Node.js

1. Go to https://nodejs.org/
2. Download LTS version (Long Term Support)
3. Run the installer
4. Keep all default settings
5. Verify installation:
   ```powershell
   node --version
   npm --version
   ```
   Should show version numbers for both

### Step 3: Install MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest
   - Platform: Windows
   - Package: MSI
3. Download and run installer
4. Choose "Complete" installation
5. **IMPORTANT**: Check ✅ "Install MongoDB as a Service"
6. Leave default data directory
7. Complete installation

### Step 4: Verify MongoDB

Open PowerShell and run:
```powershell
mongod --version
```

If MongoDB is running as a service, it will start automatically. Otherwise, start it manually:
```powershell
mongod
```

---

## Project Setup

### Step 1: Extract/Clone Project

Extract the project files to:
```
C:\Users\Shriram\Desktop\Attendance App
```

Your folder structure should look like:
```
Attendance App/
├── backend/
├── frontend/
├── docs/
└── README.md
```

### Step 2: Backend Setup

1. Open PowerShell in the project root
2. Navigate to backend:
   ```powershell
   cd backend
   ```

3. Run setup script:
   ```powershell
   .\setup.bat
   ```

   This will:
   - Create virtual environment
   - Install Python packages (face_recognition, Flask, etc.)
   - Create `.env` file

4. Wait for installation to complete (may take 5-10 minutes)

**If you encounter errors:**

- **dlib installation fails**: You may need Visual Studio C++ Build Tools
  - Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
  - Install "Desktop development with C++" workload
  - Retry setup

- **CMake error**: Install CMake
  - Download from: https://cmake.org/download/
  - Add to PATH
  - Retry setup

### Step 3: Frontend Setup

1. Open a new PowerShell window
2. Navigate to frontend:
   ```powershell
   cd "C:\Users\Shriram\Desktop\Attendance App\frontend"
   ```

3. Run setup script:
   ```powershell
   .\setup.bat
   ```

   This will:
   - Install npm packages
   - Set up React development environment

4. Wait for installation to complete (may take 3-5 minutes)

---

## Running the Application

You need **THREE** terminals running simultaneously:

### Terminal 1: MongoDB (if not running as service)

```powershell
mongod
```

Keep this running. You should see:
```
[initandlisten] waiting for connections on port 27017
```

### Terminal 2: Backend Server

```powershell
cd "C:\Users\Shriram\Desktop\Attendance App\backend"
.\start_server.bat
```

You should see:
```
* Running on http://0.0.0.0:5000
* Connected to MongoDB: biometric_voting_system
```

### Terminal 3: Frontend Server

```powershell
cd "C:\Users\Shriram\Desktop\Attendance App\frontend"
.\start_frontend.bat
```

Browser will automatically open at: http://localhost:3000

---

## Testing the System

### Test 1: Health Check

1. Open browser: http://localhost:5000/api/health
2. Should see:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "..."
   }
   ```

### Test 2: User Registration

1. Go to: http://localhost:3000/register
2. Fill in details:
   - Voter ID: TEST001
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Address: Test Address
3. Click "Capture Photo"
4. Allow camera access when prompted
5. Capture your face
6. Click "Register"
7. Should see success message

### Test 3: Face Login

1. Go to: http://localhost:3000/login
2. Click "Start Face Recognition"
3. Capture face (same person as registration)
4. System should authenticate automatically
5. Should redirect to voting page

### Test 4: Cast Vote

1. After login, you'll see candidate list
2. Select a candidate
3. Click "Cast Your Vote"
4. Should see confirmation
5. Try voting again - should be prevented

### Test 5: Admin Panel

1. Go to: http://localhost:3000/admin
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Should see dashboard with:
   - Statistics cards
   - Charts (bar and pie)
   - Voter list
   - Candidate management

### Test 6: Export Reports

1. In admin dashboard, click "Overview" tab
2. Click "CSV" or "PDF" button
3. File should download automatically

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error**: `Could not connect to MongoDB`

**Solutions**:
1. Check if MongoDB is running:
   ```powershell
   mongod
   ```
2. Check port 27017 is not in use
3. Restart MongoDB service:
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

### Issue 2: Camera Not Working

**Error**: `Camera access denied` or no video feed

**Solutions**:
1. Check browser permissions
   - Click lock icon in address bar
   - Allow camera access
2. Close other apps using camera (Zoom, Teams, etc.)
3. Try different browser
4. Use HTTPS (some browsers require it)

### Issue 3: Face Not Recognized

**Error**: `Face not recognized` during login

**Solutions**:
1. Ensure good lighting
2. Remove glasses/hat if worn during registration
3. Look directly at camera
4. Be the same person who registered
5. Try adjusting `FACE_RECOGNITION_TOLERANCE` in `backend/.env`:
   ```
   FACE_RECOGNITION_TOLERANCE=0.7  # Lower = stricter, Higher = looser
   ```

### Issue 4: Module Not Found (Python)

**Error**: `ModuleNotFoundError: No module named 'face_recognition'`

**Solutions**:
1. Activate virtual environment:
   ```powershell
   cd backend
   venv\Scripts\activate
   ```
2. Reinstall packages:
   ```powershell
   pip install -r requirements.txt
   ```
3. Check Python version:
   ```powershell
   python --version  # Should be 3.8+
   ```

### Issue 5: npm Install Errors

**Error**: Various npm errors during frontend setup

**Solutions**:
1. Clear npm cache:
   ```powershell
   npm cache clean --force
   ```
2. Delete node_modules and retry:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```
3. Check Node.js version:
   ```powershell
   node --version  # Should be 16+
   ```

### Issue 6: Port Already in Use

**Backend Error**: `Address already in use: 5000`

**Solution**: Change port in `backend/.env`:
```env
PORT=5001
```
Also update frontend API URL in `frontend/src/services/api.js`

**Frontend Error**: Port 3000 in use

**Solution**: Vite will automatically use next available port (3001, 3002, etc.)

### Issue 7: CORS Errors

**Error**: `CORS policy blocked`

**Solution**: Backend already has CORS enabled. If issues persist:
1. Check backend is running on port 5000
2. Verify API_BASE_URL in frontend matches backend port
3. Clear browser cache

### Issue 8: Virtual Environment Not Activating

**Error**: `cannot be loaded because running scripts is disabled`

**Solution**: Enable script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 9: Build Errors After Changes

**Frontend**:
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

**Backend**:
```powershell
cd backend
venv\Scripts\activate
pip install --upgrade -r requirements.txt
```

---

## Environment Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=biometric_voting_system

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# Face Recognition Settings
FACE_RECOGNITION_TOLERANCE=0.6

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Server Configuration
HOST=0.0.0.0
PORT=5000
```

### Frontend Configuration

If backend URL changes, update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## Database Management

### View Database Contents

Using MongoDB Compass (GUI tool):
1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Connect to: `mongodb://localhost:27017`
4. Browse `biometric_voting_system` database

Using MongoDB Shell:
```powershell
mongosh
use biometric_voting_system
db.users.find()
db.candidates.find()
db.votes.find()
```

### Reset Database

**Warning**: This will delete all data!

```powershell
mongosh
use biometric_voting_system
db.dropDatabase()
```

Restart backend to recreate with sample data.

---

## Production Deployment Checklist

When deploying to production:

- [ ] Change admin credentials in `.env`
- [ ] Set `FLASK_ENV=production` and `FLASK_DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Use hashed passwords (bcrypt)
- [ ] Enable HTTPS
- [ ] Set up proper CORS restrictions
- [ ] Configure MongoDB authentication
- [ ] Set up database backups
- [ ] Add rate limiting
- [ ] Enable logging and monitoring
- [ ] Use environment-specific configs
- [ ] Set up proper error handling
- [ ] Configure firewall rules

---

## Useful Commands

### Backend

```powershell
# Activate virtual environment
cd backend
venv\Scripts\activate

# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Run Flask shell
python
>>> from app import app
>>> from database import get_db
```

### Frontend

```powershell
# Install new package
npm install package-name

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache
npm cache clean --force
```

### MongoDB

```powershell
# Start MongoDB
mongod

# MongoDB shell
mongosh

# Backup database
mongodump --db biometric_voting_system --out backup/

# Restore database
mongorestore --db biometric_voting_system backup/biometric_voting_system/
```

---

## Getting Help

### Documentation
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Main: `README.md`

### Troubleshooting Steps
1. Check all terminals for error messages
2. Verify all services are running
3. Check browser console (F12)
4. Review this setup guide
5. Check MongoDB is running
6. Verify camera permissions
7. Clear browser cache

### Log Files
- Backend: Check terminal output
- Frontend: Check browser console (F12)
- MongoDB: Check logs in MongoDB data directory

---

## Next Steps

After successful setup:

1. **Customize the system**
   - Add your own candidates
   - Customize theme colors
   - Modify candidate information

2. **Test thoroughly**
   - Register multiple users
   - Test face recognition accuracy
   - Verify vote integrity
   - Test admin functions

3. **Prepare for deployment** (if needed)
   - Follow production checklist
   - Set up cloud MongoDB
   - Configure domain and HTTPS
   - Deploy to hosting service

---

## Tips for Best Results

### Face Recognition
- Use good, even lighting
- Look directly at camera
- Keep face centered in frame
- Avoid wearing hats/sunglasses
- Use same lighting for registration and login
- Ensure high-quality webcam

### Performance
- Close unnecessary applications
- Use modern browser (Chrome/Edge recommended)
- Ensure stable internet during setup
- Keep system updated

### Development
- Use VS Code for editing
- Install recommended extensions
- Enable auto-save
- Use browser DevTools for debugging

---

**Setup Complete! 🎉**

You now have a fully functional Biometric Face Voting System running locally!

For questions or issues, review the troubleshooting section or check the documentation.

Happy Voting! 🗳️✨
