import React, { useState, useEffect } from 'react';
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Mail,
    Phone,
    User as UserIcon,
    Shield
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, groupsRes] = await Promise.all([
                    axiosInstance.get('/auth/all-users'),
                    axiosInstance.get('/groups/all'),
                ]);
                if (usersRes.data.success) setUsers(usersRes.data.data);
                if (groupsRes.data.success) setGroups(groupsRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const response = await axiosInstance.patch(`/auth/update-user-role?_id=${userId}`, { role: newRole });
            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update user role");
        }
    };

    const handleGroupAssign = async (userId, groupId) => {
        try {
            const response = await axiosInstance.post('/groups/assign-user', { userId, groupId });
            if (response.data.success) {
                const groupName = groups.find(g => g._id === groupId)?.name || null;
                setUsers(users.map(u => u._id === userId ? { ...u, groupIdValue: groupId, groupName } : u));
            }
        } catch (error) {
            console.error("Error assigning group:", error);
            alert("Failed to assign user to group");
        }
    };

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0b0f14] custom-scrollbar">
                <header className="px-8 py-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                Users
                            </h1>
                            <p className="text-gray-500 font-mono text-xs mt-2 tracking-wide uppercase">
                                manage user accounts & assignments
                            </p>
                        </div>
                        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10">
                            <UserPlus size={18} />
                            Add User
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-[#0d1218] border border-gray-800/50 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/50 focus:bg-[#0f151c] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="px-8 pb-10">
                    <div className="bg-[#0d1218]/50 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800/50 bg-gray-900/20">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[40%]">User</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Group</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right pr-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-50">
                                                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                                                <p className="text-xs font-mono uppercase tracking-widest">Accessing records...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center opacity-40">
                                            <p className="text-sm font-medium">No system records found matching your query</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 overflow-hidden flex-shrink-0">
                                                        {user.profilePic ? (
                                                            <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="font-bold text-base">{user.username?.charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-200 truncate group-hover:text-emerald-400 transition-colors">
                                                            {user.username}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                                                            <Mail size={12} className="opacity-50" />
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <select
                                                    value={user.role || 'user'}
                                                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                    className={`appearance-none bg-[#161b22] border border-gray-800 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-emerald-500/50 transition-all cursor-pointer ${user.role === 'admin' ? 'text-emerald-400' : 'text-gray-500'
                                                        }`}
                                                >
                                                    <option value="user">USER</option>
                                                    <option value="admin">ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-5">
                                                <select
                                                    value={user.groupIdValue || ''}
                                                    onChange={(e) => handleGroupAssign(user._id, e.target.value)}
                                                    className="appearance-none bg-[#161b22] border border-gray-800 rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-emerald-500/50 transition-all cursor-pointer text-gray-400 max-w-[140px]"
                                                >
                                                    <option value="">No Group</option>
                                                    {groups.map(g => (
                                                        <option key={g._id} value={g._id}>{g.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-5 text-right pr-10">
                                                <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
