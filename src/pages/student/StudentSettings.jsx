import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { User, Lock, Bell, Moon, Sun, Save, Shield, Mail, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUserDetails } from '../../hooks/useUserDetails';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const StudentSettings = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUserDetails();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setPreviewUrl(user.profilePic || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('phone', formData.phone);
      if (profilePic) {
        data.append('profilePic', profilePic);
      }

      const response = await axiosInstance.patch('/auth/change-information', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        // Refresh to reload data and token
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/signout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-[#0b0d12] relative z-0 custom-scrollbar">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-4xl mx-auto p-12 relative z-10 space-y-10">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your profile and account preferences</p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-[#0f1218] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 bg-[#161b22]/50 flex items-center gap-3">
              <User className="text-emerald-400" size={20} />
              <h2 className="font-semibold text-white">Profile Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => document.getElementById('student-avatar-upload').click()}
                >
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl font-bold overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      userLoading ? '...' : (user?.username?.charAt(0).toUpperCase())
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase font-bold text-white">Change</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="student-avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <button
                    onClick={() => document.getElementById('student-avatar-upload').click()}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white transition"
                  >
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account Identifier</label>
                  <input
                    type="text"
                    value={user?.anonymizedId || ''}
                    disabled
                    className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-[#0f1218] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 bg-[#161b22]/50 flex items-center gap-3">
              <Lock className="text-emerald-400" size={20} />
              <h2 className="font-semibold text-white">Security</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-200">Password</p>
                  <p className="text-xs text-gray-500 uppercase tracking-tight font-mono">ENCRYPTED_SHA256_ACTIVE</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-emerald-500 transition"
                >
                  Update Password
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-gray-800 pt-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="text-emerald-400" size={14} />
                    <p className="text-sm font-medium text-gray-200">Two-Factor Authentication</p>
                  </div>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/10 transition">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-2 gap-6">
            {/* Notifications */}
            <div className="bg-[#0f1218] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-800 bg-[#161b22]/50 flex items-center gap-3">
                <Bell className="text-emerald-400" size={20} />
                <h2 className="font-semibold text-white">Notifications</h2>
              </div>
              <div className="p-8 flex items-center justify-between">
                <span className="text-sm text-gray-300">Email Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-[#0f1218] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-800 bg-[#161b22]/50 flex items-center gap-3">
                {theme === 'dark' ? <Moon className="text-emerald-400" size={20} /> : <Sun className="text-emerald-400" size={20} />}
                <h2 className="font-semibold text-white">Appearance</h2>
              </div>
              <div className="p-8 flex items-center justify-between">
                <span className="text-sm text-gray-300">Theme</span>
                <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-1.5 rounded-md transition ${theme === 'light' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
                  >
                    <Sun size={14} />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-md transition ${theme === 'dark' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
                  >
                    <Moon size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Footer */}
          <div className="flex justify-end items-center gap-4 pt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/5"
            >
              <LogOut size={20} />
              Sign Out
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save size={20} />
              {loading ? "Syncing..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </Layout>
  );
};

export default StudentSettings;