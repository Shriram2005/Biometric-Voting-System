# Biometric Voting System - Backend

This is the backend server for the Biometric Face Voting System, built with Flask and MongoDB.

## Prerequisites

- Python 3.8 or higher
- MongoDB (local instance)
- pip (Python package manager)

## Setup Instructions

### 1. Install MongoDB

Download and install MongoDB Community Edition from: https://www.mongodb.com/try/download/community

After installation, start MongoDB:
```bash
mongod
```

MongoDB will run on default port 27017.

### 2. Setup Backend

Run the setup script:
```bash
setup.bat
```

This will:
- Create a Python virtual environment
- Install all required dependencies
- Create .env file from .env.example

### 3. Configure Environment

Edit the `.env` file if needed (optional):
```
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=biometric_voting_system
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Start the Server

```bash
start_server.bat
```

The server will start on http://localhost:5000

## API Endpoints

### User Endpoints
- `POST /api/register` - Register new user with face data
- `POST /api/login` - Login with face recognition
- `GET /api/user/<voter_id>` - Get user details
- `GET /api/candidates` - Get all candidates
- `POST /api/vote` - Cast a vote
- `GET /api/voting-status/<voter_id>` - Check if user has voted

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get voting statistics
- `GET /api/admin/users` - Get all registered users
- `POST /api/admin/candidate` - Add new candidate
- `PUT /api/admin/candidate/<id>` - Update candidate
- `DELETE /api/admin/candidate/<id>` - Delete candidate
- `GET /api/admin/export/csv` - Export results as CSV
- `GET /api/admin/export/pdf` - Export results as PDF

### Health Check
- `GET /api/health` - Check server and database status

## Project Structure

```
backend/
├── app.py                      # Main Flask application
├── config.py                   # Configuration management
├── database.py                 # MongoDB connection and setup
├── face_recognition_service.py # Face recognition logic
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── setup.bat                  # Setup script
├── start_server.bat           # Start server script
└── README.md                  # This file
```

## Dependencies

- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- pymongo - MongoDB driver
- face-recognition - Face recognition library
- opencv-python - Computer vision library
- pandas - Data manipulation
- reportlab - PDF generation

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MONGO_URI in .env file

### Face Recognition Errors
- Ensure good lighting when capturing face images
- Make sure only one face is visible in the frame
- Camera must be working properly

### Import Errors
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

**IMPORTANT:** Change these credentials in production!

## Sample Data

The system automatically creates:
- 4 sample candidates
- 1 admin user

You can add/modify/delete candidates from the admin panel.
