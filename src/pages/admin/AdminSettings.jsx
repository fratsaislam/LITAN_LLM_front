import React, { useState, useEffect } from 'react';
import {
    User,
    Lock,
    Bell,
    Monitor,
    Save,
    Shield,
    Mail,
    LogOut,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import axiosInstance from '../../api/axiosInstance';
import { useUserDetails } from '../../hooks/useUserDetails';

const AdminSettings = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUserDetails();
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
        <div className="flex h-screen bg-[#0b0f14] text-white">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-[#0b0f14] custom-scrollbar">
                <header className="px-8 py-10">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-wide">
                        system profile & preferences
                    </p>
                </header>

                <div className="px-8 pb-10 max-w-4xl space-y-8">
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

                    {/* Profile Information */}
                    <section className="bg-[#0d1218]/50 border border-gray-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                        <div className="px-8 py-6 border-b border-gray-800/50 bg-gray-900/20 flex items-center gap-3 text-emerald-400">
                            <User size={20} />
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white">Profile Information</h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
                                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-4xl font-bold overflow-hidden">
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
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="space-y-px">
                                    <h3 className="text-xl font-bold text-white">{user?.username}</h3>
                                    <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest bg-emerald-500/5 inline-block px-3 py-1 rounded-full border border-emerald-500/10">
                                        {user?.role || 'Admin'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">System Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Account Identifier</label>
                                    <input
                                        type="text"
                                        value={user?.anonymizedId || ''}
                                        disabled
                                        className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-3.5 px-4 text-sm text-gray-500 cursor-not-allowed font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-[#0d1218]/50 border border-gray-800/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/20">
                        <div className="px-8 py-6 border-b border-gray-800/50 bg-gray-900/20 flex items-center gap-3 text-emerald-400">
                            <Lock size={20} />
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white">Access & Security</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-200">System Password</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-tight font-mono">ENCRYPTED_SHA256_ACTIVE</p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-xs font-bold text-gray-300 hover:text-white hover:border-emerald-500/50 transition-all flex items-center gap-2 group-hover:bg-emerald-500/5"
                                >
                                    <Shield size={14} className="text-emerald-500" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-all text-sm group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Secure Termination
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className={`flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-sm active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Save size={18} />
                            {loading ? "Syncing..." : "Save All Changes"}
                        </button>
                    </div>
                </div>
            </main>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default AdminSettings;
