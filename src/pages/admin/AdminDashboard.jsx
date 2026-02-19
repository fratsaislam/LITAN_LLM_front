import React, { useState } from 'react';
import {
    Users,
    Layers,
    FlaskConical,
    BookOpen,
    Download
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
    return (
        <div className="flex h-screen bg-[#0b0f14] text-white">
            <AdminSidebar />

            {/* Main Content */}
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
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Users', value: '33', sub: '+5 this week', icon: Users },
                            { label: 'Conversations', value: '187', sub: '+42 today', icon: Layers }, // Using Layers as placeholder
                            { label: 'Active Experiments', value: '1', sub: '2 completed', icon: FlaskConical },
                            { label: 'Exercises', value: '3', sub: '100% assigned', icon: BookOpen },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#0f1218] border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{stat.label}</span>
                                    <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                                        <stat.icon size={14} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <div className="lg:col-span-2 bg-[#0f1218] border border-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <h3 className="font-semibold text-sm">Daily Activity</h3>
                                </div>
                                <select className="bg-transparent text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none">
                                    <option>last 7 days</option>
                                </select>
                            </div>

                            {/* Dummy Bar Chart */}
                            <div className="h-48 flex items-end justify-between gap-2 px-2">
                                {[25, 35, 30, 45, 50, 15, 12].map((h, i) => (
                                    <div key={i} className="w-full bg-gray-800/50 rounded-t-sm relative group">
                                        <div
                                            className="absolute bottom-0 w-full bg-emerald-400 rounded-t-sm transition-all hover:bg-emerald-300"
                                            style={{ height: `${h * 2}%` }}
                                        ></div>
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
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                <h3 className="font-semibold text-sm">Model Usage</h3>
                            </div>

                            <div className="flex items-center justify-center h-48 relative">
                                {/* CSS Donut approximation */}
                                <div className="w-32 h-32 rounded-full border-[12px] border-emerald-400 border-r-purple-500 border-b-blue-500 transform -rotate-45"></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {/* Inner circle or label can go here */}
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    <span className="text-[10px] text-gray-400">GPT-4</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-[10px] text-gray-400">GPT-3.5</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    <span className="text-[10px] text-gray-400">DeepSeek</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
