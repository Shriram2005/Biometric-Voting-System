# 🗳️ Biometric Face Voting System

A complete, modern, and secure voting system using **face recognition** technology. Built with Python (Flask), MongoDB, and React.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.2+-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-local-green.svg)

## 🌟 Features

### Core Functionality
- ✅ **Biometric Face Registration** - Secure voter registration with face capture
- ✅ **Face Recognition Login** - Password-free authentication using AI
- ✅ **One Vote Per Person** - Enforced through face matching technology
- ✅ **Offline Capable** - Fully functional with local MongoDB
- ✅ **Real-time Results** - Live vote tracking and statistics

### User Interface
- 🎨 **Modern Design** - Clean, professional, and attractive UI
- 🌓 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Works on all devices (mobile, tablet, desktop)
- ✨ **Smooth Animations** - Framer Motion powered interactions
- 🔔 **Toast Notifications** - Real-time feedback for all actions

### Admin Panel
- 📊 **Dashboard Analytics** - Comprehensive voting statistics
- 📈 **Interactive Charts** - Bar charts and pie charts for vote distribution
- 👥 **Voter Management** - View all registered voters and their status
- 🎯 **Candidate Management** - Add, edit, and remove candidates
- 📥 **Export Reports** - Download results as CSV or PDF

### Security
- 🔒 **Face Matching Algorithm** - Advanced face recognition with configurable tolerance
- 🛡️ **Duplicate Prevention** - System prevents multiple voting attempts
- 🔐 **Admin Authentication** - Separate admin login system
- ✅ **Data Validation** - Comprehensive input validation

## 🏗️ Architecture

```
Biometric-Voting-System/
├── backend/                 # Python Flask Backend
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration management
│   ├── database.py         # MongoDB connection & setup
│   ├── face_recognition_service.py  # Face recognition logic
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment variables template
│   ├── setup.bat          # Windows setup script
│   ├── start_server.bat   # Start backend server
│   └── README.md          # Backend documentation
│
├── frontend/               # React.js Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts (Theme, Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # npm dependencies
│   ├── setup.bat          # Windows setup script
│   ├── start_frontend.bat # Start frontend server
│   └── README.md          # Frontend documentation
│
├── docs/                   # Documentation
│   └── SETUP_GUIDE.md     # Complete setup guide
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Python 3.8+** - [Download](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download](https://nodejs.org/)
3. **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community)
4. **Git** (optional) - [Download](https://git-scm.com/)

### Step 1: Clone or Download

```bash
# Option 1: Clone with Git
git clone <repository-url>
cd "Attendance App"

# Option 2: Download and extract ZIP
# Extract to: C:\Users\Shriram\Desktop\Attendance App
```

### Step 2: Start MongoDB

Open a new terminal and start MongoDB:

```bash
mongod
```

Keep this terminal running. MongoDB will run on port 27017.

### Step 3: Setup Backend

Open a new terminal in the backend folder:

```bash
cd backend
setup.bat
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Create `.env` file

After setup, start the backend:

```bash
start_server.bat
```

Backend will run on: http://localhost:5000

### Step 4: Setup Frontend

Open a new terminal in the frontend folder:

```bash
cd frontend
setup.bat
```

This will install all npm dependencies.

After setup, start the frontend:

```bash
start_frontend.bat
```

Frontend will open automatically at: http://localhost:3000

### Step 5: Access the Application

- **User Interface**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `admin123`

## 📖 Usage Guide

### For Voters

1. **Register**
   - Go to the registration page
   - Fill in your details (Voter ID, Name, Email, Phone, Address)
   - Capture your face photo using webcam
   - Submit registration

2. **Login**
   - Go to login page
   - Click "Start Face Recognition"
   - Look at the camera
   - System will automatically authenticate you

3. **Vote**
   - Select your preferred candidate
   - Click "Cast Your Vote"
   - Confirmation will be shown
   - You cannot vote again

### For Administrators

1. **Login**
   - Go to: http://localhost:3000/admin
   - Enter admin credentials

2. **View Dashboard**
   - See voting statistics
   - View charts and graphs
   - Monitor voter turnout

3. **Manage Candidates**
   - Add new candidates
   - Edit candidate information
   - Remove candidates (if no votes)

4. **View Voters**
   - See all registered voters
   - Check voting status

5. **Export Results**
   - Download CSV report
   - Generate PDF report

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database (local)
- **face_recognition** - Face recognition library (dlib + OpenCV)
- **OpenCV** - Computer vision library
- **Pandas** - Data manipulation for exports
- **ReportLab** - PDF generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Webcam** - Camera access
- **Recharts** - Charts and graphs
- **React Hot Toast** - Notifications

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=biometric_voting_system

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Face Recognition
FACE_RECOGNITION_TOLERANCE=0.6

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Server
HOST=0.0.0.0
PORT=5000
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📊 Database Schema

### Users Collection
```javascript
{
  voter_id: String (unique),
  name: String,
  email: String (unique),
  phone: String,
  address: String,
  age: String,
  gender: String,
  face_encoding: Array[128], // 128-dimensional face encoding
  has_voted: Boolean,
  registered_at: DateTime,
  voted_at: DateTime (optional)
}
```

### Candidates Collection
```javascript
{
  candidate_id: String (unique),
  name: String,
  party: String,
  description: String,
  image_url: String,
  created_at: DateTime
}
```

### Votes Collection
```javascript
{
  voter_id: String,
  candidate_id: String,
  candidate_name: String,
  timestamp: DateTime
}
```

### Admins Collection
```javascript
{
  username: String,
  password: String, // In production, use hashed passwords!
  role: String,
  created_at: DateTime
}
```

## 🔒 Security Features

1. **Face Recognition**
   - Uses 128-dimensional face encodings
   - Configurable tolerance for matching
   - Detects and prevents multiple faces

2. **Vote Integrity**
   - One vote per face ID
   - Vote records are immutable
   - Timestamp tracking

3. **Admin Security**
   - Separate admin authentication
   - Protected admin routes
   - Session management

## 🎨 UI Screenshots

### Landing Page
Modern landing page with feature showcase and call-to-action buttons.

### Registration
Step-by-step registration with webcam face capture.

### Login
Secure face recognition login interface.

### Voting Interface
Clean and intuitive voting interface with candidate cards.

### Admin Dashboard
Comprehensive dashboard with charts, statistics, and management tools.

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Make sure MongoDB is running
Command: mongod
```

### Camera Not Working
```
Solution 1: Check browser permissions
Solution 2: Use HTTPS (some browsers require it)
Solution 3: Check if camera is used by another app
```

### Face Not Recognized
```
Solution 1: Ensure good lighting
Solution 2: Look directly at camera
Solution 3: Try re-registering with better photo
Solution 4: Adjust FACE_RECOGNITION_TOLERANCE in .env
```

### Port Already in Use
```
Backend: Change PORT in .env
Frontend: Vite will auto-select next available port
```

### Module Import Errors (Python)
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Module Import Errors (Node)
```bash
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

## 📝 API Documentation

### User Endpoints

```
POST   /api/register              Register new user
POST   /api/login                 Login with face
GET    /api/user/:id              Get user details
GET    /api/candidates            Get all candidates
POST   /api/vote                  Cast a vote
GET    /api/voting-status/:id     Check voting status
```

### Admin Endpoints

```
POST   /api/admin/login           Admin login
GET    /api/admin/stats           Get statistics
GET    /api/admin/users           Get all users
POST   /api/admin/candidate       Add candidate
PUT    /api/admin/candidate/:id   Update candidate
DELETE /api/admin/candidate/:id   Delete candidate
GET    /api/admin/export/csv      Export CSV
GET    /api/admin/export/pdf      Export PDF
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Created with ❤️ for secure and modern voting systems.

## 📞 Support

For issues and questions:
- Check the documentation
- Review troubleshooting section
- Check backend/frontend README files

## 🎯 Future Enhancements

- [ ] Multi-language support
- [ ] Email notifications
- [ ] SMS verification
- [ ] Live results streaming
- [ ] Mobile app (React Native)
- [ ] Blockchain integration for vote verification
- [ ] Enhanced analytics dashboard
- [ ] Biometric fingerprint support
- [ ] Cloud deployment guide
- [ ] Docker containerization

## ⚠️ Important Notes

1. **Change default admin credentials** in production
2. **Use HTTPS** in production
3. **Hash passwords** properly in production
4. **Set up proper database backups**
5. **Configure CORS** appropriately
6. **Set secure SECRET_KEY** in production
7. **Enable rate limiting** for production
8. **Add input sanitization** for production

## 🌟 Acknowledgments

- face_recognition library by Adam Geitgey
- React.js team
- Flask team
- MongoDB team
- Tailwind CSS team
- All open-source contributors

---

**Built with modern web technologies for a secure voting future! 🗳️✨**
