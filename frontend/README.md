# Biometric Voting System - Frontend

Modern, responsive React.js frontend for the Biometric Face Voting System with dark/light theme support.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

Run the setup script:
```bash
setup.bat
```

This will install all required npm packages.

### 2. Start Development Server

```bash
start_frontend.bat
```

Or use npm directly:
```bash
npm run dev
```

The app will open automatically at http://localhost:3000

### 3. Build for Production

```bash
npm run build
```

Production files will be in the `dist` folder.

## Features

### User Features
- 🎨 Beautiful landing page with feature showcase
- 📝 Face registration with webcam capture
- 🔐 Secure face recognition login
- 🗳️ Intuitive voting interface
- ✅ Real-time vote confirmation
- 🌓 Dark/light theme toggle
- 📱 Fully responsive design

### Admin Features
- 📊 Comprehensive dashboard with statistics
- 📈 Interactive charts (bar charts, pie charts)
- 👥 Voter management
- 🎯 Candidate management (add/edit/delete)
- 📥 Export results (CSV/PDF)
- 📋 Detailed results table

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── ThemeToggle.jsx
│   │   └── LoadingSpinner.jsx
│   ├── context/         # React context providers
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── LandingPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── VotingPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Webcam** - Camera access
- **React Hot Toast** - Notifications
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **Vite** - Build tool

## Configuration

The frontend is configured to connect to the backend at:
```
http://localhost:5000/api
```

If your backend runs on a different port, update the API base URL in:
```
src/services/api.js
```

## Theme Support

The app supports both light and dark themes:
- Toggle button in the header
- Persistent theme selection (saved to localStorage)
- Smooth transitions between themes
- Optimized colors for both modes

## Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## Camera Permissions

The app requires camera access for:
- Face registration
- Face recognition login

Make sure to allow camera permissions when prompted by the browser.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port.

### Camera Not Working
- Check browser permissions
- Ensure camera is not being used by another application
- Try using HTTPS (some browsers require it for camera access)

### Build Errors
```bash
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Backend Connection Issues
- Ensure backend server is running on port 5000
- Check CORS settings in backend
- Verify API endpoint URLs in `src/services/api.js`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Performance

- Lazy loading for routes
- Optimized bundle size
- Fast refresh during development
- Production-optimized builds
