import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from 'recharts';
import {
  Shield, LogOut, Users, Vote, TrendingUp, Download,
  UserCheck, UserX, Plus, Edit, Trash2, Home, Flag
} from 'lucide-react';
import {
  getAdminStats, getAllUsers, getCandidates, deleteCandidate,
  exportCSV, exportPDF, addCandidate, updateCandidate,
  getParties, addParty, updateParty, deleteParty
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Candidate modals
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    candidate_id: '',
    name: '',
    party_id: '',
    description: '',
    image_url: ''
  });
  
  // Party modals
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [partyForm, setPartyForm] = useState({
    party_id: '',
    name: '',
    abbreviation: '',
    color: '#3b82f6',
    description: '',
    logo_url: '',
    founded_date: ''
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [admin]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, candidatesRes, partiesRes] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getCandidates(),
        getParties(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      
      // Merge candidate data with vote counts from stats
      const candidatesWithVotes = candidatesRes.data.map(candidate => {
        const statData = statsRes.data.candidate_stats.find(
          stat => stat.candidate_id === candidate.candidate_id
        );
        return {
          ...candidate,
          vote_count: statData ? statData.vote_count : 0
        };
      });
      
      setCandidates(candidatesWithVotes);
      setParties(partiesRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleExportCSV = async () => {
    try {
      const response = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `voting_results_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await exportPDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `voting_results_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      await deleteCandidate(candidateId);
      toast.success('Candidate deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete candidate');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await addCandidate(candidateForm);
      toast.success('Candidate added successfully');
      setShowAddCandidateModal(false);
      setCandidateForm({
        candidate_id: '',
        name: '',
        party_id: '',
        description: '',
        image_url: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add candidate');
    }
  };

  const handleEditCandidate = async (e) => {
    e.preventDefault();
    try {
      await updateCandidate(editingCandidate.candidate_id, candidateForm);
      toast.success('Candidate updated successfully');
      setEditingCandidate(null);
      setCandidateForm({
        candidate_id: '',
        name: '',
        party_id: '',
        description: '',
        image_url: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update candidate');
    }
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setCandidateForm({
      candidate_id: candidate.candidate_id,
      name: candidate.name,
      party_id: candidate.party_id,
      description: candidate.description,
      image_url: candidate.image_url || ''
    });
  };

  const closeModals = () => {
    setShowAddCandidateModal(false);
    setEditingCandidate(null);
    setCandidateForm({
      candidate_id: '',
      name: '',
      party_id: '',
      description: '',
      image_url: ''
    });
    setShowAddPartyModal(false);
    setEditingParty(null);
    setPartyForm({
      party_id: '',
      name: '',
      abbreviation: '',
      color: '#3b82f6',
      description: '',
      logo_url: '',
      founded_date: ''
    });
  };
  
  // Party Management Functions
  const handleAddParty = async (e) => {
    e.preventDefault();
    try {
      await addParty(partyForm);
      toast.success('Party added successfully');
      setShowAddPartyModal(false);
      setPartyForm({
        party_id: '',
        name: '',
        abbreviation: '',
        color: '#3b82f6',
        description: '',
        logo_url: '',
        founded_date: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add party');
    }
  };

  const handleEditParty = async (e) => {
    e.preventDefault();
    try {
      await updateParty(editingParty.party_id, partyForm);
      toast.success('Party updated successfully');
      setEditingParty(null);
      setPartyForm({
        party_id: '',
        name: '',
        abbreviation: '',
        color: '#3b82f6',
        description: '',
        logo_url: '',
        founded_date: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update party');
    }
  };

  const openEditPartyModal = (party) => {
    setEditingParty(party);
    setPartyForm({
      party_id: party.party_id,
      name: party.name,
      abbreviation: party.abbreviation,
      color: party.color,
      description: party.description,
      logo_url: party.logo_url || '',
      founded_date: party.founded_date || ''
    });
  };

  const handleDeleteParty = async (partyId) => {
    if (!window.confirm('Are you sure you want to delete this party? All candidates must be removed first.')) {
      return;
    }

    try {
      await deleteParty(partyId);
      toast.success('Party deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete party');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {admin.username}
                </p>
              </div>
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
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            {['overview', 'parties', 'candidates', 'voters'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 font-semibold capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Total Voters"
                value={stats.total_users}
                color="blue"
              />
              <StatCard
                icon={<Vote className="w-8 h-8" />}
                title="Total Votes"
                value={stats.total_votes}
                color="purple"
              />
              <StatCard
                icon={<UserCheck className="w-8 h-8" />}
                title="Voters Participated"
                value={stats.users_voted}
                color="green"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Turnout Rate"
                value={`${stats.turnout_percentage}%`}
                color="orange"
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Vote Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.candidate_stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vote_count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Vote Percentage
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.candidate_stats}
                      dataKey="vote_count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.candidate_stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Detailed Results
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Party
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.candidate_stats.map((candidate, index) => (
                      <tr key={candidate.candidate_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {candidate.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {candidate.party}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {candidate.vote_count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-primary-600">
                            {candidate.percentage}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parties' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Parties
              </h3>
              <button
                onClick={() => setShowAddPartyModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Party
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parties.map((party) => (
                <motion.div
                  key={party.party_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Party Header */}
                  <div 
                    className="h-24 relative"
                    style={{ backgroundColor: party.color }}
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => openEditPartyModal(party)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteParty(party.party_id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <div className="absolute -bottom-8 left-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg"
                        style={{ backgroundColor: party.color }}
                      >
                        {party.abbreviation}
                      </div>
                    </div>
                  </div>
                  
                  {/* Party Info */}
                  <div className="p-6 pt-12">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {party.name}
                      </h4>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                        {party.abbreviation}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {party.description}
                    </p>
                    {party.founded_date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Founded: {new Date(party.founded_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {party.party_id}
                        </span>
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-primary-600" />
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {party.candidate_count || 0} candidates
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Candidates
              </h3>
              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Candidate
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <motion.div
                  key={candidate.candidate_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Candidate Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-500">
                    <img
                      src={candidate.image_url}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&size=400&background=3b82f6&color=fff`;
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(candidate)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.candidate_id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Candidate Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {candidate.name}
                      </h4>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                        {candidate.party}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {candidate.description}
                    </p>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {candidate.candidate_id}
                        </span>
                        <div className="flex items-center gap-2">
                          <Vote className="w-4 h-4 text-primary-600" />
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {candidate.vote_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voters' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Registered Voters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Voter ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.voter_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.voter_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.has_voted ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Voted
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Candidate
              </h3>
            </div>
            <form onSubmit={handleAddCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Candidate ID *
                </label>
                <input
                  type="text"
                  required
                  value={candidateForm.candidate_id}
                  onChange={(e) => setCandidateForm({ ...candidateForm, candidate_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., CAND001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter candidate name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party *
                </label>
                <select
                  required
                  value={candidateForm.party_id}
                  onChange={(e) => setCandidateForm({ ...candidateForm, party_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a party</option>
                  {parties.map((party) => (
                    <option key={party.party_id} value={party.party_id}>
                      {party.name} ({party.abbreviation})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={candidateForm.description}
                  onChange={(e) => setCandidateForm({ ...candidateForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter candidate description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={candidateForm.image_url}
                  onChange={(e) => setCandidateForm({ ...candidateForm, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/image.jpg or leave empty for default"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use default avatar
                </p>
                {/* Image Preview */}
                {candidateForm.image_url && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                    <img
                      src={candidateForm.image_url}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateForm.name || 'User')}&size=200&background=3b82f6&color=fff`;
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                >
                  Add Candidate
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Candidate
              </h3>
            </div>
            <form onSubmit={handleEditCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Candidate ID
                </label>
                <input
                  type="text"
                  disabled
                  value={candidateForm.candidate_id}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party *
                </label>
                <select
                  required
                  value={candidateForm.party_id}
                  onChange={(e) => setCandidateForm({ ...candidateForm, party_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a party</option>
                  {parties.map((party) => (
                    <option key={party.party_id} value={party.party_id}>
                      {party.name} ({party.abbreviation})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={candidateForm.description}
                  onChange={(e) => setCandidateForm({ ...candidateForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={candidateForm.image_url}
                  onChange={(e) => setCandidateForm({ ...candidateForm, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/image.jpg or leave empty for default"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use default avatar
                </p>
                {/* Image Preview */}
                {candidateForm.image_url && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                    <img
                      src={candidateForm.image_url}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateForm.name || 'User')}&size=200&background=3b82f6&color=fff`;
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                >
                  Update Candidate
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Party Modal */}
      {showAddPartyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Party
              </h3>
            </div>
            <form onSubmit={handleAddParty} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party ID *
                </label>
                <input
                  type="text"
                  required
                  value={partyForm.party_id}
                  onChange={(e) => setPartyForm({ ...partyForm, party_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., PARTY001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party Name *
                </label>
                <input
                  type="text"
                  required
                  value={partyForm.name}
                  onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter party name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Abbreviation *
                </label>
                <input
                  type="text"
                  required
                  value={partyForm.abbreviation}
                  onChange={(e) => setPartyForm({ ...partyForm, abbreviation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., PP"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party Color *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    required
                    value={partyForm.color}
                    onChange={(e) => setPartyForm({ ...partyForm, color: e.target.value })}
                    className="h-12 w-20 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={partyForm.color}
                    onChange={(e) => setPartyForm({ ...partyForm, color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="#3b82f6"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={partyForm.description}
                  onChange={(e) => setPartyForm({ ...partyForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter party description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Founded Date
                </label>
                <input
                  type="date"
                  value={partyForm.founded_date}
                  onChange={(e) => setPartyForm({ ...partyForm, founded_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={partyForm.logo_url}
                  onChange={(e) => setPartyForm({ ...partyForm, logo_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                >
                  Add Party
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Party Modal */}
      {editingParty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Party
              </h3>
            </div>
            <form onSubmit={handleEditParty} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party ID
                </label>
                <input
                  type="text"
                  disabled
                  value={partyForm.party_id}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party Name *
                </label>
                <input
                  type="text"
                  required
                  value={partyForm.name}
                  onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Abbreviation *
                </label>
                <input
                  type="text"
                  required
                  value={partyForm.abbreviation}
                  onChange={(e) => setPartyForm({ ...partyForm, abbreviation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Party Color *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    required
                    value={partyForm.color}
                    onChange={(e) => setPartyForm({ ...partyForm, color: e.target.value })}
                    className="h-12 w-20 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={partyForm.color}
                    onChange={(e) => setPartyForm({ ...partyForm, color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={partyForm.description}
                  onChange={(e) => setPartyForm({ ...partyForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Founded Date
                </label>
                <input
                  type="date"
                  value={partyForm.founded_date}
                  onChange={(e) => setPartyForm({ ...partyForm, founded_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={partyForm.logo_url}
                  onChange={(e) => setPartyForm({ ...partyForm, logo_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                >
                  Update Party
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
