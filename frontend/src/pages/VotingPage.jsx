import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Vote, CheckCircle, LogOut, User, Mail, Phone, Award, Home } from 'lucide-react';
import { getCandidates, castVote, checkVotingStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const VotingPage = () => {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useAuth();
  
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Check voting status
      const statusResponse = await checkVotingStatus(user.voter_id);
      setHasVoted(statusResponse.data.has_voted);
      setVotedCandidate(statusResponse.data.voted_candidate);

      // Fetch candidates
      const candidatesResponse = await getCandidates();
      setCandidates(candidatesResponse.data);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setSubmitting(true);

    try {
      const voteData = {
        voter_id: user.voter_id,
        candidate_id: selectedCandidate.candidate_id,
      };

      const response = await castVote(voteData);

      if (response.data.success) {
        toast.success('Vote cast successfully! Thank you for voting.');
        setHasVoted(true);
        updateUser({ has_voted: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to cast vote';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading voting interface..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 px-4">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Vote className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Biometric Voting System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              title="Go to Home"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Voter Information
                  </h3>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Vote className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Voter ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.voter_id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white break-all">{user.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    hasVoted 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  }`}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {hasVoted ? 'Vote Submitted' : 'Ready to Vote'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Voting Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">
                  {hasVoted ? 'Thank You for Voting!' : 'Select Your Candidate'}
                </h2>
                <p className="text-primary-100 mt-1">
                  {hasVoted 
                    ? 'Your vote has been recorded securely' 
                    : 'Choose one candidate from the list below'}
                </p>
              </div>

              {/* Candidates */}
              <div className="p-8">
                {hasVoted ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Vote Successfully Recorded
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      Your vote has been securely submitted and cannot be changed.
                    </p>
                    
                    {/* Display Voted Candidate */}
                    {votedCandidate && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto mb-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border-2 border-primary-200 dark:border-primary-700"
                      >
                        <div className="flex items-center gap-2 justify-center mb-4">
                          <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            You Voted For
                          </h4>
                        </div>
                        
                        {/* Candidate Image */}
                        <div className="mb-4">
                          <img
                            src={votedCandidate.image_url}
                            alt={votedCandidate.name}
                            className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(votedCandidate.name)}&size=200&background=3b82f6&color=fff`;
                            }}
                          />
                        </div>
                        
                        <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {votedCandidate.name}
                        </h5>
                        <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
                          {votedCandidate.party}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {votedCandidate.description}
                        </p>
                      </motion.div>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                    >
                      Exit System
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {candidates.map((candidate, index) => (
                        <motion.div
                          key={candidate.candidate_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSelectedCandidate(candidate)}
                          className={`cursor-pointer rounded-xl border-2 transition-all ${
                            selectedCandidate?.candidate_id === candidate.candidate_id
                              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:shadow-md'
                          }`}
                        >
                          <div className="p-6">
                            {/* Candidate Image */}
                            <div className="flex items-center gap-4 mb-4">
                              <img
                                src={candidate.image_url}
                                alt={candidate.name}
                                className={`w-20 h-20 rounded-full object-cover border-2 ${
                                  selectedCandidate?.candidate_id === candidate.candidate_id
                                    ? 'border-primary-600'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=200&background=3b82f6&color=fff`;
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                  {candidate.name}
                                </h3>
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                                  {candidate.party}
                                </p>
                              </div>
                              {selectedCandidate?.candidate_id === candidate.candidate_id && (
                                <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {candidate.description}
                            </p>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Candidate ID: {candidate.candidate_id}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleVote}
                        disabled={!selectedCandidate || submitting}
                        className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <LoadingSpinner size="sm" text="" />
                            Submitting Vote...
                          </>
                        ) : (
                          <>
                            <Vote className="w-6 h-6" />
                            Cast Your Vote
                          </>
                        )}
                      </button>
                    </div>

                    {selectedCandidate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          <strong>Selected:</strong> {selectedCandidate.name} ({selectedCandidate.party})
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
