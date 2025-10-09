import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, UserPlus, ArrowLeft, Check } from 'lucide-react';
import { registerUser } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [formData, setFormData] = useState({
    voter_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
  });
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
    toast.success('Photo captured successfully!');
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!capturedImage) {
      toast.error('Please capture your photo');
      return;
    }

    // Validate required fields
    const requiredFields = ['voter_id', 'name', 'email', 'phone', 'address'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        ...formData,
        face_image: capturedImage,
      };

      const response = await registerUser(registrationData);

      if (response.data.success) {
        toast.success('Registration successful! You can now login to vote.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Voter Registration</h2>
            </div>
            <p className="text-primary-100 mt-2">Register to exercise your right to vote</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Voter ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voter ID *
                </label>
                <input
                  type="text"
                  name="voter_id"
                  value={formData.voter_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., VID001"
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1234567890"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="18"
                  min="18"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full address"
                  required
                />
              </div>
            </div>

            {/* Face Capture Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Face Capture *
              </h3>

              {!showCamera && !capturedImage && (
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600"
                >
                  <Camera className="w-6 h-6" />
                  <span className="font-medium">Click to Capture Face Photo</span>
                </button>
              )}

              {showCamera && !capturedImage && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-4 border-primary-500">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCamera(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-4 border-green-500">
                    <img src={capturedImage} alt="Captured" className="w-full" />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-semibold">Captured</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Register
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already registered?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
