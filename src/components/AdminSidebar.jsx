import React from 'react';
import {
    LayoutDashboard,
    Users,
    Layers,
    FlaskConical,
    BookOpen,
    BarChart,
    Settings,
    LogOut,
    Shield
} from 'lucide-react';
import { useUserDetails } from '../hooks/useUserDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AdminSidebar = () => {
    const { user, loading } = useUserDetails();
    const navigate = useNavigate();
    const location = useLocation();

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

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Groups', icon: Layers, path: '/admin/groups' },

        { name: 'Exercises', icon: BookOpen, path: '/admin/exercises' },
        { name: 'Analytics', icon: BarChart, path: '/admin/analytics' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <aside className="w-72 bg-[#0b0f14] border-r border-gray-800/50 flex flex-col h-screen sticky top-0">
            {/* Logo Section */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Shield size={24} />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">LIT</span>
            </div>

            {/* Navigation Header */}
            <div className="px-8 mt-6 mb-2">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Administration</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                                ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/20'
                                : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/20'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-emerald-400' : 'text-gray-600 group-hover:text-gray-400'} />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-800/50 bg-[#0d1218]/50">
                <div className="flex items-center justify-between gap-3 px-2 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 overflow-hidden flex-shrink-0">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-bold text-sm">
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-200 truncate">
                                {loading ? 'Loading...' : user?.username || 'Admin User'}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                {user?.role || 'admin'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors flex-shrink-0"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
