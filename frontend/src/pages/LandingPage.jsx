import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Vote, Shield, Users, CheckCircle, ArrowRight, Fingerprint, 
  Lock, Eye, Clock, BarChart3, Zap, TrendingUp, Award,
  Server, Wifi, Database, FileCheck, UserCheck, Globe
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const features = [
    {
      icon: <Fingerprint className="w-12 h-12" />,
      title: 'Biometric Authentication',
      description: 'Secure face recognition technology ensures only registered voters can access the system.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'One Vote Per Person',
      description: 'Advanced face matching prevents duplicate voting and ensures election integrity.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Easy Registration',
      description: 'Simple and quick voter registration with face capture and basic information.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Transparent Results',
      description: 'Real-time vote tracking and comprehensive admin dashboard for monitoring.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption and secure data storage protect voter privacy.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Lightning Fast',
      description: 'Face recognition in under 2 seconds with instant vote confirmation.',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const stats = [
    { number: '99.9%', label: 'Accuracy Rate', icon: <Award className="w-6 h-6" /> },
    { number: '<2s', label: 'Recognition Time', icon: <Clock className="w-6 h-6" /> },
    { number: '100%', label: 'Security', icon: <Shield className="w-6 h-6" /> },
    { number: '24/7', label: 'Availability', icon: <Server className="w-6 h-6" /> },
  ];

  const benefits = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'No More Voter Fraud',
      description: 'Eliminate impersonation and duplicate voting with facial biometrics'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Save Time',
      description: 'No long queues or manual verification - vote in seconds'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Track voter turnout and results as they happen'
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: 'Offline Capable',
      description: 'Works without internet - perfect for remote locations'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Secure Storage',
      description: 'Encrypted database with automatic backups'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: 'Easy Verification',
      description: 'Instant identity verification with face matching'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Biometric Voting System
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Secure • Transparent • Democratic</p>
            </div>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                  🚀 Next-Gen Voting Technology
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Vote with Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Face, Not Your ID
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Experience the future of democratic voting with our advanced biometric authentication system.
                Secure, fast, and transparent - one face, one vote.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 group"
                  >
                    Register to Vote
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 border-2 border-primary-600 rounded-xl font-semibold text-lg shadow-lg"
                  >
                    Login to Vote
                  </motion.button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link to="/admin">
                  <button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Portal →
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Fingerprint className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Face Recognition</p>
                        <p className="text-white text-2xl font-bold">Active</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2 text-white/80">
                          {stat.icon}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.number}</p>
                        <p className="text-white/70 text-sm">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4"
                >
                  <Shield className="w-8 h-8 text-primary-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800/50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold mb-4"
            >
              ✨ Powerful Features
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our System?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure secure, fast, and transparent elections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-4"
            >
              💎 Key Benefits
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Revolutionize Your Elections
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for modern, secure, and efficient voting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-4"
            >
              📋 Simple Process
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Four simple steps to cast your secure vote
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Register Your Profile',
                description: 'Create your voter profile with face capture, name, email, and personal details. Our system captures your unique facial features.',
                icon: <UserCheck className="w-6 h-6" />,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                title: 'Face Authentication',
                description: 'Login using face recognition - no passwords needed. Our AI matches your face with 99.9% accuracy in under 2 seconds.',
                icon: <Fingerprint className="w-6 h-6" />,
                color: 'from-green-500 to-emerald-500'
              },
              {
                step: '3',
                title: 'Cast Your Vote',
                description: 'Browse candidates, review their profiles, and choose your preferred candidate. Confirm your choice with a single click.',
                icon: <Vote className="w-6 h-6" />,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '4',
                title: 'Secure Verification',
                description: 'System ensures you can vote only once using face matching. Your vote is encrypted and stored securely in the database.',
                icon: <CheckCircle className="w-6 h-6" />,
                color: 'from-orange-500 to-red-500'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-start gap-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="text-primary-600 dark:text-primary-400">
                        {item.icon}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-primary-400 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4"
            >
              🔧 Technology
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Advanced Tech
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with industry-leading technologies for maximum reliability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React.js', desc: 'Modern UI', icon: '⚛️' },
              { name: 'Python Flask', desc: 'Backend API', icon: '🐍' },
              { name: 'MongoDB', desc: 'Database', icon: '🍃' },
              { name: 'Face Recognition', desc: 'AI/ML', icon: '🤖' },
              { name: 'OpenCV', desc: 'Computer Vision', icon: '👁️' },
              { name: 'Tailwind CSS', desc: 'Styling', icon: '🎨' },
              { name: 'Framer Motion', desc: 'Animations', icon: '✨' },
              { name: 'Recharts', desc: 'Analytics', icon: '📊' },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {tech.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10 text-center text-white">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Experience the Future of Voting?
              </h3>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of voters using secure biometric authentication
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Get Started Now
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white/10 backdrop-blur-lg text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    Already Registered?
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Biometric Voting System</h3>
                  <p className="text-gray-400 text-sm">Secure • Transparent • Democratic</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing elections with advanced face recognition technology. 
                Ensuring every vote counts while maintaining the highest security standards.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Shield className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Lock className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                    Register to Vote
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Biometric Voting System. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  SSL Secured
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  Encrypted
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  GDPR Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
