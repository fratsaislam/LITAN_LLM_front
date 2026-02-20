import React, { useState, useEffect } from 'react';
import {
    Users,
    MessageSquare,
    Layers,
    BookOpen,
    Download
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../api/axiosInstance';

const StatCard = ({ label, value, sub, icon: Icon, loading }) => (
    <div className="bg-[#0f1218] border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{label}</span>
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <Icon size={14} />
            </div>
        </div>
        {loading ? (
            <div className="animate-pulse space-y-2">
                <div className="h-8 w-16 bg-gray-800 rounded" />
                <div className="h-3 w-24 bg-gray-800/60 rounded" />
            </div>
        ) : (
            <>
                <div className="text-3xl font-bold mb-1">{value ?? '—'}</div>
                <div className="text-xs text-gray-500">{sub}</div>
            </>
        )}
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: null, exercises: null, groups: null, conversations: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real backend endpoints in parallel
                const [usersRes, exercisesRes, groupsRes] = await Promise.allSettled([
                    axiosInstance.get('/api/auth/all-users'),
                    axiosInstance.get('/api/exercises/all'),
                    axiosInstance.get('/api/groups/all'),
                ]);

                setStats({
                    users: usersRes.status === 'fulfilled' ? (usersRes.value.data?.data?.length ?? null) : null,
                    exercises: exercisesRes.status === 'fulfilled' ? (exercisesRes.value.data?.data?.length ?? null) : null,
                    groups: groupsRes.status === 'fulfilled' ? (groupsRes.value.data?.data?.length ?? null) : null,
                    conversations: null, // no admin conversations endpoint yet
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.users, sub: 'Registered accounts', icon: Users },
        { label: 'Conversations', value: stats.conversations, sub: 'All time messages', icon: MessageSquare },
        { label: 'Experiment Groups', value: stats.groups, sub: 'Active experiment groups', icon: Layers },
        { label: 'Exercises', value: stats.exercises, sub: 'Created activities', icon: BookOpen },
    ];

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-[#0b0f14]">
                <header className="px-8 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-emerald-400">Dashboard</h1>
                        <p className="text-gray-400 font-mono text-sm mt-1">system.overview()</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-emerald-500/50 text-sm transition-colors">
                        <Download size={16} />
                        Export Report
                    </button>
                </header>

                <div className="px-8 pb-8 space-y-6">
                    {/* Live Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card, i) => (
                            <StatCard key={i} loading={loading} {...card} />
                        ))}
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bar Chart */}
                        <div className="lg:col-span-2 bg-[#0f1218] border border-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <h3 className="font-semibold text-sm">Daily Activity</h3>
                                </div>
                                <select className="bg-transparent text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none">
                                    <option>last 7 days</option>
                                </select>
                            </div>
                            <div className="h-48 flex items-end justify-between gap-2 px-2">
                                {[25, 35, 30, 45, 50, 15, 12].map((h, i) => (
                                    <div key={i} className="w-full bg-gray-800/50 rounded-t-sm relative group">
                                        <div
                                            className="absolute bottom-0 w-full bg-emerald-400 rounded-t-sm transition-all hover:bg-emerald-300"
                                            style={{ height: `${h * 2}%` }}
                                        />
                                        <div className="absolute -bottom-6 w-full text-center text-[10px] text-gray-500">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <div className="bg-[#0f1218] border border-gray-800 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <h3 className="font-semibold text-sm">Model Usage</h3>
                            </div>
                            <div className="flex items-center justify-center h-48 relative">
                                <div className="w-32 h-32 rounded-full border-[12px] border-emerald-400 border-r-purple-500 border-b-blue-500 transform -rotate-45" />
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                {[['GPT-4', 'bg-emerald-400'], ['GPT-3.5', 'bg-blue-500'], ['DeepSeek', 'bg-purple-500']].map(([name, color]) => (
                                    <div key={name} className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                                        <span className="text-[10px] text-gray-400">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
