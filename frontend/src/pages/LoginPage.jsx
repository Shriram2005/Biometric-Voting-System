import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, LogIn, ArrowLeft, Scan, User } from 'lucide-react';
import { loginUser, verifyFace } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const { loginAsUser } = useAuth();
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  // Live face verification while camera is active
  useEffect(() => {
    let intervalId;
    
    if (showCamera && webcamRef.current && !isVerifying) {
      // Check every 2 seconds for a face
      intervalId = setInterval(async () => {
        try {
          const imageSrc = webcamRef.current?.getScreenshot();
          if (!imageSrc) return;
          
          setIsVerifying(true);
          const response = await verifyFace(imageSrc);
          
          if (response.data.recognized) {
            setRecognizedUser(response.data);
          } else {
            setRecognizedUser(null);
          }
          
          setIsVerifying(false);
        } catch (error) {
          setIsVerifying(false);
          setRecognizedUser(null);
        }
      }, 2000); // Check every 2 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showCamera]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    setRecognizedUser(null);
    toast.success('Photo captured! Processing...');
    handleLogin(imageSrc);
  }, [webcamRef]);

  const handleLogin = async (faceImage) => {
    setLoading(true);

    try {
      const response = await loginUser(faceImage);

      if (response.data.success) {
        const userData = response.data.user;
        loginAsUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        
        // Navigate to voting page
        setTimeout(() => {
          navigate('/vote');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
      setCapturedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <div className="flex justify-between items-center">
          <Link to="/">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <LogIn className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Face Login</h2>
            </div>
            <p className="text-primary-100 mt-2">Authenticate with face recognition</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {!showCamera && !capturedImage && !loading && (
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <Scan className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ready to Login?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click below to capture your face and login securely
                  </p>
                </div>

                <button
                  onClick={() => setShowCamera(true)}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  Start Face Recognition
                </button>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {showCamera && !capturedImage && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  {recognizedUser ? (
                    <div className="space-y-2">
                      <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                        ✓ Face recognized: {recognizedUser.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Click "Capture & Login" to authenticate
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Position your face in the center of the frame
                    </p>
                  )}
                </div>
                
                <div className="relative rounded-lg overflow-hidden border-4 border-primary-500 camera-frame">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full"
                  />
                  
                  {/* Live Recognition Overlay */}
                  {recognizedUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-10"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-semibold">{recognizedUser.name}</span>
                      <span className="text-sm opacity-90">({Math.round(recognizedUser.confidence * 100)}%)</span>
                    </motion.div>
                  )}
                  
                  {/* Verifying Indicator */}
                  {isVerifying && !recognizedUser && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Scanning...
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={capturePhoto}
                    disabled={loading}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5" />
                    Capture & Login
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="py-12">
                <LoadingSpinner size="lg" text="Authenticating your face..." />
              </div>
            )}

            {capturedImage && !loading && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-4 border-primary-500">
                  <img src={capturedImage} alt="Captured" className="w-full" />
                </div>
                <button
                  onClick={retakePhoto}
                  className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-6"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            🔒 Secure Face Authentication
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✓ Your face data is securely encrypted</li>
            <li>✓ One-time voting is enforced</li>
            <li>✓ No passwords to remember</li>
            <li>✓ Quick and convenient access</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
