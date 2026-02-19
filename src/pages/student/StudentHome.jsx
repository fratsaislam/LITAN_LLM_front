import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { MessageSquare, BookOpen, Clock, Settings, ArrowRight, Zap, Trophy, Target } from "lucide-react";
import { useUserDetails } from "../../hooks/useUserDetails";

const StudentHome = () => {
    const navigate = useNavigate();
    const { user, loading } = useUserDetails();

    const stats = [
        { label: "Active Exercises", value: "2", icon: Target, color: "text-emerald-400" },
        { label: "Hours Learned", value: "12.5", icon: Clock, color: "text-blue-400" },
        { label: "AI Interactions", value: "154", icon: Zap, color: "text-amber-400" },
        { label: "XP Points", value: "2,450", icon: Trophy, color: "text-purple-400" },
    ];

    const recentActivity = [
        { id: 1, action: "Finished 'Photosynthesis' exercise", time: "2 hours ago", type: "exercise" },
        { id: 2, action: "Started new chat with GPT-4", time: "5 hours ago", type: "chat" },
        { id: 3, action: "Updated profile settings", time: "Yesterday", type: "settings" },
    ];

    return (
        <Layout>
            <div className="p-12 space-y-12 bg-[#0b0d12] min-h-full relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                {/* Welcome Header */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        SYSTEM_ACTIVE: SESSION_STABLE
                    </div>
                    <h1 className="text-5xl font-bold text-white tracking-tight">
                        Welcome back, <span className="text-emerald-400">{loading ? "..." : (user?.username || "Alice")}</span>
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-2xl text-lg">
                        Your personalized AI learning environment is ready. Continue your progress or explore new exercises.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#0f1218] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition shadow-xl group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg bg-gray-900 border border-gray-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    {/* Main Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            Quick Navigation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "AI Chat", desc: "Interactive learning with advanced models", icon: MessageSquare, path: "/chat", color: "from-emerald-500 to-teal-500" },
                                { title: "Exercises", desc: "Structured assignments and challenges", icon: BookOpen, path: "/exercises", color: "from-blue-500 to-indigo-500" },
                                { title: "History", desc: "Review your past conversations", icon: Clock, path: "/history", color: "from-purple-500 to-pink-500" },
                                { title: "Account", desc: "Manage your profile and security", icon: Settings, path: "/settings", color: "from-gray-700 to-gray-800" },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className="group relative flex flex-col p-8 rounded-3xl bg-[#0f1218] border border-gray-800 text-left hover:border-emerald-500/50 transition-all duration-300 overflow-hidden shadow-2xl"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
                                    <div className={`w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300`}>
                                        <action.icon className="text-gray-300 group-hover:text-emerald-400 transition-colors" size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">{action.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{action.desc}</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        OPEN MODULE <ArrowRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Side Sidebar: Recent Activity */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                            Recent Activity
                        </h3>
                        <div className="bg-[#0f1218]/50 border border-gray-800 rounded-3xl p-8 space-y-8">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-4 relative">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0 z-10" />
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-200 leading-snug">{activity.action}</p>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-4 text-xs font-bold text-gray-500 hover:text-emerald-400 border-t border-gray-800/50 transition-colors uppercase tracking-widest pt-8">
                                View Full Activity Log
                            </button>
                        </div>

                        {/* Tip Card */}
                        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                            <h4 className="text-sm font-bold text-emerald-400 mb-2">Pro Tip</h4>
                            <p className="text-xs text-emerald-50/60 leading-relaxed italic">
                                "Try using the 'Creative Story Writing' module with GPT-4 for the best interactive narrative experience."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentHome;
