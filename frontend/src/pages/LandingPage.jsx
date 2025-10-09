import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Vote, Shield, Users, CheckCircle, ArrowRight, Fingerprint } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const features = [
    {
      icon: <Fingerprint className="w-12 h-12" />,
      title: 'Biometric Authentication',
      description: 'Secure face recognition technology ensures only registered voters can access the system.',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'One Vote Per Person',
      description: 'Advanced face matching prevents duplicate voting and ensures election integrity.',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Easy Registration',
      description: 'Simple and quick voter registration with face capture and basic information.',
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Transparent Results',
      description: 'Real-time vote tracking and comprehensive admin dashboard for monitoring.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Vote className="w-10 h-10 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Biometric Voting System
            </h1>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Secure Voting with
              <span className="text-primary-600"> Face Recognition</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Experience the future of democratic voting with our advanced biometric authentication system.
              One face, one vote - ensuring transparency and security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2"
                >
                  Register to Vote
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 border-2 border-primary-600 rounded-lg font-semibold text-lg shadow-lg"
                >
                  Login to Vote
                </motion.button>
              </Link>
            </div>

            <div className="mt-8">
              <Link to="/admin">
                <button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                  Admin Login →
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our System?
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h3>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Register',
                description: 'Create your voter profile with face capture and personal details.',
              },
              {
                step: '2',
                title: 'Authenticate',
                description: 'Login using face recognition - no passwords needed.',
              },
              {
                step: '3',
                title: 'Vote',
                description: 'Choose your candidate and cast your vote securely.',
              },
              {
                step: '4',
                title: 'Verify',
                description: 'System ensures you can vote only once using face matching.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Biometric Voting System. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Secure • Transparent • Democratic
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
